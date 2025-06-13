import type { LogEventLike } from './types';

/**
 * Basic constructible event used by the rest of this library.
 */
export class LogEvent implements LogEventLike {
	constructor(
		public level: number,
		public tag: string,
		public message: string,
		public params: any[] | undefined = undefined,
		public timestamp: number = Date.now()
	) {}
}
