import { DOMAIN_NAME } from './constants.json';
import EventBus from './game-state/EventBus';

export type SymmetricEvent = 'SUBMIT';
export const SYMMETRIC_EVENTS: SymmetricEvent[] = ['SUBMIT'];
export type ClientEvent = 'JOIN' | 'CREATE' | 'START' | SymmetricEvent;
export const CLIENT_EVENTS: ClientEvent[] = (['JOIN', 'CREATE', 'START'] as ClientEvent[]).concat(SYMMETRIC_EVENTS);
export type ServerEvent = 'ROOM' | 'STARTED' | SymmetricEvent;
export const SERVER_EVENTS: ServerEvent[] = (['ROOM', 'STARTED'] as ServerEvent[]).concat(SYMMETRIC_EVENTS);
export type EventType = ClientEvent | ServerEvent;

export interface Message<ET> {
  event: ET;
  data: any;
}

export interface Player {
  id: string;
}
export type RoundType = 'TEXT' | 'PICTURE';

export type StartData = null;
export type CreateData = null;

export interface StartedData {
  players: Player[];
  roundPaths: number[][];
}

export interface RoomData {
  id: string;
  ownPlayer: Player;
  allPlayers: Player[];
}

export interface SubmitData {
  playerIndex: number;
  type: RoundType;
  data: string;
}

export interface JoinData {
  room: string;
}

function messageGuard<ET>(events: ET[]) {
  return (m: any): m is Message<ET> =>
    m && (typeof m.event === 'string') && events.indexOf(m.event) >= 0 && m.data !== undefined;
}

export const isValidServerMessage = messageGuard<ServerEvent>(SERVER_EVENTS);

export function connect(bus: EventBus<EventType>): Promise<void> {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(`wss://${DOMAIN_NAME}`);
    ws.onclose = () => {
      console.log('Connection closed');
    };

    ws.onerror = err => {
      console.error(err);
      reject(err);
    };
    
    ws.onmessage = m => {
      const message = JSON.parse(m.data);
      if (!isValidServerMessage(message)) {
        console.error('Invalid message from server', message);
        return;
      }
      bus.publish(message.event, message.data);
    };

    ws.onopen = () => {
      resolve();
    };

    for (const event of CLIENT_EVENTS) {
      bus.subscribe(event, data => {
        const message: Message<ClientEvent> = { event, data };
        ws.send(JSON.stringify(message));
      });
    }
  });
}