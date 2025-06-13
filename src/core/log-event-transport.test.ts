import { LogEvent } from './log-event';
import { LogEventTransport } from './log-event-transport';
import { LogLevel } from './log-level';

describe('LogEventTransport', () => {
	it('should be created', () => {
		expect(new LogEventTransport()).toBeTruthy();
	});

	describe('configure', () => {
		it('ignores non-function values for outlets', () => {
			const t = new LogEventTransport();
			t.configure({ outlets: [null, false, () => {}] });
			expect(t.events.listenerCount).toBe(1);
		});

		it('accepts a custom filter function', () => {
			const t = new LogEventTransport();
			const spy = jest.fn();
			t.configure({ filter: spy });
			expect(t.test).toBe(spy);
		});
	});

	describe('interceptEvent', () => {
		it('emits events that pass the guard predicate', () => {
			const outletSpy = jest.fn();
			const t = new LogEventTransport({
				filter: (ev) => ev.level >= LogLevel.INFO,
				outlets: [outletSpy],
			});
			t.interceptEvent(new LogEvent(LogLevel.INFO, 'test', 'message'));
			expect(outletSpy).toHaveBeenCalledTimes(1);
		});
		it('suppresses events that do not pass the guard predicate', () => {
			const outletSpy = jest.fn();
			const t = new LogEventTransport({
				filter: (ev) => ev.level >= LogLevel.INFO,
				outlets: [outletSpy],
			});
			t.interceptEvent(new LogEvent(LogLevel.DEBUG, 'test', 'message'));
			expect(outletSpy).not.toHaveBeenCalled();
		});
	});
});
