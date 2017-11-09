import React from 'react';
import ReactDOM from 'react-dom';

import PropTypes from 'prop-types';

import classNames from 'classnames';

import Util from '../common/Util';

import Button from '../common/components/form/Button';
import Icon from '../common/components/Icon';
import IconButton from '../common/components/form/IconButton';

import Menu from '../common/components/menu/Menu';
import MenuItem from '../common/components/menu/MenuItem';


import Search from './Search';
import Settings from './Settings';
import GridModal from './GridModal';

class Toolbar extends React.Component {

  constructor(props, context) {
    super(props);
    this.logger = context.logger;

    Util.bindFunctions(['onClick'], this);
   
  }

  componentDidMount (){
    //default sorting
    this.digestToolbarItems();
  }


  onClick(event){
    if(this.props.onToolbarChange ){

      const type = this.props.eventCatalog.toolbar;
      const payload = {'action': event.currentTarget.dataset.action};
      if(event.currentTarget.dataset.promisable === 'true'){
        this._addPromiseToPayload(payload);
      }

      if(event.currentTarget.dataset.confirm === 'true'){
        const _self = this;
        let modal;
        const onCloseModal = function(modalState){
          if(modalState.action === "OK"){
            _self.props.onToolbarChange({
              type,
              payload
            });
          }
        }
        modal = ReactDOM.render(
          <GridModal
            message={event.currentTarget.dataset.confirmMessage}
            show={1===1}
            title={event.currentTarget.dataset.confirmTitle}
            onCloseModal={onCloseModal} />, this.refs.modalContainer);
      } else {
        this.props.onToolbarChange({
          type,
          payload
        });
      }

    }
  }

  _addPromiseToPayload(payload){
    payload.promise = new Promise(
      function(resolve, reject) {
        payload.resolve = resolve;
        payload.reject = reject;
        console.log('Toolbar promise added to ::' + payload.action);
      }
    );
  }

  render(){
    this.logger.log('Calling Toolbar.render()');

    const containerClasses = classNames('toolbar');
    const primaryToolbar = this.renderPrimaryToolbar();
    const secondaryToolbar = this.renderSecondaryToolbar();

    return (
      <div ref="container" className={containerClasses}>
        {primaryToolbar}
        {secondaryToolbar}
        <div ref="modalContainer"></div>
      </div>
    )
  }

  renderPrimaryToolbar() {
    const primaryClasses = classNames('primary');
    const tbData = (this.state && this.state.primaryToolbarItems) ? this.state.primaryToolbarItems : [];
    return this.renderToolbar(tbData, primaryClasses);
  }

  renderSecondaryToolbar() {
    const secondaryClasses = classNames('secondary');
    const tbData = (this.state && this.state.secondaryToolbarItems) ? this.state.secondaryToolbarItems : [];
    return this.renderToolbar(tbData, secondaryClasses);
  }

  renderToolbar(toolbarItems, toolbarClasses) {

    const getLabel = function(item){
      if(item.iconClass) {
        return <Icon iconName={item.iconName}></Icon>
      } else {
        return item.label;
      }
    }
    const selected = this.props.selected;

    const isDisabled = function(item){
      if(item.enableOnSelection && selected.length===0){
        return true;
      } else if(item.enableOnSelection && item.selectionModel==='one' && selected.length>1){
        return true;
      } else if(item.enableOnSelection && selected.length>0){
        return false;
      }
    }

    const createItem = function(item, i){

      const disabled = isDisabled(item);
      const props = {
        disabled,
       'data-action': item.action,
       'data-confirm': item.needsConfirmation,
       'data-confirm-message': item.confirmationMessage,
       'data-confirm-title': item.confirmationTitle,
       'data-promisable': item.promisable,
       'key': i,
       'onClick': this.onClick,
       'title': item.label || ''
       }

      if(item.items){
        const _props = {
          key: i,
          id: `menu-${i}`
        };
        let className;
        if(item.iconName){
          props['icon'] = item.iconName;
        } else {
          props['label'] = item.label;
          className='toolbar-menu';
        }
        return (
          <Menu {...props} className={className}>
            {item.items.map(function(innerItem, j) {
              return (
                <MenuItem
                  data-action = {innerItem.action}
                  data-confirm = {innerItem.needsConfirmation}
                  data-confirm-message = {innerItem.confirmationMessage}
                  data-confirm-title = {innerItem.confirmationTitle}
                  data-promisable = {innerItem.promisable}
                  disabled = {isDisabled(innerItem)}
                  key = {j}
                  onClick = {this.onClick}>
                  {getLabel(innerItem)}
                </MenuItem>
                );
              }, this)}
          </Menu>
        );
      } else if(item.isOverlay){
        return this.generateOverlayContent(item, i);
      } else {
          if(item.iconName) {
            return (
              <IconButton {...props} iconName={item.iconName}></IconButton>
            );
          } else {
            return (
              <Button className="toolbar-button" {...props}>{item.label}</Button>);
          }
      }
    }



    //var toolbarItems = (this.state && this.state.primaryToolbarItems) ? this.state.primaryToolbarItems : [];
    return (
      <div className={toolbarClasses}>
        {toolbarItems.map(createItem, this)}
      </div>

    );
  }



  /**
   * Digest the toolbar data, we have base we drop the excluded add the additional and mark the one that
   * needs to be disabled.
   */
  digestToolbarItems() {

    const primary = this.props.toolbarItems.filter(function(action){
      return action['type'] === "primary";
    });
    const secondary = this.props.toolbarItems.filter(function(action){
      return action['type'] === "secondary";
    });

    this.setState({
      primaryToolbarItems: primary,
      secondaryToolbarItems: secondary
    });

    // this.logger.log('Primary count::' + primary.length + 'Secondary count::'  + secondary.length);

  }

  generateOverlayContent(item, key){
    if(item.action === 'settings'){
      return (
        <Settings
          item = {item}
          key = {key}
          structure = {this.props.structure}
          >
        </Settings>
      );
    }

  }
}

Toolbar.propTypes = {
  confirmationMessage: PropTypes.string, // confirmation messgae to display if not provided by toolbar item.
  confirmationTitle: PropTypes.string,
  disabledToolbarItems: PropTypes.array, // toolbar items disabled , provide action-id s from Defaults.toolbarItems
  exculdedToolbarItems: PropTypes.array, // toolbar items exculded , provide action-id s from Defaults.toolbarItems
  eventCatalog: PropTypes.object, // catalog of all the events supported by the table, these venets have specific payload associated.
  icons: PropTypes.object,
  logger: PropTypes.object.isRequired, // logger.
  onToolbarChange: PropTypes.func,
  selected: PropTypes.array, // reference to selected on table as some toolbar items are selection aware.
  showFreeFormSearchBar: PropTypes.bool, // if we need to show the free form search bar on the right side of the toolbar section.
  structure: PropTypes.object, // refer docs/structure.md file for how to map a structure for a given model.
  showToolbar: PropTypes.bool, // to show toolbar bt default.
  toolbarItems: PropTypes.array // toolbar actions we need to show default comes from Defaults.toolbarItems , we can override though.
}

Toolbar.defaultProps = {
  confirmationMessage: 'ConfirmationMessage',
  confirmationTitle: 'Confirmation',
  onToolbarChange: (payload) => {this.logger.log('Default onToolbarChange handller called with payload -->' + JSON.stringify(payload));},
  selected: [],
  showToolbar: true
}

Toolbar.state = {
  primaryToolbarItems: [],
  secondaryToolbarItems: []
}

Toolbar.contextTypes = {
  logger: PropTypes.object.isRequired
}
export default Toolbar;
