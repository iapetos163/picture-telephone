import React, { FC } from 'react';
import { startGame, Player } from '../game-state';
import { List } from 'immutable';

interface LobbyProps {
  players: List<Player>;
}

const Lobby: FC<LobbyProps> = ({ players }) => {
  return (
    <div>
      <p>{players.size} Player{players.size === 1 ? '' : 's'} in Lobby</p>
      <button onClick={startGame} className="btn btn-lg btn-success">Start Game</button>
    </div>
  );
}
export default Lobby;