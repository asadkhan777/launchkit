# instructions_v2.md

## Role

You are an autonomous **CLI coding agent** continuing to build the LaunchKit AI project. Having established a monorepo skeleton and a basic test runner in **v1**, your role in **v2** is to verify the previous step’s outcomes, introduce initial infrastructure and config files, and prepare the repository for expansion. You will adhere strictly to **Test‑Driven Development (TDD)**: no interface, class, or function should be created without an accompanying test describing its expected behaviour.

## Task

1. **Review the v1 postmortem**
   - Open `instructions_postmortem_v1.md`. Confirm that the repository state matches the description recorded there. If discrepancies exist (e.g. missing directories or misconfigured scripts), remedy them first and commit those fixes with a message like `fix(v2): align repository with v1 postmortem`.

2. **Adjust folder structure for monorepo**
   - If not already present, create `apps/api` as a sibling to `apps/web`. This directory will eventually contain the backend API.
   - Within `packages`, create subfolders `ui` (for future design system components) and `sdk` (for the typed client SDK). Add `.gitkeep` files in each.
   - Verify that the `workspaces` property in `package.json` includes these new package paths (`"apps/*", "packages/*"`). If necessary, update the configuration and commit.

3. **Basic configuration files**
   - Add or update **TypeScript config** (`tsconfig.json`) at the repository root with strict mode enabled. Extend any base Next.js presets if needed. Configure path aliases for the monorepo (for example, map `@/` to `./apps/web`).
   - Add a minimal **ESLint** configuration at the root. Include `@typescript-eslint/parser` and `@typescript-eslint/recommended` rules. Add a lint script in `package.json` (e.g. `eslint --ext .ts,.tsx .`).
   - Add a **Prettier** configuration file (`.prettierrc`) with sensible defaults such as `semi: true`, `singleQuote: true`, and `tabWidth: 2`.

4. **Testing enhancements**
   - Expand the existing `tests/sample.test.ts` to include a simple integration test for a utility function. For example, create `packages/common/sum.ts` exporting a function `sum(a: number, b: number): number`. Write a test in `tests/sample.test.ts` that asserts `sum(1, 2) === 3`.
   - Ensure both the new function and its test pass when running `pnpm test`.

5. **Run dev, lint, and tests**
   - Run the development script (`pnpm dev` or `npm run dev`). It may still be a placeholder at this stage; ensure it is correctly implemented and executes without errors.
   - Run the lint script. Fix any linting issues and commit with a message like `chore(v2): fix lint errors`.
   - Run the test suite. All tests should pass. If they fail, adjust the code or test until they succeed and commit the fixes.

6. **Postmortem** (`instructions_postmortem_v2.md`)
   - Create a file named `instructions_postmortem_v2.md` at the repository root summarising:
     - **Completed work:** new directories created, config files added, functions implemented under TDD, and structural updates.
     - **Leverage for v3:** outline how the new folders (`apps/api`, `packages/sdk`, `packages/ui`, `packages/common`) will be used in the next phase (e.g. adding Prisma models and API scaffolding).
     - **Caveats & decisions:** note any design decisions (choice of lint rules, strictness), issues encountered and solutions applied, and recommendations for future refactoring.
   - Commit the postmortem and any outstanding changes with a message such as `docs: add v2 postmortem`.

## Format

- Maintain the **Role–Task–Format** throughout this file.
- Keep tasks ordered and specific; each task should lead to a tangible change in the repository.
- Commit messages should follow **Conventional Commits** (e.g. `feat:`, `fix:`, `chore:`, `docs:`).
- When implementing code under TDD, always write the test first, watch it fail, then implement the code to make the test pass. d
