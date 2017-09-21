import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import PropTypes from 'prop-types';

import Defaults from './Defaults';
import Logger from '../common/Logger';
import CellEditors from '../common/CellEditors';
import Util from '../common/Util';
import EventEmitter from '../common/EventEmitter';
import HtmlUtils from '../common/HtmlUtils';

import Header from './Header';
import Body from './Body';
import Toolbar from './Toolbar';
import Paginator from './Paginator';
import HeaderSection from './HeaderSection';
import Export from './Export';

import Message from './Message';

/**
 * this is Table.
 */

class Table extends Component {

  constructor(props) {
      super(props);

      this.eventEmitter = new EventEmitter();
      // clean up the structure.
      this._cleanupStructure(props.structure);
      // determine column position meaning sort the columns by position.
      this._processColumns(props.structure);

      // the states table may have at a given time, listen to events for what state wr are in, private so do not set directly.
      this._tableStates = {
        'error' : 'error',
        'initializing': 'initializing',
        'inlineEditing' : 'inlineEditing',
        'loading' : 'loading',
        'loadingNested' : 'loadingNested',
        'ready' : 'ready'
      };
      this.tableState = this._tableStates.initializing;


      const { autoRefresh, autoRefreshInterval, data, disabled, filter, message, selected, sort, structure, totalRecords } = this.props;

      const dimension = {w: this.props.structure.width, h: this.props.height};
      const pagination = (this.props.usePagination) ? this.props.pagination : null;

      this.state = {autoRefresh, autoRefreshInterval, data, dimension, disabled, filter, message, pagination, selected, sort, structure, totalRecords };

      //this.props.logger.setLogLevel(this.props.logLevel);
      this.logger = this.props.logger;

      this._calculateSizing = this._calculateSizing.bind(this);
      this._debouncedCalculateSizing = Util.debounce(this._calculateSizing, props.delay);
      this._debouncedOnTableEvent = Util.debounce(this.props.onTableEvent, this.props.delay);
      // reference for expanded rows.
      //this._expandedRows = {};
      this._openNestedRows = {};
      // added as for a nested table when we have open nodes , we need to maintin open state on refresh.
      this.renderInitiatedByRefresh = false;
      this._autoRefreshTimer = null;

      this.eventEmitter.addListener(this.props.privateEventCatalog.onSelectionChange, this.handleSelectionChange.bind(this));
      this.eventEmitter.addListener(this.props.privateEventCatalog.onInlineActionInvocation, this.handleInlineActionInvocation.bind(this));
      this.eventEmitter.addListener(this.props.privateEventCatalog.onToggleRowExpansion, this.onToggleRowExpansion.bind(this));
      this.eventEmitter.addListener(this.props.eventCatalog.fetchChildren, this.onFetchChildren.bind(this));
      this.eventEmitter.addListener(this.props.eventCatalog.adjustScroll, this._handleAdjustScroll.bind(this));
      this.eventEmitter.addListener(this.props.eventCatalog.clickRow, this._handleRowClick.bind(this));

    }

    componentDidMount() {
      window.addEventListener('resize', this._debouncedCalculateSizing);
      this._calculateSizing();
    }

    componentWillUnmount() {

      const props = this.props;

      window.removeEventListener('resize', this._debouncedCalculateSizing);

      this.eventEmitter.removeListener(props.privateEventCatalog.onSelectionChange, this.handleSelectionChange);
      this.eventEmitter.removeListener(props.privateEventCatalog.onInlineActionInvocation, this.handleInlineActionInvocation);
      this.eventEmitter.removeListener(props.privateEventCatalog.onToggleRowExpansion, this.onToggleRowExpansion);
      this.eventEmitter.removeListener(props.eventCatalog.fetchChildren, this.onFetchChildren.bind(this));
      this.eventEmitter.removeListener(props.eventCatalog.adjustScroll, this._handleAdjustScroll.bind(this));
      this.eventEmitter.removeListener(props.eventCatalog.clickRow, this._handleRowClick.bind(this));

      if(this._debouncedCalculateSizing){
        this._debouncedCalculateSizing.cancel();
      }
      if(this._debouncedOnTableEvent){
        this._debouncedOnTableEvent.cancel();
      }

    }

    getChildContext() {
    return {
      logger: this.props.logger
      }
    }

    unmountTable(){
      ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(this).parentNode);
    }

    componentWillReceiveProps(nextProps) {

      if(nextProps.structure){
        this._cleanupStructure(nextProps.structure);
      }

      const _state = {};

      if(nextProps.data){
        _state.data = nextProps.data;
      }
      if(nextProps.totalRecords){
        _state.totalRecords = nextProps.totalRecords;
      }
      if(nextProps.selected){
        _state.selected = nextProps.selected;
      }

      this.setState(_state);
      // fix the following filter from nextProps
      // pagination, totalRecords, sort
    }

    componentDidUpdate(prevProps, prevState) {

      //we has open nested rows that need to be in open state after component updtaes provided preserveNestedRowStateOnRender is set to true.
      if(this.renderInitiatedByRefresh && this.props.preserveNestedRowStateOnRender && this._openNestedRows){
        let row = null;
        Object.keys(this._openNestedRows).map( (modelId) => {
          row = this.refs.body.refs[modelId];
          try {
            if(row){
              row.toggleNestedRow(modelId);
            }
            return true;
          } catch(error) {
            this.logger.error('');
            return false;
          }

        }, this);


        this.renderInitiatedByRefresh = false;
      }
      if(this.state.autoRefresh){
        this._autoRefresh();
      }
      this.logger.log('Called componentDidUpdate() on Table');
    }

    componentWillUpdate(/*nextProps, nextState*/){
      this.tableState = this._tableStates.initializing;
    }


    /*
      * Cleanup the structure for some default or missing values that can be defaulted.
      */
      _cleanupStructure(structure) {
        // const cols = structure.columns;
        // let col;
        Array.from(structure.columns).forEach(function(column) {
          if (column.editable === undefined) {
            column.editable = true;
          }
          if (column.sortable === undefined) {
            column.sortable = true;
          }
          if (column.filterable === undefined) {
            column.filterable = true;
          }
          if (column.showTitleOnHover === undefined) {
            column.showTitleOnHover = true;
          }
        });

        // @TODO harjeet will fix after local storage support is added.
        /*
        var _storage = this._getStorage();
        var _cf = (_storage && _storage["columnPerfrences"]) ? _storage["columnPerfrences"].columns : null;
        var _cfCol
        if(_cf){
          Array.from(structure.columns).forEach(function(column) {
            _cfCol = _.findWhere(_cf, {"attr": col["attr"]});
            if(_cfCol){
                col.width  = _cfCol.width;
                col.hidden  = _cfCol.hidden;
                col.position  = _cfCol.position;
            }
          });
        }
        */
      }

      /*
      * Do some column processing like how many columns are visible, fix position by sorting, add column widths so that we can cache some stuff.
      * @TODO Down the line when storage is added we may want to overide some of the stuff to structure from the storage.
      */
      _processColumns(structure) {
        structure.columns = Util.sort(structure.columns, 'position', '1');
        // let column;
        let visibleColumns = 0;
        let width = 0;
        Array.from(structure.columns).forEach(function(column) {
          if (!column.hidden) {
            visibleColumns++;
            width += column.width;
          }
        });

        structure.visibleColumns = visibleColumns;
        structure.width = width;
      }

      onToggleRowExpansion(change){
        this.props.onTableEvent(change);
      }

      onFetchChildren(change){
        if(change.payload && change.payload.action === this.props.privateEventCatalog.showChildren){
          this.logger.log('Fetch and show children for ' + change.payload.id);
          if(change.payload.promise){
            change.payload.promise.then(function(response){
              if(response.data){
                for (const _model of this.state.data) {
                  if(_model[this.state.structure.id] === change.payload.model[this.state.structure.id]){
                    _model[this.state.structure.childrenAttr] = response.data;
                    _model[this.state.structure.childrenIndicator] = (response.data) ? true : false;
                    this._openNestedRows[_model[this.state.structure.id]] = _model[this.state.structure.id];
                    break;
                  }
                }
                this.logger.log('Children fetched will fire an update now!');
                this.forceUpdate();
              } else {
                this.logger.log('could not fetch children for unknown reason!');
              }

            }.bind(this));

            change.payload.promise.catch(function(error){
              this.logger.error('Could not fetch children for error ' + JSON.stringify(error));
            }.bind(this));
          }
        }
        if(change.payload && change.payload.action === this.props.privateEventCatalog.hideChildren){
          this.logger.log('Hide/remove children for ' + change.payload.id);
          for (const _model of this.state.data) {
            if(_model[this.state.structure.id] === change.payload.model[this.state.structure.id]){
              _model[this.state.structure.childrenAttr] = null;
              _model[this.state.structure.childrenIndicator] = false;
              break;
            }
          }

          if(this._openNestedRows[change.payload.model[this.state.structure.id]]){
            delete this._openNestedRows[change.payload.model[this.state.structure.id]];
          }

          this.setTableState(this._tableStates.ready);
          if(change.payload.resolve){
            change.payload.resolve();
          }
        }

        this.props.onTableEvent(change);
      }

      handlePaginatorChange(change) {
        change.payload = Object.assign(this.state.pagination, change.payload)
        this.props.onTableEvent(change);
        //this.logger.log('Called Table.handlePaginatorChange() -->' + JSON.stringify(change));
      }

      handleHeaderChange(change) {
        if(change.type === this.props.eventCatalog.simpleFilter){

          if(this.props.filterProcesser && typeof this.props.filterProcesser === 'function'){
            change.payload = this.props.filterProcesser(change.payload);
          }
          if(this.props.usePagination){
            //set the currentPage to 0 after a request for a filter is received as we do not know how many pages we are going to have after flter query executes.
            const pagination = Object.assign(this.state.pagination, {currentPage: 1});
            //willfully not calling paginator.setState(..) as we do not want to make an unecessary call to server requesting page 1 data whereas filter query is just about to be issueed.
            this.refs.paginator.state.currentPage = 1;
            this.setState({'filter': change.payload, pagination});
          } else {
            this.setState({'filter': change.payload});
          }

          if(!this._debouncedOnTableEvent){
            this._debouncedOnTableEvent = Util.debounce(this.props.onTableEvent, this.props.delay);
          }
          this._debouncedOnTableEvent(change);
        } else if(change.type === this.props.eventCatalog.sort) {
          this.setState({sort: change.payload});
          this.props.onTableEvent(change);
        } else {
          this.props.onTableEvent(change);
        }

        this.logger.log('Called Table.handleHeaderChange() -->' + JSON.stringify(change));
      }

      handleSearchChange(change) {

        if(this.props.usePagination){
          const pagination = Object.assign(this.state.pagination, {currentPage: 1});
          //willfully not calling paginator.setState(..) as we do not want to make an unecessary call to server requesting page 1 data whereas filter query is just about to be issueed.
          this.refs.paginator.state.currentPage = 1;
          this.setState({'filter': {'type': change.type, 'value': change.payload.value}, pagination});
        } else {
          this.setState({'filter': {'type': change.type, 'value': change.payload.value}});
        }

        this.props.onTableEvent(change);
        this.logger.log('Called Table.handleSearchChange() -->' + JSON.stringify(change));
      }

      handleToolbarChange(change) {
        if(change.type === this.props.eventCatalog.toolbar && change.payload.action === 'filter-simple'){
          this.toggleSimpleFilter();
        } else if(change.type === this.props.eventCatalog.toolbar && change.payload.action === 'refresh'){
          if(this.props.isNested){
            this._hideAllNestedRows();
          }
          this.renderInitiatedByRefresh = true;
        } else if(change.type === this.props.eventCatalog.toolbar && change.payload.action === 'add'){

          this.addRow(change);

        } else if(change.type === this.props.eventCatalog.toolbar && change.payload.action === 'trash-selected'){
          change.payload.selected = this.getSelected();
          if(change.payload.promise){
            change.payload.promise.then(function(response){
              if(response.success){
                this.trashData(response.trashed || []);
                this.forceUpdate();
              }
              this.setTableState(this._tableStates.ready);
            }.bind(this));
          }
        } else if(change.type === this.props.eventCatalog.toolbar && change.payload.action === 'trash-all'){
          change.payload.selected = this.getSelected();
          if(change.payload.promise){
            change.payload.promise.then(function(response){
              if(response.success){
                this.state.data = [];
                this.state.selected = [];
                this.forceUpdate();
              }
            }.bind(this));
          }
        } else if(change.payload.action === 'download-csv' || change.payload.action === 'download-xml' || change.payload.action === 'download-json') {
          this._export(change.payload.action);
        }
        this.props.onTableEvent(change);
        this.logger.log('Called Table.handleToolbarChange() -->' + JSON.stringify(change));
      }

      _handleRowClick(change) {
        this.props.onTableEvent(change);
      }

      trashData(models) {
        this.logger.log('TRASHING from data ' + models);
        const idAttr = this.state.structure.id;
        const removeFromSelection = function(modelId){
          let selModel;
          const length = this.state.selected.length;
          const selected = this.state.selected;
          for (let i = 0; i < length; i++) {
            selModel = selected[i];
            if(modelId === selModel){
              this.state.selected.splice(i, 1);
              break;
            }
          }
        }.bind(this);

        const removeFromData = function(modelId){
          let dataModel;
          const length = this.state.data.length;
          const data = this.state.data;
          for (let i = 0; i < length; i++) {
            dataModel = data[i];
            if(modelId === dataModel[idAttr]){
              this.state.data.splice(i, 1);
              removeFromSelection(modelId);
              break;
            }
          }
        }.bind(this);
        const length = models.length;
        for (let i = 0; i < length; i++) {
          removeFromData(models[i]);
        }
      }

      _hideAllExpandedRows(){
        let row;
        Object.keys(this.refs.body.refs).map(function(ref){
          row = this.refs.body.refs[ref];
          if(row.state && row.state.isExpanded){
            row.toggleRowExpansion();
          }
        }, this);
      }

      _hideAllNestedRows(){
        let row;
        //this._openNestedRows = {};
        Object.keys(this.refs.body.refs).map(function(ref){
          row = this.refs.body.refs[ref];
          if(row.state.showChildren){
            row.toggleNestedRow();
            if(this.props.preserveNestedRowStateOnRender){
              this._openNestedRows[row.state.model[this.state.structure.id]] = row.state.model[this.state.structure.id];
            }
          }
        }, this);
      }

      handleSelectionChange(change){
        //const ns = update(this.state.selected, {$push: [change.payload.id]});
        const payload = change.payload;
        if(change.type === this.props.eventCatalog.select){
          if(payload.isSelected){
            if(this.props.selectionModel === 'one'){
              // @TODO see if we can find a better option
              this.setDeselected(this.state.selected);
              this.state.selected = [payload.id];
            } else {
              this.state.selected.push(payload.id);
            }
          } else {
            if(this.props.selectionModel === 'one'){
              // @TODO see if we can find a better option
              this.setDeselected(this.state.selected);
              this.state.selected = [];
            } else {
              const loc = this.state.selected.indexOf(payload.id);
              if(loc>-1){
                this.state.selected.splice(loc, 1);
              }
            }
          }
          //this.setState({'selected': this.state.selected});
        } else if(change.type === this.props.eventCatalog.selectAll) {
          let refComp;
          const _allSelected = [];
          Object.keys(this.refs.body.refs).map(function(ref){
            refComp = this.refs.body.refs[ref];
            if(refComp && refComp.isReactComponent){
              refComp.setState({'isSelected': payload.isSelected});
              _allSelected.push(ref);
            }
          }, this);

          if(payload.isSelected){
            Array.prototype.push.apply(this.state.selected, _allSelected);
            //this.state.selected = Object.keys(this.refs.body.refs);
          } else {
            this.state.selected.splice(0, this.state.selected.length);
          }


        }

        //this.logger.log('Called handleSelectionChange() -->' + JSON.stringify(change));
        //this.logger.log('Selection has -->' + this.state.selected.join(", "));

        //@TODO calling setState is causing slowness will find and fix later.
        //this.setState({'selected': this.state.selected});
        if(this.props.showToolbar){
          this.refs.toolbar.forceUpdate();
        }
        this.refs.headerSection.forceUpdate();

        this.props.onTableEvent(change);

        this.logger.log('Selection has -->' + this.state.selected.length + ' rows.');
      }

      handleInlineActionInvocation(change){

        if(change.type === this.props.eventCatalog.inlineAction){
          if(change.payload && change.payload.action === 'edit'){
            this.setTableState(this._tableStates.inlineEditing);
            if(this.props.useCustomModelEditor){
              change.payload.promise.then(function(response){
                this.setTableState(this._tableStates.ready);
              }.bind(this));

              change.payload.promise.catch(function(error){
                this.logger.error('Could not save model for error ' + JSON.stringify(error || {}));
                this.setTableState(this._tableStates.ready);
              }.bind(this));
            }

            this.logger.log('Making table in readonly mode for handleInlineActionInvocation called with mode edit');
          } else if(change.payload && change.payload.action === 'cancel'){
            this.setTableState(this._tableStates.ready);
            this.logger.log('Making table in ready mode for handleInlineActionInvocation called with cancel');
          } else if(change.payload && change.payload.action === 'save'){
            if(change.payload.promise){
              change.payload.promise.then(function(response){
                this.setTableState(this._tableStates.ready);
                this.logger.log('Some additional action on save after promise is resolved by Table main!');
              }.bind(this));
            }
          }
        }

        this.props.onTableEvent(change);

      }

      /*
      * Some basic sizing to be done here like
      * What is the minimun width needed and height we are left with after we make adjustments for various oprions.
      */
      _calculateSizing() {
        if(!this._dimensionAdjust){
          this._dimensionAdjust = {};
          const toolbarSize = HtmlUtils.size(ReactDOM.findDOMNode(this.refs.toolbarContainer));
          const footerSize = HtmlUtils.size(ReactDOM.findDOMNode(this.refs.footerContainer));
          const headerSize = HtmlUtils.size(ReactDOM.findDOMNode(this.refs.header));
          this._dimensionAdjust.heightAdjust = ((this.props.showToolbar) ? toolbarSize.h : 0) + headerSize.h + footerSize.h;

          let autoHeight = 300;
          if(this.props.height==='auto'){
            if(!this.props.usePagination){
              autoHeight = (this.state.data.length * 39) + this._dimensionAdjust.heightAdjust;
            } else {
              autoHeight = (this.state.pagination.pageSize * 39) + this._dimensionAdjust.heightAdjust;
            }
          } else {
            autoHeight = this.props.height;
          }
          this.state.dimension.h = autoHeight - this._dimensionAdjust.heightAdjust;
          this.logger.log('Table._dimensionAdjust --> ' + JSON.stringify(this._dimensionAdjust));
        }
        const parentSize = HtmlUtils.size(ReactDOM.findDOMNode(this).parentNode);
        //const paginatorSize = HtmlUtils.size(ReactDOM.findDOMNode(this.refs.paginator));

        let width = this.state.structure.width;
        if(this.props.selectionModel!=='none'){
          width += this.props.selectCBWidth;
        }
        if(this.props.useInlineActions){
          width += this.props.inlineActionsWidth;
        }
        let maxWidth = width
        if(this.props.flexible){
          maxWidth = Math.max(parentSize.w, maxWidth);
        }

        this.state.dimension.w = maxWidth;

        if(this.props.usePagination){
          //this.refs.paginatorContainer.style.maxWidth = maxWidth;
        }
        if(this.props.showToolbar){
          this.refs.toolbarContainer.style.maxWidth = maxWidth;
        }

        this.setState({'dimension': this.state.dimension});
        ReactDOM.findDOMNode(this.refs.body).style.maxHeight = this.state.dimension.h + 'px';

        this.logger.log('Table.state.dimension --> ' + JSON.stringify(this.state.dimension));

      }

      _handleAdjustScroll(change) {
        const bodyNode = ReactDOM.findDOMNode(this.refs.body);
        const rowHeight = HtmlUtils.height(bodyNode.getElementsByTagName('tr')[0]) + 1;// 1 added for border.

        const available = HtmlUtils.height(bodyNode) + bodyNode.scrollTop;
        const whereWeAre = rowHeight*(change.payload.rowIndex+1);

        if(change.payload.open){
          if(available < (whereWeAre + 50)){ // we may have hit the cornercase for dropdown.
            bodyNode.scrollTop = bodyNode.scrollTop + change.payload.height;
            this._adjustedScrollTop = true;
          }
        } else {
          const st = bodyNode.scrollTop + change.payload.height;
          if(this._adjustedScrollTop && st > 0){
            bodyNode.scrollTop = bodyNode.scrollTop - change.payload.height;
          }
          this._adjustedScrollTop = false;
        }

      }

      _renderPaginator() {
        //@TODO totalRecords = {this.state.totalRecords || this.state.data.length}
        return (
          <div className="paginator-container pull-right" ref="paginatorContainer">
            <Paginator
              allowPageSize = {this.props.allowPageSize}
              currentPage = {this.state.pagination.currentPage}
              eventCatalog = {this.props.eventCatalog}
              logger = {this.logger}
              onPaginatorChange = {this.handlePaginatorChange.bind(this)}
              pageLinksToShow = {this.props.pageLinksToShow}
              pageSize = {this.state.pagination.pageSize}
              pageSizes = {this.props.pagination.pageSizes}
              pagination = {this.state.pagination}
              ref = "paginator"
              totalRecords = {this.props.totalRecords}
               />
          </div>
        );
      }

      _renderToolbar() {
        const style = {maxWidth: this.state.dimension.w};
        return (
          <div className="toolbar-container" ref="toolbarContainer" style={style}>
            <Toolbar
              additionalToolbarItems = {this.props.additionalToolbarItems}
              delay = {this.props.delay}
              disabledToolbarItems = {this.props.disabledToolbarItems}
              exculdedToolbarItems = {this.props.exculdedToolbarItems}
              eventCatalog = {this.props.eventCatalog}
              icons = {this.props.icons}
              logger = {this.logger}
              minLength = {this.props.minLength}
              onSearchChange = {this.handleSearchChange.bind(this)}
              onToolbarChange = {this.handleToolbarChange.bind(this)}
              primaryToolbarItems = {this.props.primaryActions}
              ref = "toolbar"
              secondaryToolbarItems = {this.props.secondaryActions}
              selected = {this.state.selected}
              showFreeFormSearchBar = {this.props.showFreeFormSearchBar}
              structure = {this.state.structure}
              showToolbar = {this.props.showToolbar}
              toolbarItems = {this.props.toolbarItems} />
          </div>
        );
      }

      _renderFooter() {
        return (
          <div className="pull-left">
            <Message
              autoClear={this.props.autoClear}
              message={this.state.message}
              ref="footerMessage"/>
          </div>
        );
      }

      render() {
        this.logger.log('Calling Table.render()');
        let paginatorComponent;
        if(this.props.usePagination && this.state.pagination){
          paginatorComponent = this._renderPaginator();
        }
        let toolbarComponent;
        if(this.props.showToolbar && this.props.showToolbar){
          toolbarComponent = this._renderToolbar();
        }
        let footerComponent;
        if(this.props.showFooter){
          footerComponent = this._renderFooter();
        }

        setTimeout(function(){this.tableState = this._tableStates.ready;}.bind(this), 10);

        const tableStyle = {}
        if(this.props.minWidth){
          tableStyle['minWidth'] = this.props.minWidth;
        }
        const maxWidthStyle = {maxWidth: this.state.dimension.w};
        const bodyStyle = {'maxHeight': this.state.dimension.h};

        return (
          <div className="the-table" ref="table" style={tableStyle}>
            {toolbarComponent}
            <HeaderSection ref="headerSection" maxWidth={this.state.dimension.w} selectionModel={this.props.selectionModel} selected={this.state.selected}></HeaderSection>
            <div className="table-container" ref="tableContainer" style={tableStyle}>
              <div className="table-scroller" ref="tableScroller" style={{'width': this.state.dimension.w + 2}}>
                <Header
                  bordered = {this.props.bordered}
                  delay = {this.props.delay}
                  dimension = {this.state.dimension}
                  eventEmitter = {this.eventEmitter}
                  eventCatalog = {this.props.eventCatalog}
                  inlineActionsWidth = {this.props.inlineActionsWidth}
                  filter = {this.state.filter}
                  flexible = {this.props.flexible}
                  icons = {this.props.icons}
                  isNested = {this.props.isNested}
                  logger = {this.logger}
                  minLength = {this.props.minLength}
                  onHeaderChange = {this.handleHeaderChange.bind(this)}
                  ref = "header"
                  selectCBWidth = {this.props.selectCBWidth}
                  selectionModel = {this.props.selectionModel}
                  simpleFilterAlwaysVisible = {this.props.simpleFilterAlwaysVisible}
                  sort = {this.state.sort}
                  structure = {this.props.structure}
                  useInlineActions = {this.props.useInlineActions}
                  useRowExpander = {this.props.useRowExpander} />
                <Body
                  bordered = {this.props.bordered}
                  baseCellEditors = {this.props.baseCellEditors}
                  baseRenderers = {this.props.baseRenderers}
                  data = {this.state.data}
                  dimension = {this.state.dimension}
                  disabled = {this.state.disabled}
                  baseCellRenderer = {this.props.baseCellRenderer}
                  emitRowClick = {this.props.emitRowClick}
                  eventCatalog = {this.props.eventCatalog}
                  eventEmitter = {this.eventEmitter}
                  filter = {this.state.filter}
                  flexible = {this.props.flexible}
                  height = {this.props.height}
                  icons = {this.props.icons}
                  inlineActions = {this.props.inlineActions}
                  inlineActionsWidth = {this.props.inlineActionsWidth}
                  inlineActionsBroker = {this.props.inlineActionsBroker}
                  isNested = {this.props.isNested}
                  logger = {this.logger}
                  nestedKeySplitter = {this.props.nestedKeySplitter}
                  noDataMessage = {this.props.noDataMessage}
                  pagination = {this.state.pagination} // todo need to check if we
                  ref = "body"
                  selectCBWidth = {this.props.selectCBWidth}
                  selected = {this.state.selected}
                  selectionModel = {this.props.selectionModel}
                  striped = {this.props.striped}
                  structure = {this.props.structure}
                  style = {bodyStyle}
                  truncateOverflow = {this.props.truncateOverflow}
                  useCustomModelEditor = {this.props.useCustomModelEditor}
                  useInlineActions = {this.props.useInlineActions}
                  useRowExpander = {this.props.useRowExpander} />
                </div>
            </div>
            <div className="footer-container" ref="footerContainer" style={maxWidthStyle}>
              {paginatorComponent}
              {footerComponent}
            </div>
          </div>
        );
      }

      // Will trigger a refresh request for the table.
      refresh(reloadData){
        if(reloadData){
          this.handleToolbarChange(this._generateEventPayload('toolbar', 'refresh'));
        } else {
          this.forceUpdate();
        }
      }

      _autoRefresh(){
        if(this._autoRefreshTimer){
          clearTimeout(this._autoRefreshTimer);
        }
        if(this.state.autoRefresh){
          this._autoRefreshTimer = setTimeout(this.refresh.bind(this), this.state.autoRefreshInterval, true);
        }
      }

      enableAutoRefresh(interval){
        this.setState({
          autoRefresh: true,
          autoRefreshInterval: interval || this.props.autoRefreshInterval
        });
      }

      disableAutoRefresh(){
        if(this._autoRefreshTimer){
          clearTimeout(this._autoRefreshTimer);
        }
        this.setState({
          autoRefresh: false
        });
      }

      // toggle a row that can be expanded.
      toggleRowExpansion(id){
        if(this.props.useRowExpander){
          const row = this.refs.body.refs[id];
          if(row){
            row.toggleRowExpansion();
          }
        }
      }
      /**
      * Set a search for the table, a text string passed is to ba matched against all the visible columns.
      *
      * @param {value} a string.
      * @param {silent} a boolen if the filer should trigger an event. If silent is true it is assumed that data is filtered and no more query on server/cleint is needed.
      */
      setSearch(value, silent) {
        this.refs.search.setSearch(value, silent);
      }
      /**
      * Set a filter on the table. For simple filter provide, keys should match the attribure in structure that are visible.
      * {"filter":{"attr1":"val1", "attr2": "val2"}}
      *
      * @param {filterObject} an object as specified above.
      * @param {silent} a boolen if the filer should trigger an event. If silent is true it is assumed that data is filtered and no more query on server/cleint is needed.
      * @example table.setFilter({"address":"418"}, true, true);
      */
      setFilter(filterObject, silent, showAppliedFilter){
        if(filterObject && typeof filterObject === 'object'){
          this.refs.header.setFilter(filterObject, silent, showAppliedFilter);
        }
      }

      toggleSimpleFilter() {
        this.refs.header.toggleSimpleFilter();
      }

      setCompoundFilter(){

      }

      /**
      * Sets the tables state, do not confuse with react state object. This just reflects what state the table id in like ready, errored etc.
      * @param tableState string One of valid table states nemely ('error', 'initializing', 'inlineEditing', 'loading', 'loadingNested', 'ready')
      * @param message string optional message that we may have to show in the message area of the table.
      */
      setTableState(tableState, message){
        const domNode = ReactDOM.findDOMNode(this);
        if(this._tableStates[tableState]){
          this.setState({tableState});
          if(tableState === this._tableStates.inlineEditing){
            HtmlUtils.addClass(domNode, 'inline-editing');
          } else {
            HtmlUtils.removeClass(domNode, 'inline-editing');
          }
          if(message){
            this.table.setMessage(message);
          }
        } else {
          this.logger.error('Table.setTableState() called with an invalid state, should be one of ' + Object.keys(this._tableStates).join(' '));
        }
      }

      /**
      * Set a message that on the table.
      * @param message Object Has type and text as keys ex. {type: 'info', text:'An info message'} type can be one of info, success, warning, danger
      * @param autoClear boolean If set to true message will be cleared with a delay.
      */
      setMessage(message, autoClear){
        //message is an object that has type and text as keys.
        this.refs.footerMessage.setMessage(message, autoClear);
      }

      clearMessage(){
        this.refs.footerMessage.setMessage("", true);
      }

      /**
       * Set selected rows on table.
       * @param {items} an array of id's that need to be selected in table.
       */
      setSelected(items) {
        this._setSelection(items, true);
      }

      /**
       * Sets disabled row on table.
      **/
      getDisabled() {
        return this.state.disabled;
      }

      /**
       * Sets disabled row on table.
      **/
      setDisabled(items) {
        const disabledItems = this.state.disabled;
        if(items && items.length){
          //@todo will fix properly later right now we just reset disabled as we do not have setEnable API.
          // Will add after some research on how disabled feature will be utilized.
          this.setState({'disabled': items});
          /*
          items.forEach(item => {
            if(disabledItems.indexOf(item) === -1){
              disabledItems.push(item);
            }
          });
          this.setState({'disabled': disabledItems});
          */
        }
      }

      /**
       * Set deselected rows on table.
       * @param {items} an array of id's that need to be deselected in table.
       */
      setDeselected(items) {
        this._setSelection(items, false);
      }

      /**
       * Get selected rows.
       * @return {array} an array of id's that are selected.
       */
      getSelected() {
        return this.state.selected;
      }

      /**
      * Get selected rows models
      * @return {array} an array of models that are selected.
      */
      getSelectedModels() {
        const that = this;
        const idAttr = that.state.structure['id'];
        let _selModels = this.state.data.filter(model => {
          return that.state.selected.indexOf(model[idAttr]) > -1;
        });

        return _selModels;
      }

      updateModelForRow(model) {
        if(!model[this.state.structure.id]){
          this.logger.error('Table.updateModelForRow :: Trying to updateModelForRow failed, supplied model does not have id key, please supply model with a valid id/identifier as set in gid structure');
          return;
        }
        const row = this.refs.body.refs[model[this.state.structure.id]];
        if(!row){
          this.logger.error('Table.updateModelForRow :: Trying to updateModelForRow failed, supplied model is not part of data for the table, models that are part of table data can only be updated.');
          return;
        }
        try {
          row.setState({model});
        } catch(error) {
          this.logger.error('Table.updateModelForRow :: errored out ' + error);
        }
      }

      /**
      * Use this api to update the nested models for a given row. You may have scenarios where you have received new nested models thru polling.
      * @param modelOrId  model or row id for which we are updating nested models.
      * @param children an array of models that are nestedModels for this row.
      */
      updateNestedModelForRow(modelOrId, nestedModels) {
        let modelId = modelOrId;
        if(typeof modelOrId === 'object'){
          modelId = modelOrId[this.state.structure.id];
        }
        const row = this.refs.body.refs[modelId];
        if(!modelId || !row || typeof nestedModels !== 'object'){
          this.logger.error('Table.updateNestedModelForRow :: Trying to update failed, supplied modelOrId is not a valid modle in the data.');
          return;
        }
        try {
          row.state.model.children = nestedModels;
          this.forceUpdate(); // we have to use force here as we are updating deeply nested data that using setState from react will not help.
        } catch(error) {
          this.logger.error('Table.updateNestedModelForRow :: errored out ' + error);
        }
      }

      /**
      * Updates the
      */

      updateTableDataCollection(data, totalRecords) {
        if(this.props.useRowExpander && !this.props.preserveRowExpansionOnRender){
          this._hideAllExpandedRows();
        }
        if(data && typeof data === 'object'){
          this.setState({
            data,
            totalRecords,
            tableState: this._tableStates.ready
          });
        }
      }

      addRow(change) {
        //@TODO Harjeet Singh a hack for now will fix afetr we have some clarity.
        const newModel = Object.assign({}, this.state.data[0]);
        Object.keys(newModel).forEach(function (key) {
          newModel[key] = '';
        });
        newModel[this.state.structure.id] = new Date().getTime();
        if(change){
          change.payload.model = newModel;
        }


        this.state.data.splice(0, 0, newModel);
        this.forceUpdate();

        setTimeout(function(){
          const row = this.refs.body.refs[newModel[this.state.structure.id]];
          if(row){
            row.setMode('edit', true);
          }
        }.bind(this), 100);
      }

      /**
      * @private set the selection
      * @param items an array of model ids
      * @param selected boolean for selection for array provided.
      **/
      _setSelection(items, selected){
        if(!items || items.length === 0){
          return;
        }
        const selectedItems = [];
        const rows = this.refs.body.refs;
        const selectItem = function(id){
          const rowsArray = Object.keys(rows);
          const len = rowsArray.length;
          for(let i=0; i<len; i++){
            if(!rows[rowsArray[i]].tagName && rows[rowsArray[i]].props.model[this.state.structure.id]===id){
              rows[rowsArray[i]].setState({'isSelected': selected});
              selectedItems.push(id);
              return;
            }
          }
        }
        items.map(selectItem, this);

        this.state.selected = selectedItems;// doing it intentionally as we do not want to cause too many renders.

        // clear up old selection as selection model is one.
        // if(selected && this.props.selectionModel === 'one'){
        //  this.state.selected.splice(0, this.state.selected.length)
        //}

        //Array.prototype.push.apply(this.state.selected, selectedItems);

        this.logger.log('Selection has -->' + this.state.selected.length + ' rows.');
      }

      _generateEventPayload(type, action){
        return {
          type,
          'payload': {action}
        };
      }

      _export(action) {
        let type = 'JSON';
        if(action.endsWith('-csv')) {
          type = 'CSV';
        } else if(action.endsWith('-xml')) {
          type = 'XML';
        }

        Export.triggerDownload('table-export', type, this.state.data, this.state.structure, this.props.ignoreHiddenForExport);
      }

}

Table.state = {
  data: null,
  dimension: null,
  disabled: null,
  filter: null,
  message: null,
  pagination: Defaults.pagination,
  totalRecords: 0,
  selected: null,
  sort: null,
  structure: null
};


const propTypes = {
  //allow user to change page size.
  allowPageSize: PropTypes.bool,
  //do we need auto clearing of messages displayed.
  autoClear: PropTypes.bool,
  // if set to true the table will do an auto refresh after elapse of autoRefreshInterval
  autoRefresh: PropTypes.bool,
  // time in milliseconds that we need to wait after we set an autorefresh.
  autoRefreshInterval: PropTypes.number,
  // base cell editors when row is in edit mode to be used.
  baseCellEditors: PropTypes.object,
  // renderer for empty cell contents.
  baseCellRenderer: PropTypes.func,
  // base renderers to be used.
  baseRenderers: PropTypes.object,
  // if border is needed.
  bordered: PropTypes.bool,
  // data that table is going to render.
  data: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  // time in ms to be used for all delaying, like use typing in for a search etc.
  delay: PropTypes.number,
  // an array of models that have to be shown disabled.
  disabled: PropTypes.array,
  //catalog of all the events supported by the table, these events have specific payload associated.
  eventCatalog: PropTypes.object,
  //filter object as set on table search/simple/compound are supported
  filter: PropTypes.object,
  // set to true will make the table layout fexible meaning adjusting to parent container's width. The widths sets in structurs will be the minimun that will force a scrollbar if needed.
  flexible: PropTypes.bool,
  // primary will place the freeform search bar in primary toolbar, secondary in the secondary toolbar.
  freeFormSearchBarLocation: PropTypes.oneOf(['primary','secondary']),
  // if set to true will generate an event when user clicks on a row. the events will have model and column reference for the click event.
  emitRowClick: PropTypes.bool,
  // when a user types multiple conditions in header filter what predicate to use in that scenario.
  headerFilterPredicate: PropTypes.oneOf(['OR','AND']),
  //default minimum height if not specified the marginbox comes from mountNode.
  height: PropTypes.string,
  //all the icons used in the table except that are listed in metadata.
  icons: PropTypes.object,
  //When data is exported, if set to true the hidden fields will not get exported.
  ignoreHiddenForExport: PropTypes.bool,
  //width reserved for inline actions if used.
  inlineActionsWidth: PropTypes.number,
  // set of available inline actions.
  inlineActions: PropTypes.array,
  // a function that determines how to locate actions for a given model as all actions may not be available for all models.
  inlineActionsBroker: PropTypes.func,
  // if the table is nested.
  isNested: PropTypes.bool,
  // logger to user
  logger: PropTypes.object,
  // ALL: 0,  TRACE: 1,  DEBUG: 2,  INFO: 3,  WARN: 4,  ERROR: 5,  OFF: 10
  logLevel: PropTypes.number,
  // catalog of text messages that can be displayed.
  messageCatalog: PropTypes.object,
  // minimum characters that user needs to type for things like search.
  minLength: PropTypes.number,
  // minimum width in case w eneed , for scenarios where we do not want thr table to shrink beyond certain width, normally width of the table is sum of columns widths for all visible columns. If we set flexible and paren is reslly not wide enough we can override by setting minWidth.
  minWidth: PropTypes.number,
  // incase we are looking for a nested attr in a model what splitter to use.
  nestedKeySplitter: PropTypes.string,
  // @TODO mode to messageCatalog what test to show if there is no data.
  noDataMessage: PropTypes.string,
  // a function that can be provided as a prop to interface with table events.
  onTableEvent: PropTypes.func,
  // data state object refer defaults.
  pagination: PropTypes.object,
  // number of page linke to show.
  pageLinksToShow: PropTypes.number,
  // an array of row id's or model ids that need to ne pinned on top.
  pinnedRows: PropTypes.array,
  // an array of attributes from structure that need to ne pinned on left.
  pinnedColumns: PropTypes.array,
  // if we need to keep the expanded rows expanded after we refresh the table.
  preserveRowExpansionOnRender: PropTypes.bool,
  // if we need to keep the nested rows open after we refresh the table.
  preserveNestedRowStateOnRender: PropTypes.bool,
  // catalog of all the private events used internally by the table.
  privateEventCatalog: PropTypes.object,
  // actions belonging to secondary area of the toolbar, these would be merged with the type secondary in the toolbarItems.
  secondaryActions: PropTypes.array,
  // check box used for selection.
  selectCBWidth: PropTypes.number,
  // an array of models that have to be shown selected, helps in preselection situations.
  selected: PropTypes.array,
  // all/some/one/none meaning select all available, some has no select all, and non is non selectable.
  selectionModel: PropTypes.oneOf(['all','some','one','none']),
  // to show footer at bottom.
  showFooter: PropTypes.bool,
  // if we need to show the free form search bar on the right side of the toolbar section.
  showFreeFormSearchBar: PropTypes.bool,
  // where to show teh pagination when using type 'page' , top-right, top-left.... top-bottom-left.
  showPaginationAt: PropTypes.oneOf(['TR','TL','BR','BL', 'TBR', 'TBL']),
  // to show toolbar true by default.
  showToolbar: PropTypes.bool,
  // if simple filter is always visible.
  simpleFilterAlwaysVisible: PropTypes.bool,
  // either a sort object or an array of sort objects {attribute: anAttribute, order: 1} or -1
  sort: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  // if the table needs stripes.
  striped: PropTypes.bool,
  // refer docs/structure.md file for how to map a structure for a given model.
  structure: PropTypes.object,
  // action items that we intend to have in the toolbar.
  toolbarItems: PropTypes.array,
  //total number of records.
  totalRecords: PropTypes.number,
  // if we do not have enough width to display the cell content, ellipsis it.
  truncateOverflow: PropTypes.bool,
  // if set to false the base cell editors that enable inline editors will not be used, instead an event will be fired informing user to edit a given model in editor of their choise.
  useCustomModelEditor: PropTypes.bool,
  // to use or not to use inline actions.
  useInlineActions: PropTypes.bool,
  // if pagination is needed.
  usePagination: PropTypes.bool,
  // provides a + acting as a row expander where we can add additional details/actions about the row.
  useRowExpander: PropTypes.bool
}

const defaultProps = {
  allowPageSize: false,
  autoClear: true,
  autoRefresh: false,
  autoRefreshInterval: 7500,
  baseCellEditors: new CellEditors(),
  //baseRenderers: new Renderers(),
  bordered: true,
  delay: 500,
  eventCatalog: Defaults.eventCatalog,
  emitRowClick: false,
  freeFormSearchBarLocation: 'secondary',
  icons: Defaults.icons,
  ignoreHiddenForExport: false,
  inlineActions: Defaults.inlineActions,
  inlineActionsWidth: 80,
  //filter: {type: 'search'},
  flexible: true,
  headerFilterPredicate: 'OR',
  height: '300',
  logger: new Logger('Table', {logLevel: 10}),
  logLevel: 10,
  messageCatalog: Defaults.messageCatalog,
  minLength: 3,
  nestedKeySplitter: '.',
  noDataMessage: 'NoDataMessage',
  pagination: Defaults.pagination,
  pageLinksToShow: 3,
  preserveRowExpansionOnRender: false,
  privateEventCatalog: Defaults.privateEventCatalog,
  selectionModel: 'all',
  selectCBWidth: 32,
  showFreeFormSearchBar: false,
  showToolbar: false,
  showFooter: true,
  simpleFilterAlwaysVisible: false,
  striped: false,
  toolbarItems: [],
  totalRecords: 0,
  truncateOverflow: false,
  useCustomModelEditor: false,
  useInlineActions: false,
  usePagination: false,
  useRowExpander: false,
  //inlineActionsBroker: (model, action) => {return (model && action);},
  onTableEvent: (payload) => {console.log('Default onTableEvent handller called with payload -->' + JSON.stringify(payload));},
  baseCellRenderer: (column, model) => { return '<span class="empty-cell">NA</span>'}
};
Table.propTypes = propTypes;

Table.defaultProps = defaultProps;

Table.childContextTypes = {
  logger: PropTypes.object
}

export default Table;
