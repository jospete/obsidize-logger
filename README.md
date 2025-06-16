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

// prints "[Main] test!"
logger.debug('test!');
```

Explicit configuration (equivalent of the starter example):

```typescript
import { LogEventTransport, consoleOutput } from '@obsidize/logger';

const transport = new LogEventTransport({
  outputs: [
    consoleOutput({
      serializerConfig: {
        includeTimestamp: false,
        includeLevel: false,
        includeParams: false,
      }
    })
  ]
});

const logger = transport.getLogger('Main');

// prints "[Main] test!"
logger.debug('test!');
```

Advanced configuration example:

```typescript
// logger.ts
import { LogEventTransport, LogLevel, consoleOutput, serializerOutput } from '@obsidize/logger';
import { libraryTransport } from './path/to/my/custom/library';

const isProdBuild = /* load flag from somewhere */ false;

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
        includeTimestamp: true, // default
        includeLevel: true, // default
        includeTag: true, // default
        includeParams: true, // default
      }
    }),
    // Serialize events as line strings
    serializerOutput({
      serializerConfig: { /* optionally customize how lines are serialized */ },
      onNextLine: (str) => {
        /* write the line to storage like a file stream, or send it to a remote server */
      }
    }),
  ]
});

export function getLogger(tag: string) {
  return transport.getLogger(tag);
}

// ... in some other file ...

import { LogLevel } from '@obsidize/logger';
import { getLogger } from './path/to/logger.ts';

const logger = getLogger('SomeModuleName');

// prints "2025-06-13T02:52:45.416Z [INFO] [SomeModuleName] initialized!"
logger.info('initialized!');

logger.setCustomFilter((ev) => ev.level >= LogLevel.WARN);

// does nothing because the custom filter suppresses info logs (INFO < WARN)
logger.info('test!');

logger.disable();

// does nothing because the logger is disabled
logger.error('error!');
```

Serializer customization:

```typescript
import { LogEventSerializer, LogLevel } from '@obsidize/logger';

// The constructor config object here equates to the `serializerConfig` option in the previous examples.
// All of these options can be customized as needed to fine-tune event serialization.
// Below is the default config values for all serialziers.
const defaultSerializer = new LogEventSerializer({
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
    timestamp: function (value: any): string {
      return new Date(value).toJSON();
    },
    level: function (value: any, serializer: LogEventSerializer): string {
      const levelName = serializer.config.levelNameMap[value] || `L-${value}`;
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
});

// Note: when a custom format is supplied, the `include***` flags will be ignored.
const serializerWithCustomFormat = new LogEventSerializer({
  // custom formatter should have each property wrapped in curly "{}" braces if you want it to be included
  format: '{timestamp} | {level} | {tag} | {message} | {params}',
  // e.g. with params and level excluded:
  // format: '{timestamp} | {tag} | {message}',
});
```

For more info / examples:

- [API docs](https://jospete.github.io/obsidize-logger/)
- [Unit Tests](https://github.com/jospete/obsidize-logger/tree/main/src)
