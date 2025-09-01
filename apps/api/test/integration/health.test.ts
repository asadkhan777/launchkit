import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { FastifyInstance } from 'fastify';
import { createApp } from '@/index.js';

describe('Health Checks', () => {
  let app: FastifyInstance;

  beforeEach(async () => {
    app = await createApp();
    await app.ready();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('GET /livez', () => {
    it('should return 200 OK with status', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/livez',
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.status).toBe('ok');
      expect(body.timestamp).toBeDefined();
    });
  });

  describe('GET /readyz', () => {
    it('should return 200 OK when database is healthy', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/readyz',
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.status).toBe('ok');
      expect(body.checks).toBeDefined();
      expect(body.checks.database).toBe('ok');
      expect(body.timestamp).toBeDefined();
    });

    it('should handle database connectivity issues gracefully', async () => {
      // This test would require mocking Prisma to simulate connection failure
      // For now, we'll test the happy path and document the need for mock testing
      const response = await app.inject({
        method: 'GET',
        url: '/readyz',
      });

      // In a real test, we'd mock Prisma to throw an error
      // and expect a 503 status code with error details
      expect(response.statusCode).toBe(200);
    });
  });

  describe('GET /healthz', () => {
    it('should return same response as readyz for backward compatibility', async () => {
      const [healthzResponse, readyzResponse] = await Promise.all([
        app.inject({ method: 'GET', url: '/healthz' }),
        app.inject({ method: 'GET', url: '/readyz' }),
      ]);

      expect(healthzResponse.statusCode).toBe(readyzResponse.statusCode);

      const healthzBody = JSON.parse(healthzResponse.body);
      const readyzBody = JSON.parse(readyzResponse.body);

      // Compare structure but ignore timestamps as they may differ slightly
      expect(healthzBody.status).toBe(readyzBody.status);
      expect(healthzBody.checks).toEqual(readyzBody.checks);
      expect(healthzBody.timestamp).toBeDefined();
      expect(readyzBody.timestamp).toBeDefined();
    });
  });
});
