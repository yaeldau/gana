# Changelog

All notable changes to the Gana project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **Initial project setup**
  - Main project directory structure under `/Users/ydauber/Build/claude/gana`
  - Three separate Git repositories (backend, frontend, infrastructure)
  - Comprehensive project documentation

- **Documentation** (`/docs`):
  - README.md - Project overview
  - architecture.md - Complete system architecture
  - data-model.md - Detailed database schema and design
  - merge-strategy.md - Duplicate detection and merging workflow
  - product-scope.md - MVP scope and feature roadmap
  - setup.md - Development setup instructions
  - deployment.md - Production deployment guide
  - decisions.md - Architecture Decision Records (ADRs)
  - changelog.md - This file

- **Backend** (`/backend` - gana-api repository):
  - Node.js 20 + TypeScript with Fastify framework
  - Prisma ORM with complete PostgreSQL schema
  - Modular architecture (identity, person, relationship, merge, tree modules)
  - JWT authentication setup
  - Winston logging
  - Comprehensive error handling
  - Database seed file with sample family data
  - ESLint + Prettier configuration
  - Jest testing setup
  - Complete package.json with all scripts
  - README with full documentation

- **Frontend** (`/frontend` - gana-web repository):
  - Next.js 14 with App Router and TypeScript
  - Tailwind CSS + shadcn/ui design system
  - React Query for server state
  - Zustand for client state
  - Beautiful landing page with hero and features
  - Font optimization (Inter + Crimson Text)
  - ESLint + Prettier configuration
  - Complete package.json with all scripts
  - README with full documentation

- **Infrastructure** (`/infrastructure` - gana-infrastructure repository):
  - Docker Compose for local development (PostgreSQL + Backend + Frontend)
  - Multi-stage Dockerfiles for backend and frontend
  - GitHub Actions CI/CD workflows (backend-ci.yml, frontend-ci.yml)
  - Automated testing, linting, and building in CI
  - README with Docker and CI/CD documentation

- **Scripts** (`/scripts`):
  - setup-local.sh - Automated local development setup script

- **Database Schema** (Prisma):
  - User model with authentication
  - Person model with merge tracking (soft delete pattern)
  - Relationship model (parent, child, partner, sibling)
  - MergeProposal model for duplicate detection
  - MergeHistory model for complete audit trail
  - AuditLog model for all data changes
  - Comprehensive indexes for performance

- **Authentication Implementation** (Backend):
  - Identity module with registration, login, JWT tokens
  - Password hashing with bcrypt
  - User profile management
  - JWT authentication middleware
  - Auth routes: `/api/auth/register`, `/api/auth/login`, `/api/auth/me`, `/api/auth/profile`

- **Person Management Implementation** (Backend):
  - Person service with full CRUD operations
  - Validation with Zod schemas
  - Automatic audit logging
  - Search and filtering
  - Date validation (death after birth)
  - Soft delete pattern
  - Person routes: `/api/persons` (GET/POST), `/api/persons/:id` (GET/PUT/DELETE)

- **Authentication UI** (Frontend):
  - Registration page with form validation
  - Login page with error handling
  - API client with token management
  - Auth utilities and types
  - Client-side route protection

- **Person Management UI** (Frontend):
  - Dashboard with person list
  - Person creation form
  - Beautiful card-based person display
  - Age calculation utilities
  - Date formatting
  - Living/deceased status badges
  - Responsive grid layout

- **UI Components** (Frontend):
  - Button component (default, secondary, outline, ghost variants)
  - Input component with focus states
  - Form layouts with proper spacing
  - Error message displays
  - Loading states

- **Type Definitions**:
  - User, Person, Relationship types
  - API request/response types
  - Fastify JWT types declaration

### Changed
- Updated `server.ts` to register identity and person routes
- Enhanced documentation with implementation details

### Fixed
- N/A (initial release)

### Removed
- N/A (initial release)

---

## Version History

Version releases will be tracked here once the first version is deployed.

### Version Numbering

- **Major version** (X.0.0): Breaking changes, major features
- **Minor version** (0.X.0): New features, backwards-compatible
- **Patch version** (0.0.X): Bug fixes, small improvements

Example:
- 0.1.0 - MVP release (first deployable version)
- 0.2.0 - Photo upload feature added
- 0.2.1 - Bug fix in merge workflow

---

Last updated: 2026-04-11
