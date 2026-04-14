# Gana API - Backend

The backend API for the Gana family heritage platform.

## Tech Stack

- **Runtime**: Node.js 20+
- **Language**: TypeScript (strict mode)
- **Framework**: Fastify
- **Database**: PostgreSQL 16+ via Prisma ORM
- **Authentication**: JWT
- **Validation**: Zod
- **Logging**: Winston
- **Testing**: Jest

## Project Structure

```
src/
├── modules/              # Domain modules
│   ├── identity/         # User auth & sessions
│   ├── person/           # Person management
│   ├── relationship/     # Relationships between people
│   ├── merge/            # Duplicate detection & merging
│   └── tree/             # Family tree operations
├── shared/               # Shared utilities
│   ├── database/         # Prisma client
│   ├── validation/       # Zod schemas
│   ├── errors/           # Error classes
│   ├── middleware/       # Fastify middleware
│   └── utils/            # Helper functions
├── server.ts             # Server configuration
└── main.ts               # Application entry point

prisma/
├── schema.prisma         # Database schema
├── migrations/           # Database migrations
└── seed.ts               # Seed data

tests/
└── (unit and integration tests)
```

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL 16+
- pnpm (recommended) or npm

### Installation

```bash
# Install dependencies
pnpm install

# Create .env file
cp .env.example .env

# Edit .env with your database connection string
# DATABASE_URL="postgresql://user:password@localhost:5432/gana_dev"
# JWT_SECRET="generate-with: openssl rand -base64 32"

# Run database migrations
pnpm prisma migrate dev

# Seed database with sample data (optional)
pnpm prisma:seed
```

### Development

```bash
# Start development server (hot reload)
pnpm dev

# Server will be running at http://localhost:4000
```

### Testing

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage
```

### Code Quality

```bash
# Lint code
pnpm lint

# Fix linting issues
pnpm lint:fix

# Format code with Prettier
pnpm format

# Type check
pnpm type-check
```

### Database

```bash
# Create a new migration
pnpm prisma migrate dev --name describe_your_change

# Run pending migrations
pnpm prisma migrate deploy

# Open Prisma Studio (database GUI)
pnpm prisma studio

# Reset database (⚠️ destructive)
pnpm prisma migrate reset

# Generate Prisma Client after schema changes
pnpm prisma generate
```

### Build

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

## API Endpoints

### Health Check

```bash
GET /health
```

Returns server health status.

### API Info

```bash
GET /api
```

Returns API information.

### Authentication (Coming Soon)

```bash
POST /api/auth/register    # Register new user
POST /api/auth/login       # Login
POST /api/auth/logout      # Logout
GET  /api/auth/me          # Get current user
```

### Persons (Coming Soon)

```bash
GET    /api/persons        # List persons
GET    /api/persons/:id    # Get person by ID
POST   /api/persons        # Create person
PUT    /api/persons/:id    # Update person
DELETE /api/persons/:id    # Delete person (soft delete)
```

### Relationships (Coming Soon)

```bash
GET    /api/relationships           # List relationships
GET    /api/relationships/:id       # Get relationship
POST   /api/relationships           # Create relationship
PUT    /api/relationships/:id       # Update relationship
DELETE /api/relationships/:id       # Delete relationship
GET    /api/persons/:id/relationships  # Get person's relationships
```

### Merge (Coming Soon)

```bash
GET    /api/merge/proposals         # List merge proposals
GET    /api/merge/proposals/:id     # Get merge proposal
POST   /api/merge/proposals         # Create merge proposal
GET    /api/merge/preview           # Preview merge
POST   /api/merge/execute           # Execute merge
DELETE /api/merge/proposals/:id     # Reject merge proposal
```

### Family Tree (Coming Soon)

```bash
GET /api/tree/:personId/ancestors   # Get ancestors
GET /api/tree/:personId/descendants # Get descendants
GET /api/tree/:personId/relatives   # Get all relatives
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | (required) |
| `JWT_SECRET` | Secret key for JWT signing | (required) |
| `JWT_EXPIRES_IN` | JWT expiration time | `7d` |
| `PORT` | Server port | `4000` |
| `HOST` | Server host | `0.0.0.0` |
| `NODE_ENV` | Environment | `development` |
| `ALLOWED_ORIGINS` | CORS allowed origins | `http://localhost:3000` |
| `LOG_LEVEL` | Logging level | `info` |

## Database Schema

See [Data Model Documentation](../docs/data-model.md) for complete schema details.

### Core Tables

- **users** - Authenticated users
- **persons** - Individual people in family trees
- **relationships** - Connections between people
- **merge_proposals** - Detected potential duplicates
- **merge_history** - Complete merge audit trail
- **audit_logs** - All data changes

## Error Handling

All API errors follow this format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message",
    "details": { ... }
  }
}
```

### Error Codes

- `VALIDATION_ERROR` (400) - Input validation failed
- `AUTHENTICATION_ERROR` (401) - Authentication failed
- `AUTHORIZATION_ERROR` (403) - Insufficient permissions
- `NOT_FOUND` (404) - Resource not found
- `CONFLICT` (409) - Business rule violation
- `INTERNAL_ERROR` (500) - Server error

## Module Structure

Each module follows this structure:

```
modules/example/
├── example.routes.ts      # API route definitions
├── example.service.ts     # Business logic
├── example.validation.ts  # Zod schemas
├── example.types.ts       # TypeScript types
└── __tests__/
    ├── example.service.test.ts
    └── example.routes.test.ts
```

## Development Guidelines

### Code Style

- Use TypeScript strict mode
- No `any` types (use `unknown` if truly unknown)
- Prefer `async/await` over callbacks/promises
- Use Zod for validation
- Follow Prettier formatting

### Testing

- Write tests for all business logic
- Integration tests for API endpoints
- Aim for 70%+ coverage

### Commits

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
feat(person): add photo upload
fix(merge): prevent duplicate relationships
docs(readme): update setup instructions
chore(deps): upgrade prisma
```

## Deployment

See [Deployment Guide](../docs/deployment.md) for production deployment.

### Quick Deploy to Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy
railway up
```

## Contributing

1. Create feature branch: `git checkout -b feature/my-feature`
2. Make changes
3. Run tests: `pnpm test`
4. Run linting: `pnpm lint`
5. Commit: `git commit -m "feat(scope): description"`
6. Push: `git push origin feature/my-feature`
7. Create Pull Request

## License

Private/Proprietary

---

Built with care by Yael Dauber
