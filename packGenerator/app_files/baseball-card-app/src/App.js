import React, { Component } from 'react';
import Toolbar from './components/Toolbar/Toolbar';
import "./App.css";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Error from "./components/Pages/Error";
import RegisterPage from "./components/Pages/RegisterPage";
import Home from "./components/Pages/Home";
import SideDrawer from './components/SideDrawer/SideDrawer';
import IntroPage from './components/IntroPage/IntroPage';
import BackDrop from './components/Backdrop/Backdrop';
import LoginPage from './components/Pages/LoginPage';
import CollectionPage from './components/CollectionPage/CollectionPage';
// import TradingPage from './components/Trading/Trading';
import SearchPage from './components/SearchPage/SearchPage';
import About from './components/Pages/AboutPage';

class App extends Component {
  
  state = {
    sideDrawerOpen: false,
    onIntro: true,
    signedIn: false,
    username: "",
    password: null,
    viewuser: null
  }

  drawerToggleClickHandler = () => {
    this.setState((prevState) => {
      return {sideDrawerOpen: !prevState.sideDrawerOpen};
    });
  }

  backdropClickHandler = () => {
    this.setState({sideDrawerOpen: false});
  }

  introScrollHandler = () => {
    this.setState({onIntro: false})
  }

  handleSignIn = (user, pass) => {
    this.setState({username: user})
    this.setState({password: pass})
    this.setState({signedIn: true})
  }
  signOut = () => {
    this.setState({signedIn: false})
    this.setState({username: null})
  }
  viewHandler = (username) => {
    this.setState({viewuser: username})
  }
  render() {
    let backdrop;
    let mycoll;
    let myacc;
    let reg;
    let trad;
    let coll;
    let search
  
    if (this.state.sideDrawerOpen) {
      backdrop = <BackDrop click ={this.backdropClickHandler} />;
    }
    if (this.state.signedIn) {
      mycoll = <Route path="/mycollection" component={() => <CollectionPage password = {this.state.password} username = {this.state.username} myuser = {this.state.username}/>} />
      myacc = <Route path="/loginpage" component={() => <CollectionPage username = {this.state.username} myuser = {this.state.username}/>} />
      reg = <Route path="/registerpage" component={() => <CollectionPage username = {this.state.username} myuser = {this.state.username}/>} />
      // trad = <Route path="/trade" component={() => <TradingPage username = {this.state.username}/>} />
      coll = <Route path="/collection" component={() => <CollectionPage password = {this.state.password} username = {this.state.viewuser} myuser = {this.state.username}/>} />
      search = <Route path="/search" component={() => <SearchPage collClick = {this.viewHandler}/>} />
    }
    else {
      mycoll = <Route path="/mycollection" component={() => <LoginPage handleSignIn = {this.handleSignIn}/>} />
      myacc = <Route path="/loginpage" component={() => <LoginPage handleSignIn = {this.handleSignIn}/>} />
      reg = <Route path="/registerpage" component={() => <RegisterPage handleSignIn = {this.handleSignIn} />} />
      trad = <Route path="/trade" component={() => <LoginPage handleSignIn = {this.handleSignIn}/>} />
      coll = <Route path="/collection" component={() => <CollectionPage username = {this.state.viewuser} myuser = {this.state.username}/>} />
      search = <Route path="/search" component={() => <SearchPage collClick = {this.viewHandler}/>} />
    }
  
    return (
        <BrowserRouter>
          <div>
              <Toolbar 
                drawerClickHandler={this.drawerToggleClickHandler} 
                onIntro={this.state.onIntro}
                signedIn={this.state.signedIn}
                username={this.state.username}/>
              <SideDrawer show={this.state.sideDrawerOpen} signOut={this.signOut}/>
              <IntroPage 
                onIntro = {this.state.onIntro}
                scroll = {this.introScrollHandler} />
              {backdrop}
              <Switch>
                <Route path="/" component={() => <Home signedIn = {this.state.signedIn} username = {this.state.username}/>} exact/>
                {reg}
                {myacc}
                {mycoll}
                {trad}
                {coll}
                {search}
                <Route path="/about" component= {About} />
                <Route component = {Error} />
              </Switch>
          </div>
        </BrowserRouter>
    );
  }
};

export default App;
