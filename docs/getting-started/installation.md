# Installation Guide

This guide will walk you through setting up the Portfolio application for local development.

## Quick Start

For experienced developers, here's the TL;DR:

```bash
git clone https://github.com/ianlintner/portfolio.git
cd portfolio
cp .env.example .env
# Edit .env with your configuration
pnpm install
pnpm db:push
pnpm db:seed
pnpm dev
```

## Detailed Installation

### 1. Clone the Repository

```bash
# Clone the repository
git clone https://github.com/ianlintner/portfolio.git

# Navigate to the project directory
cd portfolio

# Check the current branch
git branch
```

### 2. Environment Configuration

Copy the example environment file and configure it:

```bash
cp .env.example .env
```

Open `.env` in your preferred editor and configure the required variables:

```bash
# Database Configuration
DATABASE_URL="postgresql://portfolio:portfolio@localhost:5432/portfolio"

# NextAuth.js Configuration
NEXTAUTH_SECRET="your-super-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Google Cloud Storage (Optional for local development)
GOOGLE_CLOUD_PROJECT_ID="your-project-id"
GOOGLE_CLOUD_BUCKET_NAME="your-bucket-name"
GOOGLE_APPLICATION_CREDENTIALS="path/to/service-account.json"

# OAuth Providers (Optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
```

!!! warning "Security Note"
    Never commit your `.env` file to version control. It contains sensitive information like API keys and secrets.

### 3. Database Setup

#### Option A: Docker (Recommended)

Start PostgreSQL using Docker:

```bash
# Start PostgreSQL container
docker run --name portfolio-postgres \
  -e POSTGRES_PASSWORD=portfolio \
  -e POSTGRES_DB=portfolio \
  -e POSTGRES_USER=portfolio \
  -p 5432:5432 \
  -d postgres:15

# Verify container is running
docker ps | grep portfolio-postgres
```

#### Option B: Docker Compose (Alternative)

If you prefer Docker Compose:

```bash
# Use the included docker-compose.yml
docker-compose up -d postgres

# Check status
docker-compose ps
```

#### Option C: Local PostgreSQL

If you have PostgreSQL installed locally:

```bash
# Create database and user
sudo -u postgres psql
```

```sql
CREATE USER portfolio WITH PASSWORD 'portfolio';
CREATE DATABASE portfolio OWNER portfolio;
GRANT ALL PRIVILEGES ON DATABASE portfolio TO portfolio;
\q
```

### 4. Install Dependencies

Install all project dependencies using pnpm:

```bash
pnpm install
```

!!! info "Build Scripts"
    If you see warnings about ignored build scripts, run `pnpm approve-builds` to allow required scripts to run.

If Prisma installation fails due to network issues, you can install it separately:

```bash
# Alternative Prisma installation
pnpm add prisma @prisma/client
pnpm prisma generate
```

### 5. Database Migration and Seeding

Set up the database schema and seed initial data:

```bash
# Push database schema to PostgreSQL
pnpm db:push

# Generate Prisma client
pnpm db:generate

# Seed the database with initial data
pnpm db:seed
```

The seeding process will create:
- An admin user account
- Sample blog posts
- Demo components
- Test data for development

!!! warning "Admin User"
    The seeding process creates an admin user. Do not delete this user as it will break local authentication flows.

### 6. Verify Installation

Start the development server:

```bash
pnpm dev
```

The application should be available at:
- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **API**: [http://localhost:3000/api](http://localhost:3000/api)

### 7. Run Tests (Optional)

Verify everything is working by running the test suite:

```bash
# Run unit tests
pnpm test

# Run end-to-end tests (requires app to be running)
pnpm test:e2e
```

## Verification Checklist

Ensure your installation is successful by checking:

- [ ] ✅ Application loads at http://localhost:3000
- [ ] ✅ Database connection is working
- [ ] ✅ API endpoints respond correctly
- [ ] ✅ Authentication system works
- [ ] ✅ Tests pass successfully
- [ ] ✅ No console errors in browser dev tools

## Common Installation Issues

### Dependency Installation Failures

```bash
# Clear pnpm cache
pnpm store prune

# Delete node_modules and reinstall
rm -rf node_modules
pnpm install
```

### Database Connection Issues

```bash
# Check if PostgreSQL is running
docker ps | grep postgres  # For Docker
sudo systemctl status postgresql  # For local installation

# Test database connection
psql postgresql://portfolio:portfolio@localhost:5432/portfolio -c "SELECT version();"
```

### Prisma Issues

```bash
# Reset Prisma
pnpm prisma migrate reset

# Regenerate Prisma client
pnpm db:generate

# Push schema again
pnpm db:push
```

### Port Conflicts

If port 3000 is already in use:

```bash
# Start on different port
pnpm dev --port 3001

# Or kill process using port 3000
lsof -ti:3000 | xargs kill -9
```

### Permission Issues

```bash
# Fix npm/pnpm permissions (Linux/macOS)
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) ~/.pnpm-store
```

## Development Tools Setup

### VS Code Extensions

Install recommended extensions for optimal development experience:

```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "prisma.prisma",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense"
  ]
}
```

### Git Hooks Setup

The project includes pre-commit hooks with Husky:

```bash
# Install git hooks
pnpm prepare

# Test pre-commit hook
git add .
git commit -m "test commit"
```

### Browser Dev Tools

Install useful browser extensions:
- **React Developer Tools**: Debug React components
- **Apollo DevTools**: Debug GraphQL/tRPC queries
- **Redux DevTools**: Debug state management

## Alternative Installation Methods

### GitHub Codespaces

You can develop in the cloud using GitHub Codespaces:

1. Go to the [repository](https://github.com/ianlintner/portfolio)
2. Click "Code" → "Codespaces" → "Create codespace"
3. Wait for the environment to set up
4. Follow steps 2-6 from the detailed installation

### Gitpod

Alternative cloud development environment:

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/ianlintner/portfolio)

## Next Steps

After successful installation:

1. **Explore the Application**: Browse the frontend and admin interface
2. **Review the Code**: Start with [Project Structure](../development/project-structure.md)
3. **Make Changes**: Try modifying components and see live updates
4. **Run Tests**: Ensure your changes don't break existing functionality
5. **Read Documentation**: Continue with [Configuration](configuration.md)

## Getting Help

If you encounter issues during installation:

1. **Check Prerequisites**: Ensure all [prerequisites](prerequisites.md) are installed
2. **Review Common Issues**: Check the troubleshooting section above
3. **Search Issues**: Look for similar issues on [GitHub](https://github.com/ianlintner/portfolio/issues)
4. **Create Issue**: Report new issues with detailed error messages and system information

!!! tip "Development Tips"
    - Keep the development server running for hot reloading
    - Use the database studio (`pnpm db:studio`) for database inspection
    - Enable TypeScript strict mode in your editor for better development experience