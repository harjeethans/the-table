'use strict';


class RESTServiceBase {

  constructor(props) {
    Object.assign(this, props);

    this.records = [];
  }

  // Main Query method
  query(pageInfo, sortInfo, filterInfo) {

  }

  parse(response, responseHeaders) {
    return response;
  }

  // Search records
  getRecordById(index) {
  }

  findRecordBy(field, value) {
  }

  findRecordIndexBy(field, value) {

  }

  setURL(url) {
  }

  getUpdateParam(value) {

  }

  getQueryParams(pageInfo, sortInfo, filterInfo) {
  }

  getDeleteParam(value) {

  }

  clearAllData() {

  }

  // Sorting, Filtering, Paging related

  clearFilter() {
  }

  setFilter(filterInfo) {

  }

  setSort(sortInfo) {

  }

  gotoPage(page) {

  }

  // inline editing related

  saveRecord(oldRecord, updatedRecord) {

  }
  deleteRecord(recordId) {

  }

  validateRecord(recordId, record) {

  }

  // orderedList related for later uses cases of ordered list with drag/drop of rows

  moveRecords(records, oldIndex, newIndex) {

  }

  moveRecordUp(index) {

  }

  moveRecordDown(index) {

  }

  //hierarchy related for lazy loaded children

  getChildren(parentId) {

  }

}


export default RESTServiceBase;
