const levelsMapping = {
	10: 'TRACE',
	20: 'DEBUG',
	30: 'INFO',
	40: 'WARN',
	50: 'ERROR',
	60: 'FATAL'
}

const ignoreProps = [
	'level', 'name', 'time', 'timestamp', 'msg', 'v'
]

class LogDnaStream {

	constructor(logger, options = null) {
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

module.exports = LogDnaStream
