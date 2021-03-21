import React, { FC, RefObject } from 'react';

interface CanvasContainerProps {
  canvasRef: RefObject<HTMLCanvasElement>;
  onError(message: string | Error | ErrorEvent): void;
}

const CanvasContainer: FC<CanvasContainerProps> = ({ onError, canvasRef }) => {
  let drawing = false;
  let rect: DOMRect;
  let windowRect: DOMRect;

  const getCtx = (): CanvasRenderingContext2D | undefined => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx === null) {
        console.log("RUH ROH")
        throw new Error('Failed to initialize 2D context');
      }
      return ctx;
    }
  }

  const draw = () => {
    const ctx = getCtx();
    if (!ctx) return;
    if (drawing) {
      ctx.stroke();
    }
  }
  
  const clearCanvas = () => {
    const ctx = getCtx();
    if (!ctx) return;
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, 1000, 1000);
  }
  

  const onMouseDown = (evt: React.MouseEvent) => {
    const ctx = getCtx();
    if (!ctx) return;
    rect = (evt.target as Element).getBoundingClientRect();
    drawing = true;
    ctx.beginPath();
    ctx.moveTo(evt.clientX - rect.left, evt.clientY - rect.top);
    window.addEventListener('mousemove', onMouseMove as EventListener);
  }
  
  const onTouchStart = (evt: React.TouchEvent) => {
    const ctx = getCtx();
    if (!ctx) return;
    rect = (evt.target as Element).getBoundingClientRect();
    evt.preventDefault();
    const touch = evt.changedTouches[0];
    drawing = true;
    ctx.beginPath();
    ctx.moveTo(touch.clientX - rect.left, touch.clientY - rect.top);
    window.addEventListener('touchmove', onTouchMove);
  }
  
  const onMouseUp = (evt: MouseEvent) => {
    drawing = false;
    window.removeEventListener('mousemove', onMouseMove as EventListener);
  }
  
  const onTouchEnd = (evt: TouchEvent) => {
    drawing = false;
    window.removeEventListener('touchmove', onTouchMove);
  }
  
  const onMouseMove = (evt: MouseEvent) => {
    const ctx = getCtx();
    if (!ctx) return;
    ctx.lineTo(evt.clientX - rect.left, evt.clientY - rect.top);
  }
  
  const onTouchMove = (evt: TouchEvent) => {
    const ctx = getCtx();
    if (!ctx) return;
    const touch = evt.changedTouches[0];
    ctx.lineTo(touch.clientX - rect.left, touch.clientY - rect.top);
  }

  window.addEventListener('mouseup', onMouseUp);
  window.addEventListener('touchend', onTouchEnd);
  window.addEventListener('touchcancel', onTouchEnd);

  setTimeout(() => {
    clearCanvas();
    setInterval(() => {
      draw();
    }, 1000 / 30);
  }, 10);

  return (
    <div id="inner-inner-canvas-container">
        <div>
            <canvas ref={canvasRef} onLoad={clearCanvas} {...{onMouseDown, onTouchStart}} width="350" height="250"></canvas>
        </div>
    </div>
  );
}
export default CanvasContainer;