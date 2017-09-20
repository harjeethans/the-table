import React  from 'react';
import PropTypes from 'prop-types';

function Content(props) {

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

Content.PropTypes = {
  className: PropTypes.string
};

Content.defaultProps = {
  className: 'mdc-dialog__body'
}

export default Content;
