import React, { Component, useState } from 'react';
import "./Hand.css";
import Draggable from 'react-draggable'
import { FaSleigh } from 'react-icons/fa';

function Hand(props) {

    var EO = false;
    var renderFor450 = window.screen.width <= 450;

    var fixedOffset;

    if (renderFor450)
    {
        fixedOffset = 25;
    }
    else
    {
        fixedOffset = 50;
    }

    const createCard = (card, offset) => {
        let nodeRef = React.createRef();
        return <Draggable nodeRef = {nodeRef} onStop = {() => DragHandlerLate(nodeRef, offset)}><img ref = {nodeRef} src = {process.env.PUBLIC_URL + card + ".png"} className = "cardMine" alt = "king1" style = {{left: offset*fixedOffset, transform: "translate(0,0)"}}/></Draggable>
    }

    const mapCards = (handArray) => {
        let offsets = [];
        for (let i = 0; i < handArray.length; i++) {
            offsets[i] = 1;
        } 
        let mappedHand = handArray.map(createCard, offsets);
        return mappedHand
    }

    const DragHandlerLate = (ref, pos1) => {
        setTimeout(DragHandler, 1, ref, pos1);
    }
    

    var HandRender = mapCards(props.hand);

    const playAttempt = (pos) => {
        props.playCard(pos)
    }

    const discAttempt = (pos) => {
        props.discAttempt(pos)
        EO = true
    }

    const DragHandler = (ref, pos1) => { 
        if (!EO)
        {
            if (!renderFor450)
            {
                let x = ref.current.getBoundingClientRect().x + document.documentElement.scrollLeft;
                let y = ref.current.getBoundingClientRect().y + document.documentElement.scrollTop;
                
                // PLAY ATTEMPT
                if (y > 300 && y < 450 && x > 440 && x < 600 && props.playCycleFlag && parseInt(props.myspot, 10) === props.waitingOn2Play)
                {
                    playAttempt(pos1)
                }

                // DISC ATTEMPT
                else if (y > 680 && y < 770 && x > 70 && x < 140 && (props.discCycle || props.fca))
                {
                    discAttempt(pos1)
                }

                else
                {
                    if (x < 250)
                    {
                        x = 250;
                    }
                    if (x > 680) 
                    {
                        x = 680;
                    }
                    let pos2 = parseInt((x - 250)/50, 10);
                    pos1 = Math.min(pos1, props.hand.length - 1)
                    pos2 = Math.min(pos2, props.hand.length - 1)
                    EO = true
                    props.editOrder(pos1, pos2)
                }
            }
            else 
            {
                let x = ref.current.getBoundingClientRect().x + document.documentElement.scrollLeft;
                let y = ref.current.getBoundingClientRect().y + document.documentElement.scrollTop;

                // PLAY ATTEMPT
                if (y > 400 && y < 480 && x > 90 && x < 200 && props.playCycleFlag && parseInt(props.myspot, 10) === props.waitingOn2Play)
                {
                    playAttempt(pos1)
                }

                // DISC ATTEMPT
                else if (y > 710 && y < 780 && x > 0 && x < 40 && (props.discCycle || props.fca))
                {
                    discAttempt(pos1)
                }

                else
                {
                    if (x < 50)
                    {
                        x = 50;
                    }
                    if (x > 250) 
                    {
                        x = 250;
                    }
                    let pos2 = parseInt((x - 50)/25, 10);
                    pos1 = Math.min(pos1, props.hand.length - 1)
                    pos2 = Math.min(pos2, props.hand.length - 1)
                    EO = true
                    props.editOrder(pos1, pos2)
                }
            }
        }
    }

    return (
        <main>
            <div className = 'cardBarMine'>
                {/* <img src = {this.props.hand[0]} className = "card" alt = "king1" 
                                    style={{left: 50}}/>
                <img src = {this.props.hand[1]} className = "card" alt = "king1" 
                                    style={{left: 100}}/>
                <img src = {this.props.hand[2]} className = "card" alt = "king1" 
                                    style={{left: 150}}/>
                <img src = {this.props.hand[3]} className = "card" alt = "king1" 
                                    style={{left: 200}}/>
                <img src = {this.props.hand[4]} className = "card" alt = "king1" 
                                    style={{left: 250}}/>
                <img src = {this.props.hand[5]} className = "card" alt = "king1" 
                                    style={{left: 300}}/>
                <img src = {this.props.hand[6]} className = "card" alt = "king1" 
                                    style={{left: 350}}/>
                <img src = {this.props.hand[7]} className = "card" alt = "king1" 
                                    style={{left: 400}}/>
                <img src = {this.props.hand[8]} className = "card" alt = "king1" 
                                    style={{left: 450}}/> */}

                {HandRender}
                </div>
            </main>
    );
};

export default Hand