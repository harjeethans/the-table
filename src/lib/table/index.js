import Table from './Table';
//import RESTGrid from './ext/rest/RESTGrid';
//import RESTService from './ext/rest/RESTService';
//import LocalGrid from './ext/local/LocalGrid';

if(typeof window !== 'undefined'){
  window.Table = Table;
//  window.LocalGrid = LocalGrid;
//  window.RESTGrid = RESTGrid;
//  window.RESTService = RESTService;
}

export {
  Table
//  LocalGrid,
//  RESTGrid,
//  RESTService
};
