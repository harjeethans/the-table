import React from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';

import Util from '../common/Util';
import Icon from '../common/components/Icon';
import I18N from '../locale/I18N';
import Defaults from './Defaults';

class Paginator extends React.Component {

  constructor(props, context) {
    super(props);
    this.logger = context.logger;

    this.state = {
      currentPage: this.props.currentPage || 1,
      pageSize: this.props.pageSize || 0
    };

    Util.bindFunctions(['gotoPage','gotoFirstPage','gotoLastPage','gotoNextPage','gotoPriviousPage','handleRowsPerPage'], this);
  }

  gotoFirstPage(event){
    const _state = {
      currentPage: 1,
      pageSize: this.state.pageSize
    };
    this.logger.log('Paginator.gotoFirstPage');
    this.onChange(_state, true);

    event.stopPropagation();
  }

  gotoLastPage(event){
    const _state = {
      currentPage: this.getTotalPages(),
      pageSize: this.state.pageSize
    };
    this.logger.log('Paginator.gotoLastPage');
    this.onChange(_state, true);

    event.stopPropagation();
  }

  gotoNextPage(event){
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

    event.stopPropagation();
  }

  gotoPriviousPage(event){
    let _state;
    if(this.state.currentPage > 1){
      _state = {
        currentPage: (this.state.currentPage - 1),
        pageSize: this.state.pageSize
      };
      this.logger.log('Paginator.gotoPriviousPage');

      this.onChange(_state, true);
    }

    event.stopPropagation();
  }

  gotoPage(event){
    const _state = {
      currentPage: parseInt(event.target.dataset["page"], 10) || 1,
      pageSize: this.state.pageSize
    };

    this.onChange(_state, true);

    event.stopPropagation();
  }

  handleRowsPerPage(event){
    const _state = {
      pageSize: parseInt(event.target.value, 10),
      currentPage: 1
    };
    this.logger.log('Paginator.handleRowsPerPage');
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
    this.logger.log('Calling Paginator.render():' + this.props.totalRecords);


    const {allowPageSize, defaults, pageLinksToShow, totalRecords=0} = this.props;
    const {pageSize} = this.state;
    const getEntriesText = function() {
      const start = (pageSize * (this.state.currentPage - 1)) + 1;
      let end = start + pageSize - 1;
      if(end > totalRecords){
        end = totalRecords;
      }
      return (
        <span className="info-label">
          {I18N.getI18N("Viewing")} {start} {I18N.getI18N("to")} {end} {I18N.getI18N("of")} {totalRecords} {I18N.getI18N("entries")}
        </span>
      );
    }.bind(this);



    const _self = this;
    const renderPageLinks = function(){
      const tp = _self.getTotalPages();
      if(tp < pageLinksToShow){
        return null;
      }
      let startAt = _self.state.currentPage;
      const linksToShow = [];
      let atLastSection = false;
      if((startAt + pageLinksToShow) > tp){
        startAt = (tp - pageLinksToShow) + 1;
        if(startAt < 1){
          startAt = 1;
        }
        atLastSection = true;
      }
      let _sa = startAt;
      for(let i = 0; i < pageLinksToShow; i++){
        linksToShow.push(_sa);
        _sa++;
      }

      return (
        linksToShow.map(function(link, j) {
          return (
            <li className={classNames('paginator__item', {'paginator__item--active': (link === _self.state.currentPage)})} key={j}>
              <a className="paginator__link"
                data-page={link}
                onClick={_self.gotoPage}>{link}</a>
            </li>
          );
        })
      );
    }

    const getPaginatorList = function() {
      const isFirstPage = this.state.currentPage === 1;
      const isLastPage = this.state.currentPage === this.getTotalPages();
      return totalRecords > pageSize? (
        <nav>
          <ul className="paginator__list">
            <li className="paginator__item paginator__entries">
              { getEntriesText() }
            </li>
            <li className = {classNames('paginator__item', 'paginator__item--first', {disabled: isFirstPage})}>
              <a
                aria-label = {defaults.first.label}
                className="paginator__link"
                data-action = {defaults.first.action}
                disabled = {isFirstPage}
                onClick = {this.gotoFirstPage}
                ref = "first" >
                <Icon iconName={defaults.first.iconName}></Icon>
              </a>
            </li>
            <li className = {classNames('paginator__item', {disabled: isFirstPage})}>
              <a
                aria-label = {defaults.privious.label}
                className="paginator__link"
                disabled = {isFirstPage}
                data-action = {defaults.privious.action}
                onClick = {this.gotoPriviousPage}
                ref = "privious" >
                <Icon iconName={defaults.privious.iconName}></Icon>
              </a>
            </li>

            { renderPageLinks() }

            <li className = {classNames('paginator__item', {disabled: isLastPage})}>
              <a
                aria-label = {defaults.next.label}
                className="paginator__link"
                data-action = {defaults.next.action}
                disabled = {isLastPage}
                onClick = {this.gotoNextPage}
                ref = "next" >
                <Icon iconName={defaults.next.iconName}></Icon>
              </a>
            </li>
            <li className = {classNames('paginator__item', 'paginator__item--last', {disabled: isLastPage})}>
              <a
                aria-label = {defaults.last.label}
                className="paginator__link"
                disabled = {isLastPage}
                data-action = {defaults.last.action}
                onClick={this.gotoLastPage}
                ref="last">
                <Icon iconName={defaults.last.iconName}></Icon>
              </a>
            </li>
          </ul>
        </nav>
      ) : (
        <nav>
          <ul className="paginator__list">
            <li className="paginator__item">
              { getEntriesText() }
            </li>
          </ul>
        </nav>
      );
    }.bind(this)

    const {pageSizes} = this.state;
    const getSelectPageSize = function() {
      let index;
      // find index of first pageSize larger than totalRecords
      for(index = 0; index < pageSizes.length; ++index) {
        if(pageSizes[index] > totalRecords)
          break;
      }

      return (
        <select value={this.state.pageSize} onChange={this.handleRowsPerPage} className="input-sm page-size">
          {pageSizes.slice(0, index + 1).map(function(size, i) {
            return (
              <option key={i} value={size} >{size}</option>
            );
          })}
        </select>
      );
    }.bind(this)

    return this.props.totalRecords ? (
      <div className="paginator">
        {
          allowPageSize && this.props.totalRecords > Math.min(this.props.pageSizes) &&
          <span>
            <span className="entires-per-page-label">{I18N.getI18N("EntriesPerPage")}</span>
              {getSelectPageSize()}
          </span>
        }

        {getPaginatorList()}

      </div>
    ) : null;
  }
}

Paginator.state = {
  currentPage: 1,
  pageSize: 0
}

Paginator.propTypes = {
  allowPageSize: PropTypes.bool, //allow user to change page size.
  defaults:  PropTypes.object, // refrence to defaults lile buttons supported and their labels/icocs etc.
  eventCatalog: PropTypes.object, // catalog of all the events supported by the table, these venets have specific payload associated.
  logger: PropTypes.object.isRequired, // logger.
  onPaginatorChange: PropTypes.func,
  pageLinksToShow: PropTypes.number,
  totalRecords: PropTypes.number
}

Paginator.defaultProps = {
  allowPageSize: false,
  defaults: Defaults.paginator,
  onPaginatorChange: (payload) => {this.logger.log('Default onPaginatorChange handller called with payload -->' + JSON.stringify(payload));},
  pageLinksToShow: 3,
  totalRecords: 0
}

Paginator.contextTypes = {
  logger: PropTypes.object.isRequired
}
export default Paginator;
