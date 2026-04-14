# Gana - Family Heritage Platform

A modern, polished family history and genealogy application built with production-quality architecture, designed for scalability, maintainability, and beautiful user experience.

## Vision

Gana is a family tree platform that handles the complexity of real genealogy: multiple people with the same name, duplicate detection, intelligent profile merging, and collaborative family building. Built to demonstrate enterprise-grade software engineering practices.

## Architecture

- **Frontend**: Next.js 14+ with TypeScript, Tailwind CSS, and shadcn/ui
- **Backend**: Node.js + TypeScript with Fastify, modular architecture
- **Database**: PostgreSQL with Prisma ORM
- **Deployment**: Vercel (frontend), Railway (backend), Neon (database)

## Repository Structure

This project uses a multi-repository approach with three separate repos:

- **gana-web** (`/frontend`) - Next.js frontend application
- **gana-api** (`/backend`) - Node.js backend API
- **gana-infrastructure** (`/infrastructure`) - DevOps and deployment configuration

## Quick Start

### Prerequisites

- Node.js 20+
- PostgreSQL 16+ (or use Docker Compose)
- pnpm (recommended) or npm

### Local Development

```bash
# Clone and set up
git clone <org>/gana-web frontend
git clone <org>/gana-api backend
git clone <org>/gana-infrastructure infrastructure

# Start with Docker Compose (recommended)
cd infrastructure
docker-compose up

# Or run services individually:

# Backend
cd backend
pnpm install
pnpm dev

# Frontend
cd frontend
pnpm install
pnpm dev
```

Visit `http://localhost:3000` for the frontend and `http://localhost:4000` for the backend API.

## Documentation

- [Architecture Overview](./docs/architecture.md)
- [Data Model](./docs/data-model.md)
- [Merge Strategy](./docs/merge-strategy.md)
- [Product Scope](./docs/product-scope.md)
- [Setup Guide](./docs/setup.md)
- [Deployment Guide](./docs/deployment.md)
- [Decisions Log](./docs/decisions.md)
- [Changelog](./docs/changelog.md)

## Core Features (MVP)

- ✅ User authentication and profiles
- ✅ Person profile management (create profiles for self and others)
- ✅ Family relationships (parent, child, partner, sibling)
- ✅ Duplicate detection
- ✅ Intelligent profile merging with conflict resolution
- ✅ Complete audit trail
- ✅ Search and filtering
- ✅ Basic family tree visualization

## Key Design Principles

### Identity & Uniqueness
- Every person has a stable UUID (never exposed, never reused)
- Names are NOT unique identifiers
- Same real person can have multiple profiles before merge
- Merge operations are atomic, auditable, and designed for reversal

### Code Quality
- TypeScript strict mode throughout
- Comprehensive error handling
- Clear module boundaries
- Production-ready code from day one

### User Experience
- Clean, modern, premium design
- Responsive and accessible
- Intuitive relationship visualization
- Thoughtful merge conflict resolution UI

## GitHub Organization

**Organization**: `gana-family` (or as configured)

All repositories follow consistent standards:
- Shared ESLint and Prettier configuration
- Conventional commit messages
- Comprehensive CI/CD pipelines
- PR templates and code review guidelines

## Contributing

See individual repository READMEs for contribution guidelines.

## License

Private/Proprietary (for now)

---

Built with care by Yael Dauber
