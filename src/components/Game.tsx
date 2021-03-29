import { List } from 'immutable';
import React, { FC, useState } from 'react';
import { Phase, RoundType, getPlayers } from '../game-state';
import Create from './Create';
import Loading from './Loading';
import Lobby from './Lobby';
import ShowAndTell from './ShowAndTell';
import { ShowcaseItem, UIController } from '../UIController';

interface GameProps {
  onError(message: string | Error | ErrorEvent): void;
  uiController: UIController;
}


const Game: FC<GameProps> = ({ uiController, onError }) => {
  const [phase, setPhase] = useState<Phase>('LOADING');
  const [roundType, setRoundType] = useState<RoundType>('TEXT');
  const [prevDescription, setPrevDescription] = useState('');
  const [prevPictureSource, setPrevPictureSource] = useState('');
  const [showcaseItems, setShowcaseItems] = useState<List<ShowcaseItem>>(List());
  const [waiting, setWaiting] = useState(false);
  uiController.refresh({ setPrevDescription, setPrevPictureSource, setRoundType, setShowcaseItems, showcaseItems, setPhase, setWaiting });


  return (
    <div id="game-container">
      { phase === 'LOBBY' && <Lobby players={getPlayers()}/> }
      { phase === 'LOADING' && <Loading /> }
      { phase === 'CREATE' && <Create {...{ prevDescription, prevPictureSource, onError, roundType, waiting, }} /> }
      { phase === 'SHOW' && <ShowAndTell showcaseItems={showcaseItems} /> }
    </div>
  );
}
export default Game;