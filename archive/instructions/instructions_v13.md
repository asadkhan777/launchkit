# instructions_v13.md

## Role

As the autonomous **CLI coding agent** for LaunchKit AI, your task in **v13** is to connect the front‑end application to the backend API created in earlier versions. You will create client hooks or services that call the API endpoints, display data in the UI, and handle loading and error states. The goal is to deliver a full round‑trip demonstration: user interactions in the UI result in HTTP calls to the API, and responses are rendered on screen.

## Task

1. **Review API and SDK**
   - Familiarise yourself with the SDK functions implemented in v5 and the API routes created in v6. You will call these endpoints from the front‑end.
   - Ensure that the API is running (e.g. `pnpm -C apps/api dev` on port 4000) and that environment variables such as `NEXT_PUBLIC_API_URL` are configured. Add `NEXT_PUBLIC_API_URL=http://localhost:4000` to `apps/web/.env.local` (do not commit secrets).

2. **HTTP client setup**
   - In `apps/web`, create a utility module `lib/apiClient.ts` that abstracts fetch calls to the API. Use the `fetch` API or a small library like **SWR** or **React Query** (e.g. `@tanstack/react-query`). Install if necessary (`pnpm add @tanstack/react-query`).
   - Create type definitions for the API responses based on the OpenAPI spec (you can import types from the SDK or re‑use Zod schemas).
   - Implement basic CRUD functions: `createCourse`, `fetchCourses`, etc., that call `POST /courses` and `GET /courses` respectively.

3. **Context provider**
   - Set up a **React Query** provider in `apps/web/app/layout.tsx` or a higher‑order component so that queries and mutations can be used across the app.
   - Optionally encapsulate API calls in a custom hook (`useCourses`) that wraps `useQuery` and `useMutation` to fetch and mutate course data.

4. **UI integration**
   - On the **Dashboard** page, replace placeholder content with real data fetched from the API:
     - Use the `useCourses` hook to fetch courses for a hard‑coded `ownerId` or read from an auth context when available.
     - Display the returned list using your design system components (e.g. cards or table rows).
     - Provide a simple form to create a new course by calling `createCourse` with a title and description; after submission, refresh the course list. Use form components from `@launchkit-ai/ui` and handle validation errors.
   - On the **Landing** page, if appropriate, call an API endpoint (e.g. to fetch pricing tiers or feature flags) and render the results.

5. **Error and loading states**
   - Ensure that all API calls handle loading states (e.g. show a spinner when fetching) and error states (e.g. display an alert or toast when a request fails). Use the design system’s toast component to surface errors.

6. **Tests**
   - Add unit tests for the API client functions. Use `msw` (Mock Service Worker) to simulate API responses without requiring a live server.
   - Write integration tests (e.g. with Playwright) that simulate a user visiting the Dashboard, creating a course, and seeing it appear in the list. Stub network requests as needed.
   - Update any existing E2E tests to reflect the real API interaction.

7. **Run and debug**
   - Start the API and web servers concurrently (e.g. `pnpm dev` at the root runs both via Turbo). Ensure that course creation and retrieval flows work end‑to‑end.
   - Use browser DevTools or Postman to inspect network requests for correctness.
   - Fix any issues (e.g. incorrect API URL, CORS issues) and commit the fixes.

8. **Postmortem** (`instructions_postmortem_v13.md`)
   - Create `instructions_postmortem_v13.md` detailing:
     - **Completed tasks:** setting up the API client, integrating React Query, displaying real data on the dashboard, handling loading/error states.
     - **Next steps:** describe future UI enhancements (v14) and authentication integration (v15).
     - **Challenges:** record any cross‑origin or type mismatch issues and how they were resolved.
   - Commit with a message like `feat(v13): wire frontend to backend API`.

## Format

- Use TypeScript for all client code; derive types from the OpenAPI spec or Zod schemas where possible.
- Keep API client functions in a dedicated `lib/` directory and avoid scattering fetch calls across components.
- Ensure hooks handle stale data and retries sensibly via React Query’s configuration.
