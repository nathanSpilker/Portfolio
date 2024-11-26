import React from 'react';
import "./WinnerCard.css";
import AvatarIcon from '../AvatarIcon/AvatarIcon';

const WinnerCard = props =>{

    let WinnerText;
    let Icon1;
    let Icon2;

    const doNothing = () => {

    }


    // if (props.winningTeam == 1 || true)
    if (props.gameOverFlag && props.winningTeam == 1)
    {
        WinnerText = props.user1 + " and " + props.user3 + " win!"
        if (props.lcode1 != null && props.lcode3 != null)
        {
            Icon1 = 
                <div className = "iconWrapper1">
                <AvatarIcon codeKey = {props.lcode1}
                    width = '70px' 
                    height = '70px'  
                    handleAvatarClick = {() => doNothing()}></AvatarIcon>
                    </div>
            Icon2 = 
                <div className = "iconWrapper2">
                <AvatarIcon codeKey = {props.lcode3}
                    width = '70px' 
                    height = '70px'  
                    handleAvatarClick = {() => doNothing()}></AvatarIcon>
                    </div>
        }
    }
    else if (props.gameOverFlag && props.winningTeam == 2)
    {
        WinnerText = props.user2 + " and " + props.user4 + " win!"
        if (props.lcode2 != null && props.lcode4 != null)
        {
            Icon1 = 
                <div className = "iconWrapper1">
                <AvatarIcon codeKey = {props.lcode2}
                    width = '70px' 
                    height = '70px'  
                    handleAvatarClick = {() => doNothing()}></AvatarIcon>
                    </div>
            Icon2 = 
                <div className = "iconWrapper2">
                <AvatarIcon codeKey = {props.lcode4}
                    width = '70px' 
                    height = '70px'  
                    handleAvatarClick = {() => doNothing()}></AvatarIcon>
                    </div>
        }
    }



    return (
        <div className = "WinnerBox">
            <div className = "WinnerText">{WinnerText}</div>
            {Icon1}
            {Icon2}
            <div className = "RestartDiv"><button onClick = {() => props.playAgain()} className = "RestartButton">Play Again</button></div>
            </div>
    );

};

export default WinnerCard