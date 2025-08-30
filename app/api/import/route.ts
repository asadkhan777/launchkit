
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { extractFromUrl } from '@/lib/extractors'

const Q = z.object({ url: z.string().url() })

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const parse = Q.safeParse({ url: searchParams.get('url') || '' })
  if (!parse.success) return NextResponse.json({ error: 'Invalid url' }, { status: 400 })
  try {
    const data = await extractFromUrl(parse.data.url)
    return NextResponse.json(data)
  } catch (_err) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
  }
}
