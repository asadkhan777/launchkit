# instructions_v14.md

## Role

In **v14**, as the autonomous **CLI coding agent**, your mission is to refine the **frontend application** by enhancing navigation, data flow, and visual polish. You will build interactive UIs, handle complex states gracefully, and elevate the look and feel using the design system created earlier. The goal is to make the application delightful and intuitive for users while preserving accessibility and performance.

## Task

1. **Navigation and routing**
   - Audit the existing page structure and ensure navigation flows smoothly between pages. Use the Next.js **Link** component for internal navigation and clearly highlight the active page in the Navbar.
   - Implement breadcrumbs or progress indicators where appropriate (e.g. within the dashboard when editing a course).
   - Add dynamic routes for courses (e.g. `app/courses/[slug]/page.tsx`) that display individual course details by slug. Use the API client from v13 to fetch course data.

2. **State management**
   - For complex UI interactions (e.g. editing a course, handling modals), introduce a lightweight state management solution if needed. Options include **Zustand** or **React Context**. Choose the simplest tool that meets your needs.
   - Ensure that form states persist when navigating back and forth (e.g. partially filled forms do not lose data). Consider using the browser’s `History` state or local storage for draft states.

3. **Interactive UI components**
   - Expand the design system to include components such as `Tabs`, `Accordion`, `Tooltip`, `Popover`, and `Dropdown`. Wrap Radix primitives and style them with Tailwind.
   - Use these components to structure complex pages:
     - **Dashboard:** Add tabs for “Courses”, “Orders”, and “Settings”. Display lists of orders and allow filtering/sorting.
     - **Course Editor:** On dynamic course pages, provide an editable list of lessons with drag‑and‑drop reordering (use a library like **@dnd-kit**).
   - Introduce micro‑interactions using **framer-motion** for subtle animations such as fading, sliding, and scaling. Respect user preferences for reduced motion by checking `prefers-reduced-motion`.

4. **Visual enhancements**
   - Apply gradients, drop shadows, and modern typography consistent with the brand tone (engineered, trustworthy, optimistic). Use the tokens defined in Tailwind for colours and spacing.
   - Improve CTAs with hover and focus states to guide user action.
   - Ensure that text is legible and that there is sufficient colour contrast (use tools like **color-contrast-checker** in development).

5. **Error handling and edge cases**
   - Implement optimistic UI updates for actions like creating or editing a course. Show placeholder items immediately, then reconcile with the server response. Roll back changes and display an error if the API call fails.
   - Cover common edge cases (empty states, network failures) with friendly messaging and recovery options.

6. **Tests and lighthouse**
   - Expand unit tests to cover new interactive components and state management logic.
   - Update E2E tests to account for dynamic routes and interactive behaviours (e.g. dragging lessons).
   - Run Lighthouse again on the updated landing and dashboard pages. Ensure performance and accessibility scores remain ≥ 90. If not, investigate and optimise (e.g. remove unused code, lazy-load heavy components).

7. **Commit and Postmortem** (`instructions_postmortem_v14.md`)
   - Commit changes in small increments with messages such as `feat(web): add dynamic course routes` and `feat(ui): add tabs and drag-and-drop lessons`.
   - Create `instructions_postmortem_v14.md` summarising:
     - **Work completed:** enhanced navigation, added dynamic routes, implemented advanced components and animations.
     - **User experience impact:** highlight improvements to usability and aesthetics.
     - **Remaining issues:** note any remaining rough edges (e.g. performance regressions due to animations) and propose solutions.
   - Commit the postmortem with a message like `docs(v14): add advanced frontend postmortem`.

## Format

- Keep UI components modular and well‑documented; avoid monolithic files.
- Use Tailwind classes consistently; avoid inline styles for maintainability.
- Ensure all interactive elements are accessible via keyboard and screen readers.
