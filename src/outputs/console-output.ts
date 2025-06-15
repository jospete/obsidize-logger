import { LogEventSerializer, LogEventSerializerDelegateConfig } from '../core/log-event-serializer';
import { LogLevel } from '../core/log-level';
import type { ConsoleLike, LogEventConsumer } from '../core/types';

function invokeConsole(target: ConsoleLike, level: number, message: string, params: any[]): void {
	if (level >= LogLevel.ERROR) {
		target.error(message, ...params);
		return;
	}

	if (level >= LogLevel.WARN) {
		target.warn(message, ...params);
		return;
	}

	target.log(message, ...params);
}

/**
 * Delegate to invoke some method a console-like target.
 * Acts as a proxy for the global `window.console` object (or any other provided target).
 */
export type ConsoleOutputInvoker = (target: ConsoleLike, level: number, message: string, params: any[]) => void;

export interface ConsoleOutputConfig extends LogEventSerializerDelegateConfig {
	/**
	 * The target to send serialized log events to
	 * @default cosnole
	 */
	target?: ConsoleLike;
	/**
	 * The invocation handler for the provided console-like target.
	 *
	 * The default handler will narrow levels down to `LOG`, `WARN` and `ERROR`
	 * to maximize compatibility with different runtime environments.
	 */
	invoke?: ConsoleOutputInvoker;
}

/**
 * Send events to a target console-like instance.
 * @param config - optional customization config
 * @returns an outlet function that can be invoked by a transport
 */
export function consoleOutput(config: ConsoleOutputConfig = {}): LogEventConsumer {
	const target = config.target || console;
	const invoke = config.invoke || invokeConsole;
	const serialize = LogEventSerializer.parseDelegateFrom(config);
	return (ev) => {
		const { level, params } = ev;
		const p = Array.isArray(params) ? params : [];
		const message = serialize(ev);
		invoke(target, level, message, p);
	};
}
