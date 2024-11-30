import React from 'react';
import ReactCardFlip from 'react-card-flip';
import "./Card.css"

const card = props => {

    let button; 
        
    if (props.signedIn) {
        button = <div onClick = {props.handleButtonClick} className = "button_style_"><button>ADD TO COLLECTION</button></div>
    }
    if (props.clicked && props.signedIn) {
        button = <div className = "button_style_clicked"><button>ADDED</button></div>
    }

    return (
        <main className = "main_class">
            <ReactCardFlip className ="rcf" isFlipped={props.flipped} flipDirection="vertical" >
                <img onClick={props.handleCardClick} src = {props.bpic} className = "cardz" alt = "front"/>
                <img onClick={props.handleCardClick} src = {props.fpic} className = "cardz" alt = "back"/>
            </ReactCardFlip>
            <div className = "caption_style"> <p>{props.name}</p> </div>
            {button}
        </main>
    );
};

export default card;