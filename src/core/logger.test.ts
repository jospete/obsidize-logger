import { getMockConsole } from './console.mock';
import { LogEventTransport } from './log-event-transport';
import { LogLevel } from './log-level';
import { Logger } from './logger';

describe('Logger', () => {
	it('should be created', () => {
		expect(new Logger('test', new LogEventTransport())).toBeTruthy();
	});

	it('should implement the ConsoleLike interface', () => {
		const l = new Logger('test', new LogEventTransport());
		const c = getMockConsole();

		for (const k of Object.keys(c)) {
			expect(() => (l as any)[k]('test')).not.toThrow();
		}
	});

	describe('emit', () => {
		it('should emit to the assigned interceptor when it passes the filter guard', () => {
			const t = new LogEventTransport();
			const l = new Logger('test', t);
			const spy = jest.spyOn(t, 'interceptEvent');
			l.debug('test');
			expect(spy).toHaveBeenCalled();
		});

		it('should not emit to the assigned interceptor when it does not pass the filter guard', () => {
			const t = new LogEventTransport();
			const l = new Logger('test', t);
			const spy = jest.spyOn(t, 'interceptEvent');
			l.setCustomFilter((ev) => ev.level >= LogLevel.INFO);
			l.debug('test');
			expect(spy).not.toHaveBeenCalled();
		});
	});
});
