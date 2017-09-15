import React, { Component } from 'react';
import './Docs.css';
import '../sass/index.css';

import {Table} from '../lib/table/index'

class Docs extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>Welcome to the-table</h2>
        </div>
        <p className="App-intro">
        <Table></Table>
        </p>
      </div>
    );
  }
}

export default Docs;
