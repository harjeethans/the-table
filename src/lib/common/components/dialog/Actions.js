import React  from 'react';
import PropTypes from 'prop-types';

function Actions(props) {

  const {
    className,
    children,
    ...elementProps
  } = props;

  return (
    <div className={className} {...elementProps}>
      {children}
    </div>
  );
}

Actions.PropTypes = {
  className: PropTypes.string
};

Actions.defaultProps = {
  className: 'mdc-dialog__footer'
}

export default Actions;
