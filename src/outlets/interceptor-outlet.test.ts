import { LogEvent } from '../core/log-event';
import { LogEventTransport } from '../core/log-event-transport';
import { LogLevel } from '../core/log-level';
import { interceptorOutlet } from './interceptor-outlet';

describe('interceptorOutlet', () => {
	it('should forward the event to the given interceptor', () => {
		const t = new LogEventTransport();
		const spy = jest.spyOn(t, 'interceptEvent');
		const outlet = interceptorOutlet(t);
		const e = new LogEvent(LogLevel.WARN, 'test', 'message');
		outlet(e);
		expect(spy).toHaveBeenCalled();
	});
});
