
import { mockNextRound, Player } from '.';
import { UIController } from '../UIController';

export type RoundType = 'TEXT' | 'PICTURE';
export type Phase = 'CREATE' | 'SHOW' | 'LOBBY';

// web socket lives here
export default class Session {
  private playerIndex = 0; // numerical index on game start
  private numRounds = 0;
  private round = 0;
  private showingPath = 0;
  private phase: Phase = 'LOBBY';
  private ui: UIController;
  private waiting = false;
  private readonly texts: string[][] = []; // [round/2][path]
  private readonly pictures: string[][] = []; // [round-1/2][path]
  private roundPaths: number[][] = []; // [round][player] = path
  public readonly players: Player[];

  constructor(uiController: UIController, players: Player[]) {
    this.ui = uiController;
    this.players = players;
  }

  public startGame(playerIndex: number, numRounds: number, roundPaths: number[][]) {
    this.playerIndex = playerIndex;
    this.numRounds = this.players.length;
    this.roundPaths = roundPaths;
    this.phase = 'CREATE';
    for (let i = 0; i < numRounds; i++) {
      if (i % 2 === 0) {
        this.texts[i / 2] = new Array(Math.ceil(numRounds / 2));
      } else {
        this.pictures[(i - 1) / 2] = new Array(Math.floor(numRounds / 2));
      }
    }
  }

  public get roundType(): RoundType {
    return this.round % 2 === 0 ? 'TEXT' : 'PICTURE';
  }

  public get currentPhase() {
    return this.phase;
  }

  public submitOwnText(text: string) {
    this.waiting = true;
    this.ui.showWaiting();
    this.submitText(this.playerIndex, text);
  }

  public submitText(player: number, text: string) {
    this.texts[this.round / 2][this.roundPaths[this.round][player]] = text;
    for (let i = 0; i < this.numRounds ; i++) {
      if(this.texts[this.round / 2][i] == undefined) {
        return;
      }
    }
    this.nextRound();
    mockNextRound();
  }

  public submitOwnPicture(picture: string) {
    this.waiting = true;
    this.ui.showWaiting();
    this.submitPicture(this.playerIndex, picture);
  }

  public submitPicture(player: number, picture: string) {
    this.pictures[(this.round - 1) / 2][this.roundPaths[this.round][player]] = picture;
    for (let i = 0; i < this.pictures[0].length ; i++) {
      if(this.pictures[(this.round - 1) / 2][i] == undefined) {
        return;
      }
    }
    this.nextRound();
    mockNextRound();
  }

  public nextRound() {
    console.log('next round')
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
      console.log(this.round , this.numRounds)
      if (++this.round === this.numRounds) {
        this.round = 0;
        console.log('clearing showcase...')
        this.ui.clearShowcase();
        if (++this.showingPath===this.numRounds) {
          this.ui.showTextArea();
          this.phase = 'CREATE';
          this.ui.displayPhase('CREATE');
          return;
        }
      }
      console.log('showcasing')
      if (this.round % 2 === 0) {
        this.ui.showcaseText(this.texts[this.round / 2][this.showingPath]);
      } else {
        this.ui.showcasePicture(this.pictures[(this.round - 1) / 2][this.showingPath]);
      }
    }
  }
}