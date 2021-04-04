import ActiveSession from './ActiveSession';
import { Player, Phase } from '..';
import EventBus from '../EventBus';
import { EventType } from '../events';
import { UIController } from '../../UIController';


// web socket lives here
abstract class Session {
  protected readonly bus: EventBus<EventType>;
  protected abstract phase: Phase;
  protected playerID: string;
  protected players: Player[];
  protected ui: UIController;
  public readonly roomCode: string;

  constructor(uiController: UIController, roomCode: string, playerID: string, players: Player[], bus: EventBus<EventType>) {
    this.ui = uiController;
    this.roomCode = roomCode;
    this.playerID = playerID;
    this.players = players;
    this.bus = bus;
  }
  public get currentPhase() {
    return this.phase;
  }

  public static isActive(s: Session): s is ActiveSession {
    return s.phase !== 'LOBBY';
  }
}

namespace Session {}

export default Session;