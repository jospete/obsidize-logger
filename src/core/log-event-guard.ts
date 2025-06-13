import type { LogEventLike } from './types';

/**
 * Function type that should return true when an event is considered "valid"
 */
export type LogEventFilterPredicate = (ev: LogEventLike) => boolean;

/**
 * Base class for other constructs that need to filter log events.
 *
 * Sub-classes of this will use the `test` delegate to determine
 * if log events are considered valid and/or acceptable.
 */
export class LogEventGuard {
	public static readonly FILTER_ACCEPT_ALL: LogEventFilterPredicate = (ev) => !!ev;
	public static readonly FILTER_BLOCK_ALL: LogEventFilterPredicate = () => false;

	/**
	 * Predicate that will be used for log event validation.
	 */
	public test: LogEventFilterPredicate = LogEventGuard.FILTER_ACCEPT_ALL;

	/**
	 * Accept all tested events.
	 *
	 * Mutually exclusive operation to `setCustomFilter`; if a
	 * custom filter was set before calling this, it will be cleared.
	 *
	 * @returns `this` for operation chaining.
	 */
	public enable(): this {
		this.test = LogEventGuard.FILTER_ACCEPT_ALL;
		return this;
	}

	/**
	 * Reject all tested events.
	 *
	 * Mutually exclusive operation to `setCustomFilter`; if a
	 * custom filter was set before calling this, it will be cleared.
	 *
	 * @returns `this` for operation chaining.
	 */
	public disable(): this {
		this.test = LogEventGuard.FILTER_BLOCK_ALL;
		return this;
	}

	/**
	 * Applies a custom filter for log event validation.
	 *
	 * This should not be used in conjuction with enable/disable
	 * methods, as they will overwrite the given custom filter.
	 *
	 * @param filter - the custom filter to use for validation
	 * @returns `this` for operation chaining.
	 */
	public setCustomFilter(filter: LogEventFilterPredicate): this {
		this.test = filter;
		return this;
	}

	/**
	 * Convenience for setting enabled state based on a flag.
	 *
	 * Mutually exclusive operation to `setCustomFilter`; if a
	 * custom filter was set before calling this, it will be cleared.
	 *
	 * @param enabled - the filter state to use, e.g.
	 * 		`true` to accept all events, or
	 * 		`false` to reject all events.
	 * @returns `this` for operation chaining.
	 */
	public setEnabled(enabled: boolean): this {
		if (enabled) {
			this.enable();
		} else {
			this.disable();
		}
		return this;
	}
}
