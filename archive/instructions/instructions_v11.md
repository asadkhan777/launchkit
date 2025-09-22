# instructions_v11.md

## Role

As the autonomous **CLI coding agent** for LaunchKit AI, your mission in **v11** is to establish a unified **design system and UI foundation**.  You will install a component library based on **Radix UI** and **shadcn/ui**, configure Tailwind for utility classes, define design tokens (colors, spacing, radius), and set up Storybook for documentation and visual testing.  This design system will provide accessible, consistent components for the entire application.

## Task

1. **Install UI dependencies**
   - In `packages/ui`, initialise a new package with its own `package.json`:
     ```json
     {
       "name": "@launchkit-ai/ui",
       "version": "0.1.0",
       "private": true,
       "main": "dist/index.js",
       "types": "dist/index.d.ts",
       "scripts": {
         "build": "tsc --build",
         "storybook": "storybook dev -p 6006",
         "build-storybook": "storybook build",
         "test": "vitest"
       },
       "dependencies": {
         "@radix-ui/react-button": "latest",
         "@radix-ui/react-dialog": "latest",
         "@shadcn/ui": "latest",
         "react": "*",
         "react-dom": "*",
         "tailwindcss": "latest"
       },
       "devDependencies": {
         "@storybook/react": "latest",
         "@storybook/addon-essentials": "latest",
         "@storybook/addon-a11y": "latest",
         "postcss": "latest",
         "autoprefixer": "latest",
         "typescript": "*",
         "vitest": "*"
       },
       "peerDependencies": {
         "react": "^18.2.0",
         "react-dom": "^18.2.0"
       }
     }
     ```
   - Install dependencies via `pnpm install` from the root.

2. **Configure Tailwind**
   - At the repository root (or within `packages/ui`), create a `tailwind.config.js` file that defines your design tokens:
     ```js
     module.exports = {
       content: [
         './packages/ui/src/**/*.{ts,tsx}',
         './apps/web/**/*.{ts,tsx}',
       ],
       theme: {
         extend: {
           colors: {
             brand: {
               primary: '#1d4ed8',
               secondary: '#9333ea',
               accent: '#10b981',
             },
           },
           borderRadius: {
             md: '0.375rem',
             lg: '0.5rem',
           },
         },
       },
       plugins: [],
     };
     ```
   - Create a PostCSS configuration (`postcss.config.js`) that loads `tailwindcss` and `autoprefixer`.

3. **Define base components**
   - Under `packages/ui/src/components`, create 5–10 foundational components wrapping Radix primitives and styled with Tailwind.  At minimum, implement:
     - `Button.tsx`: wrap `@radix-ui/react-button` and apply Tailwind classes for primary and secondary variants.
     - `Input.tsx`: create a styled input component with label support.
     - `Modal.tsx`: wrap `@radix-ui/react-dialog` to create a modal dialog.
     - `Toast.tsx`: implement a basic toast using Radix primitives or a minimal custom solution.
     - `EmptyState.tsx`: a simple component displaying an icon and message when lists are empty.
   - Export these components from `packages/ui/src/index.ts` for convenient import in other packages.

4. **Storybook setup**
   - Inside `packages/ui`, run `npx sb init` to scaffold a Storybook configuration.
   - Configure Storybook to use **React** and **Vite** (if available) to support Tailwind.  Add the `@storybook/addon-a11y` and `@storybook/addon-essentials` to the addons list in `.storybook/main.js`.
   - Create stories for each base component in `packages/ui/src/components/__stories__`.  Each story should demonstrate different states (e.g. primary/secondary button, disabled input) and include accessibility annotations if necessary.
   - Run `pnpm -C packages/ui run storybook` to verify that stories render correctly.  Fix any issues with Tailwind or component setup.

5. **Testing and accessibility**
   - Write unit tests for each component in `packages/ui/test`, using **@testing-library/react** and **Vitest**.  For example, test that the `Button` renders text and calls the `onClick` handler.
   - Use the Storybook **a11y addon** and `jest-axe` in component tests to validate accessibility.  Ensure that components have proper ARIA attributes and keyboard interactions.

6. **Publish and verify**
   - Build the UI package (`pnpm -C packages/ui run build`) and verify no TypeScript errors.
   - Generate the static Storybook site (`pnpm -C packages/ui run build-storybook`) and ensure the output directory contains compiled stories (useful for hosting docs in later versions).
   - Commit the new package and stories in logical chunks with messages like `feat(ui): add base Button component` and `chore(ui): configure Tailwind and Storybook`.

7. **Postmortem** (`instructions_postmortem_v11.md`)
   - Create `instructions_postmortem_v11.md` summarising:
     - **Achievements:** design system package created, tokens defined, base components implemented, Storybook configured, accessibility checks added.
     - **Next steps:** describe how the design system will be used in the web app shell (v12) and expanded with additional components as needed.
     - **Caveats:** note any limitations or issues (e.g. limited theming, missing icons) and propose future improvements.
   - Commit with a message like `docs(v11): add design system postmortem`.

## Format

- Keep component files small and focused on one piece of UI; separate styling concerns into class names rather than inline styles.
- Write clear JSDoc comments at the top of each component file describing its purpose, props, and usage.
- Use descriptive names for design tokens and document them in a central location (`tailwind.config.js`).