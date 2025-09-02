// Import observability modules but don't initialize yet (lazy initialization)
import { startTelemetry, shutdownTelemetry } from './observability.js';
import {
  initializeSentry,
  captureException,
  closeSentry,
} from './error-tracking.js';

import fastify, {
  FastifyInstance,
  FastifyRequest,
  FastifyReply,
} from 'fastify';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import compress from '@fastify/compress';
import NodeCache from 'node-cache';
import {
  createCourse,
  listCourses,
  CourseCreateSchema,
  type CourseCreate,
  getPrismaClient,
} from '@launchkit-ai/sdk';
import { z } from 'zod';
import { registerHealthChecks } from './health.js';
import registerImportRoute from './routes/import.js';
import registerGenerateRoute from './routes/generate.js';
import registerCheckoutRoute from './routes/checkout.js';
import registerStripeWebhook from './routes/stripeWebhook.js';

// Query parameter schema for listing courses
const ListCoursesQuerySchema = z.object({
  ownerId: z.string().min(1, 'ownerId is required'),
});

// Create Fastify instance
export async function createApp(): Promise<FastifyInstance> {
  // Initialize observability only in non-test environments for performance
  if (process.env.NODE_ENV !== 'test') {
    startTelemetry();
    initializeSentry();
  }

  const app = fastify({
    logger:
      process.env.NODE_ENV === 'test'
        ? false
        : {
            transport: {
              target: 'pino-pretty',
              options: {
                colorize: true,
              },
            },
          },
  });

  // Register compression (Brotli preferred, fallback to gzip)
  await app.register(compress, {
    encodings: ['br', 'gzip'],
    brotliOptions: {},
    // compress all responses regardless of size for integration testing
    threshold: 0,
  });

  // Simple in-memory cache for v10 (keyed by path+query)
  const cache = new NodeCache({
    stdTTL: parseInt(process.env.CACHE_TTL || '60'),
    checkperiod: 120,
  });

  // Register security plugins
  await app.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
      },
      reportOnly: true, // Start in report-only mode
    },
    crossOriginEmbedderPolicy: false, // Disable for API compatibility
  });

  // Register rate limiting (skip in test environment for integration tests)
  if (process.env.NODE_ENV !== 'test') {
    await app.register(rateLimit, {
      max: parseInt(process.env.RATE_LIMIT_MAX || '100'),
      timeWindow: '1 minute',
      errorResponseBuilder: (req, context) => ({
        error: 'Rate limit exceeded',
        message: 'Too many requests, please try again later',
      }),
    });
  } else {
    // For testing, register a special test-only rate limiter with very high limits
    await app.register(rateLimit, {
      max: 1000, // Very high limit for integration tests
      timeWindow: '1 minute',
      errorResponseBuilder: (req, context) => ({
        error: 'Rate limit exceeded',
        message: 'Too many requests, please try again later',
      }),
    });
  }

  // Register health check endpoints
  registerHealthChecks(app, getPrismaClient());

  // Register legacy-compatible routes (import/generate/checkout/webhooks)
  await registerImportRoute(app);
  await registerGenerateRoute(app);
  await registerCheckoutRoute(app);
  await registerStripeWebhook(app);

  // Global error handler with Sentry integration
  app.setErrorHandler(async (error, request, reply) => {
    // Capture error in Sentry
    captureException(error, {
      method: request.method,
      url: request.url,
      userAgent: request.headers['user-agent'],
    });

    app.log.error(error, 'Unhandled error in request');

    reply.code(500).send({
      error: 'Internal server error',
      message:
        process.env.NODE_ENV === 'development'
          ? error.message
          : 'Something went wrong',
    });
  });

  // POST /courses - Create a new course
  app.post('/courses', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      // Validate request body
      const validatedInput = CourseCreateSchema.parse(request.body);

      // Create course using SDK
      const course = await createCourse(validatedInput);

      reply.code(201).send(course);
    } catch (error) {
      if (error instanceof z.ZodError) {
        reply.code(400).send({
          error: 'Validation failed',
          details: error.issues,
        });
      } else {
        app.log.error(error, 'Error creating course');
        reply.code(500).send({
          error: 'Internal server error',
          message: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }
  });

  // GET /courses - List courses for a user
  app.get('/courses', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      // Validate query parameters
      const { ownerId } = ListCoursesQuerySchema.parse(request.query);

      // Cache key based on path and query
      const key = `${request.url}`;

      // If cached, return with X-Cache header
      const cached = cache.get(key);
      if (cached) {
        reply.header('X-Cache', 'HIT');
        reply.header(
          'Cache-Control',
          process.env.CACHE_CONTROL ||
            'public, max-age=0, s-maxage=60, stale-while-revalidate=60'
        );
        return reply.send(cached as unknown);
      }

      // List courses using SDK
      const courses = await listCourses(ownerId);

      // Store in cache and return with X-Cache MISS
      cache.set(key, courses);
      reply.header('X-Cache', 'MISS');
      reply.header(
        'Cache-Control',
        process.env.CACHE_CONTROL ||
          'public, max-age=0, s-maxage=60, stale-while-revalidate=60'
      );
      reply.send(courses);
    } catch (error) {
      if (error instanceof z.ZodError) {
        reply.code(400).send({
          error: 'Invalid query parameters',
          details: error.issues,
        });
      } else {
        app.log.error(error, 'Error listing courses');
        reply.code(500).send({
          error: 'Internal server error',
          message: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }
  });

  return app;
}

// Graceful shutdown handler
async function gracefulShutdown(app: FastifyInstance): Promise<void> {
  console.log('Shutting down gracefully...');

  try {
    await app.close();
    console.log('Fastify server closed');
  } catch (error) {
    console.error('Error closing Fastify server:', error);
  }

  if (process.env.NODE_ENV !== 'test') {
    try {
      await shutdownTelemetry();
      await closeSentry();
    } catch (error) {
      console.error('Error shutting down observability:', error);
    }
  }

  process.exit(0);
}

// Start function for the server
export async function start(
  port: number = parseInt(process.env.PORT || '4000')
): Promise<FastifyInstance> {
  const app = await createApp();

  // Handle graceful shutdown
  process.on('SIGTERM', () => gracefulShutdown(app));
  process.on('SIGINT', () => gracefulShutdown(app));

  try {
    await app.listen({ port, host: '0.0.0.0' });
    app.log.info(`API server is running on port ${port}`);
    return app;
  } catch (error) {
    app.log.error(error, 'Error starting server');
    await gracefulShutdown(app);
    process.exit(1);
  }
}

// Start the server if this file is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  start();
}
