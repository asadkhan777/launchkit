# instructions_v4.md

## Role

You are an autonomous **CLI coding agent** continuing development of the LaunchKit AI project. Having laid the data layer foundation and created an OpenAPI skeleton in **v3**, your role in **v4** is to formalise the project tooling and developer experience. You will initialise a proper monorepo toolchain, enforce linting and formatting standards, and set up continuous integration (CI) to ensure code quality. This step will create the scaffolding for all future work.

## Task

1. **Monorepo tooling**
   - Install and configure **pnpm** workspaces (or `npm` workspaces if pnpm is unavailable). The root `package.json` should already define `workspaces: ["apps/*", "packages/*"]`. Verify this and ensure that running `pnpm install` installs dependencies across all subprojects without duplication.
   - Introduce **Turborepo** or **Nx** (choose one) to orchestrate scripts across workspaces. If using Turborepo:
     - Run `pnpm add -D turbo` and create a `turbo.json` at the repository root defining basic pipelines: `dev`, `build`, `test`, and `lint`. Example:
       ```json
       {
         "pipeline": {
           "dev": { "dependsOn": ["^dev"], "outputs": [] },
           "build": { "dependsOn": ["^build"], "outputs": ["dist/**"] },
           "test": { "dependsOn": ["^test"] },
           "lint": {}
         }
       }
       ```
     - Update `package.json` scripts to run Turbo (e.g. `"dev": "turbo run dev", "build": "turbo run build", "test": "turbo run test", "lint": "turbo run lint"`).
   - Add **Changesets** to manage versioning and releases:
     - Run `pnpm add -D @changesets/cli` and run `pnpm changeset init` to create `.changeset` directory and configuration. This will help generate changelogs in future versions.

2. **Linting and formatting**
   - Install **ESLint** and **Prettier** if not already present, along with relevant plugins:
     - `pnpm add -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin prettier eslint-config-prettier`.
   - Ensure `.eslintrc.js` extends `plugin:@typescript-eslint/recommended` and `prettier` to avoid conflicts between ESLint and Prettier.
   - Create a `.eslintignore` file to exclude build outputs (`/dist`, `.next`, `.turbo`) and dependency folders (`/node_modules`, `*.db`).
   - Ensure Prettier is configured via `.prettierrc` and that a Prettier ignore file (`.prettierignore`) excludes build outputs.
   - Add `prettier` script to `package.json` (e.g. `"format": "prettier --write \"**/*.{js,ts,tsx,md,json}\""`). Consider adding a pre‑commit hook for formatting in later versions.

3. **Commit linting**
   - Add **commitlint** and **husky** to enforce Conventional Commits:
     - `pnpm add -D @commitlint/{cli,config-conventional} husky`.
     - Create a `commitlint.config.js` at the root with `module.exports = { extends: ['@commitlint/config-conventional'] }`.
     - Run `npx husky install` and add a `commit-msg` hook that runs `commitlint --edit $1`.
   - Document in the README that all commit messages must follow the Conventional Commits standard.

4. **Continuous Integration (CI)**
   - Create a `.github/workflows/ci.yml` file to run linting, type checking, and tests on every pull request. Basic example using **GitHub Actions**:

     ```yaml
     name: CI
     on: [push, pull_request]

     jobs:
       build:
         runs-on: ubuntu-latest
         steps:
           - uses: actions/checkout@v4
           - uses: pnpm/action-setup@v2
             with:
               version: latest
           - run: pnpm install --frozen-lockfile
           - run: pnpm run lint
           - run: pnpm run test -- --run
           - run: pnpm run build # placeholder; may be replaced later
     ```

   - Commit this workflow file so that CI runs automatically in the next pull request.

5. **TypeScript strictness**
   - Update `tsconfig.json` to enable strict type checking (`"strict": true`) and no implicit any. Ensure that all existing TypeScript files compile without type errors. Fix any issues (e.g. adding explicit types or ignoring config for test files).

6. **Verification and tests**
   - Install dependencies via `pnpm install` and ensure the new scripts run via Turborepo. Fix any issues (e.g. misnamed scripts) and commit corrections.
   - Run `pnpm run lint` and `pnpm run format` (if defined) to ensure code is clean. Fix issues as needed.
   - Run the full test suite (`pnpm run test`) and ensure all tests pass. If any fail, debug and fix.

7. **Postmortem** (`instructions_postmortem_v4.md`)
   - Create `instructions_postmortem_v4.md` summarising:
     - **Achievements:** what tooling was installed and configured (monorepo orchestration, Changesets, ESLint/Prettier, commit hooks, CI workflow).
     - **Guidance for v5:** note that the next step will scaffold the backend SDK using Fastify and Prisma, emphasising how the monorepo setup and CI will support iterative development.
     - **Caveats & decisions:** discuss choices such as Turborepo vs Nx, commit linting configuration, any lint rules disabled/enabled, and issues encountered during integration.
   - Commit all changes with an appropriate message, e.g. `chore(v4): set up toolchain, linting, and CI`.

## Format

- Write configuration files using proper syntax for their respective formats (JSON, YAML, JavaScript).
- Use markdown headings to organise the postmortem clearly.
- All commit messages should conform to the Conventional Commits standard.
