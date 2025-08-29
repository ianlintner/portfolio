import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Calendar, Clock, Tag, Share2, BookOpen } from 'lucide-react'

// Mock data for individual posts
const mockPostContent = {
  'modern-nextjs-portfolio-typescript-trpc': {
    id: '1',
    title: 'Building a Modern Next.js Portfolio with TypeScript and tRPC',
    slug: 'modern-nextjs-portfolio-typescript-trpc',
    excerpt: 'Learn how to build a full-stack portfolio website using Next.js 14, TypeScript, tRPC, and Prisma. This comprehensive guide covers everything from setup to deployment.',
    content: `
# Building a Modern Next.js Portfolio with TypeScript and tRPC

In this comprehensive guide, we'll build a modern, full-stack portfolio website using the latest technologies including Next.js 14, TypeScript, tRPC, and Prisma.

## Overview

This project demonstrates how to create a professional portfolio website with:

- **Next.js 14** with App Router for modern React development
- **TypeScript** for type safety throughout the stack
- **tRPC** for end-to-end type-safe API calls
- **Prisma** with PostgreSQL for database management
- **NextAuth.js** for authentication
- **Tailwind CSS** for styling

## Getting Started

### Prerequisites

Before we begin, make sure you have the following installed:

- Node.js 18+ 
- npm or yarn
- PostgreSQL database (local or cloud)

### Project Setup

\`\`\`bash
# Create a new Next.js project
npx create-next-app@latest portfolio --typescript --tailwind --eslint --app

# Navigate to the project directory
cd portfolio

# Install additional dependencies
npm install @trpc/server @trpc/client @trpc/react-query @trpc/next
npm install @tanstack/react-query zod
npm install prisma @prisma/client
npm install next-auth
npm install bcryptjs @types/bcryptjs
\`\`\`

## Database Setup with Prisma

First, let's set up our database schema:

\`\`\`prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  password  String
  role      Role     @default(USER)
  posts     Post[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("users")
}

model Post {
  id        String   @id @default(cuid())
  title     String
  slug      String   @unique
  excerpt   String?
  content   String
  published Boolean  @default(false)
  authorId  String
  author    User     @relation(fields: [authorId], references: [id], onDelete: Cascade)
  tags      PostTag[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("posts")
}

enum Role {
  USER
  ADMIN
}
\`\`\`

## tRPC Setup

Next, let's configure tRPC for type-safe API calls:

\`\`\`typescript
// src/server/api/trpc.ts
import { initTRPC, TRPCError } from '@trpc/server'
import { type CreateNextContextOptions } from '@trpc/server/adapters/next'
import { type Session } from 'next-auth'
import { getServerAuthSession } from '~/server/auth'
import { db } from '~/server/db'
import superjson from 'superjson'
import { ZodError } from 'zod'

type CreateContextOptions = {
  session: Session | null
}

const createInnerTRPCContext = (opts: CreateContextOptions) => {
  return {
    session: opts.session,
    db,
  }
}

export const createTRPCContext = async (opts: CreateNextContextOptions) => {
  const { req, res } = opts
  const session = await getServerAuthSession({ req, res })

  return createInnerTRPCContext({
    session,
  })
}

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    }
  },
})

export const createTRPCRouter = t.router
export const publicProcedure = t.procedure
\`\`\`

## Creating API Routes

Let's create our post management routes:

\`\`\`typescript
// src/server/api/routers/post.ts
import { z } from 'zod'
import { createTRPCRouter, publicProcedure, protectedProcedure } from '~/server/api/trpc'

export const postRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(z.object({
      limit: z.number().min(1).max(100).nullish(),
      cursor: z.string().nullish(),
      published: z.boolean().optional().default(true),
    }))
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 10
      const { cursor } = input
      
      const posts = await ctx.db.post.findMany({
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        where: {
          published: input.published,
        },
        include: {
          author: {
            select: {
              name: true,
            },
          },
          tags: {
            include: {
              tag: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      })

      let nextCursor: typeof cursor | undefined = undefined
      if (posts.length > limit) {
        const nextItem = posts.pop()
        nextCursor = nextItem!.id
      }

      return {
        posts,
        nextCursor,
      }
    }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const post = await ctx.db.post.findUnique({
        where: { slug: input.slug },
        include: {
          author: {
            select: {
              name: true,
            },
          },
          tags: {
            include: {
              tag: true,
            },
          },
        },
      })

      if (!post) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Post not found',
        })
      }

      return post
    }),
})
\`\`\`

## Frontend Implementation

Now let's create the blog listing page:

\`\`\`tsx
// src/app/blog/page.tsx
'use client'

import { api } from '~/utils/trpc'
import Link from 'next/link'
import { Calendar, Clock, Tag } from 'lucide-react'

export default function BlogPage() {
  const { data: postsData, isLoading } = api.post.getAll.useQuery({
    limit: 10,
    published: true,
  })

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Blog</h1>
      
      <div className="grid gap-8">
        {postsData?.posts.map((post) => (
          <article key={post.id} className="border rounded-lg p-6">
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>5 min read</span>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold mb-3">
              <Link href={\`/blog/\${post.slug}\`} className="hover:text-blue-600">
                {post.title}
              </Link>
            </h2>
            
            <p className="text-gray-600 mb-4">{post.excerpt}</p>
            
            {post.tags.length > 0 && (
              <div className="flex gap-2">
                {post.tags.map((tagRelation) => (
                  <span key={tagRelation.tag.id} className="bg-gray-100 px-2 py-1 rounded text-sm">
                    {tagRelation.tag.name}
                  </span>
                ))}
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  )
}
\`\`\`

## Deployment

For deployment, we recommend using Vercel with a PostgreSQL database:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set up environment variables
4. Deploy!

## Conclusion

We've built a modern, full-stack portfolio website with type safety throughout the entire stack. This architecture provides excellent developer experience and maintainability.

The combination of Next.js, TypeScript, tRPC, and Prisma creates a powerful foundation for any web application, not just portfolios.

## Next Steps

- Add image upload functionality
- Implement search and filtering
- Add comments system
- Set up monitoring and analytics
- Implement automated testing

Happy coding! 🚀
    `,
    publishedAt: new Date('2024-01-15'),
    author: { name: 'Ian Lintner' },
    tags: [
      { tag: { id: '1', name: 'Next.js' } },
      { tag: { id: '2', name: 'TypeScript' } },
      { tag: { id: '3', name: 'tRPC' } }
    ]
  },
  'deploying-gke-gitops-argocd': {
    id: '2',
    title: 'Deploying to Google Kubernetes Engine with GitOps and ArgoCD',
    slug: 'deploying-gke-gitops-argocd',
    excerpt: 'A complete guide to setting up a production-ready Kubernetes deployment pipeline using Google Cloud Platform, GitOps principles, and ArgoCD for automated deployments.',
    content: `
# Deploying to Google Kubernetes Engine with GitOps and ArgoCD

Learn how to set up a production-ready deployment pipeline using Google Kubernetes Engine, GitOps principles, and ArgoCD for automated deployments.

## What is GitOps?

GitOps is a modern approach to continuous deployment where Git serves as the single source of truth for infrastructure and application configurations.

## Prerequisites

- Google Cloud Platform account
- kubectl installed
- Docker installed
- Git repository

## Setting up GKE Cluster

First, let's create our Kubernetes cluster:

\`\`\`bash
# Create GKE cluster
gcloud container clusters create portfolio-cluster \\
  --zone us-central1-a \\
  --num-nodes 3 \\
  --enable-autoscaling \\
  --min-nodes 1 \\
  --max-nodes 10
\`\`\`

## Installing ArgoCD

Install ArgoCD in your cluster:

\`\`\`bash
# Create namespace
kubectl create namespace argocd

# Install ArgoCD
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
\`\`\`

## Kubernetes Manifests

Create your application manifests:

\`\`\`yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: portfolio-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: portfolio-app
  template:
    metadata:
      labels:
        app: portfolio-app
    spec:
      containers:
      - name: portfolio-app
        image: gcr.io/PROJECT_ID/portfolio:latest
        ports:
        - containerPort: 3000
\`\`\`

This guide covers the complete setup process for a production-ready deployment pipeline.
    `,
    publishedAt: new Date('2024-01-10'),
    author: { name: 'Ian Lintner' },
    tags: [
      { tag: { id: '4', name: 'Kubernetes' } },
      { tag: { id: '5', name: 'Google Cloud' } },
      { tag: { id: '6', name: 'DevOps' } }
    ]
  },
  'advanced-react-patterns-hooks-context': {
    id: '3',
    title: 'Advanced React Patterns: Custom Hooks and Context Management',
    slug: 'advanced-react-patterns-hooks-context',
    excerpt: 'Dive deep into advanced React patterns including custom hooks, context optimization, and state management strategies for large-scale applications.',
    content: `
# Advanced React Patterns: Custom Hooks and Context Management

Explore advanced React patterns that will help you build more maintainable and scalable applications.

## Custom Hooks

Custom hooks are a powerful way to share stateful logic between components:

\`\`\`tsx
// useLocalStorage hook
function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      return initialValue
    }
  })

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.log(error)
    }
  }

  return [storedValue, setValue] as const
}
\`\`\`

## Context Optimization

Learn how to optimize React Context to prevent unnecessary re-renders:

\`\`\`tsx
// Optimized context pattern
const StateContext = createContext(null)
const DispatchContext = createContext(null)

function StateProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  
  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  )
}
\`\`\`

## Compound Components

Build flexible component APIs using the compound component pattern:

\`\`\`tsx
function Modal({ children, isOpen, onClose }) {
  return isOpen ? (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  ) : null
}

Modal.Header = function ModalHeader({ children }) {
  return <div className="modal-header">{children}</div>
}

Modal.Body = function ModalBody({ children }) {
  return <div className="modal-body">{children}</div>
}

Modal.Footer = function ModalFooter({ children }) {
  return <div className="modal-footer">{children}</div>
}
\`\`\`

These patterns will help you build more maintainable and reusable React components.
    `,
    publishedAt: new Date('2024-01-05'),
    author: { name: 'Ian Lintner' },
    tags: [
      { tag: { id: '7', name: 'React' } },
      { tag: { id: '8', name: 'JavaScript' } },
      { tag: { id: '9', name: 'State Management' } }
    ]
  }
}

interface Props {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = mockPostContent[params.slug as keyof typeof mockPostContent]
  
  if (!post) {
    return {
      title: 'Post Not Found | Ian Lintner',
    }
  }

  return {
    title: `${post.title} | Ian Lintner`,
    description: post.excerpt,
    keywords: post.tags.map(tag => tag.tag.name),
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt.toISOString(),
      authors: [post.author.name],
      tags: post.tags.map(tag => tag.tag.name),
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
    },
  }
}

export default function BlogPostPage({ params }: Props) {
  const post = mockPostContent[params.slug as keyof typeof mockPostContent]

  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Navigation */}
          <div className="mb-8">
            <Link
              href="/blog"
              className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Link>
          </div>

          {/* Article Header */}
          <header className="mb-12">
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>
                  {post.publishedAt.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>10 min read</span>
              </div>
              <div className="flex items-center gap-1">
                <BookOpen className="h-4 w-4" />
                <span>{post.author.name}</span>
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
              {post.title}
            </h1>

            <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
              {post.excerpt}
            </p>

            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {post.tags.map((tagRelation) => (
                  <span
                    key={tagRelation.tag.id}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium"
                  >
                    <Tag className="h-3 w-3" />
                    <span>{tagRelation.tag.name}</span>
                  </span>
                ))}
              </div>
            )}

            {/* Share Button */}
            <div className="flex items-center gap-4 pt-6 border-t border-border">
              <span className="text-sm text-muted-foreground">Share this article:</span>
              <button className="inline-flex items-center gap-1 px-3 py-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <Share2 className="h-4 w-4" />
                Share
              </button>
            </div>
          </header>

          {/* Article Content */}
          <article className="prose prose-lg prose-gray max-w-none dark:prose-invert">
            <div
              dangerouslySetInnerHTML={{
                __html: post.content
                  .split('\n')
                  .map(line => {
                    if (line.startsWith('# ')) {
                      return `<h1 class="text-3xl font-bold mt-12 mb-6">${line.slice(2)}</h1>`
                    }
                    if (line.startsWith('## ')) {
                      return `<h2 class="text-2xl font-semibold mt-10 mb-4">${line.slice(3)}</h2>`
                    }
                    if (line.startsWith('### ')) {
                      return `<h3 class="text-xl font-semibold mt-8 mb-3">${line.slice(4)}</h3>`
                    }
                    if (line.startsWith('```')) {
                      return line.includes('```bash') ? '<pre class="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto"><code>' :
                             line.includes('```tsx') || line.includes('```typescript') ? '<pre class="bg-blue-900 text-blue-100 p-4 rounded-lg overflow-x-auto"><code>' :
                             line.includes('```yaml') ? '<pre class="bg-purple-900 text-purple-100 p-4 rounded-lg overflow-x-auto"><code>' :
                             line === '```' ? '</code></pre>' :
                             '<pre class="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto"><code>'
                    }
                    if (line.startsWith('- ')) {
                      return `<li class="ml-4">${line.slice(2)}</li>`
                    }
                    if (line.trim() === '') {
                      return '<br>'
                    }
                    return `<p class="mb-4 leading-relaxed">${line}</p>`
                  })
                  .join('')
              }}
            />
          </article>

          {/* Article Footer */}
          <footer className="mt-16 pt-8 border-t border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-lg font-semibold text-primary">
                    {post.author.name[0]}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold">{post.author.name}</h3>
                  <p className="text-sm text-muted-foreground">Full Stack Developer</p>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Published on</p>
                <p className="font-medium">
                  {post.publishedAt.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  )
}
