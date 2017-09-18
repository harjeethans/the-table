import React from 'react';

import PropTypes from 'prop-types';


import classnames from 'classnames';

import Button from '../button/Button';


const modifierClasses = {
  'mdc-menu--small': true,
  'mdc-menu--medium': false,
  'mdc-menu--large': false
};

class Menu extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.onClick = this.onClick.bind(this);
    this.onClickOutsideMenu = this.onClickOutsideMenu.bind(this);
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.toggle = this.toggle.bind(this);

    this.state = {
      isOpen: false
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
    const {baseClass, children, className, icon, label, ripple, size} = this.props;

    const classes = classnames(baseClass, {
      'mdc-menu--open': this.state.isOpen,
      'mdc-menu--small': (size === 'S'),
      'mdc-menu--medium': (size === 'M'),
      'mdc-menu--large': (size === 'L'),
      'ripple-effect': ripple
    }, className);
    const containerClasses = classnames({
      'mdc-menu__container': true,
      'is-visible': this.state.isOpen
    })

    let labelNode = label;
    if(icon){
      labelNode = <i className="material-icons">{icon}</i>
    }


    return (
      <div className={classes}>
        <Button onClick={this.toggle} icon={(icon)}>{labelNode}</Button>
        <div className={containerClasses} onClick={this.onClick}>
          <ul className="mdc-menu mdc-shadow--2dp mdc-menu--bottom-left mdc-js-menu mdc-js-ripple-effect">
            {children}
          </ul>
        </div>
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
  position: PropTypes.oneOf(['BL', 'BR','TL','TR']),
  size: PropTypes.oneOf(['A', 'S', 'M','L']) // custom, small , medium , large
}

Menu.defaultProps = {
  baseClass: 'mdc-menu--container',
  position: 'BL',
  size: 'S'
}

export default Menu;
