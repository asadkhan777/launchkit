import { beforeAll, afterAll, describe, it, expect } from 'vitest';
import type { FastifyInstance } from 'fastify';
import { createApp } from '../../src/index';

let app: FastifyInstance;

beforeAll(async () => {
  app = await createApp();
  await app.ready();
});

afterAll(async () => {
  await app.close();
});

describe('Cache headers integration', () => {
  it('should return Cache-Control and X-Cache headers for /courses', async () => {
    const ownerId = 'test-owner';
    // First request: cache miss
    const res1 = await app.inject({
      method: 'GET',
      url: `/courses?ownerId=${ownerId}`,
    });
    expect(res1.statusCode).toBe(200);
    expect(res1.headers['x-cache']).toBe('MISS');
    expect(res1.headers['cache-control']).toMatch(/public/);

    // Second request: cache hit
    const res2 = await app.inject({
      method: 'GET',
      url: `/courses?ownerId=${ownerId}`,
    });
    expect(res2.statusCode).toBe(200);
    expect(res2.headers['x-cache']).toBe('HIT');
    expect(res2.headers['cache-control']).toMatch(/public/);
  });
});
