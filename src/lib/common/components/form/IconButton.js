import React from 'react';

import Button from './Button';
import Icon from '../Icon';

function IconButton(props) {

  const {
    children,
    className,
    accent,
    compact,
    dense,
    primary,
    raised,
    iconClass,
    iconName,
    ...elementProps
  } = props;

  const style = {'min-width': 'auto'};
  return (
    <Button accent={accent} compact={compact} dense={dense} primary={primary} raised={raised} {...elementProps} style={style}>
      <Icon iconName={iconName}></Icon>
    </Button>
  );
}


IconButton.PropTypes = Object.assign({}, Button.PropTypes, Icon.PropTypes);

export default IconButton;
