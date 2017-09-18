import React from 'react';

import PropTypes from 'prop-types';

class SettingsColumn extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
    }

  }

  handleDragStart(e) {
    this.setState({
      style: {backgroundColor: '#ccc'}
    });
    e.dataTransfer.setData("text/plain", this.props.column.attr + ',' + this.props.column.position);
  }

  handleDragOver(e) {
    if (e.preventDefault) {
      e.preventDefault(); // Necessary. Allows us to drop.
    }
    this.setState({
      style: {borderColor: '#d4d4d4'}
    });
    e.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.

    return false;
  }

  handleDragEnter(e) {
    // this / e.target is the current hover target.
    //this.classList.add('over');

  }

  handleDragLeave(e) {
    this.setState({
      style: {borderColor: 'transparent'}
    });
  }

  handleDrop(e) {
    // this / e.target is current target element.

    if (e.stopPropagation) {
      e.stopPropagation(); // stops the browser from redirecting.
    }

    console.log("Drop completed with :: " + e.dataTransfer.getData("text"));
    console.log("On node :: " + this.props.column.attr + ',' + this.props.column.position);

    // See the section on the DataTransfer object.

    return false;
  }

  handleDragEnd(e) {
    // this/e.target is the source node.
    //[].forEach.call(cols, function (col) {
    //  col.classList.remove('over');
    //});
    this.setState({
      style: {backgroundColor: '#fff'}
    });
  }

  render(){

    return (<li
      draggable = "true"
      onDragStart = {this.handleDragStart.bind(this)}
      onDragEnter = {this.handleDragEnter.bind(this)}
      onDragOver = {this.handleDragOver.bind(this)}
      onDragLeave = {this.handleDragLeave.bind(this)}
      onDrop = {this.handleDrop.bind(this)}
      onDragEnd = {this.handleDragEnd.bind(this)}
      style = {this.state.style}>
        <div className="row">
          <div className="col-md-4">{this.props.column.label}</div>
          <div className="col-md-4">{this.props.column.width}</div>
          <div className="col-md-4">{!this.props.column.hidden + ''}</div>
        </div>
      </li>);
  }
}

SettingsColumn.propTypes = {
  column: PropTypes.object // settings toolbar item reference.
}

SettingsColumn.defaultProps = {
}

export default SettingsColumn;
