import { FastifyInstance } from 'fastify';
import { stripe, prisma } from '@launchkit-ai/lib';

export default async function registerStripeWebhook(app: FastifyInstance) {
  // Raw body is required to validate signature; assume Fastify is configured accordingly
  app.post('/webhooks/stripe', async (request, reply) => {
    const sig = (request.headers as any)['stripe-signature'];
    const body = (request as any).raw?.toString() || '';
    const secret = process.env.STRIPE_WEBHOOK_SECRET || '';
    try {
      const event = (stripe as any).webhooks.constructEvent(
        body,
        sig || '',
        secret
      );
      if (event.type === 'checkout.session.completed') {
        const session = event.data.object as any;
        const courseId = (session.metadata as any)?.courseId;
        const amount = session.amount_total;
        const buyerEmail = session.customer_details?.email;
        if (courseId && amount && buyerEmail) {
          await (prisma as any).order.create({
            data: { courseId, buyerEmail, amountCents: amount },
          });
        }
      }
      return reply.send({ received: true });
    } catch (err: any) {
      return reply.code(400).send({ error: err.message });
    }
  });
}
