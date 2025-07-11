import { LogEventTransport } from './core/log-event-transport';
import { Logger } from './core/logger';
import { consoleOutput } from './outputs/console-output';

let defaultTransport: LogEventTransport | undefined;

/**
 * Get the default transport instance.
 *
 * The default instance will be created with a single
 * consumer to send log events out to the global console object.
 */
export function getDefaultTransport(): LogEventTransport {
	return (
		defaultTransport ||
		(defaultTransport = new LogEventTransport({
			outputs: [
				consoleOutput({
					serializerConfig: {
						includeTimestamp: false,
						includeLevel: false,
						includeParams: false,
					},
				}),
			],
		}))
	);
}

/**
 * Create a logger with the given tag.
 * This logger will use the default transport.
 *
 * Useful for quickly generating tagged logs,
 * especially if you do not need any event output customization.
 */
export function log(tag: string): Logger {
	return getDefaultTransport().getLogger(tag);
}
