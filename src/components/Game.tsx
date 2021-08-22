import { List } from 'immutable';
import React, { FC, useState } from 'react';
import { Phase, RoundType, Player } from '../game-state';
import Create from './Create';
import Loading from './Loading';
import Lobby from './Lobby';
import ShowAndTell from './ShowAndTell';
import { ShowcaseItem, UIController } from '../UIController';
import { startGame } from '../game-state';

interface GameProps {
  onError(message: string | Error | ErrorEvent): void;
  uiController: UIController;
}


const Game: FC<GameProps> = ({ uiController, onError }) => {
  const [phase, setPhase] = useState<Phase>('LOADING');
  const [players, setPlayers] = useState<List<Player>>(List());
  const [roundType, setRoundType] = useState<RoundType>('TEXT');
  const [room, setRoom] = useState<string>('');
  const [prevDescription, setPrevDescription] = useState('');
  const [prevPictureSource, setPrevPictureSource] = useState('');
  const [showcaseItems, setShowcaseItems] = useState<List<ShowcaseItem>>(List());
  const [waiting, setWaiting] = useState(false);
  uiController.refresh({ setPrevDescription, setPrevPictureSource, setRoom, setRoundType, setShowcaseItems, showcaseItems, setPhase, setPlayers, setWaiting });

  const onStartGame = () => {
    startGame();
  }

  return (
    <div id="game-container">
      { phase === 'LOBBY' && <Lobby {...{ players, room, onStartGame }}/> }
      { phase === 'LOADING' && <Loading /> }
      { phase === 'CREATE' && <Create {...{ prevDescription, prevPictureSource, onError, roundType, waiting, }} /> }
      { phase === 'SHOW' && <ShowAndTell showcaseItems={showcaseItems} /> }
    </div>
  );
}
export default Game;