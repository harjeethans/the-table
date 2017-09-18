import React from 'react';
//import ReactDOM from 'react-dom';
//import {Overlay, Popover} from 'react-bootstrap';

import Util from '../common/Util';
import I18N from '../locale/I18N';
import CellPopover from './CellPopover';


class Renderers {
  /**
   * Create a new Renderers object
   *
   * @constructor
   * @this {Renderers}
   * @param {string} category - the log category
   * @param {object} options - over-ride for the options
   *
   * popover type take following options
   * everything at http://react-bootstrap.github.io/components.html#popovers
   * plus onShow (callback), onHide (callback), height(integer), width(integer), scrollPopoverInView (boolean)
   */
  constructor(options = {}) {
    //this.options = Object.assign(this.options, options);
    this.options = options;
    this._lookupPrefix = '_';
    this._lookupSuffix = 'Renderer';
    this.types = {
      'ellipsis': {'options' : {}},
      'boolean': {'options': {'true': I18N.getI18N('True'), 'false' : I18N.getI18N('False')}},
      'popover': {'options': {scrollPopoverInView: false, delay: 500}}
    };
  }

  render(type, col, model, structure, eventEmitter, rowIndex, nestedKeySplitter) {
    if(this.types[type]) {
      switch (type) {
        case 'ellipsis':
          return this._ellipsesRenderer(col, model, structure, eventEmitter, rowIndex, nestedKeySplitter);
        case 'boolean':
          return this._booleanRenderer(col, model, structure, eventEmitter, rowIndex, nestedKeySplitter);
        case 'popover':
          return this._popoverRenderer(col, model, structure, eventEmitter, rowIndex, nestedKeySplitter);
      }
    }
  }

  /**
   * All the renderers are called with column, model, structure as arguments.
   */

  _ellipsesRenderer(column, model, structure, eventEmitter, rowIndex, nestedKeySplitter) {
    const mkp = this._generateCellContent(column, model, structure, eventEmitter, rowIndex, nestedKeySplitter);
    let title;
    if(typeof mkp === 'object') {
      if(typeof model[column.attr] !== 'object'){
        title = model[column.attr];
      }
    }

    return (<div className="ellipsis" title={title}>{mkp}</div>);
  }

  _booleanRenderer(column, model, structure, eventEmitter, rowIndex, nestedKeySplitter) {
    return (model[column.attr]) ? this.types.boolean.options['true'] : this.types.boolean.options['false'];
  }

  _popoverRenderer(column, model, structure, eventEmitter, rowIndex, nestedKeySplitter){
    return (
      <CellPopover
        baseOptions = {this.types['popover'].options}
        className = "column-popover"
        column = {column}
        eventEmitter = {eventEmitter}
        generateCellContent = {this._generateCellContent}
        model = {model}
        nestedKeySplitter = {nestedKeySplitter}
        rowIndex = {rowIndex}
        structure = {structure}>
      </CellPopover>);
  }

  _generateCellContent(column, model, structure, eventEmitter, rowIndex, nestedKeySplitter){
    let mkp;
    if(column.renderer && typeof column.renderer === 'function') {
      mkp = column.renderer(column, model);
      if(typeof mkp === 'object'){ //we have JSX here
        return mkp;
      } else { // we have a string here.
        mkp = {__html: mkp};
        return <span dangerouslySetInnerHTML={mkp} />;
      }
    } else {
      mkp = '<span>' + Util.getDescendantProp(model, column['attr'], nestedKeySplitter) + '</span>';
      mkp = {__html: mkp};
      return <span dangerouslySetInnerHTML={mkp} />;
    }
  }

  isTypeSupported(type) {
    return (this.types[type]) ? true : false;
  }

}

Renderers.options = {
  delay: 500
};

export default Renderers;
