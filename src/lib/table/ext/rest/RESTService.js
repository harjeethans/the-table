'use strict';
import RESTServiceBase from './RESTServiceBase';

class RESTService extends RESTServiceBase {

  constructor(props) {
    super(props);

    this.pageInfo = {
      pageSize: props.pageSize || 10,
      startAt: props.startAt || 1
    }

    this.sortInfo = {
      sortField: '',
      sortOrder: 1 // 1 for ASC, -1 for DSC
    }

    this.filterInfo = {
      type: 'field', // search, field, advance,
      searchText: '',
      fieldsMatch: null, // single value or array against each field
      advanceCriteria: null //boolean of fieldsMatch
    }
  }

  setPageInfo(pageInfo) {
    this.pageInfo = Object.assign(this.pageInfo, pageInfo);
  }
  getCustomHeaders() {
    return {};
  }

  query() {
    //returns promise
    const queryParams = this.getQueryParams();
    const keys = Object.keys(queryParams);
    let fetchUrl = this.url;
    if (keys.length) {
      fetchUrl += '?' + keys.map(function(param) {
        let val = queryParams[param];
        if (typeof queryParams[param] === 'object') {
          val = JSON.stringify(queryParams[param]);
        }
        return param + '=' + val;
      }).join('&');
    }

    const _self = this;

    const promise = new Promise(function(resolve, reject) {
      const customHeaders = _self.getCustomHeaders();
      let responseHeaders = null;
      fetch(fetchUrl, {
        'method': 'get',
        'headers': new Headers(customHeaders)
      }).then(function(response) {
        responseHeaders = response.headers;
        return response.json();
      }).then(function(results) {
        results = _self.parse(results, responseHeaders);
        resolve(results, responseHeaders);
      }).catch(function(err) {
        reject(err);
      });
    });

    return promise;
  }

  getQueryParams(pageInfo, sortInfo, filterInfo) {

    pageInfo = pageInfo || this.pageInfo;
    sortInfo = sortInfo || this.sortInfo;
    filterInfo = filterInfo || this.filterInfo;

    const customQueryParams = this.getCustomQueryParams();

    return Object.assign({},
      this.formatPagingParams(pageInfo),
      this.formatSortingParams(sortInfo),
      this.formatFilteringParams(filterInfo),
      customQueryParams);
  }

  getCustomQueryParams() {
    return {};
  }
  formatPagingParams(pageInfo) {
    return pageInfo;
  }
  formatSortingParams(sortInfo) {
    const info = {};
    if (sortInfo.sortField) {
      info.sortField = sortInfo.sortField;
      info.sortOrder = sortInfo.sortOrder;
    }
    return info;
  }
  formatFilteringParams(filterInfo) {
    const info = {};
    if (filterInfo.type === "search" && filterInfo.searchText) {
      info.searchText = filterInfo.searchText;
    } else if (filterInfo.type === "field" && filterInfo.fieldsMatch && Object.keys(filterInfo.fieldsMatch).length>0) {
      info.fieldsMatch = filterInfo.fieldsMatch;
    } else if (filterInfo.type === "advance" && filterInfo.advanceCriteria) {
      info.advanceCriteria = filterInfo.advanceCriteria;
    }
    return info;
  }

  setFilterInfo(filterInfo) {
    this.filterInfo = filterInfo;
  }
  setSortInfo(sortInfo) {
    this.sortInfo = sortInfo;
  }

  gotoPage(page) {
    this.pageInfo.startAt = page;
    const result = this.query();
    return result;
  }

  // inline editing related

  saveRecord(record,idAttr) {
    const self = this;
    const promise = new Promise(function(resolve, reject) {
      const customHeaders = self.getCustomHeaders();
      let restMethod = '';
      let saveUrl = '';
      if(record[idAttr] === null) {
        //this is a new case
        restMethod = 'post';
        saveUrl = self.getAddUrl();
      }
      else {
        restMethod = 'put';
        saveUrl = self.getUpdateUrl(record[idAttr]);
      }
      fetch(saveUrl, {
        'method': restMethod,
        'headers': new Headers(customHeaders)
      }).then(function(response) {
        return response.json();
      }).then(function(results) {
        resolve(results);
      }).catch(function(err) {
        reject(err);
      });
    });
    return promise;
  }
  getAddUrl() {
    return this.url;
  }
  getUpdateUrl(id) {
    return this.url +'/'+id;
  }
  deleteRecord(recordId) {

  }

  validateRecord(recordId, record) {

  }

}



export default RESTService;
