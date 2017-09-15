import I18N from '../locale/I18N';


const messageCatalog = {
  'dataNotFound': {'type': 'info', 'text': I18N.getI18N('dataNotFound')},
  'successMessage': {'type': 'success', 'text': I18N.getI18N('successMessage')},
  'unknownError': {'type': 'error', 'text': I18N.getI18N('dataNotFound')}
};

const icons = {
  'bullseye': 'fa-bullseye',
  'caretUp': 'fa-caret-up',
  'caretDown': 'fa-caret-down',
  'circleWithNotch': 'fa-circle-o-notch',
  'close': 'fa-times',
  'cog': 'fa-cog',
  'minus': 'fa-minus-circle',
  'plus': 'fa-plus-circle',
  'search': 'fa-search'
};

// all the events that are emitted by the grid.
const eventCatalog = {
  'adjustScroll': 'adjustScroll',
  'collapseRow': 'collapseRow',
  'compoundFilter': 'compoundFilter',
  'clickRow': 'clickRow',
  'expandRow': 'expandRow',
  'fetchChildren': 'fetchChildren',
  'inlineAction': 'inlineAction',
  'paginate': 'paginate',
  'search': 'search',
  'select': 'select',
  'selectAll': 'selectAll',
  'simpleFilter': 'simpleFilter',
  'sort': 'sort',
  'toolbar': 'toolbar'
};

// all these events are produced and consumed internally.
const privateEventCatalog = {
  'hideChildren': 'hideChildren',
  'onInlineActionInvocation': 'onInlineActionInvocation',
  'onSelectionChange': 'onSelectionChange',
  'onToggleRowExpansion': 'onToggleRowExpansion',
  'showChildren': 'showChildren'
};

const pagination = {
  // page OR scrol
  'type': 'page',
  'currentPage': 1,
  'pageSize': 10,
  'pageSizes': [10, 25, 50, 75, 100, 150, 200, 250, 500, 1000]
};

const paginator = {
  'first': {
    'action': 'goto-first',
    'iconClass': 'fa-step-backward',
    'label': I18N.getI18N('First')
  },
  'last': {
    'action': 'goto-last',
    'iconClass': 'fa-step-forward',
    'label': I18N.getI18N('Last')
  },
  'privious': {
    'action': 'goto-privious',
    'iconClass': 'fa-chevron-left',
    'label': I18N.getI18N('Privious')
  },
  'next': {
    'action': 'goto-next',
    'iconClass': 'fa-chevron-right',
    'label': I18N.getI18N('Next')
  }
};

const inlineActions = [{
  'action': 'options',
  'iconClass': 'fa-cog',
  'label': I18N.getI18N('Options'),
  'items': [{
    'action': 'edit',
    'label': I18N.getI18N('Edit'),
    'promisable': true
  }, {
    'action': 'trash',
    'confirmationMessage': 'Hell will fall upon if you do this!',
    'confirmationTitle': 'Hellish',
    'label': I18N.getI18N('Trash'),
    'needsConfirmation': true,
    'promisable': true
  }]
}];

const inlineActionsSaveCancel = [
  {
    'action': 'cancel',
    'iconClass': 'fa-remove',
    'label': I18N.getI18N('Cancel')
  },{
    'action': 'save',
    'iconClass': 'fa-check',
    'label': I18N.getI18N('OK'),
    'promisable': true
  }
]

const toolbarItems = [{
    'action': 'refresh',
    'confirmationMessage': 'Hell will fall upon if you do this!',
    'confirmationTitle': 'Hellish',
    'iconClass': 'fa-refresh',
    'label': I18N.getI18N('Refresh'),
    'needsConfirmation': true,
    'type': 'primary'
  }, {
    'action': 'add',
    'iconClass': 'fa-plus',
    'label': I18N.getI18N('Add'),
    'type': 'primary',
    'promisable': true
  }, {
    'action': 'duplicate',
    'iconClass': 'fa-clone',
    'label': I18N.getI18N('Duplicate'),
    'enableOnSelection': true,
    'selectionModel': 'one',
    'type': 'primary'
  },
  {
    'action': 'trash',
    'iconClass': 'fa-trash',
    'label': I18N.getI18N('Trash'),
    'type': 'primary',
    'items': [{
      'action': 'trash-all',
      'label': I18N.getI18N('All'),
      'needsConfirmation': true,
      'promisable': true
    }, {
      'action': 'trash-selected',
      'label': I18N.getI18N('Selected'),
      'needsConfirmation': true,
      'confirmationMessage': 'Hell will fall upon if you do this!',
      'confirmationTitle': 'Hellish',
      'enableOnSelection': true,
      'promisable': true
    }]
  }, {
    'action': 'edit',
    'iconClass': 'fa-edit',
    'label': I18N.getI18N('Edit'),
    'enableOnSelection': true,
    'selectionModel': 'one',
    'type': 'primary'
  }, {
    'action': 'moveup',
    'iconClass': 'fa-arrow-up',
    'label': I18N.getI18N('MoveUp'),
    'enableOnSelection': true,
    'selectionModel': 'one',
    'type': 'primary'
  }, {
    'action': 'movedown',
    'iconClass': 'fa-arrow-down',
    'label': I18N.getI18N('MoveDown'),
    'enableOnSelection': true,
    'selectionModel': 'one',
    'type': 'primary'
  }, {
    'action': 'filter-simple',
    'iconClass': 'fa-filter',
    'label': I18N.getI18N('Filter'),
    'type': 'secondary',
    'xxxitems': [{
        'action': 'filter-quick',
        'label': I18N.getI18N('QuickFilter')
      }, {
        'action': 'filter-custom',
        'label': I18N.getI18N('QueryFilter')
      }
    ]
  }, {
    'action': 'export',
    'label': I18N.getI18N('Export'),
    'type': 'secondary',
    'items': [{
      'action': 'download-csv',
      'label': I18N.getI18N('DownloadCSV')
    }, {
      'action': 'download-xml',
      'label': I18N.getI18N('DownloadXML')
    }, {
      'action': 'download-json',
      'label': I18N.getI18N('DownloadJSON')
    }]
  }, {
    'action': 'settingsxxx',
    'iconClass': 'fa-cog',
    'label': I18N.getI18N('Settings'),
    'type': 'secondary',
    'isOverlay': true
  }
]

const constants = {
  SORT_DESC: "-1",
  SORT_ASC: "1",
  NEXT_PAGE: ">",
  LAST_PAGE: ">>",
  PRE_PAGE: "<",
  FIRST_PAGE: "<<"
}

export default {
  constants,
  eventCatalog,
  icons,
  inlineActions,
  inlineActionsSaveCancel,
  messageCatalog,
  privateEventCatalog,
  pagination,
  paginator,
  toolbarItems
}
