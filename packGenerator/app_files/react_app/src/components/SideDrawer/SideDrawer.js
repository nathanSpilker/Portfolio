import React from 'react';
import { NavLink } from "react-router-dom"
import "./SideDrawer.css";

const sideDrawer = props => {
    let drawerClasses = 'side-drawer';
    if (props.show) {
        drawerClasses = 'side-drawer open';
    }

    return (
        <nav className={drawerClasses}>
            <ul>
                <li><NavLink to="/">Generate Packs</NavLink></li>
                <li><NavLink to="/about">About packGenerator</NavLink></li>
                <li><NavLink to="/search">Search</NavLink></li>
                <li><NavLink to="/trade">Trading</NavLink></li>
                <li><NavLink to="/mycollection">My Collection</NavLink></li>
                <li><NavLink to="/registerpage">Make an Account</NavLink></li>
                <li><NavLink to="/loginpage">Login</NavLink></li>
                <li><NavLink to="/" onClick = {props.signOut}>Sign Out</NavLink></li>
            </ul>
        </nav>
    );
};

export default sideDrawer