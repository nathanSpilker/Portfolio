import React from 'react';
import './TradingBar.css';

const TradingBar = props => {

    return (
        <div className = "fullbar">
            <div className="toptext">You're offering:</div>
            <div className="tbarclass"></div>
            <div className="bottomtext">They're offering:</div>
            <div className="tbarclass"></div>
            <div className="submitbutton"><button>Submit</button></div>
        </div>
    );
};

export default TradingBar;