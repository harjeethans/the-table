import React from 'react';

import Util from './Util';

class CellEditors {
  /**
   * Create a new CellEditors object
   *
   * @constructor
   * @this {CellEditors}
   * @param {string} category - the log category
   * @param {object} options - over-ride for the options
   */
  constructor(options = {}) {
    //this.options = Object.assign(this.options, options);
    this.options = options;
    this._lookupPrefix = '_';
    this._lookupSuffix = 'Editor';
    this.types = {
      'integer': {'options' : {}},
      'set': {'options': {}},
      'string': {'options': {}},
      'text': {'options' : {}}
    };
  }

  render(column, model, callbacks, structure, nestedKeySplitter) {
    if(this.types[column.type]) {
      switch (column.type) {
        case 'set':
          return this._setEditor(column, model, callbacks, structure, nestedKeySplitter);
        default :
          return this._textEditor(column, model, callbacks, structure, nestedKeySplitter);
      }
    }
  }

  /**
   * All the CellEditors are called with column, model, structure as arguments.
   */

  _textEditor(column, model, callbacks, structure, nestedKeySplitter) {
    let options = Object.assign({}, this.types.text.options, (column.editorOptions || {}));
    if(!column.editable){
      options = Object.assign(options, {'disabled': true});
    }
    return (
      <div className="text-editor">
      <input
        className = "form-control input-sm"
        data-attr = {column.attr}
        {...callbacks}
        {...options}
        type = "text"
        value = {Util.getDescendantProp(model, column['attr'], nestedKeySplitter)} />
      </div>);
  }

  _setEditor(column, model, callbacks) {
    let options = Object.assign({}, this.types.set.options, (column.editorOptions || {}));
    if(!column.editable){
      options = Object.assign(options, {'disabled': true});
    }
    return (
      <div className = "set-editor">
        <select
          className = "form-control input-sm"
          data-attr = {column.attr}
          defaultValue = {model[column['attr']] || "na"}
          {...callbacks}
          {...options}>
          {column.set.map(function(item, i){
            return (
              <option
                key = {i}
                value={item.value}>
                {item.label}
              </option>
            );
          })}
        <option value="na">none</option>
      </select>
      </div>
    );
  }

  isTypeSupported(type) {
    return (this.types[type]) ? true : false;
  }

}

/**
 * Definition of the valid log LogLevels
 */
CellEditors.options = {
  delay: 500
};

export default CellEditors;
