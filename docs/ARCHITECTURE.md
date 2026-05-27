# Architecture Overview

This document explains the application architecture, how data flows, and how the system is deployed to Azure Kubernetes Service (AKS) as a purely static site.

## Application Stack

- **Astro (Static Site Generation)**:
  - Component-based templating engine compiling to pure, zero-JS HTML/CSS by default.
  - Page routes defined statically in `src/pages/`.
  - Content Collections API for managing blog posts.
- **HTMX**:
  - Exclusive client-side navigation tool via `hx-boost="true"` on the body.
  - Allows SPA-like instant page transitions by dynamically swapping the `<main>` content via AJAX, preventing full-page unloads.
- **Vanilla JavaScript/TypeScript**:
  - Light scripting inside Astro components for local client-side interactivity (mobile navigation toggle, light/dark theme switcher).
  - Lifecycles managed via DOM event listeners (`DOMContentLoaded`, `astro:after-swap`, `htmx:load`, `htmx:beforeSwap`).
- **Phaser & Chat Embeds**:
  - Client-side canvas game (Cat Adventure) and chat widget embedded directly on page entry and torn down/reset during page transitions.
- **Tailwind CSS**:
  - Utility-first styling configured in `tailwind.config.ts`.
  - Global styles and animations defined in `src/styles/globals.css`.

## Content Model (Astro Collections)

- **Blog Posts**: Managed under `src/content/blog/` as standard Markdown (`.md`) files.
  - Frontmatter schema (title, date, excerpt, tags, author, image, imageAlt) defined in `src/content/config.ts`.
  - Dynamic route rendering inside `src/pages/blog/[...slug].astro` using Astro's native content parser.
  - Math formulas rendered using `remark-math` and `rehype-katex` plugins.
  - Mermaid.js diagrams rendered client-side.

## Request Flow

1. Browser requests a page (e.g. `/about`).
2. The Node.js static server (`server.js`) resolves it to the static HTML file (e.g. `dist/about.html`) and serves it.
3. Once loaded, clicking links triggers HTMX `hx-boost`. The browser fetches the target page, parses the HTML, and swaps the main content element without restarting the JS environment or reloading styles.
4. Interactive scripts initialize on page swaps or `htmx:load` events.

## Deployment & Hosting (AKS)

The application compiles into static files in `dist/` and runs inside a lightweight docker container:

- **Static Server (`server.js`)**: A dependency-free, native Node.js HTTP server.
  - Serves assets from `dist/` with correct MIME types.
  - Resolves extensionless paths (e.g. `/about` to `/about.html`) to support clean URLs.
  - Serves a mock JSON status check at `/api/health` for Kubernetes probes.
- **Deployment Manifests (`k8s/apps/portfolio`)**:
  - Deployment: `base/deployment.yaml`
    - App container runs on port 3000 (health endpoint `/api/health`).
    - Runs as non-root user `1001` with `runAsNonRoot: true`.
  - Service: `base/service.yaml` (ClusterIP).
  - Istio Gateway & VirtualService: `base/istio-gateway.yaml`, `base/istio-virtualservice.yaml` map traffic to the cluster service.

## CI/CD & GitOps

- **Build**: GitHub Actions compiles docs (`pnpm docs:build`), runs Astro build (`astro build`), and pushes the docker image to Azure Container Registry.
- **CI**: Runs formatting (`pnpm format`), linting (`pnpm lint`), and build checks.
- **GitOps**: Flux CD watches the registry and deploys updates dynamically.

## Local Development

- Use `pnpm` as the package manager.
- Key commands:
  - `pnpm dev`: Start the local Astro development server.
  - `pnpm build`: Generate the production static site in `dist/`.
  - `pnpm preview`: Locally preview the production static build.
  - `pnpm format:fix`: Format code before committing.
