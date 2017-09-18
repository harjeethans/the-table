import React from 'react';

import { Button, Modal} from 'react-bootstrap';

class ModelEditor extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      model: this.props.model,
      showModal: true
    };
  }

  close() {
    if(this.props.onCancelEditModel){
      this.props.onCancelEditModel();
    }
    this.setState({showModal: false});
  }

  open() {
    this.setState({showModal: true});
  }

  save() {
    //
    if(this.props.onSaveModel){
      this.props.onSaveModel(this.state.model);
    }
    this.setState({showModal: false});

  }

  onChange(event){

  }

  render() {
    return (
      <Modal show={this.state.showModal} onHide={this.close.bind(this)}>
        <Modal.Header closeButton>
          <Modal.Title>Modal Editor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <textarea className="form-control" rows="20" name="model" onChange={this.onChange.bind(this)} value={JSON.stringify(this.state.model, '', 2)}>
            </textarea>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.close.bind(this)}>Close</Button>
          <Button onClick={this.save.bind(this)} bsStyle="primary">Save</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}


ModelEditor.state = {
  model: null
}

ModelEditor.propTypes = {
  model: React.PropTypes.object,
  onCancelEditModel: React.PropTypes.func,
  onSaveModel: React.PropTypes.func,
  reject: React.PropTypes.func,
  resolve: React.PropTypes.func
}

export default ModelEditor;
