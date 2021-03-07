import { List } from 'immutable';
import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import { initialize as initializeGameState } from './game-state';
import ErrorComponent from './components/Error';
import { Phase } from './game-state';
import Game from './components/Game';
import { UIController, ShowcaseItem } from './UIController';
import { RoundType } from './game-state/Session';

const uiController = new UIController();
let init = false;

export default function App() {
  const [lobbyCount, setLobbyCount] = useState<number | undefined>(undefined);
  const [errorMessage, setErrorMessage] = useState('');
  const [phase, setPhase] = useState<Phase>('LOADING');
  const [roundType, setRoundType] = useState<RoundType>('TEXT');
  const [prevDescription, setPrevDescription] = useState('');
  const [prevPictureSource, setPrevPictureSource] = useState('');
  const [showcaseItems, setShowcaseItems] = useState<List<ShowcaseItem>>(List());
  const [waiting, setWaiting] = useState(false);
  uiController.refresh({ setLobbyCount, setPrevDescription, setPrevPictureSource, setRoundType, setShowcaseItems, showcaseItems, setPhase, setWaiting });

  useEffect(() => {
    if (phase === 'LOBBY') {
      setLobbyCount(0);
    } else {
      setLobbyCount(undefined);
    }
  }, [phase]);

  const onError = (message: string | Error | ErrorEvent ) => {
    console.error(message);
    if (typeof message === 'string') {
      setErrorMessage(message);
    } else {
      setErrorMessage(message.message);
    }
  };

  // window.addEventListener('error', onError);

  if (! init) {
    init = true;
    initializeGameState(uiController).then(() => {
      setPhase('LOBBY');
    }).catch(onError);
  }

  return (
    <>
      <Header {...{lobbyCount}}/>
      <main>
        {errorMessage && <ErrorComponent message={errorMessage} />}
        <Game {...{onError, phase, prevDescription, prevPictureSource, roundType, showcaseItems, waiting}}/>
      </main>
    </>
  );
}