# @obsidize/logger

Yet another javascript logging library, created to minimize friction with other frameworks / libraries / platforms.

## Features

- Zero dependencies
- Tiny (relative to some of the other popular logging frameworks)
- Runtime-configurable
- Composable
- Built-in filtering
- Works anywhere - Browsers, NodeJS, Cordova, Capacitor, React Native, anything that can run javascript

## Usage

Simple starter:

```typescript
import { log } from '@obsidize/logger';

const logger = log('Main');

logger.debug('test!'); // prints "2025-06-13T02:52:45.416Z [DEBUG] [Main] test!" to the console
```

Explicit configuration equivalent of the starter:

```typescript
import { LogEventTransport, consoleOutput } from '@obsidize/logger';

const transport = new LogEventTransport({
	outputs: [consoleOutput()]
});

const logger = transport.getLogger('Main');

logger.debug('test!'); // prints "2025-06-13T02:52:45.416Z [DEBUG] [Main] test!" to the console
```

Advanced configuration example:

```typescript
// logger.ts
import { LogEventTransport, LogLevel, consoleOutput, serializerOutput } from '@obsidize/logger';
import { libraryTransport } from './path/to/my/custom/library';

const isProdBuild = /* get flag from somewhere */ false;

const transport = new LogEventTransport({
  // ignore debug and trace logs, and ignore logs with the tag "test"
  filter: (ev) => {
    return ev.level >= LogLevel.INFO && ev.tag !== 'test';
  },
  inputs: [
	// Intercept events from a LogEventTransport instance defined elsewhere
	libraryTransport,
  ],
  outputs: [
	// Custom event output listener
	(ev) => {
		// Do something fancy with the event.
		// These outputs are processed in the order they are defined, so
		// if you want to mutate the event before it is used, do that here.
	},
	// removes console output from prod builds
    !isProdBuild && consoleOutput({
	  // customize how logs are serialized specifically for console output
      serializerConfig: {
        includeTimestamp: false,
        includeParams: false,
      }
    }),
	// Serialize events as line strings
    serializerOutput({
      onNextLine: (str) => {
        /* write the line to storage or send it to a remote server */
      }
    }),
  ]
});

export function getLogger(tag: string) {
  return transport.getLogger(tag);
}

// ... in some other file ...

import { LogLevel } from '@obsidize/logger';
import { getLogger } from './path/to/logger';

const logger = getLogger('SomeModuleName');

logger.info('initialized!'); // prints "2025-06-13T02:52:45.416Z [INFO] [SomeModuleName] initialized!"

logger.setCustomFilter((ev) => ev.level >= LogLevel.WARN);
logger.info('test!'); // does nothing because the custom filter suppresses debug logs

logger.disable(); // disable all events produced by this logger
logger.error('error!'); // does nothing because the logger is disabled
```

For more info / examples:

- [API docs](https://jospete.github.io/obsidize-logger/)
- [Unit Tests](https://github.com/jospete/obsidize-logger/tree/main/src)
