import { LogEventGuard } from './log-event-guard';
import { LogLevel } from './log-level';
import type { ConsoleLike, LogEventInterceptor } from './types';

export class Logger extends LogEventGuard implements ConsoleLike {
	constructor(public tag: string, public interceptor: LogEventInterceptor) {
		super();
	}

	public verbose(message: string, ...params: any[]): void {
		this.emit(LogLevel.VERBOSE, message, params);
	}

	public trace(message: string, ...params: any[]): void {
		this.emit(LogLevel.TRACE, message, params);
	}

	public debug(message: string, ...params: any[]): void {
		this.emit(LogLevel.DEBUG, message, params);
	}

	public log(message: string, ...params: any[]): void {
		this.emit(LogLevel.DEBUG, message, params);
	}

	public info(message: string, ...params: any[]): void {
		this.emit(LogLevel.INFO, message, params);
	}

	public warn(message: string, ...params: any[]): void {
		this.emit(LogLevel.WARN, message, params);
	}

	public error(message: string, ...params: any[]): void {
		this.emit(LogLevel.ERROR, message, params);
	}

	public fatal(message: string, ...params: any[]): void {
		this.emit(LogLevel.FATAL, message, params);
	}

	public emit(level: number, message: string, params?: any[], timestamp?: number): void {
		const ev = this.interceptor.createEvent(level, this.tag, message, params, timestamp);
		if (this.test(ev)) {
			this.interceptor.interceptEvent(ev);
		}
	}
}
