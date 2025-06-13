import { LogEvent } from './log-event';

describe('LogEvent', () => {
	it('should be created', () => {
		expect(new LogEvent(0, 'test', 'message')).toBeTruthy();
	});
});
