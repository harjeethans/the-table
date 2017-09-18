'use strict';

import LocalServiceBase from './LocalServiceBase';

class LocalService extends LocalServiceBase {

  constructor(props) {
    super(props);

    this._tempData = [];
    if(this.data){
      this._tempData = this.data.slice();
    }

    this.pageInfo = props.pageInfo || {pageSize: props.pageSize || 10, startAt: props.startAt || 1};

    this.sortInfo = props.sortInfo || {sortField: null, sortOrder: 1}; // 1 for ASC, -1 for DSC
    this.useCaseSensitiveFilter = props.useCaseSensitiveFilter;
    this.headerFilterPredicate = props.headerFilterPredicate;

    this.filterInfo = props.filterInfo || {
      type: 'field', // search, field, advance,
      searchText: null,
      fieldsMatch: null, // single value or array against each field
      advanceCriteria: null //boolean of fieldsMatch
    };
  }

  _resetTempData() {
    if(this.data){
      this._tempData = this.data.slice();
    }
  }

  setData(data) {
    this.data = data || [];
    this._tempData = this.data.slice();
  }

  setFilter(filterInfo) {
    this.filterInfo = filterInfo;
  }

  clearFilter() {
    this.filterInfo = null;
  }

  setSort(sortInfo) {
    this.sortInfo = sortInfo;
  }

  clearSort() {
    this.sortInfo = null;
  }

  setPageInfo(pageInfo) {
    this.pageInfo = pageInfo;
  }

  setPaginationAtStart() {
    if(this.pageInfo){
      this.pageInfo.startAt = 1;
    }
  }

  getTotalNumberOfRecords() {
    return this._tempData.length;
  }

  getTotalNumberOfFilteredRecords(){
    return this._tempData.length;
  }

  getPage(pageInfo) {
    if(!this.usePagination){
      return this._tempData;
    }
    if(pageInfo){
      this.pageInfo = Object.assign(this.pageInfo, pageInfo);
    }
    if(!this.pageInfo){
      return [];
    }
    let result;
    const pageSize = Math.min(parseInt(this.pageInfo.pageSize), this._tempData.length);
    const startAt = parseInt(this.pageInfo.currentPage);
    if(startAt > -1 && pageSize < this._tempData.length + 1){
      try {
        var start = (startAt - 1) * pageSize;
        var end = start + pageSize;
        result = this._tempData.slice(start, end);
      } catch (error) {
        console.log("SEVERE error cannot get data requested!");
        result = [];
      }
    }

    return result;

  }

  // Main Query method
  query(pageInfo, sortInfo, filterInfo) {
    if(pageInfo){
      this.pageInfo = pageInfo;
    }
    if(sortInfo){
      this.sortInfo = sortInfo;
    }

    this.filterInfo = filterInfo;

    return this._query();

  }

  _query() {
    this._resetTempData();
    let curedData = this._tempData;

    if(this.filterInfo){
      if(this.filterInfo.type === 'search'){
        curedData = this._filterData(curedData, this.filterInfo.value);
      }
      if(this.filterInfo.type === 'simple'){
        curedData = this._filterData(curedData, this.filterInfo.conditions);
      }
    }


    if(this.sortInfo && this.sortInfo.attribute){
      const attr = this.sortInfo.attribute;
      const compare = function(a, b){
        if (a[attr] < b[attr]) {
          return -1;
        }
        if (a[attr] > b[attr]) {
          return 1;
        }

        return 0;
      }
      curedData = curedData.sort(compare);

      if (this.sortInfo.sortOrder === -1) {
        curedData.reverse();
      }

    }

    //reset the _tempData to curedData
    this._tempData = curedData;

    return this.getPage();
  }

  // simple filter for search and simple filters, no compound conditions.
  // if a text srting is passed as conditions that it is looked in all the attributes for a match.
  _filterData(data, conditions) {
    let filterOnAnyAttribute = false;
    if(typeof conditions === 'string'){
      filterOnAnyAttribute = true;
    }
    // function return bool whether subtring is found or not
    const searchForSubstring = function(searchIn, searchFor){
      // for case-insensitive match, convert both string to lower case and then search
      return this.useCaseSensitiveFilter?
        searchIn.indexOf(searchFor) > -1 :
          searchIn.toLocaleLowerCase().indexOf(searchFor.toLocaleLowerCase()) > -1;
    }.bind(this);

    const filterOnAny = function(item, index, array){
      let res = false;
      for (let p in item) {
        if (typeof p === 'string') {
          // convert both string to lowercase to perform case-insensitive matching
          if(searchForSubstring(item[p].toString(), conditions)) {
            res = true;
            break;
          }
        }
      }

      return res;

    }

    const filterOnSomePredicateAny = function(item, index, array){
      let res = false;
      const keys = Object.keys(conditions);
      let aVal, aKey;
      for (let i = 0; i < keys.length; i++) {
        aKey = keys[i];
        aVal = conditions[aKey];
        if (aVal && item[aKey] && searchForSubstring(item[aKey].toString(), aVal.toString())) {
          res = true;
            break;
        } else {
          res = false;
        }
      }

      return res;
    }.bind(this);


    const filterOnSomePredicateAll = function(item, index, array){
      let res = false;
      const keys = Object.keys(conditions);
      let aVal, aKey;
      for (let i = 0; i < keys.length; i++) {
        aKey = keys[i];
        aVal = conditions[aKey];
        if (aVal && item[aKey] && searchForSubstring(item[aKey].toString(), aVal.toString())) {
          res = true;
        } else {
          res = false;
          break;
        }
      }

      return res;
    }.bind(this);


    let filteredData = [];

    if(filterOnAnyAttribute){
      filteredData = data.filter(filterOnAny);
    } else {
      if(this.headerFilterPredicate === 'AND'){
        filteredData = data.filter(filterOnSomePredicateAll);
      } else {
        filteredData = data.filter(filterOnSomePredicateAny);
      }
    }

    return filteredData;

  }


}



export default LocalService;
