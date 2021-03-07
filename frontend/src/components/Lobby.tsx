import React, { FC } from 'react';
import { startGame } from '../game-state';

interface LobbyProps {}

const Lobby: FC<LobbyProps> = ({ }) => {
  return (
    <div>
      <button onClick={startGame} className="btn btn-lg btn-success">Start Game</button>
    </div>
  );
}
export default Lobby;