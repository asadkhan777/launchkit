import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createServer, startServer, stopServer } from '../src/server.js';
import { FastifyInstance } from 'fastify';

describe('Server', () => {
  let server: FastifyInstance;

  afterEach(async () => {
    if (server) {
      await stopServer(server);
    }
  });

  describe('createServer', () => {
    it('should create a Fastify server instance', async () => {
      server = await createServer({ logger: false });
      expect(server).toBeDefined();
      expect(typeof server.listen).toBe('function');
    });

    it('should register health check endpoint', async () => {
      server = await createServer({ logger: false });
      
      const response = await server.inject({
        method: 'GET',
        url: '/healthz'
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body).toEqual({ status: 'ok' });
    });
  });

  describe('startServer', () => {
    it('should start server on specified port', async () => {
      const port = 3002; // Use different port to avoid conflicts
      server = await startServer({ port, logger: false });
      
      expect(server).toBeDefined();
      
      // Test that server is actually listening
      const response = await server.inject({
        method: 'GET',
        url: '/healthz'
      });
      
      expect(response.statusCode).toBe(200);
    });
  });

  describe('stopServer', () => {
    it('should stop the server gracefully', async () => {
      server = await createServer({ logger: false });
      await server.listen({ port: 3003, host: '127.0.0.1' });
      
      // Server should be running
      const response = await server.inject({
        method: 'GET',
        url: '/healthz'
      });
      expect(response.statusCode).toBe(200);
      
      // Stop server
      await stopServer(server);
      
      // After stopping, the server should be closed
      expect(server.server.listening).toBe(false);
    });
  });
});
