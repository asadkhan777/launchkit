# instructions_v15.md

## Role

In **v15**, your role as the autonomous **CLI coding agent** is to implement **authentication and authorisation** for LaunchKit AI and finalise payment integration.  You will choose an auth provider (e.g. Auth.js, Clerk, or Supabase Auth), wire up user sign‑up/sign‑in flows on the front end, protect API routes, and ensure Stripe payments function end‑to‑end.  This phase completes the core MVP journey from sign‑up to paid usage.

## Task

1. **Select and configure an auth provider**
   - Evaluate available options (Auth.js, Clerk, Supabase Auth).  Choose one that meets requirements for ease of integration, developer experience, and pricing (assume you choose **Auth.js** for this step).
   - Install necessary dependencies in both the API and web packages.  For Auth.js:
     - `pnpm add next-auth` in `apps/web`.
     - `pnpm add @auth/core @auth/prisma-adapter` in `apps/api` or central package.
   - Create an Auth.js configuration in `apps/web/app/api/auth/[...nextauth]/route.ts` or `pages/api/auth/[...nextauth].ts` (depending on Next.js version).  Configure providers (e.g. GitHub OAuth), session strategy, and Prisma adapter for persistence.
   - Update the Prisma schema to include `Account` and `Session` models (if not present).  Run `prisma migrate dev` accordingly.

2. **Protect API routes**
   - In `apps/api/src/index.ts`, register an authentication hook that verifies JWT or session tokens on protected routes.  Use the adapter or a custom Fastify plugin to decode and validate sessions.
   - Protect endpoints like `POST /courses` and `GET /courses` to ensure only authenticated users can access or modify their data.  Return 401 for unauthenticated requests.
   - Update tests to include authentication; use a helper to sign in and include session cookies or JWT tokens in requests.

3. **Frontend auth flows**
   - Create a **Sign In** page (`app/signin/page.tsx`) and a **Sign Up** page (`app/signup/page.tsx`) that use the Auth.js `signIn` and `signUp` functions.  Provide social login options if configured (e.g. GitHub) and fallback email/password if supported.
   - Display user session information in the Navbar (e.g. show “My Dashboard” when signed in, “Sign In” when signed out).  Use the `useSession` hook from Auth.js to obtain the current session.
   - Add a **Sign Out** button that calls `signOut()`.

4. **Role/permission checks**
   - Extend the Prisma schema or add a field on the `User` model to indicate roles (e.g. “admin”, “creator”).  Implement simple role checks in the API to restrict certain actions (e.g. only admins can view all orders).
   - Write tests covering role enforcement.

5. **Payment wiring**
   - In `apps/api`, ensure that the Stripe integration (created in earlier versions) verifies webhook signatures using the secret from environment variables.  Add idempotency keys to payment routes to prevent duplicate processing.
   - In `apps/web`, display pricing tiers and allow users to subscribe or purchase.  Use Stripe’s client library in the front end to redirect to the checkout page.
   - After a successful payment, update the user’s subscription status in the database and grant access to premium features.  Write integration tests that mock Stripe webhooks and verify state changes.

6. **Secret management**
   - Update `.env.example` to include all variables required for Auth.js (e.g. `AUTH_SECRET`, OAuth client IDs/secrets) and Stripe integration (`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXTAUTH_URL`).  Document how to set these in the README without exposing secrets in the repo.

7. **Testing**
   - Write E2E tests using Playwright that simulate a user signing up, signing in, creating a course, and completing a purchase.  Use Playwright’s `request` object to mock external services (GitHub OAuth, Stripe) or use test keys.
   - Update unit and integration tests to cover the new authentication middleware and role logic.

8. **Run, debug, and commit**
   - Start the entire stack (API and web) locally.  Go through the sign‑up → sign‑in → create course → checkout flow manually to verify that everything works.
   - Fix any bugs encountered (e.g. session misconfiguration, callback URL errors) and commit the fixes.
   - Commit code changes with descriptive messages (e.g. `feat(auth): add Auth.js sign-up/sign-in flows`, `feat(api): protect course routes`).

9. **Postmortem** (`instructions_postmortem_v15.md`)
   - Write `instructions_postmortem_v15.md` summarising:
     - **Completed features:** implemented authentication flows, protected API routes, added roles, integrated Stripe payments end‑to‑end.
     - **Remaining tasks:** note any features deferred (e.g. password resets, account management UI) and plans for hardening the auth stack (e.g. session management optimisation).
     - **Lessons learned:** discuss any challenges integrating Auth.js with Fastify and Next.js and how they were resolved.
   - Commit the postmortem with a message like `docs(v15): auth and payments postmortem`.

## Format

- Keep authentication logic encapsulated; avoid scattering auth checks throughout the codebase.  Use central middleware/hooks.
- Store sensitive information only in environment variables and never commit secrets to version control.
- Ensure tests run with test credentials and do not hit production systems.