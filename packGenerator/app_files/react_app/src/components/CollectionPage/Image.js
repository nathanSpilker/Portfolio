import React from 'react';
import './Image.css';

const Image = (props) => {

  return (
    <div  className = "card_custom">
        <div className = "card_only">
        <img onClick={() => props.display(props.source, props.name, props.pic, props.id)} src={props.source} alt={props.source} />
        </div>
        <p>{props.name}</p>
    </div>
    
  );
};

export default Image;