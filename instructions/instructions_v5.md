# instructions_v5.md

## Role

You are an autonomous **CLI coding agent** working on the LaunchKit AI project.  In **v5** your role is to build a minimal yet functional **backend SDK** to interact with the database via Prisma and expose reusable functions that map to the endpoints defined in the OpenAPI skeleton.  You will use **Fastify** for an internal server (not yet exposed to external clients) and **Zod** for runtime validation.  Your objective is to achieve high test coverage through unit and integration tests, ensuring that the SDK is reliable before wrapping it in a REST API in the next phase.

## Task

1. **Review earlier work**
   - Revisit `instructions_postmortem_v4.md` to understand the current monorepo tooling and how it supports running multiple packages.
   - Ensure that the `packages` directory contains `sdk` and `common`; if not, create them.
   - Confirm that Prisma client generation from **v3** is available via `prisma generate`.  If not, run it now.

2. **Set up the SDK package**
   - Inside `packages`, create a new folder `sdk` with its own `package.json`:
     ```json
     {
       "name": "@launchkit-ai/sdk",
       "version": "0.1.0",
       "private": true,
       "main": "dist/index.js",
       "types": "dist/index.d.ts",
       "scripts": {
         "build": "tsc --build",
         "test": "vitest",
         "lint": "eslint src --ext .ts",
         "prepare": "prisma generate"
       },
       "dependencies": {
         "fastify": "latest",
         "pino": "latest",
         "zod": "latest",
         "@prisma/client": "*"
       },
       "devDependencies": {
         "typescript": "*",
         "vitest": "*",
         "@types/node": "*"
       }
     }
     ```
   - Create a `tsconfig.json` inside `packages/sdk` extending the root config and setting `outDir` to `dist`.
   - In `packages/sdk/src`, create index files and modules as described below.

3. **Implement Fastify server and health check**
   - In `packages/sdk/src/server.ts`, implement a Fastify instance that:
     - Registers a `/healthz` route returning `{ status: 'ok' }`.
     - Sets up Pino logging (use a pretty transport in development).
     - Exposes a function to start the server on a configurable port and return the instance.
   - Make sure to export this start function for tests to consume.

4. **Implement core SDK functions**
   - In `packages/sdk/src/courses.ts`, implement functions to create and fetch courses using Prisma.  For example:
     - `createCourse(input: { ownerId: string; title: string; description: string; lessons: { title: string; content: string; order?: number }[] }): Promise<Course>`: create a course and associated lessons.
     - `listCourses(ownerId: string): Promise<Course[]>`: return all courses for a given user.
   - Validate inputs using **Zod** schemas defined in the same file or separate `schemas.ts`.
   - Handle errors gracefully (e.g. wrap Prisma errors and rethrow as typed errors).

5. **Write tests (100% coverage)**
   - Under `packages/sdk/test`, create unit tests using **Vitest** covering:
     - Health check returns status OK.
     - `createCourse` validates inputs (e.g. rejects missing title) and persists data.
     - `listCourses` returns courses only for the specified user.
   - Use an in‑memory SQLite database for tests by configuring `DATABASE_URL="file:./dev-test.db"` before running Prisma migrations.  You may create a `test/setup.ts` file that runs migrations and seeds the test DB before tests run.
   - Aim for 100% coverage of the new SDK functions.

6. **Generate SDK types (optional)**
   - If you have defined your OpenAPI specification with versioned endpoints, you can optionally generate a typed client for the SDK using a tool like `openapi-typescript-codegen`.  For now, stub this as a TODO in the package README.

7. **Run tests and fix bugs**
   - Execute the build script (`pnpm -C packages/sdk run build`) to ensure TypeScript compiles without errors.
   - Run `pnpm -C packages/sdk run test`.  Fix any failing tests until all pass.
   - Run the linter (`pnpm -C packages/sdk run lint`) and fix any issues.
   - Commit your code frequently with messages describing each logical change (e.g. `feat(sdk): add Fastify health endpoint`, `feat(sdk): implement createCourse`).

8. **Postmortem** (`instructions_postmortem_v5.md`)
   - At the repository root, create `instructions_postmortem_v5.md` and summarise:
     - **Achievements:** a working internal Fastify server with health check, Prisma‑powered course functions, and 100% test coverage.
     - **Readiness for v6:** note that these SDK functions will be wrapped in a REST API; highlight any important decisions (e.g. input validation patterns) that should be mirrored in the API layer.
     - **Caveats & improvements:** note any shortcuts taken (e.g. simplified error handling) and propose follow‑ups for future versions.
   - Commit the postmortem and code with a message like `feat(v5): scaffold backend SDK with Fastify and Prisma`.

## Format

- Organise SDK code under `packages/sdk/src` and tests under `packages/sdk/test`.
- Use **TypeScript** for all source files and enable strict mode.
- Use **Zod** for runtime validation; define schemas separately to make them reusable.
- Write tests before implementing functions (TDD) and aim for complete coverage.