import { List } from 'immutable';
import React, { useState } from 'react';
import FrontPage from './components/FrontPage';
import Header from './components/Header';
import * as gameState from './game-state';
import ErrorComponent from './components/Error';
import { Phase } from './game-state';
import Game from './components/Game';
import { UIController, ShowcaseItem } from './UIController';
import { RoundType } from './game-state/Session';

const uiController = new UIController();

export default function App() {
  const [errorMessage, setErrorMessage] = useState('');
  const [inGame, setInGame] = useState(false);

  const onError = (message: string | Error | ErrorEvent ) => {
    console.error(message);
    if (typeof message === 'string') {
      setErrorMessage(message);
    } else {
      setErrorMessage(message.message);
    }
  };

  // window.addEventListener('error', onError);

  const createRoom = () => {
    gameState.createRoom(uiController).then(() => {
      uiController.displayPhase('LOBBY');
    }).catch(onError);
    setInGame(true);
  };
  
  const joinRoom = (room: string) => {
    gameState.joinRoom(uiController, room).then(() => {
      uiController.displayPhase('LOBBY');
    }).catch(onError);
    setInGame(true);
  };

  return (
    <>
      <Header />
      <main>
        {errorMessage && <ErrorComponent message={errorMessage} />}
        { inGame
          ? <Game {...{ onError, uiController }}/>
          : <FrontPage {...{ createRoom , joinRoom }} />
        }
        
      </main>
    </>
  );
}