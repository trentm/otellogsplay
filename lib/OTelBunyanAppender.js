const { logs: otelLogs, SeverityNumber } = require('@opentelemetry/api-logs');
const bunyan = require('bunyan')

const OTEL_SEV_NUM_FROM_BUNYAN_LEVEL = {
  [bunyan.TRACE]: SeverityNumber.TRACE,
  [bunyan.DEBUG]: SeverityNumber.DEBUG,
  [bunyan.INFO]: SeverityNumber.INFO,
  [bunyan.WARN]: SeverityNumber.WARN,
  [bunyan.ERROR]: SeverityNumber.ERROR,
  [bunyan.FATAL]: SeverityNumber.FATAL
}

class OTelBunyanAppender {
  constructor () {
    // TODO: what name and version to use here? Expose to OTelBunyanAppender with defaults?
    // TODO: also expose `LoggerOptions`? Yes, I'd think so.
    this._otelLogger = otelLogs.getLogger('example', '1.0.0')
  }
  write (rec) {
    // Convert a Bunyan log record to an OTel log record.
    //
    // Note: We drop the Bunyan 'v' field. It is meant to indicate the format
    // of the Bunyan log record. FWIW, it has always been `0`.
    //
    // Open questions:
    // - I'm not clear if these appenders should set `observedTimestamp` or if
    //   that should be left to the OTel SDK.
    //   https://opentelemetry.io/docs/specs/otel/logs/data-model/#field-observedtimestamp
    // - Mapping attributes from Bunyan to OTel/ECS?
    //      hostname -> host.name or similar?
    //      name -> service.name?
    //      pid -> ?
    // - Should we accept a context from `log.info({context: <Object>}, '...')`
    //   and pass it as the OTel log record `context` field if it looks like a
    //   `api.Context` type or, if it has a valid SpanContext on it?

    const { time, level, msg, v, ...fields } = rec
    let timestamp = undefined
    if (typeof time.getTime === 'function') {
      // TODO: Spec and Logs API types say `timestamp` is nanoseconds, but the Logs SDK takes milliseconds
      timestamp = time.getTime()
    } else {
      // TODO: Add a test case for this: `log.info({time: 'foo'}, 'hi')`
      fields.time = time // Expose non-Date "time" field on attributes.
    }
    const otelRec = {
      timestamp,
      observedTimestamp: timestamp,
      severityNumber: OTEL_SEV_NUM_FROM_BUNYAN_LEVEL[level], // XXX can it not be a known level?
      severityText: bunyan.nameFromLevel[level],
      body: msg,
      attributes: fields
    }
    this._otelLogger.emit(otelRec)
  }
}

module.exports = {
  OTelBunyanAppender
}
