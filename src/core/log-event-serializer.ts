import { LogLevel } from './log-level';
import type { LogEventLike } from './types';

/**
 * Common API for serializing log events
 */
export interface LogEventSerializerLike {
	serialize(ev: LogEventLike): string;
}

export type LogEventSerializerPropertyFormatter = (value: any, serializer: LogEventSerializer) => string;

export interface LogEventSerializerConfig {
	/**
	 * Object where keys are integer levels and values are a string which is the name of the level.
	 * @default inverse of the `LogLevel` object literal
	 */
	levelNameMap: Record<number, string>;
	/**
	 * Seperator string that will be used as a prefix for each log parameter.
	 * @default ' :: '
	 */
	paramsSeperator: string;
	/**
	 * The maximum allowed length for a serialized parameter before it is truncated.
	 * @default 250
	 */
	maxParamStringLength: number;
	/**
	 * The minimum required length for level names.
	 * This can help with alignment issues in large volume log output.
	 * @default 0
	 */
	levelNameFixedLength: number;
	/**
	 * Custom format for the serialized output.
	 * When this is set, all `include***` flags will be ignored.
	 * @default '{timestamp} [{level}] [{tag}] {message}{params}'
	 */
	format?: string;
	/**
	 * Transformers for each individual log event property.
	 */
	propertyFormatters: Record<string, LogEventSerializerPropertyFormatter>;
	/**
	 * Includes the timestamp in the serialized output
	 * @default true
	 */
	includeTimestamp: boolean;
	/**
	 * Includes the level in the serialized output
	 * @default true
	 */
	includeLevel: boolean;
	/**
	 * Includes the tag in the serialized output
	 * @default true
	 */
	includeTag: boolean;
	/**
	 * Includes all params in the serialized output
	 * @default true
	 */
	includeParams: boolean;
}

function identity<T>(value: T): T {
	return value;
}

function deepMergeConfig(a: LogEventSerializerConfig, b: Partial<LogEventSerializerConfig>): LogEventSerializerConfig {
	const levelNameMap = { ...a.levelNameMap, ...(b.levelNameMap || {}) };
	const propertyFormatters = { ...a.propertyFormatters, ...(b.propertyFormatters || {}) };
	return { ...a, ...b, levelNameMap, propertyFormatters };
}

const defaultOptions: LogEventSerializerConfig = {
	levelNameMap: {
		[LogLevel.VERBOSE]: 'VERBOSE',
		[LogLevel.TRACE]: 'TRACE',
		[LogLevel.DEBUG]: 'DEBUG',
		[LogLevel.INFO]: 'INFO',
		[LogLevel.WARN]: 'WARN',
		[LogLevel.ERROR]: 'ERROR',
		[LogLevel.FATAL]: 'FATAL',
	},
	paramsSeperator: ' :: ',
	maxParamStringLength: 250,
	levelNameFixedLength: 0,
	propertyFormatters: {
		tag: identity,
		message: identity,
		timestamp: function (value: any): string {
			return new Date(value).toJSON();
		},
		level: function (value: any, serializer: LogEventSerializer): string {
			const levelName = serializer.config.levelNameMap[value] || String(value);
			return levelName.padEnd(serializer.config.levelNameFixedLength, ' ');
		},
		params: function (value: any, serializer: LogEventSerializer): string {
			return serializer.serializeParamList(value);
		},
	},
	includeTimestamp: true,
	includeLevel: true,
	includeTag: true,
	includeParams: true,
};

/**
 * Configurable transformer to convert log events into string output.
 */
export class LogEventSerializer implements LogEventSerializerLike {
	public readonly config: LogEventSerializerConfig;
	private format: string;

	constructor(config: Partial<LogEventSerializerConfig> = {}) {
		this.config = deepMergeConfig(defaultOptions, config);
		this.format = this.resolveFormatStringFromOptions();
	}

	public extend(config: Partial<LogEventSerializerConfig> = {}): LogEventSerializer {
		return new LogEventSerializer(deepMergeConfig(this.config, config));
	}

	public serialize(ev: LogEventLike): string {
		if (!ev) {
			return '';
		}

		return this.format.replace(/\{(\w+)\}/g, (match: string, key: string) => {
			const formatter = (this.config.propertyFormatters as any)[key];
			return typeof formatter === 'function' ? formatter((ev as any)[key], this) : match;
		});
	}

	public serializeParamList(params: any[] | undefined): string {
		if (!Array.isArray(params) || params.length <= 0) {
			return '';
		}

		let result = '';

		for (const p of params) {
			result += this.config.paramsSeperator + this.serializeParam(p);
		}

		return result;
	}

	public serializeParam(param: any): string {
		let s: string;

		try {
			s = JSON.stringify(param);
		} catch {
			s = param + '';
		}

		const targetLength = this.config.maxParamStringLength;
		const ext = '...';

		if (s.length + ext.length > targetLength) {
			return s.substring(0, targetLength - ext.length) + ext;
		}

		return s;
	}

	private resolveFormatStringFromOptions(): string {
		if (this.config.format) {
			return this.config.format;
		}

		let result = '{message}';

		if (this.config.includeTag) {
			result = `[{tag}] ${result}`;
		}

		if (this.config.includeLevel) {
			result = `[{level}] ${result}`;
		}

		if (this.config.includeTimestamp) {
			result = `{timestamp} ${result}`;
		}

		if (this.config.includeParams) {
			result += '{params}';
		}

		return result;
	}
}
