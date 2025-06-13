import { ConsoleLike, LogEventTransport, consoleOutlet } from './index';

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

describe('@obsidize/logger', () => {
	it('can run the readme examples', () => {
		const mockConsole = getMockConsole();
		const transport = new LogEventTransport({
			outlets: [
				consoleOutlet({
					target: mockConsole,
					serializerConfig: {
						includeTimestamp: false,
						includeParams: false,
					},
				}),
			],
		});

		function getLogger(name: string) {
			return transport.getLogger(name);
		}

		const logger = getLogger('SomeModuleName');
		logger.debug('initialized!');
		expect(mockConsole.log).toHaveBeenCalled();
	});
});
