'use strict';

var Benchmark = require('benchmark');
var sjmp      = require('../lib/sjmp');
var suite     = new Benchmark.Suite;


function test1() {
  sjmp.serialize({
    type: '<',
    method: 'get',
    version: 1,
    resource: 'some/resource',
    id: 'MessageId',
    date: 1395591341000,
    headers: {},
    body: 'request body'
  }, false)
}

function test2() {
  sjmp.serialize({
    type: '<',
    method: 'get',
    version: 1,
    resource: 'some/resource',
    id: 'MessageId',
    date: 1395591341000,
    headers: {},
    body: 'request body'
  }, true)
}

suite.add('Serialize#Array', test1);
suite.add('Serialize#JSON', test2);

suite.on('cycle', function(event) {
  console.log(String(event.target));
});

suite.on('complete', function() {
  process.exit(0);
});

suite.run();