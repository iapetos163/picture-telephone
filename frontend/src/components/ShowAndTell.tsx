import React, { FC } from 'react';
import { List } from 'immutable';
import Showcase from './Showcase';
import { showNext } from '../game-state';
import { ShowcaseItem } from '../UIController';

interface ShowAndTellProps {
  showcaseItems: List<ShowcaseItem>;
}

const ShowAndTell: FC<ShowAndTellProps> = ({ showcaseItems }) => {
  return (
    <div id="show-and-tell">
      <div className="btn-container">
        <div>
          <button className="btn btn-primary" onClick={showNext}>Next</button>
        </div>
      </div>
      <div id="showcase-container">
        <Showcase showcaseItems={showcaseItems} />
      </div>
    </div>
  );
}
export default ShowAndTell;