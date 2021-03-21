const _ = require('lodash');
const numPlayers = 7;

const moduli = [];
let runningProduct = 1;

for (let i = 1; i <= numPlayers; i++) {
  const path = [];
  for (let j = i - numPlayers + 1; j <= i; j++) {
    runningProduct *= Math.max(j, 1);
    console.log(j)
    path[i - j] = runningProduct;
  }
  moduli[numPlayers - i] = path;
}

console.log(moduli);

let masterRand = Math.random() * moduli[0][0]; //moduli[0][0] - 1;
const roundPaths = [];

let nono = [];
let i_ = -1;
let j_ = -1;

const seeds = [];

for (let i = 0; i < numPlayers; i++) {
  const seedRow = [];
  for (let j = 0; j < numPlayers; j++) {
    seedRow.push(masterRand);
    masterRand %= moduli[i][j];
  }
  seeds.push(seedRow);
}


for (let i = 0; i < numPlayers; i++) {
  for (let j = 0; j < numPlayers; j_=j, i_=i, j++) {
    console.log(j)
    if (i_ >= 0 && j_ >= 0) {
      // i_ is for where to set in roundPaths
      // i is for modulus

      if (roundPaths[i_] === undefined) {
        roundPaths[i_] = [];
      }
      let r = Math.floor(seeds[i][j] / moduli[i][j]);
      const m1 = seeds[i][j];
      const r1 = r;
      const s = _(roundPaths[i_])
        .concat(roundPaths.map(p => p[j_]))
        .concat(nono)
        .sort()
        .uniq()
        .value();
      console.log(s);
      for (let k of s) {
        if (r >= k) r++;
      }
      if (r >= numPlayers) {
        console.log('whadda hell')
        nono.push(roundPaths[i_][j_-1]);
        
        console.log(`(${i_}, ${j_}): ${m1} % ${moduli[i][j]} = ${r1} -> ${r}`);
        j = j - 2;
        if (j < 0) {
          j += numPlayers;
          i -= 1;
        }
        j_ = j_ - 2;
        console.log(i_, i, j_, j)
      } else {
        nono = [];
        roundPaths[i_][j_] = r;
        console.log(`(${i_}, ${j_}): ${m1} % ${moduli[i][j]} = ${r1} -> ${r}`);
      }
    }
  }
}

for (const p of roundPaths) {
  console.log(p.join(' '));
}

/// Forget this just do a normal ass cycle