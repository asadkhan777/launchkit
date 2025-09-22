# instructions_v3.md

## Role

You are an autonomous **CLI coding agent** continuing development of the LaunchKit AI project. In **v3** your role is to lay the foundation of the data layer and API contract. You will define basic database models using **Prisma**, generate migrations, compile and run the code to ensure schemas are correct, and create high‑level architecture documentation including a preliminary OpenAPI specification. This work will enable typed SDK generation and ensure that subsequent API endpoints are consistent and discoverable.

## Task

1. **Review prior postmortems**
   - Read `instructions_postmortem_v2.md` to understand the repository state and any caveats or pending tasks. Confirm that all directories and files referenced for this phase exist. If something is missing (e.g. `apps/api` folder, `packages/sdk`), create or correct them now.

2. **Define Prisma schema**
   - In the `prisma` directory, create or update `schema.prisma`. Define the core data models needed for LaunchKit AI’s first functionality:
     - `User`: fields `id` (cuid), `email` (unique), `createdAt` (DateTime, default `now()`), and `courses` (relation to Course).
     - `Course`: fields `id` (cuid), `ownerId` (relation to User), `slug` (unique), `title`, `description`, `createdAt` (default `now()`), `updatedAt` (updatedAt), and a relation to `Lesson`.
     - `Lesson`: fields `id` (cuid), `courseId` (relation to Course), `title`, `content`, and `order` (Int with default 0).
     - `Order`: fields `id` (cuid), `courseId` (relation to Course), `buyerEmail`, `amountCents` (Int), and `createdAt` (default `now()`).
   - Ensure relations are defined using Prisma’s `@relation` syntax.
   - Configure the datasource to use SQLite for local development (e.g. `url = env("DATABASE_URL")`) and a PostgreSQL provider for production in future versions.
   - Run `pnpm prisma migrate dev --name init` (or the equivalent npm command) to create the initial migration. Ensure this command runs without errors and that a `dev.db` file appears (for SQLite). Commit migration files.

3. **Generate Prisma client**
   - Run `pnpm prisma generate` to produce the TypeScript client in `node_modules/.prisma/client`. Ensure there are no type errors.
   - Add an entry point under `lib/db.ts` (if not already present) that exports a Prisma client instance following the singleton pattern (to avoid exhausting database connections).

4. **Architecture documentation**
   - Inside the `docs` directory, create a file named `04-architecture.md`.
   - Compose a lightweight C4 **context** and **container** diagram description in Markdown. Describe:
     - The **actors** (creator, buyer, system admin).
     - The **containers**: front‑end (Next.js app), backend API (Fastify), and database.
     - How data flows between them (e.g. creator calls import endpoint, API stores course in DB, buyer calls checkout endpoint via Stripe).
   - Keep diagrams textual (you can use ASCII or descriptions); you do not need to embed images at this stage.
   - Outline the planned **REST resources** (e.g. `/api/import`, `/api/generate`, `/api/courses`, `/api/orders`) and basic methods (GET/POST).
   - Describe the **error model** (use HTTP status codes, JSON body with error message and code) and versioning strategy (e.g. prefix endpoints with `/v1/`).

5. **OpenAPI skeleton**
   - Create `apps/api/openapi.yaml` with a basic OpenAPI 3.1 skeleton:
     - Set `openapi: 3.1.0` and `info` (title, version, description).
     - Define components schemas for the data models (`User`, `Course`, `Lesson`, `Order`) using JSON Schema syntax.
     - Declare paths for the core endpoints with minimal request/response structure (e.g. `/api/v1/import` POST expects a body with `url` and returns extracted text; `/api/v1/courses` GET returns an array of Course).
     - Leave descriptions brief; the file will be expanded in later versions.

6. **Compile, run, fix**
   - Run `pnpm test` to ensure existing tests still pass after adding Prisma. If any tests fail, debug and fix the issues (e.g. adjust import paths).
   - Run `tsc --noEmit` or equivalent to type‑check the entire project. Fix any type errors introduced by the new code.
   - Start a development server (if available) to ensure no runtime errors occur due to the new dependencies. You may need to update the dev script to run `prisma generate` before starting the server.

7. **Postmortem** (`instructions_postmortem_v3.md`)
   - Create `instructions_postmortem_v3.md` at the repository root. Summarise:
     - **Completed work:** Prisma schema definitions, migration generation, architecture and OpenAPI skeleton.
     - **Leverage for v4:** note that future versions will build on the schema by adding API endpoints, typed SDKs, and scaffolding.
     - **Caveats & decisions:** mention any challenges encountered (e.g. relation definitions, environment setup), decisions about database provider, and any adjustments needed in the next phase.
   - Commit all changes and the postmortem with a message such as `feat(v3): add Prisma schema and architecture docs`.

## Format

- Use Markdown with clear headings for documentation.
- Organise the OpenAPI file following standard YAML conventions; indent properly and keep lines short.
- Use Conventional Commits for git messages.
- Always run tests and type checks after modifying code; fix any failures before committing.
