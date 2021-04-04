import { Player, RoundType } from '.';

export type EventType = 'START' | 'PLAYERS' | 'SUBMIT';

export interface StartData {
  players: Player[];
  roundPaths: number[][];
}

export interface PlayersData {
  players: Player[];
}

export interface SubmitData {
  playerIndex: number;
  type: RoundType;
  data: string;
}
