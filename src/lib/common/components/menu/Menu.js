import React from 'react';

import PropTypes from 'prop-types';


import classnames from 'classnames';

import Button from '../form/Button';
import IconButton from '../form/IconButton';

//https://codepen.io/raneio/pen/NbbZEM


const modifierClasses = {
  'menu--small': true,
  'menu--medium': false,
  'menu--large': false
};

class Menu extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.onClick = this.onClick.bind(this);
    this.onClickOutsideMenu = this.onClickOutsideMenu.bind(this);
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.toggle = this.toggle.bind(this);

    const position = this.props.position;
    let style = {
      transform: 'scale(1, 1)'
    }

    if(position === 'TL'){
      style = Object.assign({}, style, {
        transformOrigin: 'left bottom 0px',
        left: 5,
        top: 20
      });
    }

    this.state = {
      isOpen: false,
      style
    };


  }

  onClick(event) {
    if(this.state.isOpen){
      // close the menu and remove onClickOutsideMenu binding.
      this.close(event);
    }
    //event.stopPropagation();
  }

  onClickOutsideMenu(event){
    if(event.target.nodeName === 'LI' || event.target.nodeName === 'BUTTON' || event.target.nodeName === 'I'){
      return;
    }
    if(this.state.isOpen){
      this.setState({isOpen: false});
      document.body.removeEventListener('click', this.onClickOutsideMenu);
    }
  }

  open(event){
    this.setState({isOpen: true});
    document.body.addEventListener('click', this.onClickOutsideMenu);
  }

  close(event) {
    this.setState({isOpen: false});
    document.body.removeEventListener('click', this.onClickOutsideMenu);
  }

  toggle(event) {
    if(this.state.isOpen){
      this.close(event);
    } else {
      this.open(event);
    }
  }

  render() {
    const {baseClass, children, className, icon, label} = this.props;

    const classes = classnames(baseClass, className);
    const containerClasses = classnames({
      'dropdown-menu': true,
      'dropdown-menu__open': this.state.isOpen
    })

    let target;
    if(icon){
      target = <IconButton onClick={this.toggle} primary={true} iconName={icon}></IconButton>
    } else {
      target = <Button onClick={this.toggle}>{label}</Button>
    }

    return (
      <div className={classes}>
        {target}
        <ul className={containerClasses} onClick={this.onClick} style={this.state.style}>
          {children}
        </ul>
      </div>
    );
  }
}


Menu.state = {
  isOpen: false
}

Menu.propTypes = {
  baseClass: PropTypes.string,
  className: PropTypes.string, //adds a custom css class
  children: PropTypes.array,
  icon: PropTypes.string, //material icon if needed, do not supply label if you just need icon
  label: PropTypes.string, //label for the menu
  onClick: PropTypes.func, // callback for onMouseEnter
  ripple: PropTypes.bool,
  position: PropTypes.oneOf(['BL', 'BR','TL','TR'])
}

Menu.defaultProps = {
  baseClass: 'dropdown',
  position: 'TL'
}

export default Menu;
