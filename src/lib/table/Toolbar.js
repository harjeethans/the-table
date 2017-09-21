import React from 'react';
import ReactDOM from 'react-dom';

import PropTypes from 'prop-types';

import classNames from 'classnames';

//import { Button, MenuItem, Dropdown, ButtonToolbar} from 'react-bootstrap';

import Icon from '../common/components/Icon';
import Search from './Search';
import Settings from './Settings';
import GridModal from './GridModal';

class Toolbar extends React.Component {

  constructor(props, context) {
    super(props);
    this.logger = context.logger;

    this.onClick = this.onClick.bind(this);
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
    const primaryClasses = classNames('primary', 'pull-left');
    const tbData = (this.state && this.state.primaryToolbarItems) ? this.state.primaryToolbarItems : [];
    return this.renderToolbar(tbData, primaryClasses, false);
  }

  renderSecondaryToolbar() {
    const secondaryClasses = classNames('secondary', 'pull-right');
    const tbData = (this.state && this.state.secondaryToolbarItems) ? this.state.secondaryToolbarItems : [];
    const search = function(){
      if(this.props.showFreeFormSearchBar){
        return (
        <Search
          icons={this.props.icons}
          delay={this.props.delay}
          minLength={this.props.minLength}
          onSearchChange={this.props.onSearchChange}
          ref="search">
        </Search>);
      } else {
        return null;
      }
    }.bind(this);

    return this.renderToolbar(tbData, secondaryClasses, true, search());
  }

  renderToolbar(toolbarItems, toolbarClasses, pullRight, search) {
    const getLabel = function(item){
      if(item.iconClass) {
        return <Icon iconName={item.iconName}></Icon>
      } else {
        return item.label;
      }
    }
    const selected = this.props.selected;
    const disabled = function(item){
      if(item.enableOnSelection && selected.length===0){
        return true;
      } else if(item.enableOnSelection && item.selectionModel==='one' && selected.length>1){
        return true;
      } else if(item.enableOnSelection && selected.length>0){
        return false;
      }
    }

    const createDropdown = function(item, i){
      if(item.items){
        return (
          <button title={item.label} key={i} pullRight={pullRight} id={`dropdown-${i}`}>
            <button>
              {getLabel(item)}
            </button>
            <button>
              {item.items.map(function(innerItem, j) {
                return (
                  <button
                    data-action = {innerItem.action}
                    data-confirm = {innerItem.needsConfirmation}
                    data-confirm-message = {innerItem.confirmationMessage}
                    data-confirm-title = {innerItem.confirmationTitle}
                    data-promisable = {innerItem.promisable}
                    disabled = {disabled(innerItem)}
                    key = {j}
                    onClick = {this.onClick}>
                    {getLabel(innerItem)}
                  </button>
                );
              }, this)}
            </button>
          </button>
        );
      } else if(item.isOverlay){
        return this.generateOverlayContent(item, i);
      } else {
        return (
          <button
            disabled = {disabled(item)}
            data-action = {item.action}
            data-confirm = {item.needsConfirmation}
            data-confirm-message = {item.confirmationMessage}
            data-confirm-title = {item.confirmationTitle}
            data-promisable = {item.promisable}
            key = {i}
            onClick = {this.onClick}
            title = {item.label}>
            {getLabel(item)}
          </button>
        );
      }
    }

    //var toolbarItems = (this.state && this.state.primaryToolbarItems) ? this.state.primaryToolbarItems : [];
    return (
      <div className={toolbarClasses}>
        {search}
        <button className={toolbarClasses}>
          {toolbarItems.map(createDropdown, this)}
        </button>
      </div>

    );
  }



  /**
   * Digest the toolbar data, we have base we drop the excluded add the additional and mark the one that
   * needs to be disabled.
   */
  digestToolbarItems() {

    if(this.props.additionalToolbarItems && this.props.additionalToolbarItems>0){
      this.props.toolbarItems.push(...this.props.additionalToolbarItems);
    }

    const primary = this.props.toolbarItems.filter(function(action){
      return action['type'] === "primary";
    });
    const secondary = this.props.toolbarItems.filter(function(action){
      return action['type'] === "secondary";
    });

    if(this.props.primaryToolbarItems && this.props.primaryToolbarItems.length>0){
      primary.push(...this.props.primaryToolbarItems);
    }

    if(this.props.secondaryToolbarItems && this.props.secondaryToolbarItems.length>0){
      secondary.push(...this.props.secondaryToolbarItems);
    }

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
  additionalToolbarItems : PropTypes.array, // additional toolbar items if any in the following format.
  confirmationMessage: PropTypes.string, // confirmation messgae to display if not provided by toolbar item.
  confirmationTitle: PropTypes.string,
  delay: PropTypes.number, // time in ms to be used for all delaying, like use typeing in for a search etc.
  disabledToolbarItems: PropTypes.array, // toolbar items disabled , provide action-id s from Defaults.toolbarItems
  exculdedToolbarItems: PropTypes.array, // toolbar items exculded , provide action-id s from Defaults.toolbarItems
  eventCatalog: PropTypes.object, // catalog of all the events supported by the table, these venets have specific payload associated.
  icons: PropTypes.object,
  logger: PropTypes.object.isRequired, // logger.
  minLength: PropTypes.number, // minimum characters that user needs to type for things like search.
  onSearchChange: PropTypes.func, // callback for onChange
  onToolbarChange: PropTypes.func,
  primaryToolbarItems: PropTypes.array, // actions belonging to primary area of the toolbar, these would be merged with the type primary in the toolbarItems
  secondaryToolbarItems: PropTypes.array, // actions belonging to secondary area of the toolbar, these would be merged with the type secondary in the toolbarItems.
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
