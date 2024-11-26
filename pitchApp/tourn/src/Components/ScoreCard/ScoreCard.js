import React from 'react';
import "./ScoreCard.css";
import { BsSuitClubFill, BsSuitDiamondFill,  BsSuitSpadeFill,  BsSuitHeartFill  } from "react-icons/bs";
import { BiSolidLeftArrow } from "react-icons/bi";
import { BiSolidRightArrow } from "react-icons/bi";

const ScoreCard = props =>{

let bidInfo;
let arrow;

if (props.playCycleFlag || props.fillCycle || props.discCycle || props.confirmedWaiting)
{
    if (props.suit == "spades")
    {
        bidInfo = <div className = "bidClass">{props.bid}<BsSuitSpadeFill className = "suitClass"/></div>
    }
    if (props.suit == "hearts")
    {
        bidInfo = <div className = "bidClass">{props.bid}<BsSuitHeartFill className = "suitClass"/></div>
    }
    if (props.suit == "diamonds")
    {
        bidInfo = <div className = "bidClass"> {props.bid}<BsSuitDiamondFill className = "suitClass"/></div>
    }
    if (props.suit == "clubs")
    {
        bidInfo = <div className = "bidClass">{props.bid}<BsSuitClubFill className = "suitClass"/></div>
    }
    if (props.bidWinner == 2 || props.bidWinner == 4)
    {
        arrow = <div className = "rightArrowDiv"><BiSolidRightArrow/></div>
    }
    if (props.bidWinner == 1 || props.bidWinner == 3)
    {
        arrow = <div className = "leftArrowDiv"><BiSolidLeftArrow/></div>
    }
}

    return (
        <div className = "ScoreBox">
            <div className = "team1">
                <div className = "team1User1">{props.user1}</div>
                <div className = "team1User3">{props.user3}</div>
            </div>

            <div className = "emptyDiv">
                {arrow}
                {bidInfo}
            </div>
            
            <div className = "team2">
                <div className = "team2User2">{props.user2}</div>
                <div className = "team2User4">{props.user4}</div>
            </div>

            <div className = "team1">
                <div className = "t1points">{props.t1Pts}</div> 
                <div className = "t1pointsTR">{props.t1PtsThisRound}</div>
            </div>

            <div className = "emptyDiv">
                
            </div>
            
            <div className = "team2">
                <div className = "t2points">{props.t2Pts}</div>
                <div className = "t2pointsTR">{props.t2PtsThisRound}</div>
            </div>

            <div className = "points">POINTS</div>
            <div className = "pointsThisRound">POINTS THIS ROUND</div>



            <div className = "pointsThisRound">POINTS THIS ROUND</div>
            </div>
    );

};

export default ScoreCard