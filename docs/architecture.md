# Gana Architecture

## Overview

Gana uses a **modular service-oriented architecture** designed to start as a well-structured monolith with clear domain boundaries that can evolve into microservices when scale demands it.

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Users                                │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (Next.js)                        │
│  • App Router (React Server Components)                     │
│  • Tailwind CSS + shadcn/ui                                 │
│  • Client State: Zustand                                    │
│  • Data Fetching: React Query                               │
│  • Visualization: D3.js / React Flow                        │
└─────────────────────────────────────────────────────────────┘
                              │
                         HTTP/REST
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              Backend API (Node.js + Fastify)                 │
│                                                              │
│  ┌────────────┐ ┌──────────┐ ┌──────────────┐             │
│  │  Identity  │ │  Person  │ │ Relationship │             │
│  │   Module   │ │  Module  │ │    Module    │             │
│  └────────────┘ └──────────┘ └──────────────┘             │
│                                                              │
│  ┌────────────┐ ┌──────────┐ ┌──────────────┐             │
│  │   Merge    │ │   Tree   │ │ Collaboration│             │
│  │   Module   │ │  Module  │ │    Module    │             │
│  └────────────┘ └──────────┘ └──────────────┘             │
│                                                              │
│  ┌─────────────────────────────────────────────┐           │
│  │         Shared Infrastructure                │           │
│  │  • Validation • Errors • Auth • Logging     │           │
│  └─────────────────────────────────────────────┘           │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  PostgreSQL Database                         │
│  • Prisma ORM                                               │
│  • ACID transactions                                         │
│  • Recursive CTEs for graph queries                         │
│  • JSONB for flexible metadata                              │
└─────────────────────────────────────────────────────────────┘
```

## Domain Modules

### Identity Module
**Responsibility**: User authentication, authorization, and session management

**Key Components**:
- User registration and login
- Password hashing (bcrypt)
- JWT token generation and validation
- Session management

**Database Tables**: `User`, `Session`

### Person Module
**Responsibility**: Person profile creation, updates, and retrieval

**Key Components**:
- CRUD operations for persons
- Person search and filtering
- Name management (multiple names, name changes)
- Life event tracking (birth, death, etc.)

**Database Tables**: `Person`, `PersonName`, `PersonAttribute`

**Design Note**: Person IDs are UUIDs and are the stable identifier. Names are stored separately to support name changes over time and alternate names.

### Relationship Module
**Responsibility**: Managing connections between people

**Key Components**:
- Create/update/delete relationships
- Bidirectional consistency enforcement (if A is parent of B, B is child of A)
- Relationship validation (prevent cycles, impossible relationships)
- Time-bound relationships (married 1980-1990)

**Database Tables**: `Relationship`

**Relationship Types**:
- `PARENT` / `CHILD` (automatically bidirectional)
- `PARTNER` (symmetric)
- `SIBLING` (symmetric)

### Merge Module
**Responsibility**: Duplicate detection and profile merging

**Key Components**:
- Duplicate detection algorithm (background job)
- Merge proposal generation
- Conflict resolution engine
- Atomic merge transactions
- Merge reversal (future)

**Database Tables**: `MergeProposal`, `MergeHistory`, `MergeConflict`

**Design Philosophy**: Merges are ACID transactions that preserve all original data for auditability and potential reversal.

### Tree Module
**Responsibility**: Family tree traversal and visualization

**Key Components**:
- Find ancestors (recursive up)
- Find descendants (recursive down)
- Find relatives (cousins, aunts, uncles, etc.)
- Tree layout calculation
- Subtree extraction

**Database Tables**: None (uses `Person` and `Relationship`)

**Technical Approach**: PostgreSQL recursive CTEs for efficient graph traversal.

### Collaboration Module (Future)
**Responsibility**: Multi-user collaboration, permissions, and invitations

**Key Components** (planned):
- Family workspace management
- Invitations
- Permission levels (view, edit, admin)
- Activity feed

## Data Flow Patterns

### Creating a Person

```
User → Frontend Form → Validation (Zod)
  → API Request → Backend Validation (Zod)
  → Person Module → Prisma → PostgreSQL
  → Audit Log Created → Response → Frontend
```

### Merge Workflow

```
Background Job → Detect Duplicates → Create MergeProposal
  → User Reviews → Conflict Resolution UI
  → User Submits Decisions → Merge Module
  → BEGIN TRANSACTION
    - Create merged person
    - Redirect relationships
    - Mark originals as merged
    - Create MergeHistory
    - Create AuditLog
  → COMMIT
  → Response → Frontend
```

## Technology Decisions

### Why PostgreSQL?

**Chosen over**: Neo4j (graph database), MongoDB (document database)

**Reasoning**:
1. **ACID guarantees** - Critical for merge transactions
2. **Audit trail** - Relational triggers and history tables are battle-tested
3. **Recursive CTEs** - Handle "find all ancestors" elegantly
4. **JSONB** - Flexible metadata without sacrificing structure
5. **Tooling** - Prisma, pgAdmin, excellent ecosystem
6. **Interview appeal** - Demonstrates strong data modeling skills
7. **Deployment** - Neon, Supabase, Railway all excellent

**Trade-offs**:
- Graph queries less intuitive than Cypher (Neo4j)
- May need caching for complex relationship queries at scale

**Mitigation**:
- Use recursive CTEs effectively
- Add caching layer if needed (Redis)
- Consider read replica or CQRS pattern if query load grows

### Why Modular Monolith over Microservices?

**Reasoning**:
1. **Shared transactions** - Merges require atomicity across domains
2. **Operational simplicity** - No distributed systems complexity
3. **Faster iteration** - Single deployment, easier debugging
4. **Future-ready** - Clear boundaries allow extraction later

**Preparation for Future Microservices**:
- Each module is a separate folder with clear boundaries
- Modules communicate through defined interfaces
- Domain-driven design principles
- No circular dependencies between modules

**When to split**:
- When a module has independent scaling needs
- When team grows and needs to own separate services
- When deployment independence provides clear value

### Why Fastify over Express?

**Reasoning**:
1. **Performance** - Significantly faster than Express
2. **TypeScript** - First-class TypeScript support
3. **Schema validation** - Built-in JSON schema validation
4. **Modern** - Async/await throughout, no callback hell
5. **Ecosystem** - Growing plugin ecosystem

### Why Prisma over TypeORM/Sequelize?

**Reasoning**:
1. **Type safety** - Auto-generated types from schema
2. **DX** - Excellent developer experience, great VSCode integration
3. **Migrations** - Robust migration system
4. **Query builder** - Intuitive, type-safe query API
5. **Ecosystem** - Active development, strong community

## Security Architecture

### Authentication Flow

1. User submits credentials → Backend validates
2. Password compared using bcrypt
3. JWT token generated with user ID + expiry
4. Token returned to client
5. Client stores token (httpOnly cookie or localStorage)
6. Subsequent requests include token in Authorization header
7. Backend validates token on protected routes

### Authorization

**Current**: Simple user-owns-data model
- Users can create/edit any person (for MVP)
- Users can only edit their own profile

**Future**: Role-based permissions
- Family workspace admins
- View-only members
- Edit permissions per person/branch

## Scalability Considerations

### Database

**Current**: Single PostgreSQL instance

**Future options**:
1. **Read replicas** - Scale read queries
2. **Connection pooling** - PgBouncer for connection efficiency
3. **Partitioning** - Partition large tables by date or family
4. **Caching** - Redis for frequently accessed data

### API

**Current**: Single Node.js instance

**Future options**:
1. **Horizontal scaling** - Multiple instances behind load balancer
2. **Module extraction** - Extract modules to separate services
3. **API Gateway** - Centralized routing, rate limiting, auth

### Frontend

**Current**: Next.js on Vercel (auto-scales)

**Future options**:
1. **Edge rendering** - Vercel Edge Functions for global performance
2. **CDN** - Static assets on CDN
3. **Code splitting** - Lazy load heavy components (tree visualization)

## Deployment Architecture

```
┌──────────────────┐
│   Vercel         │  Frontend (gana-web)
│   Edge Network   │  • Auto-scaling
└──────────────────┘  • Global CDN
                      • Preview deploys
         │
         ▼
┌──────────────────┐
│   Railway        │  Backend (gana-api)
│   or Render      │  • Auto-scaling
└──────────────────┘  • Health checks
                      • Zero-downtime deploys
         │
         ▼
┌──────────────────┐
│   Neon           │  PostgreSQL Database
│   Postgres       │  • Managed service
└──────────────────┘  • Auto-scaling storage
                      • Branch per environment
```

## Development Workflow

```
Feature Branch → PR → CI (lint, test, type-check)
  → Merge to develop → Auto-deploy to Dev Environment
  → Manual testing → Merge to main
  → Auto-deploy to Staging → QA
  → Manual promotion → Production
```

## Error Handling Strategy

### API Errors

All errors follow consistent structure:

```typescript
{
  error: {
    code: "VALIDATION_ERROR",
    message: "Human-readable message",
    details: { field: "email", issue: "invalid format" }
  }
}
```

### Error Categories

- `VALIDATION_ERROR` - Input validation failed
- `AUTHENTICATION_ERROR` - Auth failed
- `AUTHORIZATION_ERROR` - Insufficient permissions
- `NOT_FOUND` - Resource doesn't exist
- `CONFLICT` - Business rule violation (e.g., duplicate relationship)
- `INTERNAL_ERROR` - Unexpected server error

### Error Logging

- All errors logged to structured logs (Winston)
- Critical errors → alert (future: PagerDuty, Sentry)
- User-facing errors → generic message, detailed logs server-side

## Observability (Future)

**Metrics**:
- Request latency (p50, p95, p99)
- Error rates by endpoint
- Database query performance
- Merge operation success/failure rates

**Logging**:
- Structured JSON logs
- Request tracing IDs
- User action audit trail

**Monitoring**:
- Sentry for error tracking
- Datadog or equivalent for APM
- Uptime monitoring (Pingdom, Better Uptime)

## Testing Strategy

### Backend
- **Unit tests**: Module logic (Jest)
- **Integration tests**: API endpoints with test database
- **E2E tests**: Critical flows (Playwright) - future

### Frontend
- **Unit tests**: Component logic (Jest + Testing Library)
- **Integration tests**: Page flows
- **E2E tests**: User journeys (Playwright) - future

**Coverage target**: 80%+ for backend modules, 70%+ for frontend

---

Last updated: 2026-04-11
