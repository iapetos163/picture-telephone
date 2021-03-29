import { List } from 'immutable';
import * as adapter from '../adapter';
import { UIController } from '../UIController';
import MockPlayer from "./mock-players";
import { joinLobby as mockJoinLobby, startSession } from "./mock-server";
import Session from "./Session";

export interface Player {}

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

export async function createRoom(uic: UIController) {
  uiController = uic;
  MockPlayer.initialize(5);
  mockJoinLobby(new Date());
  const room = await adapter.createRoom();
  currentSession = new Session(uic, room.allPlayers);
}

export async function joinRoom(uic: UIController, roomCode: string) {
  uiController = uic;
  const room = await adapter.joinRoom(roomCode);
  currentSession = new Session(uic, room.allPlayers);
}

export function getPlayers() {
  return List(currentSession.players);
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
  currentSession.startGame(playerID, numPlayers, roundPaths);
  MockPlayer.allStartGame();
  uiController.displayPhase('CREATE');
}

export function mockNextRound() {
  MockPlayer.allNextRound();
}

// Session intereface

export function submitPicture(player: number, picture: string) {
  currentSession.submitPicture(player, picture);
}

export function submitText(player: number, text: string) {
  currentSession.submitText(player, text);
}

// Mock player interface

export function getRoundType() {
  return currentSession.roundType;
}

export function getPhase() {
  return currentSession.currentPhase;
}
