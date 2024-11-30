import React, { Component } from 'react';
import Image from './Image';
import './CollectionPage.css';
import Larrow from '@material-ui/icons/ArrowLeft';
import Rarrow from '@material-ui/icons/ArrowRight';
import LLarrow from '@material-ui/icons/ArrowBackIos';
import RRarrow from '@material-ui/icons/ArrowForwardIos';
import BackDrop from '../Backdrop/Backdrop';
import ReactCardFlip from 'react-card-flip';
import CancelIcon from '@material-ui/icons/Cancel';
import StarBorderIcon from '@material-ui/icons/StarBorder';

class CollectionPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collection: [["placeholder.png", "This is a placeholder", 0]],
            currentpage: 1,
            pages: 1,
            totalcards: 0,
            display: false,
            displayimg: null,
            name: null,
            isMounted: false,
            flipped: false,
            picture: null,
            id: null,
            removed: false
        }
    }

    componentDidMount() {
        const pageapiUrl = 'http://45.33.123.172:5000/api/pages/?username=' + this.props.username

        fetch(pageapiUrl).then((response) => response.json()).then((data) => {
            this.setState({ pages: data.pages });
        })
        const cardsapiUrl = 'http://45.33.123.172:5000/api/gettotalcards/?username=' + this.props.username
        fetch(cardsapiUrl).then((response) => response.json()).then((data) => {
            this.setState({ totalcards: data.total });
        })
        this.updateCards(1)
        this.setState({ isMounted: true })
    }

    createImage = (image) => {
        return <Image source={process.env.PUBLIC_URL + '/CardImages/Fronts/' + image[0]} key={image[2]} name={image[1]} display={this.display} pic={image[0]} id={image[2]} />;
    }

    createImages = (collection) => {
        return collection.map(this.createImage);
    }
    display = (source, cardtext, pic, index) => {
        if (this.state.isMounted) {
            this.setState({ display: true })
            this.setState({ displayimg: source })
            this.setState({ name: cardtext })
            this.setState({ picture: pic })
            this.setState({ id: index })
            this.setState({ removed: false })
        }
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
    backdropClickHandler = () => {
        this.setState({ display: false })
        this.setState({ flipped: false })
        this.setState({ removed: false })
    }
    handleCardClick = () => {
        this.setState({ flipped: !this.state.flipped })
    }
    handleRemove = () => {
        const removeapiUrl = 'http://45.33.123.172:5000/api/removecard/?username=' + this.props.username + '&password=' + this.props.password + '&index=' + this.state.id
        this.setState({removed: true})
        fetch(removeapiUrl).then((response) => response.json()).then((data) => {
            this.updateCardtotal();
            this.updatePagetotal();
            this.updateCards(this.state.currentpage);
        })
    }
    updateCards = (page) => {
        const cardapiUrl = 'http://45.33.123.172:5000/api/getpage/?username=' + this.props.username + '&page=' + page
        fetch(cardapiUrl).then((response) => response.json()).then((data) => {
            this.setState({ collection: data.collection })
        })
    }
    updateCardtotal = () => {
        const cardsapiUrl = 'http://45.33.123.172:5000/api/gettotalcards/?username=' + this.props.username
        fetch(cardsapiUrl).then((response) => response.json()).then((data) => {
            this.setState({ totalcards: data.total });
        })
    }
    updatePagetotal = () => {
        const pageapiUrl = 'http://45.33.123.172:5000/api/pages/?username=' + this.props.username
        fetch(pageapiUrl).then((response) => response.json()).then((data) => {
            this.setState({ pages: data.pages });
        })
    }
    render() {
        let removebutton;
        let displaycard;
        let favbutton;
        if (this.props.myuser === this.props.username) {
            if (this.state.removed) {
                removebutton = <button>Removed</button>
            }
            else {
                removebutton = <button onClick={this.handleRemove}><CancelIcon />   Remove from collection</button>
            }
            favbutton = <button><StarBorderIcon />   Make favorite</button>
        }
        if (this.state.display) {
            displaycard =
                <div className="display_box" >
                    <div className="display_">
                        <div className="bd" onClick={this.backdropClickHandler}><BackDrop /></div>
                        <div className="goldborder">
                            <div className="card_lattice">
                                <div className="card_box">
                                    <div className="card_flip">
                                        <ReactCardFlip isFlipped={this.state.flipped} flipDirection="vertical" className="card_flip_obj">
                                            <img onClick={this.handleCardClick} src={this.state.displayimg} className="card_img" alt="front" />
                                            <img onClick={this.handleCardClick} src={process.env.PUBLIC_URL + '/CardImages/Backs/' + this.state.picture} className="card_img" alt="back" />
                                        </ReactCardFlip>
                                    </div>
                                    <p>{this.state.name}</p>
                                </div>
                            </div>
                        </div>
                        <div className="buttondiv">
                            <div className="b1c">{favbutton}</div>
                        </div>
                        <div className="buttondiv">
                            <div className="b2c">{removebutton}</div>
                        </div>
                    </div>
                </div>
        }
        return (
            <div className ="collection_background">
                {displaycard}
                <div className="header"><h6>{this.props.username}'s Collection</h6></div>
                <div className="total"><p>Total cards: {this.state.totalcards}</p></div>
                <div className="nav_style">
                    <LLarrow className="outerleft" onClick={this.handleFirstPage} />
                    <Larrow className="inner" fontSize="large" onClick={this.handlePreviousPage} />
                    <span>{this.state.currentpage}</span>
                    <Rarrow className="inner" fontSize="large" onClick={this.handleNextPage} />
                    <RRarrow className="outer" onClick={this.handleLastPage} />
                </div>
                <div className="imageblock">
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

        );
    }
};

export default CollectionPage;