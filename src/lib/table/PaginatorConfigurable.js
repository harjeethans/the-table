import React from 'react';

import PropTypes from 'prop-types';

import { Button} from 'react-bootstrap';

import Fa from './bootstrap/Fa';
import I18N from '../locale/I18N';
import Defaults from './Defaults';

class PaginatorConfigurable extends React.Component {

  constructor(props, context) {
    super(props);
    this.logger = context.logger;
    if(!props.pageSizes){
      this.props.pageSizes = Defaults.paginator.pageSizes;
    }
    this.state = {
      currentPage: this.props.currentPage || 1,
      pageSize: this.props.pageSize || 0
    };
  }

  gotoFirstPage(){
    const _state = {
      currentPage: 1,
      pageSize: this.state.pageSize
    };
    this.logger.log('Paginator.gotoFirstPage');
    this.onChange(_state, true);
  }

  gotoLastPage(){
    const _state = {
      currentPage: this.getTotalPages(),
      pageSize: this.state.pageSize
    };
    this.logger.log('Paginator.gotoLastPage');
    this.onChange(_state, true);
  }

  gotoNextPage(){
    let _state;
    const tp = this.getTotalPages();
    if((this.state.currentPage + 1) <= tp){
      _state = {
        currentPage: (this.state.currentPage + 1),
        pageSize: this.state.pageSize
      };
      this.logger.log('Paginator.gotoNextPage');
      this.onChange(_state, true);
    }
  }

  gotoPriviousPage(){
    let _state;
    if(this.state.currentPage > 1){
      _state = {
        currentPage: (this.state.currentPage - 1),
        pageSize: this.state.pageSize
      };
      this.logger.log('Paginator.gotoPriviousPage');

      this.onChange(_state, true);
    }
  }

  handleRowsPerPage(event){
    const _state = {
      pageSize: parseInt(event.target.value, 10),
      currentPage: 1
    };
    this.logger.log('Paginator.handleRowsPerPage');
    this.onChange(_state, true);
  }

  handleGotoPage(event) {
    const _state = {
      currentPage: parseInt(event.target.value, 10),
      pageSize: this.state.pageSize
    };
    this.onChange(_state, false);
  }

  gotoPage(){
    const _state = {
      currentPage: parseInt(this.refs.inputPage.value, 10),
      pageSize: this.state.pageSize
    };

    this.onChange(_state, true);
  }

  onChange(nextState, trigger){
    this.setState(nextState);
    if(this.props.onPaginatorChange && trigger){
      this.props.onPaginatorChange({
        'type': this.props.eventCatalog.paginate,
        'payload': nextState
      });
    }
    //this.logger.log('Paginator.onChange() called with -->' + JSON.stringify(state));
  }

  componentWillUpdate(nextProps, nextState) {
    if(nextState.triggerChange){
/*      this.onChange({
        currentPage: nextState.currentPage,
        pageSize: nextState.pageSize
      });
      */
    }
  }

  getTotalPages() {
    return Math.ceil(this.props.totalRecords/this.state.pageSize);
  }

  render() {
    this.logger.log('Calling Paginator.render()');
    return (
      <div className="pagination-configurable">
        <span className="page-size-label">{I18N.getI18N("RowsPerPage")}</span>
        <select value={this.state.pageSize} placeholder="Rows/Page" onChange={this.handleRowsPerPage.bind(this)} className="form-control input-sm page-size" bsSize="small">
          {this.props.pageSizes.map(function(size, i) {
            return (
              <option key={i} value={size} >{size}</option>
            );
          })}
        </select>
        <div className="pagination-btn-group">
          <Button
            ref="first"
            bsSize="small"
            onClick={this.gotoFirstPage.bind(this)}
            title={this.props.defaults.first.label}
            disabled={(this.state.currentPage === 1) ? true : false}
            data-action={this.props.defaults.first.action}>
            <Fa faIconClass={this.props.defaults.first.iconClass}></Fa>
          </Button>
          <Button
            ref="privious"
            bsSize="small"
            onClick={this.gotoPriviousPage.bind(this)}
            title={this.props.defaults.privious.label}
            disabled={(this.state.currentPage === 1) ? true : false}
            data-action={this.props.defaults.privious.action}>
            <Fa faIconClass={this.props.defaults.privious.iconClass}></Fa>
          </Button>
        </div>
        <div className="page-info">
          <input
            type="number"
            onChange={this.handleGotoPage.bind(this)}
            ref="inputPage"
            className="form-control input-sm goto-page"
            value={this.state.currentPage} />
          <span className="total-pages">/{this.getTotalPages()}</span>
        </div>
        <div className="pagination-btn-group">
          <Button
            ref="next"
            bsSize="small"
            onClick={this.gotoNextPage.bind(this)}
            title={this.props.defaults.next.label}
            disabled={(this.state.currentPage === this.getTotalPages()) ? true : false}
            data-action={this.props.defaults.next.action}>
            <Fa faIconClass={this.props.defaults.next.iconClass}></Fa>
          </Button>
          <Button
            ref="last"
            bsSize="small"
            onClick={this.gotoLastPage.bind(this)}
            title={this.props.defaults.last.label}
            disabled={(this.state.currentPage === this.getTotalPages()) ? true : false}
            data-action={this.props.defaults.last.action}>
            <Fa faIconClass={this.props.defaults.last.iconClass}></Fa>
          </Button>
        </div>
        <button
          data-action="goto_page"
          onClick={this.gotoPage.bind(this)}
          className="btn btn-sm btn-default go-btn">
          <span>Go</span>
        </button>
        <span className="total-records">
          {this.props.totalRecords}
        </span>
        <span className="total-records-label">
          {I18N.getI18N("TotalRecords")}
        </span>

      </div>
    );
  }
}

PaginatorConfigurable.state = {
  currentPage: 1,
  pageSize: 0
}

PaginatorConfigurable.propTypes = {
  currentPage: PropTypes.number,
  defaults:  PropTypes.object, // refrence to defaults lile buttons supported and their labels/icocs etc.
  eventCatalog: PropTypes.object, // catalog of all the events supported by the table, these venets have specific payload associated.
  logger: PropTypes.object.isRequired, // logger.
  onPaginatorChange: PropTypes.func,
  pageSize: PropTypes.number,
  pageSizes: PropTypes.array, // default pages sizes to support.
  totalRecords: PropTypes.number
}

PaginatorConfigurable.defaultProps = {
  currentPage: 1,
  defaults: Defaults.paginator,
  onPaginatorChange: (payload) => {this.logger.log('Default onPaginatorChange handller called with payload -->' + JSON.stringify(payload));},
  pageSize: 10,
  pageSizes: [],
  totalRecords: 0
}

PaginatorConfigurable.contextTypes = {
  logger: PropTypes.object.isRequired
}
export default PaginatorConfigurable;
