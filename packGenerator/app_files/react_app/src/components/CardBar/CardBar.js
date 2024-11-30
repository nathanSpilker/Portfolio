import React from 'react';
import Card from './Card';
import "./CardBar.css";

const cardBar = props => {
    
    return(
    <div className = "barclass">
        <Card signedIn = {props.signedIn} handleButtonClick = {props.handleb1click} clicked = {props.b1} flipped = {props.flipped1} handleCardClick = {props.handleCardClick1} fpic = {process.env.PUBLIC_URL + '/CardImages/Fronts/' + props.pic1 + '.jpg'} bpic = {process.env.PUBLIC_URL + '/CardImages/Backs/' + props.pic1 + '.jpg'} name = {props.name1}/>
        <Card signedIn = {props.signedIn} handleButtonClick = {props.handleb2click} clicked = {props.b2} flipped = {props.flipped2} handleCardClick = {props.handleCardClick2} fpic = {process.env.PUBLIC_URL + '/CardImages/Fronts/' + props.pic2 + '.jpg'} bpic = {process.env.PUBLIC_URL + '/CardImages/Backs/' + props.pic2 + '.jpg'} name = {props.name2}/>
        <Card signedIn = {props.signedIn} handleButtonClick = {props.handleb3click} clicked = {props.b3} flipped = {props.flipped3} handleCardClick = {props.handleCardClick3} fpic = {process.env.PUBLIC_URL + '/CardImages/Fronts/' + props.pic3 + '.jpg'} bpic = {process.env.PUBLIC_URL + '/CardImages/Backs/' + props.pic3 + '.jpg'} name = {props.name3}/>
        <Card signedIn = {props.signedIn} handleButtonClick = {props.handleb4click} clicked = {props.b4} flipped = {props.flipped4} handleCardClick = {props.handleCardClick4} fpic = {process.env.PUBLIC_URL + '/CardImages/Fronts/' + props.pic4 + '.jpg'} bpic = {process.env.PUBLIC_URL + '/CardImages/Backs/' + props.pic4 + '.jpg'} name = {props.name4}/>
        <Card signedIn = {props.signedIn} handleButtonClick = {props.handleb5click} clicked = {props.b5} flipped = {props.flipped5} handleCardClick = {props.handleCardClick5} fpic = {process.env.PUBLIC_URL + '/CardImages/Fronts/' + props.pic5 + '.jpg'} bpic = {process.env.PUBLIC_URL + '/CardImages/Backs/' + props.pic5 + '.jpg'} name = {props.name5}/>
    </div>
    );
};

export default cardBar;