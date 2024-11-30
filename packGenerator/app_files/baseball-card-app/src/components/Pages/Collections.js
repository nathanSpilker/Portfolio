import React, { Component } from 'react';
import CollectionBlock from '../CollectionPage/CollectionBlock';
import './Collections.css';

class Collections extends Component {
    
    render() {
        return (
            <div className ="collections_style">
                <h6>My Collections</h6>
                <div className ="col_header"><CollectionBlock CollectionName = {"Hank Aaron Autos"} CardNumber = {200}/></div>
            </div>

        );
    }
};

export default Collections;