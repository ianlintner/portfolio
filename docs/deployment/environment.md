# Environment Variables

Comprehensive guide to environment variable configuration for the Portfolio application across different deployment environments.

## Required Environment Variables

### Database Configuration

```bash
# PostgreSQL connection string
DATABASE_URL="postgresql://username:password@host:port/database"

# Examples for different environments:
# Local development
DATABASE_URL="postgresql://portfolio:portfolio@localhost:5432/portfolio"

# Docker Compose
DATABASE_URL="postgresql://portfolio:portfolio@postgres:5432/portfolio"

# Google Cloud SQL (with Cloud SQL Proxy)
DATABASE_URL="postgresql://user:pass@localhost:5432/portfolio"

# Google Cloud SQL (direct connection)
DATABASE_URL="postgresql://user:pass@/portfolio?host=/cloudsql/project:region:instance"

# Production with connection pooling
DATABASE_URL="postgresql://user:pass@pgbouncer:6543/portfolio"
```

### Authentication Configuration

```bash
# NextAuth.js secret key (required)
NEXTAUTH_SECRET="your-super-secret-random-string"

# Application URL (important for OAuth callbacks)
NEXTAUTH_URL="http://localhost:3000"  # Development
NEXTAUTH_URL="https://your-app.com"   # Production
```

## Optional Environment Variables

### OAuth Providers

```bash
# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# GitHub OAuth
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# Discord OAuth
DISCORD_CLIENT_ID="your-discord-client-id"
DISCORD_CLIENT_SECRET="your-discord-client-secret"
```

### Google Cloud Services

```bash
# Google Cloud Project Configuration
GOOGLE_CLOUD_PROJECT_ID="your-project-id"
GOOGLE_CLOUD_BUCKET_NAME="your-storage-bucket"

# Service Account Authentication
GOOGLE_APPLICATION_CREDENTIALS="/path/to/service-account.json"
# OR as JSON string for containerized environments
GOOGLE_APPLICATION_CREDENTIALS='{"type":"service_account","project_id":"..."}'
```

### Email Services

```bash
# SMTP Configuration
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-specific-password"
SMTP_FROM="noreply@your-app.com"

# SendGrid Alternative
SENDGRID_API_KEY="your-sendgrid-api-key"

# Resend Alternative
RESEND_API_KEY="your-resend-api-key"
```

### Application Configuration

```bash
# Environment
NODE_ENV="development" | "production" | "test"

# Logging
LOG_LEVEL="debug" | "info" | "warn" | "error"

# Performance
NEXT_TELEMETRY_DISABLED="1"

# Security
ALLOWED_ORIGINS="https://your-app.com,https://www.your-app.com"
FORCE_HTTPS="true"
```

## Environment-Specific Configurations

### Development Environment

```bash
# .env.local (for local development overrides)
DATABASE_URL="postgresql://portfolio:portfolio@localhost:5432/portfolio_dev"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="dev-secret-key-not-for-production"

# Debug settings
DEBUG="true"
LOG_LEVEL="debug"
NEXT_TELEMETRY_DISABLED="1"

# Disable external services for development
DISABLE_EMAILS="true"
MOCK_STORAGE="true"

# Development OAuth (optional)
GOOGLE_CLIENT_ID="dev-google-client-id"
GOOGLE_CLIENT_SECRET="dev-google-client-secret"
```

### Staging Environment

```bash
# .env.staging
NODE_ENV="production"
DATABASE_URL="postgresql://staging_user:pass@staging-db:5432/portfolio_staging"
NEXTAUTH_URL="https://staging.your-app.com"
NEXTAUTH_SECRET="staging-secret-key-different-from-prod"

# Staging-specific settings
LOG_LEVEL="info"
ALLOWED_ORIGINS="https://staging.your-app.com"

# Use staging OAuth apps
GOOGLE_CLIENT_ID="staging-google-client-id"
GOOGLE_CLIENT_SECRET="staging-google-client-secret"

# Staging storage bucket
GOOGLE_CLOUD_BUCKET_NAME="your-app-staging-storage"
```

### Production Environment

```bash
# .env.production (or set in deployment platform)
NODE_ENV="production"
DATABASE_URL="postgresql://prod_user:secure_pass@prod-db:5432/portfolio_prod"
NEXTAUTH_URL="https://your-app.com"
NEXTAUTH_SECRET="super-secure-production-secret"

# Production settings
LOG_LEVEL="warn"
FORCE_HTTPS="true"
ALLOWED_ORIGINS="https://your-app.com,https://www.your-app.com"

# Production OAuth
GOOGLE_CLIENT_ID="prod-google-client-id"
GOOGLE_CLIENT_SECRET="prod-google-client-secret"

# Production storage
GOOGLE_CLOUD_BUCKET_NAME="your-app-production-storage"
GOOGLE_CLOUD_PROJECT_ID="your-production-project"
```

### Testing Environment

```bash
# .env.test
NODE_ENV="test"
DATABASE_URL="postgresql://test_user:test_pass@localhost:5432/portfolio_test"
NEXTAUTH_SECRET="test-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Disable external services in tests
DISABLE_EMAILS="true"
MOCK_STORAGE="true"
MOCK_AUTH="true"

# Test-specific settings
LOG_LEVEL="silent"
JEST_TIMEOUT="30000"
```

## Environment Validation

### Zod Schema Validation

```typescript
// src/server/lib/env.ts
import { z } from 'zod';

const envSchema = z.object({
  // Required
  DATABASE_URL: z.string().url('Invalid database URL'),
  NEXTAUTH_SECRET: z.string().min(32, 'NEXTAUTH_SECRET must be at least 32 characters'),
  NEXTAUTH_URL: z.string().url('Invalid NEXTAUTH_URL'),
  
  // Optional with defaults
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  
  // Optional
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GITHUB_CLIENT_ID: z.string().optional(),
  GITHUB_CLIENT_SECRET: z.string().optional(),
  GOOGLE_CLOUD_PROJECT_ID: z.string().optional(),
  GOOGLE_CLOUD_BUCKET_NAME: z.string().optional(),
  
  // Booleans
  DISABLE_EMAILS: z.string().transform(val => val === 'true').optional(),
  MOCK_STORAGE: z.string().transform(val => val === 'true').optional(),
});

export type Env = z.infer<typeof envSchema>;

export const env = envSchema.parse(process.env);
```

### Runtime Validation

```typescript
// src/server/lib/validateEnv.ts
export function validateEnvironment() {
  const errors: string[] = [];

  // Check required variables
  if (!process.env.DATABASE_URL) {
    errors.push('DATABASE_URL is required');
  }

  if (!process.env.NEXTAUTH_SECRET) {
    errors.push('NEXTAUTH_SECRET is required');
  }

  if (!process.env.NEXTAUTH_URL) {
    errors.push('NEXTAUTH_URL is required');
  }

  // Validate OAuth configuration
  const hasGoogleOAuth = process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET;
  const hasGitHubOAuth = process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET;
  
  if (!hasGoogleOAuth && !hasGitHubOAuth) {
    errors.push('At least one OAuth provider must be configured');
  }

  // Validate production settings
  if (process.env.NODE_ENV === 'production') {
    if (process.env.NEXTAUTH_SECRET === 'dev-secret-key-not-for-production') {
      errors.push('Production NEXTAUTH_SECRET must not be the development default');
    }
    
    if (!process.env.NEXTAUTH_URL?.startsWith('https://')) {
      errors.push('Production NEXTAUTH_URL must use HTTPS');
    }
  }

  if (errors.length > 0) {
    console.error('Environment validation failed:');
    errors.forEach(error => console.error(`  - ${error}`));
    process.exit(1);
  }
}
```

## Deployment Platform Configuration

### Vercel

```bash
# Via Vercel CLI
vercel env add NEXTAUTH_SECRET production
vercel env add DATABASE_URL production

# Via vercel.json
{
  "env": {
    "NEXTAUTH_SECRET": "@nextauth-secret",
    "DATABASE_URL": "@database-url"
  }
}
```

### Docker

```dockerfile
# Dockerfile environment defaults
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Runtime environment from secrets
ENV DATABASE_URL=""
ENV NEXTAUTH_SECRET=""
```

```yaml
# docker-compose.yml
services:
  app:
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - NEXTAUTH_URL=${NEXTAUTH_URL}
    env_file:
      - .env.docker
```

### Kubernetes

```yaml
# ConfigMap for non-sensitive data
apiVersion: v1
kind: ConfigMap
metadata:
  name: portfolio-config
data:
  NODE_ENV: "production"
  LOG_LEVEL: "info"
  NEXTAUTH_URL: "https://your-app.com"

---
# Secret for sensitive data
apiVersion: v1
kind: Secret
metadata:
  name: portfolio-secrets
type: Opaque
data:
  DATABASE_URL: <base64-encoded-url>
  NEXTAUTH_SECRET: <base64-encoded-secret>
```

```yaml
# Deployment using ConfigMap and Secret
apiVersion: apps/v1
kind: Deployment
metadata:
  name: portfolio
spec:
  template:
    spec:
      containers:
      - name: portfolio
        envFrom:
        - configMapRef:
            name: portfolio-config
        - secretRef:
            name: portfolio-secrets
```

### Google Cloud Run

```yaml
# cloud-run.yaml
apiVersion: serving.knative.dev/v1
kind: Service
metadata:
  name: portfolio
spec:
  template:
    metadata:
      annotations:
        run.googleapis.com/cloudsql-instances: project:region:instance
    spec:
      containers:
      - image: gcr.io/project/portfolio
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              key: database-url
              name: portfolio-secrets
        - name: NEXTAUTH_SECRET
          valueFrom:
            secretKeyRef:
              key: nextauth-secret
              name: portfolio-secrets
```

## Security Best Practices

### Secret Generation

```bash
# Generate secure NEXTAUTH_SECRET
openssl rand -base64 32

# Generate random passwords
openssl rand -base64 24

# Using Node.js crypto
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Secret Management

```bash
# Google Secret Manager
gcloud secrets create nextauth-secret --data-file=-
echo "your-secret-value" | gcloud secrets versions add nextauth-secret --data-file=-

# Kubernetes secrets
kubectl create secret generic portfolio-secrets \
  --from-literal=nextauth-secret="$(openssl rand -base64 32)" \
  --from-literal=database-url="postgresql://..."

# Sealed Secrets for GitOps
echo -n "your-secret" | kubectl create secret generic portfolio-secrets \
  --dry-run=client --from-file=nextauth-secret=/dev/stdin -o yaml | \
  kubeseal -o yaml > sealed-secret.yaml
```

### Environment Isolation

```bash
# Use different secrets per environment
NEXTAUTH_SECRET_DEV="dev-secret-$(openssl rand -base64 24)"
NEXTAUTH_SECRET_STAGING="staging-secret-$(openssl rand -base64 24)"
NEXTAUTH_SECRET_PROD="prod-secret-$(openssl rand -base64 24)"

# Use different OAuth apps per environment
GOOGLE_CLIENT_ID_DEV="dev-client-id"
GOOGLE_CLIENT_ID_STAGING="staging-client-id"
GOOGLE_CLIENT_ID_PROD="prod-client-id"
```

## Monitoring and Debugging

### Environment Health Check

```typescript
// src/app/api/env-check/route.ts (dev only)
import { NextResponse } from 'next/server';

export async function GET() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 404 });
  }

  const envStatus = {
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env.DATABASE_URL ? '✓ Set' : '✗ Missing',
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? '✓ Set' : '✗ Missing',
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || '✗ Missing',
    GOOGLE_OAUTH: process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET ? '✓ Configured' : '✗ Not configured',
    GITHUB_OAUTH: process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET ? '✓ Configured' : '✗ Not configured',
  };

  return NextResponse.json(envStatus);
}
```

### Debugging Commands

```bash
# Check environment variables in container
docker exec -it <container> env | grep -E "(DATABASE|NEXTAUTH|GOOGLE)"

# Verify Kubernetes secrets
kubectl get secret portfolio-secrets -o yaml
kubectl get secret portfolio-secrets -o jsonpath='{.data.nextauth-secret}' | base64 -d

# Test database connection
psql $DATABASE_URL -c "SELECT version();"

# Validate OAuth configuration
curl -s "https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=invalid" | jq .
```

## Troubleshooting

### Common Issues

1. **Authentication Loops**: Check NEXTAUTH_URL matches your domain exactly
2. **Database Connection Errors**: Verify DATABASE_URL format and connectivity
3. **OAuth Failures**: Confirm callback URLs match in provider settings
4. **CORS Errors**: Check ALLOWED_ORIGINS configuration
5. **Missing Secrets**: Verify all required environment variables are set

### Environment-Specific Debugging

```bash
# Development
echo "DATABASE_URL: $DATABASE_URL"
echo "NEXTAUTH_URL: $NEXTAUTH_URL"

# Production (be careful not to expose secrets)
node -e "console.log('DB Host:', new URL(process.env.DATABASE_URL).hostname)"
node -e "console.log('Auth URL:', process.env.NEXTAUTH_URL)"
```

For more deployment configurations, see [Docker Deployment](docker.md) and [Kubernetes Deployment](kubernetes.md).