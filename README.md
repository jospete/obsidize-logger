# @obsidize/logger

Yet another javascript logging library, created to minimize friction with other frameworks / libraries / platforms.

## Features

- Zero dependencies
- Tiny
- Runtime-configurable
- Composable
- Built-in filtering
- Works anywhere - Browsers, NodeJS, Cordova, Capacitor, React Native, anything that can run javascript

## Simple TypeScript Example

```typescript
// logger.ts
import { LogEventTransport, consoleOutlet } from '@obsidize/logger';

const transport = new LogEventTransport({
  outlets: [consoleOutlet()]
});

export function getLogger(name: string) {
  return transport.getLogger(name);
}

// ... in some other file ...

import { getLogger } from './path/to/logger';

const logger = getLogger('SomeModuleName');

logger.debug('initialized!'); // prints "2025-06-13T02:52:45.416Z [DEBUG   ] [SomeModuleName] initialized!"
```

## Simple JavaScript Example

Import the bundle for this library like so

```html
<html>
  <head>
    <script src="https://raw.githubusercontent.com/jospete/obsidize-logger/refs/heads/main/packed/obsidize-logger.js"></script>
  </head>
</html>
```

Then use it

```javascript
const { LogEventTransport, consoleOutlet } = window.obsidize.logger;

const transport = new LogEventTransport({
  outlets: [consoleOutlet()]
});

window.getLogger = function(name: string) {
  return transport.getLogger(name);
};

// ... in some other file ...

const logger = getLogger('SomeFileName');

logger.debug('initialized!'); // prints "2025-06-13T02:52:45.416Z [DEBUG   ] [SomeFileName] initialized!"
```

## Advanced TypeScript Example

Each point of instantiation has configuration options to adjust transport / logger behavior.

These configurations can translate directly over to JavaScript.

```typescript
import { LogEventTransport, LogLevel, consoleOutlet, serializerOutlet } from '@obsidize/logger';

const isProdBuild = /* get flag from somewhere */ false;

const transport = new LogEventTransport({
  // ignore debug and trace logs, and ignore logs with the tag "test"
  filter: (ev) => {
    return ev.level >= LogLevel.INFO && ev.tag !== 'test';
  },
  outlets: [
    !isProdBuild && consoleOutlet({
      includeLevel: true,
      includeParams: true,
    }),
    serializerOutlet({
      onNextLine: (str) => {
        /* write the line to storage or send it to a remote server */
      }
    })
  ]
});

export function getLogger(name: string) {
  return transport.getLogger(name);
}

// ... in some other file ...

import { LogLevel } from '@obsidize/logger';
import { getLogger } from './path/to/logger';

const logger = getLogger('SomeModuleName');

logger.info('initialized!'); // prints "2025-06-13T02:52:45.416Z [INFO    ] [SomeModuleName] initialized!"

logger.setCustomFilter((ev) => ev.level >= LogLevel.INFO);
logger.debug('initialized!'); // does nothing because the custom filter suppresses debug logs

logger.disable(); // disable all events produced by this logger
logger.debug('initialized!'); // does nothing because the logger is disabled
```
