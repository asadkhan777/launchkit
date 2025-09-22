# instructions_v8.md

## Role

In **v8**, your role as the autonomous **CLI coding agent** is to elevate the **backend testing strategy** of LaunchKit AI to a comprehensive and reliable foundation. You will ensure that all API layers, SDK functions, and database interactions have robust unit and integration test coverage. This focuses on the completed backend infrastructure (V5-V7) and prepares a solid testing foundation before frontend development begins.

## Task

1. **Review the current state**
   - Read `instructions_postmortem_v7.md` to understand the observability integration
   - Examine existing test suites in `packages/sdk/test` and `apps/api/test` to gauge current coverage
   - Identify gaps in unit test coverage for SDK and API layers

2. **Enhanced Unit Tests**
   - Audit your codebase and ensure every function exposed by the SDK and API layers has comprehensive unit tests
   - Use **Vitest** for all unit testing with proper mocking strategies
   - Ensure each unit test covers positive and negative scenarios, including input validation, error handling, and edge cases
   - Add unit tests for observability modules (OpenTelemetry, Sentry integration)
   - Test configuration loading and environment variable handling

3. **Comprehensive Integration Tests**
   - For the API, ensure integration tests spin up the real Fastify server and test all endpoints
   - Use **Testcontainers** library to launch transient PostgreSQL databases for integration tests
   - Install and configure **testcontainers-node** for database lifecycle management
   - Test database migrations, schema validation, and data integrity
   - Integration test the complete course creation and retrieval flows
   - Test error handling, validation, and proper HTTP status codes

4. **Database Testing Strategy**
   - Create test data factories for consistent, realistic test scenarios
   - Implement proper test isolation with database cleanup between tests
   - Test Prisma ORM edge cases, transactions, and constraint violations
   - Validate database performance with realistic data volumes
   - Test backup and restore procedures

5. **API Contract Testing**
   - Validate OpenAPI specification compliance with actual API behavior
   - Test request/response schema validation using Zod
   - Ensure API versioning and backward compatibility
   - Test rate limiting, authentication middleware (when added)
   - Validate CORS configuration and security headers

6. **Performance & Load Testing**
   - Create basic load tests for critical API endpoints
   - Test database connection pooling under load
   - Validate observability overhead and performance impact
   - Benchmark course generation performance
   - Test memory usage and resource cleanup

7. **Test Infrastructure**
   - Improve test orchestration and parallel execution
   - Add test result reporting and coverage metrics
   - Integrate enhanced testing into CI workflow
   - Add caching for test dependencies to speed up repeated runs
   - Create test environment setup and teardown procedures

8. **Observability Testing**
   - Test OpenTelemetry trace generation and export
   - Validate Sentry error capture and PII filtering
   - Test health endpoint behavior under various failure scenarios
   - Mock external dependencies (OTLP collectors, Sentry DSN)
   - Test graceful degradation when observability services are unavailable

9. **Run the enhanced test suite**
   - Execute all unit and integration tests locally
   - Ensure tests pass consistently and aren't flaky
   - Validate test performance and execution time
   - Fix any identified coverage gaps or test reliability issues

10. **Postmortem** (`instructions_postmortem_v8.md`)
    - Document the comprehensive backend testing strategy
    - Report on test coverage improvements and quality metrics
    - Identify any remaining testing debt or areas for improvement
    - Provide recommendations for frontend testing strategy (V16)

- Commit the postmortem and changes with a message such as `test(v8): add comprehensive testing pyramid`.

## Format

- Organise tests by layer and package (e.g. `apps/api/test` for API integration tests, `packages/ui/stories` for Storybook stories).
- Keep tests deterministic; avoid random data unless you seed it.
- Document how to run each test suite in the root README or separate docs.
