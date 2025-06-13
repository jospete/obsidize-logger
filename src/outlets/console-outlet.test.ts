import { LogEvent } from '../core/log-event';
import { LogLevel } from '../core/log-level';
import type { ConsoleLike } from '../core/types';
import { consoleOutlet } from './console-outlet';

function getMockConsole() {
	const mockConsole: ConsoleLike = {
		trace: jest.fn(),
		debug: jest.fn(),
		log: jest.fn(),
		info: jest.fn(),
		warn: jest.fn(),
		error: jest.fn(),
	};
	return mockConsole;
}

describe('consoleOutlet', () => {
	it('should create a handler that logs to a console-like target', () => {
		const outlet = consoleOutlet();
		expect(typeof outlet).toBe('function');
	});
	it('should properly handle events with no params', () => {
		const outlet = consoleOutlet();
		const e = new LogEvent(LogLevel.DEBUG, 'test', 'message');
		expect(() => outlet(e)).not.toThrow();
	});
	it('should call console error when the level is error', () => {
		const mockConsole = getMockConsole();
		const outlet = consoleOutlet({ target: mockConsole });
		const e = new LogEvent(LogLevel.ERROR, 'test', 'message');
		outlet(e);
		expect(mockConsole.error).toHaveBeenCalled();
	});
	it('should call console warn when the level is warn', () => {
		const mockConsole = getMockConsole();
		const outlet = consoleOutlet({ target: mockConsole });
		const e = new LogEvent(LogLevel.WARN, 'test', 'message');
		outlet(e);
		expect(mockConsole.warn).toHaveBeenCalled();
	});
});
