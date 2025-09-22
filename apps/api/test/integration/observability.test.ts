import { describe, it, expect, afterAll } from 'vitest';
import {
  startTelemetry,
  shutdownTelemetry,
  isTelemetryActive,
} from '../../src/observability';

describe('Observability', () => {
  describe('Telemetry Initialization', () => {
    afterAll(async () => {
      // Clean up any telemetry state
      await shutdownTelemetry();
    });

    it('should initialize telemetry without throwing', () => {
      expect(() => startTelemetry()).not.toThrow();
    });

    it('should track telemetry activation status', () => {
      startTelemetry();
      expect(isTelemetryActive()).toBe(true);
    });

    it('should handle multiple initialization calls gracefully', () => {
      startTelemetry();
      expect(() => startTelemetry()).not.toThrow();
      expect(isTelemetryActive()).toBe(true);
    });

    it('should shutdown telemetry gracefully', async () => {
      startTelemetry();
      expect(isTelemetryActive()).toBe(true);

      await shutdownTelemetry();
      expect(isTelemetryActive()).toBe(false);
    });
  });

  describe('Error Tracking Integration', () => {
    it('should initialize without Sentry DSN configured', async () => {
      // Test that error tracking initializes gracefully without DSN
  const { initializeSentry } = await import('../../src/error-tracking');
      expect(() => initializeSentry()).not.toThrow();
    });

    it('should provide error capture functions', async () => {
      const { captureException, captureMessage } = await import(
        '../../src/error-tracking'
      );

      // These should not throw even without Sentry configured
      expect(() => captureException(new Error('Test error'))).not.toThrow();
      expect(() => captureMessage('Test message')).not.toThrow();
    });
  });
});
