import React from 'react';
import "./BidButton.css";
import { FaMoon } from "react-icons/fa";
import { BsSuitClubFill, BsSuitDiamondFill,  BsSuitSpadeFill,  BsSuitHeartFill  } from "react-icons/bs";

const BidButton = props =>{

    var renderFor450 = window.screen.width <= 450;
    let dealButtonUI;
    let bidButtonUI;
    let suitButtonUI;
    let discardButtonUI;
    let playButtonUI;

    if (props.wfd || props.dealinganim)
    {
        var textString;
        var dealButton;
        if (props.myspot === String(props.currentDealer))
        {
            
            textString = "Waiting for you to deal..."
            dealButton = <button onClick={() => props.dealHandler()} className = "dealButton">DEAL</button>
        }
        else 
        {
            
            const userStrings = [props.user1, props.user2, props.user3, props.user4]
            textString = "Waiting for " + userStrings[props.currentDealer - 1] + " to deal..."
        }
        dealButtonUI = <div>
        <div className = 'textClass'>{textString}</div>
        {dealButton}
        </div>
    }
    else if (props.bidCycle)
    {   
        var whoBidding;
        var allthebuttons;
        const userStrings = [props.user1, props.user2, props.user3, props.user4]
        if (parseInt(props.myspot, 10) === props.currentBidder)
        {
            whoBidding =  "Waiting for you to bid..."
            if (!renderFor450)
            {
                allthebuttons = <div>
                <button className = 'passButton' onClick={() => props.handleBidClick("pass", props.username, props.gameCode)}>PASS</button>
                <button style={{left: '15px', backgroundColor: '#67FC00'}} className = 'ButtonStyle' onClick={() => props.handleBidClick("5", props.username, props.gameCode)}>5</button>
                <button style={{left: '70px', backgroundColor: '#CAFC00'}} className = 'ButtonStyle' onClick={() => props.handleBidClick("6", props.username, props.gameCode)}>6</button>
                <button style={{left: '125px', backgroundColor: '#F8FC00'}} className = 'ButtonStyle' onClick={() => props.handleBidClick("7", props.username, props.gameCode)}>7</button>
                <button style={{left: '180px', backgroundColor: '#FCC700'}} className = 'ButtonStyle' onClick={() => props.handleBidClick("8", props.username, props.gameCode)}>8</button>
                <button style={{left: '235px', backgroundColor: '#FC9900'}} className = 'ButtonStyle' onClick={() => props.handleBidClick("9", props.username, props.gameCode)}>9</button>
                <button style={{left: '290px', backgroundColor: '#FC5F00'}} className = 'ButtonStyle' onClick={() => props.handleBidClick("10", props.username, props.gameCode)}>10</button>
                {/* <button style={{left: '345px', backgroundColor: '#FC2A00'}} className = 'ButtonStyle' onClick={() => props.handleBidClick("moon", props.username, props.gameCode)}><FaMoon/></button> */}
                </div>
            }
            else
            {
                allthebuttons = <div>
                <button className = 'passButton' onClick={() => props.handleBidClick("pass", props.username, props.gameCode)}>PASS</button>
                <button style={{left: '20px', backgroundColor: '#67FC00'}} className = 'ButtonStyle' onClick={() => props.handleBidClick("5", props.username, props.gameCode)}>5</button>
                <button style={{left: '65px', backgroundColor: '#CAFC00'}} className = 'ButtonStyle' onClick={() => props.handleBidClick("6", props.username, props.gameCode)}>6</button>
                <button style={{left: '110px', backgroundColor: '#F8FC00'}} className = 'ButtonStyle' onClick={() => props.handleBidClick("7", props.username, props.gameCode)}>7</button>
                <button style={{left: '155px', backgroundColor: '#FCC700'}} className = 'ButtonStyle' onClick={() => props.handleBidClick("8", props.username, props.gameCode)}>8</button>
                <button style={{left: '200px', backgroundColor: '#FC9900'}} className = 'ButtonStyle' onClick={() => props.handleBidClick("9", props.username, props.gameCode)}>9</button>
                <button style={{left: '245px', backgroundColor: '#FC5F00'}} className = 'ButtonStyle' onClick={() => props.handleBidClick("10", props.username, props.gameCode)}>10</button>
                {/* <button style={{left: '290px', backgroundColor: '#FC2A00'}} className = 'ButtonStyle' onClick={() => props.handleBidClick("moon", props.username, props.gameCode)}><FaMoon/></button> */}
                </div>
            }
        }
        else
        {
            whoBidding =  "Waiting for " + userStrings[parseInt(props.currentBidder, 10) - 1] + " to bid..."
        }

        var whoHasBid;
        console.log(props.bidHolder)
        if (props.bid === "0")
        {
            whoHasBid = "No one has bid yet."
        }
        else if (props.bidHolder !== props.myspot)
        {
            whoHasBid = userStrings[parseInt(props.bidHolder, 10) - 1] + " has the bid at " + props.bid
        }
        else
        {
            whoHasBid = "You have the bid at " + props.bid
        }


        bidButtonUI = <div>
        <div className = 'textClass'>{whoBidding}</div>
        <div className = 'textClass'>{whoHasBid}</div>
        {allthebuttons}
        </div>
    }
    else if (props.suitCycle)
    {
        var bidWinnerText;
        var suitPickText;
        var suitPickText2;
        var suitButtons;
        const userStrings = [props.user1, props.user2, props.user3, props.user4]
        if (parseInt(props.myspot, 10) === props.bidWinner)
        {
            bidWinnerText = "You won the bid at " + props.bid + "!"
            suitPickText = "Pick a suit:"
            if (!renderFor450)
            {
                suitButtons = <div>
                    <button style={{left: '45px', backgroundColor: '#83a07b'}} className = 'ButtonStyleSuit' onClick={() => props.handleSuitClick("spades")}><BsSuitSpadeFill/></button>
                    <button style={{left: '135px', backgroundColor: '#83a07b'}} className = 'ButtonStyleSuit' onClick={() => props.handleSuitClick("clubs")}><BsSuitClubFill/></button>
                    <button style={{left: '225px', backgroundColor: '#83a07b'}} className = 'ButtonStyleSuit' onClick={() => props.handleSuitClick("diamonds")}><BsSuitDiamondFill/></button>
                    <button style={{left: '315px', backgroundColor: '#83a07b'}} className = 'ButtonStyleSuit' onClick={() => props.handleSuitClick("hearts")}><BsSuitHeartFill/></button>
                </div>
            }    
            else
            {
                suitButtons = <div>
                    <button style={{left: '35px', backgroundColor: '#83a07b'}} className = 'ButtonStyleSuit' onClick={() => props.handleSuitClick("spades")}><BsSuitSpadeFill/></button>
                    <button style={{left: '115px', backgroundColor: '#83a07b'}} className = 'ButtonStyleSuit' onClick={() => props.handleSuitClick("clubs")}><BsSuitClubFill/></button>
                    <button style={{left: '195px', backgroundColor: '#83a07b'}} className = 'ButtonStyleSuit' onClick={() => props.handleSuitClick("diamonds")}><BsSuitDiamondFill/></button>
                    <button style={{left: '275px', backgroundColor: '#83a07b'}} className = 'ButtonStyleSuit' onClick={() => props.handleSuitClick("hearts")}><BsSuitHeartFill/></button>
                </div>
            }
        }

        else
        {
            bidWinnerText = userStrings[parseInt(props.bidWinner, 10) - 1] + " won the bid at " + props.bid + "!"
            suitPickText = "Waiting for " + userStrings[parseInt(props.bidWinner, 10) - 1]
            suitPickText2 = "to pick a suit..."
        }
        suitButtonUI = <div>
            <div className = 'textClass'>{bidWinnerText}</div>
            <div className = 'textClass'>{suitPickText}</div>
            <div className = 'textClass'>{suitPickText2}</div>
            {suitButtons}
            </div>

    }

    else if (props.discCycle || props.confirmedWaiting || props.fillCycle)
    {
        const userStrings = [props.user1, props.user2, props.user3, props.user4]

        var bidWinnerText;
        if (parseInt(props.myspot, 10) === props.bidWinner && !props.fillCycle)
        {
            bidWinnerText = "You have the bid at " + props.bid + "!"
        }
        else if (!props.fillCycle)
        {
            bidWinnerText = userStrings[parseInt(props.bidWinner, 10) - 1] + " has the bid at " + props.bid + "!"

        }
        var suitText;
        if (!props.fillCycle)
        {
            var suitText = "The suit is " + props.suit + "."
        }
        var ctext;
        var cbutton;
        var ft1;
        var ft2;
        var ft3;
        var ft4;
        var passButton;

        if (props.discCycle)
        {
            ctext = "Confirm when done discarding"
            cbutton = <button onClick={() => props.confirmHandler()} className = "confirmButton">CONFIRM</button>
        }
        else if (props.confirmedWaiting)
        {
            ctext = "Waiting on other players to confirm"
            cbutton = <div className = 'confirmButtonPressed'>{"Confirmed"}</div>
        }
        else if (props.fillCycle)
        {

            var fills = [props.fill1, props.fill2, props.fill3, props.fill4]
            if (fills[props.currentDealer % 4] === 1)
            {
                ft1 =  userStrings[props.currentDealer % 4] + " took 1 card."
            }
            else
            {
                ft1 =  userStrings[props.currentDealer % 4] + " took " + fills[props.currentDealer % 4] + " cards."
            }

            if (fills[(props.currentDealer + 1) % 4] === 1)
            {
                ft2 =  userStrings[(props.currentDealer + 1) % 4] + " took 1 card."
            }
            else
            {
                ft2 =  userStrings[(props.currentDealer + 1) % 4] + " took " + fills[(props.currentDealer + 1) % 4] + " cards."
            }

            if (fills[(props.currentDealer + 2) % 4] === 1)
            {
                ft3 =  userStrings[(props.currentDealer + 2) % 4] + " took 1 card."
            }
            else
            {
                ft3 =  userStrings[(props.currentDealer + 2) % 4] + " took " + fills[(props.currentDealer + 2) % 4] + " cards."
            }

            if (fills[(props.currentDealer + 3) % 4] === 1)
            {
                ft4 =  userStrings[(props.currentDealer + 3) % 4] + " took 1 card."
            }
            else
            {
                ft4 =  userStrings[(props.currentDealer + 3) % 4] + " took " + fills[(props.currentDealer + 3) % 4] + " cards."
            }

            if (!props.passed && props.bidWinner === parseInt(props.myspot, 10))
            {
                passButton = <button onClick={() => props.passHandler()} className = "passButton2">PASS TO TEAMMATE</button>
            }

        }

        discardButtonUI = <div>
        <div className = 'textClass'>{bidWinnerText}</div>
        <div className = 'textClass'>{suitText}</div>
        <div className = 'textClass'>{ctext}</div>
        <div className = 'textClass'>{ft1}</div>
        <div className = 'textClass'>{ft2}</div>
        <div className = 'textClass'>{ft3}</div>
        <div className = 'textClass'>{ft4}</div>
        {cbutton}
        {passButton}
        </div>

    }
    else if (props.playCycleFlag)
    {

        const userStrings = [props.user1, props.user2, props.user3, props.user4]

        var bidWinnerText;
        // if (parseInt(props.myspot, 10) === props.bidWinner)
        // {
        //     bidWinnerText = "You have the bid at " + props.bid + "!"
        // }
        // else
        // {
        //     bidWinnerText = userStrings[parseInt(props.bidWinner, 10) - 1] + " has the bid at " + props.bid + "!"

        // }

        // var suitText = "The suit is " + props.suit + "."

        var playIndicator;

        if (parseInt(props.myspot, 10) === props.waitingOn2Play && !props.trickWinnerCycle)
        {
            playIndicator = "Waiting on you to play."
        }
        else if (!props.trickWinnerCycle)
        {
            playIndicator = "Waiting on " + userStrings[parseInt(props.waitingOn2Play, 10) - 1] + " to play."
        }
        else
        {
            playIndicator = userStrings[parseInt(props.trickWinner, 10) - 1] + " won the hand."
        }

        playButtonUI = <div>
        <div className = 'textClass'>{bidWinnerText}</div>
        <div className = 'textClass'>{suitText}</div>
        <div className = 'textClassPlay'>{playIndicator}</div>
        </div>
    }


    return (
        <div className = 'ButtonBox'>
            {bidButtonUI}
            {dealButtonUI}
            {suitButtonUI}
            {discardButtonUI}
            {playButtonUI}
            </div>
    );
};

export default BidButton
