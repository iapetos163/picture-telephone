import { displayPhase, setLobbyCount } from "../ui";
import Player from "./mock-players";
import { joinLobby, startSession } from "./mock-server";
import Session from "./Session";

export type RoundType = 'TEXT' | 'PICTURE';
export type Phase = 'LOBBY' | 'CREATE' | 'SHOW' | 'LOADING';
let currentSession: Session;

// UI interface 
export function getRoundType() {
  return currentSession.roundType;
}

export function getPhase() {
  return currentSession.currentPhase;
}

export function submitOwnPicture(picture: string) {
  currentSession.submitOwnPicture(picture);
}

export function submitOwnText(text: string) {
  currentSession.submitOwnText(text);
}

export function initialize() {
  Player.initialize(5);
  joinLobby(new Date());
}

// UI + session interface

export function showNext() {
  console.log('invoked showNext');
  // Only for show and tell
  if(currentSession.currentPhase !== 'SHOW') {
    throw new Error('Cannot show next outside of show and tell');
  }
  currentSession.nextRound();
}

export function startGame() {
  displayPhase('LOADING');
  const {playerID, numPlayers, roundPaths} = startSession();
  currentSession = new Session(playerID, numPlayers, roundPaths);
  Player.allStartGame();
  displayPhase('CREATE');
}

export function mockNextRound() {
  Player.allNextRound();
}

// Session intereface

export function submitPicture(player: number, picture: string) {
  currentSession.submitPicture(player, picture);
}

export function submitText(player: number, text: string) {
  currentSession.submitText(player, text);
}

// Server interface

export function setNumPlayers(numPlayers: number) {
  setLobbyCount(numPlayers);
}