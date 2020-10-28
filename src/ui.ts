import { handleError } from './main';
import { getRoundType, nextRound, Phase, submitPicture, submitText } from './game-state';

let ctx: CanvasRenderingContext2D;
let textContainer: HTMLElement, canvasContainer: HTMLElement,
    createContainer: HTMLElement, showAndTellContainer: HTMLElement,
    showcase: HTMLElement;
let textArea: HTMLTextAreaElement;
let drawing = false;
let rect: DOMRect;
let windowRect: DOMRect

function onMouseDown(evt: MouseEvent) {
  rect = (evt.target as Element).getBoundingClientRect();
  console.log(rect);
  drawing = true;
  ctx.beginPath();
  ctx.moveTo(evt.clientX - rect.left, evt.clientY - rect.top);
  console.log(evt)
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
  console.log(evt)
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
  if (textContainerElem === null || canvasContainerElem === null
      || createContainerElem === null || showAndTellElem === null
      || showcaseElem === null) {
    throw new Error('Failed to get a container');
  }
  canvasContainer = canvasContainerElem;
  textContainer = textContainerElem;
  createContainer = createContainerElem;
  showAndTellContainer = showAndTellElem;
  showcase = showcaseElem;

  const textAreaElem = textContainer.querySelector<HTMLTextAreaElement>('textarea');
  if (textAreaElem === null) {
    throw new Error('Failed to get textarea');
  }
  textArea = textAreaElem;

  const doneButton = document.getElementById('done-btn');
  const nextButton = document.getElementById('next-btn');
  if (doneButton === null || nextButton === null) {
    throw new Error('Failed to get #done-btn or #next-btn');
  }
  doneButton.addEventListener('click', () => {
    if(getRoundType() === 'PICTURE') {
      submitPicture(0, canvas.toDataURL());
      clearCanvas();
    } else {
      submitText(0, textAreaElem.value);
      clearText();
    }

    nextRound();
  });
  
  nextButton.addEventListener('click', nextRound);

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
  if (phase === 'CREATE') {
    createContainer.classList.remove('hidden');
    showAndTellContainer.classList.add('hidden');
  } else {
    showAndTellContainer.classList.remove('hidden');
    createContainer.classList.add('hidden');
  }
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