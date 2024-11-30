import React, { Component } from 'react';
import Image from './TradingImage';
import './Trading.css';
import Larrow from '@material-ui/icons/ArrowLeft';
import Rarrow from '@material-ui/icons/ArrowRight';
import LLarrow from '@material-ui/icons/ArrowBackIos';
import RRarrow from '@material-ui/icons/ArrowForwardIos';
import TradingBar from './TradingBar'

class TradingPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collection: [["placeholder.png", "This is a placeholder", 0]],
            currentpage: 1,
            pages: 1,
            menames: [],
            mepics: [],
            meids: [],
            unames: [],
            upics: [],
            uids: []
        }
    }

    componentDidMount() {
        const pageapiUrl = 'http://www.45.33.123.172:5000/api/pages/?username=' + this.props.username

        fetch(pageapiUrl).then((response) => response.json()).then((data) => {
            this.setState({ pages: data.pages });
        })
        this.updateCards(1)
    }

    addcardme = (name, imgno, index) => {

    }

    createImage = (image) => {
        return <Image source={process.env.PUBLIC_URL + '/CardImages/Fronts/' + image[0]} key={image[2]} name={image[1]} />;
    }
    createImages = (collection) => {
        return collection.map(this.createImage);
    }
    handleLastPage = () => {
        if (this.state.currentpage < this.state.pages) {
            this.setState({ currentpage: this.state.pages })
            this.updateCards(this.state.pages)
        }
    }
    handleNextPage = () => {
        if (this.state.currentpage < this.state.pages) {
            this.setState({ currentpage: this.state.currentpage + 1 })
            this.updateCards(this.state.currentpage + 1)
        }
    }
    handleFirstPage = () => {
        if (this.state.currentpage > 1) {
            this.setState({ currentpage: 1 })
            this.updateCards(1)
        }
    }
    handlePreviousPage = () => {
        if (this.state.currentpage > 1) {
            this.setState({ currentpage: this.state.currentpage - 1 })
            this.updateCards(this.state.currentpage - 1)
        }
    }
    updateCards = (page) => {
        const cardapiUrl = 'http://www.45.33.123.172:5000/api/getpage/?username=' + this.props.username + '&page=' + page
        fetch(cardapiUrl).then((response) => response.json()).then((data) => {
            this.setState({ collection: data.collection })
        })
    }
    render() {
        return (
            <div>
                <div className ="page">
                    <div className="collection_background_t">
                        <div className="header_t"><h6>Your Collection</h6></div>
                        <div className="nav_style">
                            <LLarrow className="outerleft" onClick={this.handleFirstPage} />
                            <Larrow className="inner" fontSize="large" onClick={this.handlePreviousPage} />
                            <span>{this.state.currentpage}</span>
                            <Rarrow className="inner" fontSize="large" onClick={this.handleNextPage} />
                            <RRarrow className="outer" onClick={this.handleLastPage} />
                        </div>
                        <div className="imageblock_t">
                            {this.createImages(this.state.collection)}
                        </div>
                        <div className="nav_style_bottom">
                            <LLarrow className="outerleft" onClick={this.handleFirstPage} />
                            <Larrow className="inner" fontSize="large" onClick={this.handlePreviousPage} />
                            <span>{this.state.currentpage}</span>
                            <Rarrow className="inner" fontSize="large" onClick={this.handleNextPage} />
                            <RRarrow className="outer" onClick={this.handleLastPage} />
                        </div>
                    </div>
                    <div className = "bardiv">
                        <TradingBar />
                    </div>
                    <div className="collection_background_t">
                        <div className="header_t"><h6>Their Collection</h6></div>
                        <div className="nav_style">
                            <LLarrow className="outerleft" onClick={this.handleFirstPage} />
                            <Larrow className="inner" fontSize="large" onClick={this.handlePreviousPage} />
                            <span>{this.state.currentpage}</span>
                            <Rarrow className="inner" fontSize="large" onClick={this.handleNextPage} />
                            <RRarrow className="outer" onClick={this.handleLastPage} />
                        </div>
                        <div className="imageblock_t">
                            {this.createImages(this.state.collection)}
                        </div>
                        <div className="nav_style_bottom">
                            <LLarrow className="outerleft" onClick={this.handleFirstPage} />
                            <Larrow className="inner" fontSize="large" onClick={this.handlePreviousPage} />
                            <span>{this.state.currentpage}</span>
                            <Rarrow className="inner" fontSize="large" onClick={this.handleNextPage} />
                            <RRarrow className="outer" onClick={this.handleLastPage} />
                        </div>
                    </div>
                </div>

            </div>
        );
    }
};

export default TradingPage;