'use strict';


module.exports.request = function() {
  return {
    method:   'get',
    resource: 'some/resource',
    id:       'MessageId',
    date:     1395591341000,
    headers:  {},
    body:     'request body'
  };
};


module.exports.reply = function() {
  return {
    status:    400,
    resource: 'some/resource',
    id:        'MessageId',
    date:      1395591341000,
    headers:  {},
    body:     'reply body'
  };
};


module.exports.modified = function() {
  return {
    resource: '=some/resource',
    id:       'MessageId',
    date:     1395591341000,
    headers:  {},
    body:     'modified resource body'
  };
};


module.exports.added = function() {
  return {
    resource: '+some/resource',
    id:       'MessageId',
    date:     1395591341000,
    headers:  {},
    body:     'added resource body'
  };
};


module.exports.deleted = function() {
  return {
    resource: '-some/resource',
    id:       'MessageId',
    date:     1395591341000,
    headers:  {},
    body:     'deleted resource body'
  }
};
