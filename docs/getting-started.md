# Getting Started

This guide will help you set up the portfolio and blog application for local development.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v18 or later (LTS recommended)
- **pnpm**: Package manager (we use pnpm, not npm or yarn)
- **PostgreSQL**: v14 or later
- **Git**: For version control

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/ianlintner/portfolio.git
cd portfolio
```

### 2. Install Dependencies

We use **pnpm** as our package manager:

```bash
pnpm install
```

!!! warning "Important: Use pnpm"
Always use `pnpm` for all package operations, NOT `npm` or `yarn`. This ensures consistency with lockfiles and build processes.

### 3. Set Up Environment Variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

Edit `.env.local` and configure the following essential variables:

```env
# Database connection string
DATABASE_URL="postgresql://user:password@localhost:5432/portfolio"

# NextAuth configuration
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Optional: For production features
NODE_ENV="development"
```

!!! tip "Generate a Secret"
Generate a secure `NEXTAUTH_SECRET` using:
`bash
    openssl rand -base64 32
    `

### 4. Database Setup

#### Option A: Local PostgreSQL

If you have PostgreSQL installed locally:

```bash
# Create database
createdb portfolio

# Generate migrations
pnpm db:generate

# Apply migrations
pnpm db:migrate
```

#### Option B: Docker PostgreSQL

Use the provided Docker Compose setup:

```bash
docker-compose up -d postgres

# Then run migrations
pnpm db:generate
pnpm db:migrate
```

### 5. Run Development Server

Start the Next.js development server:

```bash
pnpm dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Development Workflow

### Code Quality Checks

Before committing code, **always** run these checks:

```bash
# Lint your code
pnpm lint

# Format check
pnpm format

# Fix formatting issues
pnpm format:fix

# Run tests
pnpm test
```

!!! danger "CI Checks Required"
All these checks run in CI. Failing checks will block PR merging. Run them locally first!

### Database Changes

When modifying the database schema:

1. Edit `src/server/db/schema.ts`
2. Generate migration: `pnpm db:generate`
3. Review the generated SQL in `drizzle/` folder
4. Apply migration: `pnpm db:migrate`

!!! warning "Never Edit Migration SQL"
Never hand-edit generated SQL files. Always make changes in the schema and regenerate.

### Adding a New API Endpoint

1. Create or update a router in `src/server/api/routers/`
2. Add Zod validation for inputs
3. Register router in `src/server/api/root.ts`
4. Use tRPC hooks in your React components

Example:

```typescript
// src/server/api/routers/example.ts
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const exampleRouter = createTRPCRouter({
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => {
      return { id: input.id, name: "Example" };
    }),
});
```

### Building for Production

Test a production build locally:

```bash
# Build the application
pnpm build

# Start production server
pnpm start
```

## Project Structure

```
portfolio/
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── blog/         # Blog routes
│   │   ├── admin/        # Admin dashboard
│   │   └── api/          # API routes (NextAuth)
│   ├── components/       # React components
│   ├── lib/              # Utility libraries
│   ├── server/           # Server-side code
│   │   ├── api/          # tRPC routers
│   │   └── db/           # Database client & schema
│   └── styles/           # Global styles
├── docs/                 # Documentation (this site)
├── k8s/                  # Kubernetes manifests
├── public/               # Static assets
└── tests/                # Test files
```

## Common Issues

### Port Already in Use

If port 3000 is already in use:

```bash
# Kill the process using port 3000
lsof -ti:3000 | xargs kill -9

# Or run on a different port
PORT=3001 pnpm dev
```

### Database Connection Issues

1. Verify PostgreSQL is running
2. Check `DATABASE_URL` in `.env.local`
3. Ensure database exists and is accessible
4. Check firewall rules if using remote database

### Build Errors

Clear Next.js cache:

```bash
rm -rf .next
pnpm dev
```

### Module Not Found

Reinstall dependencies:

```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

## Next Steps

- Read the [Architecture Overview](ARCHITECTURE.md)
- Learn about [CLI Setup](CLI_SETUP_INSTRUCTIONS.md)
- Explore [Deployment Options](AUTOMATIC_DEPLOYMENT_SETUP.md)
- Review [Coding Guidelines](AGENTS.md)

## Getting Help

- Check this documentation first
- Search [GitHub Issues](https://github.com/ianlintner/portfolio/issues)
- Review existing code for examples
- Ask questions in pull request reviews
