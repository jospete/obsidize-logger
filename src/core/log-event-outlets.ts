import { LogEventSerializer, LogEventSerializerLike, LogEventSerializerOptions } from './log-event-serializer';
import { LogEventOutlet } from './log-event-transport';
import { LogLevel } from './log-level';
import type { ConsoleLike, LogEventInterceptor } from './types';

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

export type ConsoleLogEventOutletInvoker = (target: ConsoleLike, level: number, message: string, params: any[]) => void;

export interface ConsoleLogEventOutletConfig {
	target?: ConsoleLike;
	serializer?: LogEventSerializerLike;
	serializerOptions?: LogEventSerializerOptions;
	invoke?: ConsoleLogEventOutletInvoker;
}

export function consoleOutlet(config: ConsoleLogEventOutletConfig = {}): LogEventOutlet {
	const target = config.target || console;
	const invoke = config.invoke || invokeConsole;
	const serializer = config.serializer || new LogEventSerializer(config.serializerOptions);
	return (ev) => {
		const { level, params } = ev;
		const p = Array.isArray(params) ? params : [];
		const message = serializer.serialize(ev);
		invoke(target, level, message, p);
	};
}

export function interceptorOutlet(interceptor: LogEventInterceptor): LogEventOutlet {
	return (ev) => interceptor.interceptEvent(ev);
}

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
