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

  const kubernetesTag = await prisma.tag.upsert({
    where: { name: "Kubernetes" },
    update: {},
    create: { name: "Kubernetes" },
  });

  const googleCloudTag = await prisma.tag.upsert({
    where: { name: "Google Cloud" },
    update: {},
    create: { name: "Google Cloud" },
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

- App Router UI: 'src/app'
- API Routers (tRPC): 'src/server/api/routers'
- Prisma schema: 'prisma/schema.prisma'
- Prisma client: 'src/server/db.ts'

## Content & Admin

- Posts are stored in PostgreSQL via Prisma models ('Post', 'Tag', 'PostTag').
- SEO fields are included ('seoTitle', 'seoDescription', 'seoKeywords').
- Admin UI (under '/admin') manages posts with protected tRPC procedures.

## Kubernetes on Google Cloud

Production runs on **GKE** with the following components (see 'k8s/apps/portfolio/base'):

- **Deployment** ('deployment.yaml')
  - App container (Next.js) on port 3000
  - Sidecar **Cloud SQL Auth Proxy** for Postgres connectivity
  - **Workload Identity** enabled ServiceAccount for GCP access
- **Service** ('service.yaml')
  - ClusterIP service exposing the app to the mesh
- **Ingress** via **Istio**
  - 'istio-gateway.yaml' + 'istio-virtualservice.yaml'
  - Static IP ('istio-static-ip.yaml') and Google **ManagedCertificate** ('istio-certificate.yaml')
- **Cloud SQL**
  - Instance and service account manifests included
- **NetworkPolicy** to restrict pod communications

### Database Connectivity

The app connects to Cloud SQL via the sidecar proxy. Environment variables are sourced from ConfigMaps/Secrets to build the 'DATABASE_URL'. Workload Identity maps the pod to an IAM service account without storing long‑lived credentials on the node.

## CI/CD & GitOps

- **Build & Push**: GitHub Actions builds the Docker image and pushes to **Artifact Registry**.
- **GitOps with Flux CD**: Flux watches the registry, selects the newest tag via 'ImagePolicy', updates manifests with 'ImageUpdateAutomation', and reconciles them into the cluster. This produces a fully declarative, auditable release process.

Relevant docs in the repo:

- 'DOCKER_CI_SETUP.md' — image build/push
- 'FLUX_CD_MIGRATION.md' — Flux image automation and reconciliation
- 'AUTOMATIC_DEPLOYMENT_SETUP.md' — branch→environment mapping and rollout checks

## Local Development

- Use **pnpm** for all scripts ('pnpm db:generate', 'pnpm db:push', 'pnpm db:seed', 'pnpm dev').
- Environment variables live in '.env.local' (see '.env.example').

## Why This Stack?

- **Developer velocity** with App Router + tRPC + Prisma
- **Operational simplicity** with GitOps and managed Postgres
- **Security** via Workload Identity and least‑privilege IAM
- **Scalability** with GKE + Istio + GCLB

      `,
      published: true,
      publishedAt: new Date(),
      seoTitle: "The Tech Behind My Portfolio: Next.js + tRPC + Prisma on GKE",
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

  await prisma.postTag.upsert({
    where: {
      postId_tagId: {
        postId: architecturePost.id,
        tagId: kubernetesTag.id,
      },
    },
    update: {},
    create: {
      postId: architecturePost.id,
      tagId: kubernetesTag.id,
    },
  });

  await prisma.postTag.upsert({
    where: {
      postId_tagId: {
        postId: architecturePost.id,
        tagId: googleCloudTag.id,
      },
    },
    update: {},
    create: {
      postId: architecturePost.id,
      tagId: googleCloudTag.id,
    },
  });

  console.log("✅ Created blog posts with tags");

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
