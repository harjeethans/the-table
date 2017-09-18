import React from 'react';

import PropTypes from 'prop-types';

import classNames from 'classnames';


import Icon from '../common/components/Icon';
import SettingsColumn from './SettingsColumn';

class Settings extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      'show': false,
      'structure': props.structure
    };
  }

  toggle() {
    this.setState({ show: !this.state.show });
  }

  render(){
    const className = classNames('settings');
    const containerClasses = classNames('settings-container', {'hidden': !this.state.show});
    const buttonClasses = classNames({'settings-open': this.state.show});
    const uls = {
      listStyle: 'none',
      margin: 0,
      padding:0
    };
    const listItems = this.state.structure.columns.map(function(column, i) {
      return <SettingsColumn column = {column} key = {i}></SettingsColumn>;
    });

    return (
      <div className = {className}>
        <button ref = "target" className = {buttonClasses}>
          <Icon
            faIconClass = {this.props.item.iconClass}
            onClick = {this.toggle.bind(this)}>
          </Icon>
        </button>
        <div
          className = {containerClasses}>
          <ul style = {uls}>
            <li>
              <div className="row">
                <div className="col-md-4">Label</div>
                <div className="col-md-4">Width</div>
                <div className="col-md-4">Visible</div>
              </div>
            </li>
            {listItems}
          </ul>
        </div>
      </div>
    );

  }
}

Settings.state = {
  show: false
}
Settings.propTypes = {
  item: PropTypes.object, // settings toolbar item reference.
  structure: PropTypes.object // refer docs/structure.md file for how to map a structure for a given model.
}

Settings.defaultProps = {
}

export default Settings;
