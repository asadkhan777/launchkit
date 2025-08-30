# LaunchKit AI SDK

Internal SDK for LaunchKit AI backend operations. Provides type-safe functions for database operations and server management.

## Features

- **Course Management**: Create, list, and retrieve courses with lessons
- **Type Safety**: Full TypeScript support with Zod validation
- **Database**: Prisma-powered database operations
- **Server**: Fastify server with health checks
- **Testing**: Comprehensive test suite with 100% coverage

## Usage

```typescript
import { SDK } from '@launchkit-ai/sdk';

// Create a course
const course = await SDK.courses.create({
  ownerId: 'user-123',
  title: 'My Course',
  description: 'Course description',
  lessons: [
    { title: 'Lesson 1', content: 'Lesson content' }
  ]
});

// List courses
const courses = await SDK.courses.list('user-123');

// Start server
const server = await SDK.server.start({ port: 3001 });
```

## TODO

- [ ] Generate TypeScript client from OpenAPI specification
- [ ] Add user management functions
- [ ] Add order/payment functions
- [ ] Add lesson-specific operations
- [ ] Add advanced querying and filtering
- [ ] Add rate limiting and caching
- [ ] Add monitoring and logging integrations
