import React, { PropTypes }  from 'react';

function Title(props) {

  const {
    className,
    title,
    ...elementProps
  } = props;

  return (
    <h4 className={className} {...elementProps} >{title}</h4>
  );
}

Title.PropTypes = {
  className: PropTypes.string, //adds a custom css class
  title: PropTypes.bool
};

Title.defaultProps = {
  className: 'mdl-dialog__title',
  title: 'Dialog Title'
}

export default Title;
