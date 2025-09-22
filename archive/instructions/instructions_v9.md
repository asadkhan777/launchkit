# instructions_v9.md

## Role

In **v9**, as the autonomous **CLI coding agent**, your responsibility is to enhance the security posture of the LaunchKit AI project. You will audit the codebase against the **OWASP Top 10** and **ASVS** standards, implement secure defaults such as HTTP security headers and Content Security Policy (CSP), perform static application security testing (SAST), and introduce dependency and container scanning. The goal is to reduce the attack surface and ensure compliance with industry best practices.

## Task

1. **Threat modelling and checklist review**
   - Create a document `docs/06-threat-model.md` outlining potential threats based on the OWASP Top 10 categories (Injection, Broken Authentication, Sensitive Data Exposure, etc.). Identify which risks are most relevant to LaunchKit AI (e.g. injection attacks on the API, insecure deserialisation, misconfigured security headers) and suggest mitigations.
   - Include references to the ASVS for authentication, session management, and data validation requirements.

2. **Dependency scanning**
   - Add a dependency scanning step to the CI workflow using **Snyk** or **OWASP Dependency‑Check**. For example, use the GitHub Action `snyk/actions/node` to scan for vulnerable packages. Alternatively, run `npx dependency-check` in CI and fail the build if critical CVEs are found.
   - Document how to update dependencies and review advisories regularly.

3. **Static Application Security Testing (SAST)**
   - Integrate **Semgrep** (or a similar SAST tool) into CI:
     - `pnpm add -D semgrep`.
     - Create a `.semgrep.yml` configuration file that extends recommended rulesets for JavaScript/TypeScript and Node.js.
     - Add a CI job that runs `semgrep scan` on the repository and fails on high‑severity issues.

4. **HTTP security headers and CSP**
   - In the API (Fastify) application, register the **@fastify/helmet** plugin to set secure HTTP headers such as `Strict-Transport-Security`, `X-Content-Type-Options`, and `X-Frame-Options`.
   - Configure a **Content Security Policy (CSP)** header via `helmet`’s `contentSecurityPolicy` options. Start in report‑only mode (e.g. use `report-uri` to monitor CSP violations) and switch to enforcement in later versions.
   - Update any Next.js configuration (for the web app in future versions) to include similar headers using the built‑in `headers()` API.

5. **Input and output validation**
   - Audit all API endpoints and SDK functions to ensure inputs are validated using Zod (or other schemas). Add tests to ensure invalid inputs are rejected and proper error messages are returned.
   - Sanitize outputs by whitelisting fields returned from the database. Avoid leaking internal identifiers or secrets (e.g. Prisma `password` fields if added in the future).

6. **Rate limiting**
   - Add a basic rate limiter to the API using **@fastify/rate-limit**:
     - Install the package and register it globally with sensible defaults (e.g. 100 requests per IP per minute). Provide configuration via environment variables.
     - Write integration tests to ensure rate limiting returns 429 responses after the threshold is exceeded.

7. **Secrets management**
   - Ensure all sensitive configuration (database URLs, Stripe keys, Sentry DSN, etc.) are referenced via environment variables. Update `.env.example` to list required variables without values.
   - Document in README how to set up secrets using a secret manager (e.g. Vercel secrets, GitHub Actions secrets, or cloud-specific secret stores). Do not commit secrets to the repository.

8. **Least‑privileged roles**
   - Review database access roles. For example, ensure the Prisma client uses a database user with only the permissions needed to read/write the application tables. Document the role requirements in `docs/06-threat-model.md`.
   - If using external services (e.g. Sentry, OTLP exporters), use API keys with minimal scopes.

9. **Verification and testing**
   - Run the dependency scanner and SAST locally; fix any flagged issues. Document findings in the postmortem.
   - Run all tests to ensure that adding helmet, rate limiting, and validation does not break existing functionality.
   - Test the CSP in report‑only mode by triggering a violation (e.g. loading an inline script) and verifying that the report appears in the configured endpoint (this may require manual testing or stubbing in tests).

10. **Postmortem** (`instructions_postmortem_v9.md`)
    - Compose `instructions_postmortem_v9.md` detailing:
      - **Implemented security measures:** threat model document, dependency scanning, SAST integration, security headers, CSP, input/output validation, rate limiting, and secret management.
      - **Remaining risks and future work:** e.g. implementing authentication and authorisation (planned for v15), performing penetration testing, and adopting runtime scanning tools.
      - **Lessons learned:** summarise any vulnerabilities discovered during scanning and how they were remediated.
    - Commit the postmortem and code changes with a message like `security(v9): harden API with headers, rate limiting, and scanners`.

## Format

- Structure the threat model document with headings for each OWASP category and bullet points for mitigation strategies.
- Use YAML for CI workflow modifications and .semgrep configuration.
- Keep environment variable names consistent across `.env.example`, documentation, and code.
