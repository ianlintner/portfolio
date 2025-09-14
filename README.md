# Portfolio & Blog — Next.js + GKE

A modern full‑stack portfolio and technical blog powered by:

- Next.js App Router (React 18, TypeScript)
- tRPC for type‑safe server APIs
- Drizzle ORM + PostgreSQL (Cloud SQL in production)
- NextAuth.js for authentication
- Tailwind CSS for styling
- GKE (Google Kubernetes Engine) with Istio, Cloud SQL Auth Proxy, and GitOps via Flux CD

## Quick Start

- Install deps: `pnpm install`
- Generate DB migrations (Drizzle): `pnpm db:generate`
- Apply migrations: `pnpm db:migrate`
- Run locally: `pnpm dev` (http://localhost:3000)

Environment variables are defined in `.env.example`. For local development set values in `.env.local` (at minimum `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`).

## Scripts

- Lint: `pnpm lint` (run before commits)
- Tests: `pnpm test`
- DB: `pnpm db:generate`, `pnpm db:migrate`

## Architecture

- App: `src/app` (App Router), shared server logic under `src/server`; DB schema in `src/server/db/schema.ts` (Drizzle ORM).
- API: tRPC routers in `src/server/api/routers`, composed in `src/server/api/root.ts`.
- Auth: NextAuth route at `src/app/api/auth/[...nextauth]/route.ts` with Credentials provider.
- DB: Drizzle ORM client in `src/server/db.ts`.
- Styling: Tailwind with a custom config in `tailwind.config.ts`.

## Kubernetes (GKE) Overview

- Manifests: `k8s/apps/portfolio` with `base/` and environment overlays.
- Ingress: Istio IngressGateway + `VirtualService` with a static IP and Google ManagedCertificate.
- Database: Cloud SQL for PostgreSQL via sidecar Cloud SQL Auth Proxy and Workload Identity.
- GitOps: Flux CD updates image tags and reconciles manifests. See Flux docs below.

## CI/CD

- Docker build/push via GitHub Actions (`.github/workflows/docker.yml`) to Google Artifact Registry.
- CI & optional rollout utilities in `.github/workflows/ci.yml`.
- Flux CD performs image automation and cluster reconciliation (`k8s/flux-system`).

## Further Docs

- `docs/ARCHITECTURE.md` — End‑to‑end app + platform architecture
- `DOCKER_CI_SETUP.md` — Docker CI setup and secrets
- `FLUX_CD_MIGRATION.md` — GitOps image automation with Flux
- `AUTOMATIC_DEPLOYMENT_SETUP.md` — Branch‑to‑environment rollouts
- `PODS_IMAGE_POLICY.md` — Image policy and pod security notes
