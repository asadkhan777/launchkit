import fastify, { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { createCourse, listCourses, CourseCreateSchema, type CourseCreate } from '@launchkit-ai/sdk';
import { z } from 'zod';

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

  // Health check endpoint
  app.get('/healthz', async (request: FastifyRequest, reply: FastifyReply) => {
    return { status: 'ok' };
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

// Start function for the server
export async function start(port: number = parseInt(process.env.PORT || '4000')): Promise<FastifyInstance> {
  const app = createApp();
  
  try {
    await app.listen({ port, host: '0.0.0.0' });
    app.log.info(`API server is running on port ${port}`);
    return app;
  } catch (error) {
    app.log.error(error, 'Error starting server');
    process.exit(1);
  }
}

// Start the server if this file is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  start();
}
