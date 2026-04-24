# Portfolio & Blog

<img width="991" height="651" alt="Screenshot 2025-12-10 at 14 14 25" src="https://github.com/user-attachments/assets/dfd34e4c-10c8-4d5e-8461-a1612bd5c4b5" />

A static portfolio, technical blog, and browser game built with **Next.js 15**, **Tailwind CSS**, and **Phaser 3** — deployed to **Azure Static Web Apps**.

**Live at:** [cat-herding.net](https://cat-herding.net)

## Quick Start

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

## Scripts

| Command                | Purpose                                          |
| ---------------------- | ------------------------------------------------ |
| `pnpm dev`             | Local development server                         |
| `pnpm build`           | Lint, format, build docs & Next.js static export |
| `pnpm lint`            | ESLint                                           |
| `pnpm format`          | Prettier check (`format:fix` to auto-fix)        |
| `pnpm test`            | Jest unit tests                                  |
| `pnpm test:ci`         | Jest in CI mode (`--ci --runInBand`)             |
| `pnpm test:e2e`        | Playwright visual regression tests               |
| `pnpm test:e2e:update` | Update Playwright snapshots                      |
| `pnpm docs:build`      | Build MkDocs into `public/docs`                  |

## Features

- **Blog** — MDX posts in `src/app/blog/*.mdx`, parsed with `gray-matter`, rendered with `react-markdown` + `rehype-highlight` + Mermaid diagrams
- **Resume** — Static resume page with PDF export
- **Demos** — Project showcase with links to live demos and repos
- **Games** — Playable Cat Adventure Phaser 3 browser game at `/game`, plus links to standalone game launches such as Star Freight Tycoon
- **Docs** — MkDocs-generated documentation site served at `/docs`
- **Theme Package** — Shared UI components published as `@ianlintner/theme` (`packages/theme`)

## Architecture

Static Next.js export (`output: "export"`) deployed to Azure Static Web Apps. No server, no database at runtime.

```
src/
├── app/          # Next.js App Router (blog, game, demos, resume, docs)
├── components/   # Shared React components (MarkdownRenderer, Mermaid, Game)
├── game/         # Phaser 3 game source (scenes, assets, rogue mode)
├── lib/          # Utilities (posts parser, metadata helpers)
└── styles/       # Tailwind + highlight.js styles
packages/theme/   # Publishable UI component library
docs/             # MkDocs source → public/docs
```

## CI/CD

GitHub Actions (`.github/workflows/ci.yml`):

1. **Quality gate** — lint → format check → test → build
2. **Deploy** — uploads static export to Azure Static Web Apps (main branch only)

Theme publishing is handled by `.github/workflows/publish-theme.yml` on tagged releases.

## Visual QA (Playwright)

Playwright-based visual regression tests for the Phaser game route (`/game`).

```bash
pnpm exec playwright install chromium   # first-time browser setup
pnpm test:e2e                           # run visual tests
pnpm test:e2e:update                    # update snapshots
```

## Further Docs

- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — App + platform architecture
- [docs/AZURE_CI_CD_SETUP.md](docs/AZURE_CI_CD_SETUP.md) — Azure CI/CD pipeline setup
- [docs/GAME_IMPLEMENTATION_PLAN.md](docs/GAME_IMPLEMENTATION_PLAN.md) — Phaser game design
