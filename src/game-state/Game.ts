import { RoundType, Phase } from '.';
import EventBus, { Subscription } from './EventBus';
import { EventType, NextData, SubmitData } from './events';
import { UIController } from '../UIController';

const ERR_NEXT = new Error('Received NEXT message outside of SHOW phase');

/**
 * Represents one Game within a session
 */
export default class Game {
  private readonly bus: EventBus<EventType>;
  private readonly ui: UIController;

  private readonly numRounds: number;
  private readonly playerIndex: number;
  private readonly texts: string[][] = []; // [round/2][path]
  private readonly pictures: string[][] = []; // [round-1/2][path]
  private readonly roundPaths: number[][]; // [round][player] = path
  private readonly onFinished: () => void;
  private readonly submitSubscription: Subscription;
  private readonly nextSubscription: Subscription;
  private round = 0;
  private showingPath = 0;
  private _phase: Phase;
  private waiting = false;

  constructor(uiController: UIController, bus: EventBus<EventType>, playerIndex: number, roundPaths: number[][], onFinished: () => void) {
    this.ui = uiController;
    this.bus = bus;
    this.playerIndex = playerIndex;
    this.numRounds = roundPaths.length;
    this.roundPaths = roundPaths;
    this.onFinished = onFinished;
    this._phase = 'CREATE';

    this.submitSubscription = this.bus.subscribe<SubmitData>('SUBMIT', ({ playerIndex, type, data }) => {
      if (type === 'TEXT') {
        this.onSubmitText(playerIndex, data);
      } else {
        this.onSubmitPicture(playerIndex, data);
      }
    })

    this.nextSubscription = this.bus.subscribe('NEXT', () => {
      if (this._phase !== 'SHOW') throw ERR_NEXT;
      this.onNextRound();
    });

    for (let i = 0; i < this.numRounds; i++) {
      if (i % 2 === 0) {
        this.texts[i / 2] = new Array(Math.ceil(this.numRounds / 2));
      } else {
        this.pictures[(i - 1) / 2] = new Array(Math.floor(this.numRounds / 2));
      }
    }
    this.ui.displayPhase('CREATE');
  }

  public get roundType(): RoundType {
    return this.round % 2 === 0 ? 'TEXT' : 'PICTURE';
  }

  public showNext() {
    this.bus.publish<NextData>('NEXT', null);
  }

  public submitText(text: string) {
    this.waiting = true;
    this.ui.showWaiting();
    this.bus.publish<SubmitData>('SUBMIT', {
      playerIndex: this.playerIndex,
      type: 'TEXT',
      data: text,
    });
  }

  public submitPicture(picture: string) {
    this.waiting = true;
    this.ui.showWaiting();
    this.bus.publish<SubmitData>('SUBMIT', {
      playerIndex: this.playerIndex,
      type: 'PICTURE',
      data: picture,
    });
  }

  public get phase() {
    return this._phase;
  }

  private onSubmitText(player: number, text: string) {
    this.texts[this.round / 2][this.roundPaths[this.round][player]] = text;
    for (let i = 0; i < this.numRounds ; i++) {
      if(this.texts[this.round / 2][i] == undefined) {
        return;
      }
    }
    this.onNextRound();
  }

  private onSubmitPicture(player: number, picture: string) {
    this.pictures[(this.round - 1) / 2][this.roundPaths[this.round][player]] = picture;
    for (let i = 0; i < this.numRounds ; i++) {
      if(this.pictures[(this.round - 1) / 2][i] == undefined) {
        return;
      }
    }
    this.onNextRound();
  }

  private onNextRound() {
    this.waiting = false;
    this.ui.showDoneButton();
    if (this._phase === 'CREATE') {
      if (++this.round === this.numRounds) {
        this.round = 0;
        this.showingPath = 0;
        this.ui.showcaseText(this.texts[0][0]);
        this._phase = 'SHOW';
        this.ui.displayPhase('SHOW');
      } else if (this.round % 2 === 0) {
        if (this.round > 0) {
          this.ui.showTextArea(this.pictures[(this.round - 2) / 2][this.roundPaths[this.round][this.playerIndex]]);
        } else {
          this.ui.showTextArea();
        }
      } else {
        if (this.round > 0) {
          this.ui.showCanvas(this.texts[(this.round - 1) / 2][this.roundPaths[this.round][this.playerIndex]]);
        } else {
          this.ui.showCanvas();
        }
      }
    } else {
      if (++this.round === this.numRounds) {
        this.round = 0;
        this.ui.clearShowcase();
        if (++this.showingPath===this.numRounds) {
          this.tearDown();
          return;
        }
      }
      if (this.round % 2 === 0) {
        this.ui.showcaseText(this.texts[this.round / 2][this.showingPath]);
      } else {
        this.ui.showcasePicture(this.pictures[(this.round - 1) / 2][this.showingPath]);
      }
    }
  }

  private tearDown() {
    this.bus.unsubscribe('SUBMIT', this.submitSubscription);
    this.bus.unsubscribe('NEXT', this.nextSubscription);
    this.onFinished();
  }
}