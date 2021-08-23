// const _ = require('lodash');

const MODULUS = 308915776; // 26^6
const CHAR_A = 65; // ASCII code for 'A'


function makePermutation(n) {
  const permutation = [];
  function recurse(m, f) {
    const rand = m < n ? recurse(m + 1, f * m) : Math.floor(Math.random() * f * n);

    const taken = _.sortBy(permutation);
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


 function generateRoundPaths(numPlayers) {
  const permutation = makePermutation(numPlayers);
  const permRepeated = permutation.concat(permutation);
  return _.range(numPlayers).map(i => permRepeated.slice(i, i + numPlayers));
}


function generateRoomCode() {
  const recurse = (length, seed) => {
    const i = Math.floor(seed);
    let result = String.fromCharCode(CHAR_A + i);
    if(length > 1) {
      result += recurse(length - 1, (seed - i) * 26);
    }
    return result;
  }
  const seed = Math.random() * 26;
  return recurse(6, seed);
}

console.log(generateRoomCode());
console.log(generateRoomCode());
console.log(generateRoomCode());
console.log(generateRoomCode());
console.log(generateRoomCode());
console.log(generateRoomCode());
console.log(generateRoomCode());