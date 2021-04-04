import { phrases, images } from './mock-data.json';
import EventBus from './EventBus';
import { EventType, PlayersData } from './events';
import Session from './Session';
import { UIController } from '../UIController';
import * as adapter from '../adapter';

export default class MockPlayer {
  private readonly session: Session;

  public static players: MockPlayer[] = [];

  constructor(room: string, bus: EventBus<EventType>) {
    this.session = new Session(new UIController(true), room, Math.random().toString(), [], bus);

    setTimeout(() => {
      adapter.joinRoom(room).then(({ allPlayers }) => {
        bus.publish<PlayersData>('PLAYERS', { players: allPlayers });
        bus.subscribe('START', () => {
          this.playRound()
        });
        bus.subscribe('SUBMIT', () => {
          if (!this.session.waiting) {
            this.playRound();
          }
        });
      });
    }, Math.random() * 3000);
  }

  private playRound() {
    if (this.session.currentPhase === 'CREATE') {
      setTimeout(() => {
        if (this.session.roundType === 'TEXT') {
          this.session.submitText(phrases[Math.floor(Math.random() * phrases.length)]);
        } else {
          this.session.submitPicture(images[Math.floor(Math.random() * images.length)]);
        }
      }, Math.random() * 10000);
    }
  }

  public static initialize(numPlayers: number, room: string, bus: EventBus<EventType>) {
    for (let i=1; i <= numPlayers ; i++) {
      MockPlayer.players.push(new MockPlayer(room, bus));
    }
  }
}