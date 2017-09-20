import React  from 'react';
import PropTypes from 'prop-types';

function Title(props) {

  const {
    className,
    title,
    ...elementProps
  } = props;

  return (
    <header className={className} {...elementProps} >
      <h2 className="mdc-dialog__header__title">{title}</h2>
    </header>
  );
}

Title.PropTypes = {
  className: PropTypes.string, //adds a custom css class
  title: PropTypes.bool
};

Title.defaultProps = {
  className: 'mdc-dialog__header',
  title: 'Dialog Title'
}

export default Title;
