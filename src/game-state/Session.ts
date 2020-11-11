
import { mockNextRound } from '.';
import { displayPhase, showCanvas, showcasePicture, showcaseText, showDoneButton, showTextArea, showWaiting } from '../ui';

export type RoundType = 'TEXT' | 'PICTURE';
export type Phase = 'CREATE' | 'SHOW';

export default class Session {
  private playerID: number;
  private numRounds: number;
  private round = 0;
  private showingPath = 0;
  private phase: Phase = 'CREATE';
  private waiting = false;
  private readonly texts: string[][] = []; // [round/2][path]
  private readonly pictures: string[][] = []; // [round-1/2][path]
  private readonly roundPaths: number[][] = []; // [round][player] = path

  constructor(playerID: number, numRounds: number, roundPaths: number[][]) {
    this.playerID = playerID;
    this.numRounds = numRounds;
    this.roundPaths = roundPaths;
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
    console.log('called submitOwnText')
    this.waiting = true;
    showWaiting();
    this.submitText(this.playerID, text);
  }

  public submitText(player: number, text: string) {
    console.log('-----')
    console.log(this.numRounds)
    this.texts[this.round / 2][this.roundPaths[this.round][player]] = text;
    for (let i = 0; i < this.numRounds ; i++) {
      console.log('text', this.texts[this.round / 2][i])
      if(this.texts[this.round / 2][i] == undefined) {
        return;
      }
    }
    this.nextRound();
    mockNextRound();
  }

  public submitOwnPicture(picture: string) {
    this.waiting = true;
    showWaiting();
    this.submitPicture(this.playerID, picture);
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
    this.waiting = false;
    showDoneButton();
    console.log('invoked showDoneButton');
    if (this.phase === 'CREATE') {
      if (++this.round === this.numRounds) {
        this.round = 0;
        this.showingPath = 0;
        showcaseText(this.texts[0][0]);
        this.phase = 'SHOW';
        displayPhase('SHOW');
      } else if (this.round % 2 === 0) {
        showTextArea();
      } else {
        showCanvas();
      }
    } else {
      if (++this.round === this.numRounds) {
        this.round = 0;
        if (++this.showingPath===this.numRounds) {
          showTextArea();
          this.phase = 'CREATE';
          displayPhase('CREATE');
          return;
        }
      } 
      if (this.round % 2 === 0) {
        showcaseText(this.texts[this.round / 2][this.showingPath]);
      } else {
        showcasePicture(this.pictures[(this.round - 1) / 2][this.showingPath]);
      }
    }
  }
}