import { LogEventGuard } from './log-event-guard';

describe('LogEventGuard', () => {
	it('should be created', () => {
		expect(new LogEventGuard()).toBeTruthy();
	});

	describe('enable', () => {
		it('allows all truthy events to pass through', () => {
			const g = new LogEventGuard();
			g.enable();
			expect(g.test({} as any)).toBe(true);
		});
	});

	describe('disable', () => {
		it('blocks all events', () => {
			const g = new LogEventGuard();
			g.disable();
			expect(g.test({} as any)).toBe(false);
		});
	});

	describe('setEnabled', () => {
		it('calls enable when set to true', () => {
			const g = new LogEventGuard();
			const spy = jest.spyOn(g, 'enable');
			g.setEnabled(true);
			expect(spy).toHaveBeenCalledTimes(1);
			g.setEnabled(false);
			expect(spy).toHaveBeenCalledTimes(1);
		});
	});

	describe('setEnabled', () => {
		it('calls disable when set to false', () => {
			const g = new LogEventGuard();
			const spy = jest.spyOn(g, 'disable');
			g.setEnabled(false);
			expect(spy).toHaveBeenCalledTimes(1);
			g.setEnabled(true);
			expect(spy).toHaveBeenCalledTimes(1);
		});
	});

	describe('setCustomFilter', () => {
		it('overwrites the test predicate', () => {
			const g = new LogEventGuard();
			const predicate = jest.fn();
			g.setCustomFilter(predicate);
			expect(g.test).toBe(predicate);
		});
	});
});
