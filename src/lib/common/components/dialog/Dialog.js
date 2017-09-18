import React, { PropTypes }  from 'react';
import classnames from 'classnames';

import Button from '../button/Button';
import RenderInContainer from './RenderInContainer';
import Title from './Title';
import Content from './Content';
import Actions from './Actions';

class Dialog extends React.Component {

  render() {
    const {baseClass, children, className, container, size, underlay} = this.props;

    const classes = classnames(baseClass, {
      'mdl-dialog--small': (size === 'S'),
      'mdl-dialog--medium': (size === 'M'),
      'mdl-dialog--large': (size === 'L')
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
  container: React.PropTypes.object,
  size: PropTypes.oneOf(['S', 'M','L']), // small , medium , large
  underlay: PropTypes.bool
}

Dialog.defaultProps = {
  baseClass: 'mdl-dialog',
  size: 'M',
  underlay: true
}

export default Dialog;
