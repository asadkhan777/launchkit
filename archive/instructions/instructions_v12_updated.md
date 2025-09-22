# instructions_v12.md

## Role

As the autonomous **CLI coding agent** for LaunchKit AI, your goal in **v12** is to **enhance and complete the existing Next.js application** by integrating the design system from V11, improving layouts, navigation, and SEO, while leveraging the automated development environment from V11.5. Focus on creating a production-ready frontend shell that demonstrates the full course creation workflow.

## Context Analysis

**Current State**: The project already has a Next.js app structure with:

- Basic marketing page at `app/(marketing)/page.tsx` with forms for import/generate
- Dashboard at `app/dashboard/page.tsx` with course listing from Prisma
- API routes for checkout, generate, import, and Stripe webhooks
- Design system established in `packages/ui` with Button, Input, Modal, Toast, EmptyState components
- Unified development environment with `pnpm dev` command
- Tailwind CSS configured with `styles/globals.css`

**V11 Foundation**: Design system with Radix UI primitives, Storybook documentation, comprehensive testing
**V11.5 Foundation**: Unified ESLint, automated dependency management, intelligent test router, build optimization

## Execution Approach

**Apply Focused Execution Mode** (V11/V11.5 success pattern):

- Load context once, execute without analysis paralysis
- Batch related operations for maximum velocity
- Maintain quality standards through comprehensive testing
- Leverage existing infrastructure and automation

## Task

1. **Assessment and Enhancement**
   - Audit existing Next.js structure in root `app/` directory
   - Integrate `@launchkit-ai/ui` components into existing pages
   - Enhance current marketing page with production-ready design system components
   - Improve existing dashboard with better UX and design system integration

2. **Layout and Navigation System**
   - Create proper `app/layout.tsx` to replace the basic marketing layout
   - Include design system provider, proper meta tags, and global CSS imports (leverage existing `styles/globals.css`)
   - Build responsive `Navbar` component using `@launchkit-ai/ui` Button and design tokens
   - Implement proper navigation between marketing, learn, and dashboard sections
   - Add footer component with links and branding

3. **Marketing Page Transformation**
   - Enhance existing `app/(marketing)/page.tsx` with production-ready design
   - Replace basic forms with `@launchkit-ai/ui` components (Button, Input, Modal)
   - Create compelling hero section showcasing LaunchKit AI value proposition
   - Add social proof section with testimonials/logos
   - Build features section highlighting: import content → generate course → publish → monetize
   - Implement pricing/CTA section with proper call-to-action buttons

4. **Dashboard Enhancement**
   - Improve existing `app/dashboard/page.tsx` with design system components
   - Use `@launchkit-ai/ui` EmptyState when no courses exist
   - Create course cards using design system tokens and components
   - Add loading states and error handling with proper accessibility
   - Implement responsive design for mobile and desktop

5. **New Pages and Features**
   - Create `app/learn/page.tsx` with comprehensive documentation:
     - Quickstart guide for new users
     - Step-by-step guides for course creation workflow
     - FAQ section addressing common questions and use cases
     - Changelog with version history and feature updates
   - Build `app/pricing/page.tsx` if not covered in marketing
   - Create proper error pages (`app/error.tsx`, `app/not-found.tsx`)
   - Add loading states (`app/loading.tsx`) with accessible design

6. **Component Architecture**
   - Create `components/` directory in root for shared components
   - Build reusable components: Navbar, Footer, Hero, FeatureCard, TestimonialCard
   - Ensure all components use `@launchkit-ai/ui` as foundation
   - Implement proper TypeScript interfaces for component props

7. **SEO and Performance Optimization**
   - Implement comprehensive metadata API usage for all pages
   - Add Open Graph tags, Twitter cards, and structured data
   - Optimize images with proper alt text and lazy loading
   - Ensure semantic HTML structure for accessibility
   - Configure proper font loading and optimization

8. **Testing and Quality Assurance**
   - Leverage V11.5 intelligent test router: `pnpm test`
   - Write unit tests for key components using Vitest and @testing-library/react
   - Create E2E tests with Playwright for critical user flows
   - Run Lighthouse audits targeting ≥90 Performance and Accessibility scores
   - Test responsive design across device breakpoints

9. **Integration with Existing Infrastructure**
   - Ensure compatibility with existing Prisma integration
   - Maintain existing API route structure
   - Leverage automated development environment (`pnpm dev`)
   - Use existing build optimization from V11.5

10. **Documentation and Commit Strategy**
    - Follow conventional commit format established in project
    - Create logical commit steps (layout → navigation → pages → testing)
    - Document any architectural decisions or compromises
    - Create comprehensive `instructions_postmortem_v12.md`

## Quality Standards

**Performance Requirements**:

- Lighthouse Performance score ≥90
- First Contentful Paint <1.5s
- Largest Contentful Paint <2.5s
- Cumulative Layout Shift <0.1

**Accessibility Requirements**:

- Lighthouse Accessibility score ≥90
- WCAG 2.1 AA compliance
- Proper semantic HTML structure
- Keyboard navigation support
- Screen reader compatibility

**Code Quality**:

- 100% TypeScript coverage
- Comprehensive error handling
- Responsive design (mobile-first)
- Clean, maintainable component architecture

## Success Criteria

1. **Enhanced User Experience**: Marketing page demonstrates clear value proposition with professional design
2. **Improved Developer Experience**: Components are reusable, well-typed, and documented
3. **Production Readiness**: High performance and accessibility scores, proper SEO
4. **Foundation for V13**: Clear patterns established for adding authentication and advanced features

## Format

- Use functional React components and TypeScript exclusively
- Organize components in logical directory structure
- Leverage Tailwind design tokens and `@launchkit-ai/ui` components
- Follow existing code style and architectural patterns
- Document component interfaces and usage patterns

---

**V12 Goal**: Transform the existing Next.js application into a production-ready frontend shell that showcases LaunchKit AI's capabilities while establishing patterns for rapid feature development in V13+.
