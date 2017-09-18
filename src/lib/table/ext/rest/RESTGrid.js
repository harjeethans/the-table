'use strict';
import React from 'react';
import ReactDOM from 'react-dom';

import Grid from '../../Table';
import Defaults from '../../Defaults';
import Logger from '../../../common/Logger';
import RESTService from './RESTService';
import ModelEditor from './ModelEditor';

class RESTGrid extends React.Component {

  constructor(props) {
    super(props);
    this.logger = new Logger('RESTGrid', {logLevel: 0});
    this.state = {
      defaultPage: 1,
      pagination: false
    };
  }

  componentWillUnmount() {
    this._removeModelEditor();
  }
  /**
   * Loads remote data
   *
   * @param  {String/Function/Promise} [dataSource]
   * @param  {Object} [props]
   */
  initDataSource(dataSource, props) {
    props = props || this.props;

    if (!arguments.length) {
      dataSource = props.dataSource
    }

    if (typeof dataSource === 'function' && !!dataSource.fetch) {
      // simple function that does direct fetch
      dataSource = dataSource(props)
    }
    else if ( dataSource instanceof Array) {
      this.data = dataSource;
    }
    else if (typeof dataSource === 'string') {
      //string URL
      this._loadStringDataSource(dataSource, props);
    }
    else if (dataSource && dataSource.query) {
      // ok a custom DataService is specified. Make sure it talks like one
      this.dataService = dataSource;
    }

    return dataSource;
  }

  _loadStringDataSource(dataSource) {
    if (this.dataService == null) {
      this.dataService = new RESTService({
        url: dataSource
      });
    }

  }

  componentDidMount() {
    this.initDataSource();

    if (this.dataService) {
      this.query();
    }
    else if(this.data) {
      this.refs.grid.setState({
        data: this.data || [],
        totalRecords: this.data.length
      });
    }
  }

  query() {
    this.props.onFetch();
    const promise = this.dataService.query();
    this.handleStateUpdate(promise);
  }

  handleStateUpdate(promise) {
    const self = this;
    promise.then(function(results) {
      self.props.onFetchSuccess(results);
      const data = results.items || [];
      self.refs.grid.updateGridDataCollection(data, results.totalCount);
    }.bind(self), function(results){
      self.refs.grid.setGridState(self.refs.grid._gridStates.error, self.refs.grid.props.messageCatalog.unknownError);
      self.props.onFetchFail(results);
    }.bind(self));
  }

  getState() {

  }

  handleGridEvents(message) {
    let handler = null;
    if(message.type && message.type === Defaults.eventCatalog.paginate) {
      handler = (this.props.handlePaginationEvent) ? this.props.handlePaginationEvent.bind(this) : this.handlePaginationEvent.bind(this);
      handler(message);
    }
    else if(message.type && message.type === Defaults.eventCatalog.search) {
      handler = (this.props.handleSearchEvent) ? this.props.handleSearchEvent.bind(this) : this.handleSearchEvent.bind(this);
      handler(message);
    }
    else if(message.type && message.type === Defaults.eventCatalog.simpleFilter) {
      handler = (this.props.handleFieldFilterEvent) ? this.props.handleFieldFilterEvent.bind(this) : this.handleFieldFilterEvent.bind(this);
      handler(message);
    }
    else if(message.type && message.type === Defaults.eventCatalog.sort) {
      handler = (this.props.handleSortEvent) ? this.props.handleSortEvent.bind(this) : this.handleSortEvent.bind(this);
      handler(message);
    }
    else if(message.type && message.type === Defaults.eventCatalog.toolbar) {
      if(message.payload && message.payload.action === 'refresh'){
        this.refresh();
      } else {
        handler = (this.props.handleToolbarEvents) ? this.props.handleToolbarEvents.bind(this) : this.handleToolbarEvents.bind(this);
        handler(message);
      }
    }
    else if(message.type==='expandRow'){
      handler = (this.props.handleExpandRow) ? this.props.handleExpandRow.bind(this) : this.handleExpandRow.bind(this);
      handler(message);
    }
    else if(message.type==='inlineAction'){
      handler = (this.props.handleInlineActions) ? this.props.handleInlineActions.bind(this) : this.handleInlineActions.bind(this);
      handler(message);
    }
    else if(message.type==='collapseRow'){
      handler = (this.props.handleCollapseRow) ? this.props.handleCollapseRow.bind(this) : this.handleCollapseRow.bind(this);
      handler(message);
    } else {
      this.logger.log('Received message that is not directly handled by RESTGrid, will invoke onGridEvent if provided for type --> ' + message.type);
      if(this.props.onGridEvent){
        try {
          this.props.onGridEvent(message);
        } catch(error){
          this.logger.error('Error:: ' + error);
        }
      }
    }

  }

  handleInlineActions(message) {
    if(message.payload && message.payload.action === 'edit'){
      if(this.props.useCustomModelEditor) {
        if(this.props.launchModelEditor){
          this.props.launchModelEditor(message.payload);
        } else {
          this.launchModelEditor(message.payload);
        }

      }
    }
    else if(message.payload && message.payload.action === 'save'){
      this.dataService.saveRecord(message.payload.model,this.props.structure.id).then(function(results){
        message.payload.resolve({
          success:true
        });
      }).catch(function(err) {
        message.payload.reject(err);
        //TODO: show the error message to the user
      });
    } else if(message.payload && message.payload.action === 'cancel'){
      if(message.payload.reject){
        message.payload.reject();
      }
    }

    this.logger.log("RESTGrid: Inline action triggered: "+message.payload.action);
  }

  launchModelEditor(payload) {
    const self = this;
    // dummy save
    const onSaveModel = function(model){
      this.resolve({
        success: true,
        model
      });
      self._removeModelEditor();
    }
    // dummy cancel
    const onCancelEditModel = function(error){
      this.reject();
      self._removeModelEditor();
    }
    // TODO: use react-form to generate the default form in a modal
    this.modalMountNode = document.createElement('div');
    this.modalMountNode.className = 'model-mount-node';
    document.body.appendChild(this.modalMountNode);
    ReactDOM.render(
      <ModelEditor
        model = {payload.model}
        promise = {payload.promise}
        resolve = {payload.resolve}
        reject = {payload.reject}
        onSaveModel = {onSaveModel}
        onCancelEditModel = {onCancelEditModel}/>,
      this.modalMountNode);

  }

  _removeModelEditor(){
    if(this.modalMountNode){
      ReactDOM.unmountComponentAtNode(this.modalMountNode);
      this.modalMountNode.remove();
    }
  }

  handleExpandRow(message) {
    message.payload.containerNode.innerHTML = '<code>' + JSON.stringify(message.payload.model) + '</code>'
  }
  handleCollapseRow(message) {
    this.logger.log("DO ant cleanup required for expanded row(event binding create, object references or any jquery pluggins instiated)) -->" + message);
  }
  handlePaginationEvent(message) {
    this.dataService.setPageInfo({
      pageSize: message.payload.pageSize,
      startAt: message.payload.currentPage
    });
    const promise = this.dataService.gotoPage(message.payload.currentPage);
    this.handleStateUpdate(promise);
  }

  handleSearchEvent(message) {
    this.dataService.setFilterInfo({
      type: 'search', // search, field, advance,
      searchText: message.payload.value,
      fieldsMatch: {}, // single value or array against each field
      advanceCriteria: {} //boolean of fieldsMatch
    });
    const promise = this.dataService.query();
    this.handleStateUpdate(promise);
  }

  handleFieldFilterEvent(message) {
    this.dataService.setFilterInfo({
      type: 'field', // search, field, advance,
      searchText: null,
      fieldsMatch: message.payload.conditions, // single value or array against each field
      advanceCriteria: {} //boolean of fieldsMatch
    });
    // reset the current page from grid as it should be 1 when a filter query is issued.
    this.dataService.setPageInfo({
      startAt: this.refs.grid.state.pagination.currentPage
    });
    const promise = this.dataService.query();
    this.handleStateUpdate(promise);
  }

  refresh() {
    this.props.onFetch();
    const promise = this.dataService.query();
    this.handleStateUpdate(promise);
  }

  handleSortEvent(message) {
    this.dataService.setSortInfo({
      sortField:message.payload.attribute,
      sortOrder:message.payload.order
    });
    const promise = this.dataService.query();
    this.handleStateUpdate(promise);
  }

  handleToolbarEvents(message) {
    if(message.payload.action && message.payload.action === "refresh") {
      const promise = this.dataService.query();
      this.handleStateUpdate(promise);
    } else {
      this.logger.log('Received message in else section of RESTGrid.handleToolbarEvents(), meaning not handlled --> ' + JSON.stringify(message));
    }
  }

  render() {
    const handler = this.handleGridEvents;
    const props = Object.assign({},this.props,{
      ref: "grid",
      onGridEvent: this.handleGridEvents.bind(this)
    });
    const restGrid = React.createElement(Grid, props);
    const onGridRender = (this.props.onGridRender) ? this.props.onGridRender.bind(this) : this.onGridRender.bind(this);
    onGridRender();
    return restGrid;
  }


  onGridRender() {
    console.log("RESTGrid onGridRender");
  }
}

RESTGrid.propTypes = Object.assign({
  //dataSource: React.PropTypes.object
  onFetch: React.PropTypes.func, // a function that can be provided as callback, will be called when fetch is initiated.
  onFetchSuccess: React.PropTypes.func, // a function that can be provided as callback, will be called when fetch is successful.
  onFetchFail: React.PropTypes.func, // a function that can be provided as callback, will be called when fetch is failed or errored out.
  launchModelEditor: React.PropTypes.func
},Grid.propTypes);

RESTGrid.defaultProps = Object.assign({
  dataSource: [],
  onFetch: () => { console.log('Default Callback for onFetch() fired.');},
  onFetchSuccess: (result) => { console.log('Default Callback for onFetchSuccess() fired.');},
  onFetchFail: (result) => { console.log('Default Callback for onFetchFail() fired.');}
},Grid.defaultProps);


export default RESTGrid;
