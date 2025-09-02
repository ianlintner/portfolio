# Docker Deployment

Guide to containerizing and deploying the Portfolio application using Docker.

## Overview

The Portfolio application is designed to run in Docker containers for consistent deployment across environments.

## Docker Configuration

### Dockerfile

```dockerfile
# Use Node.js 18 Alpine as base image
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json pnpm-lock.yaml* ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm install -g pnpm && pnpm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_USER: portfolio
      POSTGRES_PASSWORD: portfolio
      POSTGRES_DB: portfolio
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U portfolio"]
      interval: 10s
      timeout: 5s
      retries: 5

  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://portfolio:portfolio@postgres:5432/portfolio
      - NEXTAUTH_SECRET=your-secret-key
      - NEXTAUTH_URL=http://localhost:3000
    depends_on:
      postgres:
        condition: service_healthy
    volumes:
      - ./prisma:/app/prisma
    command: sh -c "npx prisma migrate deploy && node server.js"

volumes:
  postgres_data:
```

## Building and Running

### Local Development

```bash
# Build the Docker image
docker build -t portfolio:latest .

# Run with Docker Compose
docker-compose up --build

# Run specific service
docker-compose up postgres
```

### Production Build

```bash
# Build production image
docker build --target runner -t portfolio:prod .

# Run production container
docker run -d \
  --name portfolio-prod \
  -p 3000:3000 \
  -e DATABASE_URL="your-production-db-url" \
  -e NEXTAUTH_SECRET="your-production-secret" \
  portfolio:prod
```

## Environment Configuration

### Docker Environment Variables

```bash
# .env.docker
DATABASE_URL=postgresql://portfolio:portfolio@postgres:5432/portfolio
NEXTAUTH_SECRET=your-docker-secret-key
NEXTAUTH_URL=http://localhost:3000
NODE_ENV=production
```

### Health Checks

```dockerfile
# Add health check to Dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1
```

## Best Practices

1. **Multi-stage builds**: Optimize image size
2. **Non-root user**: Run containers as non-root
3. **Health checks**: Monitor container health
4. **Volume management**: Persist data properly
5. **Security scanning**: Scan images for vulnerabilities

For Kubernetes deployment, see [Kubernetes Deployment](kubernetes.md).