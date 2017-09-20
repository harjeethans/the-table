import React from 'react';
import PropTypes from 'prop-types';

import ReactDOM from 'react-dom';
import {Table} from 'the-table';


const peopleStructure = {
  id: '_id',
  columns: [
  {
    attr: "_id",
    label: "Identifier",
    width: 225,
    editable: false,
    type: "integer",
    filterable: false,
    position: 1
  }, {
    attr: "name",
    label: "Name",
    width: 200,
    alignment: "left",
    editable: true,
    sortable: false,
    type: "string",
    position: 2
  }, {
    attr: "address",
    label: "Address",
    width: 350,
    editable: true,
    type: "string",
    position: 3
  }, {
    attr: "phone",
    label: "Phone",
    width: 150,
    alignment: "center",
    sortable: "true",
    type: "string",
    position: 5
  }, {
    attr: "email",
    label: "Email",
    width: 250,
    type: "string",
    alignment: "left",
    position: 4
  },
  {
    attr: "gender",
    label: "Gender",
    width: 100,
    alignment: "left",
    xxxhidden: true,
    type: "set",
    set: [{
      "label": "Male",
      "value": "male"
    }, {
      "label": "Female",
      "value": "female"
    }, {
      "label": "NA",
      "value": "na"
    }],
    position: 6
  }]
}

const _code = {
  structure: peopleStructure,
  peopleServiceUrl: '/data/sample-s.json',
  flexible: true,
  height: 600,
  pagination: {
    'type': 'page',
    'at': 'server',
    'currentPage': 1,
    'pageSize': 10,
    'pageSizes': [10, 25, 50, 75, 100, 150, 200, 250, 500, 1000]
  },
  truncateOverflow: true
}


class BasicTable extends React.Component{


  getPeopleData(queryParams){

    const query = {};
    query.startAt = queryParams.currentPage;
    /*
    if(queryParams.currentPage > 1){
      startAt = ((queryParams.currentPage-1) * queryParams.pageSize) -1;
    }
    query.startAt = startAt;
    */
    query.pageSize = queryParams.pageSize;
    const keys = Object.keys(query);
    let fetchUrl = this.props.peopleServiceUrl;
    if(keys.length) {
      fetchUrl += '?' + keys.map(function (param) {
        return param + '=' + query[param]
      }).join('&');
    }

    const _self = this;
    fetch(fetchUrl, {'method': 'get'}).then(function(response) {
      return response.json();
    }).then(function(response) {
      _self.refs.grid.setState({
        data: response.items || [],
        totalRecords: response.totalCount,
        gridState: 'ready'
      });
    }).catch(function(err) {
    console.log('Error:: ' + err);
    });
  }

  componentDidMount() {
    this.getPeopleData({
      pageSize: this.props.pagination.pageSize,
      currentPage: this.props.pagination.currentPage
    });

    window.basictable = this.refs.grid;
    window.basictableDOM = ReactDOM.findDOMNode(this);
  }

  handleGridEvents(message){
    if(message.type && message.type === 'paginate'){
      this.getPeopleData(message.payload);
    } else if(message.type && message.type === 'toolbar' && message.payload.action === 'refresh'){
      this.getPeopleData({
        pageSize: this.props.pagination.pageSize,
        currentPage: this.props.pagination.currentPage
      });
    } else if(message.type && message.type === 'toolbar' && message.payload.action === 'trash-selected'){
      if(message.payload.promise){
        // mimic trash by adding a setTimout.
        setTimeout(function(){
          message.payload.resolve({'success': true, trashed: message.payload.selected.slice(0)});
        }, 1500);//() => (message.payload.promise.resolve({'response': true}), 2000);
      }
    } else if(message.type && message.type === 'toolbar' && message.payload.action === 'trash-all'){
      if(message.payload.promise){
        // mimic trash by adding a setTimout.
        setTimeout(function(){
          message.payload.resolve({'success': true, trashed: message.payload.selected.slice(0)});
        }, 1500);//() => (message.payload.promise.resolve({'response': true}), 2000);
      }
    } else if(message.type && message.type === 'toolbar' && message.payload.action === 'add'){
      if(message.payload.promise){
        // mimic add by adding a setTimout.
        Object.keys(message.payload.model).forEach(function (key) {
          message.payload.model[key] = '000' + message.payload.model[key];
          // do something with obj like create actual id and save and then resolve or reject.
        });
        setTimeout(function(){
          message.payload.resolve({'success': true, model: message.payload.model});
        }, 1500);//() => (message.payload.promise.resolve({'response': true}), 2000);
      }
    }

    console.log('Received event from Grid with payload ->' + JSON.stringify(message.payload));
  }

  removeTable(){
    //ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(this).parentNode);
    delete window.basictable;
    ReactDOM.unmountComponentAtNode(document.getElementById("root"));
  }

  render(){
    return (
      <div className="container-fluid" id="main">
        <div className="row">
          <div className="col-md-8"><div className="info-container"><pre><p className="grid-info">A simple table with a structure. Following properties are in use. <br/><code>{JSON.stringify(_code)}</code></p></pre></div></div>
          <div className="col-md-4"><pre><div><button type="button" className="btn btn-default btn-xs" onClick={this.removeTable.bind(this)}>Remove Grid (refresh to get it again)</button></div></pre></div>
        </div>
        <Table
          allowPageSize = {true}
          bordered={true}
          disabled={this.props.disabled}
          emitRowClick = {false}
          ref="grid"
          structure={this.props.structure}
          onGridEvent={this.handleGridEvents.bind(this)}
          flexible={this.props.flexible}
          height={this.props.height}
          logLevel = {3}
          minWidth = {1200}
          pagination={this.props.pagination}
          truncateOverflow={this.props.truncateOverflow}
          selectionModel="some"
          simpleFilterAlwaysVisible = {true}
          sort={this.props.sort}
          showToolbar={this.props.showToolbar}
          striped={false}
          usePagination={this.props.usePagination}
          showFreeFormSearchBar= {false}
          dataState={this.props.dataState}>
        </Table>
      </div>

    );
  }
}

BasicTable.propTypes = {
  peopleServiceUrl: PropTypes.string,
  disabled: PropTypes.array,
  structure: PropTypes.object,
  dataState: PropTypes.object,
  flexible: PropTypes.bool,
  height: PropTypes.string,
  pagination: PropTypes.object,
  truncateOverflow: PropTypes.bool,
  usePagination: PropTypes.bool,
  showToolbar: PropTypes.bool,
  selected: PropTypes.array,
  sort: PropTypes.oneOfType([PropTypes.array, PropTypes.object])
};

BasicTable.defaultProps = {
  structure: peopleStructure,
  peopleServiceUrl: '/js/data/sample-s.json', // /js/data/sample-s.json without proxy.  /restapi/people
  flexible: false,
  disabled: ['564bab57e14a8bde47f06044', '564bab573e82341b9d8648aa'],
  height: '600',
  pagination: {
    'type': 'page',
    'at': 'server',
    'currentPage': 1,
    'pageSize': 10,
    'pageSizes': [10, 25, 50, 75, 100, 150, 200, 250, 500, 1000]
  },
  truncateOverflow: true,
  sort: {attribute: "email",order: 1},
  showToolbar: true,
  usePagination: true

};
export default BasicTable;
