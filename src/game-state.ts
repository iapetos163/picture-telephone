import { displayPhase, showCanvas, showcasePicture, showcaseText, showTextArea } from './ui';

export type RoundType = 'TEXT' | 'PICTURE';
export type Phase = 'CREATE' | 'SHOW';

const playerNames = ['PLAYER1'];
const numRounds = 5;
let round = 0;
let phase = 'CREATE';
const texts: string[][] = [];
const pictures: string[][] = [];

export function initialize() {
  for (let i = 0; i < numRounds; i++) {
    if (i % 2 === 0) {
      texts[i/2] = [];
    } else {
      pictures[(i-1)/2] = [];
    }
  }
}

export function submitText(player: number, text: string) {
  texts[round/2][player] = text;
}
export function submitPicture(player: number, picture: string) {
  pictures[(round-1)/2][player] = picture;
}

export function getRoundType(): RoundType {
  return round % 2 === 0 ? 'TEXT' : 'PICTURE';
}

export function nextRound() {
  console.log(round)
  if (phase === 'CREATE') {
    if (++round === numRounds) {
      round = 0;
      showcaseText(texts[0][0]);
      phase = 'SHOW';
      displayPhase('SHOW');
    } else if (round % 2 === 0) {
      showTextArea();
    } else {
      console.log('HOOPLAY')
      showCanvas();
    }
  } else {
    if (++round === numRounds) {
      round = 0;
      showTextArea();
      phase = 'CREATE';
      displayPhase('CREATE');
    } else if (round % 2 === 0) {
      showcaseText(texts[round/2][0]);
    } else {
      showcasePicture(pictures[(round-1)/2][0]);
    }
  }
}