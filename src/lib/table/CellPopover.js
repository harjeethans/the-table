import React from 'react';

import PropTypes from 'prop-types';


import ReactDOM from 'react-dom';
import classNames from 'classnames';

import Defaults from './Defaults';
//import {Overlay, Popover} from 'react-bootstrap';
import Icon from '../common/components/Icon';

class CellPopover extends React.Component {

  constructor(props) {
    super(props);
    this.options = Object.assign({
      iconClass: 'fa-bullseye',
      cssClass: 'fe-grid-popover',
      containerPadding: 5,
      height: 400,
      placement: 'bottom',
      width: 600
    }, props.baseOptions);

    this.options = Object.assign(this.options, (props.column.rendererOptions || {}));
    // @TODO fix it context hs to be this on callback provided.
    if(this.options.onShow){
      this.options.onShow.bind(this);
    }

    this.state = {
      content: 'Sample popover content',
      show: false,
      target: null,
      title: this.options.title || 'Popover Title'
    }

  }

  componentDidMount() {
    ReactDOM.findDOMNode(this).className += ' ' + this.options.cssClass;
  }

  setContent(content){
    this.setState({content});
  }

  setTitle(title){
    this.setState({title});
  }

  onShow(popover){
    // we have been supplied a dom ndoe we should append it now.
    if(this._tempPopoverContent){
      const containerNode = popover.getElementsByClassName('fe-grid-popover-content');
      if(containerNode && containerNode.length>0){
        containerNode[0].appendChild(this._tempPopoverContent);
      }
    }
    this._emitAdjustScroll(true);
  }

  onHide(){
    if(this.options.onHide){
      this.options.onHide(this.props.column, this.props.model, this.props.structure);
    }
    if(this.refs.popoverTarget.target){
      ReactDOM.findDOMNode(this.refs.popoverTarget).style.visibility = '';
    }
    if(this._tempPopoverContent){
      this._tempPopoverContent = null;
    }

    this._emitAdjustScroll(false);
  }

  _emitAdjustScroll(open) {
    if(this.options.scrollPopoverInView){
      this.props.eventEmitter.emit(this.props.eventCatalog.adjustScroll, {
        'type': this.props.eventCatalog.adjustScroll,
        'payload' : {open, height: this.options.height, rowIndex: this.props.rowIndex}
      });
    }
  }

  onClick(){
    let content = "Sample content";
    let visibility = '';
    if(!this.state.show){
      visibility = 'visible';
      content = (this.options.onShow) ? this.options.onShow(this.props.column, this.props.model, this.props.structure) : '';
    }

    if(content.tagName || content.nodeName){
      this._tempPopoverContent = content;
      this.setState({show: !this.state.show, content: ''});
    } else {
      ReactDOM.findDOMNode(this.refs.popoverTarget).style.visibility = visibility;
      this.setState({show: !this.state.show, content});
    }
  }

  render() {
    const popoverClasses = classNames('cell-popover', this.options.cssClass);
    const faClasses = classNames('fa', 'fa-fw', this.options.iconClass);
    //const container = {ReactDOM.findDOMNode(this).parentNode}
    const container = document.getElementsByClassName('table-container')[0];
    const popoverStyle = {
      width: this.options.width,
      maxHeight: this.options.height
    };

    return (
      <div
        className="column-popover">
        {this.props.generateCellContent(this.props.column, this.props.model, this.props.structure, this.props.eventEmitter, this.props.rowIndex, this.props.nestedKeySplitter)}
        <Icon
          faIconClass={faClasses}
          onClick={this.onClick.bind(this)}
          ref="popoverTarget">
        </Icon>
        <div
          className = {popoverClasses}
          container = {container}
          containerPadding = {this.options.containerPadding}
          onEntered = {this.onShow.bind(this)}
          ref = "overlay"
          rootClose = {1===1}
          onHide = {this.onHide.bind(this)}
          placement = {this.options.placement}
          show = {this.state.show}
          target = {()=> ReactDOM.findDOMNode(this.refs.popoverTarget)}>
          <div
            id = {this.props.model[this.props.structure.id]}
            title = {this.state.title}>
            <div
              className = {this.options.cssClass + '-content'}
              dangerouslySetInnerHTML={{'__html': this.state.content}}
              ref = "content"
              style = {popoverStyle}>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

CellPopover.state = {
  content: 'Sample popover content',
  show: false,
  target: null,
  title: 'Popover Title'
};

CellPopover.propTypes = {
  baseOptions: PropTypes.object,
  column: PropTypes.object, // column metadata
  eventCatalog: PropTypes.object, // catalog of all the events supported by the grid, these venets have specific payload associated.
  eventEmitter: PropTypes.object, // event emitter for pub/sub
  generateCellContent: PropTypes.func,
  options: PropTypes.object, // options object
  model: PropTypes.object, // refer docs/structure.md file for how to map a structure for a given model.
  nestedKeySplitter: PropTypes.string, //  incase we are looking for a nested attr in a model what splitter to use.
  rowIndex: PropTypes.number, // index of row in teh table.
  structure: PropTypes.object // structure reference.
};

CellPopover.defaultProps = {
  eventCatalog: Defaults.eventCatalog
};

export default CellPopover;
