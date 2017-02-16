# bunyan-logdna-stream

[![Build Status](https://travis-ci.org/dkMorlok/bunyan-logdna-stream.svg?branch=master)](https://travis-ci.org/dkMorlok/bunyan-logdna-stream)
[![Coverage Status](https://coveralls.io/repos/github/dkMorlok/bunyan-logdna-stream/badge.svg?branch=master)](https://coveralls.io/github/dkMorlok/bunyan-logdna-stream?branch=master)

Write log to LogDNA by using Bunyan with optional context and message formatting.


## Install

```
$ npm install bunyan-logdna-stream --save
```


## Usage

```js
const logdna = require('logdna')
const bunyan = require('bunyan')
const bunyanLogdna = require('bunyan-logdna-stream')

// create logdna client
const client = logdna.createLogger(KEY, OPTIONS)
const stream = new bunyanLogdna.LogDnaStream(client)

// create bunyan logger
const logger = bunyan.createLogger({
  name: 'logger',
  streams: [{
    level: 'debug',
    type: 'raw',
    stream: stream
  }]
})
```

When you creating `LogDnaStream` you can pass options to customize `message`.

```js
// setup your stream
const stream = new bunyanLogdna.LogDnaStream(client, {
    formatMessage: (message, record) {
        return `${message} (type=${record.type})`
    }
})

// log message
logger.child({type: 'server'}).debug('server is running')

// logdna message: "server is running (type=server)"
```

Or customize `context` (additional log data shown in logdna after expand log message). By default all your
extra data will be in context including `hostname` and `pid`.

```js
// setup your stream
const stream = new bunyanLogdna.LogDnaStream(client, {
    formatContext: (context, record) {
        context.user = 'user123'
    }
})

// context:
{
    "hostname": "...",
    "pid": 1234,
    "user": "user123" // extra context info
}
```


## Contributing

When submitting your pull-request try to follow those guides:
* https://egghead.io/courses/how-to-contribute-to-an-open-source-project-on-github
* https://medium.com/@vadimdemedes/making-your-first-contribution-de6576ddb190


## Licence

MIT © Dusan Kmet
