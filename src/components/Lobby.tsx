import React, { FC } from 'react';
import { Player } from '../game-state';
import { List } from 'immutable';

interface LobbyProps {
  players: List<Player>;
  onStartGame(): void;
}

const Lobby: FC<LobbyProps> = ({ players, onStartGame }) => {
  return (
    <div>
      <p>{players.size} Player{players.size === 1 ? '' : 's'} in Lobby</p>
      <button onClick={onStartGame} className="btn btn-lg btn-success">Start Game</button>
    </div>
  );
}
export default Lobby;