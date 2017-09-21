import React from 'react';
import ReactDOM from 'react-dom';

import PropTypes from 'prop-types';

import classNames from 'classnames';
//import {Button, MenuItem, Dropdown, ButtonToolbar} from 'react-bootstrap';

import I18N from '../locale/I18N';
import Defaults from './Defaults';
//import EventEmitter from './common/EventEmitter';
import Icon from '../common/components/Icon';

class InlineActions extends React.Component {

  onClickMenuItem(eventKey, event){
    if(this.props.onClick){
      this.props.onClick(event, eventKey);
    }
    event.preventDefault();
  }

  onClick(event){
    if(this.props.onClick){
      this.props.onClick(event);
    }
    event.preventDefault();
  }

  handleOnToggle(open) {
    //@TODO dropdown height is avilable after it is shown not before.
    let ulNode;
    if(!this.dropdownHeight){
      ulNode = ReactDOM.findDOMNode(this).getElementsByTagName('ul')[0];
      if(ulNode){
        this.dropdownHeight = (ulNode.childElementCount*25) + 12; // Cannot HtmlUtils.height(ulNode) as marginBox is not available.
      } else {
        this.dropdownHeight = 50;
      }

    }
    if(this.props.eventEmitter){
      this.props.eventEmitter.emit(this.props.eventCatalog.adjustScroll, {
        'type': this.props.eventCatalog.adjustScroll,
        'payload' : {open, height: this.dropdownHeight, rowIndex: this.props.rowIndex}
      });
    }

  }
  render(){

    const toolbarClasses = classNames('inlineActions');

    const getLabel = function(item){
      if(item.iconName) {
        return <Icon iconName={item.iconName}></Icon>
      } else {
        return I18N.getI18N(item.label);
      }
    }
    const props = this.props;
    const isActionAllowed = function(action){
      if(props.inlineActionsBroker){
        return props.inlineActionsBroker(props.model, action.action);
      }
      return true;
    }

    const createToolbar = function(item, i){
      if(item.items){
        return (
          <button
            disabled={this.props.isDisabled}
            onToggle = {this.handleOnToggle.bind(this)}
            key={i}
            pullRight={this.props.inlineActionsAlignRight}
            id={`inline-${i}`}>
            <button disabled={this.props.isDisabled} noCaret bsSize="xsmall" bsStyle="default">
              {getLabel(item)}
            </button>
            <button>
              {item.items.map(function(innerItem, j) {
                if(isActionAllowed(innerItem)){
                  return (
                    <button
                      data-action={innerItem.action}
                      data-confirm = {innerItem.needsConfirmation}
                      data-confirm-message = {innerItem.confirmationMessage}
                      data-confirm-title = {innerItem.confirmationTitle}
                      data-promisable = {innerItem.promisable}
                      eventKey={innerItem.action}
                      href="javascript:void(0)"
                      key={j}
                      onSelect={this.onClickMenuItem.bind(this)}>
                      {getLabel(innerItem)}
                    </button>
                  );
                }
              }, this)}
            </button>
          </button>
        );
      } else {
        if(isActionAllowed(item)){
          return (
            <button
              data-action = {item.action}
              data-confirm = {item.needsConfirmation}
              data-confirm-message = {item.confirmationMessage}
              data-confirm-title = {item.confirmationTitle}
              data-promisable = {item.promisable}
              key = {i}
              onClick = {this.onClick.bind(this)}
              bsSize = "xsmall"
              bsStyle="default"
              title = {item.label}>
              {getLabel(item)}
            </button>
          );
        }
      }
    }

    let isAnyActionAllowed = false;
    for (const item of this.props.inlineActions) {
      if(item.items){
        for (const innerItem of item.items) {
          if(isActionAllowed(innerItem)){
            isAnyActionAllowed = true;
            break;
          }
        }
      } else {
        if(isActionAllowed(item)){
          isAnyActionAllowed = true;
          break;
        }
      }
    }
    let inlineActions;
    if(isAnyActionAllowed){
      inlineActions = this.props.inlineActions.map(createToolbar, this);
    }

    this.props.inlineActions.map(function(item, i){

    }, this);

    return (
      <div className={toolbarClasses}>
        <button>
          {inlineActions}
        </button>
      </div>
    );
  }
}

InlineActions.propTypes = {
  confirmationMessage: PropTypes.string, // confirmation messgae to display if not provided by toolbar item.
  confirmationTitle: PropTypes.string,
  eventCatalog: PropTypes.object, // catalog of all the events supported by the table, these venets have specific payload associated.
  eventEmitter: PropTypes.object, // event emitter for pub/sub
  icons: PropTypes.object,
  inlineActions: PropTypes.array, // set of available inline actions.
  inlineActionsAlignRight: PropTypes.bool,
  inlineActionsBroker: PropTypes.func, // a function that determines how to locate actions for a given model as all actions may not be available for all models.
  isDisabled: PropTypes.bool, // disabled indicator.
  isLastRow: PropTypes.bool,// true if it is inlineaction for last row.
  model: PropTypes.object, // refer docs/structure.md file for how to map a structure for a given model.
  onClick: PropTypes.func, // onClick handller
  rowIndex: PropTypes.number, // index of row in teh table.
  structure: PropTypes.object // refer docs/structure.md file for how to map a structure for a given model.
}

InlineActions.defaultProps = {
  confirmationMessage: 'ConfirmationMessage',
  confirmationTitle: 'Confirmation',
  eventCatalog: Defaults.eventCatalog,
  icons: Defaults.icons,
  //inlineActions: Defaults.inlineActions,
  inlineActionsAlignRight: true,
  inlineActionsBroker: (model, action) => {return true;},
  onClick: (event, eventKey) => {console.log('Default onClick handller for InlineActions called with payload -->' + eventKey);}
}

export default InlineActions;
