import axios from 'axios';
import { DOMAIN_NAME } from './constants.json';

export interface Room {
  id: string;
  ownPlayer: Player;
  allPlayers: Player[];
}

export interface Player {
  id: string;
}

const handle = axios.create({
  baseURL: `https://${DOMAIN_NAME}`,
});

export async function createRoom(): Promise<Room> {
  const res = await handle.post('/create-room');
  return res.data;
}

export async function joinRoom(room: string): Promise<Room> {
  const res = await handle.post('/join-room', { room });
  return res.data;
}
