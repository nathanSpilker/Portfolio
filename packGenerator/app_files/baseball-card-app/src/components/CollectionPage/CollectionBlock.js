import React from 'react';
import "./CollectionBlock.css";

const CollectionBlock = (props) => {

  return (
    <div  className = "ColBlock">
        <h1>{props.CollectionName}</h1>
        <p>Cards: {props.CardNumber}</p>
    </div>
    
  );
};

export default CollectionBlock;