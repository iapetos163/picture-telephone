import { List } from 'immutable';
import Session from '.';
import { Player, Phase, activateSession } from '..';
import EventBus from '../EventBus';
import { EventType, StartData, PlayersData } from '../events';
import { UIController } from '../../UIController';
import ActiveSession from './ActiveSession';

// web socket lives here
export default class LobbySession extends Session {
  protected phase: Phase ;

  constructor(uiController: UIController, roomCode: string, playerID: string, players: Player[], bus: EventBus<EventType>) {
    super(uiController, roomCode, playerID, players, bus);
    this.phase = 'LOBBY';

    this.bus.subscribe<StartData>('START', ({ players, roundPaths }) => {
      this.updatePlayers(players);
      activateSession(roundPaths);
    });

    this.bus.subscribe<PlayersData>('PLAYERS', ({ players }) => {
      this.updatePlayers(players);
    });
  }

  public activate(roundPaths: number[][]): ActiveSession {
    return new ActiveSession(this.ui, this.roomCode, this.playerID, this.players, this.bus, roundPaths);
  }

  private updatePlayers(players: Player[]) {
    this.players = players;
    this.ui.setPlayers(List(players));
  }
}