import axios from 'axios';
import { DOMAIN_NAME } from './constants.json';

const handle = axios.create({
  baseURL: `https://${DOMAIN_NAME}`,
});

export async function joinLobby() {
  const res = await handle.post('/create-room');
  console.log(res.data);
}

// export function startSession(): SessionData {
//   return {
//     playerID: 0,
//     numPlayers: clients.length,
//     roundPaths: generateRoundPaths(clients.length),
//   };
// }