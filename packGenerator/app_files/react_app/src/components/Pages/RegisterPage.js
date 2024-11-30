import React, { Component } from 'react';
import "./RegisterPage.css";
import { withRouter, NavLink} from "react-router-dom";

class registerPage extends Component {
    
    state = {
        username: "",
        password: "",
        email: "",
        fname: "",
        lname: "",
        nofname: false,
        nolname: false,
        noemail: false,
        nouser: false,
        nopassword: false,
        longfname: false,
        longlname: false,
        longemail: false,
        longuser: false,
        longpassword: false,
        fail: false
    }
    firstNameHandler = (event) => {
        this.setState({fname: event.target.value})
    }
    lastNameHandler = (event) => {
        this.setState({lname: event.target.value})
    }
    UsernameHandler = (event) => {
        this.setState({username: event.target.value})
    }
    PasswordHandler = (event) => {
        this.setState({password: event.target.value})
    }
    EmailHandler = (event) => {
        this.setState({email: event.target.value})
    }
    checkNewAccount = () => {
        let failvalve = false
        if(this.state.fname.length === 0) {
            this.setState({nofname: true});
            failvalve = true;
        }
        else {
            this.setState({nofname: false});
        }
        if(this.state.lname.length === 0) {
            this.setState({nolname: true});
            failvalve = true;
        }
        else {
            this.setState({nolname: false});
        }
        if(this.state.email.length === 0) {
            this.setState({noemail: true});
            failvalve = true;
        }
        else {
            this.setState({noemail: false});
        }
        if(this.state.username.length < 5) {
            this.setState({nouser: true});
            failvalve = true;
        }
        else {
            this.setState({nouser: false});
        }
        if(this.state.password.length < 8) {
            this.setState({nopassword: true});
            failvalve = true;
        }
        else {
            this.setState({nopassword: false});
        }
        if(this.state.fname.length > 64) {
            this.setState({longfname: true});
            failvalve = true;
        }
        else {
            this.setState({longfname: false});
        }
        if(this.state.lname.length > 64) {
            this.setState({longlname: true});
            failvalve = true;
        }
        else {
            this.setState({longlname: false});
        }
        if(this.state.email.length > 256) {
            this.setState({longemail: true});
            failvalve = true;
        }
        else {
            this.setState({longemail: false});
        }
        if(this.state.username.length > 20) {
            this.setState({longuser: true});
            failvalve = true;
        }
        else {
            this.setState({longuser: false});
        }
        if(this.state.password.length > 64) {
            this.setState({longpassword: true});
            failvalve = true;
        }
        else {
            this.setState({longpassword: false});
        }
        if(!failvalve){
            const apiUrl = 'http://45.33.123.172:5000/api/makeaccount/?username=' + this.state.username + '&password=' + this.state.password + '&email=' + this.state.email + '&fname=' + this.state.fname + '&lname=' + this.state.lname
            fetch(apiUrl).then((response) => response.json()).then((data) => {
                if (data.Success) {
                    this.props.handleSignIn(this.state.username, this.state.password)
                    this.props.history.push("/mycollection")
                }
                else
                    this.setState({fail: true})
            })
        }
        else {
            this.setState({fail: false})
        }
    }
    render() {
        let e1;
        let e2;
        let e3;
        let e4;
        let e5;
        let e6;
        let e7;
        let e8;
        let e9;
        let e10;
        let e11;

        if (this.state.nofname) {
            e1 = <p>First name cannot be empty</p>
        }
        if (this.state.nolname) {
            e2 = <p>Last name cannot be empty</p>
        }
        if (this.state.nouser) {
            e3 = <p>Username cannot be less than 5 characters</p>
        }
        if (this.state.nopassword) {
            e4 = <p>Password must be more than 7 characters</p>
        }
        if (this.state.noemail) {
            e5 = <p>Email cannot be empty</p>
        }
        if (this.state.longfname) {
            e6 = <p>First name must be less than 64 characters</p>
        }
        if (this.state.longlname) {
            e7 = <p>Last name must be less than 64 characters</p>
        }
        if (this.state.longuser) {
            e8 = <p>Username must be less than 20 characters</p>
        }
        if (this.state.longpassword) {
            e9 = <p>Password must be less than 64 characters</p>
        }
        if (this.state.longemail) {
            e10 = <p>Email must be less than 256 characters</p>
        }
        if (this.state.fail) {
            e11 = <p>Username already taken</p>
        }

        return(
        <div className = "loginclass">
            <div className = "boxclass">
                <h6>Create an account with packGenerator</h6>
                {e1}
                {e2}
                {e3}
                {e4}
                {e5}
                {e6}
                {e7}
                {e8}
                {e9}
                {e10}
                {e11}
                </div>    
            <div className = "loginbars">
                <h1 className = "title">First Name</h1>
                <div>
                    <form className="form" id="fnameform">
                            <input
                                type="text"
                                className="input"
                                id="addInput"
                                placeholder="Enter your first name..."
                                onChange={this.firstNameHandler}
                                />
                    </form>
                </div>  
                <h1 className = "title">Last Name</h1>
                <div>
                    <form className="form" id="lnameform">
                            <input
                                type="text"
                                className="input"
                                id="addInput"
                                placeholder="Enter your last name..."
                                onChange={this.lastNameHandler}
                                />
                    </form>
                </div>  
                <h1 className = "title">Username</h1>
                <div>
                    <form className="form" id="usernameform">
                            <input
                                type="text"
                                className="input"
                                id="addInput"
                                placeholder="Enter your username..."
                                onChange={this.UsernameHandler}
                                />
                    </form>
                </div>   
                <h1 className = "title">Password</h1>
                <div>
                    <form className="form" id="passwordform">
                            <input
                                type="text"
                                className="input"
                                id="addInput"
                                placeholder="Enter your password..."
                                onChange={this.PasswordHandler}
                                />
                    </form>
                </div>
                <h1 className = "title">Email</h1>
                <div className = "bottombar">
                    <form className="form" id="emailform">
                            <input
                                type="text"
                                className="input"
                                id="addInput"
                                placeholder="Enter your email..."
                                onChange={this.EmailHandler}
                                />
                    </form>
                </div>  
                <div className = "signupbutton">
                    <button className = "button" onClick = {this.checkNewAccount}>Sign up</button></div> 
                <div className = "accntalrdy"><p>Already have an account?  <NavLink to="/loginpage">Sign in</NavLink></p></div>
            </div>
        </div>
        );
    }
};

export default withRouter(registerPage)