# Portfolio & Blog — AI Guide

## Core architecture

- **Astro (Static Site Generation)** under `src/pages` drives all page routes (home, blog, game, demos, resume, chat, terms, privacy). Pages compile to zero-JS HTML by default.
- **HTMX** is used for client-side navigation via `hx-boost="true"` on the body. This intercepts standard anchor tags to fetch pages via AJAX and swap the `#main-content` container dynamically, preventing full page reloads.
- **Phaser 3 Game** runs inside `src/pages/game.astro`, bootstrapped client-side on mount or HTMX load events, and torn down on transitions.
- **Sitewide Chat Widget** is dynamically initialized on the page via standard script tags and HTMX hooks.

## Data & content collections

- Blog content is managed using Astro's Content Collections in `src/content/blog/` as standard Markdown (`.md`) files.
- The collection schema is configured in `src/content/config.ts`.
- There is **no database, no ORM (Drizzle), no NextAuth, and no backend API layer (tRPC)**. The application is completely static.

## Development workflow

- Use **pnpm** for package scripts and dependencies.
- Local loop: `pnpm dev` starts the Astro dev server at `http://localhost:4321`.
- Production previews: `pnpm preview` previews the compiled output directory (`dist/`).
- Document builds: `pnpm docs:build` compiles the MkDocs site into `public/docs` before/during standard build steps.

### ⚠️ Pre-push quality gate (MANDATORY)

Every commit must pass the same checks CI runs. Before committing or pushing code, run:

```bash
pnpm lint && pnpm format && pnpm run test:ci && pnpm build
```

If any checks fail, resolve them before making git commits.

## Deployment & ops

- **Static Server (`server.js`)**: A native, dependency-free Node.js HTTP server. It serves compiled files from `dist/` with correct content-types, handles extensionless clean URLs, and answers `/api/health` probes for GKE/AKS clusters.
- **Docker**: The multi-stage `Dockerfile` compiles the static site and launches `node server.js` to run the container.
- **CI/CD**: Pushes to `main` compile the project and deploy it to **Azure Static Web Apps** automatically via OIDC token resolution.
- **Kubernetes manifests** in `k8s/apps/portfolio/base` define deployment, services, and Istio routing.
