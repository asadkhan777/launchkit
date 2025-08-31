import * as Sentry from '@sentry/node';

/**
 * Initialize Sentry error tracking for the API service.
 * This should be called early in the application startup.
 */
export function initializeSentry(): void {
  const dsn = process.env.SENTRY_DSN;
  
  if (!dsn) {
    console.warn('SENTRY_DSN not configured, error tracking disabled');
    return;
  }

  try {
    Sentry.init({
      dsn,
      tracesSampleRate: parseFloat(process.env.SENTRY_TRACES_SAMPLE_RATE || '0.1'),
      environment: process.env.NODE_ENV || 'development',
      // Don't capture console.log statements
      integrations: [
        Sentry.consoleIntegration({
          levels: ['error'],
        }),
      ],
      beforeSend(event) {
        // Filter out sensitive data from error reports
        if (event.request?.data && typeof event.request.data === 'object') {
          // Remove potential PII from request bodies
          const sanitized = { ...event.request.data } as Record<string, any>;
          // Remove common sensitive fields
          delete sanitized.password;
          delete sanitized.token;
          delete sanitized.authorization;
          delete sanitized.apiKey;
          event.request.data = sanitized;
        }
        return event;
      },
    });
    
    console.log('Sentry error tracking initialized');
  } catch (error) {
    console.error('Failed to initialize Sentry:', error);
    // Don't throw - error tracking failure shouldn't crash the service
  }
}

/**
 * Capture an exception with Sentry.
 * Use this for manual error reporting.
 */
export function captureException(error: Error, context?: Record<string, any>): void {
  if (context) {
    Sentry.withScope((scope) => {
      Object.entries(context).forEach(([key, value]) => {
        scope.setTag(key, value);
      });
      Sentry.captureException(error);
    });
  } else {
    Sentry.captureException(error);
  }
}

/**
 * Capture a message with Sentry.
 * Use this for non-error events that should be tracked.
 */
export function captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info'): void {
  Sentry.captureMessage(message, level);
}

/**
 * Close Sentry client and flush any pending events.
 * Call this during application shutdown.
 */
export async function closeSentry(): Promise<void> {
  try {
    await Sentry.close(2000); // 2 second timeout
    console.log('Sentry closed successfully');
  } catch (error) {
    console.error('Error closing Sentry:', error);
  }
}
