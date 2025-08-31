// Initialize observability before any other imports
import { startTelemetry, shutdownTelemetry } from './observability.js';
import { initializeSentry, captureException, closeSentry } from './error-tracking.js';

// Start telemetry first
startTelemetry();
initializeSentry();

import fastify, { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { createCourse, listCourses, CourseCreateSchema, type CourseCreate, getPrismaClient } from '@launchkit-ai/sdk';
import { z } from 'zod';
import { registerHealthChecks } from './health.js';

// Query parameter schema for listing courses
const ListCoursesQuerySchema = z.object({
  ownerId: z.string().min(1, 'ownerId is required'),
});

// Create Fastify instance
export function createApp(): FastifyInstance {
  const app = fastify({
    logger: process.env.NODE_ENV === 'test' ? false : {
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
        },
      },
    },
  });

  // Register health check endpoints
  registerHealthChecks(app, getPrismaClient());

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
      message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong',
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
      
      // List courses using SDK
      const courses = await listCourses(ownerId);
      
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

  try {
    await shutdownTelemetry();
    await closeSentry();
  } catch (error) {
    console.error('Error shutting down observability:', error);
  }

  process.exit(0);
}

// Start function for the server
export async function start(port: number = parseInt(process.env.PORT || '4000')): Promise<FastifyInstance> {
  const app = createApp();
  
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
