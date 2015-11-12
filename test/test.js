var sjmp   = require('../index');
var expect = require('chai').expect;


var request = {
  type: '<',
  method: 'get',
  version: 1,
  resource: 'some/resource',
  id: 'MessageId',
  date: 1395591341000,
  headers: {},
  body: 'request body'
};


var reply = {
  type: '>',
  status: 400,
  resource: 'some/resource',
  version: 1,
  id: 'MessageId',
  date: 1395591341000,
  headers: {},
  body: 'reply body'
};


var modified = {
  type: '=',
  version: 1,
  resource: 'some/resource',
  id: 'MessageId',
  date: 1395591341000,
  headers: {},
  body: 'modified resource body'
};


var added = {
  type: '+',
  version: 1,
  resource: 'some/resource',
  id: 'MessageId',
  date: 1395591341000,
  headers: {},
  body: 'added resource body'
};


var deleted = {
  type: '-',
  version: 1,
  resource: 'some/resource',
  id: 'MessageId',
  date: 1395591341000,
  headers: {},
  body: 'deleted resource body'
};


describe('Serialize', function() {
  var result;
  var i;

  it('serialize request', function() {
    var result = sjmp.serialize(request, false);

    expect(result).to.be.an('array');
    expect(result).to.have.length(6);
    expect(result).to.deep.equal(['<', 'some/resource', 'MessageId', 1395591341000, {}, 'request body']);

    result = sjmp.serialize(request, true);

    expect(result).to.be.an('string');
    expect(result).to.deep.equal('["<","some/resource","MessageId",1395591341000,{},"request body"]');
  });

  it('serialize reply', function() {
    var result = sjmp.serialize(reply, false);

    expect(result).to.be.an('array');
    expect(result).to.have.length(6);
    expect(result).to.deep.equal(['>400', 'some/resource', 'MessageId', 1395591341000, {}, 'reply body']);

    result = sjmp.serialize(reply, true);

    expect(result).to.be.an('string');
    expect(result).to.deep.equal('[">400","some/resource","MessageId",1395591341000,{},"reply body"]');
  });

  it('serialize modified', function() {
    var result = sjmp.serialize(modified, false);

    expect(result).to.be.an('array');
    expect(result).to.have.length(6);
    expect(result).to.deep.equal(['=', 'some/resource', 'MessageId', 1395591341000, {}, 'modified resource body']);

    result = sjmp.serialize(modified, true);

    expect(result).to.be.an('string');
    expect(result).to.deep.equal('["=","some/resource","MessageId",1395591341000,{},"modified resource body"]');
  });

  it('serialize added', function() {
    var result = sjmp.serialize(added, false);

    expect(result).to.be.an('array');
    expect(result).to.have.length(6);
    expect(result).to.deep.equal(['+', 'some/resource', 'MessageId', 1395591341000, {}, 'added resource body']);

    result = sjmp.serialize(added, true);

    expect(result).to.be.an('string');
    expect(result).to.deep.equal('["+","some/resource","MessageId",1395591341000,{},"added resource body"]');
  });

  it('serialize deleted', function() {
    var result = sjmp.serialize(deleted, false);

    expect(result).to.be.an('array');
    expect(result).to.have.length(6);
    expect(result).to.deep.equal(['-', 'some/resource', 'MessageId', 1395591341000, {}, 'deleted resource body']);

    result = sjmp.serialize(deleted, true);

    expect(result).to.be.an('string');
    expect(result).to.deep.equal('["-","some/resource","MessageId",1395591341000,{},"deleted resource body"]');
  });

  it('serialize various date format', function() {
    var tests = [
      { type: '>', status: 200, resource: 'some/resource', id: 'idid', date: 1426379946762 },
      { type: '>', status: 200, resource: 'some/resource', id: 'idid', date: '2015-03-15T00:39:06.762Z' },
      { type: '>', status: 200, resource: 'some/resource', id: 'idid', date: new Date(1426379946762) }
    ];

    for (i = 0; i < tests.length; ++i) {
      result = sjmp.serialize(tests[i], true);

      expect(result).to.deep.equal('[">","some/resource","idid",1426379946762,{},null]');
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

    for (i = 0; i < tests.length; ++i) {
      result = sjmp.deserialize(tests[i]);

      expect(result).to.be.an('object');
      expect(result).to.deep.equal(request);
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
      expect(result).to.deep.equal(reply);
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
      expect(result).to.deep.equal(modified);
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
      expect(result).to.deep.equal(added);
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
      expect(result).to.deep.equal(deleted);
    }
  });

  it('Invalid packets should be deserialized as null', function() {
    var invalid = [
      undefined,
      null,
      [],
      {},
      666,
      '["f", "res", "id"]',
      '["<get/2", "res", "packet-id"]',
      '[">bad", "res", "packet-id"]',
      '[">", 200, 0]',
      '[">", 200, "id"]',
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
