import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { stripe } from '@launchkit-ai/lib';

const Body = z.object({ courseId: z.string(), priceId: z.string() });

export default async function registerCheckoutRoute(app: FastifyInstance) {
  app.post('/checkout', async (request, reply) => {
    try {
      const json = request.body as any;
      const { courseId, priceId } = Body.parse(json);
      const session = await (stripe as any).checkout.sessions.create({
        mode: 'payment',
        line_items: [{ price: priceId, quantity: 1 }],
        success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/course/${courseId}?success=1`,
        cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/course/${courseId}?canceled=1`,
      });
      return reply.send({ url: session.url });
    } catch (e: any) {
      return reply.code(500).send({ error: e.message });
    }
  });
}
