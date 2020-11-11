import './style.scss';
import { initialize as initializeUI } from './ui';
import { initialize as initializeGameState } from './game-state';

let errorElem: HTMLElement;

export function handleError(message: string | Error | ErrorEvent) {
  console.error(message);
  errorElem.style.display = 'initial';
  if (typeof message === 'string') {
    errorElem.innerText = message;
  } else {
    errorElem.innerText = message.message;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  errorElem = document.getElementById('error') as HTMLElement;
  try {
    initializeUI();
    initializeGameState();
  } catch (err) {
    handleError(err);
  }
});
