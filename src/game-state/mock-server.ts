import { sortBy, range } from 'lodash';

type ClientID = Date;
type SessionData = { playerID: number, numPlayers: number, roundPaths: number[][] }

const clients: ClientID[] = [];

function makePermutation(n: number) {
  const permutation: number[] = [];
  function recurse(m: number, f: number): number {
    const rand = m < n ? recurse(m + 1, f * m) : Math.floor(Math.random() * f * n);
    
    const taken = sortBy(permutation);
    let r = Math.floor(rand / f)
    for (const k of taken) {
      if (r >= k) r++;
    }
    permutation.push(r);
    return rand % f;
  }
  recurse(1, 1);
  return permutation;
}

function generateRoundPaths(numPlayers: number) {
  const permutation = makePermutation(numPlayers);
  const permRepeated = permutation.concat(permutation);
  return range(numPlayers).map(i => permRepeated.slice(i, i + numPlayers));
}

function joinLobby(clientID: ClientID) {
  clients.push(clientID);
  // for each client
  // setPlayers() /
}

function startSession(): SessionData {
  return {
    playerID: 0,
    numPlayers: clients.length,
    roundPaths: generateRoundPaths(clients.length),
  };
}