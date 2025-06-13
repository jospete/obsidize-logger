import { LogEventSerializer } from './log-event-serializer';

describe('LogEventSerializer', () => {
	it('should be created', () => {
		expect(new LogEventSerializer()).toBeTruthy();
	});
});
