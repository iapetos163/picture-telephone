import React, { FC, useState, createRef, ChangeEvent } from 'react';
import CanvasContainer from './CanvasContainer';
import { submitPicture, submitText, RoundType } from '../game-state';

interface CreateProps {
  onError(message: string | Error | ErrorEvent): void;
  prevDescription: string;
  prevPictureSource: string;
  roundType: RoundType;
  waiting: boolean;
}

const CANVAS_REF_ERROR = new Error('Failed to get canvas ref');

const Create: FC<CreateProps> = ({ onError, prevDescription, prevPictureSource, roundType, waiting }) => {
  const [ description, setDescription ] = useState('');

  const canvasRef = createRef<HTMLCanvasElement>();

  const onDone = () => {
    if(roundType === 'PICTURE') {
      if (canvasRef.current) {
        submitPicture(canvasRef.current.toDataURL());
      } else {
        onError(CANVAS_REF_ERROR);
      }
    } else {
      submitText(description);
      setDescription('');
    }
  };

  const onDescriptionChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(event.target.value);
  }

  return (
    <div id="create-phase">
      <div className="btn-container">
          <div>
            { waiting
              ? <p>Waiting for other players...</p>
              : <button className="btn btn-primary" onClick={onDone}>Done</button>
            }
          </div>
      </div>
      <div>
          { roundType == 'PICTURE'
            ? <div>
              <p>{prevDescription}</p>
              <div id="inner-canvas-container">
                  <div></div>
                  <CanvasContainer {...{ onError, canvasRef }} />
                  <div id="right-bar">
                      {/* <div className="box-btn">1</div>
                      <div className="box-btn">2</div>
                      <div className="box-btn">3</div>
                      <div className="box-btn">4</div>
                      <div className="box-btn">5</div>
                      <div className="box-btn">6</div>
                      <div className="box-btn">Pick</div>
                      <div className="box-btn">Fill</div>
                      <div className="box-btn">Und</div>
                      <div className="box-btn">Clr</div>
                      <div className="box-btn">Lg</div>
                      <div className="box-btn">Med</div>
                      <div className="box-btn">Sm</div>
                      <div className="box-btn">?</div> */}
                  </div>
              </div>
          </div>
          : <div id="text-container">
              <div>
                { prevPictureSource && <img src={prevPictureSource}></img> }
              </div>
              <textarea placeholder="Enter a prompt!" onChange={onDescriptionChange}></textarea>
          </div>
        }
      </div>
  </div>
  );
}
export default Create;