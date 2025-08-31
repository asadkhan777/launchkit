import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { PrismaClient } from '@prisma/client';

/**
 * Health check status response
 */
interface HealthStatus {
  status: 'ok' | 'error';
  timestamp: string;
  checks?: Record<string, 'ok' | 'error'>;
  error?: string;
}

/**
 * Register health check endpoints with the Fastify instance.
 * 
 * @param fastify - The Fastify instance
 * @param prisma - The Prisma client for database health checks
 */
export function registerHealthChecks(fastify: FastifyInstance, prisma: PrismaClient): void {
  // Liveness probe - simple check that the server is running
  fastify.get('/livez', async (_request: FastifyRequest, reply: FastifyReply) => {
    const response: HealthStatus = {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
    
    return reply.status(200).send(response);
  });

  // Readiness probe - check if the service is ready to handle requests
  fastify.get('/readyz', async (_request: FastifyRequest, reply: FastifyReply) => {
    const checks: Record<string, 'ok' | 'error'> = {};
    let overallStatus: 'ok' | 'error' = 'ok';
    let errorMessage: string | undefined;

    // Check database connectivity
    try {
      await prisma.$queryRaw`SELECT 1`;
      checks.database = 'ok';
    } catch (error) {
      checks.database = 'error';
      overallStatus = 'error';
      errorMessage = error instanceof Error ? error.message : 'Database connection failed';
    }

    const response: HealthStatus = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      checks,
    };

    if (errorMessage) {
      response.error = errorMessage;
    }

    const statusCode = overallStatus === 'ok' ? 200 : 503;
    return reply.status(statusCode).send(response);
  });

  // Health endpoint (alias for readiness for backward compatibility)
  fastify.get('/healthz', async (request: FastifyRequest, reply: FastifyReply) => {
    // Delegate to readiness check
    return fastify.inject({
      method: 'GET',
      url: '/readyz',
    }).then((response) => {
      return reply.status(response.statusCode).send(response.json());
    });
  });
}
