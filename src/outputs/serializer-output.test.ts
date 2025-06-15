import { LogEventTransport } from '../core/log-event-transport';
import { LogLevel } from '../core/log-level';
import { serializerOutput } from './serializer-output';

const fixedDateTimestamp = 1749783165416;
const fixedDateISO = '2025-06-13T02:52:45.416Z';

describe('serializerOutput', () => {
	it('should call the onNextLine callback with a serialized version of the event', () => {
		const spy = jest.fn();
		const t = new LogEventTransport({
			outputs: [serializerOutput({ onNextLine: spy })],
		});
		const l = t.getLogger('test');
		l.emit(LogLevel.DEBUG, 'message', [true], fixedDateTimestamp);
		expect(spy).toHaveBeenCalledWith(`${fixedDateISO} [DEBUG] [test] message :: true\n`);
	});
	it('should allow explicit empty string seperators', () => {
		const spy = jest.fn();
		const t = new LogEventTransport({
			outputs: [serializerOutput({ onNextLine: spy, seperator: '' })],
		});
		const l = t.getLogger('test');
		l.emit(LogLevel.DEBUG, 'message', [true], fixedDateTimestamp);
		expect(spy).toHaveBeenCalledWith(`${fixedDateISO} [DEBUG] [test] message :: true`);
	});
});
