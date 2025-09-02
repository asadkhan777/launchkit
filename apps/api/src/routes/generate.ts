import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { draftFromText } from '@launchkit-ai/lib';

const Body = z.object({ title: z.string().min(3), body: z.string().min(40) });

export default async function registerGenerateRoute(app: FastifyInstance) {
  app.post('/generate', async (request, reply) => {
    const json = request.body as any;
    const parsed = Body.safeParse(json);
    if (!parsed.success)
      return reply.code(400).send({ error: parsed.error.flatten() });
    try {
      const mod = await import('../../../../lib/generator');
      const draft = await (mod.draftFromText as any)(
        parsed.data.title,
        parsed.data.body
      );
      return reply.send(draft);
    } catch (err: any) {
      return reply.code(500).send({ error: err?.message || 'generator error' });
    }
  });
}
