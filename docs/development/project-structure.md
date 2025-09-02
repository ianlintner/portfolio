# Project Structure

This document provides a comprehensive overview of the Portfolio application's codebase organization and architecture.

## Root Directory Structure

```
portfolio/
├── .env.example              # Environment variables template
├── .eslintrc.json           # ESLint configuration
├── .gitignore               # Git ignore patterns
├── .github/                 # GitHub workflows and templates
├── Dockerfile               # Docker container configuration
├── docker-compose.yml       # Local development services
├── jest.config.js           # Jest testing configuration
├── jest.setup.js            # Jest setup file
├── k8s/                     # Kubernetes manifests
├── mkdocs.yml               # Documentation configuration
├── next.config.js           # Next.js configuration
├── package.json             # Project dependencies and scripts
├── pnpm-lock.yaml          # Locked dependency versions
├── postcss.config.js       # PostCSS configuration
├── prisma/                  # Database schema and migrations
├── public/                  # Static assets
├── src/                     # Application source code
├── tailwind.config.ts       # Tailwind CSS configuration
└── tsconfig.json           # TypeScript configuration
```

## Source Code Organization (`src/`)

### Overview
```
src/
├── app/                     # Next.js App Router pages and layouts
├── components/              # Reusable React components
├── server/                  # Backend code (tRPC, database)
├── types/                   # Shared TypeScript type definitions
└── utils/                   # Utility functions and helpers
```

### App Directory (`src/app/`)

The `app/` directory follows Next.js 13+ App Router conventions with file-based routing.

```
src/app/
├── globals.css              # Global styles
├── layout.tsx               # Root layout component
├── page.tsx                 # Homepage
├── loading.tsx              # Global loading component
├── error.tsx                # Global error boundary
├── not-found.tsx           # 404 page
├── api/                     # API routes
│   ├── auth/               # NextAuth.js authentication
│   │   └── [...nextauth]/
│   │       └── route.ts
│   ├── health/             # Health check endpoint
│   │   └── route.ts
│   └── trpc/               # tRPC API handler
│       └── [trpc]/
│           └── route.ts
├── admin/                   # Admin interface
│   ├── layout.tsx          # Admin layout
│   ├── page.tsx            # Admin dashboard
│   ├── posts/              # Blog post management
│   ├── components/         # Component management
│   └── users/              # User management
├── blog/                    # Public blog
│   ├── page.tsx            # Blog listing
│   ├── [slug]/             # Individual blog posts
│   │   └── page.tsx
│   └── loading.tsx         # Blog loading states
├── components/              # Component showcase
│   ├── page.tsx            # Component gallery
│   └── [category]/         # Component categories
│       └── page.tsx
├── auth/                    # Authentication pages
│   ├── signin/
│   │   └── page.tsx
│   └── signup/
│       └── page.tsx
└── profile/                 # User profile
    └── page.tsx
```

#### Key App Router Features

- **Layouts**: Shared UI across routes with `layout.tsx`
- **Loading States**: Automatic loading UI with `loading.tsx`
- **Error Boundaries**: Error handling with `error.tsx`
- **Metadata**: SEO optimization with metadata API
- **Server Components**: Default server-side rendering

### Components Directory (`src/components/`)

Organized by feature and reusability level:

```
src/components/
├── ui/                      # Base UI components
│   ├── button.tsx          # Button component
│   ├── input.tsx           # Input component
│   ├── modal.tsx           # Modal component
│   ├── card.tsx            # Card component
│   └── index.ts            # Export barrel
├── layout/                  # Layout components
│   ├── header.tsx          # Site header
│   ├── footer.tsx          # Site footer
│   ├── sidebar.tsx         # Navigation sidebar
│   └── navigation.tsx      # Main navigation
├── blog/                    # Blog-specific components
│   ├── post-card.tsx       # Blog post preview
│   ├── post-content.tsx    # Blog post renderer
│   ├── post-editor.tsx     # Rich text editor
│   └── post-list.tsx       # Blog post listing
├── admin/                   # Admin interface components
│   ├── dashboard.tsx       # Admin dashboard
│   ├── user-table.tsx      # User management table
│   └── analytics.tsx       # Analytics widgets
├── auth/                    # Authentication components
│   ├── login-form.tsx      # Login form
│   ├── signup-form.tsx     # Registration form
│   └── auth-guard.tsx      # Route protection
└── forms/                   # Form components
    ├── contact-form.tsx    # Contact form
    ├── form-field.tsx      # Reusable form field
    └── form-validation.tsx # Form validation helpers
```

#### Component Organization Principles

- **ui/**: Pure, reusable UI components with no business logic
- **layout/**: Page layout and navigation components
- **feature/**: Feature-specific components (blog, admin, auth)
- **forms/**: Form-related components and validation

### Server Directory (`src/server/`)

Backend code including API routes, database operations, and business logic:

```
src/server/
├── api/                     # tRPC API definitions
│   ├── root.ts             # API router aggregation
│   └── routers/            # Feature-specific routers
│       ├── auth.ts         # Authentication endpoints
│       ├── blog.ts         # Blog management endpoints
│       ├── user.ts         # User management endpoints
│       ├── component.ts    # Component showcase endpoints
│       └── upload.ts       # File upload endpoints
├── auth.ts                  # NextAuth.js configuration
├── db.ts                    # Database client and connection
└── lib/                     # Server-side utilities
    ├── validation.ts       # Zod validation schemas
    ├── storage.ts          # Google Cloud Storage integration
    └── email.ts            # Email service integration
```

#### tRPC Router Structure

Each router follows a consistent pattern:

```typescript
// Example: src/server/api/routers/blog.ts
export const blogRouter = createTRPCRouter({
  // Public procedures
  getAll: publicProcedure
    .input(z.object({ /* input schema */ }))
    .query(async ({ input, ctx }) => { /* implementation */ }),

  // Protected procedures
  create: protectedProcedure
    .input(z.object({ /* input schema */ }))
    .mutation(async ({ input, ctx }) => { /* implementation */ }),
});
```

### Types Directory (`src/types/`)

Shared TypeScript type definitions used across the application:

```
src/types/
├── api.ts                   # API response types
├── auth.ts                  # Authentication types
├── blog.ts                  # Blog-related types
├── component.ts             # Component showcase types
├── database.ts              # Database entity types
├── global.ts                # Global type augmentations
└── index.ts                 # Type exports
```

#### Type Organization

- **Database Types**: Generated by Prisma from schema
- **API Types**: Inferred from tRPC routers
- **Component Types**: Props and state interfaces
- **Global Types**: Environment variables, module augmentations

### Utils Directory (`src/utils/`)

Utility functions and helper modules:

```
src/utils/
├── api.ts                   # tRPC client configuration
├── auth.ts                  # Authentication helpers
├── constants.ts             # Application constants
├── date.ts                  # Date formatting utilities
├── format.ts                # Text formatting utilities
├── validation.ts            # Client-side validation
└── cn.ts                    # Class name utility (clsx)
```

## Database Structure (`prisma/`)

```
prisma/
├── schema.prisma            # Database schema definition
├── seed.ts                  # Database seeding script
└── migrations/              # Database migration files
    └── [timestamp]_[name]/
        └── migration.sql
```

### Schema Organization

The Prisma schema is organized by domain:

```prisma
// User management
model User { /* ... */ }
model Account { /* ... */ }
model Session { /* ... */ }

// Content management
model BlogPost { /* ... */ }
model Component { /* ... */ }
model Tag { /* ... */ }

// File management
model Upload { /* ... */ }
```

## Configuration Files

### Next.js Configuration (`next.config.js`)

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['storage.googleapis.com'],
  },
  // Additional configuration...
};
```

### TypeScript Configuration (`tsconfig.json`)

Key path mappings for clean imports:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/server/*": ["./src/server/*"],
      "@/types/*": ["./src/types/*"],
      "@/utils/*": ["./src/utils/*"]
    }
  }
}
```

### Tailwind Configuration (`tailwind.config.ts`)

Custom design system configuration:

```typescript
const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Custom theme extensions
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    // Additional plugins
  ],
};
```

## Development Workflow

### Adding New Features

1. **Create API Router**: Add new router in `src/server/api/routers/`
2. **Register Router**: Export in `src/server/api/root.ts`
3. **Create Components**: Add UI components in appropriate directory
4. **Add Pages**: Create pages in `src/app/` following App Router conventions
5. **Add Tests**: Create tests for new functionality
6. **Update Types**: Add TypeScript types in `src/types/`

### File Naming Conventions

- **Components**: PascalCase (e.g., `BlogPost.tsx`)
- **Pages**: kebab-case (e.g., `blog-post.tsx`)
- **Utilities**: camelCase (e.g., `formatDate.ts`)
- **Types**: PascalCase (e.g., `BlogPostType.ts`)
- **API Routes**: kebab-case (e.g., `blog-posts.ts`)

### Import Organization

```typescript
// 1. React and Next.js imports
import React from 'react';
import { NextPage } from 'next';

// 2. Third-party library imports
import { clsx } from 'clsx';

// 3. Internal imports (using path mappings)
import { Button } from '@/components/ui/button';
import { api } from '@/utils/api';
import type { BlogPost } from '@/types/blog';

// 4. Relative imports
import './styles.css';
```

## Build and Deployment Structure

### Docker Structure

```dockerfile
# Multi-stage build
FROM node:18-alpine AS base
# Dependencies stage
FROM base AS deps
# Build stage  
FROM base AS builder
# Runtime stage
FROM base AS runner
```

### Kubernetes Manifests (`k8s/`)

```
k8s/
├── apps/
│   └── portfolio/
│       ├── base/           # Base Kubernetes resources
│       └── overlays/       # Environment-specific configs
│           ├── dev/
│           ├── staging/
│           └── prod/
└── flux-system/            # GitOps configuration
```

## Code Quality and Standards

### ESLint Configuration

The project uses strict ESLint rules with TypeScript support:

- **@typescript-eslint/recommended**: TypeScript-specific rules
- **next/core-web-vitals**: Next.js performance rules
- **Custom rules**: Project-specific linting rules

### Testing Structure

```
__tests__/                   # Test files (if using separate test directory)
src/
├── components/
│   └── __tests__/          # Component tests
├── server/
│   └── __tests__/          # API tests
└── utils/
    └── __tests__/          # Utility tests
```

## Performance Considerations

### Bundle Optimization

- **Dynamic Imports**: Code splitting with `dynamic()` imports
- **Tree Shaking**: Unused code elimination
- **Image Optimization**: Next.js Image component
- **Font Optimization**: Next.js Font optimization

### Database Optimization

- **Connection Pooling**: Prisma connection management
- **Query Optimization**: Efficient database queries
- **Indexing**: Proper database indexes for performance

## Security Considerations

### Input Validation

- **Zod Schemas**: Runtime type checking and validation
- **CSRF Protection**: Built-in Next.js CSRF protection
- **SQL Injection**: Prisma ORM protection

### Authentication Security

- **Session Management**: Secure session handling with NextAuth.js
- **Password Hashing**: bcrypt for password security
- **JWT Tokens**: Secure token generation and validation

## Next Steps

- Explore [API Documentation](api.md) for backend details
- Review [Database Schema](database.md) for data modeling
- Check [Testing Guide](testing.md) for testing strategies
- See [Authentication](authentication.md) for auth implementation