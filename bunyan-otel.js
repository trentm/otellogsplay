// OTel Tracing setup
const otel = require('@opentelemetry/api')
const { NodeTracerProvider } = require('@opentelemetry/sdk-trace-node')
const { SimpleSpanProcessor, ConsoleSpanExporter } = require('@opentelemetry/sdk-trace-base')
const provider = new NodeTracerProvider()
provider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()))
provider.register()

// OTel Logging SDK setup.
const { logs: otelLogs } = require('@opentelemetry/api-logs');
const {
  LoggerProvider,
  ConsoleLogRecordExporter,
  SimpleLogRecordProcessor,
} = require('@opentelemetry/sdk-logs');
const loggerProvider = new LoggerProvider();
loggerProvider.addLogRecordProcessor(
  new SimpleLogRecordProcessor(new ConsoleLogRecordExporter())
);
otelLogs.setGlobalLoggerProvider(loggerProvider);

const bunyan = require('bunyan')
const { OTelBunyanAppender } = require('./lib/OTelBunyanAppender')

var log = bunyan.createLogger({name: 'myapp'});
log.addStream({
  type: 'raw',
  stream: new OTelBunyanAppender()
})

log.info('hi');

const tracer = otel.trace.getTracer('example')
tracer.startActiveSpan('manual-span', span => {
  log.info('in a span');
  span.end()
})
