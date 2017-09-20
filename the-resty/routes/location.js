var express = require('express'),
    ls = require("./location-service"),
    router = express.Router(),
    underscore = require('underscore');

//ds.getAllDefects()
console.log("IN LOCATION");
var data, pageSize = 10, startAt = 0, totalPages, result, _d, _parentId;

function resetPage(){
    pageSize = 10;
    startAt = 0;
}

function createResponseObject(_data, req){
    if(req.query){
        if(req.query.pageSize){
            pageSize = parseInt(req.query.pageSize);
        }
        if(req.query.startAt){
            startAt = parseInt(req.query.startAt);
            //accomodate startPage here , client send 1 for forst page not 0.
            startAt = startAt-1;
        }

    }
    if(startAt>-1 && pageSize < data.items.length+1){
        try{
            var start = startAt*pageSize;
            var end = start + pageSize;
            _d = data.items.slice(start, end);
        } catch (error){
            console.log("SEVERE error cannot get data requested!");
            _d = [];
        }

    } else {
        _d = data.items;
    }
    result = {};
    result.totalCount = data.items.length;
    result.identifier = "id";
    result.items = _d;
    resetPage();

    return result;
}

router.get('/api/location/campus', function(req, res, next) {
    data = ls.getCampus();
    res.json(createResponseObject(data, req));
});

router.get('/api/location/buildings', function(req, res, next) {
    data = ls.getBuildings();
    res.json(createResponseObject(data, req));
});

router.get('/api/location/floors', function(req, res, next) {
    data = ls.getFloors();
    res.json(createResponseObject(data, req));
});

router.get('/api/location/zones', function(req, res, next) {
    data = ls.getZones();
    res.json(createResponseObject(data, req));
});

function createLocationResponseObject(_data, req){
    if(req.query){
        if(req.query.pageSize){
            pageSize = parseInt(req.query.pageSize);
        }
        if(req.query.startAt){
            startAt = parseInt(req.query.startAt);
            //accomodate startPage here , client send 1 for forst page not 0.
            startAt = startAt-1;
        }
        if(req.query.parentId){
            _parentId = req.query.parentId;
        }

    }
    if(startAt>-1 && pageSize < data.items.length+1){
        try{
            var start = startAt*pageSize;
            var end = start + pageSize;
            _d = data.items.slice(start, end);
        } catch (error){
            console.log("SEVERE error cannot get data requested!");
            _d = [];
        }

    } else {
        _d = data.items;
    }
    result = {};
    result.totalCount = data.items.length;
    result.identifier = "id";
    result.items = _d;
    resetPage();

    return result;
}
router.get('/api/location/locations', function(req, res, next) {
    data = ls.getLocations();
    res.json(createLocationResponseObject(data, req));
});


module.exports = router;
