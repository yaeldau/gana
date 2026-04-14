# Architecture Decision Records (ADR)

This document tracks all significant architectural and technical decisions made for the Gana project.

## Format

Each decision follows this template:
- **Decision**: What was decided
- **Context**: Why this decision was needed
- **Options Considered**: Alternatives that were evaluated
- **Decision**: What was chosen
- **Consequences**: Tradeoffs and implications
- **Date**: When decided

---

## ADR-001: Use PostgreSQL as Primary Database

**Date**: 2026-04-11

**Context**: 
Genealogy applications are inherently graph-like (people connected by relationships), raising the question of whether a graph database (Neo4j) or relational database (PostgreSQL) is more suitable.

**Options Considered**:

1. **Neo4j (Graph Database)**
   - Pros: Natural fit for relationship-heavy data, Cypher query language intuitive
   - Cons: Weaker ACID for complex merges, smaller ecosystem, higher ops overhead

2. **PostgreSQL (Relational)**
   - Pros: Strong ACID, excellent audit trail, recursive CTEs for graph queries, JSONB for flexibility, mature tooling
   - Cons: Graph traversal requires recursive queries

3. **Hybrid (PostgreSQL + Neo4j)**
   - Pros: Best of both worlds
   - Cons: Complexity, eventual consistency issues for merges

**Decision**: PostgreSQL as primary and only database

**Rationale**:
- Merge operations require transactional integrity - ACID is critical
- Audit trail and merge history easier with relational design
- PostgreSQL recursive CTEs handle "find all ancestors" elegantly
- Larger talent pool and better interview appeal
- Prisma ORM provides excellent TypeScript integration

**Consequences**:
- ✅ Simpler architecture (one database)
- ✅ Atomic merge transactions
- ✅ Strong ecosystem and tooling
- ⚠️ May need caching for complex relationship queries at scale
- ⚠️ Graph queries less intuitive than Cypher

**Status**: Accepted

---

## ADR-002: Modular Monolith over Microservices

**Date**: 2026-04-11

**Context**:
The project could be structured as microservices (separate services for Person, Relationship, Merge, etc.) or as a modular monolith with clear domain boundaries.

**Options Considered**:

1. **Microservices (Day 1)**
   - Pros: Independent scaling, team ownership, technology flexibility
   - Cons: Distributed transaction complexity, operational overhead, premature

2. **Modular Monolith**
   - Pros: Simpler, shared transactions, easier debugging, can extract later
   - Cons: Tighter coupling initially, scaling is all-or-nothing

3. **Serverless Functions**
   - Pros: Auto-scaling, pay-per-use
   - Cons: Cold starts, complex state management, harder to debug

**Decision**: Modular monolith with clear module boundaries

**Rationale**:
- Merge transactions need atomicity across Person + Relationship domains
- MVP doesn't justify operational overhead of distributed systems
- Clear modules (identity, person, relationship, merge, tree) prepare for future extraction
- Faster iteration speed for early-stage product

**Consequences**:
- ✅ Simpler deployment and debugging
- ✅ Atomic transactions for merges
- ✅ Faster development velocity
- ✅ Easy to extract modules to services later if needed
- ⚠️ Must maintain discipline on module boundaries
- ⚠️ Scaling is all-or-nothing (but can scale horizontally)

**Status**: Accepted

---

## ADR-003: Separate Repositories (Multi-Repo)

**Date**: 2026-04-11

**Context**:
The project could use a monorepo (all code in one repo) or separate repos for frontend, backend, and infrastructure.

**Options Considered**:

1. **Monorepo (Turborepo, Nx)**
   - Pros: Atomic changes across frontend/backend, shared tooling, easier refactoring
   - Cons: Large repo, complex CI, all-or-nothing deploys

2. **Multi-Repo (Separate)**
   - Pros: Independent versioning, cleaner CI, different deploy cadences, easier access control
   - Cons: Syncing shared types, coordinating breaking changes

**Decision**: Multi-repo (3 repositories)
- `gana-web` (frontend)
- `gana-api` (backend)
- `gana-infrastructure` (DevOps)

**Rationale**:
- Frontend and backend have different release cycles
- Easier to onboard contributors to specific areas
- Cleaner CI/CD pipelines (only build what changed)
- Better security (different access controls per repo)
- Locally, all repos live in one parent folder for convenience

**Consequences**:
- ✅ Independent versioning and releases
- ✅ Cleaner CI/CD
- ✅ Easier onboarding
- ⚠️ Shared types require coordination (OpenAPI contract or shared package)
- ⚠️ More git overhead

**Status**: Accepted

---

## ADR-004: Next.js with App Router

**Date**: 2026-04-11

**Context**:
Frontend framework selection. Options include Next.js, React (CRA/Vite), Vue, Svelte, etc.

**Options Considered**:

1. **Next.js (App Router)**
   - Pros: React Server Components, excellent SEO, best Vercel integration, built-in routing
   - Cons: Learning curve for App Router, newer paradigm

2. **Next.js (Pages Router)**
   - Pros: More familiar, stable, simpler mental model
   - Cons: Less performant, older paradigm being phased out

3. **Vite + React Router**
   - Pros: Fast dev server, flexible, simpler
   - Cons: No SSR without additional setup, less opinionated

**Decision**: Next.js 14+ with App Router

**Rationale**:
- App Router is the future of Next.js
- React Server Components reduce client bundle size
- Excellent Vercel deployment integration
- Built-in API routes (if needed for BFF pattern later)
- Strong TypeScript support
- This is a portfolio project - showcasing modern tech is valuable

**Consequences**:
- ✅ Best-in-class performance
- ✅ SEO-ready (if we add public trees later)
- ✅ Modern React patterns
- ⚠️ Steeper learning curve
- ⚠️ App Router still evolving (but stable enough)

**Status**: Accepted

---

## ADR-005: Fastify over Express

**Date**: 2026-04-11

**Context**:
Backend framework selection. Express is the most popular, but alternatives exist.

**Options Considered**:

1. **Express**
   - Pros: Most popular, huge ecosystem, familiar
   - Cons: Slower, callback-based, poor TypeScript support

2. **Fastify**
   - Pros: 2x faster, first-class TypeScript, schema validation built-in, modern async/await
   - Cons: Smaller ecosystem, less familiar

3. **NestJS**
   - Pros: Full framework, dependency injection, Angular-like structure
   - Cons: Opinionated, heavier, overkill for this project

**Decision**: Fastify

**Rationale**:
- Performance matters (2x faster than Express)
- Excellent TypeScript support out of the box
- Schema validation built-in (less dependencies)
- Modern async/await patterns throughout
- Growing ecosystem, good documentation
- Lighter than NestJS but more structured than Express

**Consequences**:
- ✅ Better performance
- ✅ Type-safe request/response handling
- ✅ Built-in validation
- ⚠️ Smaller community than Express
- ⚠️ Fewer tutorials/examples

**Status**: Accepted

---

## ADR-006: Prisma as ORM

**Date**: 2026-04-11

**Context**:
Database access layer. Need type-safe queries and good migration system.

**Options Considered**:

1. **Prisma**
   - Pros: Auto-generated types, great DX, excellent migrations, Prisma Studio
   - Cons: Magic, some query limitations

2. **TypeORM**
   - Pros: Decorator-based, Active Record or Data Mapper patterns
   - Cons: Type safety gaps, maintenance concerns

3. **Drizzle ORM**
   - Pros: Lightweight, SQL-like, zero magic
   - Cons: Newer, smaller ecosystem

4. **Raw SQL (pg)**
   - Pros: Full control, no abstraction
   - Cons: No type safety, manual migrations, verbose

**Decision**: Prisma

**Rationale**:
- Auto-generated TypeScript types from schema (incredible DX)
- Migrations are first-class and reliable
- Prisma Studio for database GUI
- Great documentation and community
- Best-in-class type safety
- Perfect for interview demo (shows modern tooling knowledge)

**Consequences**:
- ✅ Excellent type safety
- ✅ Great developer experience
- ✅ Robust migration system
- ⚠️ Less control over generated SQL
- ⚠️ Some complex queries require raw SQL

**Status**: Accepted

---

## ADR-007: Soft Delete for Merged Persons

**Date**: 2026-04-11

**Context**:
When merging two person profiles, should we delete the original profiles or mark them as merged (soft delete)?

**Options Considered**:

1. **Hard Delete**
   - Pros: Clean database, no merged records cluttering queries
   - Cons: Data loss, no reversal, audit trail incomplete

2. **Soft Delete (isMerged flag + mergedInto reference)**
   - Pros: Preserve original data, enable reversal, complete audit trail
   - Cons: Database grows, must filter merged records in queries

**Decision**: Soft delete with `isMerged` flag and `mergedInto` reference

**Rationale**:
- Audit trail is critical - must preserve original data
- Enables potential un-merge feature (future)
- Attribution: maintain who created each original profile
- Merge history can reference original UUIDs

**Consequences**:
- ✅ Complete audit trail
- ✅ Potential for merge reversal
- ✅ Better debugging (can see original data)
- ⚠️ Must filter `WHERE isMerged = false` in queries
- ⚠️ Database grows (mitigated by indexes, archival strategy)

**Status**: Accepted

---

## ADR-008: UUID as Primary Key

**Date**: 2026-04-11

**Context**:
Person identifiers. Should we use auto-increment IDs, UUIDs, or something else?

**Options Considered**:

1. **Auto-increment Integer**
   - Pros: Smaller, faster joins, ordered
   - Cons: Predictable, exposes record count, merge complexity

2. **UUID v4**
   - Pros: Globally unique, unpredictable, merge-safe, distributed-friendly
   - Cons: Larger (16 bytes vs 4), slightly slower joins, not ordered

3. **ULID / KSUID**
   - Pros: Ordered UUIDs, time-based
   - Cons: Less standard, similar size to UUID

**Decision**: UUID v4

**Rationale**:
- Globally unique: safe for distributed systems (future)
- Unpredictable: no enumeration attacks
- Merge-safe: can generate new UUID for merged person without conflicts
- Standard: supported by PostgreSQL natively
- Prisma default: works seamlessly with `@default(uuid())`

**Consequences**:
- ✅ Globally unique IDs
- ✅ Merge-safe (new ID for merged person)
- ✅ No enumeration
- ⚠️ Larger index size (acceptable trade-off)
- ⚠️ Not time-ordered (but rarely needed)

**Status**: Accepted

---

## ADR-009: JWT for Authentication

**Date**: 2026-04-11

**Context**:
User authentication mechanism. Need to authenticate API requests.

**Options Considered**:

1. **Session Cookies (Server-Side Sessions)**
   - Pros: Revocable, secure, standard
   - Cons: Requires session store (Redis), harder to scale

2. **JWT (JSON Web Tokens)**
   - Pros: Stateless, scalable, standard, no session store needed
   - Cons: Not revocable without blocklist, larger cookies

3. **OAuth 2.0 (External Providers)**
   - Pros: No password management, trusted providers
   - Cons: Dependency on third parties, more complex

**Decision**: JWT for MVP, OAuth in future

**Rationale**:
- Stateless: scales horizontally without session store
- Simple for MVP: no Redis dependency
- Standard: works well with Next.js and Fastify
- Future: can add OAuth providers (Google, Facebook) alongside JWT

**Implementation**:
```typescript
// Sign
const token = jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: '7d' });

// Verify
const decoded = jwt.verify(token, JWT_SECRET);
```

**Consequences**:
- ✅ Stateless and scalable
- ✅ Simple implementation
- ✅ No session store needed
- ⚠️ Tokens not revocable (add refresh token strategy later)
- ⚠️ Must protect JWT_SECRET carefully

**Status**: Accepted

---

## ADR-010: Tailwind CSS + shadcn/ui

**Date**: 2026-04-11

**Context**:
Styling approach for frontend. Need clean, modern, reusable components.

**Options Considered**:

1. **Tailwind CSS (Utility-First)**
   - Pros: Fast, no CSS files, purges unused, very popular
   - Cons: Verbose JSX, learning curve

2. **CSS Modules**
   - Pros: Scoped styles, standard CSS
   - Cons: Separate files, more boilerplate

3. **Styled Components (CSS-in-JS)**
   - Pros: Dynamic styles, component-scoped
   - Cons: Runtime cost, larger bundle, Next.js App Router compatibility issues

4. **Material-UI / Chakra UI**
   - Pros: Complete component library
   - Cons: Opinionated design, harder to customize

**Decision**: Tailwind CSS + shadcn/ui

**Rationale**:
- Tailwind: Industry standard, great DX, purges unused CSS
- shadcn/ui: Unstyled, accessible components that you own (not a dependency)
- Full customization: we control the component code
- Beautiful defaults: looks premium out of the box
- Interview appeal: shows modern UI engineering

**Consequences**:
- ✅ Fast development with utility classes
- ✅ Beautiful, accessible components
- ✅ Full design control
- ✅ Small bundle size (purged CSS)
- ⚠️ Initial learning curve for Tailwind
- ⚠️ JSX can be verbose with many classes

**Status**: Accepted

---

## ADR-011: Deployment: Vercel + Railway + Neon

**Date**: 2026-04-11

**Context**:
Where to deploy frontend, backend, and database for production.

**Options Considered**:

**Frontend**:
1. Vercel (Next.js optimized)
2. Netlify (similar to Vercel)
3. AWS Amplify
4. Self-hosted (EC2, DigitalOcean)

**Backend**:
1. Railway (easy Node.js hosting)
2. Render (similar to Railway)
3. Fly.io (edge deployment)
4. AWS ECS/Fargate
5. Self-hosted

**Database**:
1. Neon (managed Postgres, instant branching)
2. Supabase (Postgres + auth + storage)
3. Railway Postgres
4. AWS RDS
5. Self-hosted Postgres

**Decision**: 
- Frontend: **Vercel**
- Backend: **Railway** (or Render as alternative)
- Database: **Neon**

**Rationale**:

**Vercel**:
- Built by Next.js creators - best Next.js support
- Automatic preview deployments for PRs
- Edge network for global performance
- Free tier sufficient for MVP

**Railway**:
- Simple, modern UI
- Excellent Node.js support
- Built-in preview environments
- Usage-based pricing (cost-effective)
- Easy to migrate to Render if needed (similar API)

**Neon**:
- Managed PostgreSQL (no ops overhead)
- Instant database branching (perfect for PR previews)
- Auto-scaling storage
- Generous free tier

**Consequences**:
- ✅ Minimal DevOps overhead
- ✅ Excellent developer experience
- ✅ Automatic preview deployments
- ✅ Cost-effective ($0 for development, ~$40-60/month for production)
- ⚠️ Vendor lock-in (mitigated by standard tech: Postgres, Node.js, Next.js)
- ⚠️ Less control than self-hosted

**Status**: Accepted

---

## ADR-012: Conventional Commits

**Date**: 2026-04-11

**Context**:
Git commit message format. Need consistency for changelog generation and code review.

**Decision**: Follow [Conventional Commits](https://www.conventionalcommits.org/) specification

**Format**:
```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style (formatting, no logic change)
- `refactor`: Code refactoring (no feat/fix)
- `test`: Adding or updating tests
- `chore`: Tooling, dependencies, config

**Examples**:
```bash
feat(person): add photo upload support
fix(merge): prevent duplicate relationships after merge
docs(readme): update installation instructions
chore(deps): upgrade prisma to v5.8.0
```

**Consequences**:
- ✅ Clear commit history
- ✅ Automated changelog generation
- ✅ Better code review experience
- ✅ Semantic versioning support
- ⚠️ Requires discipline

**Status**: Accepted

---

## Future Decisions

### Pending

- [ ] **ADR-013**: Caching strategy (Redis vs in-memory vs none)
- [ ] **ADR-014**: File upload strategy (S3 vs Cloudinary vs Supabase Storage)
- [ ] **ADR-015**: Tree visualization library (D3.js vs React Flow vs custom)
- [ ] **ADR-016**: Background job system (BullMQ vs pg-boss vs cron)
- [ ] **ADR-017**: Testing strategy (Jest vs Vitest, Playwright vs Cypress)

### Questions to Revisit

- When to introduce caching? (at what scale)
- When to extract microservices? (what metrics trigger this)
- When to add graph database? (if ever)
- When to introduce event sourcing? (for audit or not)

---

Last updated: 2026-04-11
