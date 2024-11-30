import React, { Component } from 'react';
import "./SearchBlock.css";

class SearchBlock extends Component {

    render() {
        return (
            <div onClick = {() => this.props.click(this.props.username)} className="fullblock">
                <div className="ColBlock">
                    <h1>{this.props.username}</h1>
                    <p>Cards: {this.props.cards}</p>
                </div>
            </div>

        );
    }
};

export default SearchBlock;