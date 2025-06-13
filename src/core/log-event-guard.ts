import type { LogEventLike } from './types';

export type LogEventFilterPredicate = (ev: LogEventLike) => boolean;

export class LogEventGuard {
	public static readonly FILTER_ACCEPT_ALL: LogEventFilterPredicate = (ev) => !!ev;
	public static readonly FILTER_BLOCK_ALL: LogEventFilterPredicate = () => false;

	public test: LogEventFilterPredicate = LogEventGuard.FILTER_ACCEPT_ALL;

	public enable(): this {
		this.test = LogEventGuard.FILTER_ACCEPT_ALL;
		return this;
	}

	public disable(): this {
		this.test = LogEventGuard.FILTER_BLOCK_ALL;
		return this;
	}

	public setCustomFilter(filter: LogEventFilterPredicate): this {
		this.test = filter;
		return this;
	}

	public setEnabled(enabled: boolean): this {
		if (enabled) {
			this.enable();
		} else {
			this.disable();
		}
		return this;
	}
}
