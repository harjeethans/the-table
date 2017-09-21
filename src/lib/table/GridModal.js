import React from 'react';

import PropTypes from 'prop-types';

import ReactDOM from 'react-dom';
import classnames from 'classnames';

//import { Button, Modal} from 'react-bootstrap';
import I18N from '../locale/I18N';

const baseClasses = {
  'table-modal': true
};

class GridModal extends React.Component {

  constructor(props) {
    super(props);
    this.state = {show: props.show};
    this.close = this.close.bind(this);
    this.onExited = this.onExited.bind(this);
  }

  close(event) {
    this.setState({ show: false, action: event.target.dataset.action})
  }

  componentWillReceiveProps(nextProps) {
    const _state = {};
    if(nextProps.show){
      _state.show = nextProps.show;
      this.setState(_state);
    }
  }

  onExited(event) {
    if(this.props.onCloseModal){
      this.props.onCloseModal(this.state);
    }
  }

  render() {
    const {
      className,
      ...modalProps
    } = this.props;

    const classes = classnames(baseClasses, className);


    return (
      <div
        aria-labelledby="contained-modal-title"
        {...modalProps}
        onExited={this.onExited}
        show={this.state.show}
        onHide={this.close}>
        <div closeButton>
          <div id="contained-modal-title">{this.props.title}</div>
        </div>
        <div>
          {this.props.message}
        </div>
        <div>
          <button onClick={this.close} data-action="CANCEL" bsStyle="link">{I18N.getI18N('Cancel')}</button>
          <button onClick={this.close} data-action="OK" bsStyle="primary">{I18N.getI18N('OK')}</button>
        </div>
      </div>)
  }
}


GridModal.state = {
  show: false
}

GridModal.propTypes = {
  show: PropTypes.bool,
  onCloseModal: PropTypes.func,
  message: PropTypes.string,
  title: PropTypes.string
}

GridModal.defaultProps = {
  message: I18N.getI18N('ConfirmationMessage'),
  title: I18N.getI18N('Confirmation')
}
export default GridModal;
