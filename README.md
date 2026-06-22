# Portfolio & Blog

<img width="991" height="651" alt="Screenshot 2025-12-10 at 14 14 25" src="https://github.com/user-attachments/assets/dfd34e4c-10c8-4d5e-8461-a1612bd5c4b5" />

A static portfolio, technical blog, and browser game built with **Astro**, **HTMX**, **Tailwind CSS**, and **Phaser 3** — deployed to **Azure Static Web Apps**.

**Live at:** [cat-herding.net](https://cat-herding.net)

## Quick Start

```bash
pnpm install
pnpm dev          # http://localhost:4321
```

## Scripts

| Command                | Purpose                                     |
| ---------------------- | ------------------------------------------- |
| `pnpm dev`             | Local development server (Astro dev server) |
| `pnpm build`           | Lint, format, and Astro static build        |
| `pnpm lint`            | ESLint (configured for JS files)            |
| `pnpm format`          | Prettier check (`format:fix` to auto-fix)   |
| `pnpm test`            | Jest unit tests (configured with ts-jest)   |
| `pnpm test:ci`         | Jest in CI mode (`--ci --passWithNoTests`)  |
| `pnpm test:e2e`        | Playwright visual regression tests          |
| `pnpm test:e2e:update` | Update Playwright snapshots                 |

## Features

- **Blog** — Markdown posts in `src/content/blog/*.md`, managed via Astro Content Collections, rendered statically with `remark-math`/`rehype-katex` for LaTeX and client-side Mermaid.js diagrams.
- **Resume** — Static resume page with PDF export
- **Demos** — Project showcase with links to live demos and repos
- **Games** — Playable Cat Adventure Phaser 3 browser game at `/game`, plus links to standalone game launches such as Star Freight Tycoon
- **Theme Package** — Shareable UI components published as `@ianlintner/theme` (`packages/theme`), with native Astro rewrites inside `src/components/` for zero-React runtime overhead.

## Architecture

Static Astro build (`output: "static"`) packaged inside a lightweight Docker image and served via a native, dependency-free Node.js static server (`server.js`) on port 3000. Deployed to Azure Static Web Apps.

```
src/
├── components/   # Native Astro UI components (Button, Footer, Nav, ThemeSwitcher)
├── content/      # Markdown blog posts and collections configuration
├── game/         # Phaser 3 game source (scenes, assets, rogue mode)
├── layouts/      # Global layout template with HTMX boosts & widgets
├── pages/        # Astro page routes (blog, game, demos, resume, etc.)
└── styles/       # Tailwind + custom CSS animations
packages/theme/   # Standalone UI component library
```

## CI/CD

GitHub Actions (`.github/workflows/ci.yml`):

1. **Quality gate** — lint → format check → test → build
2. **Deploy** — uploads static build to Azure Static Web Apps (main branch only)

Theme publishing is handled by `.github/workflows/publish-theme.yml` on tagged releases.

## Visual QA (Playwright)

Playwright-based visual regression tests for the Phaser game route (`/game`).

```bash
pnpm exec playwright install chromium   # first-time browser setup
pnpm test:e2e                           # run visual tests
pnpm test:e2e:update                    # update snapshots
```
