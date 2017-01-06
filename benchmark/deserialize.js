'use strict';

const benchmark = require('./benchmark');
const sjmp      = require('../lib/sjmp');

const REQUEST = '["<","some/resource","MessageId",1395591341000,{},"request body"]';
const REPLY   = '[">400","some/resource","MessageId",1395591341000,{},"reply body"]';
const EVENT   = '["=","some/resource","MessageId",1395591341000,{},"modified resource body"]';


function deserializeRequest() {
  sjmp.deserialize(REQUEST)
}


function deserializeReply() {
  sjmp.deserialize(REPLY)
}


function deserializeEvent() {
  sjmp.deserialize(EVENT)
}


benchmark.add('Deserialize REQUEST', deserializeRequest);
benchmark.add('Deserialize REPLY',   deserializeReply);
benchmark.add('Deserialize EVENT',   deserializeEvent);

benchmark.run();
