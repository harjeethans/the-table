
import Button from './common/components/form/Button';
import Icon from './common/components/Icon';
import IconButton from './common/components/form/IconButton';


import Table from './table/Table';
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
  Button,
  Icon,
  IconButton,
  Table
//  LocalGrid,
//  RESTGrid,
//  RESTService
};
