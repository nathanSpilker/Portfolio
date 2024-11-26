import React, { Component } from 'react';
import "./OtherHand.css";
import CardBack from "./CardBack.jpg"

var renderFor450 = window.screen.width <= 450;

var fixedOffset;

if (renderFor450)
{
    fixedOffset = 10;
}
else
{
    fixedOffset = 30
}

class OtherHand extends Component {



    render() {
        let img1;
        let img2;
        let img3;
        let img4;
        let img5;
        let img6;
        let img7;
        let img8;
        let img9; 

        if (this.props.cardCount >= 1) {
            img1 = <img src = {CardBack} className = "cardBack" alt = "cardBack" style={{left: 1*fixedOffset}}/>
        }
        if (this.props.cardCount >= 2) {
            img2 = <img src = {CardBack} className = "cardBack" alt = "cardBack" style={{left: 2*fixedOffset}}/>
        }
        if (this.props.cardCount >= 3) {
            img3 = <img src = {CardBack} className = "cardBack" alt = "cardBack" style={{left: 3*fixedOffset}}/>
        }
        if (this.props.cardCount >= 4) {
            img4 = <img src = {CardBack} className = "cardBack" alt = "cardBack" style={{left: 4*fixedOffset}}/>
        }
        if (this.props.cardCount >= 5) {
            img5 = <img src = {CardBack} className = "cardBack" alt = "cardBack" style={{left: 5*fixedOffset}}/>                                                                                                                                                                                                                                                                                 
        }
        if (this.props.cardCount >= 6) {
            img6 = <img src = {CardBack} className = "cardBack" alt = "cardBack" style={{left: 6*fixedOffset}}/>
        }
        if (this.props.cardCount >= 7) {
            img7 = <img src = {CardBack} className = "cardBack" alt = "cardBack" style={{left: 7*fixedOffset}}/>
        }
        if (this.props.cardCount >= 8) {
            img8 = <img src = {CardBack} className = "cardBack" alt = "cardBack" style={{left: 8*fixedOffset}}/>
        }
        if (this.props.cardCount >= 9) {
            img9 = <img src = {CardBack} className = "cardBack" alt = "cardBack" style={{left: 9*fixedOffset}}/>
        }
        return (
            <main>
                <div className = 'cardBar'>
                    {img1}
                    {img2}
                    {img3}
                    {img4}
                    {img5}
                    {img6}
                    {img7}
                    {img8}
                    {img9}
                    </div>
                </main>
        );
    }
};

export default OtherHand
