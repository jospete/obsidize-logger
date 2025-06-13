import { EventEmitter } from './event-emitter';

describe('EventEmitter', () => {
	it('should be created', () => {
		expect(new EventEmitter()).toBeTruthy();
	});

	describe('addListener', () => {
		it('should add the given function', () => {
			const listener = jest.fn();
			const ee = new EventEmitter();
			ee.addListener(listener);
			expect(ee.hasListener(listener)).toBe(true);
		});
		it('should not add the given function more than once', () => {
			const listener = jest.fn();
			const ee = new EventEmitter();
			ee.addListener(listener);
			ee.addListener(listener);
			ee.emit('test');
			expect(listener).toHaveBeenCalledTimes(1);
		});
	});

	describe('removeListener', () => {
		it('should remove the given function', () => {
			const listener = jest.fn();
			const ee = new EventEmitter();
			ee.addListener(listener);
			expect(ee.hasListener(listener)).toBe(true);
			ee.removeListener(listener);
			expect(ee.hasListener(listener)).toBe(false);
			ee.removeListener(listener);
			expect(ee.hasListener(listener)).toBe(false);
		});
	});

	describe('removeAllListeners', () => {
		it('should remove all registered functions', () => {
			const listeners = [jest.fn(), jest.fn(), jest.fn()];
			const ee = new EventEmitter();
			for (const l of listeners) ee.addListener(l);
			for (const l of listeners) expect(ee.hasListener(l)).toBe(true);
			expect(ee.listenerCount).toBe(listeners.length);
			ee.emit('test');
			for (const l of listeners) expect(l).toHaveBeenCalledTimes(1);
			ee.removeAllListeners();
			for (const l of listeners) expect(ee.hasListener(l)).toBe(false);
			ee.emit('test');
			for (const l of listeners) expect(l).toHaveBeenCalledTimes(1);
		});
	});
});
