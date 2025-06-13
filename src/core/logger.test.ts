import { LogEventTransport } from './log-event-transport';
import { Logger } from './logger';

describe('Logger', () => {
	it('should be created', () => {
		expect(new Logger('test', new LogEventTransport())).toBeTruthy();
	});
});
