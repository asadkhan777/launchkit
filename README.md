
# LaunchKit AI V2 (Simplified)

*Created on 2025-08-29*

This repository is a simplified yet more functional version of LaunchKit AI. It uses a
**single Next.js app** (version 15.5.2) with integrated API routes for import,
content generation, checkout, and webhooks. It leverages Prisma for data and
SQLite for local development (Postgres for production via env). The goal is to
get you from idea to monetization quickly without a monorepo.

## Features

- Paste a URL (Notion/blog/etc.) and extract a title + text
- Generate a 5-day micro-course outline, email sequence, and landing stub
- Minimal marketing page with import & generate forms
- Placeholder dashboard to list your courses
- API routes for checkout (Stripe) and webhooks
- Clear seam to plug in an LLM for better generation (see `lib/generator.ts`)
- Prisma schema for users, courses, lessons, and orders

## Quick Start

1. **Install dependencies**

```bash
pnpm install
pnpm prisma generate
pnpm prisma migrate dev --name init
```

2. **Copy env**

```bash
cp .env.example .env
# Fill in STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, STRIPE_PRICE_ID
```

3. **Run dev**

```bash
pnpm dev
```

Visit http://localhost:3000. Paste a URL, generate a draft, and explore.

## Publish Flow (Guide)

This starter covers import & generation. To publish a course and sell it:

1. Add a page that saves the draft into the database with a slug
using a Server Action or API route.
2. Create a Stripe product & price in your dashboard; set `STRIPE_PRICE_ID`.
3. Update the buy button to call `/api/checkout` with your course ID + price ID.
4. Handle the webhook in `app/api/webhooks/stripe/route.ts` to record orders.

For further improvements: server actions, authentication, multi-tenancy,
improved UI/UX, and connecting to other content sources.

## License

MIT
