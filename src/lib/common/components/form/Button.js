import React from 'react';

import PropTypes from 'prop-types';

import classnames from 'classnames';

const baseClasses = {
  'mdc-button': true,
  'mdc-js-button': true
};

function Button(props) {

  const {
    children,
    className,
    accent,
    compact,
    dense,
    primary,
    raised,
    ...elementProps
  } = props;

  const classes = classnames(baseClasses, {
    'mdc-button--accent': accent,
    'mdc-button--compact': compact,
    'mdc-button--dense': dense,
    'mdc-button--raised': raised,
    'mdc-button--primary': primary
  }, className);

  return (
    <button  {...elementProps} className={classes} >
      {children}
    </button>
  );
}


Button.PropTypes = {
  className: PropTypes.string, //adds a custom css class
  accent: PropTypes.bool,
  compact: PropTypes.bool,
  dense: PropTypes.bool,
  primary: PropTypes.bool,
  raised: PropTypes.bool
};

export default Button;
