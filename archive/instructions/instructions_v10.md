# instructions_v10.md

## Role

As the autonomous **CLI coding agent**, your objective in **v10** is to optimise performance across the LaunchKit AI stack.  You will introduce caching strategies, tune database queries, and configure compression and asset optimisation.  The focus is to achieve good user‑perceived performance while maintaining correctness and cost efficiency.

## Task

1. **HTTP caching headers**
   - For the API, implement caching headers using Fastify’s reply API.  For example, set `Cache-Control: public, max-age=0, s-maxage=60, stale-while-revalidate=60` on responses from endpoints that are safe to cache (e.g. course listings).  Document which endpoints can be cached and for how long.
   - Provide a mechanism to configure cache duration via environment variables for flexibility.

2. **Static asset optimisation**
   - Although the web application will be built in later versions, plan ahead by configuring Next.js to:
     - Enable **Image Optimization** by using the built‑in `<Image>` component and setting remote domains appropriately.
     - Use `next/font` to serve critical fonts and avoid layout shifts.
     - Configure `next.config.js` to enable `compression` (e.g. using `gzip` or `brotli`) for static assets served by Next.js.

3. **Compression**
   - In the API, add Fastify’s compression plugin (`@fastify/compress`) and configure it to use Brotli if the client supports it, falling back to gzip.  Test that responses are compressed accordingly.

4. **Database performance**
   - Review Prisma queries for potential N+1 issues.  Use `include` statements to fetch related data in a single query when appropriate.
   - Add indexes to fields that are frequently filtered or sorted on (e.g. `Course.slug`, `Order.courseId`).  This may require updating the Prisma schema and running a migration.
   - Document indexing strategy in `docs/07-performance.md` and note any trade‑offs.

5. **Caching layer (optional)**
   - Introduce a simple caching layer for repeated expensive operations.  If an in‑memory cache suffices, use the `fastify-caching` or `node-cache` modules.  Alternatively, integrate with a serverless Redis provider (e.g. Upstash) but leave actual connection details as environment variables for later configuration.
   - Wrap expensive functions (e.g. content extraction and generation) with a caching mechanism so repeated calls with the same input return cached results.

6. **Measurement and budgets**
   - Define performance budgets in `docs/07-performance.md` for key interactions.  For example:
     - API endpoints should respond in under 200ms at the 95th percentile under typical load.
     - The home page LCP (Largest Contentful Paint) should be ≤ 2.5s on mobile networks.
   - Describe how to measure these budgets using tools like Lighthouse CI for the frontend and a load testing tool such as k6 or Artillery for the backend.  Create a simple load test script under `tests/performance.test.ts` that hits the API and measures latency.

7. **Testing**
   - Write tests to verify that caching headers are present on cached responses and absent on uncached responses.
   - Write tests to ensure compressed responses are returned when clients send `Accept-Encoding: gzip, br`.
   - If introducing a cache, write tests to check that repeated calls return cached results and that cache invalidation works when underlying data changes.

8. **Postmortem** (`instructions_postmortem_v10.md`)
   - Create `instructions_postmortem_v10.md` summarising:
     - **Implemented optimisations:** caching headers, compression, database indexing, caching layer introduction.
     - **Metrics & budgets:** document the performance budgets defined and any baseline measurements taken.
     - **Follow‑ups:** note tasks for future versions (e.g. adding CDN, refining cache invalidation strategies, measuring real user performance once the web app is live).
   - Commit the postmortem and code changes with a message like `perf(v10): add caching and compression`.

## Format

- Keep caching configurations in environment variables where appropriate.
- Document performance strategies and budgets in dedicated Markdown files.
- Ensure all new packages are added to the appropriate `package.json` files and installed.