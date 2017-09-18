import React from 'react';

import PropTypes from 'prop-types';

import classNames from 'classnames';

import Defaults from './Defaults';
import I18N from '../locale/I18N';
//import Fa from './bootstrap/Fa';

class HeaderSection extends React.Component {
  render() {

    const {maxWidth, selected} = this.props;
    const showSelectionCount = !(this.props.selectionModel === 'none' || this.props.selectionModel === 'one');
    return (
      <div className="container-flex header-container" ref="headerContainer" style={{maxWidth}}>
        { showSelectionCount &&
        <p className="text-info">{selected.length} {I18N.getI18N("RowsSelected")}</p>}
      </div>);
  }
}


HeaderSection.propTypes = {
  maxWidth: PropTypes.number, // maximun width available from layout
  selected: PropTypes.array, // number of rows selected.
  selectionModel: PropTypes.oneOf(['all','some','one','none']) // all/some/one/none meaning select all available, some has no select all, and non is non selectable.
}

HeaderSection.defaultProps = {
  maxWidth: 1024,
  selected: []
}

export default HeaderSection;