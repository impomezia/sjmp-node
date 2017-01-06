# Simple JSON Message Protocol (SJMP) #

**Attention it is a working draft specification and compatibility can be broken at any time.**

Very simple JSON messages protocol. All packets are serialized in array.
Designed for request/reply and publish/subscribe patterns.

## Request/Reply

### Request structure

* **[0]** `{Number}`        Packet type, always `1`
* **[1]** `{String}`        Method and resource name.
* **[2]** `{String}`        Unique message ID.
* **[3]** `{*}`             Payload.
* **[4]** `{Number|String}` Optional date or ETag.
* **[5]** `{Object}`        Optional headers.

Method shortcuts:

```js
const METHODS_REVERSE = {
  '<': 'get',
  '?': 'search',
  '+': 'post',
  '=': 'put',
  '-': 'delete',
  '&': 'sub',
  '~': 'unsub'
};
```

Example: `"<account"` equal get account.  


### Reply structure

* **[0]** `{Number}`        Reply status, correspond with HTTP status codes.
* **[1]** `{String}`        Method and resource name, equal with request.
* **[2]** `{String}`        Unique message ID, equal with request.
* **[3]** `{*}`             Payload.
* **[4]** `{Number|String}` Optional date or ETag.
* **[5]** `{Object}`        Optional headers.

## Publish/Subscribe
### Event structure

* **[0]** `{Number}`        Packet type, always `2`.
* **[1]** `{String}`        Event type and resource name.
* **[2]** `{String}`        Unique message ID.
* **[3]** `{*}`             Payload.
* **[4]** `{Number|String}` Optional date or ETag.
* **[5]** `{Object}`        Optional headers.

Event types

* `=` **modified** - Notification of change a resource, usually after **put** request.
* `+` **added** - Notification of add a resource, usually after **post** request.
* `-` **deleted** - Notification of delete a resource, usually after **delete** request.

## Usage ##

```js
const sjmp = require('sjmp');

console.log(sjmp.request({
  method: 'post',
  resource: 'some/resource',
  date: 1395591341000,
  id: 'iddqd',
  body: "request body"
}));
// [1,"+some/resource","iddqd","request body",1395591341000]
```