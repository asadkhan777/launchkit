# LaunchKit.ai

*Created on 2025-08-29*

LaunchKit.ai is an AI-powered course creation platform that helps you transform any content into engaging micro-courses. Built with a modern monorepo architecture using Next.js, TypeScript, and Prisma.

## Overview

This platform enables you to paste a URL (Notion, blog, etc.) and automatically extract content to generate comprehensive 5-day micro-course outlines, email sequences, and landing pages. Built for rapid iteration from idea to monetization.

## Architecture

### Monorepo Structure
```
apps/
├── api/          # Fastify REST API server
└── web/          # Next.js frontend application

packages/
├── sdk/          # Backend SDK with Prisma & database operations
├── common/       # Shared utilities and types
├── ui/           # React UI component library
└── tests/        # Centralized testing utilities
```

### Technology Stack
- **Frontend**: Next.js 15, React 18, TypeScript
- **Backend**: Fastify REST API wrapping SDK functionality
- **Database**: Prisma ORM with SQLite (dev) / PostgreSQL (prod)
- **Testing**: Vitest with comprehensive integration tests
- **Tooling**: Turborepo, ESLint, Prettier, Husky

## Features

- 🔗 **Content Import**: Paste URLs to extract and process content
- 🤖 **AI Generation**: Create 5-day micro-course outlines and email sequences  
- 📊 **Dashboard**: Manage and organize your courses
- 💳 **Payments**: Stripe integration for monetization
- 🧪 **Testing**: Comprehensive test coverage with database isolation
- 📦 **Monorepo**: Scalable architecture with shared packages

## Quick Start

1. **Install dependencies**
```bash
pnpm install
```

2. **Setup database**
```bash
pnpm prisma generate
pnpm prisma db push
```

3. **Configure environment**
```bash
cp .env.example .env
# Fill in STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, STRIPE_PRICE_ID
```

4. **Run development servers**
```bash
# Start all services
pnpm dev

# Or start individually
pnpm --filter @launchkit-ai/web dev    # Frontend (port 3000)
pnpm --filter @launchkit-ai/api dev    # API (port 8000)
```

5. **Run tests**
```bash
pnpm test                 # All packages
pnpm test:watch          # Watch mode
```

## API Endpoints

### Health Check
- `GET /healthz` - Server health status

### Courses
- `POST /courses` - Create a new course
- `GET /courses?ownerId={id}` - List courses by owner

## Development Workflow

### Building
```bash
pnpm build              # Build all packages
pnpm --filter web build # Build specific package
```

### Testing

#### Comprehensive Test Suite
```bash
# Run all tests across the entire monorepo
pnpm test                    # All packages (unit + integration)

# Component-specific testing
pnpm test:api               # API integration & unit tests
pnpm test:sdk               # SDK unit tests  
pnpm test:web               # Web app tests (when available)
pnpm test:ui                # UI component tests
pnpm test:common            # Common utilities tests

# Test category targeting
pnpm test:unit              # All unit tests (SDK + API + UI + Common)
pnpm test:integration       # Database & API integration tests
pnpm test:e2e               # End-to-end browser tests (V16+)
pnpm test:visual            # Visual regression tests (V16+)

# Development & debugging
pnpm test:watch             # Watch mode for active development
pnpm test:coverage          # Generate coverage reports
pnpm test:e2e:ui            # E2E tests with Playwright UI
pnpm test:e2e:debug         # E2E tests in debug mode

# Utilities
pnpm test:clean             # Clean up test artifacts (temp DBs, snapshots)
```

#### Test Architecture
- **Unit Tests**: Business logic validation (Vitest)
- **Integration Tests**: Database operations & API endpoints (Vitest + SQLite)
- **E2E Tests**: Full system workflows (Playwright) - *V16+*
- **Visual Tests**: Component regression testing (Storybook + Chromatic) - *V16+*

### Linting
```bash
pnpm lint               # Lint all packages
pnpm lint:fix          # Auto-fix linting issues
```

## Deployment

The monorepo is configured for easy deployment:
- **Web App**: Deploy Next.js app to Vercel/Netlify
- **API**: Deploy Fastify server to Railway/Render
- **Database**: PostgreSQL on Supabase/PlanetScale

## Contributing

1. Follow the established patterns in each package
2. Add tests for new functionality
3. Ensure all tests pass: `pnpm test`
4. Follow commit conventions for changesets

## License

MIT License - see LICENSE file for details.

1. Add a page that saves the draft into the database with a slug
using a Server Action or API route.
2. Create a Stripe product & price in your dashboard; set `STRIPE_PRICE_ID`.
3. Update the buy button to call `/api/checkout` with your course ID + price ID.
4. Handle the webhook in `app/api/webhooks/stripe/route.ts` to record orders.

For further improvements: server actions, authentication, multi-tenancy,
improved UI/UX, and connecting to other content sources.

## License

MIT
