# instructions_v8.md

## Role

In **v8**, your role as the autonomous **CLI coding agent** is to elevate the testing strategy of LaunchKit AI to a comprehensive and reliable **testing pyramid**.  You will ensure that all layers—unit, integration, end‑to‑end (E2E), and visual regression—are covered.  Proper testing will allow the team to refactor with confidence, catch regressions early, and maintain high code quality as the product matures.

## Task

1. **Review the current state**
   - Read `instructions_postmortem_v7.md` to understand the observability integration and any recommendations for testing.
   - Examine existing test suites in `tests/`, `packages/sdk/test`, and `apps/api/test` to gauge current coverage.

2. **Unit tests**
   - Audit your codebase and ensure every function exposed by the SDK and API layers has corresponding unit tests.
   - Use **Vitest** and **@testing-library/react** (for frontend components) where applicable.
   - Ensure each unit test covers positive and negative scenarios, including input validation, error handling, and edge cases.

3. **Integration tests**
   - For the API, ensure integration tests spin up the real Fastify server and hit endpoints.  Use a Testcontainers library to launch a transient Postgres or SQLite database for integration tests.  Tools like **testcontainers-node** can manage container lifecycle.
   - For the SDK, write integration tests that verify correct interaction with Prisma and the underlying database (these may already exist from v5).  Expand as necessary to cover additional scenarios.

4. **End‑to‑End (E2E) tests**
   - Install **Playwright** (or **Cypress** if preferred) at the root of the repository:
     - `pnpm add -D @playwright/test`.
   - Create a `playwright.config.ts` with a single project configuration targeting Chromium by default.  Set up a global test that starts the API server and Next.js app (to be built in later versions) before running tests.
   - Write at least one E2E test representing the happy path: for example, a test that imports content, generates a course, and verifies that the landing page renders expected text.  This may require stubbing the LLM call; you can simulate generation using the dummy function from v2/v3.
   - Incorporate **axe-core** accessibility checks via Playwright.  Use `await expect(page).toPassA11y()` after important pages to ensure no obvious accessibility violations.

5. **Visual regression tests**
   - Install **Storybook** for the design system package (`packages/ui`) if not done already.  Use `@storybook/react` and `@storybook/testing-react`.
   - Install **Chromatic** or a local visual snapshot tool (e.g. **Jest Image Snapshot**).  Set up a workflow for generating visual snapshots of UI components and comparing them across runs.
   - Write a visual regression test for at least one component (e.g. `Button` or `CourseCard`) to ensure styling and layout remain consistent.  Save snapshots in a `__snapshots__` directory.

6. **Test orchestration**
   - Integrate E2E and visual tests into the existing CI workflow (`.github/workflows/ci.yml`).  For example, add a job `e2e` that installs dependencies, starts the dev server, runs Playwright tests, and uploads results.  Use `needs` dependencies so that E2E tests run after unit/integration tests.
   - Add caching for Playwright browsers to speed up repeated runs.

7. **Address flakiness**
   - Identify any flaky tests (e.g. E2E tests that intermittently fail due to timing issues).  Add `test.retry()` or proper waits to reduce flakiness.
   - If a test remains unreliable, quarantine it by marking it as `.skip` and add a TODO to revisit.

8. **Run the full suite**
   - Execute unit, integration, E2E, and visual regression tests locally using the root test script (via Turbo or PNPM).  Ensure all tests pass.  Fix any failures.
   - Update CI to pass all tests.  Confirm that tests run in parallel where appropriate to minimise runtime.

9. **Postmortem** (`instructions_postmortem_v8.md`)
   - Write `instructions_postmortem_v8.md` summarising:
     - **Achievements:** implemented comprehensive testing (unit, integration, E2E, visual), integrated Playwright and Storybook, and added CI orchestration.
     - **Benefits:** explain how this pyramid will support rapid iteration and refactoring with confidence.
     - **Caveats:** mention any remaining flaky tests and the plan to stabilise them, as well as the need to update tests when new features or UI changes are introduced.
   - Commit the postmortem and changes with a message such as `test(v8): add comprehensive testing pyramid`.

## Format

- Organise tests by layer and package (e.g. `apps/api/test` for API integration tests, `packages/ui/stories` for Storybook stories).
- Keep tests deterministic; avoid random data unless you seed it.
- Document how to run each test suite in the root README or separate docs.