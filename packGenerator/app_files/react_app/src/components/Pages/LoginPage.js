import React, { Component } from 'react';
import "./RegisterPage.css";
import { withRouter, NavLink } from "react-router-dom";

class loginPage extends Component {
    
    state = {
        username: null,
        password: null,
        fail: false
    }
    UsernameHandler = (event) => {
        this.setState({username: event.target.value})
    }
    PassHandler = (event) => {
        this.setState({password: event.target.value})
    }
    checkCredentials = () => {
        const apiUrl = 'http://45.33.123.172:5000/api/login/?username=' + this.state.username + '&password=' + this.state.password
        fetch(apiUrl).then((response) => response.json()).then((data) => {
            if (data.Success) {
                this.props.handleSignIn(this.state.username, this.state.password)
                this.props.history.push("/mycollection")
            }
            else
                this.setState({fail: true})
        })
    }
    render() {
        let fail;
        if (this.state.fail) {
            fail = <p>Incorrect credentials</p>
        }
        return(
        <div className = "loginclass">
            <div className = "boxclass">
                <h6>Sign in to packGenerator</h6>
                {fail}
            </div>    
            <div className = "loginbars">
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
                                onChange={this.PassHandler}
                                />
                    </form>
                </div>
                <div className = "signupbutton">
                    <button onClick = {this.checkCredentials} className = "button">Sign in</button></div> 
                    <div className = "accntalrdy"><p>New user?  <NavLink to="/registerpage">Sign up</NavLink></p></div>
            </div>
        </div>
        );
    }
};

export default withRouter(loginPage)