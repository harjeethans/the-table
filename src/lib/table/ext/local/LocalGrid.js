'use strict';
import React from 'react';
import ReactDOM from 'react-dom';

import Grid from '../../Table';
import Defaults from '../../Defaults';
import Logger from '../../../common/Logger';
import LocalService from './LocalService';

class LocalGrid extends React.Component {

  constructor(props) {
    super(props);
    this.logger = new Logger('LocalGrid', {logLevel: 0});
    this.handleGridEvents = this.handleGridEvents.bind(this);
    const {filterInfo, headerFilterPredicate, pagination, data, usePagination, useCaseSensitiveFilter} = this.props;

    this.localService = new LocalService({
      filterInfo,
      headerFilterPredicate,
      pageInfo: pagination,
      data,
      usePagination,
      useCaseSensitiveFilter
    });
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.data){
      this.localService.setData(nextProps.data);
    }
  }

  handleGridEvents(message) {
    let handler = null;
    if( message.type && message.type === Defaults.eventCatalog.paginate ) {

      this.handlePaginationEvent(message);

    } else if( message.type &&  message.type === Defaults.eventCatalog.simpleFilter ) {

      this.handleSimpleFilterEvent(message);

    } else if( message.type && message.type === Defaults.eventCatalog.search ) {

      this.handleSearchFilterEvent(message);

    } else if( message.type && message.type === Defaults.eventCatalog.sort ) {

      this.handleSortEvent(message);

    } else {
      this.logger.log('Received message that is not directly handled by LocalGrid, will invoke onGridEvent if provided for type --> ' + message.type);
      if(this.props.onGridEvent){
        try {
          this.props.onGridEvent(message);
        } catch(error){
          this.logger.error('Error:: ' + error);
        }
      }
    }

  }

  handleStateUpdate(data, totalNumberOfRecords) {
    this.refs.grid.updateGridDataCollection(data, totalNumberOfRecords);
  }

  handlePaginationEvent(message) {
    this.handleStateUpdate(this.localService.getPage({
      pageSize: message.payload.pageSize,
      startAt: message.payload.currentPage
    }), this.localService.getTotalNumberOfFilteredRecords());
  }

  handleSortEvent(message) {
    const sortInfo ={
      attribute: message.payload.attribute,
      sortOrder: message.payload.order
    };

    let filterInfo = this.refs.grid.state.filter;
    if(filterInfo && filterInfo.type === 'search'){
      filterInfo = {type: filterInfo.type, value: filterInfo.value};
    } else {
      if(filterInfo && filterInfo.conditions && Object.keys(filterInfo.conditions).length < 1){
        filterInfo = null;
      }
    }

    this.handleStateUpdate(this.localService.query(this.refs.grid.state.pagination, sortInfo, filterInfo), this.localService.getTotalNumberOfFilteredRecords());
  }

  handleSimpleFilterEvent(message) {
    let filterInfo = message.payload;
    if(Object.keys(filterInfo && filterInfo.conditions && filterInfo.conditions).length < 1){
      filterInfo = null;
    }
    this.handleStateUpdate(this.localService.query(this.refs.grid.state.pagination, null, filterInfo), this.localService.getTotalNumberOfFilteredRecords());
  }

  handleSearchFilterEvent(message) {
    let filterInfo = {type: message.type, value: message.payload.value};
    if(filterInfo.value.length < 1){
      filterInfo = null;
    }
    this.handleStateUpdate(this.localService.query(this.refs.grid.state.pagination, null, filterInfo), this.localService.getTotalNumberOfFilteredRecords());
  }

  render() {
    const props = Object.assign({}, this.props, {
      //data: this.localService.getPage(),
      data: this.localService.query(this.localService.pageInfo, this.localService.sortInfo, this.localService.filterInfo),
      ref: "grid",
      onGridEvent: this.handleGridEvents,
      totalRecords: this.localService.getTotalNumberOfRecords()
    });
    //const localGrid = React.createElement(Grid, props);

    return <Grid {...props}/>;
  }

}

LocalGrid.propTypes = Object.assign({},Grid.propTypes,{useCaseSensitiveFilter: React.PropTypes.bool});

LocalGrid.defaultProps = Object.assign({}, Grid.defaultProps,{useCaseSensitiveFilter: false});

export default LocalGrid;
