import * as adapter from '../adapter';
import { UIController } from '../UIController';
import MockPlayer from './mock-players';
import Session from './Session';
import ActiveSession from './Session/ActiveSession';
import LobbySession from './Session/LobbySession';
import EventBus from './EventBus';
import { EventType } from './events';

export interface Player {
  id: string;
}
export type RoundType = 'TEXT' | 'PICTURE';
export type Phase = 'LOBBY' | 'CREATE' | 'SHOW' | 'LOADING';

const ERR_SUBMIT_LOBBY = new Error('Cannot submit to lobby session');

let currentSession: LobbySession | ActiveSession;
let uiController: UIController;

// UI interface 
export function submitPicture(picture: string) {
  if (!Session.isActive(currentSession)) {
    throw ERR_SUBMIT_LOBBY;
  }
  currentSession.submitPicture(picture);
}

export function submitText(text: string) {
  if (!Session.isActive(currentSession)) {
    throw ERR_SUBMIT_LOBBY;
  }
  currentSession.submitText(text);
}

export async function createRoom(uic: UIController) {
  uiController = uic;
  const bus = new EventBus<EventType>();
  const room = await adapter.createRoom();
  MockPlayer.initialize(5, room.id, bus);
  currentSession = new LobbySession(uic, room.id, room.ownPlayer.id, room.allPlayers, bus);
}

export async function joinRoom(uic: UIController, roomCode: string) {
  uiController = uic;
  const room = await adapter.joinRoom(roomCode);
  const bus = new EventBus<EventType>();
  currentSession = new LobbySession(uic, roomCode, room.ownPlayer.id, room.allPlayers, bus);
}

export async function startGame() {
  uiController.displayPhase('LOADING');
  await adapter.startGame(currentSession.roomCode)
}

export function activateSession(roundPaths: number[][]) {
  if (Session.isActive(currentSession)) {
    throw new Error('Cannot activate already active session');
  }
  currentSession = currentSession.activate(roundPaths);
}

export function showNext() {
  // Only for show and tell
  if(!Session.isActive(currentSession) || currentSession.currentPhase !== 'SHOW') {
    throw new Error('Cannot show next outside of show and tell');
  }
  currentSession.nextRound();
}
