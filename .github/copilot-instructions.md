# LLM Agent Engineering Excellence Guidelines

## **Decision Framework**
Before any code generation, ask: *"Does this change advance the North Star Goal?"*  
**North Star Goal**: Located in `.github/DEVELOPMENT.md` - reference it for project-specific objectives.

## **MANDATORY: Focused Execution Mode**
**ALWAYS ACTIVE** - This is the proven velocity optimization that enabled 3x development speed in V7-V8:

1. **Load Context Once**: Read architectural principles and project context at session start
2. **Execute Without Re-Analysis**: Implement features in focused batches without analysis paralysis
3. **Batch Related Operations**: Complete entire feature sets in single concentrated sessions
4. **Defer Major Decisions**: Reserve full analysis only for major architectural decisions
5. **Maintain Quality Standards**: Comprehensive testing and documentation without velocity loss

**Proven Results**: V7 observability (2 hours vs incremental approach), V8 testing (3x faster, 40/40 tests passing)

## **Velocity Unlock Principles**
## **Velocity Unlock Principles**
1. **Focused Execution Mode**: ✅ MANDATORY (see above) - Load architectural principles once per session, then execute implementation tasks without re-analysis paralysis.
2. **Batch Context Processing**: Complete entire features in focused sessions rather than file-by-file context switching.
3. **Phase-Appropriate Filtering**: Apply MVP-phase guidelines - defer complex architectural patterns, focus on quality code and comprehensive testing.
4. **Parallel Implementation**: Use tool parallelization aggressively for independent changes and batch related operations.
5. **Context Compression**: Use session-specific working principles for implementation, reserve full analysis for major design decisions.

## **Phase-Based Engineering (Current: MVP)**
**Priority: Learning Velocity > Architectural Sophistication**
- Start simple, add layers only when complexity demands it
- Comprehensive testing for core business logic
- Choose fastest path to user feedback while maintaining quality
- Duplication better than premature abstraction
- Duplication better than premature abstraction, defer complex patterns until validated

## **Post-Phase Review Mandate**
After completing each development phase, revisit these instructions and suggest improvements/reductions based on postmortem insights and experience.
- **Testing**: 80/20 pareto implementation of test pyramid by value with core flows integration test coverage. 
- **Documentation**: Detailed decision rationale documentation with architectural trade-offs
- **Refactoring**: Continuous improvement as part of regular development - boy scout rule
- **Technology Choices**: Fastest-in-class solutions, strategic fastest-to-ship option favoring decisions
- **Performance**: Strategic optimization and comprehensive monitoring on mission-critical flows
---

## **Code Generation Principles**

### **1. Product-First Mindset**
- **User Value Focus**: Prioritize features that deliver direct user value, avoid gold-plating
- **Simplicity Over Complexity**: Choose the simplest solution that works, avoid over-engineering
- **Iterative Improvement**: Deliver minimum viable features, then refine

### **2. Performance-First Mindset**
- **Async Operations**: Non-blocking I/O, proper Promise handling
- **Memory Efficiency**: Avoid memory leaks, cleanup event listeners
- **Database Efficiency**: Avoid N+1 queries, use proper indexing

### **3. Error Handling Strategy**
- **Fail Fast**: Validate inputs early, use assertions for programmer errors
- **Result Types**: Use Result<T, E> pattern instead of throwing exceptions
- **Graceful Degradation**: Core functionality works even when features fail

### **4. Testing Architecture**
- **Test Structure**: Given-When-Then pattern, clear test names describing behavior
- **Test Isolation**: Each test independent, unique test data, proper cleanup
- **Coverage Focus**: 100% domain logic, 90% API happy paths, behavior over implementation
- **Test Parallelization**: Chase maximum test parallelization to a reasonable limit. Unit tests sould be fast and isolated.
- **Test Speed**: Fast test execution, avoid slow setup/teardown, minimal, necessary tests to reach coverage goals
- **Mission-Criticality**: Write integration tests only for core business workflows
---

## **Code Quality Heuristics**

### **Function Design**
- **Pure Functions**: Prefer functions with no side effects, same input = same output
- **Function Length**: Try to keep within 30 lines. Extract sub-functions with clear names for 50+ lines
- **Parameter Count**: Try to limit parameters to 5, use objects for complex parameter sets
- **Early Returns**: Guard clauses to reduce nesting, fail fast on invalid inputs
- **Cognitive Complexity**: Try to limit cyclomatic complexity to below 10

### **Class/Module Design**
- **Composition over Inheritance**: Favor object composition, use inheritance sparingly
- **Command-Query Separation**: Methods either change state or return data, not both
- **Single Responsibility**: Each class/module has one reason to change
---

## **Technology Stack**
- Use existing stack defined in package.json and the current codebase.
- For anything else, go with the most popular FOSS choice that fulfills all the following:
(1) Has the best & biggest community support & ecosystem AND 
(2) Fits the problem domain accurately AND
(3) Integrates well with the current tech stack 

---

## **Implementation Checklist**
- [ ] Use meaningful names and clear structure
- [ ] Solve the problem with quality integrated code
- [ ] Verify type safety and eliminate any type holes
- [ ] Add comprehensive tests for core mission-critical business logic
- [ ] Handle errors gracefully

## **Advanced Engineering Patterns**
- **Secret Management**: Use environment variables and secret management systems
- **Audit Logging**: Log security events for monitoring and compliance
- **Privacy by Design**: Minimize data collection, implement proper anonymization
---

**Remember**: Every line of code is a liability that must be maintained, tested, and debugged. Write code that solves real problems, is easy to understand, and can be safely changed by future developers (including AI agents).
