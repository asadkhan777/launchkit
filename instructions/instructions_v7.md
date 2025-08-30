# instructions_v7.md

## Role

As the autonomous **CLI coding agent** for LaunchKit AI, your task in **v7** is to instrument the backend and frontend for observability and establish quality gates.  This ensures that performance and reliability issues can be detected and resolved quickly as the system grows.  You will integrate telemetry, error tracking, and uptime monitoring, and add health endpoints for readiness and liveness.  In this version, focus on the API service; instrumenting the web application will be addressed in later versions.

## Task

1. **Review previous postmortem**
   - Read `instructions_postmortem_v6.md` to understand the current state of the API and any caveats that may affect observability integration.

2. **Add tracing and metrics**
   - Install **OpenTelemetry** packages:
     - `pnpm add -w @opentelemetry/api @opentelemetry/sdk-node @opentelemetry/instrumentation-fastify @opentelemetry/exporter-trace-otlp-http`.
   - In `apps/api/src/observability.ts`, create an initialisation module that:
     - Configures an OpenTelemetry Node SDK with a Fastify instrumentation.
     - Exports a function `startTelemetry()` that starts the trace provider and uses the OTLP HTTP exporter to send traces to an endpoint configured via `OTEL_EXPORTER_OTLP_ENDPOINT` environment variable.
   - Import and call `startTelemetry()` at the top of the API `src/index.ts` before creating the Fastify instance.

3. **Error tracking**
   - Add **Sentry** to the API:
     - `pnpm add -w @sentry/node`.
   - Initialise Sentry in `src/index.ts` or a dedicated module by calling `Sentry.init({ dsn: process.env.SENTRY_DSN, tracesSampleRate: 1.0 })`.
   - In Fastify, use the provided hook `setErrorHandler` to capture unhandled errors and send them to Sentry.  Ensure sensitive data (PII) is not included in error reports.

4. **Readiness and liveness probes**
   - Add two new endpoints to the API:
     - `GET /readyz` should perform a lightweight check (e.g. Prisma can `SELECT 1`) and return 200 if the service is healthy.  If the database cannot be reached, return 503.
     - `GET /livez` should simply return 200 if the server is running.  Use this for container-level liveness checks.
   - Update the OpenAPI specification to include these endpoints with appropriate responses.

5. **Uptime monitoring**
   - Create a free account with an uptime monitoring service such as **Better Stack** (manual step).  Add a configuration file (e.g. `.betterstack.yml`) with the monitor definitions pointing to `/readyz` and `/livez` endpoints.  This file is not secret; the DSN or API key should be loaded from environment variables.
   - Include a section in `README.md` describing how to configure and deploy uptime monitors (this can be noted for manual setup later).

6. **Define SLOs and error budgets**
   - In `docs/05-slos.md`, create a document listing at least two service level objectives (SLOs) for the API.  Example:
     - **Availability SLO**: The API will respond successfully to 99.9% of requests over a 30‑day rolling window.  This implies an error budget of 0.1% unavailability.
     - **Latency SLO**: 95th percentile of the `/courses` endpoint response time should be less than 200ms.
   - Describe how these SLOs can be monitored using the OpenTelemetry exporter and Better Stack or another observability platform.  Mention the need to alert on error budget burn rate.

7. **Update tests**
   - Add integration tests for `/readyz` and `/livez` endpoints ensuring they return the correct status codes depending on the health of dependencies.  Use mocking or an in-memory SQLite connection to simulate database availability/unavailability.
   - Optionally write a test to verify that OpenTelemetry instrumentation does not crash the server (e.g. the trace provider starts without throwing).  Mock the OTLP exporter in tests.

8. **Run, debug, and commit**
   - Install any new dependencies and run the build (`pnpm -C apps/api install`, `pnpm -C apps/api run build`).
   - Run the API tests.  Fix any issues that arise due to instrumentation or readiness probes.
   - Ensure that existing endpoints still function correctly after instrumentation.
   - Commit changes in logical chunks with messages such as `feat(api): add OpenTelemetry instrumentation` and `feat(api): add readiness and liveness endpoints`.

9. **Postmortem** (`instructions_postmortem_v7.md`)
   - Create `instructions_postmortem_v7.md` summarising:
     - **Achievements:** added tracing (OpenTelemetry), error tracking (Sentry), health probes, uptime monitoring config, and defined SLOs.
     - **Future considerations:** note that the web application still needs instrumentation; recommend adding browser RUM and linking front‑end traces to backend traces in later versions.
     - **Caveats & challenges:** list any difficulties integrating telemetry (e.g. complexity of SDK initialization) and any temporary workarounds implemented.
   - Commit the postmortem with a message like `docs(v7): add observability postmortem`.

## Format

- Use separate modules for instrumentation logic to keep the main server entry point clean.
- Keep secret keys (Sentry DSN, OTEL exporter endpoints) in environment variables; document required variables in `.env.example`.
- Structure the SLO document with headings and bullet points to improve readability.