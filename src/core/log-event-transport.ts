import { EventEmitter } from './event-emitter';
import { LogEvent } from './log-event';
import { LogEventFilterPredicate, LogEventGuard } from './log-event-guard';
import { Logger } from './logger';
import type { LogEventConsumer, LogEventInterceptor, LogEventLike, LogEventProducer, Maybe } from './types';

export interface LogEventTransportConfig {
	/**
	 * A list of sources to intercept log events from.
	 */
	inputs: Maybe<LogEventProducer>[];
	/**
	 * A list of destinations to trigger side-effects
	 * when the transport receives an event.
	 */
	outputs: Maybe<LogEventConsumer>[];
	/**
	 * Alias of `outputs`
	 * @deprecated
	 */
	outlets: Maybe<LogEventConsumer>[];
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
 * deemed valid, it will be passed on to all assigned consumers, as well as
 * any listeners registered to the transport's event emitter.
 */
export class LogEventTransport extends LogEventGuard implements LogEventProducer, LogEventInterceptor {
	public readonly events = new EventEmitter<LogEventLike>();
	public readonly forwardRef = this.interceptEvent.bind(this);

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

	public addInterceptor(interceptor: LogEventInterceptor): void {
		this.events.addListener(interceptor.forwardRef);
	}

	public removeInterceptor(interceptor: LogEventInterceptor): void {
		this.events.removeListener(interceptor.forwardRef);
	}

	public configure(config: Partial<LogEventTransportConfig>): void {
		this.events.removeAllListeners();
		const inputs = config.inputs;
		const outputs = config.outputs || config.outlets;

		if (typeof config.filter === 'function') {
			this.setCustomFilter(config.filter);
		}

		if (Array.isArray(outputs)) {
			for (const output of outputs) {
				if (typeof output === 'function') {
					this.events.addListener(output);
				}
			}
		}

		if (Array.isArray(inputs)) {
			for (const input of inputs) {
				if (typeof input === 'object' &&
					input !== null &&
					typeof input.addInterceptor === 'function') {
					input.addInterceptor(this);
				}
			}
		}
	}
}
