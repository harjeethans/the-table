var jf = require('jsonfile'),
    util = require('util'),
    underscore = require('underscore');

var file,
    defects = {},
    defectSuite = {},
    defectSuiteDefects = {};

file = __dirname + '/../data/defects/defects.json';
jf.readFile(file, function(err, obj) {
    //console.log(util.inspect(obj));
    console.log("Read::" + file);
    defects = obj;
});

file = __dirname + '/../data/defects/defect-suite.json';
jf.readFile(file, function(err, obj) {
    console.log("Read::" + file);
    defectSuite = obj;
});

file = __dirname + '/../data/defects/defect-suite.json';
jf.readFile(file, function(err, obj) {
    console.log("Read::" + file);
    defectSuiteDefects = obj;
});

exports.getAllDefects = function() {
  return defects;
};

exports.getDefectSuite = function() {
    return defectSuite;
};

exports.getDefectSuiteDefects = function() {
    return defectSuiteDefects;
};

//exports.getDefectById = function(id) {
//  for (var i = 0; i < defects.length; i++) {
//    if (defects[i].id == id) return defects[i];
//  }
//};