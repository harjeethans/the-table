

## Grid Properties (this.props)


* props
  * defaultControl
    * paging
      * pageSize
      * currentPage
    * sorting
      * attribute
      * sortOrder
    * search
  * structure
    * idAttribute
    * conditionalSidePanel
      * onRowSelection (true/false)
      * addNew (true/false)
    * rowsPinned (could be a list of row ids passed in OR a function callback returning true/false)
    * pagingType (virtual/paginator)
    * rowExpansion
      * enabled
      * isRowDisabled (optional for conditional expansions)
    * layout
      * type (fixed/flexible)
      * width
      * height
    * columns
      * [
        * attr - could be list for multi-valued column
        * label
        * defaultWidth
        * editable
        * customEditor
        * renderer
        * type
        * filterable
        * position
        * pinned
      * ]
    * inlineActions
      * action
      * iconClass
      * label
      * items (optional for nested)
    * toolbarItems
      * action
      * iconClass
      * label
      * type
      * enableOnSelection
      * selectionModel
  * advance
    * visualCustomizations
  * listeners
    * onGridEvent (Generic one to handle all)
    * onPagingEvent

## Grid Properties (this.state)

state
 * data
 * control
   * paging
     * pageSize
     * currentPage
   * sorting
     * attribute
     * sortOrder
   * search
     * type (freeForm, columnAttr, advance)
     * freeFormText
     * attributeMatches
     * advanceCriteria
   * selection


## Grid Event (Object passed in to onGridEvent callback)

GridEvent
 * type
 * subtype
 * payload

###Types
* paging
 * gotoPage  (payload : pageSize, currentPage, promise)
* Sorting (payload: attribute, sortOrder, promise)
* Search  (payload : search, promise)
* RowSelection (payload : selectedRows)
  * rowSelected
  * rowDeselected
  * rowClicked
* ToolbarAction (payload: action, selectedRows)
* RowExpansion (payload: rowId, promise) * promise to be resolved with domNode
* InlineAction
   * edit (payload: action (enterEdit, save), row, promise)
   * delete (payload : row, promise)
   * add (payload: row, promise)
   * addAbove
   * addBelow
   * custom (payload: action)
   * moveUp
   * moveDown


## Grid API (functions that can be invoked on the table)

* setSelected
* getSelected
* selectAll
* deselectAll
* refresh
* setFilter
* setSort
* setPaging
*

## Example Properties
```javascript
const structure = {
  id: '_id',
  rowExpansion : {
    enabled:true
  },
  columns: [
  {
    attr: "_id",
    label: "Identifier",
    width: 200,
    editable: false,
    type: "integer",
    filterable: false,
    position: 1
  }, {
    attr: "name",
    label: "Name",
    width: 200,
    alignment: "left",
    editable: true,
    sortable: false,
    type: "string",
    position: 2
  }, {
    attr: "address",
    label: "Address",
    width: 350,
    editable: true,
    type: "string",
    position: 3
  }],
  toolbarItems: [{
      'action': 'refresh',
      'iconClass': 'fa-refresh',
      '': getI18N('Refresh'),
      'type': 'primary'
    }, {
      'action': 'add',
      'iconClass': 'fa-plus',
      '': getI18N('Add'),
      'type': 'primary'
    }, {
      'action': 'duplicate',
      'iconClass': 'fa-clone',
      '': getI18N('Duplicate'),
      'enableOnSelection': true,
      'selectionModel': 'single',
      'type': 'primary'
    }
  }
 }

  const listeners = {
    'onGridEvent': this.handleGridEvent.bind(this)
  }

  const defaultControl = {
    paging: {
      pageSize: 20,
      currentPage: 1
    },
    sorting = {
      attribute: '',
      sortOrder: 1 // ASC : 1, 'DSC : -1
    }
    search : {
      type: 'freeform', // freeform, columnAttr, advance
      freeFormText: '',
      attributeMatches: {}, // single value or array against each columnAttr
      advanceCriteria: {} //boolean of attributesMatch
    }  
  }

  const advance = {
   customVisualization : {
    'paginationPlacement' : 'top', // top | bottom
   }
  }
```

```html

ReactDom.render(
<Grid
  structure={structure}
  listeners={listeners}
  defaultControl={defaultControl}
  advance={advance}
</Grid>,
domNode);

```
