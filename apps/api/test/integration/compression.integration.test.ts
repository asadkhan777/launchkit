import { beforeAll, afterAll, describe, it, expect } from 'vitest';
import type { FastifyInstance } from 'fastify';
import { createApp } from '@/index.js';

let app: FastifyInstance;

beforeAll(async () => {
  app = await createApp();
  await app.ready();
});

afterAll(async () => {
  await app.close();
});

describe('Compression integration', () => {
  it('should compress responses with gzip when Accept-Encoding includes gzip', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/courses?ownerId=test-owner',
      headers: { 'accept-encoding': 'gzip' },
    });

    expect(res.statusCode).toBe(200);
    expect(res.headers['content-encoding']).toBe('gzip');
  });

  it('should compress responses with brotli when Accept-Encoding includes br', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/courses?ownerId=test-owner',
      headers: { 'accept-encoding': 'br' },
    });

    expect(res.statusCode).toBe(200);
    expect(res.headers['content-encoding']).toBe('br');
  });
});
