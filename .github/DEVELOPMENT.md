# 🚀 LaunchKit.ai Developer Quick Reference

## **North Star Goal**
Transform content creation through AI-powered micro-course generation with uncompromising quality, performance, and developer experience.

**Quick Decision Razor**: *"Does this change move us towards or away from our North Star Goal?"*

---

## **⚡ Quick Commands**

```bash
# Development
pnpm dev                    # Start all services
pnpm --filter web dev      # Frontend only
pnpm --filter api dev      # Backend only

# Testing
pnpm test                  # All tests
pnpm test:watch           # Watch mode
pnpm --filter sdk test    # Package-specific

# Building
pnpm build                # All packages
pnpm type-check           # TypeScript validation
pnpm lint                 # Code quality
pnpm lint:fix             # Auto-fix issues

# Database
pnpm prisma db push       # Sync schema
pnpm prisma generate      # Generate client
pnpm prisma studio        # Database GUI
```

---

## **📁 Project Structure**

```
LaunchKit.ai/
├── apps/
│   ├── web/              # Next.js frontend
│   └── api/              # Fastify backend
├── packages/
│   ├── sdk/              # Core business logic
│   ├── common/           # Shared utilities
│   ├── ui/               # Component library
│   └── tests/            # Test utilities
└── .github/              # DevOps & guidelines
```

---

## **🎯 Architecture Layers**

```
┌─────────────────┐
│   UI Layer      │ ← Next.js App (apps/web)
├─────────────────┤
│   API Layer     │ ← Fastify Server (apps/api)
├─────────────────┤
│  Domain Layer   │ ← Business Logic (packages/sdk)
├─────────────────┤
│   Data Layer    │ ← Prisma + Database
└─────────────────┘
```

**Dependency Rule**: Outer layers depend on inner layers, never reverse.

---

## **🔧 Technology Stack**

| Layer | Current Choice | Decision Criteria |
|-------|---------------|-------------------|
| **Frontend** | Next.js + React | SSR/SSG support, Server Components, strong ecosystem |
| **Backend** | Fastify + TypeScript | High performance, type safety, async-first design |
| **Database** | Prisma + PostgreSQL | Type-safe ORM, migration support, ACID compliance |
| **Validation** | Zod | Runtime type checking, TypeScript integration |
| **Testing** | Vitest | Fast execution, ESM support, good TypeScript integration |
| **Build** | Turborepo + PNPM | Monorepo orchestration, efficient caching |
| **Styling** | Tailwind CSS | Utility-first, consistent design system |
| **Quality** | ESLint + Prettier | Automated code formatting and linting |

**Technology Selection Principles:**
- **Type Safety First**: Choose tools with strong TypeScript support
- **Performance by Default**: Optimize for both development and runtime speed  
- **Developer Experience**: Prioritize tools that enhance productivity
- **Ecosystem Maturity**: Prefer established tools with active communities
- **Future-Proof**: Choose technologies with clear upgrade paths

---

## **✅ Code Quality Checklist**

### **Before Every Commit**
- [ ] Tests pass: `pnpm test`
- [ ] Types check: `pnpm type-check`
- [ ] Linting clean: `pnpm lint`
- [ ] Follows commit format: `type(scope): description`
- [ ] Advances North Star Goal

### **Before Every PR**
- [ ] All CI checks pass
- [ ] Meaningful commit messages
- [ ] Tests cover new functionality
- [ ] Documentation updated if needed
- [ ] Performance impact considered

---

## **🎨 Commit Message Format**

```
type(scope): description

[optional body]

[optional footer]
```

**Types**: `feat`, `fix`, `refactor`, `perf`, `style`, `test`, `docs`, `build`, `ci`, `chore`

**Scopes**: `web`, `api`, `sdk`, `ui`, `db`, `courses`, `ai`, `auth`, `build`

**Examples**:
```bash
feat(courses): Add AI-powered outline generation
fix(api): Resolve validation error for course creation
perf(db): Optimize course listing with proper indexing
```

---

## **🧪 Testing Strategy**

```
Testing Pyramid:
     /E2E\. ← 10% - Critical user flows
   /────────\
  /Integration\ ← 20% - API & database
 /─────────────\
/     Unit      \ ← 70% - Core Business logic units
```

**Coverage Goals**:
- Domain Logic: 100%
- API Endpoints: 90%
- UI Components: Focus on behavior

---

## **⚡ Performance Standards**

| Metric | Target | Measurement |
|--------|--------|-------------|
| **LCP** | < 2.5s | Core Web Vitals |
| **FID** | < 100ms | User interaction |
| **CLS** | < 0.1 | Layout shift |
| **API Response** | < 200ms | Backend endpoints |
| **Build Time** | < 30s | Full monorepo |

---

## **🔒 Security Checklist**

- [ ] Input validation with Zod schemas
- [ ] SQL injection prevention via Prisma
- [ ] XSS protection with content sanitization
- [ ] Authentication on protected routes
- [ ] Environment secrets not in code
- [ ] HTTPS in production
- [ ] Rate limiting on public APIs

---

## **📚 Key Documentation**

- [Development Guidelines](./.github/copilot-instructions.md)
- [Git Commit Guide](./.github/git-commit-instructions.md)
- [API Documentation](./apps/api/README.md)
- [Component Library](./packages/ui/README.md)

---

## **🚨 Emergency Procedures**

### **Critical Bug Fix**
1. Create hotfix branch: `hotfix/critical-issue-description`
2. Implement minimal fix with tests
3. Fast-track review and merge
4. Deploy immediately to production
5. Post-mortem analysis

### **Performance Issue**
1. Identify bottleneck with monitoring
2. Create performance branch
3. Implement targeted optimization
4. Measure improvement with benchmarks
5. Document performance gains

### **Security Vulnerability**
1. **DO NOT** commit security details to public repo
2. Create private security patch
3. Coordinate with security team
4. Deploy patch immediately
5. Public disclosure after fix deployed

---

## **🎓 Learning Resources**

- [Next.js Documentation](https://nextjs.org/docs)
- [Fastify Documentation](https://www.fastify.io/docs/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [React Server Components](https://react.dev/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

**💡 Remember**: Every change should make the codebase better, faster, or more maintainable. When in doubt, choose simplicity over cleverness.
