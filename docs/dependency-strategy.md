# Dependency Management Strategy

## Current State Analysis

### Root Package Dependencies (Issue)

- **64+ dependencies** in root mixing concerns
- API-specific: Fastify, OpenTelemetry, Sentry
- UI-specific: React, React-DOM, React Hook Form
- Database: Prisma client & CLI
- Build tools: Turbo, TypeScript, ESLint plugins
- Testing: Vitest, Playwright, Testcontainers

### Correct Dependency Ownership

#### Root (Workspace Coordination Only)

```json
{
  "devDependencies": {
    "@changesets/cli": "^2.27.0",
    "@eslint/js": "^9.34.0",
    "eslint": "^9.6.0",
    "husky": "^8.0.0",
    "lint-staged": "^15.0.0",
    "prettier": "^3.0.0",
    "turbo": "^2.0.0",
    "typescript": "^5.5.4"
  }
}
```

#### API Package (apps/api)

```json
{
  "dependencies": {
    "@fastify/caching": "^9.0.3",
    "@fastify/compress": "^8.0.0",
    "@opentelemetry/api": "^1.9.0",
    "@opentelemetry/auto-instrumentations-node": "^0.62.1",
    "@opentelemetry/exporter-trace-otlp-http": "^0.203.0",
    "@opentelemetry/instrumentation-fastify": "^0.48.0",
    "@opentelemetry/sdk-node": "^0.203.0",
    "@prisma/client": "6.15.0",
    "@sentry/node": "^10.8.0",
    "prisma": "^6.15.0",
    "stripe": "14.1.0",
    "zod": "3.23.8"
  },
  "devDependencies": {
    "@types/node": "^20.14.9",
    "@types/supertest": "^6.0.3",
    "supertest": "^7.1.4",
    "testcontainers": "^11.5.1",
    "vitest": "^3.2.4"
  }
}
```

#### UI Package (packages/ui)

```json
{
  "dependencies": {
    "react": "18.2.0",
    "react-dom": "18.2.0"
  },
  "devDependencies": {
    "@types/react": "18.2.21",
    "@types/react-dom": "18.2.7",
    "eslint-plugin-jsx-a11y": "^6.10.2",
    "eslint-plugin-react": "^7.37.5",
    "eslint-plugin-react-hooks": "^5.2.0"
  }
}
```

#### Web Package (apps/web)

```json
{
  "dependencies": {
    "@hookform/resolvers": "3.2.0",
    "next": "15.5.2",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "react-hook-form": "7.46.0"
  },
  "devDependencies": {
    "autoprefixer": "10.4.19",
    "postcss": "8.4.39",
    "tailwindcss": "3.4.9"
  }
}
```

#### Tests Package (packages/tests)

```json
{
  "devDependencies": {
    "@axe-core/playwright": "^4.10.2",
    "@playwright/test": "^1.55.0",
    "@vitest/ui": "^3.2.4",
    "axe-playwright": "^2.1.0",
    "jest-image-snapshot": "^6.5.1",
    "jsdom": "23.0.0",
    "@types/jsdom": "^21.1.6",
    "vite-tsconfig-paths": "^5.1.4",
    "vitest": "^3.2.4"
  }
}
```

## Implementation Plan

### Phase 1: Create Dependabot Configuration

- Automated dependency updates by package scope
- Security vulnerability scanning
- Monthly audit cycles

### Phase 2: Gradual Migration

- Move dependencies to correct packages incrementally
- Test each migration to ensure functionality
- Update import paths as needed

### Phase 3: Workspace Protocol Enforcement

- Use `workspace:*` for internal dependencies
- Establish peer dependency relationships
- Document dependency boundaries

## Success Metrics

- ✅ Clear dependency ownership documented
- ✅ Automated dependency update PRs
- ✅ 30% reduction in duplicate dependencies
- ✅ Zero cross-package dependency leaks
