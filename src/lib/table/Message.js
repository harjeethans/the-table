import React from 'react';

import PropTypes from 'prop-types';

import ReactDOM from 'react-dom';
import classNames from 'classnames';

class Message extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      message: props.message,
      autoClear: props.autoClear
    };
  }

  componentWillUnmount() {
    if(this._timer){
      clearTimeout(this._timer);
    }
  }
  clearMessage(){
    // running into react issues clear with setState is not workong for some reason.
    //this.setState({'message': {'type': 'info', 'text': ''}});
    ReactDOM.findDOMNode(this).innerHTML = '';
    this.state = {'message': {'type': 'info', 'text': ''}};
  }

  setMessage(msg, autoClear) {
    let message;
    if(typeof msg === 'string'){
      message = {'type': 'primary', 'text': msg};
    } else {
      message = msg;
    }
    this.setState({
      message,
      autoClear
    });
  }

  render(){
    if(this.state.autoClear){
      if(this._timer){
        clearTimeout(this._timer);
      }
      this._timer = setTimeout(this.clearMessage.bind(this), this.props.delay);
    }
    const messageClasses = classNames('footer-message', {'text-info': (this.state.message.type==='info'), 'text-success': (this.state.message.type==='success'), 'text-warning': (this.state.message.type==='warning'), 'text-danger': (this.state.message.type==='danger'), 'text-primary': (this.state.message.type==='primary')});
    return (
      <div className={messageClasses}>
        {this.state.message.text}
      </div>
    );

  }
}

Message.state = {
}

Message.propTypes = {
  autoClear: PropTypes.bool, // do we need auto clearing of messages displayed.
  delay: PropTypes.number, // delay
  message: PropTypes.object
}

Message.defaultProps = {
  autoClear: true,
  delay: 5000,
  message: {'type': 'primary', 'text': ''}
}

export default Message;
