# Gana Infrastructure

DevOps configuration, Docker setup, and CI/CD pipelines for the Gana project.

## Contents

- **docker/** - Docker and Docker Compose configuration
- **.github/workflows/** - GitHub Actions CI/CD pipelines

## Quick Start with Docker Compose

### Prerequisites

- Docker Desktop (or Docker + Docker Compose)
- Git

### Local Development Setup

```bash
# From the gana root directory
cd infrastructure/docker

# Start all services
docker-compose up

# Or run in detached mode
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Stop and remove volumes (⚠️ deletes database)
docker-compose down -v
```

### Services

| Service | Port | Description |
|---------|------|-------------|
| `postgres` | 5432 | PostgreSQL database |
| `backend` | 4000 | Node.js API server |
| `frontend` | 3000 | Next.js frontend |

### Accessing Services

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000
- **Backend Health**: http://localhost:4000/health
- **Database**: `postgresql://gana:gana_dev_password@localhost:5432/gana_dev`

## Docker Compose Configuration

### Environment Variables

Default values are set in `docker-compose.yml`. Override by creating `.env` file:

```env
# Database
POSTGRES_USER=gana
POSTGRES_PASSWORD=your_password
POSTGRES_DB=gana_dev

# Backend
JWT_SECRET=your-jwt-secret
PORT=4000

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### Volume Persistence

Data is persisted in Docker volumes:

- `postgres_data` - Database data (survives container restarts)

To reset database:

```bash
docker-compose down -v  # ⚠️ Deletes all data
docker-compose up
```

## Production Dockerfiles

### Backend Dockerfile

Multi-stage build for optimized production image:

```bash
# Build backend image
cd backend
docker build -f ../infrastructure/docker/Dockerfile.backend -t gana-backend:latest .

# Run backend container
docker run -p 4000:4000 \
  -e DATABASE_URL=postgresql://... \
  -e JWT_SECRET=... \
  gana-backend:latest
```

### Frontend Dockerfile

Multi-stage build for Next.js:

```bash
# Build frontend image
cd frontend
docker build -f ../infrastructure/docker/Dockerfile.frontend -t gana-frontend:latest .

# Run frontend container
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=https://api.gana.app \
  gana-frontend:latest
```

## GitHub Actions CI/CD

### Backend CI

Workflow: `.github/workflows/backend-ci.yml`

**Triggers**:
- Pull requests to `main` or `develop`
- Pushes to `main` or `develop`

**Steps**:
1. Checkout code
2. Setup Node.js 20
3. Install dependencies (pnpm)
4. Generate Prisma Client
5. Run database migrations (test DB)
6. Lint code
7. Type check
8. Run tests with coverage
9. Build
10. Upload coverage to Codecov

**Required Secrets**: None (uses GitHub-hosted PostgreSQL)

### Frontend CI

Workflow: `.github/workflows/frontend-ci.yml`

**Triggers**:
- Pull requests to `main` or `develop`
- Pushes to `main` or `develop`

**Steps**:
1. Checkout code
2. Setup Node.js 20
3. Install dependencies (pnpm)
4. Lint code
5. Type check
6. Run tests with coverage
7. Build Next.js app
8. Upload coverage to Codecov

**Required Secrets**: None

### Setting up CI in Your Repository

1. **Copy workflow files** to each repository:
   ```bash
   # In gana-api repo
   cp infrastructure/.github/workflows/backend-ci.yml .github/workflows/

   # In gana-web repo
   cp infrastructure/.github/workflows/frontend-ci.yml .github/workflows/
   ```

2. **Configure branch protection**:
   - Go to repo Settings → Branches
   - Add rule for `main`
   - Require status checks to pass before merging
   - Select "lint-and-test" job

3. **Optional: Add Codecov**:
   - Sign up at https://codecov.io
   - Add repository
   - No secret needed (GitHub Actions auto-authenticates)

## Deployment

See [Deployment Guide](../docs/deployment.md) for production deployment to:

- **Vercel** (Frontend)
- **Railway** (Backend)
- **Neon** (Database)

## Development Tips

### Rebuild Containers

```bash
# Rebuild all containers
docker-compose build

# Rebuild specific service
docker-compose build backend

# Rebuild and start
docker-compose up --build
```

### Execute Commands in Containers

```bash
# Backend shell
docker-compose exec backend sh

# Run Prisma Studio
docker-compose exec backend pnpm prisma studio

# Run migrations
docker-compose exec backend pnpm prisma migrate dev

# Frontend shell
docker-compose exec frontend sh
```

### View Logs

```bash
# All services
docker-compose logs

# Specific service
docker-compose logs backend

# Follow logs
docker-compose logs -f backend

# Last 100 lines
docker-compose logs --tail=100 backend
```

### Cleanup

```bash
# Stop and remove containers
docker-compose down

# Remove volumes (⚠️ deletes database)
docker-compose down -v

# Remove everything including images
docker-compose down --rmi all -v
```

## Troubleshooting

### Port Already in Use

```bash
# Find process using port
lsof -i :3000
lsof -i :4000
lsof -i :5432

# Kill process
kill -9 <PID>

# Or change ports in docker-compose.yml
ports:
  - '3001:3000'  # Host:Container
```

### Database Connection Failed

```bash
# Check if postgres is healthy
docker-compose ps

# View postgres logs
docker-compose logs postgres

# Restart postgres
docker-compose restart postgres

# Check from backend container
docker-compose exec backend sh
ping postgres
```

### Node Modules Out of Sync

```bash
# Remove node_modules and reinstall
docker-compose down
docker-compose build --no-cache
docker-compose up
```

### Prisma Issues

```bash
# Generate client
docker-compose exec backend pnpm prisma generate

# Reset database
docker-compose exec backend pnpm prisma migrate reset

# View database
docker-compose exec backend pnpm prisma studio
```

## Performance Optimization

### For Development

```bash
# Use bind mounts for hot reload (already configured in docker-compose.yml)
volumes:
  - ../../backend:/app
  - /app/node_modules  # Anonymous volume for node_modules
```

### For Production

- Multi-stage builds reduce image size
- Only production dependencies installed
- No source maps in final image
- Minimal base image (alpine)

## Security

### Development

- ⚠️ Uses weak passwords (fine for local dev)
- ⚠️ Exposes all ports (fine for local dev)
- ⚠️ Debug logging enabled

### Production

- ✅ Use strong passwords from secrets
- ✅ Only expose necessary ports
- ✅ Use environment variables for secrets
- ✅ Run as non-root user
- ✅ Scan images for vulnerabilities

## License

Private/Proprietary

---

Built with care by Yael Dauber
