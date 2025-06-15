import { getMockConsole } from './core/console.mock';
import { LogEventTransport, LogLevel, consoleOutput, serializerOutput } from './index';

describe('@obsidize/logger', () => {
	it('can run the readme examples', () => {
		const mockConsole = getMockConsole();
		const isProdBuild = /* get flag from somewhere */ false;
		const libraryTransport = new LogEventTransport();

		const transport = new LogEventTransport({
			// ignore debug and trace logs, and ignore logs with the tag "test"
			filter: (ev) => {
				return ev.level >= LogLevel.INFO && ev.tag !== 'test';
			},
			inputs: [
				// Intercept events from a LogEventTransport instance defined elsewhere
				libraryTransport,
			],
			outputs: [
				// Custom event output listener
				(ev) => {
					// Do something fancy with the event.
					// These outputs are processed in the order they are defined, so
					// if you want to mutate the event before it is used, do that here.
				},
				// removes console output from prod builds
				!isProdBuild && consoleOutput({
					target: mockConsole,
					// customize how logs are serialized specifically for console output
					serializerConfig: {
						includeTimestamp: false,
						includeParams: false,
					},
				}),
				// Serialize events as line strings
				serializerOutput({
					onNextLine: (str) => {
						/* write the line to storage or send it to a remote server */
					}
				}),
			]
		});

		function getLogger(name: string) {
			return transport.getLogger(name);
		}

		const logger = getLogger('SomeModuleName');
		logger.info('initialized!');
		expect(mockConsole.log).toHaveBeenCalledTimes(1);

		logger.setCustomFilter((ev) => ev.level >= LogLevel.WARN);
		logger.info('test!'); // does nothing because the custom filter suppresses debug logs
		expect(mockConsole.log).toHaveBeenCalledTimes(1);

		logger.setCustomFilter((ev) => ev.level >= LogLevel.TRACE);
		logger.info('test!');
		expect(mockConsole.log).toHaveBeenCalledTimes(2);

		logger.disable(); // disable all events produced by this logger
		logger.error('error!'); // does nothing because the logger is disabled
		expect(mockConsole.log).toHaveBeenCalledTimes(2);
	});
});
