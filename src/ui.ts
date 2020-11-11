import { handleError } from './main';
import { getRoundType, Phase, submitPicture, submitText, startGame, showNext, submitOwnPicture, submitOwnText } from './game-state';

let ctx: CanvasRenderingContext2D;
let textContainer: HTMLElement, canvasContainer: HTMLElement,
    createContainer: HTMLElement, showAndTellContainer: HTMLElement,
    showcase: HTMLElement, lobbyCount: HTMLElement, lobby: HTMLElement,
    loading: HTMLElement, waiting: HTMLElement, doneButton: HTMLElement;
let textArea: HTMLTextAreaElement;
let drawing = false;
let rect: DOMRect;
let windowRect: DOMRect

function onMouseDown(evt: MouseEvent) {
  rect = (evt.target as Element).getBoundingClientRect();
  drawing = true;
  ctx.beginPath();
  ctx.moveTo(evt.clientX - rect.left, evt.clientY - rect.top);
  window.addEventListener('mousemove', onMouseMove as EventListener);
}

function onTouchStart(evt: TouchEvent) {
  rect = (evt.target as Element).getBoundingClientRect();
  evt.preventDefault();
  const touch = evt.changedTouches[0];
  drawing = true;
  ctx.beginPath();
  ctx.moveTo(touch.clientX - rect.left, touch.clientY - rect.top);
  window.addEventListener('touchmove', onTouchMove);
}

function onMouseUp(evt: MouseEvent) {
  drawing = false;
  window.removeEventListener('mousemove', onMouseMove as EventListener);
}

function onTouchEnd(evt: TouchEvent) {
  drawing = false;
  window.removeEventListener('touchmove', onTouchMove);
}

function onMouseMove(evt: MouseEvent) {
  ctx.lineTo(evt.clientX - rect.left, evt.clientY - rect.top);
}

function onTouchMove(evt: TouchEvent) {
  const touch = evt.changedTouches[0];
  ctx.lineTo(touch.clientX - rect.left, touch.clientY - rect.top);
}

function draw() {
  if (drawing) {
    ctx.stroke();
  }
}

export function initialize() {
  const canvas = document.querySelector<HTMLCanvasElement>('canvas');
  if (canvas === null) {
    throw new Error('Failed to find canvas');
  }

  const context = canvas.getContext('2d');
  if (context === null) {
    throw new Error('Failed to initialize 2D context');
  }
  ctx = context;

  const canvasContainerElem = document.getElementById('canvas-container');
  const textContainerElem = document.getElementById('text-container');
  const createContainerElem = document.getElementById('create-phase');
  const showAndTellElem = document.getElementById('show-and-tell');
  const showcaseElem = document.getElementById('showcase');
  const lobbyCountElem = document.getElementById('lobby-count');
  const lobbyElem = document.getElementById('lobby');
  const loadingElem = document.getElementById('loading');
  const waitingElem = document.getElementById('waiting');
  if (textContainerElem === null || canvasContainerElem === null
      || createContainerElem === null || showAndTellElem === null
      || showcaseElem === null || lobbyCountElem === null
      || lobbyElem === null || loadingElem === null || waitingElem === null) {
    throw new Error('Failed to get a container');
  }
  canvasContainer = canvasContainerElem;
  textContainer = textContainerElem;
  createContainer = createContainerElem;
  showAndTellContainer = showAndTellElem;
  showcase = showcaseElem;
  lobbyCount = lobbyCountElem;
  lobby = lobbyElem;
  loading = loadingElem;
  waiting = waitingElem;

  const textAreaElem = textContainer.querySelector<HTMLTextAreaElement>('textarea');
  if (textAreaElem === null) {
    throw new Error('Failed to get textarea');
  }
  textArea = textAreaElem;

  const doneButtonElem = document.getElementById('done-btn');
  const nextButton = document.getElementById('next-btn');
  const startButton = document.getElementById('start-btn');
  if (doneButtonElem === null || nextButton === null || startButton === null) {
    throw new Error('Failed to get #done-btn, #next-btn, or #start-btn');
  }
  doneButton = doneButtonElem;
  doneButton.addEventListener('click', () => {
    if(getRoundType() === 'PICTURE') {
      submitOwnPicture(canvas.toDataURL());
      clearCanvas();
    } else {
      submitOwnText(textAreaElem.value);
      clearText();
    }
  });
  
  nextButton.addEventListener('click', showNext);

  startButton.addEventListener('click', startGame);

  canvas.addEventListener('mousedown', onMouseDown);
  canvas.addEventListener('touchstart', onTouchStart);
  canvas.addEventListener('error', handleError);
  window.addEventListener('mouseup', onMouseUp);
  window.addEventListener('touchend', onTouchEnd);
  window.addEventListener('touchcancel', onTouchEnd);
  window.addEventListener('error', handleError);

  clearCanvas();

  setInterval(() => {
    draw();
  }, 1000 / 30);
}

function clearCanvas() {
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, 1000, 1000);
}

function clearText() {
  textArea.value = '';
}

export function showCanvas() {
  canvasContainer.classList.remove('hidden');
  textContainer.classList.add('hidden');
}


export function showTextArea() {
  textContainer.classList.remove('hidden');
  canvasContainer.classList.add('hidden');
}

export function displayPhase(phase: Phase) {
  createContainer.classList.add('hidden');
  showAndTellContainer.classList.add('hidden');
  loading.classList.add('hidden');
  lobby.classList.add('hidden');
  lobbyCount.classList.add('hidden');
  switch(phase) {
    case 'CREATE':
      createContainer.classList.remove('hidden');
      break;
    case 'SHOW':
      showAndTellContainer.classList.remove('hidden');
      break;
    case 'LOBBY':
      lobby.classList.remove('hidden');
      lobbyCount.classList.add('hidden');
      break;
    case 'LOADING':
      loading.classList.remove('hidden');
      break;
    default:
      throw new Error(`Phase ${phase} not implemented`);
  }
  
  lobby.classList.add('hidden');
}

export function showcasePicture(source: string) {
  if (showcase.firstChild !== null) {
    showcase.removeChild(showcase.firstChild);
  }
  const image = document.createElement('img');
  image.setAttribute('src', source);
  showcase.appendChild(image);
}

export function showcaseText(text: string) {
  if (showcase.firstChild !== null) {
    showcase.removeChild(showcase.firstChild);
  }
  const para = document.createElement('p');
  para.innerText = text;
  showcase.appendChild(para);
}

export function setLobbyCount(count: number) {
  lobbyCount.innerText = `${count} Player${count === 1 ? '' : 's'} in Lobby`;
}

export function showWaiting() {
  waiting.classList.remove('hidden');
  doneButton.classList.add('hidden');
}

export function showDoneButton() {
  waiting.classList.add('hidden');
  doneButton.classList.remove('hidden');
}