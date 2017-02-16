const sinon = require('sinon')
const bunyan = require('bunyan')
const LogDnaStream = require('../index').LogDnaStream

function createLogger(name, stream, level) {
	return bunyan.createLogger({
		name: name,
		streams: [{
			stream: stream,
			type: 'raw',
			level: level
		}]
	})
}

function createStream(client) {
	return new LogDnaStream(client)
}

function createClient() {
	let client = {
		log(message, options) {
			this.logMessage = message
			this.logOptions = options
		}
	}
	sinon.spy(client, 'log')
	return client
}

exports.createLogger = createLogger
exports.createStream = createStream
exports.createClient = createClient
