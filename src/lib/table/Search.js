import React from 'react';

import PropTypes from 'prop-types';


import I18N from '../locale/I18N';
import Defaults from './Defaults';
import Icon from '../common/components/Icon';

class Search extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value
    };
    this.handleChange = this.handleChange.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
    this.onSearchButtonClick = this.onSearchButtonClick.bind(this);
  }

  handleChange() {
    this.setState({value: this.refs.inputSearch.value});
    if(this.refs.inputSearch.value.length < 1){
      if(this.props.onSearchChange) {
        this.props.onSearchChange({'type': Defaults.eventCatalog.search, 'payload': {'value': this.state.value} });
      }
    }
  }

  onKeyPress(event) {
    if(event.which === 13){
      if(this.props.onSearchChange) {
        this.props.onSearchChange({'type': Defaults.eventCatalog.search, 'payload': {'value': this.state.value} });
      }
    }
  }

  onSearchButtonClick(){
    if(this.props.onSearchChange) {
      this.props.onSearchChange({'type': Defaults.eventCatalog.search, 'payload': {'value': this.state.value} });
    }
  }

  setSearch(value, silent) {
    this.setState({value});
    if(!silent){
      this.onSearchButtonClick();
    }
  }

  render(){

    return (
      <div className="table-search">
        <input
          className="form-control input-sm search-input"
          onChange={this.handleChange}
          onKeyPress={this.onKeyPress}
          placeholder={I18N.getI18N("Search")}
          ref="inputSearch"
          value={this.state.value} />
        <button
          onClick={this.onSearchButtonClick}
          ref="searchButton">
          <Icon iconName={this.props.icons.search}></Icon>
        </button>
      </div>
    );

  }
}

Search.state = {
}

Search.propTypes = {
  delay: PropTypes.number, // delay
  icons: PropTypes.object,
  minLength: PropTypes.number, // minLength
  onSearchChange: PropTypes.func, // callback for onChange
  value: PropTypes.string // value
}

Search.defaultProps = {
  delay: 400,
  icons: Defaults.icons,
  minLength: 3,
  onSearchChange: (payload) => {console.log('Default onSearchChange handller called with payload -->' + JSON.stringify(payload));},
  value: ''
}

export default Search;
