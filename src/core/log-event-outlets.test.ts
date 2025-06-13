import { consoleOutlet } from './log-event-outlets';

describe('LogEventOutlet', () => {
	describe('consoleOutlet', () => {
		it('should create a handler that logs to a console-like target', () => {
			const outlet = consoleOutlet();
			expect(typeof outlet).toBe('function');
		});
	});
});
