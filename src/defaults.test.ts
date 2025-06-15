import { Logger } from './core/logger';
import { getDefaultTransport, log } from './defaults';

describe('defaults', () => {
	describe('log', () => {
		it('generates a logger instance using the default transport', () => {
			const logger = log('Test');
			expect(logger instanceof Logger).toBe(true);
			expect(logger.interceptor).toBe(getDefaultTransport());
		});
	});
});
