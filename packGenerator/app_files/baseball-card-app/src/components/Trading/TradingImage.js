import React from 'react';
import './TradingImage.css';

const Image = (props) => {

  return (
    <div  className = "card_custom_t">
        <div className = "card_only_t">
        <img src={props.source} alt={props.source} />
        </div>
        <p>{props.name}</p>
    </div>
    
  );
};

export default Image;