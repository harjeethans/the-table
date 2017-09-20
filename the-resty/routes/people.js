var express = require('express'),
  ds = require("./people-service"),
  router = express.Router(),
  _ = require('underscore');

console.log("IN PEOPLE");
var data, pageSize = 25,
  startAt = 0,
  totalPages, result, _d, conditions, filteredData;

function resetPage() {
  pageSize = 25;
  startAt = 0;
}

function createResponseObject(data, req) {
  console.log("-------- people data.length raw " + data.length);
  data = filterData(data, req.query);
  console.log("-------- people data.length filtered " + data.length);
  data = sortData(data, req.query);
  console.log("-------- people data.length sorted " + data.length);

  if (req.query) {
    if (req.query.pageSize) {
      pageSize = Math.min(parseInt(req.query.pageSize), data.length);
    }
    if (req.query.startAt) {
      startAt = parseInt(req.query.startAt);
    }

  }

  if (startAt > -1 && pageSize < data.length + 1) {
    try {
      var start = (startAt - 1) * pageSize;
      var end = start + pageSize;
      _d = data.slice(start, end);
    } catch (error) {
      console.log("SEVERE error cannot get data requested!");
      _d = [];
    }

  } else {
    _d = data;
  }
  result = {};
  result.totalCount = data.length;
  result.identifier = "_id";
  result.items = _d;
  resetPage();

  return result;
}

function sortData(data, params) {
  var _fd = data;
  if (params.sortField && params.sortOrder) {
    var field = params.sortField.slice(1, params.sortField.length - 1);
    _fd = _.sortBy(data, field);
    if (params.sortOrder == -1) {
      _fd.reverse();
    }
  }
  return _fd;
}

function filterData(data, params) {
  var _fd = data;
  if (params.searchText) {
    var text = params.searchText.slice(1, params.searchText.length - 1);
    _fd = _.filter(data, function(item) {
      var res = false;
      for (var p in item) {
        if (typeof p === 'string') {
          if (item[p].toString().indexOf(text) > -1) {
            res = true;
            break;
          }
        }
      }
      return res;
    });
  } else if (params.fieldsMatch) {
    //match attributes
    var fields = JSON.parse(params.fieldsMatch);
    console.log("============== people fields " + JSON.stringify(fields));
    _fd = _.filter(data, function(item) {
      var res = false;
      var keys = _.keys(fields),
        aVal, aKey;
      for (var i = 0; i < keys.length; i++) {
        aKey = keys[i];
        aVal = fields[aKey];
        if (aVal && item[aKey] && item[aKey].toString().indexOf(aVal.toString()) > -1) {
          res = true;
          console.log("Found a match " + JSON.stringify(item));
        } else {
          res = false;
          break;
        }
      }

      return res;

    });
  }
  console.log("Flterred has ::" + _fd.length)
  return _fd;
}
router.get('/api/people', function(req, res, next) {
  data = ds.getAllPeople();
  //console.log("We have " + data.length);
  //set timeout to get required delay.
  setTimeout(function(res, data, req) {
    res.json(createResponseObject(data, req));
  }, 10, res, data, req);
});





module.exports = router;
