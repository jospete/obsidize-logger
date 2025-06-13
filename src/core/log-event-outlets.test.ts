import { LogEvent } from './log-event';
import { consoleOutlet, interceptorOutlet, serializerOutlet } from './log-event-outlets';
import { LogEventTransport } from './log-event-transport';
import { LogLevel } from './log-level';
import type { ConsoleLike } from './types';

const fixedDateTimestamp = 1749783165416;
const fixedDateISO = '2025-06-13T02:52:45.416Z';

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

describe('LogEventOutlet', () => {
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

	describe('serializerOutlet', () => {
		it('should call the onNextLine callback with a serialized version of the event', () => {
			const spy = jest.fn();
			const t = new LogEventTransport({
				outlets: [serializerOutlet({ onNextLine: spy })],
			});
			const l = t.getLogger('test');
			l.emit(LogLevel.DEBUG, 'message', [true], fixedDateTimestamp);
			expect(spy).toHaveBeenCalledWith(`${fixedDateISO} [DEBUG] [test] message :: true\n`);
		});
	});
});
