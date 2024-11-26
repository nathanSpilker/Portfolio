import React, { Component } from 'react';
import "./AvatarBar.css"
import AvatarIcon from '../AvatarIcon/AvatarIcon';

const numAvatars = 48

class AvatarBar extends Component { 

    constructor(props) {
      super(props);
  }



  render() {
      let avatarDiv;

      var renderFor450 = window.screen.width <= 450;
      var myWidth;
      if (renderFor450)
      {
        myWidth = '56px'
      }
      else
      {
        myWidth = '83px'
      }

      var elements=[];
      for(var i=0;i<numAvatars;i++){
           // push the component to elements!
          elements.push(<AvatarIcon codeKey={ i } width = {myWidth} height = {myWidth} float = 'left' handleAvatarClick = {this.props.handleAvatarClick}>
                            </AvatarIcon>);
      }

      return (
          <div>
            <div className = "chooseDiv" >Choose your Avatar</div>
            {elements}
            </div>
      );
  }
};

export default AvatarBar