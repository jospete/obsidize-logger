import { LogEventTransport } from '../core/log-event-transport';
import { LogLevel } from '../core/log-level';
import { serializerOutlet } from './serializer-outlet';

const fixedDateTimestamp = 1749783165416;
const fixedDateISO = '2025-06-13T02:52:45.416Z';

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
