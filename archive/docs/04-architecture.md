# Architecture Documentation

## System Overview

LaunchKit AI is a content-to-course generation platform that enables creators to automatically transform their existing content into monetizable online courses with integrated payment processing.

## C4 Context Diagram

### Actors

#### Primary Actors

- **Creator**: Solo creators, indie SaaS founders, consultants/coaches who have existing content they want to monetize
- **Buyer**: End customers who purchase and consume the generated courses
- **System Admin**: Platform administrators who monitor system health and manage operations

#### External Systems

- **Notion API**: Source of content extraction (creator's Notion pages)
- **Stripe**: Payment processing and webhook notifications
- **AI/LLM Provider**: Content analysis and course generation (OpenAI, Anthropic, etc.)

### System Boundary

LaunchKit AI platform consists of:

- Content extraction and analysis
- AI-powered course generation
- Landing page creation
- Payment processing integration
- Course delivery system

## C4 Container Diagram

### Frontend Container (Next.js App)

- **Technology**: Next.js 15, React 18, TypeScript
- **Location**: `apps/web/`
- **Responsibilities**:
  - Creator dashboard for content import and course management
  - Course landing pages with Stripe checkout integration
  - Student course access and consumption interface
  - Real-time course generation status updates

### Backend API Container (Fastify)

- **Technology**: Fastify, TypeScript, Prisma ORM
- **Location**: `apps/api/`
- **Responsibilities**:
  - RESTful API for all platform operations
  - Content extraction from external sources (Notion)
  - AI integration for course generation
  - Stripe webhook processing
  - Authentication and authorization
  - Course and user data management

### Database Container (SQLite/PostgreSQL)

- **Technology**: SQLite (development), PostgreSQL (production)
- **Location**: `prisma/`
- **Responsibilities**:
  - Persistent storage for users, courses, lessons, and orders
  - Course generation metadata and status tracking
  - Payment transaction records
  - User authentication and session data

### Shared Packages

- **Common Package** (`packages/common/`): Shared utilities, validation schemas, types
- **UI Package** (`packages/ui/`): Design system components and theme
- **SDK Package** (`packages/sdk/`): Type-safe client library for API consumption

## Data Flow Architecture

### Course Creation Flow

1. **Creator** pastes Notion URL in frontend
2. **Frontend** sends POST to `/api/v1/import` with URL
3. **API** extracts content from Notion API
4. **API** sends content to AI provider for course generation
5. **API** stores generated course structure in database
6. **Frontend** polls `/api/v1/courses/{id}/status` for completion
7. **Creator** reviews and publishes course

### Purchase Flow

1. **Buyer** visits course landing page
2. **Frontend** displays course info from `/api/v1/courses/{slug}`
3. **Buyer** clicks purchase, redirected to Stripe checkout
4. **Stripe** processes payment and sends webhook to `/api/v1/webhooks/stripe`
5. **API** creates Order record and sends access email
6. **Buyer** accesses course content via secure link

### Course Access Flow

1. **Buyer** visits course access link with token
2. **Frontend** validates token via `/api/v1/access/validate`
3. **API** verifies order and returns course content
4. **Frontend** renders lessons with progress tracking

## REST API Resources

### Core Endpoints

#### Content Management

- `POST /api/v1/import` - Import content from external source
- `POST /api/v1/generate` - Generate course from imported content
- `GET /api/v1/courses` - List creator's courses
- `GET /api/v1/courses/{id}` - Get course details
- `PUT /api/v1/courses/{id}` - Update course
- `DELETE /api/v1/courses/{id}` - Delete course

#### Public Course Access

- `GET /api/v1/courses/{slug}/public` - Get public course info for landing page
- `POST /api/v1/courses/{slug}/checkout` - Create Stripe checkout session

#### Order Management

- `GET /api/v1/orders` - List orders (admin)
- `GET /api/v1/orders/{id}` - Get order details
- `POST /api/v1/access/validate` - Validate course access token

#### Webhooks

- `POST /api/v1/webhooks/stripe` - Handle Stripe payment events

### Error Model

#### HTTP Status Codes

- `200 OK` - Successful operation
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `409 Conflict` - Resource already exists
- `422 Unprocessable Entity` - Validation errors
- `500 Internal Server Error` - Server error
- `503 Service Unavailable` - External service unavailable

#### Error Response Format

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ],
    "requestId": "req_1234567890"
  }
}
```

### Versioning Strategy

#### API Versioning

- **URL Path Versioning**: All endpoints prefixed with `/api/v1/`
- **Backward Compatibility**: Maintain previous version for 6 months after new version release
- **Version Headers**: Optional `API-Version` header for explicit version control
- **Deprecation**: Use `Deprecation` and `Sunset` headers for version lifecycle management

#### Schema Evolution

- **Additive Changes**: New optional fields don't require version bump
- **Breaking Changes**: Require new version (field removal, type changes, required fields)
- **Migration Path**: Provide clear upgrade documentation and automated migration tools

## Security Architecture

### Authentication

- **JWT Tokens**: Stateless authentication for API access
- **Session Cookies**: Secure session management for web interface
- **API Keys**: Service-to-service authentication

### Authorization

- **Role-Based Access**: Creator, Buyer, Admin roles
- **Resource Ownership**: Creators can only access their own courses
- **Course Access**: Token-based access for purchased courses

### Data Protection

- **Encryption at Rest**: Database encryption for sensitive data
- **HTTPS Only**: All communications encrypted in transit
- **Input Validation**: Comprehensive validation using Zod schemas
- **Rate Limiting**: API rate limiting to prevent abuse

## Monitoring and Observability

### Logging

- **Structured Logging**: JSON format with correlation IDs
- **Log Levels**: Error, Warn, Info, Debug
- **Sensitive Data**: Redaction of PII and payment information

### Metrics

- **Business Metrics**: Activation-to-Revenue rate, course completion rates
- **Technical Metrics**: API response times, error rates, database performance
- **Infrastructure Metrics**: CPU, memory, disk usage

### Health Checks

- `/health` - Basic service health
- `/health/ready` - Readiness probe for load balancer
- `/health/live` - Liveness probe for container orchestration
