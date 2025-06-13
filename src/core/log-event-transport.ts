import { EventEmitter, EventEmitterDelegate } from './event-emitter';
import { LogEvent } from './log-event';
import { LogEventFilterPredicate, LogEventGuard } from './log-event-guard';
import { Logger } from './logger';
import type { LogEventInterceptor, LogEventLike } from './types';

/**
 * Callback that consumes events produced by loggers.
 */
export type LogEventOutlet = EventEmitterDelegate<LogEventLike>;

/**
 * Optional flavor of an outlet to give transport configuration more flexibility.
 */
export type MaybeLogEventOutlet = LogEventOutlet | null | undefined | false;

export interface LogEventTransportConfig {
	/**
	 * A list of outlet configurations to trigger side-effects
	 * when the transport receives an event.
	 */
	outlets: MaybeLogEventOutlet[];
	/**
	 * A custom filter function to suppress log events
	 * if the filter's conditions are not met.
	 */
	filter: LogEventFilterPredicate;
}

/**
 * Route controller for events.
 *
 * When a logger referencing this transport (via `getLogger(tag)`) produces an event,
 * the event will be verified against the transport's filter; if the event is
 * deemed valid, it will be passed on to all assigned outlets, as well as
 * any listeners registered to the transport's event emitter.
 */
export class LogEventTransport extends LogEventGuard implements LogEventInterceptor {
	public readonly events = new EventEmitter<LogEventLike>();

	constructor(options: Partial<LogEventTransportConfig> = {}) {
		super();
		this.configure(options);
	}

	public getLogger(tag: string): Logger {
		return new Logger(tag, this);
	}

	public interceptEvent(ev: LogEventLike): void {
		if (this.test(ev)) this.events.emit(ev);
	}

	public createEvent(level: number, tag: string, message: string, params?: any[], timestamp?: number): LogEventLike {
		return new LogEvent(level, tag, message, params, timestamp);
	}

	public configure(options: Partial<LogEventTransportConfig>): void {
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
