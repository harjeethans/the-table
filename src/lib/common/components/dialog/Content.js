import React, { PropTypes }  from 'react';

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
  className: 'mdl-dialog__content'
}

export default Content;
