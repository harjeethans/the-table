import React from 'react';

import PropTypes from 'prop-types';

import classnames from 'classnames';

import RenderInContainer from './RenderInContainer';
import Title from './Title';
import Content from './Content';
import Actions from './Actions';

class Dialog extends React.Component {

  render() {
    const {baseClass, children, className, container, size, underlay} = this.props;

    const classes = classnames(baseClass, {
      'mdc-dialog--small': (size === 'S'),
      'mdc-dialog--medium': (size === 'M'),
      'mdc-dialog--large': (size === 'L')
    });

    let open;
    if(this.props.open){
      open = {open: true}
    }

    return (
    <RenderInContainer container = {container} {...open} underlay={underlay}>
      <dialog className={classes} {...open}>
        {children}
      </dialog>
    </RenderInContainer>
    );
  }
}

Dialog.Title = Title;
Dialog.Content = Content;
Dialog.Actions = Actions;

Dialog.propTypes = {
  baseClass: PropTypes.string,
  container: PropTypes.object,
  size: PropTypes.oneOf(['S', 'M','L']), // small , medium , large
  underlay: PropTypes.bool
}

Dialog.defaultProps = {
  baseClass: 'mdc-dialog',
  size: 'M',
  underlay: true
}

export default Dialog;
