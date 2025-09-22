# instructions_v16.md

## Role

In **V16**, your role as the autonomous **CLI coding agent** is to implement comprehensive **end-to-end and system testing** for the complete LaunchKit AI platform. With the frontend application (V11-V14) and authentication system (V15) now complete, you will create E2E test suites that validate the entire user journey from sign-up to course purchase, implement visual regression testing for the design system, and establish accessibility compliance testing.

## Context

By V16, the LaunchKit AI platform should have:
- Complete frontend application with authentication (V11-V15)
- Design system with Storybook documentation (V11)
- API-frontend integration with real user flows (V13-V14)
- Payment integration and protected routes (V15)

## Task

1. **End-to-End User Journeys**
   - Install **Playwright** and **axe-core** for comprehensive E2E testing
   - Create test suites for complete user flows:
     - New user sign-up → course creation → content generation → landing page publish
     - Buyer journey: course discovery → purchase → access → consumption
     - Creator dashboard: course management, analytics, revenue tracking
   - Include authentication flows, protected routes, and payment integration
   - Test error scenarios: payment failures, authentication timeouts, API errors

2. **Visual Regression Testing**
   - Set up **Chromatic** or local visual snapshot testing for the design system
   - Create comprehensive Storybook coverage for all UI components
   - Implement visual regression tests for key user interface screens
   - Test responsive design across multiple viewport sizes
   - Validate design consistency across different browsers

3. **Accessibility Compliance Testing**
   - Integrate **axe-core** accessibility checks in all E2E tests
   - Ensure WCAG 2.1 AA compliance across the entire application
   - Test keyboard navigation, screen reader compatibility, and color contrast
   - Validate semantic HTML structure and ARIA labels
   - Create accessibility regression tests to maintain compliance

4. **Performance & Load Testing**
   - Implement **Lighthouse** performance audits for all key pages
   - Set up load testing for API endpoints under realistic traffic
   - Test course generation performance under concurrent users
   - Validate database performance with large datasets
   - Monitor memory usage and optimize resource consumption

5. **Cross-Browser & Device Testing**
   - Configure Playwright for multi-browser testing (Chrome, Firefox, Safari)
   - Test mobile responsiveness and touch interactions
   - Validate Progressive Web App (PWA) functionality if implemented
   - Test offline behavior and service worker functionality

6. **Test Data Management**
   - Create test data factories for realistic user scenarios
   - Implement database seeding for consistent test environments
   - Use **Testcontainers** for isolated test database instances
   - Create test user accounts and sample course content

7. **CI/CD Integration**
   - Update GitHub Actions to run E2E tests on pull requests
   - Implement parallel test execution to minimize CI runtime
   - Add test result reporting and failure notifications
   - Set up staging environment testing before production deployment

8. **Monitoring & Alerting Integration**
   - Create synthetic monitoring tests that run in production
   - Set up alerts for critical user journey failures
   - Implement health checks for external dependencies (Stripe, OpenAI)
   - Monitor SLO compliance with automated testing

9. **Security Testing**
   - Test authentication and authorization edge cases
   - Validate input sanitization and XSS protection
   - Test API rate limiting and abuse prevention
   - Verify secure payment processing and PCI compliance

10. **Documentation & Maintenance**
    - Create comprehensive test documentation and debugging guides
    - Document test environment setup and data requirements
    - Establish test maintenance procedures and review processes
    - Create troubleshooting guides for common test failures

11. **Run the complete test suite**
    - Execute unit, integration, E2E, visual, and accessibility tests
    - Ensure all tests pass in CI environment
    - Validate test performance and execution time
    - Fix any flaky or unreliable tests

12. **Postmortem** (`instructions_postmortem_v16.md`)
    - Document the comprehensive testing strategy implementation
    - Report on test coverage, performance metrics, and quality gates
    - Identify areas for ongoing test maintenance and improvement
    - Provide recommendations for production monitoring and quality assurance

## Success Criteria

- Complete E2E test coverage for all critical user journeys
- Visual regression testing preventing UI inconsistencies
- 100% accessibility compliance (WCAG 2.1 AA)
- Performance benchmarks meeting or exceeding SLO targets
- Reliable CI/CD pipeline with comprehensive quality gates
- Production-ready synthetic monitoring and alerting
