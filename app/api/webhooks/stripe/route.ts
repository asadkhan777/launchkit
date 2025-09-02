import { NextResponse } from 'next/server';
import { stripe, prisma } from '@launchkit-ai/lib';

export async function POST(req: Request) {
  const sig = req.headers.get('stripe-signature');
  const body = await req.text();
  const secret = process.env.STRIPE_WEBHOOK_SECRET || '';
  try {
    const event = stripe.webhooks.constructEvent(body, sig || '', secret);
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as any;
      const courseId = (session.metadata as any)?.courseId;
      const amount = session.amount_total;
      const buyerEmail = session.customer_details?.email;
      if (courseId && amount && buyerEmail) {
        await prisma.order.create({
          data: { courseId, buyerEmail, amountCents: amount },
        });
      }
    }
    return NextResponse.json({ received: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export const config = { api: { bodyParser: false } } as any;
