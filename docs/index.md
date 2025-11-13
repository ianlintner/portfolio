# Portfolio & Blog Documentation

Welcome to the technical documentation for the portfolio and blog application. This is a modern full-stack web application built with cutting-edge technologies and deployed on Google Kubernetes Engine (GKE).

## Overview

This portfolio and blog application showcases:

- **Modern Tech Stack**: Next.js 15 (App Router), React 19, TypeScript
- **Type-Safe APIs**: tRPC for end-to-end type safety
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: NextAuth.js with secure credential handling
- **Styling**: Tailwind CSS with custom design system
- **Deployment**: Kubernetes on GKE with GitOps via Flux CD
- **CI/CD**: Automated Docker builds and deployments

## Quick Start

Get up and running in minutes:

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your database URL and secrets

# Generate database migrations
pnpm db:generate

# Apply migrations
pnpm db:migrate

# Run development server
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your application.

## Key Features

### 📝 Technical Blog

- MDX-based blog posts with full markdown support
- Syntax highlighting for code blocks
- Tags and categories
- SEO optimized with OpenGraph and Twitter cards

### 🎨 Portfolio Projects

- Interactive project demos
- Code examples and explanations
- Responsive design

### 🔐 Admin Dashboard

- Secure authentication
- Content management
- User management

### ☁️ Cloud-Native Architecture

- Kubernetes deployment on GKE
- Cloud SQL for PostgreSQL
- Istio service mesh
- Automated GitOps workflows

## Documentation Structure

- **[Architecture](ARCHITECTURE.md)**: Deep dive into the application architecture
- **[Development](getting-started.md)**: Developer onboarding and setup
- **[Infrastructure](DOCKER_CI_SETUP.md)**: Deployment and infrastructure guides
- **[Features](SOCIAL_MEDIA_TAGS.md)**: Detailed feature documentation

## Technology Stack

### Frontend

- **Next.js 15**: React framework with App Router
- **React 19**: Latest React features
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Lucide React**: Icon library

### Backend

- **tRPC**: Type-safe API layer
- **Drizzle ORM**: TypeScript ORM for PostgreSQL
- **NextAuth.js**: Authentication solution
- **PostgreSQL**: Relational database

### DevOps

- **Docker**: Container platform
- **Kubernetes (GKE)**: Container orchestration
- **Flux CD**: GitOps continuous delivery
- **GitHub Actions**: CI/CD automation

## Contributing

We welcome contributions! Please see our [Contributing Guidelines](contributing.md) for details.

## Support

For issues and questions:

- GitHub Issues: [ianlintner/portfolio](https://github.com/ianlintner/portfolio/issues)
- Documentation: This site
- Email: Contact through GitHub

## License

This project is proprietary. All rights reserved.
