// Export all SDK functions and types
export * from './schemas.js';
export * from './errors.js';
export * from './database.js';
export * from './courses.js';
export * from './server.js';

// Export a default SDK object for convenience
export const SDK = {
  courses: {
    create: async (input: import('./schemas.js').CourseCreate) => {
      const { createCourse } = await import('./courses.js');
      return createCourse(input);
    },
    list: async (ownerId: string) => {
      const { listCourses } = await import('./courses.js');
      return listCourses(ownerId);
    },
    getById: async (id: string) => {
      const { getCourseById } = await import('./courses.js');
      return getCourseById(id);
    },
    getBySlug: async (slug: string) => {
      const { getCourseBySlug } = await import('./courses.js');
      return getCourseBySlug(slug);
    },
  },
  server: {
    create: async (options?: import('./server.js').ServerOptions) => {
      const { createServer } = await import('./server.js');
      return createServer(options);
    },
    start: async (options?: import('./server.js').ServerOptions) => {
      const { startServer } = await import('./server.js');
      return startServer(options);
    },
    stop: async (server: import('fastify').FastifyInstance) => {
      const { stopServer } = await import('./server.js');
      return stopServer(server);
    },
  },
  database: {
    getClient: async () => {
      const { getPrismaClient } = await import('./database.js');
      return getPrismaClient();
    },
    disconnect: async () => {
      const { disconnectPrisma } = await import('./database.js');
      return disconnectPrisma();
    },
  },
};
