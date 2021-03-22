import axios from 'axios';
import { DOMAIN_NAME } from './constants.json';

const handle = axios.create({
  baseURL: `https://${DOMAIN_NAME}`,
});

export async function joinLobby() {
  // const res = await handle.post('/create-room');
  /*
  {
    "id": "3570ff7d-634e-499e-9247-373dbdbcf367",
    "room": "TIXEFJ"
}*/
  const res2 = await handle.post('/join-room', { room: "TIXEFJ" });
  console.log(res2.data);
}

// export function startSession(): SessionData {
//   return {
//     playerID: 0,
//     numPlayers: clients.length,
//     roundPaths: generateRoundPaths(clients.length),
//   };
// }