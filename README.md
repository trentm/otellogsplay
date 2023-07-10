/me playing with OTel logging

Currently this is a proof-of-concept for an OTel Logs SDK appender for
[Bunyan](https://github.com/trentm/node-bunyan).

# Usage

```sh
npm install
node bunyan-otel.js
```

This creates a Bunyan logger with an "OTelBunyanAppender" stream. The OTel Logs
SDK is setup to emit records to the console. Any Bunyan logger methods are
emitted to the stdout (the default) and through the Logs SDK.

The [Bunyan appender is here](lib/OTelBunyanAppender.js).


# Open Questions and TODOs

- See "TODO"s in "lib/OTelBunyanAppender.js"
- See "Open questions" in "lib/OTelBunyanAppender.js"
- Call these "appenders" or Logger-specific naming (e.g. a "stream" for bunyan)?
- What package name?
- Where would these live? In opentelemetry-js-contrib/plugins/node?
  In opentelemetry-js-contrib/packages?
  In opentelemetry-js-contrib/experimental/packages?
- How, if at all, to interact with
  https://github.com/open-telemetry/opentelemetry-js-contrib/tree/main/plugins/node/opentelemetry-instrumentation-bunyan/


# TODO later

```js
// TODO: test with *only* the otel appender.
// var log = bunyan.createLogger({
//   name: 'myapp',
//   streams: [
//     {
//       type: 'raw',
//       stream: new OTelBunyanAppender()
//     }
//   ]
// });

// log.info({time: 'foo'}, 'hi');  // Testing edge case with a given 'time' field.
```
