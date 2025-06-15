import { LogEvent } from '../core/log-event';
import { LogEventTransport } from '../core/log-event-transport';
import { LogLevel } from '../core/log-level';
import { interceptorOutput } from './interceptor-output';

describe('interceptorOutput', () => {
	it('should forward the event to the given interceptor', () => {
		const spy = jest.fn();
		const t = new LogEventTransport();
		const output = interceptorOutput(t);
		t.events.addListener(spy);
		const e = new LogEvent(LogLevel.WARN, 'test', 'message');
		output(e);
		expect(spy).toHaveBeenCalled();
	});
});
