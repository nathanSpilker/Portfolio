import React, { Component } from 'react';
import "./MyCollection.css";
import CollectionPage from "../CollectionPage/CollectionPage";

class myCollection extends Component {
    

    render() {
        let collectionpage;
        if(this.state.page != pages) {
            collectionpage = <CollectionPage 
                pictures = {this.props.pictures.slice((this.state.page - 1) * 50), (this.state.page*50)}/>
        }
        else {
            collectionpage = <CollectionPage 
                pictures = {this.props.pictures.slice(((this.state.page - 1) * 50), this.props.pictures.length())}/>
        }
        return(
            {collectionpage}
        );
    }
};

export default myCollection