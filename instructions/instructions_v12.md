# instructions_v12.md

## Role

As the autonomous **CLI coding agent** for LaunchKit AI, your goal in **v12** is to build the initial **frontend application shell** using Next.js (App Router).  This shell will include layouts, navigation, pages, and SEO metadata; it will integrate the design system from v11 and prepare the stage for end‑to‑end features.  The finished landing page should score highly on performance and accessibility.

## Task

1. **Project setup**
   - Navigate to `apps/web` and create a `package.json` if one does not exist.  Include the following dependencies:
     ```json
     {
       "name": "@launchkit-ai/web",
       "private": true,
       "version": "0.1.0",
       "scripts": {
         "dev": "next dev",
         "build": "next build",
         "start": "next start",
         "lint": "next lint",
         "test": "vitest"
       },
       "dependencies": {
         "next": "latest",
         "react": "*",
         "react-dom": "*",
         "@launchkit-ai/ui": "workspace:*",
         "@launchkit-ai/sdk": "workspace:*"
       },
       "devDependencies": {
         "typescript": "*",
         "@types/react": "*",
         "@types/node": "*",
         "tailwindcss": "latest",
         "postcss": "latest",
         "autoprefixer": "latest",
         "vitest": "*"
       }
     }
     ```
   - Install dependencies via `pnpm install` at the project root.
   - Create `tsconfig.json` in `apps/web` that extends the root config and specifies `next` types.

2. **Global styling**
   - Create a `globals.css` under `apps/web/app` (or `src` if using a different structure) that imports Tailwind base, components, and utilities:
     ```css
     @tailwind base;
     @tailwind components;
     @tailwind utilities;
     ```
   - Configure `postcss.config.js` in `apps/web` to use Tailwind and Autoprefixer.

3. **Layouts and pages**
   - Use the **App Router** under `apps/web/app`:
     - Create `layout.tsx` at the root of `app/` to define global HTML structure, `<head>` tags (title, meta description), and include the design system provider if needed.
     - Include the imported `globals.css` in the layout.
   - Create the **landing page** at `app/page.tsx` (this is the default route).  Use UI components from `@launchkit-ai/ui` to compose:
     - A hero section with a strong headline and subheadline introducing LaunchKit AI’s value proposition.
     - Social proof section (placeholder for testimonials or logos).
     - Features section describing key benefits (import content, generate micro‑course, publish landing, get paid).
     - Pricing/CTA section with buttons linking to a sign‑up or login page (these pages can be empty placeholders for now).
   - Create a **Learn page** at `app/learn/page.tsx` that contains sections for Quickstart, Guides, FAQ, and Changelog.  Populate with placeholder text that can be replaced in later versions.
   - Create a **Dashboard** page at `app/dashboard/page.tsx` protected by a placeholder auth check (e.g. a fake `isAuthenticated` boolean).  Render a table or card list that will later display courses and revenue metrics.

4. **Navigation**
   - Create a shared `Navbar` component in `apps/web/components/Navbar.tsx` that uses `next/link` to link between the home page, Learn page, and Dashboard (if authenticated).  Style the navbar using Tailwind.
   - Render the Navbar inside `layout.tsx` so it appears on all pages.

5. **Error and loading states**
   - Implement `error.tsx` and `loading.tsx` files in `app/` to handle global error boundaries and loading indicators.  Use accessible components (e.g. a spinner with an `aria-label`).

6. **SEO and metadata**
   - Use Next.js’s metadata API to set default SEO attributes (title, description, og:image, etc.).  Ensure each page component exports a `metadata` object with relevant information.

7. **Testing & quality**
   - Write unit tests for key components (Navbar, Layout) using **@testing-library/react** and **Vitest**.  Test navigation links render correctly and pages mount without errors.
   - Use Playwright to run a smoke E2E test that launches the Next.js app, navigates between pages, and asserts that hero text and navigation items are present.
   - Run **Lighthouse** (can use `npx lighthouse` on the local URL) to check performance and accessibility.  Ensure the landing page scores ≥ 90 on Performance and Accessibility.  Identify any issues (e.g. images without alt text, unused CSS) and fix them.

8. **Commit and Postmortem** (`instructions_postmortem_v12.md`)
   - Commit your work in logical steps (e.g. `feat(web): add landing page`, `feat(web): implement Learn page`, `feat(web): add Navbar`).
   - Create `instructions_postmortem_v12.md` summarising:
     - **Completed work:** creation of web app shell, pages, navigation, global styling, and testing.
     - **Readiness for v13:** note that next steps include hooking up API calls and displaying real data.
     - **Caveats:** mention any performance or accessibility issues discovered during Lighthouse testing and how they were addressed, or deferred for later.
   - Commit the postmortem with a message like `docs(v12): add web shell postmortem`.

## Format

- Use functional React components and TypeScript for all pages and components.
- Organise components in a `components/` directory under `apps/web` for reuse.
- Keep CSS classes declarative and derive as much styling as possible from the design system tokens defined in Tailwind.