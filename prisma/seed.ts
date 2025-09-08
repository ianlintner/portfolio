import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { config } from "dotenv";

// Load environment variables from .env.local
config({ path: ".env.local" });

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Create admin user
  const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
  const adminName = process.env.ADMIN_NAME || "Admin User";

  const hashedPassword = await bcrypt.hash(adminPassword, 12);

  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      // Keep seed idempotent but allow resetting admin credentials
      name: adminName,
      passwordHash: hashedPassword,
      role: "ADMIN",
    },
    create: {
      email: adminEmail,
      name: adminName,
      passwordHash: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log(`✅ Created admin user: ${adminUser.email}`);

  // Create sample tags
  const reactTag = await prisma.tag.upsert({
    where: { name: "React" },
    update: {},
    create: { name: "React" },
  });

  const nextjsTag = await prisma.tag.upsert({
    where: { name: "Next.js" },
    update: {},
    create: { name: "Next.js" },
  });

  const typescriptTag = await prisma.tag.upsert({
    where: { name: "TypeScript" },
    update: {},
    create: { name: "TypeScript" },
  });

  console.log("✅ Created sample tags");

  // Create initial blog post: Architecture + GKE
  const architecturePost = await prisma.post.upsert({
    where: { slug: "building-portfolio-architecture" },
    update: {},
    create: {
      title: "The Tech Behind This Portfolio: Next.js + tRPC + Prisma on GKE",
      slug: "building-portfolio-architecture",
      excerpt:
        "How this site is built: Next.js App Router, tRPC, Prisma, and a GKE stack with Istio, Cloud SQL, and Flux CD.",
      content: `
# The Tech Behind This Portfolio: Next.js + tRPC + Prisma on GKE

This article breaks down how this portfolio/blog is built and deployed — from the Next.js application layer to the Google Kubernetes Engine (GKE) infrastructure that runs it.

## Application Stack

- **Next.js (App Router)** for modern React and server components
- **TypeScript** for end‑to‑end type safety
- **tRPC** for type‑safe APIs between client and server
- **Prisma + PostgreSQL** for data modeling and access
- **NextAuth.js** (Credentials) for authentication
- **Tailwind CSS** for styling and design tokens

Key directories:

- App Router UI: \
  \
  - \\
  `src/app`
- API Routers (tRPC): \
  `src/server/api/routers`
- Prisma schema: \
  `prisma/schema.prisma`
- Prisma client: \
  `src/server/db.ts`

## Content & Admin

- Posts are stored in PostgreSQL via Prisma models (`Post`, `Tag`, `PostTag`).
- SEO fields are included (`seoTitle`, `seoDescription`, `seoKeywords`).
- Admin UI (under `/admin`) manages posts with protected tRPC procedures.

## Kubernetes on Google Cloud

Production runs on **GKE** with the following components (see `k8s/apps/portfolio/base`):

- **Deployment** (`deployment.yaml`)
  - App container (Next.js) on port 3000
  - Sidecar **Cloud SQL Auth Proxy** for Postgres connectivity
  - **Workload Identity** enabled ServiceAccount for GCP access
- **Service** (`service.yaml`)
  - ClusterIP service exposing the app to the mesh
- **Ingress** via **Istio**
  - `istio-gateway.yaml` + `istio-virtualservice.yaml`
  - Static IP (`istio-static-ip.yaml`) and Google **ManagedCertificate** (`istio-certificate.yaml`)
- **Cloud SQL**
  - Instance and service account manifests included
- **NetworkPolicy** to restrict pod communications

### Database Connectivity

The app connects to Cloud SQL via the sidecar proxy. Environment variables are sourced from ConfigMaps/Secrets to build the `DATABASE_URL`. Workload Identity maps the pod to an IAM service account without storing long‑lived credentials on the node.

## CI/CD & GitOps

- **Build & Push**: GitHub Actions builds the Docker image and pushes to **Artifact Registry**.
- **GitOps with Flux CD**: Flux watches the registry, selects the newest tag via `ImagePolicy`, updates manifests with `ImageUpdateAutomation`, and reconciles them into the cluster. This produces a fully declarative, auditable release process.

Relevant docs in the repo:

- `DOCKER_CI_SETUP.md` — image build/push
- `FLUX_CD_MIGRATION.md` — Flux image automation and reconciliation
- `AUTOMATIC_DEPLOYMENT_SETUP.md` — branch→environment mapping and rollout checks

## Local Development

- Use **pnpm** for all scripts (`pnpm db:generate`, `pnpm db:push`, `pnpm db:seed`, `pnpm dev`).
- Environment variables live in `.env.local` (see `.env.example`).

## Why This Stack?

- **Developer velocity** with App Router + tRPC + Prisma
- **Operational simplicity** with GitOps and managed Postgres
- **Security** via Workload Identity and least‑privilege IAM
- **Scalability** with GKE + Istio + GCLB

` ,
      published: true,
      publishedAt: new Date(),
      seoTitle:
        "The Tech Behind My Portfolio: Next.js + tRPC + Prisma on GKE",
      seoDescription:
        "Architecture of this portfolio: Next.js App Router, tRPC, Prisma, on GKE with Istio, Cloud SQL, and Flux CD.",
      seoKeywords: [
        "Next.js",
        "tRPC",
        "Prisma",
        "Kubernetes",
        "GKE",
        "Google Cloud",
        "Istio",
        "Flux CD",
        "Cloud SQL",
        "portfolio",
        "blog",
      ],
      authorId: adminUser.id,
    },
  });

  // Create second blog post: AI Agents
  const aiAgentsPost = await prisma.post.upsert({
    where: { slug: "ai-agents-cline-roo" },
    update: {},
    create: {
      title: "Using AI Agent Tools (Cline & Roo) in Development",
      slug: "ai-agents-cline-roo",
      excerpt:
        "An article on how AI-driven tools like Cline and Roo accelerated the development of this site.",
      content: `
# Using AI Agent Tools (Cline & Roo) in Development

During the development of this portfolio blog, I used AI agents such as **Roo** and **Cline** to speed up the process.

## Roo
Roo acted as a system-level developer, able to make structured edits, manage migrations, and coordinate tasks.

## Cline
Cline helped orchestrate multi-step workflows and provided higher-level guidance on development.

## Benefits
- Reduced repetitive coding
- Automated boilerplate scaffolding
- Error checking and guided debugging

## Outcomes
The combination of AI tools allowed me to move faster, focus more on architecture decisions, and get an initial version deployed quickly.
      `,
      published: true,
      publishedAt: new Date(),
      seoTitle: "Using AI Agent Tools in Development (Cline, Roo)",
      seoDescription:
        "Exploring how AI agents like Cline and Roo accelerated building this portfolio blog.",
      seoKeywords: ["AI agents", "Cline", "Roo", "development tools"],
      authorId: adminUser.id,
    },
  });

  // Connect tags to the Architecture post
  await prisma.postTag.upsert({
    where: {
      postId_tagId: {
        postId: architecturePost.id,
        tagId: reactTag.id,
      },
    },
    update: {},
    create: {
      postId: architecturePost.id,
      tagId: reactTag.id,
    },
  });

  await prisma.postTag.upsert({
    where: {
      postId_tagId: {
        postId: architecturePost.id,
        tagId: nextjsTag.id,
      },
    },
    update: {},
    create: {
      postId: architecturePost.id,
      tagId: nextjsTag.id,
    },
  });

  await prisma.postTag.upsert({
    where: {
      postId_tagId: {
        postId: architecturePost.id,
        tagId: typescriptTag.id,
      },
    },
    update: {},
    create: {
      postId: architecturePost.id,
      tagId: typescriptTag.id,
    },
  });

  console.log("✅ Created blog posts with tags");

  // Create sample component demo
  const sampleDemo = await prisma.componentDemo.create({
    data: {
      name: "Interactive Button",
      description:
        "A reusable button component with hover effects and multiple variants.",
      code: `
import React from 'react'
import { clsx } from 'clsx'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

export function Button({ 
  variant = 'primary', 
  size = 'md', 
  className, 
  children, 
  ...props 
}: ButtonProps) {
  return (
    <button
      className={clsx(
        'rounded font-medium transition-colors focus:outline-none focus:ring-2',
        {
          'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500': variant === 'primary',
          'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500': variant === 'secondary',
          'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500': variant === 'outline',
          'px-3 py-1.5 text-sm': size === 'sm',
          'px-4 py-2 text-base': size === 'md',
          'px-6 py-3 text-lg': size === 'lg',
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
      `,
      category: "REACT",
      technologies: ["React", "TypeScript", "Tailwind CSS"],
      published: true,
    },
  });

  console.log("✅ Created component demo");

  console.log("🎉 Database seeding completed!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Error during seeding:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
