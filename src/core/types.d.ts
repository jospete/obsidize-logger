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
 * Communication interface between `Logger` -> `LogEventTransport`
 */
export interface LogEventInterceptor {
	/**
	 * Alternate of `interceptEvent` that can be passed by value
	 * without losing the `this` context of the interceptor.
	 */
	forwardRef(ev: LogEventLike): void;
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
 * Communication interface that allows for more advanced event routing.
 */
export interface LogEventProducer {
	addInterceptor(interceptor: LogEventInterceptor): void;
	removeInterceptor(interceptor: LogEventInterceptor): void;
}

/**
 * Callback that consumes events produced by loggers.
 */
export type LogEventConsumer = (ev: LogEventLike) => void;

/**
 * Utiliy wrapper for configuration flexibility
 */
export type Maybe<T> = T | null | undefined | false;
