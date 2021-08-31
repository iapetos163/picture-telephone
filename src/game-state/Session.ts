import { List } from 'immutable';
import { Player } from '.';
import EventBus from './EventBus';
import { ErrorData, EventType, StartedData, RoomData, StartData } from './events';
import { UIController } from '../UIController';
import Game from './Game';

// web socket lives here
export default class Session {
  private readonly bus: EventBus<EventType>;
  private ui: UIController;
  private playerID: string;
  private players: Player[] = [];
  private _game: Game | undefined;

  constructor(uiController: UIController, roomCode: string, playerID: string, players: Player[], bus: EventBus<EventType>) {
    this.ui = uiController;
    this.bus = bus;
    this.playerID = playerID;
    this.updatePlayers(players);

    this.bus.subscribe<ErrorData>('ERROR', ({ message }) => {
      console.error(message);
    });

    this.bus.subscribe<StartedData>('STARTED', ({ players, roundPaths }) => {
      this.updatePlayers(players);
      const playerIndex = this.players.findIndex(p => p.id === this.playerID);
  
      const onFinished = () => {
        this.ui.displayPhase('LOBBY');
        this._game = undefined;
      };
      this._game = new Game(this.ui, this.bus, playerIndex, roundPaths, onFinished);
    });

    this.bus.subscribe<RoomData>('ROOM', ({ allPlayers }) => {
      this.updatePlayers(allPlayers);
    });

    uiController.setRoom(roomCode);
  }

  public get game(): Game | undefined {
    return this._game;
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