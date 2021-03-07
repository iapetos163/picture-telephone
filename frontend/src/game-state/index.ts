import { joinLobby } from '../adapter';
import { UIController } from '../UIController';
import Player from "./mock-players";
import { joinLobby as mockJoinLobby, startSession } from "./mock-server";
import Session from "./Session";

export type RoundType = 'TEXT' | 'PICTURE';
export type Phase = 'LOBBY' | 'CREATE' | 'SHOW' | 'LOADING';
let currentSession: Session;
let uiController: UIController;

// UI interface 
export function submitOwnPicture(picture: string) {
  currentSession.submitOwnPicture(picture);
}

export function submitOwnText(text: string) {
  currentSession.submitOwnText(text);
}

export async function initialize(uic: UIController) {
  uiController = uic;
  Player.initialize(5);
  mockJoinLobby(new Date());
  await joinLobby();
}

// UI + session interface

export function showNext() {
  // Only for show and tell
  if(currentSession.currentPhase !== 'SHOW') {
    throw new Error('Cannot show next outside of show and tell');
  }
  currentSession.nextRound();
}

export function startGame() {
  uiController.displayPhase('LOADING');
  const {playerID, numPlayers, roundPaths} = startSession();
  currentSession = new Session(uiController, playerID, numPlayers, roundPaths);
  Player.allStartGame();
  uiController.displayPhase('CREATE');
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
  uiController.setLobbyCount(numPlayers);
}

// Mock player interface

export function getRoundType() {
  return currentSession.roundType;
}

export function getPhase() {
  return currentSession.currentPhase;
}
