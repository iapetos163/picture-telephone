import Session from '.';
import { Player, RoundType, Phase } from '..';
import EventBus from '../EventBus';
import { EventType, SubmitData } from '../events';
import { UIController } from '../../UIController';

// web socket lives here
export default class ActiveSession extends Session {
  private readonly numRounds: number;
  private readonly playerIndex: number;
  private readonly texts: string[][] = []; // [round/2][path]
  private readonly pictures: string[][] = []; // [round-1/2][path]
  private readonly roundPaths: number[][]; // [round][player] = path
  private round = 0;
  private showingPath = 0;
  protected phase: Phase;
  public waiting = false;

  constructor(uiController: UIController, roomCode: string, playerID: string, players: Player[], bus: EventBus<EventType>, roundPaths: number[][]) {
    super(uiController, roomCode, playerID, players, bus);

    const playerIndex = this.players.findIndex(p => p.id === this.playerID)
    this.playerIndex = playerIndex;
    this.numRounds = this.players.length;
    this.roundPaths = roundPaths;
    this.phase = 'CREATE';

    this.bus.subscribe<SubmitData>('SUBMIT', ({ playerIndex, type, data }) => {
      if (type === 'TEXT') {
        this.onSubmitText(playerIndex, data);
      } else {
        this.onSubmitPicture(playerIndex, data);
      }
    })

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

  private onSubmitText(player: number, text: string) {
    this.texts[this.round / 2][this.roundPaths[this.round][player]] = text;
    for (let i = 0; i < this.numRounds ; i++) {
      if(this.texts[this.round / 2][i] == undefined) {
        return;
      }
    }
    this.nextRound();
  }

  private onSubmitPicture(player: number, picture: string) {
    this.pictures[(this.round - 1) / 2][this.roundPaths[this.round][player]] = picture;
    for (let i = 0; i < this.pictures[0].length ; i++) {
      if(this.pictures[(this.round - 1) / 2][i] == undefined) {
        return;
      }
    }
    this.nextRound();
  }

  public nextRound() {
    this.waiting = false;
    this.ui.showDoneButton();
    if (this.phase === 'CREATE') {
      if (++this.round === this.numRounds) {
        this.round = 0;
        this.showingPath = 0;
        this.ui.showcaseText(this.texts[0][0]);
        this.phase = 'SHOW';
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
          this.ui.showTextArea();
          this.phase = 'CREATE';
          this.ui.displayPhase('CREATE');
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
}