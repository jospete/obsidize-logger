import { EventEmitter } from './event-emitter';

describe('EventEmitter', () => {
	it('should be created', () => {
		expect(new EventEmitter()).toBeTruthy();
	});
});
