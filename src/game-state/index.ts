import * as adapter from '../adapter';
import { UIController } from '../UIController';
import MockPlayer from "./mock-players";
import Session from "./Session";
import EventBus from './EventBus';
import { EventType } from './events';

export interface Player {
  id: string;
}

export type RoundType = 'TEXT' | 'PICTURE';
export type Phase = 'LOBBY' | 'CREATE' | 'SHOW' | 'LOADING';
let currentSession: Session;
let uiController: UIController;

// UI interface 
export function submitOwnPicture(picture: string) {
  currentSession.submitPicture(picture);
}

export function submitOwnText(text: string) {
  currentSession.submitText(text);
}

export async function createRoom(uic: UIController) {
  uiController = uic;
  const bus = new EventBus<EventType>();
  const room = await adapter.createRoom();
  MockPlayer.initialize(5, room.id, bus);
  currentSession = new Session(uic, room.id, room.ownPlayer.id, room.allPlayers, bus);
}

export async function joinRoom(uic: UIController, roomCode: string) {
  uiController = uic;
  const room = await adapter.joinRoom(roomCode);
  const bus = new EventBus<EventType>();
  currentSession = new Session(uic, roomCode, room.ownPlayer.id, room.allPlayers, bus);
}

export async function startGame() {
  uiController.displayPhase('LOADING');
  await adapter.startGame(currentSession.roomCode)
}

export function showNext() {
  // Only for show and tell
  if(currentSession.currentPhase !== 'SHOW') {
    throw new Error('Cannot show next outside of show and tell');
  }
  currentSession.nextRound();
}
