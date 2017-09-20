var jf = require('jsonfile'),
    util = require('util'),
    underscore = require('underscore');

var file,
    people = {};

file = __dirname + '/../data/people/people-5000.json';
jf.readFile(file, function(err, obj) {
    //console.log(util.inspect(obj));
    console.log("Read::" + file);
    people = obj;
});

exports.getAllPeople = function() {
  return people;
};
