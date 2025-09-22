# V10 Performance Plan & Measurements

## Goals

- API endpoints should respond in under 200ms at the 95th percentile under typical load.
- Home page LCP <= 2.5s on mobile networks (frontend work later).

## Implemented Optimizations (V10)

- Compression via `@fastify/compress` (Brotli/gzip).
- Caching headers and a simple in-memory cache for repeated list requests.
- Cache duration configurable via `CACHE_TTL` and `CACHE_CONTROL` env vars.
- Documentation of measuring tools and suggested budgets.

## Measurement

- Use k6 or Artillery to measure API latency under load. Example k6 script path: `tests/performance.test.ts`.
- Use Lighthouse CI for front-end budgets when web app exists.

## Indexing

- Add indexes for `Course.slug` and `Course.ownerId` where appropriate in the Prisma schema (follow-up migration required).

## Follow-ups

- Integrate Redis/Upstash for distributed caching in production.
- Add automated load tests into CI pipeline.

**Last updated:** Sept 1, 2025
