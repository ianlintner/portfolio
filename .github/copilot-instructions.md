# Portfolio & Blog — AI Guide

## Core architecture

- Next.js 15 App Router under `src/app` drives all routes (home, blog, admin). Prefer Server Components; add `"use client"` only for stateful UI (see `src/app/admin/(dashboard)` forms).
- tRPC is the only application API: routers live in `src/server/api/routers`, composed in `src/server/api/root.ts`, and exposed to the client via `src/app/providers.tsx` (react-query + `httpBatchLink` + `superjson`).
- NextAuth Credentials provider (`src/app/api/auth/[...nextauth]/route.ts` + `src/server/auth.ts`) seeds the tRPC context; `protectedProcedure` checks `ctx.session` for admin mutations.
- Blog content is MDX colocated in `src/app/blog/*`; `src/lib/posts.ts` parses front‑matter and sorts posts for static views.

## Data & persistence

- Drizzle ORM schema lives in `src/server/db/schema.ts`; run `pnpm db:generate && pnpm db:migrate` after edits—generated SQL should never be touched manually.
- `src/server/db.ts` prefers node-postgres with SSL (via `assembleAzureDatabaseUrl` in `src/lib/azure-db-url.ts`) and only falls back to `@vercel/postgres` when `DATABASE_URL` is missing.
- Core tables: `users`, `posts`, `tags`, and `postTag`; published content is filtered by boolean flags plus dates (see `postRouter.getPublished`).
- Large assets belong in Google Cloud Storage buckets; server code must stream uploads rather than buffering them.

## Development workflow

- Use **pnpm** for every script; the usual local loop is `pnpm dev`, and CI parity requires `pnpm lint`, `pnpm test`, then `pnpm build` before opening a PR.
- `.env.example` documents all required secrets; local dev typically needs `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, and any Azure Postgres fragments consumed by `assembleAzureDatabaseUrl`.
- Jest + React Testing Library power unit/UI tests (`jest.config.js`, `jest.setup.js`); co-locate specs next to components or under `__tests__`.
- Docs in `docs/` are also statically exported to `public/docs` for the documentation microsite—update both when changing guides.

## Patterns & conventions

- Always import via the path aliases in `tsconfig.json` (`@/server/db`, `@/components/Footer`, etc.) instead of long relative paths.
- Shared utilities belong in `src/lib` or `src/utils`; `src/utils/trpc.ts` already wires the strongly typed hooks, so reuse it instead of creating ad-hoc fetchers.
- When adding UI, follow established Tailwind design tokens in `tailwind.config.ts` and the typography defaults in `src/styles/highlight.css`/`MarkdownRenderer`.
- Admin-only flows must go through `protectedProcedure` plus role-aware UI guards; never trust client state for authorization.

## Deployment & ops

- Kubernetes manifests live in `k8s/apps/portfolio` (base + environment overlays) and assume Istio Gateway + VirtualService; reconcile via Flux definitions in `k8s/flux-system`.
- Container images are built by `.github/workflows/docker.yml` and promoted through Flux image automation—keep image tags mutable only via GitOps, not manual kubectl.
- Secrets for PostgreSQL commonly come from Azure Flexible Server or Cloud SQL; `scripts/fetch-azure-kv-secrets.sh` and `infra/postgres-flexible-server.bicep` show how credentials are provisioned.
- When touching deployment settings, update the relevant doc in `docs/` (e.g., `ARCHITECTURE.md`, `AZURE_CI_CD_SETUP.md`) so the rendered site under `public/docs` stays accurate.

## Blog authoring (MDX)

- Location: add posts under `src/app/blog/*.mdx`. The filename (without `.mdx`) is the `slug` used in routes.
- Front‑matter required and parsed by `src/lib/posts.ts`:
  - `title: string`
  - `date: YYYY-MM-DD` (sorted descending)
  - `excerpt: string`
  - `tags: string[]` (optional)
  - `author: string` (optional, defaults to "Ian Lintner")
  - `image: string` and `imageAlt: string` (optional; store images in `public/images/` and reference via `/images/...`)
- Content guidelines to match engineering posts:
  - Prefer clear problem–solution narratives with small, runnable code snippets.
  - Use fenced code blocks with explicit language; align with project stack (TypeScript/TSX, shell).
  - Diagrams: use the `Mermaid` component (`@/components/Mermaid`) for sequence/flow when helpful.
  - Styling: rely on site defaults (`src/styles/highlight.css`, `MarkdownRenderer`)—avoid inline styles.
  - Keep intros tight; lead with context, constraints, and trade‑offs. Link to repo files (e.g., `@/server/api/routers/post.ts`).
- Verify locally:
  - Run `pnpm dev`, open the blog route, check rendering, links, and images.
  - Ensure front‑matter dates are valid; sorting depends on `new Date(date)`.
  - Keep slugs unique (filename) and avoid spaces/uppercase; use `kebab-case`.
