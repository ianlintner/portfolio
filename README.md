# Portfolio & Blog

<img width="991" height="651" alt="Screenshot 2025-12-10 at 14 14 25" src="https://github.com/user-attachments/assets/dfd34e4c-10c8-4d5e-8461-a1612bd5c4b5" />

A modern full‑stack portfolio and technical blog powered by:

- Next.js
- Tailwind CSS for styling
- Azure Static Site

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

- Static Next JS Published Website Hosted at Azure

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
