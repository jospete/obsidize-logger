import { getMockConsole } from '../core/console.mock';
import { LogEvent } from '../core/log-event';
import { LogLevel } from '../core/log-level';
import { consoleOutput } from './console-output';

describe('consoleOutput', () => {
	it('should create a handler that logs to a console-like target', () => {
		const output = consoleOutput();
		expect(typeof output).toBe('function');
	});
	it('should properly handle events with no params', () => {
		const output = consoleOutput();
		const e = new LogEvent(LogLevel.DEBUG, 'test', 'message');
		expect(() => output(e)).not.toThrow();
	});
	it('should call console error when the level is error', () => {
		const mockConsole = getMockConsole();
		const output = consoleOutput({ target: mockConsole });
		const e = new LogEvent(LogLevel.ERROR, 'test', 'message');
		output(e);
		expect(mockConsole.error).toHaveBeenCalled();
	});
	it('should call console warn when the level is warn', () => {
		const mockConsole = getMockConsole();
		const output = consoleOutput({ target: mockConsole });
		const e = new LogEvent(LogLevel.WARN, 'test', 'message');
		output(e);
		expect(mockConsole.warn).toHaveBeenCalled();
	});
});
