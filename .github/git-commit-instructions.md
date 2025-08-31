# Git Commit Message Guidelines - LaunchKit.ai

## **Overview**
Consistent, readable, and traceable commit history for the LaunchKit.ai AI-powered course creation platform. These guidelines ensure clear communication of changes across frontend, backend, and infrastructure components.

## **Commit Message Format**

### **Standard Structure**
```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### **Required Elements**

#### **Type Categories**
- **feat**: New feature or enhancement
- **fix**: Bug fix or issue resolution
- **refactor**: Code restructuring without behavior change
- **perf**: Performance improvements
- **style**: UI/UX changes or code formatting
- **test**: Adding or modifying tests
- **docs**: Documentation updates
- **build**: Build system or dependency changes
- **ci**: Continuous integration configuration
- **chore**: Maintenance tasks and tooling

#### **Scope Guidelines**
Use relevant component/module names:

**Frontend Scopes:**
- `web`: Next.js application changes
- `ui`: React component library
- `pages`: Page-level components
- `components`: Reusable UI components
- `hooks`: Custom React hooks
- `utils`: Frontend utilities
- `styles`: CSS/styling changes
- `forms`: Form components and validation

**Backend Scopes:**
- `api`: Fastify API server
- `sdk`: Core business logic package
- `db`: Database schema or migrations
- `auth`: Authentication and authorization
- `validation`: Input/output validation
- `middleware`: API middleware
- `routes`: API route handlers

**Infrastructure Scopes:**
- `monorepo`: Workspace and tooling configuration
- `build`: Build system changes
- `deps`: Dependency updates
- `config`: Configuration files
- `ci`: CI/CD pipeline changes
- `deploy`: Deployment configuration
- `docker`: Container configuration

**Domain Scopes:**
- `courses`: Course-related functionality
- `users`: User management
- `ai`: AI/LLM integration
- `content`: Content processing
- `import`: Content import features
- `generation`: Content generation
- `payments`: Stripe/payment integration

## **Writing Guidelines**

### **Description Rules**
- Use imperative mood in present tense ("Add", "Fix", "Update")
- Start with capital letter
- No period at the end
- Maximum 50 characters
- Be specific and descriptive
- Focus on **what** changed, not **how**

### **Examples of Good Commit Messages**
```
feat(courses): Add AI-powered course outline generation
fix(api): Resolve validation error for course creation
refactor(ui): Simplify course card component structure
perf(db): Optimize course listing query with proper indexing
style(web): Update course dashboard layout for mobile
test(sdk): Add unit tests for course validation logic
docs(api): Update OpenAPI spec for course endpoints
build(monorepo): Configure Turborepo caching for faster builds
```

### **Examples of Poor Commit Messages**
```
❌ Fixed bug
❌ Updated code
❌ WIP
❌ Changes
❌ feat: Added some stuff
❌ fix: it works now
❌ Update README.md
```

## **Body Guidelines (Optional)**

### **When to Include Body**
- Breaking changes requiring explanation
- Complex business logic changes
- Performance improvements with metrics
- Security fixes requiring context
- Large refactoring efforts

### **Body Format**
- Separate from description with blank line
- Wrap at 72 characters
- Explain **why** and **context**, not **how**
- Use bullet points for multiple changes
- Include performance impact when relevant

### **Body Examples**
```
feat(ai): Implement streaming course generation

* Reduces time-to-first-content from 10s to 2s
* Improves user experience with progressive loading
* Uses OpenAI streaming API for real-time updates
* Maintains backward compatibility with batch generation

BREAKING CHANGE: CourseGenerator.generate() now returns AsyncIterable<string>
```

## **Footer Guidelines (Optional)**

### **Footer Types**
- **Breaking Changes**: `BREAKING CHANGE: description`
- **Issue References**: `Fixes #123`, `Closes #456`, `Refs #789`
- **Co-authored**: `Co-authored-by: Name <email@example.com>`
- **Reviewed-by**: `Reviewed-by: Name <email@example.com>`

## **LaunchKit.ai Specific Conventions**

### **AI/ML Domain Context**
- Reference specific AI capabilities when relevant
- Mention model performance improvements
- Include training data or prompt changes
- Reference content generation quality enhancements

### **Course Creation Workflow**
- Mention user-facing impact for UX changes
- Reference specific course creation steps
- Include content processing improvements
- Mention import/export functionality changes

### **Performance Considerations**
- Include metrics for performance changes
- Reference specific optimization techniques
- Mention bundle size impact for frontend
- Include database query performance improvements

## **Validation Checklist**

Before committing, ensure your message:
- [ ] Uses correct type and scope format
- [ ] Written in imperative mood
- [ ] Under 50 characters for description
- [ ] Describes business value clearly
- [ ] Includes body for complex changes
- [ ] References issues when applicable
- [ ] Follows LaunchKit.ai conventions

## **Advanced Examples**

### **Feature Development**
```
feat(generation): Add multi-language course support

* Supports course generation in 12 languages
* Uses language-specific prompts for better quality
* Maintains consistent course structure across languages
* Includes automatic language detection from source content

Closes #234
```

### **Performance Optimization**
```
perf(api): Optimize course listing endpoint

* Reduces response time from 800ms to 120ms
* Implements database query optimization with eager loading
* Adds Redis caching for frequently accessed courses
* Improves pagination with cursor-based approach

Benchmark results:
- Before: 800ms avg, 95th percentile 1.2s
- After: 120ms avg, 95th percentile 200ms
```

### **Breaking Change**
```
refactor(sdk): Restructure course data model

* Simplifies course creation API
* Improves type safety with strict validation
* Enables better caching strategies
* Supports future course format extensions

BREAKING CHANGE: CourseData interface now requires 'version' field
Migration guide: https://docs.launchkit.ai/migration/v2
```

### **Bug Fix with Context**
```
fix(web): Resolve course import failure on large files

* Fixes timeout issues with files larger than 5MB
* Implements chunked file processing
* Adds progress indicator for user feedback
* Improves error handling with retry mechanism

Fixes #567
```

## **Branch Naming Conventions**

### **Branch Types**
- **Feature**: `feature/add-course-templates`
- **Bugfix**: `fix/course-generation-timeout`
- **Hotfix**: `hotfix/security-vulnerability`
- **Refactor**: `refactor/simplify-auth-flow`
- **Docs**: `docs/update-api-examples`

### **Branch Naming Rules**
- Use lowercase with hyphens
- Be descriptive but concise
- Include issue number when applicable: `feature/123-add-course-templates`
- Use present tense action verbs

## **Integration with Development Workflow**

### **Pull Request Title Format**
Use same format as commit messages:
```
feat(courses): Add AI-powered course outline generation
```

### **Commit Squashing Guidelines**
- Squash commits for single logical changes
- Preserve individual commits for complex features
- Use descriptive squash commit messages
- Include all relevant context in final commit

### **Release Notes Generation**
Commits with these types generate release notes:
- `feat`: New features section
- `fix`: Bug fixes section
- `perf`: Performance improvements section
- `BREAKING CHANGE`: Breaking changes section

## **Tools and Automation**

### **Recommended Tools**
- **commitlint**: Validate commit message format
- **husky**: Git hooks for commit message validation
- **conventional-changelog**: Generate changelogs from commits
- **semantic-release**: Automated versioning and releases

### **VSCode Extensions**
- **Conventional Commits**: Commit message helper
- **GitLens**: Enhanced git integration
- **Git History**: Visual commit history

## **Benefits of Following These Guidelines**

- **Automated Changelog**: Generate release notes from commit history
- **Semantic Versioning**: Automated version bumps based on commit types
- **Better Code Reviews**: Clear context for code changes
- **Debugging**: Easy identification of when bugs were introduced
- **Team Communication**: Consistent language across team members
- **CI/CD Integration**: Automated workflows based on commit types

## **Common Mistakes to Avoid**

### **Anti-Patterns**
- Vague descriptions: "Update component"
- Past tense: "Added new feature"
- Implementation details: "Changed variable name from x to y"
- Multiple concerns: "Add feature and fix bug and update docs"
- Missing scope: "feat: new thing"

### **Best Practices**
- One logical change per commit
- Atomic commits that don't break the build
- Clear business value in description
- Appropriate scope for change size
- Consistent formatting across team

---

**Remember**: Great commit messages are written for future developers (including yourself) who need to understand why changes were made.
