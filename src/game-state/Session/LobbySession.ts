import { List } from 'immutable';
import Session from '.';
import { Player, Phase, activateSession } from '..';
import EventBus from '../EventBus';
import { ErrorData, EventType, StartedData, RoomData, StartData } from '../events';
import { UIController } from '../../UIController';
import ActiveSession from './ActiveSession';

// web socket lives here
export default class LobbySession extends Session {
  protected phase: Phase ;

  constructor(uiController: UIController, roomCode: string, playerID: string, players: Player[], bus: EventBus<EventType>) {
    super(uiController, roomCode, playerID, players, bus);
    this.phase = 'LOBBY';

    this.bus.subscribe<ErrorData>('ERROR', ({ message }) => {
      console.error(message);
    });

    this.bus.subscribe<StartedData>('STARTED', ({ players, roundPaths }) => {
      this.updatePlayers(players);
      activateSession(roundPaths);
    });

    this.bus.subscribe<RoomData>('ROOM', ({ allPlayers }) => {
      this.updatePlayers(allPlayers);
    });

    uiController.setRoom(roomCode);
  }

  public activate(roundPaths: number[][]): ActiveSession {
    return new ActiveSession(this.ui, this.roomCode, this.playerID, this.players, this.bus, roundPaths);
  }

  public requestStartGame() {
    this.ui.displayPhase('LOADING');
    this.bus.publish<StartData>('START', null);
  }

  private updatePlayers(players: Player[]) {
    this.players = players;
    this.ui.setPlayers(List(players));
  }
}