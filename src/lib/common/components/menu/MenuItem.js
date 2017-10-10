import React from 'react';

import PropTypes from 'prop-types';

import classnames from 'classnames';

const baseClasses = {
  'dropdown-menu-item': true
};

function MenuItem(props) {

  const {
    children,
    className,
    divider,
    dividerClass,
    onClick,
    ...elementProps
  } = props;

  const classes = classnames(baseClasses, className, {[dividerClass]: divider});
  return (
    <li className={classes} {...elementProps} onClick={onClick}>{children}</li>
  );
}


MenuItem.PropTypes = {
  className: PropTypes.string,
  divider: PropTypes.bool,
  dividerClass: PropTypes.string,
  onClick: PropTypes.func, // callback for onClick
  overlap: PropTypes.bool
};

MenuItem.defaultProps = {
  dividerClass: 'dropdown-menu-item__divider',
  onClick: (event) => { console.log('MenuItem onClick'); },
}

export default MenuItem;
