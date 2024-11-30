import React from 'react';
import './Toolbar.css';
import DrawerToggleButton from '../SideDrawer/DrawerToggleButton';
import { NavLink } from "react-router-dom"
import PersonIcon from '@material-ui/icons/Person';

const toolbar = props => {
    let toolbarClasses = 'toolbar';
    if (!props.onIntro) {
        toolbarClasses = 'toolbar on';
    }
    let acc = <li><NavLink to="/loginpage"  className = "acc_item">Login<PersonIcon/></NavLink></li>
    if(props.signedIn) {
        acc = <li><NavLink to="/loginpage">{props.username}<PersonIcon/></NavLink></li>
    }

    return (
        <header className={toolbarClasses}>
                <nav className="toolbar__navigation">
                <div>
                    <DrawerToggleButton click={props.drawerClickHandler} />
                </div>
                <div className = "titlediv"><NavLink to="/"><div className = "titletext">packGenerator</div></NavLink></div>
                <div className="spacer"></div>
                <div className="toolbar_navigation-items">
                    <ul>
                        <li><NavLink to="/">Generate</NavLink></li>
                        <li><NavLink to="/search">Search</NavLink></li>
                        <li><NavLink to="/trade">Trade</NavLink></li>
                        <li><NavLink to="/mycollection">My Collection</NavLink></li>
                        {acc}
                    </ul>
                </div>
            </nav>
        </header >
    );
};

export default toolbar;