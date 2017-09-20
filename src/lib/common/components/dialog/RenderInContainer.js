import React  from 'react';
import PropTypes from 'prop-types';

import ReactDOM from 'react-dom';

class RenderInContainer extends React.Component {

  constructor(props, context) {
    super(props, context);
    this._underlayNode = null;
  }

  componentDidMount() {
    this.popup = document.createElement("div");
    this.props.container.appendChild(this.popup);
    this._renderLayer();
  }

  componentDidUpdate() {
    if(this.props.open){
      this._underlayNode = document.createElement("div");
      this._underlayNode.className = 'mdl-dialog--underlay';
      this.props.container.appendChild(this._underlayNode);
    } else {
      if(this._underlayNode){
        document.body.removeChild(this._underlayNode);
      }
    }
    this._renderLayer();
  }

  componentWillUnmount() {
    ReactDOM.unmountComponentAtNode(this.popup);
    this.props.container.removeChild(this.popup);
    if(this._underlayNode){
      this.props.container.removeChild(this._underlayNode);
    }
  }

  _renderLayer() {
    ReactDOM.render(this.props.children, this.popup);
  }

  render() {
    // Render a placeholder
    //return React.DOM.div(this.props);
    return null;
  }

}


RenderInContainer.propTypes = {
  container: PropTypes.object,
  open: PropTypes.bool,
  underlay: PropTypes.bool
}

RenderInContainer.defaultProps = {
  container: document.body,
  open: false
}

export default RenderInContainer;
