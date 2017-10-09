import I18N from '../locale/I18N';
export default {

  messageCatalog: {
    'dataNotFound': {'type': 'info', 'text': I18N.getI18N('dataNotFound')},
    'successMessage': {'type': 'success', 'text': I18N.getI18N('successMessage')},
    'unknownError': {'type': 'error', 'text': I18N.getI18N('dataNotFound')}
  },

  icons: {
    'bullseye': 'bullseye',
    'caretUp': 'caret-up',
    'caretDown': 'caret-down',
    'circleWithNotch': 'circle-o-notch',
    'close': 'times',
    'cog': 'cog',
    'minus': 'minus-circle',
    'plus': 'plus-circle',
    'search': 'search'
  },
  // all the events that are emitted by the table.
  eventCatalog: {
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
  },

  // all these events are produced and consumed internally.
  privateEventCatalog: {
    'hideChildren': 'hideChildren',
    'onInlineActionInvocation': 'onInlineActionInvocation',
    'onSelectionChange': 'onSelectionChange',
    'onToggleRowExpansion': 'onToggleRowExpansion',
    'showChildren': 'showChildren'
  },

  pagination: {
    'type': 'page', // page OR scroll
    'at': 'server',  //at client or server.
    'currentPage': 1, // page user is viewing.
    'pageSize': 10,
    'pageSizes': [10, 25, 50, 75, 100, 150, 200, 250, 500, 1000] // required if we are using type paging.
  },

  paginator: {
    'first': {
      'action': 'goto-first',
      'iconName': 'first_page',
      'label': I18N.getI18N('First')
    },
    'last': {
      'action': 'last-page',
      'iconName': 'last_page',
      'label': I18N.getI18N('Last')
    },
    'privious': {
      'action': 'goto-privious',
      'iconName': 'keyboard_arrow_left',
      'label': I18N.getI18N('Privious')
    },
    'next': {
      'action': 'goto-next',
      'iconName': 'keyboard_arrow_right',
      'label': I18N.getI18N('Next')
    }
  },

  inlineActions: [{
    'action': 'options',
    'iconName': 'fa-cog',
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
  }],

  inlineActionsSaveCancel: [
    {
      'action': 'cancel',
      'iconName': 'fa-remove',
      'label': I18N.getI18N('Cancel')
    }, {
          'action': 'save',
          'iconName': 'fa-check',
          'label': I18N.getI18N('OK'),
          'promisable': true
        }
  ],

  toolbarItems: [{
      'action': 'refresh',
      'confirmationMessage': 'Hell will fall upon if you do this!',
      'confirmationTitle': 'Hellish',
      'iconName': 'refresh',
      'label': I18N.getI18N('Refresh'),
      'needsConfirmation': true,
      'type': 'primary'
    }, {
      'action': 'add',
      'iconName': 'add',
      'label': I18N.getI18N('Add'),
      'type': 'primary',
      'promisable': true
    }, {
      'action': 'duplicate',
      'iconName': 'control_point_duplicate',
      'label': I18N.getI18N('Duplicate'),
      'enableOnSelection': true,
      'selectionModel': 'one',
      'type': 'primary'
    },
    {
      'action': 'delete',
      'iconName': 'delete',
      'label': I18N.getI18N('Delete'),
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
      'iconName': 'mode_edit',
      'label': I18N.getI18N('Edit'),
      'enableOnSelection': true,
      'selectionModel': 'one',
      'type': 'primary'
    }, {
      'action': 'moveup',
      'iconName': 'keyboard_arrow_up',
      'label': I18N.getI18N('MoveUp'),
      'enableOnSelection': true,
      'selectionModel': 'one',
      'type': 'primary'
    }, {
      'action': 'movedown',
      'iconName': 'keyboard_arrow_down',
      'label': I18N.getI18N('MoveDown'),
      'enableOnSelection': true,
      'selectionModel': 'one',
      'type': 'primary'
    }, {
      'action': 'filter-simple',
      'iconName': 'filter_list',
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
      'iconName': 'settings',
      'label': I18N.getI18N('Settings'),
      'type': 'secondary',
      'isOverlay': true
    }
  ]
}
