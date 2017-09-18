'use strict';


class LocalServiceBase {

  // @param props Object.
  constructor(props) {
    Object.assign(this, props);
    if(!props.records){
      this.records = [];
    }
  }

  // Search records
  findRecordById(anId) {
  }

  // [{field: value, ......}]
  findRecordBy(anArrayOfFieldValues) {
  }

  clearAllData() {
  }

  setFilter(filterInfo) {
  }
  clearFilter() {
  }
  setSort(sortInfo) {
  }
  clearSort() {
  }

  setPageInfo() {

  }
  getPage(pageInfo) {
  }

  getTotalNumberOfRecords() {
  }

  getTotalNumberOfFilteredRecords(){
  }
  setPaginationAtStart(){
  }

  // orderedList related for later uses cases of ordered list with drag/drop of rows
  moveRecords(records, oldIndex, newIndex) {
  }
  moveRecordUp(index) {
  }
  moveRecordDown(index) {
  }

  // Main Query method
  query(pageInfo, sortInfo, filterInfo) {
  }

  // for nested data sources.
  getChildren(parentId) {
  }
}

export default LocalServiceBase;
