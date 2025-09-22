# instructions_v1.md

## Role

You are an autonomous **CLI coding agent** continuing work on the **LaunchKit AI** repository. Your task in this version is to lay the groundwork for the codebase. You will initialise Git, create a barebones project structure using the **Role–Task–Format (RTF)** approach, and install the minimal tooling needed to run the project and its tests. You should draw inspiration from well‑maintained open source Next.js projects such as **Supabase** (open‑source Firebase alternative with Postgres and real‑time capabilities)【539314815336019†L231-L237】, **Dub.co** (self‑hostable link management tool)【539314815336019†L272-L278】 and **Cal.com** (open‑source scheduling platform with deep integrations)【539314815336019†L280-L287】. Study their folder structures and commit hygiene for guidance as you build LaunchKit AI.

## Task

1. **Repository initialisation**
   - If the repository is not already a Git repository, run `git init` at the project root.
   - Create an initial commit if necessary (e.g. `chore: initial commit`) to mark the start of version control.

2. **Project structure**
   - Create a top‑level folder named `apps` if it does not exist. Inside `apps`, create a folder named `web`. This will house the Next.js app.
   - Create a top‑level folder named `packages`. Inside `packages`, create a folder named `common` (for shared utilities) and `tests` (for shared test helpers). Leave them empty for now.
   - Generate minimal placeholder files to make these directories trackable (e.g. a `.gitkeep` file in each new directory).

3. **Package management & configuration**
   - Create a `package.json` at the root with the following properties:
     - `name`: `launchkit-ai`.
     - `private`: `true`.
     - `version`: `0.1.0`.
     - `workspaces`: `["apps/*", "packages/*"]` to prepare for a monorepo.
     - Scripts:
       - `dev`: placeholder script (e.g. `echo "Define dev script in later versions"`).
       - `test`: will run tests once configured.
       - `lint`: placeholder for linting (e.g. `echo "Define lint script in later versions"`).
   - Install the minimal set of development dependencies to support the testing pyramid:
     - **Vitest** for unit tests.
     - **@vitest/ui** for local test GUI (optional but future‑proof).
     - **ts-node** and **typescript** for TypeScript support.
     - **@types/node** for Node.js type definitions.
   - Use `pnpm` or `npm` as the package manager; ensure that lockfiles are generated and committed.

4. **Testing pyramid setup**
   - Add a `vitest.config.ts` file at the repository root with a basic configuration:
     ```ts
     import { defineConfig } from 'vitest/config';
     export default defineConfig({
       test: {
         environment: 'node',
         globals: true,
         coverage: {
           provider: 'v8',
           reporter: ['text', 'json'],
         },
       },
     });
     ```
   - Create a `tests` directory at the repository root. Inside, add a sample unit test file `sample.test.ts` that simply asserts `true === true`. This ensures the test runner is wired correctly.
   - Add an `npm` or `pnpm` script to run tests via `vitest`. For example, in `package.json`:
     ```json
     "scripts": {
       "test": "vitest run"
     }
     ```

5. **Commit and install**
   - Stage and commit all newly created files with a descriptive message such as `chore(v1): initialise monorepo skeleton with testing setup`.
   - Run the package manager install command (e.g. `pnpm install` or `npm install`) to install dependencies. If any errors occur, fix them (for example, by adjusting package versions or configuration) until installation succeeds.

6. **Verification**
   - After installation, run the test script (`pnpm test` or `npm test`). The sample test should pass without errors.
   - Run the lint script (currently a placeholder). There should be no lint errors since linting isn’t yet configured.
   - If the tests fail or any commands error, diagnose the issue, make the necessary adjustments (adding missing config or correcting typos), and commit the fixes.

7. **Postmortem** (`instructions_postmortem_v1.md`)
   - Create `instructions_postmortem_v1.md` at the repository root summarising:
     - **Achievements:** what structures and configurations were created in v1.
     - **Instructions for v2:** how to leverage the current skeleton (e.g. where to place the Next.js code, where to add shared packages) and any migration tasks expected.
     - **Caveats & decisions:** any architectural decisions made (e.g. choice of Vitest over Jest), any errors encountered and how they were resolved, and any missing pieces deferred to v2.

## Format

- Use **Markdown** for all instructions and postmortem files.
- Follow the **Role–Task–Format** structure: clearly separate the role you play, the ordered tasks, and any format guidelines.
- Keep commit messages descriptive and conventional (e.g. `chore:`, `docs:`, `feat:` prefixes).
- Use `.gitkeep` files to ensure empty directories are tracked. Do not leave directories empty without a placeholder file.
