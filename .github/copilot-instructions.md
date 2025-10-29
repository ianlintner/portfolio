# Portfolio & Blog — Copilot Instructions

This is a modern full-stack portfolio and technical blog powered by Next.js 15 (App Router), tRPC, Drizzle ORM, PostgreSQL, NextAuth.js, and Tailwind CSS. The application is deployed on GKE (Google Kubernetes Engine) with GitOps via Flux CD.

## Project Overview

- **Framework**: Next.js 15 with App Router (React 19, TypeScript)
- **API Layer**: tRPC for type-safe server APIs
- **Database**: Drizzle ORM + PostgreSQL (Cloud SQL in production)
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS with custom config
- **Package Manager**: **pnpm** (NOT npm or yarn)
- **Deployment**: GKE with Istio, Cloud SQL Auth Proxy, and Flux CD

## Getting Started

### Prerequisites

- Node.js (latest LTS)
- pnpm package manager
- PostgreSQL database
- Environment variables (see `.env.example`)

### Installation & Setup

```bash
pnpm install              # Install dependencies
pnpm db:generate          # Generate DB migrations (Drizzle)
pnpm db:migrate           # Apply migrations
pnpm dev                  # Run locally at http://localhost:3000
```

### Environment Variables

Create `.env.local` for local development with at minimum:

- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_SECRET` - Secret for NextAuth.js
- `NEXTAUTH_URL` - Application URL (e.g., http://localhost:3000)

See `.env.example` for complete list.

## Development Workflow

### Before Commits

1. **Lint**: Always run `pnpm lint` before commits (stricter than defaults)
2. **Format**: Run `pnpm format` to check formatting or `pnpm format:fix` to auto-fix
3. **Tests**: Run `pnpm test` to ensure tests pass

### Scripts

- `pnpm dev` - Development server
- `pnpm build` - Production build
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm format` - Check code formatting
- `pnpm format:fix` - Fix code formatting
- `pnpm test` - Run tests
- `pnpm test:ci` - Run tests in CI mode
- `pnpm db:generate` - Generate database migrations
- `pnpm db:migrate` - Apply database migrations

## Architecture & Code Organization

### Directory Structure

```
src/
├── app/              # Next.js App Router pages and layouts
├── components/       # Reusable React components
├── lib/              # Utility libraries and helpers
├── server/           # Server-side logic
│   ├── api/          # tRPC API routers
│   │   ├── routers/  # Domain-specific routers
│   │   └── root.ts   # Main router composition
│   ├── db/           # Database client and schema
│   │   ├── db.ts     # Drizzle ORM client
│   │   └── schema.ts # Database schema definitions
│   └── auth.ts       # NextAuth configuration
├── styles/           # Global styles
├── types/            # Shared TypeScript types
└── utils/            # Utility functions

docs/                 # Documentation files
k8s/                  # Kubernetes manifests
public/               # Static assets
```

### Key Architectural Decisions

#### 1. Next.js App Router

- **Use App Router** (`src/app`), NOT legacy `pages/` folder
- Client components must be explicitly marked with `"use client"`
- Server components are the default
- Avoid direct access to `window` APIs without guards (code may run server-side)
- Default deployment is serverless-friendly; avoid Node-only APIs (fs, net)

#### 2. API Layer (tRPC)

- **All API logic goes through tRPC** - never create ad-hoc REST endpoints
- Routers live in `src/server/api/routers/`
- New routers must be registered in `src/server/api/root.ts`
- Use domain-driven organization (e.g., `blog.ts`, `auth.ts`, `portfolio.ts`)

#### 3. Database (Drizzle ORM)

- **All DB queries go through Drizzle ORM** via `@/server/db`
- Schema defined in `src/server/db/schema.ts`
- Migrations are auto-generated - **do not hand-edit migration SQL**
- After schema changes, run:
  1. `pnpm db:generate` - Generate migration files
  2. `pnpm db:migrate` - Apply migrations

#### 4. Authentication (NextAuth.js)

- Auth handled by NextAuth in `/app/api/auth/[...nextauth]/route.ts`
- Uses Credentials provider
- Configuration in `src/server/auth.ts`

#### 5. Styling (Tailwind CSS)

- Custom config in `tailwind.config.ts`
- Match design tokens when styling
- Uses `@tailwindcss/typography` for blog content
- PostCSS config optimized - review `postcss.config.js` before adding plugins

#### 6. TypeScript

- `tsconfig.json` has path aliases (e.g., `@/server/*`, `@/components/*`)
- **Always use path aliases** instead of relative imports
- Shared types should be colocated in `src/types` and reused across frontend + backend

#### 7. File Uploads

- Large file uploads must use Google Cloud Storage (GCS)
- Backend must stream files - never buffer in memory

## Coding Standards & Best Practices

### General Rules

1. **Use pnpm** for all installs, builds, and scripts - NOT npm or yarn
2. **Run linters** before commits; some lint rules are stricter than defaults
3. **Type safety**: Leverage TypeScript fully; avoid `any` types
4. **Server/Client separation**: Be explicit about component boundaries
5. **Path aliases**: Use `@/` imports instead of relative paths
6. **Comments**: Add JSDoc comments for public APIs and complex logic

### Testing

- Tests use Jest with React Testing Library
- Test files should be colocated with components or in `__tests__` directories
- Write tests for critical business logic and components
- Run `pnpm test` before pushing changes

### Error Handling

- Use proper error boundaries in React components
- tRPC procedures should throw `TRPCError` with appropriate codes
- Log errors appropriately for debugging

### Security

- Never commit secrets or credentials
- Use environment variables for sensitive configuration
- Validate all user inputs
- Follow NextAuth.js best practices for authentication

## Kubernetes & Deployment

### Infrastructure

- **Platform**: GKE (Google Kubernetes Engine)
- **Ingress**: Istio IngressGateway + VirtualService
- **Database**: Cloud SQL for PostgreSQL via sidecar Cloud SQL Auth Proxy
- **GitOps**: Flux CD for automated deployments

### Manifests Location

- `k8s/apps/portfolio` - Application manifests
- `k8s/flux-system` - Flux CD configuration

### CI/CD

- Docker build/push via GitHub Actions (`.github/workflows/docker.yml`)
- Automated image updates via Flux CD
- Environment-specific overlays for dev/staging/production

## Documentation

### Available Docs

- `docs/ARCHITECTURE.md` - Detailed architecture documentation
- `docs/DOCKER_CI_SETUP.md` - Docker CI setup and secrets
- `docs/FLUX_CD_MIGRATION.md` - GitOps and image automation
- `docs/AUTOMATIC_DEPLOYMENT_SETUP.md` - Branch-to-environment rollouts
- `docs/PODS_IMAGE_POLICY.md` - Image policy and pod security
- `docs/CLI_SETUP_INSTRUCTIONS.md` - CLI setup guide
- `docs/AGENTS.md` - Critical development rules (keep under 25 lines)

### When Making Changes

- Update relevant documentation if changing architecture or workflows
- Keep `docs/AGENTS.md` under 25 lines - only critical rules
- Document new environment variables in `.env.example`
- Update this file if adding new patterns or changing standards

## Common Tasks

### Adding a New API Endpoint

1. Create a new router in `src/server/api/routers/` or add to existing
2. Define procedures with proper input validation (Zod schemas)
3. Register router in `src/server/api/root.ts`
4. Use in components via tRPC hooks

### Adding a New Page

1. Create route in `src/app/` following App Router conventions
2. Use Server Components by default
3. Add `"use client"` only when needed (interactivity, hooks)
4. Use tRPC for data fetching

### Database Schema Changes

1. Edit `src/server/db/schema.ts`
2. Run `pnpm db:generate` to create migration
3. Run `pnpm db:migrate` to apply migration
4. Never hand-edit generated SQL

### Adding a New Component

1. Create in `src/components/` with clear naming
2. Add TypeScript types for props
3. Mark with `"use client"` if needed
4. Write tests if component has significant logic

## Troubleshooting

### Build Errors

- Ensure all dependencies are installed: `pnpm install`
- Check TypeScript errors: `pnpm tsc --noEmit`
- Clear Next.js cache: `rm -rf .next`

### Database Issues

- Verify `DATABASE_URL` in environment variables
- Check PostgreSQL is running and accessible
- Re-run migrations: `pnpm db:migrate`

### Auth Issues

- Verify `NEXTAUTH_SECRET` and `NEXTAUTH_URL` are set
- Check NextAuth configuration in `src/server/auth.ts`
- Review credentials provider setup

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [tRPC Documentation](https://trpc.io/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team/docs)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

**Remember**: This is a production application with active users. Test thoroughly, follow the established patterns, and maintain code quality standards.
