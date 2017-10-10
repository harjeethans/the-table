import React from 'react';

import PropTypes from 'prop-types';

import classNames from 'classnames';

//import HtmlUtils from './common/HtmlUtils';
import I18N from '../locale/I18N';
import Defaults from './Defaults';
import Row from './Row';

class Body extends React.Component {

  constructor(props, context) {
    super(props);
    this.state ={
      data: props.data || [],
      pagination: props.pagination,
      expandedRows: []
    };
    this.logger = context.logger;
    this._countExpanded = 0;
  }

  componentDidMount(){
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      data: nextProps.data
    });
  }

  render (){
    const rows = [];
    const containerClasses = classNames('body', {'auto-height': this.props.height === 'auto'});
    const tableClasses = classNames('table', {'flexible': this.props.flexible}, {'ellipsis': this.props.truncateOverflow}, {'table-bordered': this.props.bordered}, {'table-striped': this.props.striped});
    const colGroup = this.renderColgroup();
    // this.logger.log("Rows to render::" + this.props.data.length);

    const createRow = function(model, index, level, lastChildForLevel){


      return (
        <Row
          baseCellEditors = {this.props.baseCellEditors}
          baseRenderers = {this.props.baseRenderers}
          baseCellRenderer = {this.props.baseCellRenderer}
          emitRowClick = {this.props.emitRowClick}
          eventEmitter = {this.props.eventEmitter}
          filter = {this.props.filter}
          icons = {this.props.icons}
          inlineActions = {this.props.inlineActions}
          inlineActionsWidth = {this.props.inlineActionsWidth}
          inlineActionsBroker = {this.props.inlineActionsBroker}
          isDisabled = { (this.props.disabled) ? this.props.disabled.indexOf(model[this.props.structure['id']]) > -1 : false}
          isNested = {this.props.isNested}
          isSelected = { (this.props.selected) ? this.props.selected.indexOf(model[this.props.structure['id']]) > -1 : false}
          key = {model[this.props.structure["id"]]}
          isLastRow = {(index+1)===this.state.data.length}
          lastChildForLevel = {lastChildForLevel}
          model = {model}
          modalContainer = {this.refs.modalContainer}
          nestedKeySplitter = {this.props.nestedKeySplitter}
          nestingLevel = {level}
          ref = {model[this.props.structure["id"]]}
          rowIndex = {index}
          selectCBWidth = {this.props.selectCBWidth}
          selectionModel = {this.props.selectionModel}
          structure = {this.props.structure}
          truncateOverflow = {this.props.truncateOverflow}
          useCustomModelEditor = {this.props.useCustomModelEditor}
          useInlineActions = {this.props.useInlineActions}
          useRowExpander = {this.props.useRowExpander} >
        </Row>
      );
    }.bind(this);

    //const len = this.state.data.length;
    let index = 0;
    let nestedIndex = 0;
    for (const model of this.state.data) {
      if(this.props.isNested && model[this.props.structure.childrenAttr]){
        rows.push(createRow(model, index));
        index++;
        nestedIndex = 1;
        for (const nestedModel of model[this.props.structure.childrenAttr]) {
          // element:last:child css selector does not help here so need to add a class indicator.
          if(nestedIndex === model[this.props.structure.childrenAttr].length){
            rows.push(createRow(nestedModel, index, 1, true));
          } else {
            rows.push(createRow(nestedModel, index, 1));
          }
          nestedIndex++;
          index++
        }
      } else {
        rows.push(createRow(model, index, 0));
      }
      index++;
    }

    let style;
    if(this.props.dimension){
      style = {width: this.props.dimension.w + 1};
    }
    return (
      <div className={containerClasses} style={style}>
        { this.state.data && this.state.data.length>0 &&
          <table className={tableClasses} width={this.props.dimension.w}>
            {colGroup}
            <tbody>
              {rows}
            </tbody>
          </table>
        }
        { (!this.state.data || this.state.data.length===0) &&
          <div className="no-data-found">
            <strong>{I18N.getI18N(this.props.noDataMessage)}</strong>
          </div>
        }
        <div ref="modalContainer"></div>
      </div>
    )
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
        {this.props.structure.columns.map(function(col) {
          if(!col.hidden){
            return (
              <col data-attr={col.attr} key={col.attr} width={col.width}></col>
            );
          }
        })}
        {inlineActions}
      </colgroup>
    );
  }

}

Body.state = {
  data:null,
  expandedRows: null,
  pagination: null
}

Body.propTypes = {
  baseCellEditors: PropTypes.object, // base cell editors when row is in edit mode to be used.
  baseRenderers: PropTypes.object, // base rebderers to be used.
  bordered: PropTypes.bool, // if border is needed.
  data: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),// data that table is going to render.
  dimension: PropTypes.object, // {w:100, h:100}
  disabled: PropTypes.array, // an array of models that have to be shown disabled.
  baseCellRenderer: PropTypes.func, // renderer for empty cell contents.
  emitRowClick: PropTypes.bool, // if set to true will generate an event when user clicks on a row. the events will have model and column reference for the click event.
  eventEmitter: PropTypes.object, // event emitter for pub/sub
  pagination: PropTypes.object, // data state object refer defaults.
  filter: PropTypes.object, //filter object as set on table search/simple/compound are supported
  flexible: PropTypes.bool, // set to true will make the table layout fexible meaning adjusting to parent container's width. The widths sets in structurs will be the minimun that will force a scrollbar if needed.
  height: PropTypes.string,
  icons: PropTypes.object,
  inlineActions: PropTypes.array,
  inlineActionsBroker: PropTypes.func, // a function that determines how to locate actions for a given model as all actions may not be available for all models.
  inlineActionsWidth: PropTypes.number, // width reserved for inline actions if used.
  isNested: PropTypes.bool, // if the table is nested.
  nestedKeySplitter: PropTypes.string, //  incase we are looking for a nested attr in a model what splitter to use.
  noDataMessage: PropTypes.string, // what test to show if there is no data.
  parentId: PropTypes.string, //parentId if any, nested rows will have a parent.
  selectCBWidth: PropTypes.number, // check box used for selection.
  selectionModel: PropTypes.string, // all/some/none meaning select all available, some has no select all, and non is non selectable.
  selected: PropTypes.array, // an array of models that have to be shown selected, helps in preselection situations.
  striped: PropTypes.bool, // if the table needs stripes.
  structure: PropTypes.object, // refer docs/structure.md file for how to map a structure for a given model.
  truncateOverflow: PropTypes.bool, // if we do not have enough width to display the cell content, ellipsis it.
  useCustomModelEditor: PropTypes.bool, // if set to false the base cell editors that enable inline editors will not be used, instead an event will be fired informing user to edit a given model in editor of their choise.
  useInlineActions: PropTypes.bool, // to use or not to use inline actions.
  useRowExpander: PropTypes.bool // provides a + acting as a row expander where we can add additional details/actions about the row.
}

Body.defaultProps = {
  icons: Defaults.icons,
  flexible: true,
  inlineActionsWidth: 100,
  selectCBWidth: 30,
  selectionModel: 'all',
  useInlineActions: false
}

Body.contextTypes = {
  logger: PropTypes.object.isRequired
}

export default Body;
