# Simple JSON Message Protocol (SJMP) #

**Attention it is a working draft specification and compatibility can be broken at any time.**

Very simple JSON messages protocol. All packets are serialized in six element array.
Designed for request/reply and publish/subscribe patterns.

## Packet structure ##

* **[0]** Packet header.
* **[1]** Resource name.
* **[2]** Unique message ID.
* **[3]** Date.
* **[4]** Optional headers.
* **[5]** Packet body.

### Packet header ###

String, the first character determines the type of packet.

* `<` **request** - Request to a resource.
* `>` **reply** - Response to a request.
* `=` **modified** - Notification of change a resource, usually after **put** request.
* `+` **added** - Notification of add a resource, usually after **post** request.
* `-` **deleted** - Notification of delete a resource, usually after **delete** request.

##### Request `<` #####
For packets with a request type, after the type can be located a method (verb). For example `<post`. Methods similar to HTTP methods, but in lowercase.
Aliases:
* `<get` equal to `<`
* `<search` equal to `<?`
* `<post` equal to `<+`
* `<put` equal to `<=`
* `<delete` equal to `<-`

##### Reply `>` #####
For packets with a reply type, after the type can be located a status code. For example `<400`. Status code equal to HTTP status codes.
Aliases:
* `>200` equal to `>`

##### Protocol version #####
For future extensions, header can contain version. Examples: `<post/2` or `>/2`. By default version is equal to 1 and can be included in the header, but it is not necessarily. Multiple slashes allowed in header and should be ignored.

### Resource name ###

Is fully equivalent the same things in the HTTP.

### Unique message ID ###

Must be a unique string with a minimum length of 4 characters.

### Date ###

Resource date. Can be used for caching. Unix timestamp format with milliseconds. Can be zero.

### Optional headers ###

Optional headers, by default empty object.

### Packet body ###

Optional packet body, must be valid JSON.

## Usage ##

```js
var sjmp = require('sjmp');

console.log(sjmp.serialize({
  type: '<',
  method: 'post',
  resource: 'some/resource',
  date: 1395591341000,
  id: 'MessageId',
  body: "request body"
}, true));
```

```js
var sjmp = require('sjmp');

console.log(sjmp.serialize({
  type: '>',
  status: 200,
  date: 1395591341000,
  id: 'MessageId',
  body: "reply body"
}, true));
```

```js
var sjmp = require('sjmp');

console.log(sjmp.deserialize('["=", "some/resource", "MessageId", 1395591341000, {}, "resource body"]'));
```