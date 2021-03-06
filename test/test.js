'use strict';

const expect = require('chai').expect;
const sjmp   = require('../src/sjmp');
const mock   = require('./mock');


describe('Serialize', function() {
  it('serialize request', function() {
    const result = sjmp.request(mock.request(), false);

    expect(result).to.be.an('array');
    expect(result).to.have.lengthOf(6);
    expect(result).to.deep.equal([1, '<some/resource', 'MessageId', 'request body', 1395591341000, {}]);

    expect(sjmp.request(mock.request(), true)).to.be.a('string').and.to.deep.equal('[1,"<some/resource","MessageId","request body",1395591341000,{}]');
  });


  it('serialize reply', function() {
    const result = sjmp.reply(mock.reply(), false);

    expect(result).to.be.an('array');
    expect(result).to.have.lengthOf(6);
    expect(result).to.deep.equal([400, 'some/resource', 'MessageId', 'reply body', 1395591341000, {}]);

    expect(sjmp.reply(mock.reply(), true)).to.be.a('string').and.to.deep.equal('[400,"some/resource","MessageId","reply body",1395591341000,{}]');
  });


  it('serialize modified', function() {
    let result = sjmp.event(mock.modified(), false);

    expect(result).to.be.an('array');
    expect(result).to.have.lengthOf(6);
    expect(result).to.deep.equal([2, '=some/resource', 'MessageId', 'modified resource body', 1395591341000, {}]);

    expect(sjmp.event(mock.modified(), true)).to.be.a('string').and.to.deep.equal('[2,"=some/resource","MessageId","modified resource body",1395591341000,{}]');
  });


  it('serialize added', function() {
    const result = sjmp.event(mock.added(1), false);

    expect(result).to.be.an('array');
    expect(result).to.have.lengthOf(6);
    expect(result).to.deep.equal([2, '+some/resource', 'MessageId', 'added resource body', 1395591341000, {}]);

    expect(sjmp.event(mock.added(), true)).to.be.a('string').and.to.deep.equal('[2,"+some/resource","MessageId","added resource body",1395591341000,{}]');
  });


  it('serialize deleted', function() {
    const result = sjmp.event(mock.deleted(), false);

    expect(result).to.be.an('array');
    expect(result).to.have.lengthOf(6);
    expect(result).to.deep.equal([2, '-some/resource', 'MessageId', 'deleted resource body', 1395591341000, {}]);

    expect(sjmp.event(mock.deleted(), true)).to.be.a('string').and.to.deep.equal('[2,"-some/resource","MessageId","deleted resource body",1395591341000,{}]');
  });


  it('Invalid packets should be serialized as null', () => {
    const invalid = [
      0,
      { method: 'get', resource: 'some/resource', date: 0, headers: {}, body: 'request body' },
      { method: 'get', resource: 'some/resource', id: '123', date: 0, headers: {}, body: 'request body' },
      { method: 'get', id: '1234', date: 0, headers: {}, body: 'request body' },
      { method: 'get', resource: 'some/resource', id: '1234', date: 0, headers: this, body: 'request body' }
    ];

    for (let i of invalid) {
      expect(sjmp.request(i, true)).to.be.a('null');
      expect(sjmp.reply(i, true)).to.be.a('null');
      expect(sjmp.event(i, true)).to.be.a('null');
    }
  });


  it('Request method should be optional', () => {
    const result = sjmp.request({ resource: '<some/resource', id: 'iddq'});

    expect(result).to.equal('[1,"<some/resource","iddq",null]');
  });
});


describe('Deserialize', function() {
  it('parse request', function() {
    const TESTS = [
      [1, '<some/resource', 'iddqd', 'request body', 1395591341000, {}],
      '[1,"<some/resource","iddqd","request body",1395591341000,{}]'
    ];

    const RESULT = { type: 'request', method: 'get', resource: 'some/resource', id: 'iddqd', body: 'request body', date: 1395591341000, headers: {} };

    for (let i of TESTS) {
      expect(sjmp.parse(i)).to.be.an('object').and.to.deep.equal(RESULT);
    }
  });


  it('parse reply', function() {
    const TESTS = [
      [400, '<some/resource', 'iddqd', 'reply body', 1395591341000, {}],
      '[400,"<some/resource","iddqd","reply body",1395591341000,{}]'
    ];

    const RESULT = { type: 'reply', method: 'get', status: 400, resource: 'some/resource', id: 'iddqd', body: 'reply body', date: 1395591341000, headers: {} };

    for (let i of TESTS) {
      expect(sjmp.parse(i)).to.be.an('object').and.to.deep.equal(RESULT);
    }
  });


  it('parse modified', function() {
    const TESTS = [
      [2, '=some/resource', 'iddqd', 'modified resource body',1395591341000, {}],
      '[2,"=some/resource","iddqd","modified resource body",1395591341000,{}]'
    ];

    const RESULT = { type: 'event', resource: '=some/resource', id: 'iddqd', body: 'modified resource body', date: 1395591341000, headers: {} };

    for (let i of TESTS) {
      expect(sjmp.parse(i)).to.be.an('object').and.to.deep.equal(RESULT);
    }
  });


  it('parse added', function() {
    const TESTS = [
      [2, '+some/resource', 'iddqd', 'added resource body',1395591341000, {}],
      '[2,"+some/resource","iddqd","added resource body",1395591341000,{}]'
    ];

    const RESULT = { type: 'event', resource: '+some/resource', id: 'iddqd', body: 'added resource body', date: 1395591341000, headers: {} };

    for (let i of TESTS) {
      expect(sjmp.parse(i)).to.be.an('object').and.to.deep.equal(RESULT);
    }
  });


  it('parse deleted', function() {
    const TESTS = [
      [2, '-some/resource', 'iddqd', 'deleted resource body',1395591341000, {}],
      '[2,"-some/resource","iddqd","deleted resource body",1395591341000,{}]'
    ];

    const RESULT = { type: 'event', resource: '-some/resource', id: 'iddqd', body: 'deleted resource body', date: 1395591341000, headers: {} };

    for (let i of TESTS) {
      expect(sjmp.parse(i)).to.be.an('object').and.to.deep.equal(RESULT);
    }
  });


  it('Invalid packets should be deserialized as null', function() {
    const INVALID = [
      undefined,
      null,
      [],
      {},
      666,
      '["f", "res", "id"]',
      '[">bad", "res", "packet-id"]',
      '[">", 200, 0]',
      '[">", 200, "id"]',
      '<b>',
      '["<", "res", "123"]',
      '[2,null,"iddqd","body"]',
      '[2,"","iddqd","body"]'
    ];

    for (let i of INVALID) {
      expect(sjmp.parse(i)).to.be.a('null');
    }
  });


  it('Should support optional data', () => {
    const TESTS = [
      '[1,"<some/resource","iddq",null]',
      '[2,"=some/resource","iddq",null]',
      '[200,"<some/resource","iddq",null]',
    ];

    for (let i of TESTS) {
      const result = sjmp.parse(i);

      expect(result.date).to.equal(0);
      expect(result.headers).to.deep.equal({});
    }
  });
});
