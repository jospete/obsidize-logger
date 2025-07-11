/**
 * Common cross-section between the `window.console` global
 * and `Logger` instances of this library.
 */
export interface ConsoleLike {
	verbose?(message: string, ...params: any[]): void;
	trace(message: string, ...params: any[]): void;
	debug(message: string, ...params: any[]): void;
	log(message: string, ...params: any[]): void;
	info(message: string, ...params: any[]): void;
	warn(message: string, ...params: any[]): void;
	error(message: string, ...params: any[]): void;
	fatal?(message: string, ...params: any[]): void;
}

/**
 * General shape of events produced by this library.
 */
export interface LogEventLike {
	readonly level: number;
	readonly tag: string;
	readonly message: string;
	readonly params: any[] | undefined;
	readonly timestamp: number;
}

/**
 * Function that handles incoming log events
 */
export type LogEventDelegate = (ev: LogEventLike) => void;

/**
 * Function type that should return true when an event is considered "valid"
 */
export type LogEventFilterPredicate = (ev: LogEventLike) => boolean;

/**
 * Function that handles registration or deregistration of a log event listener function.
 */
export type LogEventListenerDelegate = (listener: LogEventDelegate) => void;

/**
 * Communication interface between `Logger` -> `LogEventTransport`
 */
export interface LogEventInterceptor {
	/**
	 * Alternate of `interceptEvent` that can be passed by value
	 * without losing the `this` context of the interceptor.
	 */
	readonly forwardRef: LogEventDelegate;
	/**
	 * Notifies this instance of a new event to consume.
	 */
	interceptEvent(ev: LogEventLike): void;
	/**
	 * Requests a new event instance from this interceptor.
	 *
	 * For the sake of consistency between loggers, it should be
	 * left up to the interceptor to generate event instances.
	 */
	createEvent(level: number, tag: string, message: string, params?: any[], timestamp?: number): LogEventLike;
}

/**
 * Simplified interface for transport implementation.
 */
export interface LogEventEmitterLike {
	addListener(listener: LogEventDelegate): void;
	removeListener(listener: LogEventDelegate): void;
}

/**
 * Generic wrapper for any object instance that contains an event emitter for log events
 */
export interface LogEventEmitterSource {
	readonly events: LogEventEmitterLike;
}

/**
 * Callback that consumes events produced by loggers.
 */
export type LogEventConsumer = LogEventDelegate;

/**
 * Communication interface that allows for more advanced event routing.
 */
export type LogEventProducer = LogEventEmitterSource | LogEventListenerDelegate;

/**
 * Utiliy wrapper for configuration flexibility
 */
export type Maybe<T> = T | null | undefined | false;
