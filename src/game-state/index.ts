import * as adapter from '../adapter';
import { UIController } from '../UIController';
import Session from './Session';
import EventBus from './EventBus';
import { ClientEvent, ServerEvent, RoomData, CreateData, JoinData } from './events';
export { Player, RoundType } from '../adapter';

export type Phase = 'LOBBY' | 'CREATE' | 'SHOW' | 'LOADING';

const ERR_SUBMIT_LOBBY = new Error('Cannot submit to lobby session');

let currentSession: Session;
let uiController: UIController;

// UI interface 
export function submitPicture(picture: string) {
  if (!currentSession.game) {
    throw ERR_SUBMIT_LOBBY;
  }
  currentSession.game.submitPicture(picture);
}

export function submitText(text: string) {
  if (!currentSession.game) {
    throw ERR_SUBMIT_LOBBY;
  }
  currentSession.game.submitText(text);
}

export function createRoom(uic: UIController): Promise<void> {
  uiController = uic;
  const bus = new EventBus<ClientEvent | ServerEvent>();
  return new Promise((resolve, reject) => {
    adapter.connect(bus).then(() => {
      const subscription = bus.subscribe<RoomData>('ROOM', (room) => {
        currentSession = new Session(uic, room.id, room.ownPlayer.id, room.allPlayers, bus);
        resolve();
        bus.unsubscribe('ROOM', subscription);
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
        currentSession = new Session(uic, room.id, room.ownPlayer.id, room.allPlayers, bus);
        resolve();
        bus.unsubscribe('ROOM', subscription);
      });

      bus.publish<JoinData>('JOIN', { room: roomCode});
    }).catch(reject);
  });
}

export function startGame() {
  if (currentSession.game) {
    throw new Error('Cannot start game for active session');
  }
  currentSession.requestStartGame();
}

export function showNext() {
  // Only for show and tell
  if(!currentSession.game || currentSession.game.phase !== 'SHOW') {
    throw new Error('Cannot show next outside of show and tell');
  }
  currentSession.game.showNext();
}
