/**
 * Callback that accepts a single value which was
 * emitted from the `EventEmitter` instance.
 */
export type EventEmitterDelegate<T> = (value: T) => any;

/**
 * Lightweight event broadcaster.
 *
 * While this class' primary use in the library is for
 * sending log events to registered listeners, it
 * is defined to be generic, and can technically
 * emit any type of value.
 *
 * Feel free to use this for non-logging things since
 * javascript has no built-in observer pattern...
 */
export class EventEmitter<T> {
	private mListeners: EventEmitterDelegate<T>[] = [];

	public get listenerCount(): number {
		return this.mListeners.length;
	}

	public emit<R extends T = T>(value: R): this {
		for (const listener of this.mListeners) listener(value);
		return this;
	}

	public hasListener<R extends T = T>(listener: EventEmitterDelegate<R>): boolean {
		return this.mListeners.indexOf(listener as any) >= 0;
	}

	public addListener<R extends T = T>(listener: EventEmitterDelegate<R>): this {
		if (typeof listener === 'function' && !this.hasListener(listener)) this.mListeners.push(listener as any);

		return this;
	}

	public removeListener<R extends T = T>(listener: EventEmitterDelegate<R>): this {
		const index = this.mListeners.indexOf(listener as any);
		if (index >= 0) this.mListeners.splice(index, 1);
		return this;
	}

	public removeAllListeners(): this {
		while (this.mListeners.length > 0) this.mListeners.pop();
		return this;
	}
}
