#!/bin/bash

# Gana Local Setup Script
# Sets up the complete local development environment

set -e  # Exit on error

echo "🚀 Setting up Gana local development environment..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check prerequisites
echo "${BLUE}Checking prerequisites...${NC}"

if ! command -v node &> /dev/null; then
    echo "${YELLOW}⚠️  Node.js not found. Please install Node.js 20+ from https://nodejs.org${NC}"
    exit 1
fi

if ! command -v pnpm &> /dev/null; then
    echo "${YELLOW}⚠️  pnpm not found. Installing pnpm globally...${NC}"
    npm install -g pnpm
fi

if ! command -v docker &> /dev/null; then
    echo "${YELLOW}⚠️  Docker not found. Please install Docker Desktop from https://www.docker.com${NC}"
    exit 1
fi

echo "${GREEN}✅ All prerequisites met${NC}"
echo ""

# Setup backend
echo "${BLUE}Setting up backend...${NC}"
cd backend

if [ ! -f ".env" ]; then
    echo "Creating .env from .env.example..."
    cp .env.example .env

    # Generate a random JWT secret
    JWT_SECRET=$(openssl rand -base64 32)
    sed -i.bak "s/your-secret-key-here-generate-with-openssl-rand-base64-32/$JWT_SECRET/" .env
    rm .env.bak
    echo "${GREEN}✅ Created .env with generated JWT secret${NC}"
else
    echo "${YELLOW}⚠️  .env already exists, skipping${NC}"
fi

echo "Installing backend dependencies..."
pnpm install

echo "${GREEN}✅ Backend setup complete${NC}"
echo ""

# Setup frontend
echo "${BLUE}Setting up frontend...${NC}"
cd ../frontend

if [ ! -f ".env.local" ]; then
    echo "Creating .env.local from .env.example..."
    cp .env.example .env.local
    echo "${GREEN}✅ Created .env.local${NC}"
else
    echo "${YELLOW}⚠️  .env.local already exists, skipping${NC}"
fi

echo "Installing frontend dependencies..."
pnpm install

echo "${GREEN}✅ Frontend setup complete${NC}"
echo ""

# Return to root
cd ..

# Ask user if they want to start with Docker Compose
echo ""
echo "${BLUE}Setup complete! 🎉${NC}"
echo ""
echo "You have two options to start development:"
echo ""
echo "  ${GREEN}Option 1: Docker Compose (recommended)${NC}"
echo "    cd infrastructure/docker"
echo "    docker-compose up"
echo ""
echo "  ${GREEN}Option 2: Manual (separate terminals)${NC}"
echo "    Terminal 1: cd backend && pnpm dev"
echo "    Terminal 2: cd frontend && pnpm dev"
echo "    (You'll need PostgreSQL running separately)"
echo ""
read -p "Start with Docker Compose now? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "${BLUE}Starting services with Docker Compose...${NC}"
    cd infrastructure/docker
    docker-compose up
else
    echo "${BLUE}Skipping Docker Compose. Start manually when ready.${NC}"
fi
