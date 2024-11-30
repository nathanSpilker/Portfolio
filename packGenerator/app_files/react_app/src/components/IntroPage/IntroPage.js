import React, { Component } from 'react';

import "./IntroPage.css";

class intropage extends Component {

    componentDidMount() {
        setTimeout(this.props.scroll, 1000);
    }
    render() {
        let introClasses = 'intro-style';
        if (!this.props.onIntro) {
            introClasses = 'intro-style scrolled'
        }
        return (
            <nav className={introClasses} onClick={this.props.scroll}>
                <h6>
                    packGenerator
        </h6>
                {/* <p>
                generate and rip packs of baseball cards
        </p>
            <p>
                build your online collection
        </p>
            <p>
                pull over 1 million unique cards
        </p>
        <main className = "space"> 
                click anywhere to enter
        </main> */}
            </nav>
        );
    }
};

export default intropage;