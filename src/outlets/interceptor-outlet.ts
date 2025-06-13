import { LogEventOutlet } from '../core/log-event-transport';
import type { LogEventInterceptor } from '../core/types';

/**
 * Send events another interceptor-like object (e.g. another transport).
 * @param interceptor - the interceptor to forward events to
 * @returns an outlet function that can be invoked by a transport
 */
export function interceptorOutlet(interceptor: LogEventInterceptor): LogEventOutlet {
	return (ev) => interceptor.interceptEvent(ev);
}
