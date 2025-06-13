import { LogEventOutlet } from '../core/log-event-transport';
import type { LogEventInterceptor } from '../core/types';

export function interceptorOutlet(interceptor: LogEventInterceptor): LogEventOutlet {
	return (ev) => interceptor.interceptEvent(ev);
}
