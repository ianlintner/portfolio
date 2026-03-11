# AGENTS.md

## Project rules

- Use `pnpm` for all installs, builds, and scripts – not `npm` or `yarn`.
- Always run `pnpm lint` before commits; some lint rules are stricter than defaults.
- Database schema changes require running `pnpm db:generate` and `pnpm db:migrate`.
- Environment requires `.env` values for NEXTAUTH, DATABASE_URL, and Google Cloud Storage.
- Next.js `src/app` uses **App Router**; no legacy `pages/` folder.
- API layer built on **tRPC**; never create ad-hoc REST endpoints.
- Auth handled by **NextAuth** in `/app/api/auth/[...nextauth]/route.ts`.
- Use `src/server/api/routers` for all domain logic; register new routers in `root.ts`.
- DB queries must go through Drizzle ORM via `@/server/db`.
- Tailwind uses custom config in `tailwind.config.ts`; match design tokens when styling.
- Shared types should be colocated in `src/types` and re-used across front + back ends.
- `tsconfig.json` has path aliases (e.g. `@/server/*`); use them instead of relative imports.
- Avoid direct access to `window` APIs without guards – App Router code may run server-side.
- Large file uploads must use GCS; backend must stream – never buffer in memory.
- Drizzle migrations are auto-generated; do not hand-edit migration SQL.
- Client components must be explicitly marked with `"use client"`.

## ⚠️ Pre-push quality gate (MANDATORY)

**Every commit must pass CI checks. AI agents bypass Git hooks — run these manually before every push:**

```bash
pnpm format:fix && pnpm lint && pnpm format && pnpm run test:ci && pnpm next build
```

CI runs: `pnpm lint` → `pnpm format` (Prettier --check) → `pnpm run test:ci` (Jest) → `pnpm next build`. A failure in any step blocks the PR. Fix errors **before** committing — never push code that fails lint, format, test, or build.

## Blog authoring (MDX)

- Posts live in `src/app/blog/*.mdx`; filename (minus `.mdx`) = slug = route.
- Front-matter (YAML): `title` (required), `date` YYYY-MM-DD (required), `excerpt` (required), `tags` (optional array), `author` (optional, default "Ian Lintner"), `image`/`imageAlt` (optional, for hero/social SVG).
- First `# H1` is auto-skipped by `MarkdownRenderer` (page header displays it).
- Use ` ```mermaid ` fence blocks for diagrams — auto-rendered by `<Mermaid>` client component with dark/light theme support.
- Use GFM tables (`remarkGfm`), fenced code blocks with explicit language tags, and `rehypeHighlight` for syntax highlighting.
- Hero images: 1200×630 SVG in `/public/images/<slug>-social.svg`. See `.github/copilot-instructions.md` for the full SVG template.
- Inline images: `![alt](/images/file.svg)` — store in `/public/images/`.
- Never add inline styles; rely on Tailwind Typography prose classes and `src/styles/highlight.css`.
- Verify: `pnpm dev` → check `/blog/<slug>`, then `pnpm lint && pnpm build`.

_Full authoring guide with SVG templates, Mermaid examples, and content structure patterns: `.github/copilot-instructions.md`._
