'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var METHODS = {
  get: '<',
  search: '?',
  post: '+',
  put: '=',
  delete: '-',
  sub: '&',
  unsub: '~'
};

var METHODS_REVERSE = {
  '<': 'get',
  '?': 'search',
  '+': 'post',
  '=': 'put',
  '-': 'delete',
  '&': 'sub',
  '~': 'unsub'
};

/**
 * Serialize request to array or JSON.
 *
 * @param {Object}        packet
 * @param {String}        packet.resource
 * @param {String}        packet.id
 * @param {*}             packet.body
 * @param {Number|String} [packet.date]
 * @param {Object}        [packet.headers]
 * @param {String}        [packet.method] "get", "search", "post", "put", "delete", "sub", "unsub".
 * @param {Boolean}       [json] true to generate JSON instead of array.
 * @returns {Array|String|null}
 */
function request(packet, json) {
  if (!_check(packet)) {
    return null;
  }

  return _serialize(packet, [1, (METHODS[packet.method] || '') + packet.resource, packet.id, packet.body], json);
}

/**
 * Serialize reply to array or JSON.
 *
 * @param {Object}        packet
 * @param {String}        packet.resource
 * @param {String}        packet.id
 * @param {*}             packet.body
 * @param {Number}        [packet.status]
 * @param {Number|String} [packet.date]
 * @param {Object}        [packet.headers]
 * @param {Boolean}       [json] true to generate JSON instead of array.
 * @returns {Array|String|null}
 */
function reply(packet, json) {
  if (!_check(packet)) {
    return null;
  }

  return _serialize(packet, [packet.status || 500, packet.resource, packet.id, packet.body], json);
}

/**
 * Serialize event to array or JSON.
 *
 * @param {Object}        packet
 * @param {String}        packet.type
 * @param {String}        packet.resource
 * @param {String}        packet.id
 * @param {*}             packet.body
 * @param {Number|String} [packet.date]
 * @param {Object}        [packet.headers]
 * @param {Boolean}       [json] true to generate JSON instead of array.
 * @returns {Array|String|null}
 */
function event(packet, json) {
  if (!_check(packet)) {
    return null;
  }

  return _serialize(packet, [2, packet.resource, packet.id, packet.body], json);
}

function _check(packet) {
  return typeof packet.resource === 'string' && packet.resource.length > 2 && typeof packet.id === 'string' && packet.id.length >= 4;
}

function _serialize(packet, data, json) {
  if (packet.date) {
    data[4] = packet.date;
  }

  if (_typeof(packet.headers) === 'object') {
    data[5] = packet.headers;
  }

  if (json !== false) {
    try {
      return JSON.stringify(data);
    } catch (e) {
      return null;
    }
  }

  return data;
}

function parse(packet) {
  if (typeof packet === 'string') {
    try {
      packet = JSON.parse(packet);
    } catch (e) {
      return null;
    }
  }

  if (!Array.isArray(packet) || packet.length < 3 || typeof packet[1] !== 'string' || packet[1].length < 2) {
    return null;
  }

  var type = packet[0];
  if (type === 1) {
    return _request(packet);
  }

  if (type === 2) {
    return _event(packet);
  }

  if (type > 99) {
    return _reply(packet, type);
  }

  return null;
}

function _request(packet) {
  return {
    type: 'request',
    method: METHODS_REVERSE[packet[1].charAt(0)],
    resource: packet[1].substr(1),
    id: packet[2],
    body: packet[3],
    date: packet[4] || 0,
    headers: packet[5] || {}
  };
}

function _event(packet) {
  return {
    type: 'event',
    resource: packet[1],
    id: packet[2],
    body: packet[3],
    date: packet[4] || 0,
    headers: packet[5] || {}
  };
}

function _reply(packet, status) {
  return {
    type: 'reply',
    method: METHODS_REVERSE[packet[1].charAt(0)],
    status: status,
    resource: packet[1].substr(1),
    id: packet[2],
    body: packet[3],
    date: packet[4] || 0,
    headers: packet[5] || {}
  };
}

exports.request = request;
exports.reply = reply;
exports.event = event;
exports.parse = parse;