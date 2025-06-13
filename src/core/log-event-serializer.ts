import { LogLevel } from './log-level';
import type { LogEventLike } from './types';

export interface LogEventSerializerLike {
	serialize(ev: LogEventLike): string;
}

export interface LogEventSerializerOptions {
	levelNameMap: Record<number, string>;
	paramsSeperator: string;
	maxParamStringLength: number;
	levelNameFixedLength: number;
	includeTimestamp: boolean;
	includeLevel: boolean;
	includeTag: boolean;
	includeParams: boolean;
}

function reverseKV(obj: Record<any, any>) {
	const result: any = {};
	for (const [k, v] of Object.entries(obj)) {
		result[v] = k;
	}
	return result;
}

const defaultOptions: LogEventSerializerOptions = {
	levelNameMap: reverseKV(LogLevel),
	paramsSeperator: ' :: ',
	maxParamStringLength: 250,
	levelNameFixedLength: 8,
	includeTimestamp: true,
	includeLevel: true,
	includeTag: true,
	includeParams: true,
};

export class LogEventSerializer implements LogEventSerializerLike {
	private options: LogEventSerializerOptions;

	constructor(options: Partial<LogEventSerializerOptions> = {}) {
		this.options = { ...defaultOptions, ...options };
	}

	public serialize(ev: LogEventLike): string {
		if (!ev) {
			return '';
		}

		const { tag, level, message, timestamp } = ev;
		const timestampJson = new Date(timestamp).toJSON();
		const levelName = this.options.levelNameMap![level] || String(level);
		let result = message;

		if (this.options.includeTag) {
			result = `[${tag}] ${result}`;
		}

		if (this.options.includeLevel) {
			const levelNamePadded = levelName.padEnd(this.options.levelNameFixedLength, ' ');
			result = `[${levelNamePadded}] ${result}`;
		}

		if (this.options.includeTimestamp) {
			result = `${timestampJson} ${result}`;
		}

		if (this.options.includeParams) {
			result += this.serializeParamList(ev.params);
		}

		return result;
	}

	public serializeParamList(params: any[] | undefined): string {
		if (!Array.isArray(params) || params.length <= 0) {
			return '';
		}

		let result = '';

		for (const p of params) {
			result += this.options.paramsSeperator + this.serializeParam(p);
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

		const targetLength = this.options.maxParamStringLength;
		const ext = '...';

		if (s.length + ext.length > targetLength) {
			return s.substring(0, targetLength - ext.length) + ext;
		}

		return s;
	}
}
