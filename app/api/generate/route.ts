import { NextResponse } from 'next/server';
import { z } from 'zod';
import { draftFromText } from '@launchkit-ai/lib';

const Body = z.object({ title: z.string().min(3), body: z.string().min(40) });

export async function POST(req: Request) {
  const json = await req.json();
  const parsed = Body.safeParse(json);
  if (!parsed.success)
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  const draft = draftFromText(parsed.data.title, parsed.data.body);
  return NextResponse.json(draft);
}
