import { LogEventSerializer, LogEventSerializerDelegateConfig } from '../core/log-event-serializer';
import { LogEventOutlet } from '../core/log-event-transport';

export interface SerializerOutletConfig extends LogEventSerializerDelegateConfig {
	/**
	 * A seperator string to append to serialized events
	 * @default '\n'
	 */
	seperator?: string;
	/**
	 * Callback to be invoked when a new serialized event is received
	 * @param line - the serialized version of the event
	 */
	onNextLine: (line: string) => void;
}

/**
 * Transform wrapper that passes on serialized events to a given callback
 * @param config - options for serialization and message passing
 * @returns an outlet function that can be invoked by a transport
 */
export function serializerOutlet(config: SerializerOutletConfig): LogEventOutlet {
	const seperator = typeof config.seperator === 'string' ? config.seperator : '\n';
	const serialize = LogEventSerializer.parseDelegateFrom(config);
	const callback = config.onNextLine;
	return (ev) => {
		callback(serialize(ev) + seperator);
	};
}
