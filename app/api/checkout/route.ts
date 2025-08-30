
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { stripe } from '@/lib/stripe'

const Body = z.object({ courseId: z.string(), priceId: z.string() })

export async function POST(req: Request) {
  const json = await req.json()
  const { courseId, priceId } = Body.parse(json)
  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/course/${courseId}?success=1`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/course/${courseId}?canceled=1`,
    })
    return NextResponse.json({ url: session.url })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
