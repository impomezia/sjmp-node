'use strict';


module.exports.request = function(version) {
  return {
    type:     '<',
    method:   'get',
    version:  version,
    resource: 'some/resource',
    id:       'MessageId',
    date:     1395591341000,
    headers:  {},
    body:     'request body'
  };
};


module.exports.reply = function(version) {
  return {
    type:      '>',
    status:    400,
    resource: 'some/resource',
    version:   version,
    id:        'MessageId',
    date:      1395591341000,
    headers:  {},
    body:     'reply body'
  };
};


module.exports.modified = function(version) {
  return {
    type:     '=',
    version:  version,
    resource: 'some/resource',
    id:       'MessageId',
    date:     1395591341000,
    headers:  {},
    body:     'modified resource body'
  };
};


module.exports.added = function(version) {
  return {
    type:     '+',
    version:  version,
    resource: 'some/resource',
    id:       'MessageId',
    date:     1395591341000,
    headers:  {},
    body:     'added resource body'
  };
};


module.exports.deleted = function(version) {
  return {
    type:      '-',
    version:   version,
    resource: 'some/resource',
    id:       'MessageId',
    date:     1395591341000,
    headers:  {},
    body:     'deleted resource body'
  }
};
