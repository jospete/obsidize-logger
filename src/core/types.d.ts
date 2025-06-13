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
	interceptEvent(ev: LogEventLike): void;
	createEvent(level: number, context: string, message: string, params?: any[], timestamp?: number): LogEventLike;
}
