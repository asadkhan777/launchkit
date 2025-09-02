import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { extractFromUrl } from '@launchkit-ai/lib';

const Q = z.object({ url: z.string().url() });

export default async function registerImportRoute(app: FastifyInstance) {
  app.get('/import', async (request, reply) => {
    const url = (request.query as any)?.url;
    const parse = Q.safeParse({ url: url || '' });
    if (!parse.success) return reply.code(400).send({ error: 'Invalid url' });
    try {
      const mod = await import('../../../../lib/extractors');
      const data = await (mod.extractFromUrl as any)(parse.data.url);
      return reply.send(data);
    } catch (err: any) {
      return reply
        .code(500)
        .send({ error: 'Failed to fetch data due to: ' + err?.message });
    }
  });
}
