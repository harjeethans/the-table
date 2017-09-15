import React, { Component } from 'react';
import ReactDOM from 'react-dom';


import PropTypes from 'prop-types';
import classNames from 'classnames';

import Defaults from './Defaults';
import Logger from '../common/Logger';
import CellEditors from '../common/CellEditors';
import Util from '../common/Util';
import EventEmitter from '../common/EventEmitter';
import HtmlUtils from '../common/HtmlUtils';


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

      // the states grid may have at a given time, listen to events for what state wr are in, private so do not set directly.
      this._gridStates = {
        'error' : 'error',
        'initializing': 'initializing',
        'inlineEditing' : 'inlineEditing',
        'loading' : 'loading',
        'loadingNested' : 'loadingNested',
        'ready' : 'ready'
      };
      this.gridState = this._gridStates.initializing;


      const { autoRefresh, autoRefreshInterval, data, disabled, filter, message, selected, sort, structure, totalRecords } = this.props;

      const dimension = {w: this.props.structure.width, h: this.props.height};
      const pagination = (this.props.usePagination) ? this.props.pagination : null;

      this.state = {autoRefresh, autoRefreshInterval, data, dimension, disabled, filter, message, pagination, selected, sort, structure, totalRecords };

      this.props.logger.setLogLevel(this.props.logLevel);
      this.logger = this.props.logger;

      this._calculateSizing = this._calculateSizing.bind(this);
      this._debouncedCalculateSizing = Util.debounce(this._calculateSizing, props.delay);
      this._debouncedOnGridEvent = Util.debounce(this.props.onGridEvent, this.props.delay);
      // reference for expanded rows.
      //this._expandedRows = {};
      this._openNestedRows = {};
      // added as for a nested grid when we have open nodes , we need to maintin open state on refresh.
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
      if(this._debouncedOnGridEvent){
        this._debouncedOnGridEvent.cancel();
      }

    }

    unmountGrid(){
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
            log.error('');
            return false;
          }

        }, this);


        this.renderInitiatedByRefresh = false;
      }
      if(this.state.autoRefresh){
        this._autoRefresh();
      }
      this.logger.log('Called componentDidUpdate() on Grid');
    }

    componentWillUpdate(/*nextProps, nextState*/){
      this.gridState = this._gridStates.initializing;
    }







  render() {
    return (
      <div>Table</div>
    );
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
  // if set to true the grid will do an auto refresh after elapse of autoRefreshInterval
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
  // data that grid is going to render.
  data: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  // time in ms to be used for all delaying, like use typing in for a search etc.
  delay: PropTypes.number,
  // an array of models that have to be shown disabled.
  disabled: PropTypes.array,
  //catalog of all the events supported by the grid, these events have specific payload associated.
  eventCatalog: PropTypes.object,
  //filter object as set on grid search/simple/compound are supported
  filter: PropTypes.object,
  // set to true will make the table layout fexible meaning adjusting to parent container's width. The widths sets in structurs will be the minimun that will force a scrollbar if needed.
  flexible: PropTypes.bool,
  // if set to true will generate an event when user clicks on a row. the events will have model and column reference for the click event.
  emitRowClick: PropTypes.bool,
  // when a user types multiple conditions in header filter what predicate to use in that scenario.
  headerFilterPredicate: PropTypes.oneOf(['OR','AND']),
  //default minimum height if not specified the marginbox comes from mountNode.
  height: PropTypes.string,
  //all the icons used in the grid except that are listed in metadata.
  icons: PropTypes.object,
  //When data is exported, if set to true the hidden fields will not get exported.
  ignoreHiddenForExport: PropTypes.bool,
  //width reserved for inline actions if used.
  inlineActionsWidth: PropTypes.number,
  // set of available inline actions.
  inlineActions: PropTypes.array,
  // a function that determines how to locate actions for a given model as all actions may not be available for all models.
  inlineActionsBroker: PropTypes.func,
  // if the grid is nested.
  isNested: PropTypes.bool,
  // logger to user
  logger: PropTypes.object,
  // ALL: 0,  TRACE: 1,  DEBUG: 2,  INFO: 3,  WARN: 4,  ERROR: 5,  OFF: 10
  logLevel: PropTypes.number,
  // catalog of text messages that can be displayed.
  messageCatalog: PropTypes.object,
  // minimum characters that user needs to type for things like search.
  minLength: PropTypes.number,
  // minimum width in case w eneed , for scenarios where we do not want thr grid to shrink beyond certain width, normally width of the grid is sum of columns widths for all visible columns. If we set flexible and paren is reslly not wide enough we can override by setting minWidth.
  minWidth: PropTypes.number,
  // incase we are looking for a nested attr in a model what splitter to use.
  nestedKeySplitter: PropTypes.string,
  // @TODO mode to messageCatalog what test to show if there is no data.
  noDataMessage: PropTypes.string,
  // a function that can be provided as a prop to interface with grid events.
  onGridEvent: PropTypes.func,
  // data state object refer defaults.
  pagination: PropTypes.object,
  // number of page linke to show.
  pageLinksToShow: PropTypes.number,
  // an array of row id's or model ids that need to ne pinned on top.
  pinnedRows: PropTypes.array,
  // an array of attributes from structure that need to ne pinned on left.
  pinnedColumns: PropTypes.array,
  // if we need to keep the expanded rows expanded after we refresh the grid.
  preserveRowExpansionOnRender: PropTypes.bool,
  // if we need to keep the nested rows open after we refresh the grid.
  preserveNestedRowStateOnRender: PropTypes.bool,
  // actions belonging to primary area of the toolbar, these would be merged with the type primary in the toolbarItems
  primaryActions: PropTypes.array,
  // catalog of all the private events used internally by the grid.
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
  // if the grid needs stripes.
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
  icons: Defaults.icons,
  ignoreHiddenForExport: false,
  inlineActions: Defaults.inlineActions,
  inlineActionsWidth: 80,
  //filter: {type: 'search'},
  flexible: true,
  headerFilterPredicate: 'OR',
  height: '300',
  logger: new Logger('Grid', {logLevel: 10}),
  logLevel: 10,
  messageCatalog: Defaults.messageCatalog,
  minLength: 3,
  nestedKeySplitter: '.',
  noDataMessage: 'NoDataMessage',
  pagination: Defaults.pagination,
  pageLinksToShow: 3,
  preserveRowExpansionOnRender: false,
  primaryActions: [],
  privateEventCatalog: Defaults.privateEventCatalog,
  selectionModel: 'all',
  selectCBWidth: 32,
  showFreeFormSearchBar: false,
  showToolbar: false,
  showFooter: true,
  simpleFilterAlwaysVisible: false,
  striped: false,
  toolbarItems: Defaults.toolbarItems,
  totalRecords: 0,
  truncateOverflow: false,
  useCustomModelEditor: false,
  useInlineActions: false,
  usePagination: false,
  useRowExpander: false,
  //inlineActionsBroker: (model, action) => {return (model && action);},
  onGridEvent: (payload) => {this.logger.log('Default onGridEvent handller called with payload -->' + JSON.stringify(payload));},
  baseCellRenderer: (column, model) => { return '<span class="empty-cell">NA</span>'}
};
Table.propTypes = propTypes;

Table.defaultProps = defaultProps;


export default Table;
