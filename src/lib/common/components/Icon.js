import React from 'react';

import PropTypes from 'prop-types';


function Icon(props) {

  const {iconClass, iconName, ...elementProps} = props;

    return (
      <i className={iconClass} {...elementProps} style={{"vertical-align": "middle"}}>{iconName}</i>
    );
}

Icon.propTypes = {
  iconClass: PropTypes.string,
  iconName: PropTypes.string.isRequired
}

Icon.defaultProps = {
  iconClass: 'material-icons',
  iconName: ''
}

export default Icon;
