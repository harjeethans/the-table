import React from 'react';

import PropTypes from 'prop-types';

import classNames from 'classnames';

import Defaults from './Defaults';
import I18N from '../locale/I18N';

class Header extends React.Component {

  constructor(props, context) {
    super(props);
    this.logger = context.logger;
    this.type = 'simple';
    this.state = {
      filter: props.filter || {},
      structure: props.structure,
      simpleFilterVisible: props.simpleFilterAlwaysVisible
    };

    this.handleSelectionChange = this.handleSelectionChange.bind(this);
  }

  componentDidMount(){
    //default sorting
  }

  render(){
    const containerClasses = classNames('header', {'simple-filter-visible': this.state.simpleFilterVisible});
    const tableClasses = classNames('table', {'flexible': this.props.flexible}, {'table-bordered': this.props.bordered});
    const colGroup = this.renderColgroup();
    let headerColumns;
    if(this.props.showHeader){
      headerColumns = this.renderHeaderColumns();
    }
    let style;
    if(this.props.dimension){
      style = {width: this.props.dimension.w + 1};
    }
    return (
      <div ref="container" className={containerClasses} style={style}>
        <table className={tableClasses} width={this.props.dimension.w}>
          {colGroup}
          <tbody>
            {headerColumns}
          </tbody>
        </table>
      </div>
    )
  }

  onHeaderClick(col, event) {

    if(event.target.tagName !== 'INPUT' && col.sortable){
      let order = 1;
      const {sort} = this.props;
      if(sort && (sort.attribute === col.attr)){
        // we have this column already sorted on
        order = sort.order;
        order = order*-1;
      }
      const newSort = {'attribute': col.attr, order}
      this.triggerSort(newSort);
    }
  }

  triggerSort(sort) {
    // @TODO we may have to massage the message here little bit by adding some for info so that consumers can easily digest it.
    if(this.props.onHeaderChange && sort){
      this.props.onHeaderChange({
        'type': this.props.eventCatalog.sort,
        'payload': sort
      });
    }
  }

  handleSelectionChange(event) {
    const target = event.target;
    let isSelected = false;
    if(target.checked){
      this.setState({'isSelected': true});
      isSelected = true;
    } else {
      this.setState({'isSelected': false});
    }
    if(this.props.eventEmitter){
      this.props.eventEmitter.emit(this.props.privateEventCatalog.onSelectionChange, {
        'type': this.props.eventCatalog.selectAll,
        'payload' : {isSelected}
      });
    }
  }

  renderHeaderColumns() {
    let selectCol;
    if(this.props.selectionModel === 'all'){
      selectCol = <th data-column-id="selectAll" className="select-all">
        <label className="selectAll sel-checkbox__multi">
         <input className="sel-checkbox__multi__input " onChange={this.handleSelectionChange} type="checkbox" value="selectAll"/>
         <span className="sel-checkbox__multi__checkbox"></span>
        </label>
      </th>
    } else if(this.props.selectionModel === 'some' || this.props.selectionModel === 'one'){
      selectCol = <th data-column-id="selectAll"><span></span></th>
    } else {
      selectCol = null;
    }
    let rowExpander;

    if(this.props.isNested){
      rowExpander = <th data-column-id="nestingIndicator"></th>
    } else if(this.props.useRowExpander){
      rowExpander = <th data-column-id="rowExpander"></th>
    }
    let inlineActions;
    if(this.props.useInlineActions){
      const cssClasses = classNames('inline-actions' , {'inline-actions__align': this.state.simpleFilterVisible});
      inlineActions = <th><div className={cssClasses}>{I18N.getI18N("Options")}</div></th>
    }

    return (
      <tr>
        {selectCol}
        {rowExpander}
        {this.props.structure.columns.map(function(col) {
          if(!col.hidden){
            const columnClasses = classNames({'sortable': col.sortable, 'in-filter': (this.state.filter && this.state.filter.conditions &&  this.state.filter.conditions[col.attr])});
            const columnFilterText = (this.state.filter.conditions && this.state.filter.conditions[col.attr]) ? this.state.filter.conditions[col.attr] : '';
            //header is not shown if user has not types in anything for search
            let headerTextClasses = classNames('header-text', {'visible': !this.state.simpleFilterVisible, 'invisible': (this.state.simpleFilterVisible && columnFilterText.length < 1)});
            let sortOrderAscending = '';
            let sortOrderDescending = '';
            if(col.sortable && this.props.sort && (this.props.sort.attribute===col.attr)) {
              if(this.props.sort.order === 1){
                sortOrderAscending = 'sort-indicator__ascending--applied';
              } else {
                sortOrderDescending = 'sort-indicator__descending--applied';
              }
            }

            return (
              <th
                data-column-id={col.attr}
                className={columnClasses}
                onClick={this.onHeaderClick.bind(this, col)}
                key={col.attr}>
                <div className={'sort-indicator sort-indicator__ascending ' + sortOrderAscending} title={I18N.getI18N("Ascending")}></div>
                <div className='header-cell-container'>
                  <div className={headerTextClasses}>{col.label}</div>
                  {this.state.simpleFilterVisible && this.generateFilterInputFeild(col)}
                </div>
                <div className={'sort-indicator sort-indicator__descending ' + sortOrderDescending} title={I18N.getI18N("Descending")}></div>
              </th>
            );
          }
        }.bind(this))}
        {inlineActions}
      </tr>
    );
  }

  renderColgroup() {

    let selectCol;
    if(this.props.selectionModel === 'all' || this.props.selectionModel === 'some' || this.props.selectionModel === 'one'){
      selectCol = <col width={this.props.selectCBWidth}></col>
    }
    let rowExpander;
    if(this.props.isNested || this.props.useRowExpander){
      rowExpander = <col width={this.props.selectCBWidth}></col>
    }

    let inlineActions;
    if(this.props.useInlineActions){
      inlineActions = <col width={this.props.inlineActionsWidth}></col>
    }

    return (
      <colgroup>
        {selectCol}
        {rowExpander}
        {this.props.structure.columns.map(function(col, i) {
          if(!col.hidden){
            return (
              <col data-attr={col.attr} key={i} width={col.width}></col>
            );
          }
        })}
        {inlineActions}
      </colgroup>
    );

  }

  onFilterClick(col, event){
    event.stopPropagation();
  }

  onFilterChange(col, event){
    const val = event.target.value;
    let condition, conditions;
    //if(val.length>0){
      condition = {};
      if(col['queryAttr']){
        condition[col['queryAttr']] = val;
      } else {
        condition[col['attr']] = val;
      }

    ///}
    if(this.state.filter.conditions){
      conditions = Object.assign(this.state.filter.conditions, condition || {});
    } else {
      conditions = condition;
    }
    const filter = {'type': 'simple', conditions}
    //@TODO find a way to update arrays.
    this.setState({filter});
    this._triggerFilterEvent(filter);
  }

  clearFilterInputContent(col, event){
    event.target.value = '';
    if(this.state.filter && this.state.filter.conditions && (this.state.filter.conditions[col['queryAttr']] || this.state.filter.conditions[col['attr']])){
      if(col['queryAttr']){
        delete this.state.filter.conditions[col['queryAttr']];
      } else {
        delete this.state.filter.conditions[col['attr']];
      }
    }
    this.setState({'filter': this.state.filter});
    this._triggerFilterEvent(this.state.filter);
  }

  setFilter(filterConditions, silent, showAppliedFilter){
    if (typeof showAppliedFilter === "undefined") {
      showAppliedFilter = true;
    }
    const filterObject = {'type': 'simple', conditions: filterConditions};
    this.setState({filter: filterObject});
    if(showAppliedFilter){
      this.showSimpleFilter();
    }
    if(!silent){
      this._triggerFilterEvent(filterObject);
    }
  }

  clearFilter(silent) {
    const filterObject = {'type': 'simple', conditions: {}};
    this.setState({filter: filterObject});
    if(!silent){
      this._triggerFilterEvent(filterObject);
    }
  }

  /**
  * We will go thru the filter object here and trigger it with a payload of conditions that have a value satisfying minLength check,
  * any condition not satisfying the minLength check will be discarded.
  */
  _triggerFilterEvent(filter){
    if(this.props.onHeaderChange){
      if(!filter.conditions){
        this.props.onHeaderChange({
          'type': this.props.eventCatalog.simpleFilter,
          'payload': {'type': 'simple', 'conditions': {}}
        });
      } else {
        const conditions = filter.conditions;
        Array.from(Object.keys(conditions)).forEach(function(key) {
          if(conditions[key].length === 0){
            delete conditions[key];
          }
        });
        this.props.onHeaderChange({
          'type': this.props.eventCatalog.simpleFilter,
          'payload': {'type': 'simple', conditions}
        });
      }

    }
  }

  generateFilterInputFeild(col){
    var opts = {};
    if(!col.filterable) {
        //opts['readOnly'] = 'readOnly';
        opts['disabled'] = true;
        opts['title'] = I18N.getI18N("FilterDisabled");
    }
    if(col.type === 'set'){
      return (
        <select
          className = "form-control input-sm filter-input__rounded"
          defaultValue = "na"
          {...opts}
          onClick = {this.onFilterClick.bind(this, col)}
          onChange = {this.onFilterChange.bind(this, col)}>
            <option value="">{col.label}</option>
            {col.set.map(function(item, i){
              return (
                <option
                  key = {i}
                  value={item.value}>
                  {item.label}
                </option>
              );
            })}
        </select>
      );
    } else {
      return (
        <div>
          <input
            className = "form-control input-sm search-box filter-input__rounded"
            {...opts}
            onChange = {this.onFilterChange.bind(this, col)}
            ref = {"input-" + col.attr}
            type = "search"
            placeholder = {col.label}
            value = {(this.state.filter && this.state.filter.conditions) ? (this.state.filter.conditions[col.queryAttr] || this.state.filter.conditions[col.attr] || '') : ''} />
          </div>
      );
    }
  }
  showSimpleFilter() {
    this.setState({'simpleFilterVisible': true});
    this.logger.log('show filter');
  }

  hideSimpleFilter() {
    this.clearFilter();
    this.setState({'simpleFilterVisible': false});
    this.logger.log('hide filter');
  }

  toggleSimpleFilter() {
    //if filter is visible with some conditions set clear the filter as we are closing it.
    if(this.state.simpleFilterVisible && (this.state.filter.conditions && Object.keys(this.state.filter.conditions).length>0)){
      this.clearFilter();
    }
    this.setState({'simpleFilterVisible': !this.state.simpleFilterVisible});
  }

}

Header.state = {
  isSelected: false,
  filter: null,
  simpleFilterVisible: true,
  structure: null
}

Header.propTypes = {
  bordered: PropTypes.bool,
  delay: PropTypes.number, // delay
  dimension: PropTypes.object, // {w:100, h:100}
  eventCatalog: PropTypes.object, // catalog of all the events supported by the table, these venets have specific payload associated.
  eventEmitter: PropTypes.object, // event emitter for pub/sub
  filter: PropTypes.object, // filter if set.
  flexible: PropTypes.bool, // set to true will make the table layout fexible meaning adjusting to parent container's width. The widths sets in structurs will be the minimun that will force a scrollbar if needed.
  icons: PropTypes.object,
  inlineActionsWidth: PropTypes.number, // width reserved for inline actions if used.
  isNested: PropTypes.bool, // if the table is nested.
  onHeaderChange: PropTypes.func, // callback to execute when a header change event happens.
  logger: PropTypes.object.isRequired, // logger.
  minLength: PropTypes.number, // minLength
  privateEventCatalog: PropTypes.object, // private catalog of all the internal events used by the table.
  selectCBWidth: PropTypes.number, // check box used for selection.
  selectionModel: PropTypes.string, // all/some/none meaning select all available, some has no select all, and non is non selectable.
  simpleFilterAlwaysVisible: PropTypes.bool, // if the simple filter is always visible or visible at times.
  showHeader: PropTypes.bool, // set to false will not show the top header.
  sort: PropTypes.oneOfType([PropTypes.array, PropTypes.object]), // either a sort object or an array of sort objects {attribute: anAttribute, order: 1} or -1
  structure: PropTypes.object, // refer docs/structure.md file for how to map a structure for a given model.
  useInlineActions: PropTypes.bool, // to use or not to use inline actions.
  useRowExpander: PropTypes.bool // provides a + acting as a row expander where we can add additional details/actions about the row.
}

Header.defaultProps = {
  delay: 400,
  eventCatalog: Defaults.eventCatalog,
  flexible: true,
  icons: Defaults.icons,
  inlineActionsWidth: 100,
  minLength: 3,
  onHeaderChange: (payload) => {this.logger.log('Default onHeaderChange handller called with payload -->' + JSON.stringify(payload));},
  privateEventCatalog: Defaults.privateEventCatalog,
  selectCBWidth: 30,
  selectionModel: 'all',
  showHeader: true,
  useInlineActions: false,
  useRowExpander: false
}

Header.contextTypes = {
  logger: PropTypes.object
}

export default Header;
