# Architecture Overview

This document explains the application architecture, how data flows end‑to‑end, and how the system is deployed to Google Kubernetes Engine (GKE) using GitOps.

## Application Stack

- Next.js (App Router)
  - Server Components with selective Client Components ("use client")
  - API routes only where required (e.g., auth, health); all business logic goes through tRPC
- TypeScript
- tRPC
  - Routers in `src/server/api/routers`
  - Aggregated in `src/server/api/root.ts`
  - Client created in `src/app/providers.tsx` via `httpBatchLink` and `superjson`
- Prisma + PostgreSQL
  - Schema: `prisma/schema.prisma`
  - Client: `src/server/db.ts`
  - Seed: `prisma/seed.ts` (creates an admin user and initial posts)
- NextAuth.js (Credentials)
  - Route: `src/app/api/auth/[...nextauth]/route.ts`
  - Options: `src/server/auth.ts` with JWT strategy and role on session
- Tailwind CSS
  - Config: `tailwind.config.ts`

## Data Model (Prisma)

- `User` — id, email, name, role, `passwordHash`
- `Post` — title, slug, content, excerpt, published, `publishedAt`, `seo*` fields
- `Tag` and `PostTag` — tagging relationship
- `ComponentDemo` — example code/demos

## Request Flow

1. UI (Next.js) calls tRPC hooks (client) created in `src/app/providers.tsx`.
2. Requests hit the Next.js serverless functions (or Node runtime) and invoke tRPC routers.
3. Routers call Prisma via `src/server/db.ts`.
4. Responses go back through superjson to the client.

## Security & Auth

- NextAuth Credentials provider validates against `User.passwordHash` (bcrypt).
- Session JWT enriched with `role` for admin‑only routes/mutations.
- Admin UI under `src/app/admin/*` uses protected procedures in tRPC.

## Kubernetes (GKE)

Manifests live under `k8s/apps/portfolio`:

- Deployment: `base/deployment.yaml`
  - App container runs on port 3000 (health endpoint `/api/health`)
  - Sidecar: Cloud SQL Auth Proxy (port 5432)
  - ServiceAccount: Workload Identity enabled (`portfolio-workload-identity`)
  - Env from ConfigMap/Secrets (`portfolio-config`, `portfolio-secrets`, `portfolio-db-secret`)
- Service: `base/service.yaml` (ClusterIP)
- Istio Gateway + VirtualService: `base/istio-gateway.yaml`, `base/istio-virtualservice.yaml`
  - Static IP: `base/istio-static-ip.yaml`
  - TLS: `base/istio-certificate.yaml` (Google ManagedCertificate)
- NetworkPolicy: `base/networkpolicy.yaml`
- Cloud SQL resources: `base/cloudsql-instance.yaml`, `base/cloudsql-serviceaccount.yaml`
- Admin utility job: `base/admin-password-reset-job.yaml`

Environment overlays in `k8s/apps/portfolio/overlays/*` adjust namespace, DNS, and any env‑specific values.

### Database Connectivity

- The app connects to Cloud SQL Postgres via the sidecar proxy.
- Connection string is supplied via Secret (`portfolio-db-secret`).
- Workload Identity provides GCP IAM to the pod without node‑wide secrets.

### Ingress

- Client traffic terminates at the Istio IngressGateway (GCLB).
- `VirtualService` routes HTTP(S) to the `Service` on port 80 → container 3000.
- TLS is managed by Google ManagedCertificate.

## CI/CD & GitOps

- Build: GitHub Actions build/push image to Artifact Registry (`docker.yml`).
- CI: Lint/tests/quality checks in `ci.yml`.
- GitOps: Flux CD (`k8s/flux-system/*`) watches the registry and updates image tags via `ImageRepository` + `ImagePolicy` + `ImageUpdateAutomation`.
- Kustomizations per environment reconcile manifests into the cluster.

References:

- `DOCKER_CI_SETUP.md` — building and pushing images
- `FLUX_CD_MIGRATION.md` — GitOps image automation
- `AUTOMATIC_DEPLOYMENT_SETUP.md` — branch → environment deployments
- `PODS_IMAGE_POLICY.md` — security and policy notes

## Local Development

- Use `pnpm` only (see AGENTS.md).
- Commands:
  - `pnpm db:generate`, `pnpm db:push`, `pnpm db:seed`
  - `pnpm dev`
  - `pnpm lint` before commits

## Notes

- App Router code can run on the server — guard any `window` usage.
- Avoid Node‑only APIs on the request path (fs, net) to stay serverless‑friendly.
- Large uploads should use GCS and stream; do not buffer in memory.
