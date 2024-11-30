import React, { Component } from 'react';
import './SearchPage.css';
import PersonIcon from '@material-ui/icons/Person';
import SportsBaseballIcon from '@material-ui/icons/SportsBaseball';
import SearchBlock from './SearchBlock';
import { withRouter } from "react-router-dom";
import Image from '../CollectionPage/Image';

class SearchPage extends Component {
    state = {
        search: null,
        users: true,
        query: null,
        haveresults: false,
        results: [],
        collection: []
    }
    searchHandler = (event) => {
        this.setState({ query: event.target.value })
    }
    handleToggle = () => {
        // this.setState({ users: !this.state.users })
    }
    searchgo = () => {
        if (this.state.users) {
            const searchapiUrl = 'http://45.33.123.172:5000/api/searchuser/?query=' + this.state.query
            fetch(searchapiUrl).then((response) => response.json()).then((data) => {
                this.setState({results: data.results})
                this.setState({haveresults: true})
            })
        }
        else {
            const searchapiUrl = 'http://45.33.123.172:5000/api/searchcards/?query=' + this.state.query
            fetch(searchapiUrl).then((response) => response.json()).then((data) => {
                this.setState({collection: data.results})
                this.setState({haveresults: true})
            })
        }
    }
    renderSearchResults = (results) => {
        return results.map(this.createsearchresult)
    }
    createsearchresult = (result) => {
        return <SearchBlock click = {this.userClickHandler} className = "result" username = {result[0]} cards = {result[1]} key = {result[0]}/>
    }
    userClickHandler = (username) => {
        this.props.collClick(username)
        this.props.history.push("/collection")
    }

    createImage = (image) => {
        return <Image source={process.env.PUBLIC_URL + '/CardImages/Fronts/' + image[0]} key={image[2]} name={image[1]} />;
    }
    createImages = (collection) => {
        return collection.map(this.createImage);
    }

    render() {
        let togglebutton;
        let placeholder;
        let searchresults;
        let cardresults;

        if (this.state.haveresults) {
            if (this.state.users) {
                searchresults = this.renderSearchResults(this.state.results)
            }
            else {
                cardresults = this.createImages(this.state.collection)
            }
        }
        if (this.state.users) {
            togglebutton = <div onClick={this.handleToggle}>Users <PersonIcon /></div>
            placeholder = "Search for Users..."
        }
        else {
            togglebutton = <div onClick={this.handleToggle}>Cards <SportsBaseballIcon /></div>
            placeholder = "Search for Cards..."
        }
        return (
            <div>
                <div className="fullsearch">
                    <h1 className="searchheader">Search packGenerator</h1>
                    <div className="togglediv">
                        <span>Search for:  </span>
                        <div className="searchbutton"><button>{togglebutton}</button></div>
                    </div>
                    <form className="form1" id="searchform">
                        <input
                            type="text"
                            className="inputsearch"
                            id="addInput"
                            placeholder={placeholder}
                            onChange={this.searchHandler}
                        />
                    </form>
                    <div className="gobutton" onClick = {this.searchgo}><button>SEARCH</button></div>
                </div>
                <div className="result_div">{searchresults}</div>
                <div className="searchblock_cards">
                    {cardresults}
                </div>
            </div>
        );
    }
};

export default withRouter(SearchPage);