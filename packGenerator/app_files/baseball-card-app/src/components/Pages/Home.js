import React, { Component } from 'react';
import BackDrop from '../Backdrop/Backdrop';
import Pack from '../Pack/Pack';
import CardBar from '../CardBar/CardBar';
import "./Home.css";
import { NavLink } from "react-router-dom"
import loadingicon from "./loadingicon.gif";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

class Home extends Component {
  state = {
    generate: false,
    fetchingpack: false,
    card1clicked: false,
    card2clicked: false,
    card3clicked: false,
    card4clicked: false,
    card5clicked: false,
    packopen: false,
    name1: null,
    name2: null,
    name3: null,
    name4: null,
    name5: null,
    pic1: null,
    pic2: null,
    pic3: null,
    pic4: null,
    pic5: null,
    b1: false,
    b2: false,
    b3: false,
    b4: false,
    b5: false
  }

  backdropClickHandler = () => {
    this.setState({generate: false});
    this.setState({packopen: false});
  }

  generateHandler = () => {
    this.setState({generate: true});
    if (!this.state.fetchingpack) { 
      this.setState({fetchingpack: true});
      this.getPack();
    }
    if (this.props.signIn) {
      const apiUrl = 'http://45.33.123.172:5000/api/rippack/?username=' + this.props.username
      fetch(apiUrl)
    }
  }

  handleCardClick1 = () => {
    this.setState((prevState) => {
      return {card1clicked: !prevState.card1clicked};
    });
  }

  handleCardClick2 = () => {
    this.setState((prevState) => {
      return {card2clicked: !prevState.card2clicked};
    });
  }

  handleCardClick3 = () => {
    this.setState((prevState) => {
      return {card3clicked: !prevState.card3clicked};
    });
  }

  handleCardClick4 = () => {
    this.setState((prevState) => {
      return {card4clicked: !prevState.card4clicked};
    });
  }

  handleCardClick5 = () => {
    this.setState((prevState) => {
      return {card5clicked: !prevState.card5clicked};
    });
  }

  handlePackClick = () => {
    this.setState({packopen: true});
    this.setState({generate: false});
  }

  handleb1click = () => {
    const apiUrl = 'http://45.33.123.172:5000/api/addcard/?username=' + this.props.username + '&card=' + this.state.pic1
      fetch(apiUrl)
      this.setState({b1:true})
  }

  handleb2click = () => {
    const apiUrl = 'http://45.33.123.172:5000/api/addcard/?username=' + this.props.username + '&card=' + this.state.pic2
      fetch(apiUrl)
      this.setState({b2:true})
  }

  handleb3click = () => {
    const apiUrl = 'http://45.33.123.172:5000/api/addcard/?username=' + this.props.username + '&card=' + this.state.pic3
      fetch(apiUrl)
      this.setState({b3:true})
  }

  handleb4click = () => {
    const apiUrl = 'http://45.33.123.172:5000/api/addcard/?username=' + this.props.username + '&card=' + this.state.pic4
      fetch(apiUrl)
      this.setState({b4:true})
  }

  handleb5click = () => {
    const apiUrl = 'http://45.33.123.172:5000/api/addcard/?username=' + this.props.username + '&card=' + this.state.pic5
      fetch(apiUrl)
      this.setState({b5:true})
  }
  
  getPack = () => {
    const apiUrl = 'http://45.33.123.172:5000/api/getpack/?username=' + this.props.username;
    fetch(apiUrl).then((response) => response.json()).then((data) => {
      if(data.Success) {
        this.setState({name1: data.name1});
        this.setState({name2: data.name2});
        this.setState({name3: data.name3});
        this.setState({name4: data.name4});
        this.setState({name5: data.name5});
        this.setState({pic1: data.pic1});
        this.setState({pic2: data.pic2});
        this.setState({pic3: data.pic3});
        this.setState({pic4: data.pic4});
        this.setState({pic5: data.pic5});
        this.setState({fetchingpack: false});
        this.setState({card1clicked: false});
        this.setState({card2clicked: false});
        this.setState({card3clicked: false});
        this.setState({card4clicked: false});
        this.setState({card5clicked: false});
        this.setState({b1:false});
        this.setState({b2:false});
        this.setState({b3:false});
        this.setState({b4:false});
        this.setState({b5:false});
      }
      else {
        setTimeout(this.getPack(), data.Time * 1000)
      }
    })
  }

  render() {
    let backdrop;
    let generate;
    let cardbar;
    let loadingimage;
    let backbutton;

    if (this.state.generate || this.state.packopen) {
      backdrop = <BackDrop click ={this.backdropClickHandler} />;
    }
    if(this.state.generate && !this.state.fetchingpack) {
      generate = <Pack packstyle packopen = {this.state.packopen} handlePackClick = {this.handlePackClick} fetchingpack = {this.state.fetchingpack}/>;

    }
    if(this.state.packopen) {
      cardbar = <CardBar 
        flipped1={this.state.card1clicked}
        flipped2={this.state.card2clicked}
        flipped3={this.state.card3clicked}
        flipped4={this.state.card4clicked}
        flipped5={this.state.card5clicked}
        handleCardClick1 = {this.handleCardClick1}
        handleCardClick2 = {this.handleCardClick2}
        handleCardClick3 = {this.handleCardClick3}
        handleCardClick4 = {this.handleCardClick4}
        handleCardClick5 = {this.handleCardClick5}
        name1 = {this.state.name1}
        name2 = {this.state.name2}
        name3 = {this.state.name3}
        name4 = {this.state.name4}
        name5 = {this.state.name5}
        pic1 = {this.state.pic1}
        pic2 = {this.state.pic2}
        pic3 = {this.state.pic3}
        pic4 = {this.state.pic4}
        pic5 = {this.state.pic5}
        handleb1click = {this.handleb1click}
        handleb2click = {this.handleb2click}
        handleb3click = {this.handleb3click}
        handleb4click = {this.handleb4click}
        handleb5click = {this.handleb5click}
        b1 = {this.state.b1}
        b2 = {this.state.b2}
        b3 = {this.state.b3}
        b4 = {this.state.b4}
        b5 = {this.state.b5}
        signedIn = {this.props.signedIn}
      />
    }
    if(this.state.fetchingpack && this.state.generate) {
      loadingimage = <img src = {loadingicon} alt = "loadingicon" className = "loading"/>
    }
    if(this.state.generate || this.state.packopen) {
      backbutton = <div className = "back_button_div"><button className = "back_button_style" onClick ={this.backdropClickHandler}><ArrowBackIcon/>Back</button></div>
    }
    return (
       <div className ="app-background">
            {backdrop}
            <main className = "main_style">
                <p>Welcome to packGenerator!</p>
                <p>Learn how to build your collection <NavLink to="/about" className ="navlink">here</NavLink></p>
                <div className = "divbutt"><button className = "button_style" onClick ={this.generateHandler}>Generate</button></div>
            </main>
            {backbutton}
            {generate}
            {loadingimage}
            {cardbar}
        </div>
    );
  }
};

export default Home;