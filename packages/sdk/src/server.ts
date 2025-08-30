import Fastify, { FastifyInstance } from 'fastify';

export interface ServerOptions {
  port?: number;
  host?: string;
  logger?: boolean;
}

export async function createServer(options: ServerOptions = {}): Promise<FastifyInstance> {
  const { port = 3001, host = '127.0.0.1', logger = true } = options;

  const server = Fastify({
    logger: logger ? {
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true
        }
      }
    } : false,
  });

  // Health check endpoint
  server.get('/healthz', async () => {
    return { status: 'ok' };
  });

  return server;
}

export async function startServer(options: ServerOptions = {}): Promise<FastifyInstance> {
  const { port = 3001, host = '127.0.0.1' } = options;
  const server = await createServer(options);

  try {
    await server.listen({ port, host });
    server.log.info(`Server listening on ${host}:${port}`);
    return server;
  } catch (error) {
    server.log.error(error);
    throw error;
  }
}

export async function stopServer(server: FastifyInstance): Promise<void> {
  await server.close();
}
