import React, { Component } from 'react';
import './AboutPage.css';
import { NavLink } from "react-router-dom";

class AboutPage extends Component {
    render() {

        return (
            <div className = "about_full">
                <div className="about_style">
                    <h2>About packGenerator</h2>
                    <p>Welcome to packGenerator! This project gives you the opportunity 
                        to open as many packs of randomly generated baseball cards as you like for free!
                        Get started by creating an account <NavLink to="/registerpage">here.</NavLink>
                        </p>
                    <p>Once your account is made, navigate to the home page of packGenerator
                        to start ripping packs! Once opened, click on the cards to flip them over 
                        and see the front. Click the button below them to add the card to your virtual collection.
                        Currently, you may add as many cards as you like to your collection,
                        but more exciting schemes may take place in the future.
                        Currently we have over 750,000 cards in our database. If you want to see what other
                        collectors are up to, search for other users' collections in the search tab! </p>
                    <p>
                        Trading will hopefully be available soon, as well as fun giveaways, expansions to other 
                        types of trading cards, sub-collections, and of course more baseball cards will be added.
                        Until then, happy packGenerating!
                    </p>
                </div>
            </div>

        );
    }
};

export default AboutPage;