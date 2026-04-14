# Development Setup Guide

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 20+ ([Download](https://nodejs.org/))
- **pnpm** 8+ (recommended) or npm
  ```bash
  npm install -g pnpm
  ```
- **Git** ([Download](https://git-scm.com/))
- **PostgreSQL** 16+ ([Download](https://www.postgresql.org/download/))
  - Or use Docker (see below)
- **VS Code** (recommended) or your preferred editor

## Quick Start (Docker Compose)

The easiest way to get started is using Docker Compose:

```bash
# Clone repositories (once GitHub repos are set up)
git clone https://github.com/gana-family/gana-web frontend
git clone https://github.com/gana-family/gana-api backend
git clone https://github.com/gana-family/gana-infrastructure infrastructure

# Start all services with Docker
cd infrastructure
docker-compose up

# Frontend will be at http://localhost:3000
# Backend will be at http://localhost:4000
# Database will be at localhost:5432
```

## Manual Setup

### Step 1: Clone Repositories

```bash
# Create main Gana directory
mkdir gana
cd gana

# Clone all repos
git clone https://github.com/gana-family/gana-web frontend
git clone https://github.com/gana-family/gana-api backend
git clone https://github.com/gana-family/gana-infrastructure infrastructure
```

### Step 2: Database Setup

#### Option A: Local PostgreSQL

```bash
# Create database
createdb gana_dev

# Create test database
createdb gana_test
```

#### Option B: Docker PostgreSQL

```bash
docker run --name gana-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=gana_dev \
  -p 5432:5432 \
  -d postgres:16
```

#### Option C: Neon (Cloud PostgreSQL)

1. Sign up at [neon.tech](https://neon.tech)
2. Create a new project named "Gana"
3. Create database: `gana_dev`
4. Copy connection string (will look like `postgresql://user:pass@host/gana_dev`)

### Step 3: Backend Setup

```bash
cd backend

# Install dependencies
pnpm install

# Create .env file
cp .env.example .env

# Edit .env with your database connection
# DATABASE_URL="postgresql://user:password@localhost:5432/gana_dev"
# JWT_SECRET="your-secret-key-here"  # Generate with: openssl rand -base64 32

# Run database migrations
pnpm prisma migrate dev

# Seed database with sample data (optional)
pnpm prisma db seed

# Start development server
pnpm dev

# Backend will be running at http://localhost:4000
```

### Step 4: Frontend Setup

```bash
# Open new terminal
cd frontend

# Install dependencies
pnpm install

# Create .env.local file
cp .env.example .env.local

# Edit .env.local
# NEXT_PUBLIC_API_URL=http://localhost:4000

# Start development server
pnpm dev

# Frontend will be running at http://localhost:3000
```

### Step 5: Verify Setup

1. Open browser to `http://localhost:3000`
2. You should see the Gana landing page
3. Click "Sign Up" and create an account
4. Create your first person profile
5. Verify the profile appears in the database:
   ```bash
   cd backend
   pnpm prisma studio
   # Opens Prisma Studio at http://localhost:5555
   ```

## Environment Variables

### Backend (.env)

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/gana_dev"

# JWT Authentication
JWT_SECRET="generate-with-openssl-rand-base64-32"
JWT_EXPIRES_IN="7d"

# Server
PORT=4000
NODE_ENV="development"

# CORS
ALLOWED_ORIGINS="http://localhost:3000"

# Logging
LOG_LEVEL="debug"
```

### Frontend (.env.local)

```bash
# API
NEXT_PUBLIC_API_URL="http://localhost:4000"

# Environment
NEXT_PUBLIC_ENV="development"
```

## Database Migrations

### Create a New Migration

```bash
cd backend

# After editing schema.prisma
pnpm prisma migrate dev --name describe_your_change

# Example:
pnpm prisma migrate dev --name add_person_photos
```

### Reset Database (⚠️ Destructive)

```bash
# Drops all tables and re-runs migrations
pnpm prisma migrate reset

# With seed data
pnpm prisma migrate reset --seed
```

### View Database

```bash
# Open Prisma Studio (GUI for database)
pnpm prisma studio
```

## Common Development Tasks

### Run Tests

```bash
# Backend tests
cd backend
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Frontend tests
cd frontend
pnpm test
```

### Linting & Formatting

```bash
# Backend
cd backend
pnpm lint          # Check for issues
pnpm lint:fix      # Auto-fix issues
pnpm format        # Format with Prettier

# Frontend
cd frontend
pnpm lint
pnpm lint:fix
pnpm format
```

### Type Checking

```bash
# Backend
cd backend
pnpm type-check

# Frontend
cd frontend
pnpm type-check
```

### Build for Production

```bash
# Backend
cd backend
pnpm build

# Frontend
cd frontend
pnpm build
```

## Troubleshooting

### Issue: Port 3000 or 4000 already in use

```bash
# Find process using port
lsof -i :3000
lsof -i :4000

# Kill process
kill -9 <PID>

# Or use different ports in .env files
```

### Issue: Database connection failed

```bash
# Check PostgreSQL is running
pg_isready

# Check connection string in .env
# Make sure user/password/database are correct

# Test connection manually
psql postgresql://user:password@localhost:5432/gana_dev
```

### Issue: Prisma migrate fails

```bash
# Check database exists
psql -l | grep gana

# Check DATABASE_URL is correct
echo $DATABASE_URL

# Try resetting (⚠️ deletes all data)
pnpm prisma migrate reset
```

### Issue: Module not found errors

```bash
# Delete node_modules and reinstall
rm -rf node_modules
pnpm install

# Clear pnpm cache
pnpm store prune
```

### Issue: Frontend can't reach backend API

```bash
# Check backend is running
curl http://localhost:4000/health

# Check NEXT_PUBLIC_API_URL in frontend/.env.local
# Make sure no trailing slash

# Check CORS settings in backend .env
# ALLOWED_ORIGINS should include http://localhost:3000
```

## VS Code Setup

### Recommended Extensions

- **ESLint** (`dbaeumer.vscode-eslint`)
- **Prettier** (`esbenp.prettier-vscode`)
- **Prisma** (`Prisma.prisma`)
- **TypeScript** (built-in)
- **GitLens** (`eamodio.gitlens`)

### Workspace Settings

Create `.vscode/settings.json` in each repo:

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true
}
```

## Git Workflow

### Branch Naming

```bash
# Feature branches
git checkout -b feature/add-person-photos

# Bug fixes
git checkout -b fix/merge-duplicate-relationships

# Chores/refactoring
git checkout -b chore/update-dependencies
```

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Format: <type>(<scope>): <description>

feat(person): add photo upload
fix(merge): prevent duplicate relationships after merge
docs(readme): update setup instructions
chore(deps): update prisma to v5.8.0
test(person): add unit tests for person creation
```

### Before Committing

```bash
# Run checks
pnpm lint
pnpm type-check
pnpm test

# Or use the pre-commit hook (Husky will run automatically)
```

## Development Workflow

### Typical Development Flow

1. **Pull latest changes**
   ```bash
   git checkout main
   git pull origin main
   ```

2. **Create feature branch**
   ```bash
   git checkout -b feature/my-feature
   ```

3. **Make changes**
   - Edit code
   - Run locally to test
   - Write tests

4. **Run quality checks**
   ```bash
   pnpm lint
   pnpm type-check
   pnpm test
   ```

5. **Commit changes**
   ```bash
   git add .
   git commit -m "feat(scope): description"
   ```

6. **Push and create PR**
   ```bash
   git push origin feature/my-feature
   # Create PR on GitHub
   ```

7. **CI runs automatically**
   - Lint checks
   - Type checks
   - Tests
   - Build verification

8. **Merge after approval**
   - Squash and merge
   - Delete branch

9. **Auto-deploy to dev environment**

## Database Schema Changes

### Workflow for Schema Changes

1. **Edit `prisma/schema.prisma`**
   ```prisma
   model Person {
     // ... existing fields
     nickname String?  // New field
   }
   ```

2. **Create migration**
   ```bash
   pnpm prisma migrate dev --name add_person_nickname
   ```

3. **Verify migration**
   - Check `prisma/migrations/` folder
   - Review generated SQL
   - Test locally

4. **Update TypeScript types**
   ```bash
   pnpm prisma generate
   ```

5. **Update API code to use new field**

6. **Commit everything**
   ```bash
   git add prisma/
   git commit -m "feat(schema): add nickname field to Person"
   ```

## Performance Profiling

### Backend API

```bash
# Use clinic.js for profiling
npm install -g clinic

# Profile server
clinic doctor -- node dist/main.js

# Or use built-in Node profiler
node --inspect dist/main.js
# Open chrome://inspect in Chrome
```

### Frontend

```bash
# Next.js has built-in profiling
# Open http://localhost:3000?profile=true

# Use React DevTools Profiler
# Install React DevTools extension
```

## Useful Commands

### Backend

```bash
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm start            # Start production server
pnpm test             # Run tests
pnpm lint             # Lint code
pnpm format           # Format code
pnpm type-check       # TypeScript check
pnpm prisma:studio    # Open Prisma Studio
pnpm prisma:migrate   # Create migration
pnpm prisma:generate  # Generate Prisma Client
```

### Frontend

```bash
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm start            # Start production server
pnpm test             # Run tests
pnpm lint             # Lint code
pnpm format           # Format code
pnpm type-check       # TypeScript check
```

## Next Steps

After setup is complete:

1. ✅ Explore the codebase
2. ✅ Read [Architecture documentation](./architecture.md)
3. ✅ Review [Data Model documentation](./data-model.md)
4. ✅ Try creating your first person profile
5. ✅ Run the test suite
6. ✅ Pick an issue to work on
7. ✅ Submit your first PR!

## Getting Help

- **Documentation**: Check `/docs` folder
- **Issues**: GitHub Issues on respective repos
- **Questions**: Open a discussion on GitHub

---

Last updated: 2026-04-11
