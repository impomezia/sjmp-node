'use strict';

var Benchmark = require('benchmark');
var sjmp      = require('../lib/sjmp');
var suite     = new Benchmark.Suite;

function test1() {
  sjmp.deserialize(['<get', 'some/resource', 'MessageId', 1395591341000, {}, 'request body']);
}

function test2() {
  sjmp.deserialize('["<","some/resource","MessageId",1395591341000,{},"request body"]')
}

suite.add('Deserialize#Array', test1);
suite.add('Deserialize#JSON', test2);

suite.on('cycle', function(event) {
  console.log(String(event.target));
});

suite.on('complete', function() {
  process.exit(0);
});

suite.run();