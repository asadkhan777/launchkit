# LLM Agent Engineering Excellence Guidelines

## **Decision Framework**
Before any code generation, ask: *"Does this change advance the North Star Goal?"*  
**North Star Goal**: Located in `.github/DEVELOPMENT.md` - reference it for project-specific objectives.

## **Velocity Unlock Principles**
1. **Focused Execution Mode**: Load architectural principles once per session, then execute implementation tasks without re-analysis paralysis.
2. **Batch Context Processing**: Complete entire features in focused sessions rather than file-by-file context switching.
3. **Phase-Appropriate Filtering**: Apply MVP-phase guidelines - defer complex architectural patterns, focus on quality code and comprehensive testing.
4. **Parallel Implementation**: Use tool parallelization aggressively for independent changes and batch related operations.
5. **Context Compression**: Use session-specific working principles for implementation, reserve full analysis for major design decisions.

## **Phase-Based Engineering (Current: MVP)**
**Priority: Learning Velocity > Architectural Sophistication**
- Start simple, add layers only when complexity demands it
- Comprehensive testing for core business logic, proven technologies, full optimization for user-facing paths
- Choose fastest path to user feedback while maintaining quality
- Duplication better than premature abstraction, defer complex patterns until validated

## **Post-Phase Review Mandate**
After completing each development phase, revisit these instructions and suggest improvements/reductions based on postmortem insights and experience.
- **Testing**: Complete pyramid with comprehensive integration and E2E coverage
- **Documentation**: Comprehensive system documentation and operational guides
- **Refactoring**: Continuous improvement as part of regular development
- **Technology Choices**: Best-in-class solutions, evaluate cutting-edge strategically
- **Performance**: Systematic optimization and comprehensive monitoring

**Scale Decision Rules:**
- Optimize for development productivity and code maintainability
- Invest heavily in automation and developer tooling
- Extract services based on clear domain and operational boundaries
- Architectural sophistication becomes a competitive advantage
- Performance optimization is data-driven and systematic

#### **Context Switches: When to Change Phases**
- **MVP → Growth**: When you have paying customers and defined product-market fit
- **Growth → Scale**: When architectural complexity becomes a development bottleneck
- **Emergency Reversion**: Market conditions may force temporary phase reversions

#### **The Quality Investment Framework**
```
Engineering Investment = f(Business Risk × Change Frequency × System Complexity)

High Investment Areas:
- Core business logic with frequent changes
- User-facing performance bottlenecks
- Security and data integrity systems
- APIs used by multiple systems

Strategic Deferral Areas (until MVP proven):
- Internal tooling and admin interfaces
- Complex deployment and monitoring systems
- Premature abstractions for theoretical scale
- Over-engineered internal APIs
```

---

## **Code Generation Principles**

### **1. Product-First Mindset**
- **User Value Focus**: Prioritize features that deliver direct user value, avoid gold-plating
- **Simplicity Over Complexity**: Choose the simplest solution that works, avoid over-engineering
- **Iterative Improvement**: Deliver minimum viable features, then refine based on user feedback

### **2. Performance-First Mindset**
- **Async Operations**: Non-blocking I/O, proper Promise handling, avoid blocking main thread
- **Memory Efficiency**: Avoid memory leaks, use WeakMap/WeakSet for caches, cleanup event listeners
- **Bundle Optimization**: Code splitting, tree shaking, dynamic imports for non-critical paths
- **Database Efficiency**: Avoid N+1 queries, use proper indexing, implement connection pooling
- **Caching Strategy**: Multi-layer caching (browser, CDN, application, database)

### **3. Error Handling Strategy**
- **Fail Fast**: Validate inputs early, use assertions for programmer errors
- **Result Types**: Use Result<T, E> pattern instead of throwing exceptions
- **Error Boundaries**: React error boundaries for UI, global error handlers for APIs
- **Structured Logging**: Include correlation IDs, structured data, never log secrets
- **Graceful Degradation**: Core functionality works even when features fail

### **4. Testing Architecture**
- **Test Structure**: Given-When-Then pattern, clear test names describing behavior
  - *Always Apply When Feasible*: Good test structure costs nothing extra
- **Test Isolation**: Each test independent, unique test data, proper cleanup
  - *Always Apply When Feasible*: Prevents flaky tests that waste debugging time
- **Mock Strategy**: Mock external dependencies, not internal modules
  - *Growth Phase*: Introduce mocking when external services become expensive/slow to test
- **Coverage Focus**: 100% domain logic, 90% API paths, behavior over implementation
  - *MVP*: Focus on comprehensive coverage for core business logic
  - *Growth*: Expand coverage to all critical user paths
  - *Scale*: Full coverage with comprehensive edge case testing

---

## **Code Quality Heuristics**

### **Function Design**
- **Pure Functions**: No side effects, same input = same output, easier to test and reason about
  - *Always Apply When Feasible*: Pure functions are easier to debug and test
- **Function Length**: Max 20 lines, if longer extract sub-functions with clear names
  - *MVP Consideration*: Acceptable to have longer functions if they're cohesive and will be refactored
- **Parameter Count**: Max 3 parameters, use objects for complex parameter sets
  - *MVP Consideration*: Can have more parameters if it avoids premature abstraction
- **Early Returns**: Guard clauses to reduce nesting, fail fast on invalid inputs
  - *Always Apply When Feasible*: Improves readability at no cost
- **Cognitive Complexity**: Max cyclomatic complexity of 15
  - *Always Apply When Feasible*: Focus on readability and maintainability
  - *MVP Consideration*: Can have more complexity levels if that avoids premature restructuring

### **Class/Module Design**
- **Composition over Inheritance**: Favor object composition, use inheritance sparingly
- **Command-Query Separation**: Methods either change state or return data, not both
- **Tell Don't Ask**: Objects should act on their own data, minimize getters
- **Law of Demeter**: Only talk to immediate dependencies, avoid method chaining
- **Open-Closed Principle**: Open for extension via interfaces, closed for modification

### **Data Modeling**
---

## **Technology Choices (Latest Stable Version always)**
- **Frontend**: Next.js , React Server Components, TypeScript strict mode
- **Backend**: Fastify, Prisma ORM, Zod validation, Passport.js for auth 
- **Testing**: Vitest, comprehensive coverage for business logic, cypress for E2E, parallel execution, concise reports, 
- **Build**: Turborepo monorepo, parallel execution
- **Styling**: Tailwind CSS, consistent design system
- **Quality**: ESLint + Prettier, automated code formatting and linting
- **Database**: PostgreSQL, managed via Prisma ORM
- **Authentication**: Passport.js with JWT strategy
- **API Design**: RESTful principles, proper HTTP status codes, HATEOAS
- **State Management**: React Context for global state, local component state where possible
- **Security Best Practices**: OWASP Top 10, HTTPS everywhere, secure headers, input sanitization
- ***Note***: For anything else go with the most popular FOSS choice with the best community support that fits the problem domain and the current tech stack 

---

## **Implementation Checklist**
- [ ] Solve the problem with quality code
- [ ] Add comprehensive tests for business logic
- [ ] Optimize performance for user-facing paths
- [ ] Use meaningful names and clear structure
- [ ] Handle errors gracefully
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
---

## **Remember**: Every line of code is a liability that must be maintained, tested, and debugged. Write code that solves real problems, is easy to understand, and can be safely changed by future developers (including AI agents).
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

## **Essential Engineering Wisdom**

### **The Three Laws**
1. **Conway's Law**: Your system will mirror your communication structure - design accordingly
2. **The Second System Effect**: Your second attempt will be over-engineered - plan for iteration
3. **The Principle of Least Astonishment**: Code should behave exactly as its name suggests

### **Quality Compound Interest**
- **Complexity Compounds**: Prioritize simplicity like compound interest in reverse
- **The 10x Rule**: Architecture saves implementation time, implementation saves debugging time
- **Code Entropy**: Code grows more complex without active maintenance

### **Essential Patterns**
- **Strangler Fig**: Replace legacy systems gradually, not via rewrite
- **Circuit Breaker**: Fail smart with graceful degradation
- **Cognitive Load Budget**: Design systems that fit within ~7 units of working memory

### **Decision Principles**  
- **The Pareto Principle**: 80% of user value comes from 20% of features - prioritize ruthlessly
- **Problem Behind the Problem**: Solve the real user need, not the stated requirement
- **Build vs Buy**: Build for core competency, buy for time-to-market

---

**Remember**: Every line of code is a liability that must be maintained, tested, and debugged. Write code that solves real problems, is easy to understand, and can be safely changed by future developers (including AI agents).
