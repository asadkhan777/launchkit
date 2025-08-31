# LLM Agent Engineering Excellence Guidelines

## **Decision Framework**
Before any code generation, ask: *"Does this change advance the North Star Goal?"*  
**North Star Goal**: Located in `.github/DEVELOPMENT.md` - reference it for project-specific objectives.

---

## **Code Generation Principles**

### **1. Architectural Thinking**
- **Clean Architecture**: UI → Domain → Data layers with strict dependency inversion
- **Single Responsibility**: One reason to change per class/function/module
- **Interface Segregation**: Create focused contracts, avoid God interfaces
- **Dependency Injection**: Constructor injection for testability and flexibility
- **Immutability by Default**: Prefer readonly/const, use builders over setters

### **2. Performance-First Mindset**
- **Async Operations**: Non-blocking I/O, proper Promise handling, avoid blocking main thread
- **Memory Efficiency**: Avoid memory leaks, use WeakMap/WeakSet for caches, cleanup event listeners
- **Bundle Optimization**: Code splitting, tree shaking, dynamic imports for non-critical paths
- **Database Efficiency**: Avoid N+1 queries, use proper indexing, implement connection pooling
- **Caching Strategy**: Multi-layer caching (browser, CDN, application, database)

### **3. Type Safety Excellence**
- **TypeScript Strict Mode**: Enable all strict flags, never use `any`
- **Runtime Validation**: Zod schemas for all external data boundaries
- **Branded Types**: Use branded/opaque types for domain concepts (UserId, Email, etc.)
- **Template Literals**: Type-safe string unions and API routes
- **Exhaustive Checking**: Use `never` type for unreachable code paths

### **4. Error Handling Strategy**
- **Fail Fast**: Validate inputs early, use assertions for programmer errors
- **Result Types**: Use Result<T, E> pattern instead of throwing exceptions
- **Error Boundaries**: React error boundaries for UI, global error handlers for APIs
- **Structured Logging**: Include correlation IDs, structured data, never log secrets
- **Graceful Degradation**: Core functionality works even when features fail

### **5. Testing Architecture**
- **Test Structure**: Given-When-Then pattern, clear test names describing behavior
- **Test Isolation**: Each test independent, unique test data, proper cleanup
- **Mock Strategy**: Mock external dependencies, not internal modules
- **Coverage Focus**: 100% domain logic, 90% API paths, behavior over implementation
- **Performance Testing**: Benchmark critical paths, memory leak detection

---

## **Code Quality Heuristics**

### **Function Design**
- **Pure Functions**: No side effects, same input = same output, easier to test and reason about
- **Function Length**: Max 20 lines, if longer extract sub-functions with clear names
- **Parameter Count**: Max 3 parameters, use objects for complex parameter sets
- **Early Returns**: Guard clauses to reduce nesting, fail fast on invalid inputs
- **Cognitive Complexity**: Max cyclomatic complexity of 10

### **Class/Module Design**
- **Composition over Inheritance**: Favor object composition, use inheritance sparingly
- **Command-Query Separation**: Methods either change state or return data, not both
- **Tell Don't Ask**: Objects should act on their own data, minimize getters
- **Law of Demeter**: Only talk to immediate dependencies, avoid method chaining
- **Open-Closed Principle**: Open for extension via interfaces, closed for modification

### **Data Modeling**
- **Value Objects**: Immutable objects for domain concepts with validation
- **Aggregates**: Consistency boundaries, single entry point for related entities
- **Domain Events**: Decouple side effects from core business logic
- **Repository Pattern**: Abstract data access behind domain interfaces
- **CQRS Consideration**: Separate read/write models for complex domains

---

## **Technology Decision Matrix**

### **Frontend Patterns**
- **Server Components**: Default to server-side rendering, client components only when necessary
- **State Management**: React Server State vs Client State separation, minimize client state
- **Component Architecture**: Atomic design, container/presentational separation
- **Performance**: Suspense boundaries, React.memo for expensive components, useMemo/useCallback judiciously
- **Accessibility**: Semantic HTML, ARIA labels, keyboard navigation, color contrast

### **Backend Patterns**
- **API Design**: RESTful conventions, consistent error responses, proper HTTP status codes
- **Middleware Architecture**: Composable middleware, proper error handling, request/response logging
- **Database Patterns**: Connection pooling, prepared statements, transaction management
- **Security**: Input validation, rate limiting, authentication/authorization layers
- **Observability**: Structured logging, metrics collection, distributed tracing

### **Build & Development**
- **Monorepo Strategy**: Clear package boundaries, shared tooling configuration
- **Build Performance**: Incremental builds, parallel execution, efficient caching
- **Type Generation**: Generate types from schemas, APIs, and databases
- **Hot Reload**: Fast development feedback loops, selective module replacement
- **Environment Parity**: Development/staging/production consistency

---

## **Code Generation Checklist**

### **Before Writing Code**
- [ ] Understand the domain problem and business requirements
- [ ] Identify the appropriate layer (UI/Domain/Data) for the change
- [ ] Check for existing patterns and follow established conventions
- [ ] Consider performance implications and optimization opportunities
- [ ] Plan for error handling and edge cases

### **While Writing Code**
- [ ] Use meaningful names that express intent and domain concepts
- [ ] Write self-documenting code that explains "why" not "what"
- [ ] Follow SOLID principles and avoid common anti-patterns
- [ ] Implement proper error handling and input validation
- [ ] Consider testability and write testable code structure

### **After Writing Code**
- [ ] Add comprehensive tests covering happy path and edge cases
- [ ] Verify type safety and eliminate any type holes
- [ ] Check for potential security vulnerabilities
- [ ] Optimize for performance without premature optimization
- [ ] Ensure code follows project conventions and style guidelines

---

## **Anti-Patterns to Avoid**

### **Architecture Anti-Patterns**
- **Big Ball of Mud**: Lack of clear structure, everything depends on everything
- **God Objects**: Classes/components with too many responsibilities
- **Shotgun Surgery**: Single change requires modifications across many files
- **Circular Dependencies**: Modules depending on each other directly or indirectly

### **Performance Anti-Patterns**
- **Premature Optimization**: Optimizing before measuring and identifying bottlenecks
- **N+1 Queries**: Loading data in loops instead of batch operations
- **Memory Leaks**: Unclosed resources, retained references, unbounded caches
- **Blocking Operations**: Synchronous I/O on main thread, long-running computations

### **Code Quality Anti-Patterns**
- **Magic Numbers/Strings**: Use named constants with meaningful domain names
- **Deep Nesting**: Use guard clauses and early returns to reduce complexity
- **Long Parameter Lists**: Use parameter objects or builder pattern
- **Copy-Paste Programming**: Extract common functionality into reusable utilities

---

## **Advanced Engineering Patterns**

### **Hexagonal Architecture Implementation**
- **Ports**: Interfaces defining what the application can do
- **Adapters**: Implementations that connect to external systems
- **Application Core**: Business logic independent of external concerns
- **Dependency Direction**: All dependencies point inward toward the domain

### **Event-Driven Architecture**
- **Domain Events**: Capture business occurrences, enable loose coupling
- **Event Sourcing**: Store events as the source of truth
- **CQRS**: Separate command and query responsibilities
- **Eventual Consistency**: Design for distributed system realities

### **Microservices Patterns (when applicable)**
- **API Gateway**: Single entry point, routing, authentication, rate limiting
- **Circuit Breaker**: Fail fast when external services are down
- **Bulkhead**: Isolate critical resources, prevent cascade failures
- **Saga Pattern**: Manage distributed transactions across services

---

## **Debugging & Problem-Solving Framework**

### **Systematic Debugging**
- **Reproduce First**: Create minimal reproduction case
- **Binary Search**: Eliminate half the search space with each test
- **Hypothesis Testing**: Form hypotheses, test systematically
- **Root Cause Analysis**: Find the fundamental cause, not just symptoms
- **Fix Verification**: Confirm fix works and doesn't introduce regressions

### **Performance Investigation**
- **Measurement First**: Profile before optimizing, use real data
- **Bottleneck Identification**: Find the slowest component in the critical path
- **Resource Monitoring**: CPU, memory, I/O, network utilization
- **Load Testing**: Test under realistic conditions and load patterns
- **Optimization Validation**: Measure improvements, ensure no regressions

---

## **Security-First Development**

### **Input Validation**
- **Server-Side Validation**: Never trust client-side validation alone
- **Schema Validation**: Use runtime schema validation for all inputs
- **Sanitization**: Clean and escape user input before processing
- **Rate Limiting**: Protect against abuse and denial-of-service attacks

### **Authentication & Authorization**
- **Principle of Least Privilege**: Grant minimum necessary permissions
- **Token Security**: Short-lived access tokens, secure refresh mechanisms
- **Session Management**: Secure session handling, proper timeout policies
- **Multi-Factor Authentication**: Support for enhanced security when required

### **Data Protection**
- **Encryption**: Encrypt sensitive data at rest and in transit
- **Secret Management**: Use environment variables and secret management systems
- **Audit Logging**: Log security events for monitoring and compliance
- **Privacy by Design**: Minimize data collection, implement proper anonymization

---

## **Deployment & Operations Excellence**

### **Infrastructure as Code**
- **Declarative Configuration**: Infrastructure defined in version-controlled code
- **Environment Consistency**: Same configuration across dev/staging/production
- **Rollback Strategy**: Quick rollback mechanisms for failed deployments
- **Blue-Green Deployment**: Zero-downtime deployment strategy

### **Monitoring & Observability**
- **Three Pillars**: Metrics, logging, and distributed tracing
- **Business Metrics**: Track user-facing metrics, not just technical ones
- **Alert Strategy**: Alert on user impact, not just system metrics
- **Runbook Documentation**: Clear procedures for incident response

### **Continuous Integration/Deployment**
- **Fast Feedback**: CI pipeline completes in under 10 minutes
- **Automated Testing**: All tests run automatically on every change
- **Quality Gates**: Block deployment if quality standards not met
- **Deployment Automation**: Consistent, repeatable deployment process

---

**Remember**: Every line of code is a liability that must be maintained, tested, and debugged. Write code that solves real problems, is easy to understand, and can be safely changed by future developers (including AI agents).
