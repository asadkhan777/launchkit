import { NodeSDK } from '@opentelemetry/sdk-node';
import { FastifyInstrumentation } from '@opentelemetry/instrumentation-fastify';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';

let sdk: NodeSDK | undefined;

/**
 * Initialize OpenTelemetry tracing for the API service.
 * This should be called before any other imports to ensure proper instrumentation.
 */
export function startTelemetry(): void {
  if (sdk) {
    console.warn('OpenTelemetry SDK already initialized');
    return;
  }

  // Configure the OTLP exporter
  const otlpExporter = new OTLPTraceExporter({
    url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://localhost:4318/v1/traces',
  });

  // Initialize the SDK with auto-instrumentations and custom Fastify instrumentation
  sdk = new NodeSDK({
    traceExporter: otlpExporter,
    instrumentations: [
      getNodeAutoInstrumentations({
        // Disable fs instrumentation as it can be noisy
        '@opentelemetry/instrumentation-fs': {
          enabled: false,
        },
      }),
      new FastifyInstrumentation(),
    ],
  });

  try {
    sdk.start();
    console.log('OpenTelemetry started successfully');
  } catch (error) {
    console.error('Error starting OpenTelemetry:', error);
    // Don't throw - observability failure shouldn't crash the service
  }
}

/**
 * Gracefully shutdown OpenTelemetry SDK.
 * Call this during application shutdown to flush any pending traces.
 */
export async function shutdownTelemetry(): Promise<void> {
  if (sdk) {
    try {
      await sdk.shutdown();
      console.log('OpenTelemetry shutdown successfully');
    } catch (error) {
      console.error('Error shutting down OpenTelemetry:', error);
    } finally {
      sdk = undefined;
    }
  }
}

/**
 * Check if OpenTelemetry is properly initialized.
 * Useful for health checks and debugging.
 */
export function isTelemetryActive(): boolean {
  return sdk !== undefined;
}
