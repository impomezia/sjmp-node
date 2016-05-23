'use strict';

var expect = require('chai').expect;
var sjmp   = require('../index');
var mock   = require('./mock');


describe('Serialize', function() {
  it('serialize request', function() {
    var result = sjmp.serialize(mock.request(1), false);

    expect(result).to.be.an('array');
    expect(result).to.have.length(6);
    expect(result).to.deep.equal(['<', 'some/resource', 'MessageId', 1395591341000, {}, 'request body']);

    result = sjmp.serialize(mock.request(1), true);
    expect(result).to.be.a('string').and.to.deep.equal('["<","some/resource","MessageId",1395591341000,{},"request body"]');
  });


  it('serialize request [v2]', function() {
    expect(sjmp.serialize(mock.request(2))[0]).to.equal('</2');
  });


  it('serialize reply', function() {
    var result = sjmp.serialize(mock.reply(1), false);

    expect(result).to.be.an('array');
    expect(result).to.have.length(6);
    expect(result).to.deep.equal(['>400', 'some/resource', 'MessageId', 1395591341000, {}, 'reply body']);

    result = sjmp.serialize(mock.reply(1), true);
    expect(result).to.be.a('string').and.to.deep.equal('[">400","some/resource","MessageId",1395591341000,{},"reply body"]');
  });


  it('serialize reply [v2]', function() {
    expect(sjmp.serialize(mock.reply(2))[0]).to.equal('>400/2');
  });


  it('serialize modified', function() {
    var result = sjmp.serialize(mock.modified(1), false);

    expect(result).to.be.an('array');
    expect(result).to.have.length(6);
    expect(result).to.deep.equal(['=', 'some/resource', 'MessageId', 1395591341000, {}, 'modified resource body']);

    result = sjmp.serialize(mock.modified(1), true);
    expect(result).to.be.a('string').and.to.deep.equal('["=","some/resource","MessageId",1395591341000,{},"modified resource body"]');
  });


  it('serialize modified [v2]', function() {
    expect(sjmp.serialize(mock.modified(2))[0]).to.equal('=/2');
  });


  it('serialize added', function() {
    var result = sjmp.serialize(mock.added(1), false);

    expect(result).to.be.an('array');
    expect(result).to.have.length(6);
    expect(result).to.deep.equal(['+', 'some/resource', 'MessageId', 1395591341000, {}, 'added resource body']);

    result = sjmp.serialize(mock.added(1), true);
    expect(result).to.be.a('string').and.to.deep.equal('["+","some/resource","MessageId",1395591341000,{},"added resource body"]');
  });


  it('serialize added [v2]', function() {
    expect(sjmp.serialize(mock.added(2))[0]).to.equal('+/2');
  });


  it('serialize deleted', function() {
    var result = sjmp.serialize(mock.deleted(1), false);

    expect(result).to.be.an('array');
    expect(result).to.have.length(6);
    expect(result).to.deep.equal(['-', 'some/resource', 'MessageId', 1395591341000, {}, 'deleted resource body']);

    result = sjmp.serialize(mock.deleted(1), true);
    expect(result).to.be.a('string').and.to.deep.equal('["-","some/resource","MessageId",1395591341000,{},"deleted resource body"]');
  });


  it('serialize deleted [v2]', function() {
    expect(sjmp.serialize(mock.deleted(2))[0]).to.equal('-/2');
  });


  it('serialize various date format', function() {
    const tests = [
      { type: '>', status: 200, resource: 'some/resource', id: 'idid', date: 1426379946762 },
      { type: '>', status: 200, resource: 'some/resource', id: 'idid', date: '1426379946762' },
      { type: '>', status: 200, resource: 'some/resource', id: 'idid', date: '2015-03-15T00:39:06.762Z' },
      { type: '>', status: 200, resource: 'some/resource', id: 'idid', date: new Date(1426379946762) }
    ];

    for (let i of tests) {
      expect(sjmp.serialize(i, true)).to.deep.equal('[">","some/resource","idid",1426379946762,{},null]');
    }

    expect(sjmp.serialize({ type: '>', resource: 'r', id: '1234', date: {} }, true)).to.deep.equal('[">","r","1234",0,{},null]');
  });

  it('Invalid packets should be serialized as null', () => {
    const invalid = [
      0,
      { type: '<', method: 'get', resource: 'some/resource', date: 0, headers: {}, body: 'request body' },
      { type: '<', method: 'get', resource: 'some/resource', id: '123', date: 0, headers: {}, body: 'request body' },
      { type: '<', method: 'get', id: '1234', date: 0, headers: {}, body: 'request body' },
      { method: 'get', resource: 'some/resource', id: '1234', date: 0, headers: {}, body: 'request body' },
      { type: '<', method: 'get', resource: 'some/resource', id: '1234', date: 0, headers: this, body: 'request body' }
    ];

    for (let i of invalid) {
      expect(sjmp.serialize(i, true)).to.be.a('null');
    }
  });
});


describe('Deserialize', function() {
  var result;
  var i;


  it('deserialize request', function() {
    var tests = [
      ['<get', 'some/resource', 'MessageId', 1395591341000, {}, 'request body'],
      '["<","some/resource","MessageId",1395591341000,{},"request body"]'
    ];

    for (let i of tests) {
      expect(sjmp.deserialize(i)).to.be.an('object').and.to.deep.equal(mock.request(1));
    }
  });


  it('deserialize request [v2]', function() {
    var tests = [
      ['<get/2', 'some/resource', 'MessageId', 1395591341000, {}, 'request body'],
      '["</2","some/resource","MessageId",1395591341000,{},"request body"]'
    ];

    for (let i of tests) {
      expect(sjmp.deserialize(i)).to.be.an('object').and.to.deep.equal(mock.request(2));
    }
  });


  it('deserialize reply', function() {
    var tests = [
      ['>400', 'some/resource', 'MessageId', 1395591341000, {}, 'reply body'],
      '[">400","some/resource","MessageId",1395591341000,{},"reply body"]'
    ];

    for (i = 0; i < tests.length; ++i) {
      result = sjmp.deserialize(tests[i]);

      expect(result).to.be.an('object');
      expect(result).to.deep.equal(mock.reply(1));
    }
  });

  it('deserialize modified', function() {
    var tests = [
      ['=', 'some/resource', 'MessageId', 1395591341000, {}, 'modified resource body'],
      '["=","some/resource","MessageId",1395591341000,{},"modified resource body"]'
    ];

    for (i = 0; i < tests.length; ++i) {
      result = sjmp.deserialize(tests[i]);

      expect(result).to.be.an('object');
      expect(result).to.deep.equal(mock.modified(1));
    }
  });

  it('deserialize added', function() {
    var tests = [
      ['+', 'some/resource', 'MessageId', 1395591341000, {}, 'added resource body'],
      '["+","some/resource","MessageId",1395591341000,{},"added resource body"]'
    ];

    for (i = 0; i < tests.length; ++i) {
      result = sjmp.deserialize(tests[i]);

      expect(result).to.be.an('object');
      expect(result).to.deep.equal(mock.added(1));
    }
  });

  it('deserialize deleted', function() {
    var tests = [
      ['-', 'some/resource', 'MessageId', 1395591341000, {}, 'deleted resource body'],
      '["-","some/resource","MessageId",1395591341000,{},"deleted resource body"]'
    ];

    for (i = 0; i < tests.length; ++i) {
      result = sjmp.deserialize(tests[i]);

      expect(result).to.be.an('object');
      expect(result).to.deep.equal(mock.deleted(1));
    }
  });

  it('Invalid packets should be deserialized as null', function() {
    const invalid = [
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
      '["<", "res", "123"]'
    ];

    for (i = 0; i < invalid.length; ++i) {
      result = sjmp.deserialize(invalid[i]);

      expect(result).to.be.a('null');
    }
  });

  it('Date property should be a number', function() {
    var tests = [
      '["=", "res", "packet-id"]',
      '["=", "res", "packet-id", true]',
      '["=", "res", "packet-id", "2014"]',
      '["=", "res", "packet-id", {}]',
      '["=", "res", "packet-id", 1395591341000]'
    ];

    for (i = 0; i < tests.length; ++i) {
      result = sjmp.deserialize(tests[i]);

      expect(result).to.be.an('object');
      expect(result.date).to.be.a('number');
      expect(isNaN(result.date)).to.not.be.true;
    }
  });

  it('Headers property should be an object', function() {
    var tests = [
      '["=", "res", "packet-id"]',
      '["=", "res", "packet-id", 0, true]',
      '["=", "res", "packet-id", 0, "text"]',
      '["=", "res", "packet-id", 0, []]',
      '["=", "res", "packet-id", 0, {}]',
    ];

    for (i = 0; i < tests.length; ++i) {
      result = sjmp.deserialize(tests[i]);

      expect(result).to.be.an('object');
      expect(result.headers).to.be.an('object');
    }
  });
});


describe('Header', function() {
  it('create', function() {
    expect(sjmp.createHeader()).to.be.a('null');
    expect(sjmp.createHeader('bad type')).to.be.a('null');
    expect(sjmp.createHeader('f')).to.be.a('null');

    expect(sjmp.createHeader('<', 'POST')).to.deep.equal('<+');
    expect(sjmp.createHeader('<', 'POST', 'bad version')).to.deep.equal('<+');
    expect(sjmp.createHeader('>')).to.deep.equal('>');
    expect(sjmp.createHeader('>', 200, 1)).to.deep.equal('>');
    expect(sjmp.createHeader('>', 400, 1)).to.deep.equal('>400');
    expect(sjmp.createHeader('>', null, 2)).to.deep.equal('>/2');
    expect(sjmp.createHeader('>', 'ignored', 2)).to.deep.equal('>/2');
  });

  it('read', function() {
    expect(sjmp.readHeader()).to.be.a('null');
    expect(sjmp.readHeader('f')).to.be.a('null');

    expect(sjmp.readHeader('>')).to.deep.equal({type: '>', status: 200, version: 1});
    expect(sjmp.readHeader('>200')).to.deep.equal({type: '>', status: 200, version: 1});
    expect(sjmp.readHeader('>400')).to.deep.equal({type: '>', status: 400, version: 1});
    expect(sjmp.readHeader('>/bad version')).to.deep.equal({type: '>', status: 200, version: 1});
    expect(sjmp.readHeader('>/2')).to.deep.equal({type: '>', status: 200, version: 2});
    expect(sjmp.readHeader('>500/2')).to.deep.equal({type: '>', status: 500, version: 2});
    expect(sjmp.readHeader('=//2')).to.deep.equal({type: '=', version: 1});
  });

  it('create aliases', function() {
    expect(sjmp.createHeader('<')).to.deep.equal('<');
    expect(sjmp.createHeader('<', 'get')).to.deep.equal('<');
    expect(sjmp.createHeader('<', 'GET')).to.deep.equal('<');
    expect(sjmp.createHeader('<', 'post')).to.deep.equal('<+');
    expect(sjmp.createHeader('<', 'put')).to.deep.equal('<=');
    expect(sjmp.createHeader('<', 'delete')).to.deep.equal('<-');
    expect(sjmp.createHeader('<', 'search')).to.deep.equal('<?');
    expect(sjmp.createHeader('<', 'method')).to.deep.equal('<method');
  });

  it('read aliases', function() {
    expect(sjmp.readHeader('<')).to.deep.equal({type: '<', method: 'get', version: 1});
    expect(sjmp.readHeader('<get')).to.deep.equal({type: '<', method: 'get', version: 1});
    expect(sjmp.readHeader('<post')).to.deep.equal({type: '<', method: 'post', version: 1});
    expect(sjmp.readHeader('<+')).to.deep.equal({type: '<', method: 'post', version: 1});
    expect(sjmp.readHeader('<put')).to.deep.equal({type: '<', method: 'put', version: 1});
    expect(sjmp.readHeader('<=')).to.deep.equal({type: '<', method: 'put', version: 1});
    expect(sjmp.readHeader('<delete')).to.deep.equal({type: '<', method: 'delete', version: 1});
    expect(sjmp.readHeader('<-')).to.deep.equal({type: '<', method: 'delete', version: 1});
    expect(sjmp.readHeader('<search')).to.deep.equal({type: '<', method: 'search', version: 1});
    expect(sjmp.readHeader('<?')).to.deep.equal({type: '<', method: 'search', version: 1});
    expect(sjmp.readHeader('<method')).to.deep.equal({type: '<', method: 'method', version: 1});
  });
});
