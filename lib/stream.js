"use strict";

const levelsMapping = {
	10: 'trace',
	20: 'debug',
	30: 'info',
	40: 'warn',
	50: 'error',
	60: 'fatal'
}

const ignoreProps = [
	'level', 'name', 'time', 'timestamp', 'msg', 'v', 'hostname'
]

class LogDnaStream {

	constructor(logger, options) {
		this.logger = logger
		this.options = options || {}
	}

	write(record) {
		this.logger.log(this.formatMessage(record), {
			app: record.name,
			level: levelsMapping[record.level],
			context: this.formatContext(record)
		})
	}

	formatContext(record) {
		let context = {}
		for (let name in record) {
			if (ignoreProps.indexOf(name) < 0) {
				context[name] = record[name]
			}
		}
		if (this.options.formatContext) {
			this.options.formatContext(context, record)
		}
		return context
	}

	formatMessage(record) {
		let message = record.msg
		if (this.options.formatMessage) {
			message = this.options.formatMessage(message, record)
		}
		return message
	}

}

exports.LogDnaStream = LogDnaStream
