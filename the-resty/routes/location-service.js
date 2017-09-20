var jf = require('jsonfile'),
    util = require('util'),
    underscore = require('underscore');

var file,
    buildings = {},
    campus = {},
    floors = {},
    zones = {},
    locations = {};

file = __dirname + '/../data/location/buildings.json';
jf.readFile(file, function(err, obj) {
    //console.log(util.inspect(obj));
    console.log("Read::" + file);
    buildings = obj;
});

file = __dirname + '/../data/location/campus.json';
jf.readFile(file, function(err, obj) {
    console.log("Read::" + file);
    campus = obj;
});

file = __dirname + '/../data/location/floors.json';
jf.readFile(file, function(err, obj) {
    console.log("Read::" + file);
    floors = obj;
});

file = __dirname + '/../data/location/zones.json';
jf.readFile(file, function(err, obj) {
    console.log("Read::" + file);
    zones = obj;
});

file = __dirname + '/../data/location/locations.json';
jf.readFile(file, function(err, obj) {
    console.log("Read::" + file);
    locations = obj;
});

exports.getBuildings = function() {
  return buildings;
};

exports.getCampus = function() {
    return campus;
};

exports.getFloors = function() {
    return floors;
};

exports.getZones = function() {
    return zones;
};

exports.getLocations = function() {
    return locations;
};