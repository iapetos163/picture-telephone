import { phrases, images } from './mock-data.json';
import EventBus from './EventBus';
import { EventType, JoinData, RoomData, StartedData } from './events';
import Session from './Session';
import { UIController } from '../UIController';
import * as adapter from '../adapter';
import LobbySession from './Session/LobbySession';

const ERR_SESSION_UNINIT = new Error('Session not initialized');
const ERR_ALREADY_STARTED = new Error('Active session received STARTED event');
const ERR_LOBBY_SUBMIT = new Error('Lobby session received SUBMIT event');
const ERR_LOBBY_PLAY = new Error('Tried to play round in lobby session');

export default class MockPlayer {
  private session?: Session;

  public static players: MockPlayer[] = [];

  constructor(roomId: string) {
    const bus = new EventBus<EventType>();

    setTimeout(() => {
      adapter.connect(bus).then(() => {
        const subscription = bus.subscribe<RoomData>('ROOM', (room) => {
          this.session = new LobbySession(new UIController(true), room.id, room.ownPlayer.id, room.allPlayers, bus);
          bus.unsubscribe('ROOM', subscription);
        });
        bus.publish<JoinData>('JOIN', { room: roomId });
        bus.subscribe<StartedData>('STARTED', ({ roundPaths }) => {
          if (!this.session) {
            throw ERR_SESSION_UNINIT;
          }
          if (!Session.isLobby(this.session)) {
            throw ERR_ALREADY_STARTED;
          }
          this.session = this.session.activate(roundPaths);
          this.playRound();
        });
      });
    }, Math.random() * 3000);
  }

  private playRound() {
    if (!this.session) {
      throw ERR_SESSION_UNINIT;
    }
    if (this.session.currentPhase === 'CREATE') {
      setTimeout(() => {
        if (!this.session) {
          throw ERR_SESSION_UNINIT;
        }
        if (!Session.isActive(this.session)) {
          throw ERR_LOBBY_PLAY;
        }
        if (!this.session.waiting) {
          if (this.session.roundType === 'TEXT') {
            this.session.submitText(phrases[Math.floor(Math.random() * phrases.length)]);
          } else {
            this.session.submitPicture(images[Math.floor(Math.random() * images.length)]);
          }
        }
        this.playRound();
      }, Math.random() * 10000);
    }
  }

  public static initialize(numPlayers: number, room: string) {
    for (let i=1; i <= numPlayers ; i++) {
      MockPlayer.players.push(new MockPlayer(room));
    }
  }
}