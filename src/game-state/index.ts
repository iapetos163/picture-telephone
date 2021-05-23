import * as adapter from '../adapter';
import { UIController } from '../UIController';
import MockPlayer from './mock-players';
import Session from './Session';
import ActiveSession from './Session/ActiveSession';
import LobbySession from './Session/LobbySession';
import EventBus from './EventBus';
import { ClientEvent, ServerEvent, RoomData, CreateData, JoinData } from './events';
export { Player, RoundType } from '../adapter';

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

export function createRoom(uic: UIController): Promise<void> {
  uiController = uic;
  const bus = new EventBus<ClientEvent | ServerEvent>();
  return new Promise((resolve, reject) => {
    adapter.connect(bus).then(() => {
      const subscription = bus.subscribe<RoomData>('ROOM', (room) => {
        currentSession = new LobbySession(uic, room.id, room.ownPlayer.id, room.allPlayers, bus);
        resolve();
        bus.unsubscribe('ROOM', subscription);
        MockPlayer.initialize(5, room.id);
      });

      bus.publish<CreateData>('CREATE', null);
    }).catch(reject);
  });
}

export function joinRoom(uic: UIController, roomCode: string): Promise<void> {
  uiController = uic;
  const bus = new EventBus<ClientEvent | ServerEvent>();
  return new Promise((resolve, reject) => {
    adapter.connect(bus).then(() => {
      const subscription = bus.subscribe<RoomData>('ROOM', (room) => {
        currentSession = new LobbySession(uic, room.id, room.ownPlayer.id, room.allPlayers, bus);
        resolve();
        bus.unsubscribe('ROOM', subscription);
      });

      bus.publish<JoinData>('JOIN', { room: roomCode});
    }).catch(reject);
  });
}

export function startGame() {
  if (Session.isActive(currentSession)) {
    throw new Error('Cannot start game for active session');
  }
  currentSession.requestStartGame();
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
