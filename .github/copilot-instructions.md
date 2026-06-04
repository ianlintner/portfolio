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

## Blog posts & social cards

- Posts are Markdown in `src/content/blog/<slug>.md`. Frontmatter schema lives in `src/content/config.ts`: `title`, `date`, `excerpt`, `tags[]`, `author`, `image`, `imageAlt`.
- **Every post has a 1200×630 social card** at `public/images/<slug>-social.png`, referenced by the `image` frontmatter field as `/images/<slug>-social.png`. **Never reference an `image` you have not actually created** — a dangling path ships a broken social card.
- Hand-authored cards also keep a matching `<slug>-social.svg` source: dark `#0f172a` background, 40px grid pattern, a themed glyph/illustration, white bold title + slate (`#94a3b8`) subtitle, and `by Ian Lintner` bottom-right. AI-generated cards are **PNG-only** (no SVG source — that's expected).
- **To generate a card with AI**: use **fal.ai FLUX** (`fal-ai/flux/dev` via `fal_client`; `FAL_KEY` is in `~/.zshrc`). Generate at 1216×640 (FLUX wants multiples of 32), cover-crop to exactly 1200×630, then composite the title/subtitle/byline with **PIL** over a bottom gradient scrim. **Prompt the model with "no text, no watermark"** — diffusion garbles lettering, so overlay the real text afterward. Match the dark-slate + emerald/violet accent style of the existing cards.
- **Writing voice**: opinionated first-person hook (not a summary), emoji section headers, `mermaid` diagrams for architecture, real system detail (actual names/configs/bugs), and a "what I'd do differently" section. See existing posts like `caretaker-agentic-repo-maintenance.md` for the template.
