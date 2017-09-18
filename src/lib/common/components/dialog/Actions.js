import React, { PropTypes }  from 'react';

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
  className: 'mdl-dialog__actions'
}

export default Actions;
