import type { LogEventLike } from "./types";

export class LogEvent implements LogEventLike {
  constructor(
    public level: number,
    public tag: string,
    public message: string,
    public params: any[] | undefined = undefined,
    public timestamp: number = Date.now()
  ) {}
}
