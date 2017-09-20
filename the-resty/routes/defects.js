var express = require('express'),
    ds = require("./defects-service"),
    router = express.Router(),
    _ = require('underscore');

//ds.getAllDefects()
console.log("IN DEFECTSS");
var data, pageSize = 25, startAt = 0, totalPages, result, _d, conditions, filteredData;

function resetPage(){
    pageSize = 25;
    startAt = 0;
}

function createResponseObject(_data, req){
    conditions = {};
    if(req.query){
        if(req.query.pageSize){
            pageSize = parseInt(req.query.pageSize);
        }
        if(req.query.startAt){
            startAt = parseInt(req.query.startAt);
        }

    }
    if(req.query.description){
        conditions["description"] = req.query.description;
    }
    if(req.query.severity){
        conditions["severity"] = req.query.severity;
    }
    if(req.query.status){
        conditions["status"] = req.query.status;
    }

    if(conditions && _.keys(conditions).length>0){
        filteredData = filterData(data, conditions);
    } else {
        filteredData = data.items;
    }

    if(startAt>-1 && pageSize < filteredData.length+1){
        try{
            var start = startAt*pageSize;
            var end = start + pageSize;
            _d = filteredData.slice(start, end);
        } catch (error){
            console.log("SEVERE error cannot get data requested!");
            _d = [];
        }

    } else {
        _d = [];
    }
    result = {};
    result.totalCount = filteredData.length;
    result.identifier = "id";
    result.items = _d;
    resetPage();

    return result;
}

function filterData(data, conditions){
    var _fd = _.filter(data.items, function(item){
        var res = false;
        var keys = _.keys(conditions), aVal, aKey;
        for(var i=0; i<keys.length; i++){
            aKey = keys[i];
            aVal = conditions[aKey];
            if(aVal && item[aKey] && item[aKey].toString().indexOf(aVal.toString())>-1){
                res = true;
                break;
            }
        }

        return res;

    });
    console.log("Flterred has ::" + _fd.length)
    return _fd;
}
router.get('/api/defects', function(req, res, next) {
    data = ds.getAllDefects();
    setTimeout(function(res, data, req){res.json(createResponseObject(data, req));}, 200, res, data, req);
});

router.get('/api/defectsuite', function(req, res, next) {
    data = ds.getDefectSuite();
    res.json(createResponseObject(data, req));
});

router.get('/api/defectsuitedefects', function(req, res, next) {
    data = ds.getDefectSuiteDefects();
    res.json(createResponseObject(data, req));
});




module.exports = router;
