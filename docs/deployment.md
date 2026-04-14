# Deployment Guide

## Overview

Gana uses a modern, cloud-native deployment strategy with continuous deployment for rapid iteration:

- **Frontend**: Vercel (Next.js optimized)
- **Backend**: Railway or Render (Node.js hosting)
- **Database**: Neon (managed PostgreSQL)

## Environments

| Environment | Purpose | Branch | Auto-Deploy | URL |
|-------------|---------|--------|-------------|-----|
| **Local** | Development | any | No | localhost |
| **Development** | Testing | `develop` | Yes | dev.gana.app (TBD) |
| **Staging** | Pre-production QA | `main` | Yes | staging.gana.app (TBD) |
| **Production** | Live | `production` | Manual | gana.app (TBD) |

## Initial Setup

### 1. Database (Neon)

**Why Neon**: Managed PostgreSQL with instant branching, auto-scaling, and excellent DX.

#### Steps:

1. **Sign up**: [neon.tech](https://neon.tech)
2. **Create project**: "Gana"
3. **Create databases**:
   - `gana_dev` (development branch)
   - `gana_staging` (staging branch)
   - `gana_prod` (production branch - main)

4. **Copy connection strings**:
   ```
   # Development
   postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/gana_dev

   # Staging
   postgresql://user:pass@ep-yyy.us-east-2.aws.neon.tech/gana_staging

   # Production
   postgresql://user:pass@ep-zzz.us-east-2.aws.neon.tech/gana_prod
   ```

5. **Database branching** (Neon feature):
   - For each PR, create a database branch
   - Test migrations safely
   - Delete branch after merge

---

### 2. Backend (Railway)

**Why Railway**: Excellent Node.js support, built-in PostgreSQL, simple deploys, preview environments.

**Alternative**: Render (similar features, slightly different pricing)

#### Steps:

1. **Sign up**: [railway.app](https://railway.app)

2. **Create project**: "Gana API"

3. **Connect GitHub repo**: `gana-api`

4. **Set environment variables**:
   ```bash
   DATABASE_URL=${{Neon.DATABASE_URL}}  # From Neon
   JWT_SECRET=<generate-secure-secret>
   JWT_EXPIRES_IN=7d
   NODE_ENV=production
   ALLOWED_ORIGINS=https://gana.app,https://staging.gana.app
   PORT=4000
   ```

5. **Configure build**:
   ```json
   {
     "build": {
       "command": "pnpm install && pnpm prisma generate && pnpm build",
       "output": "dist"
     },
     "start": {
       "command": "pnpm prisma migrate deploy && pnpm start"
     }
   }
   ```

6. **Deploy**:
   - Push to `main` branch
   - Railway auto-deploys
   - Get deployment URL: `https://gana-api-production.up.railway.app`

#### Railway.json Configuration

Create `railway.json` in backend repo:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "pnpm install && pnpm prisma generate && pnpm build"
  },
  "deploy": {
    "startCommand": "pnpm prisma migrate deploy && pnpm start",
    "healthcheckPath": "/health",
    "healthcheckTimeout": 300,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

---

### 3. Frontend (Vercel)

**Why Vercel**: Built by Next.js team, best Next.js performance, automatic previews.

#### Steps:

1. **Sign up**: [vercel.com](https://vercel.com)

2. **Import project**: 
   - Select `gana-web` repo
   - Auto-detects Next.js

3. **Configure**:
   - **Framework Preset**: Next.js
   - **Root Directory**: `/`
   - **Build Command**: `pnpm build`
   - **Output Directory**: `.next`

4. **Set environment variables**:
   ```bash
   # Production
   NEXT_PUBLIC_API_URL=https://gana-api-production.up.railway.app
   NEXT_PUBLIC_ENV=production

   # Staging
   NEXT_PUBLIC_API_URL=https://gana-api-staging.up.railway.app
   NEXT_PUBLIC_ENV=staging
   ```

5. **Deploy**:
   - Push to `main` branch
   - Vercel auto-deploys
   - Get URL: `https://gana.vercel.app`

6. **Custom domain** (later):
   - Add `gana.app` in Vercel dashboard
   - Configure DNS records as instructed

#### Vercel Configuration

Create `vercel.json` in frontend repo:

```json
{
  "buildCommand": "pnpm build",
  "devCommand": "pnpm dev",
  "installCommand": "pnpm install",
  "framework": "nextjs",
  "outputDirectory": ".next",
  "regions": ["iad1"],
  "env": {
    "NEXT_PUBLIC_API_URL": "@api-url"
  }
}
```

---

## Deployment Workflows

### CI/CD Pipeline (GitHub Actions)

#### Backend CI (`.github/workflows/backend-ci.yml`)

```yaml
name: Backend CI

on:
  pull_request:
    paths:
      - 'backend/**'
  push:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
          cache-dependency-path: backend/pnpm-lock.yaml
      
      - name: Install dependencies
        working-directory: backend
        run: pnpm install
      
      - name: Run linter
        working-directory: backend
        run: pnpm lint
      
      - name: Run type check
        working-directory: backend
        run: pnpm type-check
      
      - name: Run tests
        working-directory: backend
        run: pnpm test:ci
        env:
          DATABASE_URL: postgresql://test:test@localhost:5432/gana_test
      
      - name: Build
        working-directory: backend
        run: pnpm build
```

#### Frontend CI (`.github/workflows/frontend-ci.yml`)

```yaml
name: Frontend CI

on:
  pull_request:
    paths:
      - 'frontend/**'
  push:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
          cache-dependency-path: frontend/pnpm-lock.yaml
      
      - name: Install dependencies
        working-directory: frontend
        run: pnpm install
      
      - name: Run linter
        working-directory: frontend
        run: pnpm lint
      
      - name: Run type check
        working-directory: frontend
        run: pnpm type-check
      
      - name: Run tests
        working-directory: frontend
        run: pnpm test:ci
      
      - name: Build
        working-directory: frontend
        run: pnpm build
        env:
          NEXT_PUBLIC_API_URL: http://localhost:4000
```

---

## Database Migrations

### Development

```bash
# Create migration
pnpm prisma migrate dev --name add_feature_x

# Migrations are in prisma/migrations/
# Commit these to git
```

### Staging/Production

**Automatic** (via Railway start command):
```bash
pnpm prisma migrate deploy
```

This runs pending migrations on startup.

**Manual** (if needed):
```bash
# Connect to staging database
DATABASE_URL=<staging-url> pnpm prisma migrate deploy

# Connect to production database
DATABASE_URL=<prod-url> pnpm prisma migrate deploy
```

**Migration Best Practices**:
1. ✅ Test migrations locally first
2. ✅ Test on staging before production
3. ✅ Backup database before big migrations
4. ✅ Migrations should be backwards-compatible when possible
5. ✅ Never edit old migrations (create new ones)

---

## Deployment Checklist

### Before First Production Deploy

- [ ] Set up Neon database (production branch)
- [ ] Set up Railway project
- [ ] Set up Vercel project
- [ ] Configure all environment variables
- [ ] Run database migrations
- [ ] Test API health endpoint
- [ ] Test frontend loading
- [ ] Configure custom domain (if ready)
- [ ] Set up error monitoring (Sentry - optional)
- [ ] Set up uptime monitoring (optional)
- [ ] Create first admin user

### Before Each Deploy

- [ ] All tests passing
- [ ] Linting passing
- [ ] Type check passing
- [ ] Manual testing on local
- [ ] Database migrations reviewed
- [ ] Breaking changes documented
- [ ] Changelog updated

### After Deploy

- [ ] Verify deployment successful
- [ ] Check health endpoint
- [ ] Smoke test critical flows:
  - User can sign up
  - User can create person
  - User can create relationship
  - Search works
  - Merge works
- [ ] Check error logs (Railway, Vercel)
- [ ] Monitor performance metrics

---

## Monitoring & Observability

### Health Checks

**Backend** (`/health` endpoint):
```typescript
app.get('/health', async (req, res) => {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;
    
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version,
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      error: error.message,
    });
  }
});
```

**Frontend** (`/api/health` endpoint):
```typescript
export async function GET() {
  return Response.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
}
```

### Error Tracking (Future)

**Sentry** integration:

```bash
# Install
pnpm add @sentry/node @sentry/nextjs

# Configure backend
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
});

# Configure frontend (next.config.js)
const { withSentryConfig } = require('@sentry/nextjs');

module.exports = withSentryConfig(nextConfig, {
  silent: true,
  org: 'gana',
  project: 'gana-web',
});
```

### Logging

**Backend** (Winston):
```typescript
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

// Usage
logger.info('User created', { userId, email });
logger.error('Merge failed', { error, personAId, personBId });
```

---

## Scaling Considerations

### When to Scale

**Database**:
- > 10,000 persons: Consider read replicas
- > 100,000 persons: Consider partitioning by family tree
- Slow queries: Add indexes, optimize queries

**Backend**:
- > 1,000 concurrent users: Add more Railway instances
- CPU > 80%: Scale horizontally
- Memory issues: Investigate memory leaks

**Frontend**:
- Vercel auto-scales
- If hitting limits: Upgrade plan or use CDN

### Scaling Strategies

**Horizontal Scaling** (more instances):
```bash
# Railway
Settings → Replicas → Set to 2+

# Automatic load balancing
```

**Vertical Scaling** (bigger instances):
```bash
# Railway
Settings → Resources → Increase RAM/CPU
```

**Database Optimization**:
```sql
-- Add indexes for common queries
CREATE INDEX idx_person_name ON persons(family_name, given_name);
CREATE INDEX idx_person_birth ON persons(birth_date);
CREATE INDEX idx_relationship_from ON relationships(person_from_id);

-- Analyze slow queries
EXPLAIN ANALYZE SELECT ...;
```

---

## Backup & Disaster Recovery

### Database Backups

**Neon** (automatic):
- Point-in-time restore (7 days retention)
- Instant database branching

**Manual backup**:
```bash
# Export database
pg_dump <DATABASE_URL> > backup.sql

# Restore
psql <DATABASE_URL> < backup.sql
```

**Backup strategy**:
- Automatic daily backups (Neon handles this)
- Manual backup before major migrations
- Test restore process quarterly

### Disaster Recovery Plan

**Scenario 1: Database corruption**
1. Identify issue
2. Restore from Neon point-in-time backup
3. Verify data integrity
4. Resume operations

**Scenario 2: Bad deployment**
1. Rollback deployment in Railway/Vercel
2. Investigate issue
3. Fix and redeploy

**Scenario 3: Data loss**
1. Identify scope of loss
2. Restore from backup
3. Communicate with affected users
4. Implement additional safeguards

---

## Security Checklist

- [ ] HTTPS enforced (automatic on Vercel/Railway)
- [ ] Environment variables secured (not in git)
- [ ] Database credentials rotated regularly
- [ ] JWT secrets strong and unique per environment
- [ ] CORS configured correctly
- [ ] Rate limiting enabled (future)
- [ ] SQL injection prevention (Prisma parameterization)
- [ ] XSS prevention (React auto-escaping)
- [ ] Password hashing (bcrypt)
- [ ] Dependency updates automated (Dependabot)

---

## Cost Estimates

### Development (Free Tier)

- Neon: Free
- Railway: Free (500 hours/month)
- Vercel: Free
- **Total**: $0/month

### Production (Paid Tier)

- Neon: ~$20/month (Starter plan)
- Railway: ~$20/month (usage-based)
- Vercel: Free or $20/month (Pro)
- Domain: ~$15/year
- **Total**: ~$40-60/month

### Scale (1,000+ users)

- Neon: ~$50/month
- Railway: ~$100/month (multiple instances)
- Vercel: $20/month
- Monitoring: ~$20/month (Sentry, etc.)
- **Total**: ~$190/month

---

Last updated: 2026-04-11
