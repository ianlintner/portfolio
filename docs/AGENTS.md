# AGENTS.md

## Project rules

- Use `pnpm` for all installs, builds, and scripts – not `npm` or `yarn`.
- Always run `pnpm lint` before commits; some lint rules are stricter than defaults.
- All page routes must be defined in `src/pages/` using `.astro` templates (SSG static compilation).
- Tailwind uses custom config in `tailwind.config.ts`; match design tokens when styling.
- Global styles and animations are defined in `src/styles/globals.css`.
- Page transitions must use HTMX boost (`hx-boost="true"` defined on body) for fast client navigation.
- Shared types should be colocated in `src/types` and reused across templates and utilities.
- `tsconfig.json` has path aliases (e.g. `@/components/*`); use them instead of relative imports.
- Client-side interactivity must be written as vanilla script tags inside Astro files or dedicated JS imports.
- Lifecycles for games, dynamic widgets, or embeds must hook into DOM events (`DOMContentLoaded`, `astro:after-swap`, `htmx:load`, `htmx:beforeSwap`) to handle navigation page swaps correctly.

## ⚠️ Pre-push quality gate (MANDATORY)

**Every commit must pass CI checks. AI agents bypass Git hooks — run these manually before every push:**

```bash
pnpm format:fix && pnpm lint && pnpm format && pnpm run build
```

CI runs: `pnpm lint` → `pnpm format` (Prettier --check) → `pnpm run build` (Astro build). A failure in any step blocks the PR. Fix errors **before** committing — never push code that fails lint, format, or build.

## Blog authoring (Markdown)

- Posts live in `src/content/blog/*.md`; filename (minus `.md`) = slug = route.
- Front-matter (YAML): `title` (required), `date` YYYY-MM-DD (required), `excerpt` (required), `tags` (optional array), `author` (optional, default "Ian Lintner"), `image`/`imageAlt` (optional, for hero/social image).
- Use ` ```mermaid ` fence blocks for diagrams — auto-rendered client-side using `mermaid` package loaded inside the blog post template.
- Math equations can be written as standard LaTeX (e.g., `$$ ... $$` or `$ ... $`) — compiled using `remark-math` and `rehype-katex`.
- Hero images: 1200×630 image in `/public/images/<slug>-social.png`.
- Inline images: `![alt](/images/file.png)` — store in `/public/images/`.
- Never add inline styles; rely on Tailwind Typography prose classes.
- Verify: `pnpm dev` → check `/blog/<slug>`, then `pnpm lint && pnpm build`.
