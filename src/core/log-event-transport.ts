import { EventEmitter, EventEmitterDelegate } from './event-emitter';
import { LogEvent } from './log-event';
import { LogEventFilterPredicate, LogEventGuard } from './log-event-guard';
import { Logger } from './logger';
import type { LogEventInterceptor, LogEventLike } from './types';

export type LogEventOutlet = EventEmitterDelegate<LogEventLike>;
export type MaybeLogEventOutlet = LogEventOutlet | null | undefined | false;

export interface LogEventTransportOptions {
	outlets: MaybeLogEventOutlet[];
	filter: LogEventFilterPredicate;
}

export class LogEventTransport extends LogEventGuard implements LogEventInterceptor {
	public readonly events = new EventEmitter<LogEventLike>();

	constructor(options: Partial<LogEventTransportOptions> = {}) {
		super();
		this.configure(options);
	}

	public getLogger(name: string): Logger {
		return new Logger(name, this);
	}

	public interceptEvent(ev: LogEventLike): void {
		if (this.test(ev)) this.events.emit(ev);
	}

	public createEvent(
		level: number,
		context: string,
		message: string,
		params?: any[],
		timestamp?: number
	): LogEventLike {
		return new LogEvent(level, context, message, params, timestamp);
	}

	public configure(options: Partial<LogEventTransportOptions>): void {
		this.events.removeAllListeners();

		if (Array.isArray(options.outlets)) {
			for (const outlet of options.outlets) {
				if (typeof outlet === 'function') {
					this.events.addListener(outlet);
				}
			}
		}

		if (typeof options.filter === 'function') {
			this.setCustomFilter(options.filter);
		}
	}
}
