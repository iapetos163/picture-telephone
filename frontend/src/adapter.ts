import axios from "axios";

const handle = axios.create({
  baseURL: 'https://bmioip57lh.execute-api.us-west-2.amazonaws.com',
});

export async function joinLobby() {
  const res = await handle.post('/join');
  console.log(res.data);
}

// export function startSession(): SessionData {
//   return {
//     playerID: 0,
//     numPlayers: clients.length,
//     roundPaths: generateRoundPaths(clients.length),
//   };
// }