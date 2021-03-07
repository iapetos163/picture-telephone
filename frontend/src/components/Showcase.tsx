import { List } from 'immutable';
import React, { FC } from 'react';
import { ShowcaseItem } from '../UIController';

interface ShowcaseProps {
  showcaseItems: List<ShowcaseItem>;
}

const Showcase: FC<ShowcaseProps> = ({ showcaseItems }) => {
  console.log(showcaseItems)
  return (
    <>
      {
        ...showcaseItems.map(({data, elementType}, i) => (
          elementType == 'image'
          ? <img key={i} src={data}></img>
          : <p key={i}>{data}</p>
        )).toArray()
      }
    </>
  );
}
export default Showcase;