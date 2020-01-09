export class LogDnaStream {

	constructor(logger: ILogger, options: LogDnaStreamOptions)

}

export interface ILogger {
	log: (msg: string, options: any) => any
}

export interface LogDnaStreamOptions {
	formatContext?: (context: any, record: any) => void
	formatMessage?: (msg: string, record: any) => string
}
