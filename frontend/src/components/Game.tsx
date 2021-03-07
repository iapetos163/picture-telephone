import { List } from 'immutable';
import React, { FC } from 'react';
import { Phase, RoundType } from '../game-state';
import Create from './Create';
import Loading from './Lobby';
import Lobby from './Loading';
import ShowAndTell from './ShowAndTell';
import { ShowcaseItem } from '../UIController';

interface GameProps {
  onError(message: string | Error | ErrorEvent): void;
  phase: Phase;
  prevDescription: string;
  prevPictureSource: string;
  roundType: RoundType;
  showcaseItems: List<ShowcaseItem>;
  waiting: boolean;
}

const Game: FC<GameProps> = (props) => {
  const { phase, showcaseItems } = props;
  return (
    <div id="game-container">
      { phase === 'LOBBY' && <Lobby /> }
      { phase === 'LOADING' && <Loading /> }
      { phase === 'CREATE' && <Create {...props} /> }
      { phase === 'SHOW' && <ShowAndTell showcaseItems={showcaseItems} /> }
    </div>
  );
}
export default Game;