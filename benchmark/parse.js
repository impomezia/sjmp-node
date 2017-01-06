'use strict';

const benchmark = require('./benchmark');
const sjmp      = require('../src/sjmp');

const REQUEST = '[1,"<some/resource","idkfa","request body",1395591341000,{}]';
const REPLY   = '[400,"=some/resource","idkfa","reply body",1395591341000,{}]';
const EVENT   = '[2,"+some/resource","idkfa","modified resource body",1395591341000,{}]';


function parseRequest() {
  sjmp.parse(REQUEST)
}


function parseReply() {
  sjmp.parse(REPLY)
}


function parseEvent() {
  sjmp.parse(EVENT)
}


benchmark.add('Parse REQUEST', parseRequest);
benchmark.add('Parse REPLY',   parseReply);
benchmark.add('Parse EVENT',   parseEvent);

benchmark.run();
