import React from 'react';
import ReactDOM from 'react-dom';

import PropTypes from 'prop-types';

import classNames from 'classnames';
// import { Input, Button } from 'react-bootstrap';

import Util from '../common/Util';
import Defaults from './Defaults';
import Icon from '../common/components/Icon';
import InlineActions from './InlineActions';
import GridModal from './GridModal';


class Row extends React.Component {

  constructor(props, context) {
    super(props);
    this.logger = context.logger;
    this.state = {
      'model': this.props.model,
      'isSelected': this.props.isSelected};
    this._expandedRowRefrence;
    this._promisedAction = null;
  }

  componentDidMount(){
    //default sorting
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.model){
      this.setState({
        model: nextProps.model
      });
    }
  }

  componentWillUnmount() {
    this._clearExpandedRowReference();
  }

  handleSelectionChange(event) {
    const target = event.target;
    let isSelected = false;
    if(target.checked){
      this.logger.log('Select row:: '  + this.state.model[this.props.structure['id'] || 'id']);
      this.setState({'isSelected': true});
      isSelected = true;
    } else {
      this.logger.log('Deselect row:: '  + this.state.model[this.props.structure['id'] || 'id']);
      this.setState({'isSelected': false});
    }
    if(this.props.eventEmitter){
      this.props.eventEmitter.emit(this.props.privateEventCatalog.onSelectionChange, {
        'type': this.props.eventCatalog.select,
        'payload' : {
          isSelected,
          id: this.state.model[this.props.structure['id'] || 'id'],
          model: this.state.model
        }
      });
    }
  }

  //@TODO fix it later, lots of stuff is done here by hacking DOM as do not see any React way so far will revisit.
  toggleRowExpansion() {
    let isExpanded = false;
    const trNode = ReactDOM.findDOMNode(this);
    const tBodyNode = trNode.parentNode;
    let row;
    if(this.state.isExpanded){
      isExpanded = false;
      row = tBodyNode.rows[trNode.rowIndex + 1];
      this._clearExpandedRowReference();
      trNode.className = trNode.className.replace(/(?:^|\s)expanded-row(?!\S)/g, '' );
    } else {
      row = tBodyNode.insertRow(trNode.rowIndex + 1);
      row.dataset['expandedRowModelId'] = this.state.model[this.props.structure.id];
      isExpanded = true;
      row.className += "expanded-row-insert";
      const colSpan = trNode.childElementCount;
      const innerHTML = `<td colspan="${colSpan}"><div class="expanded-row-container">Expanded Row</div></td>`;
      row.innerHTML = innerHTML;
      trNode.className += " expanded-row";
    }
    this.setState({isExpanded});

    if(this.props.eventEmitter){
      const type = (isExpanded) ? this.props.eventCatalog['expandRow'] : this.props.eventCatalog['collapseRow'];
      const payload = {
        model: this.state.model,
        containerNode: row.querySelector("div.expanded-row-container")
      };
      this.props.eventEmitter.emit(this.props.privateEventCatalog.onToggleRowExpansion, {
        type,
        payload
      });
    }

  }

  _clearExpandedRowReference(){
    if(this.state.isExpanded){
      const trNode = ReactDOM.findDOMNode(this);
      const tBodyNode = trNode.parentNode;
      const rowIndex = trNode.rowIndex + 1
      tBodyNode.deleteRow(rowIndex);
    }
  }

  toggleNestedRow(){

    let showChildren = false;
    let action;
    if(this.state.showChildren){
      showChildren = false;
      action = this.props.privateEventCatalog.hideChildren
    } else {
      showChildren = true;
      action = this.props.privateEventCatalog.showChildren
    }

    const id = this.state.model[this.props.structure.id];
    const model = this.state.model;
    let payload;
    payload = {action, id, model}
    this._addPromiseToPayload(payload);
    const type = this.props.eventCatalog.fetchChildren;

    if(this.props.eventEmitter){
      this.props.eventEmitter.emit(this.props.eventCatalog.fetchChildren, {
        type, payload
      });
    }

    this.setState({showChildren});

    //this.logger.log('Nested row(' + this.state.model[this.props.structure.id]+ ') opened --> ' + showChildren);
  }

  onCellClick(event) {
    if(!this.props.emitRowClick){
      return;
    }
    const id = this.state.model[this.props.structure.id];
    const model = this.state.model;
    const type = this.props.eventCatalog['clickRow'];
    const attr = event.currentTarget.dataset['attr'];
    const payload = {attr, id, model};
    if(this.props.eventEmitter){
      this.props.eventEmitter.emit(type, {
        type, payload
      });
    }
  }

  render(){
    //this.logger.log('Row.render called for --> ' + this.state.model[this.props.structure.id]);
    let selectCol;
    if(this.props.selectionModel === 'all' || this.props.selectionModel === 'some'){
      selectCol = <td data-column-id="selectRow">
        <label className="selectAll sel-checkbox__multi">
          <input
            checked={this.state.isSelected ? true : false}
            disabled={this.props.isDisabled ? true : false}
            className="selectRow sel-checkbox__multi__input"
            onChange={this.handleSelectionChange.bind(this)}
            ref="selectRow"
            type="checkbox"
            value="selectRow" />
          <span className="sel-checkbox__multi__checkbox"></span>
        </label>
      </td>
    } else if (this.props.selectionModel === 'one'){
      selectCol = <td data-column-id="selectRow">
      <label className="sel-checkbox__single">
        <input
          checked={this.state.isSelected ? true : false}
          disabled={this.props.isDisabled ? true : false}
          className="selectRow sel-checkbox__single__input"
          onChange={this.handleSelectionChange.bind(this)}
          ref="selectRow"
          type="checkbox"
          value="selectRow" />
          <span className="sel-checkbox__single__checkbox"></span>
        </label>
      </td>
    } else {
      <td data-column-id="selectAll"></td>
    }

    let rowExpander;
    let rowExpanderIcon;
    if(this.props.isNested){
      if(this.props.nestingLevel < 1){
        rowExpanderIcon = (this.state.showChildren) ? this.props.icons.minus : this.props.icons.plus;
        rowExpander = <td data-column-id="nestingIndicator" className="row-expander" onClick={this.toggleNestedRow.bind(this)}><Icon iconName={rowExpanderIcon}></Icon></td>
      } else {
        rowExpander = <td className="row-expander"></td>
      }
    } else if(this.props.useRowExpander){
      rowExpanderIcon = (this.state.isExpanded) ? this.props.icons.minus : this.props.icons.plus;
      rowExpander = <td data-column-id="rowExpander" className="row-expander" onClick={this.toggleRowExpansion.bind(this)}><Icon iconName={rowExpanderIcon}></Icon></td>
    }

    let inlineActions;
    let _actions;
    if(this.state.mode === 'edit'){
      _actions = Defaults.inlineActionsSaveCancel;
    } else {
      _actions = this.props.inlineActions;
    }
    if(this.props.useInlineActions){
      inlineActions = <td><InlineActions
        eventEmitter = {this.props.eventEmitter}
        icons = {this.props.icons}
        inlineActions = {_actions}
        inlineActionsBroker = {this.props.inlineActionsBroker}
        isDisabled = {this.props.isDisabled}
        isLastRow = {this.props.isLastRow}
        model = {this.state.model}
        onClick = {this.onClickInlineAction.bind(this)}
        rowIndex = {this.props.rowIndex}
        structure = {this.props.structure}></InlineActions></td>
    }

    const createColumn = function(col){
      if(!col.hidden){
        const columnClasses = classNames({'in-filter': (this.props.filter && this.props.filter.conditions &&  this.props.filter.conditions[col.attr])});
        const attr = this.state.model[col.attr];
        return (
          <td
            className = {columnClasses}
            data-attr = {col.attr}
            onClick = {this.onCellClick.bind(this)}
            title = {(col.showTitleOnHover && typeof attr === 'string' && this.props.truncateOverflow ) ? attr : ""}
            key = {col.attr}>
            {this.computeColumnContent(col)}
          </td>
        );
      }
    }
    const rowClasses = classNames(
      {'mode-edit': this.state.mode === 'edit'},
      {'last-row': this.props.isLastRow},
      {'nested-open': (this.props.nestingLevel < 1 && this.state.showChildren)},
      {'child-row': this.props.nestingLevel > 0},
      {'child-row-last': this.props.lastChildForLevel},
      {'disabled-row': this.props.isDisabled},
      {'is-selected': this.state.isSelected});
    const _nestingLevel = (this.props.nestingLevel > 0) ? this.props.nestingLevel + '' : null;
    return (
      <tr className = {rowClasses} data-nesting-level = {_nestingLevel} key={this.state.model[this.props.structure.id]}>
        {selectCol}
        {rowExpander}
        {this.props.structure.columns.map(createColumn, this)}
        {inlineActions}
      </tr>
    )
  }

  computeColumnContent(col){
    if(this.state.mode === 'edit'){
      if(!this.state.modelShallowCopy){
        this.state.modelShallowCopy = Object.assign({}, this.state.model);
      }
      return this.generateInputFeild(col);
    } else {
      try {
        const baseRenderers = this.props.baseRenderers;
        if(col.rendererType && baseRenderers.isTypeSupported(col.rendererType)){
          return baseRenderers.render(col.rendererType, col, this.state.model, this.props.structure, this.props.eventEmitter, this.props.rowIndex, this.props.nestedKeySplitter);
        } else if(col.type === 'boolean'){
          return this.state.model[col.attr] + '';// react JSX issues with boolean.
        } else if(col.renderer && typeof col.renderer === 'function'){
          if(col.rendererType && col.rendererType === 'JSX'){
            return col.renderer(col, this.state.model);
          } else {
            const mkp = {__html: col.renderer(col, this.state.model)};
            return <div dangerouslySetInnerHTML={mkp} />
          }
        } else {

          return Util.getDescendantProp(this.state.model, col.attr, this.props.nestedKeySplitter);
        }

      } catch(error) {
        this.logger.error('Row column render errored out for column ' + col.attr + ' please check the renderer/type provided.');
        return this.state.model[col.attr];
      }

    }

  }

  generateInputFeild(col) {
    const baseCellEditors = this.props.baseCellEditors;
    if(col.type && baseCellEditors.isTypeSupported(col.type)){
      return baseCellEditors.render(col, this.state.modelShallowCopy, {'onChange': this.onInlineEditChange.bind(this)}, this.props.structure, this.props.nestedKeySplitter);
    }
  }

  onInlineEditChange(event){
    const target = event.currentTarget;
    const attr = target.dataset['attr'];
    const _o = {};
    _o[attr] = target.value;
    if(this.state.modelShallowCopy[attr]){
      this.setState({modelShallowCopy: Object.assign(this.state.modelShallowCopy, _o)});
    }
    this.logger.log('onInlineEditChange for inline row edit-->' + event.target.value);
  }

  onClickInlineAction(event, eventKey){
    const action = event.currentTarget.dataset.action;
    const promisable = event.currentTarget.dataset.promisable === 'true';

    if(event.currentTarget.dataset.confirm === 'true' && this.props.modalContainer){
      const _self = this;
      let modal;
      const onCloseModal = function(modalState){
        if(modalState.action === "OK"){
          _self._generateInlineAction(action, promisable);        }
      }
      modal = ReactDOM.render(
        <GridModal
          message={event.currentTarget.dataset.confirmMessage}
          show={1===1}
          title={event.currentTarget.dataset.confirmTitle}
          onCloseModal={onCloseModal} />, this.props.modalContainer);
    } else {
      this._generateInlineAction(action, promisable);
    }

  }

  // has to be 'edit' or 'view'
  setMode(mode){
    if(mode === 'view'){
      this.setState({mode});
    } else if(mode === 'edit') {
      this._generateInlineAction('edit', true);
    } else {
      this.logger.warn('Supported modes for a grid row are edit/view please supply supported mode.');
    }


  }
  _generateInlineAction(action, promisable){
    const id = this.state.model[this.props.structure.id];
    let model = this.state.model;
    const type = this.props.eventCatalog['inlineAction'];
    let payload;
    if(action === 'edit'){
      if(!this.props.useCustomModelEditor){
        // since we are using inline edit make the promisable false as promise would instead be used for save/cancel buttons.
        promisable = false;
        this.setState({'mode': 'edit'});
      }
    } else if(action === 'cancel'){
      this.setState({'mode': 'read', 'modelShallowCopy': null});
    } else if(action === 'save') {
      //@TODO Harjeet we should move it away to Grid.js
      model = this.state.modelShallowCopy;
    }
    payload = {action, id, model}
    if(promisable){
      this._promisedAction = action;
      this._addPromiseToPayload(payload);
    }

    if(this.props.eventEmitter){
      this.props.eventEmitter.emit(this.props.privateEventCatalog.onInlineActionInvocation, {
        type, payload
      });
    }
  }

  _addPromiseToPayload(payload){
    //const resolve = this._rejectPromise.bind(this);
    //const reject = this._rejectPromise.bind(this);
    payload.promise = new Promise(
      function(resolve, reject) {
        payload.resolve = resolve;
        payload.reject = reject;
        //console.log('Vanilla log to see when promise is started!');
      }
    );

    payload.promise.then(function(response){
      this._resolvePromise(response);
    }.bind(this)).catch(function(error){
      this._rejectPromise(error);
    }.bind(this));

    //return {
    //  'resolve': this._resolvePromise.bind(this),
    //  'reject': this._rejectPromise.bind(this)
    //}

  }

  _resolvePromise(response){
    if(this._promisedAction === 'save' || this._promisedAction === 'edit'){
      if(response && response.success){
        if(response.model){
          this.setState({
            model: response.model,
            'mode': 'read'
          });
        } else {
          if(!this.props.useCustomModelEditor){
            this.setState({
              model: Object.assign(this.state.model, this.state.modelShallowCopy),
              modelShallowCopy: null,
              'mode': 'read'
            });
          }
        }

        this.logger.log('Model saved successfully fired Row._resolvePromise with ' + JSON.stringify(response));
      }
    }

    this._promisedAction = null;

  }

  _rejectPromise(error){
    this._promisedAction = null;
    //this.logger.log('Fired Row._rejectPromise with ' + JSON.stringify(error || {}));
  }

}

/*
* mode can be 'view' and 'edit'
*/
Row.state = {
  isExpanded: false,
  isSelected: false,
  mode: 'view',
  model: null,
  modelShallowCopy: null,
  showChildren: false
}

Row.propTypes = {
  baseCellEditors: PropTypes.object, // base cell editors when row is in edit mode to be used.
  baseRenderers: PropTypes.object, // base rebderers to be used.
  baseCellRenderer: PropTypes.func, // renderer for empty cell contents.
  emitRowClick: PropTypes.bool, // if set to true will generate an event when user clicks on a row. the events will have model and column reference for the click event.
  eventCatalog: PropTypes.object,
  eventEmitter: PropTypes.object, // event emitter for pub/sub
  filter: PropTypes.object, //filter object as set on grid search/simple/compound are supported
  icons: PropTypes.object,
  inlineActions: PropTypes.array,
  inlineActionsBroker: PropTypes.func, // a function that determines how to locate actions for a given model as all actions may not be available for all models.
  inlineActionsWidth: PropTypes.number, // width reserved for inline actions if used.
  isDisabled: PropTypes.bool, // disabled indicator.
  isLastRow: PropTypes.bool, // true if this happens to be the last row.
  isNested: PropTypes.bool, // if the grid is nested.
  isSelected: PropTypes.bool, // selection indicator.
  lastChildForLevel: PropTypes.bool, // indicator for last row for a given level, css selector will not help need to add for that.
  model: PropTypes.object, // refer docs/structure.md file for how to map a structure for a given model.
  modalContainer: PropTypes.any, // container to hold the modal .
  nestedKeySplitter: PropTypes.string, //  incase we are looking for a nested attr in a model what splitter to use.
  nestingLevel: PropTypes.number, // level of the nested row.
  privateEventCatalog: PropTypes.object,
  rowIndex: PropTypes.number, // index of row in teh table.
  selectCBWidth: PropTypes.number, // check box used for selection.
  selectionModel: PropTypes.string, // all/some/none meaning select all available, some has no select all, and non is non selectable.
  structure: PropTypes.object, // refer docs/structure.md file for how to map a structure for a given model.
  truncateOverflow: PropTypes.bool, // if we do not have enough width to display the cell content, ellipsis it.
  useCustomModelEditor: PropTypes.bool, // if set to false the base cell editors that enable inline editors will not be used, instead an event will be fired informing user to edit a given model in editor of their choise.
  useInlineActions: PropTypes.bool, // to use or not to use inline actions.
  useRowExpander: PropTypes.bool // provides a + acting as a row expander where we can add additional details/actions about the row.

}

Row.defaultProps = {
  eventCatalog: Defaults.eventCatalog,
  privateEventCatalog: Defaults.privateEventCatalog,
  icons: Defaults.icons,
  isLastRow: false,
  isNested: false,
  isSelected: false,
  nestingLevel: 0,
  selectionModel: 'all',
  useInlineActions: false
}

Row.contextTypes = {
  logger: PropTypes.object.isRequired
}

export default Row;
