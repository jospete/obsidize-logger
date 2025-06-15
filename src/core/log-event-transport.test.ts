import { LogEvent } from './log-event';
import { LogEventTransport } from './log-event-transport';
import { LogLevel } from './log-level';

describe('LogEventTransport', () => {
	it('should be created', () => {
		expect(new LogEventTransport()).toBeTruthy();
	});

	describe('configure', () => {
		it('ignores non-function values for outputs', () => {
			const t = new LogEventTransport();
			t.configure({ outputs: [null, false, () => { }] });
			expect(t.events.listenerCount).toBe(1);
		});

		it('accepts a custom filter function', () => {
			const t = new LogEventTransport();
			const spy = jest.fn();
			t.configure({ filter: spy });
			expect(t.test).toBe(spy);
		});

		it('accepts an array of inputs which are event producers', () => {
			const t1 = new LogEventTransport();
			const t2 = new LogEventTransport();
			const t3 = new LogEventTransport({ inputs: [t1, null, t2, {} as any] });
			expect(t1.events.hasListener(t3.forwardRef)).toBe(true);
			expect(t2.events.hasListener(t3.forwardRef)).toBe(true);
		});
	});

	describe('interceptEvent', () => {
		it('emits events that pass the guard predicate', () => {
			const outputSpy = jest.fn();
			const t = new LogEventTransport({
				filter: (ev) => ev.level >= LogLevel.INFO,
				outputs: [outputSpy],
			});
			t.interceptEvent(new LogEvent(LogLevel.INFO, 'test', 'message'));
			expect(outputSpy).toHaveBeenCalledTimes(1);
		});
		it('suppresses events that do not pass the guard predicate', () => {
			const outputSpy = jest.fn();
			const t = new LogEventTransport({
				filter: (ev) => ev.level >= LogLevel.INFO,
				outputs: [outputSpy],
			});
			t.interceptEvent(new LogEvent(LogLevel.DEBUG, 'test', 'message'));
			expect(outputSpy).not.toHaveBeenCalled();
		});
	});

	describe('removeInterceptor', () => {
		it('removes the given interceptor from the target as a consumer', () => {
			const t1 = new LogEventTransport();
			const t2 = new LogEventTransport({ inputs: [t1] });
			expect(t1.events.hasListener(t2.forwardRef)).toBe(true);
			t1.removeInterceptor(t2);
			expect(t1.events.hasListener(t2.forwardRef)).toBe(false);
		});
	});
});
