import { LogEvent } from './log-event';
import { LogEventSerializer } from './log-event-serializer';
import { LogLevel } from './log-level';

const fixedDateTimestamp = 1749783165416;
const fixedDateISO = '2025-06-13T02:52:45.416Z';

describe('LogEventSerializer', () => {
	it('should be created', () => {
		expect(new LogEventSerializer()).toBeTruthy();
	});

	it('should not blow up when a parameter cannot be stringified', () => {
		const obj: any = { test: true };
		obj.cycle = obj;
		const s = new LogEventSerializer();
		const l = new LogEvent(LogLevel.DEBUG, 'test', 'message', [true, obj, 1], fixedDateTimestamp);
		const v = s.serialize(l);
		expect(v).toBe(`${fixedDateISO} [DEBUG] [test] message :: true :: [object Object] :: 1`);
	});

	describe('extend', () => {
		it('should inherit the properties of the extended serializer', () => {
			const s = new LogEventSerializer({ includeParams: false });
			const s2 = s.extend();
			expect(s.config.includeParams).toBe(s2.config.includeParams);
		});
		it('should override properties of the extended logger with any custom values given', () => {
			const s = new LogEventSerializer({ includeParams: false });
			const s2 = s.extend({ includeParams: true });
			expect(s.config.includeParams).not.toBe(s2.config.includeParams);
		});
	});

	describe('serialize', () => {
		it('should leave unknown property matchers as-is', () => {
			const s = new LogEventSerializer({ format: '{message} {potato} [{level}]' });
			const l = new LogEvent(LogLevel.DEBUG, 'test', 'a bunch of potatoes');
			expect(s.serialize(l)).toBe('a bunch of potatoes {potato} [DEBUG]');
		});
		it('should respect custom level name lengths', () => {
			const s = new LogEventSerializer({ format: '[{level}] {message}', levelNameFixedLength: 8 });
			const l = new LogEvent(LogLevel.DEBUG, 'test', 'a bunch of potatoes');
			expect(s.serialize(l)).toBe('[DEBUG   ] a bunch of potatoes');
		});
		it('should respect custom property formatters', () => {
			const s = new LogEventSerializer({
				format: '[{level}] {message}',
				levelNameFixedLength: 8,
				propertyFormatters: {
					message: (value: string) => value.padStart(10, 'A'),
				},
			});
			const l = new LogEvent(LogLevel.FATAL, 'test', 'H!');
			expect(s.serialize(l)).toBe('[FATAL   ] AAAAAAAAH!');
		});
	});

	describe('config', () => {
		it('should include all event data by default', () => {
			const s = new LogEventSerializer();
			const l = new LogEvent(LogLevel.DEBUG, 'test', 'message', [true], fixedDateTimestamp);
			const v = s.serialize(l);
			expect(v).toBe(`${fixedDateISO} [DEBUG] [test] message :: true`);
		});
		it('should return an empty string if the event is falsy', () => {
			const s = new LogEventSerializer();
			expect(s.serialize(null as any)).toBe('');
			expect(s.serialize('' as any)).toBe('');
			expect(s.serialize(0 as any)).toBe('');
			expect(s.serialize(undefined as any)).toBe('');
		});
		it('should use the literal level value when it does not exist in the level name map', () => {
			const s = new LogEventSerializer();
			const l = new LogEvent(69, 'test', 'message', [true], fixedDateTimestamp);
			const v = s.serialize(l);
			expect(v).toBe(`${fixedDateISO} [69] [test] message :: true`);
		});
		it('should exclude the tag when configured to do so', () => {
			const s = new LogEventSerializer({ includeTag: false });
			const l = new LogEvent(LogLevel.DEBUG, 'test', 'message', [true], fixedDateTimestamp);
			const v = s.serialize(l);
			expect(v).toBe(`${fixedDateISO} [DEBUG] message :: true`);
		});
		it('should exclude the level when configured to do so', () => {
			const s = new LogEventSerializer({ includeLevel: false });
			const l = new LogEvent(LogLevel.DEBUG, 'test', 'message', [true], fixedDateTimestamp);
			const v = s.serialize(l);
			expect(v).toBe(`${fixedDateISO} [test] message :: true`);
		});
		it('should exclude the timestamp when configured to do so', () => {
			const s = new LogEventSerializer({ includeTimestamp: false });
			const l = new LogEvent(LogLevel.DEBUG, 'test', 'message', [], fixedDateTimestamp);
			const v = s.serialize(l);
			expect(v).toBe(`[DEBUG] [test] message`);
		});
		it('should exclude params when configured to do so', () => {
			const s = new LogEventSerializer({ includeParams: false });
			const l = new LogEvent(LogLevel.DEBUG, 'test', 'message', [true], fixedDateTimestamp);
			const v = s.serialize(l);
			expect(v).toBe(`${fixedDateISO} [DEBUG] [test] message`);
		});
		it('should truncate parameters to the given length', () => {
			const s = new LogEventSerializer({ maxParamStringLength: 20 });
			const l = new LogEvent(
				LogLevel.DEBUG,
				'test',
				'message',
				[{ thisIsMoreThanTwentyCharacters: true }],
				fixedDateTimestamp
			);
			const v = s.serialize(l);
			expect(v).toBe(`${fixedDateISO} [DEBUG] [test] message :: {\"thisIsMoreThanT...`);
		});
	});
});
