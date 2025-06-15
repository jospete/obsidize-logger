import type { ConsoleLike } from './types';

export function getMockConsole() {
	const mockConsole: ConsoleLike = {
		verbose: jest.fn(),
		trace: jest.fn(),
		debug: jest.fn(),
		log: jest.fn(),
		info: jest.fn(),
		warn: jest.fn(),
		error: jest.fn(),
		fatal: jest.fn(),
	};
	return mockConsole;
}
