export type EventEmitterDelegate<T> = (value: T) => any;

export class EventEmitter<T> {
	private mListeners: EventEmitterDelegate<T>[] = [];

	public get listenerCount(): number {
		return this.mListeners.length;
	}

	public emit<R extends T = T>(value: R): void {
		for (const listener of this.mListeners) listener(value);
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
