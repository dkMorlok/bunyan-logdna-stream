"use strict";

const expect = require('chai').expect
const should = require('chai').should()
const helpers = require('./helpers')

describe('LogDnaStream', () => {
	let client, logger, stream

	beforeEach(() => {
		client = helpers.createClient()
		stream = helpers.createStream(client)
		logger = helpers.createLogger('test-logger', stream, 'debug')
	})

	it('should log a message from logger#debug(message)', () => {
		logger.debug('test')
		expect(client.log.callCount).to.equal(1)
		expect(client.logMessage).to.equal('test')
		expect(client.logOptions.level).to.equal('debug')
	})

	it('should log a message from logger#info(message)', () => {
		logger.info('test')
		expect(client.log.callCount).to.equal(1)
		expect(client.logMessage).to.equal('test')
		expect(client.logOptions.level).to.equal('info')
	})

	it('should log a message from logger#warn(message)', () => {
		logger.warn('test')
		expect(client.log.callCount).to.equal(1)
		expect(client.logMessage).to.equal('test')
		expect(client.logOptions.level).to.equal('warn')
	})

	it('should log a message from logger#error(message)', () => {
		logger.error('test')
		expect(client.log.callCount).to.equal(1)
		expect(client.logMessage).to.equal('test')
		expect(client.logOptions.level).to.equal('error')
	})

	it('should log a message from logger#error(extra, message)', () => {
		logger.warn({foo: 'foo', bar: 'bar'}, 'Hello')
		expect(client.log.callCount).to.equal(1)
		expect(client.logOptions.context).to.have.property('foo')
		expect(client.logOptions.context).to.have.property('bar')
	})

	it('should log a error from logger#error(error)', () => {
		let error = new Error('message'); error.code = 400; error.signal = 400
		logger.error(error)
		expect(client.logOptions.context).to.have.property('err')
		expect(client.logOptions.context.err).to.have.property('code')
		expect(client.logOptions.context.err).to.have.property('signal')
	})

	it('should append child logger name to context', () => {
		logger.child({type:'server'}).debug('test')
		expect(client.logOptions.context.type).to.equal('server')
	})

	it('should always append pid to context', () => {
		logger.debug('test')
		expect(client.logOptions.context).to.have.property('pid')
	})

	it('should set app name by logger name', () => {
		logger.debug('test')
		expect(client.logOptions.app).to.equal('test-logger')
	})

	describe('when using custom context formatter', () => {
		beforeEach(() => {
			stream.options.formatContext = (context, record) => {
				context.user = 'user123'
			}
		})

		it('should log message with extra context properties', () => {
			logger.debug('test')
			expect(client.logOptions.context).to.have.property('user')
			expect(client.logOptions.context.user).to.equal('user123')
		})
	})

	describe('when using custom message formatter', () => {
		beforeEach(() => {
			stream.options.formatMessage = (message, record) => {
				return message + ` (${record.type})`
			}
		})

		it('should log formatted message ', () => {
			logger.child({type:'server'}).debug('test')
			expect(client.logMessage).to.equal('test (server)')
		})
	})
})