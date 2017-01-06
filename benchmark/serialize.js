'use strict';

const benchmark = require('./benchmark');
const sjmp      = require('../lib/sjmp');
const mock      = require('../test/mock');

const REQUEST = mock.request();
const REPLY   = mock.reply();
const EVENT   = mock.modified();


function serializeRequest() {
  sjmp.serialize(REQUEST, false)
}


function serializeRequestJSON() {
  sjmp.serialize(REQUEST, true)
}


function serializeReply() {
  sjmp.serialize(REPLY, false)
}


function serializeReplyJSON() {
  sjmp.serialize(REPLY, true)
}


function serializeEvent() {
  sjmp.serialize(EVENT, false)
}


function serializeEventJSON() {
  sjmp.serialize(EVENT, true)
}


benchmark.add('Serialize REQUEST#Array', serializeRequest);
benchmark.add('Serialize REQUEST#JSON',  serializeRequestJSON);
benchmark.add('Serialize REPLY#Array',   serializeReply);
benchmark.add('Serialize REPLY#JSON',    serializeReplyJSON);
benchmark.add('Serialize EVENT#Array',   serializeEvent);
benchmark.add('Serialize EVENT#JSON',    serializeEventJSON);


benchmark.run();
