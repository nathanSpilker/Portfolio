import React from 'react';
import "./DisconnectedPage.css";

const DisconnectedPage = props =>{

    let DisconnectText = props.userDisconnect + " disconnected. Waiting for reconnect.";






    return (
        <div className = "DisconnectBox">
            <div className = "DisconnectText">{DisconnectText}</div>
            </div>
    );

};

export default DisconnectedPage