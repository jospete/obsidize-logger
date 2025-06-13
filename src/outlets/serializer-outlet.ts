import { LogEventSerializer, LogEventSerializerLike, LogEventSerializerOptions } from '../core/log-event-serializer';
import { LogEventOutlet } from '../core/log-event-transport';

export interface SerializerOutletConfig {
	serializer?: LogEventSerializerLike;
	serializerOptions?: LogEventSerializerOptions;
	seperator?: string;
	onNextLine: (line: string) => void;
}

export function serializerOutlet(config: SerializerOutletConfig): LogEventOutlet {
	const seperator = config.seperator || '\n';
	const serializer = config.serializer || new LogEventSerializer(config.serializerOptions);
	const callback = config.onNextLine;
	return (ev) => {
		callback(serializer.serialize(ev) + seperator);
	};
}
