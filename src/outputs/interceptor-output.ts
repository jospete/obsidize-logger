import type { LogEventConsumer, LogEventInterceptor } from '../core/types';

/**
 * Send events another interceptor-like object (e.g. another transport).
 * @param interceptor - the interceptor to forward events to
 * @returns an outlet function that can be invoked by a transport
 */
export function interceptorOutput(interceptor: LogEventInterceptor): LogEventConsumer {
	return interceptor.forwardRef;
}

/**
 * Alias of `interceptorOutput`
 * @deprecated
 */
export const interceptorOutlet = interceptorOutput;
