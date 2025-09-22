# instructions_v6.md

## Role

You are an autonomous **CLI coding agent** continuing work on LaunchKit AI. In **v6**, you will wrap the backend SDK into an externally consumable **REST API** using Fastify. The goal is to expose the core operations (health checks, course management, importing and generating content) through clean HTTP endpoints that align with the OpenAPI specification drafted in **v3**. You will preserve internal logic within the SDK while adding route handlers, validation, and proper error handling at the API boundary. This version lays the foundation for integrating with the front‑end and future enhancements such as authentication and observability.

## Task

1. **Review previous postmortem**
   - Read `instructions_postmortem_v5.md` to ensure a solid understanding of the SDK’s capabilities and any noted caveats.
   - Confirm that the SDK package builds and tests pass (`pnpm -C packages/sdk run build` and `pnpm -C packages/sdk run test`). Resolve any residual issues before proceeding.

2. **Create the API app**
   - Under `apps/api`, create a new `package.json` with fields:
     ```json
     {
       "name": "@launchkit-ai/api",
       "private": true,
       "version": "0.1.0",
       "main": "dist/index.js",
       "types": "dist/index.d.ts",
       "scripts": {
         "dev": "ts-node src/index.ts",
         "build": "tsc --build",
         "start": "node dist/index.js",
         "test": "vitest"
       },
       "dependencies": {
         "fastify": "latest",
         "@launchkit-ai/sdk": "workspace:*",
         "@prisma/client": "*",
         "zod": "latest",
         "pino": "latest"
       },
       "devDependencies": {
         "typescript": "*",
         "ts-node": "*",
         "vitest": "*"
       }
     }
     ```
   - Create a `tsconfig.json` inside `apps/api` that extends the root config and outputs compiled JS into `dist`.
   - Create a minimal entry point `src/index.ts` that:
     - Instantiates a Fastify server with sensible defaults.
     - Imports the SDK functions (e.g. `createCourse`, `listCourses`).
     - Registers route handlers for the following endpoints:
       - `GET /healthz` → return `{status:'ok'}`.
       - `POST /courses` → accept JSON body validated by Zod (`ownerId`, `title`, `description`, `lessons[]`), call `createCourse`, and return the created course.
       - `GET /courses` → accept query param `ownerId`, call `listCourses`, and return the list of courses.
     - Adds a `try/catch` around handler logic to catch and return errors with appropriate HTTP status codes (e.g. 400 for validation errors, 500 for internal errors).
     - Exposes a `start()` function that launches the server on `process.env.PORT || 4000` and logs when listening.
   - Export the Fastify instance for integration testing.

3. **Update OpenAPI specification**
   - Amend `apps/api/openapi.yaml` to reflect the concrete endpoints added in this version. Define the `/courses` paths for `GET` and `POST` with request bodies, query parameters, and responses referencing the schemas defined in the components section.
   - Ensure the operation IDs and tags are descriptive and consistent.
   - Validate the OpenAPI file using an online or local validator (optional) to ensure syntax correctness.

4. **Tests**
   - Under `apps/api/test`, write integration tests using **Vitest** (or **supertest**) that spin up the API server on an available port and call the endpoints. Cover at least:
     - Health endpoint returns status OK.
     - POST `/courses` with valid input creates a course and returns it; subsequent GET `/courses?ownerId=` returns the created course.
     - POST `/courses` with invalid data (e.g. missing title) returns 400.
   - Use a separate SQLite database for tests, as done in the SDK tests. Optionally share the test DB setup helper from the SDK package to avoid duplication.
   - Strive for at least 80% test coverage of the API package.

5. **Run, debug, and commit**
   - Build the API package (`pnpm -C apps/api run build`) and ensure TypeScript compiles without errors.
   - Start the API in development mode (`pnpm -C apps/api run dev`) and test endpoints manually if desired using curl or Postman.
   - Run the test suite (`pnpm -C apps/api run test`) and fix any issues until all tests pass.
   - Lint the API code and fix any formatting or code quality issues.
   - Commit the work in logical increments with messages such as `feat(api): add courses endpoints` and `chore(api): add API integration tests`.

6. **Postmortem** (`instructions_postmortem_v6.md`)
   - Write `instructions_postmortem_v6.md` summarising:
     - **Achievements:** the API package creation, implemented endpoints, OpenAPI updates, integration tests.
     - **Next steps for v7:** outline the need to integrate observability (tracing, metrics) and consider authentication in upcoming versions.
     - **Caveats & decisions:** note any design choices (error handling strategy, route naming, schema validation) and any challenges encountered during implementation.
   - Commit the postmortem with a message like `docs(v6): add API postmortem`.

## Format

- Maintain modular code separation: SDK package remains purely logical; API package imports the SDK and handles HTTP specifics.
- Use **TypeScript** in all source files with strict mode enabled.
- Keep route handlers small and delegate heavy lifting to the SDK.
- Ensure the OpenAPI specification stays in sync with implemented endpoints.
