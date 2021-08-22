import React, { FC } from 'react';
import { Player } from '../game-state';
import { List } from 'immutable';

interface LobbyProps {
  players: List<Player>;
  room: string;
  onStartGame(): void;
}

const Lobby: FC<LobbyProps> = ({ players, room, onStartGame }) => {
  return (
    <div>
      <p>Room Code: {room}</p>
      <p>{players.size} Player{players.size === 1 ? '' : 's'} in Lobby</p>
      <button onClick={onStartGame} className="btn btn-lg btn-success">Start Game</button>
    </div>
  );
}
export default Lobby;