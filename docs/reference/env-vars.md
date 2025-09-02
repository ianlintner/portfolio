# Environment Variables Reference

Complete reference for all environment variables used in the Portfolio application.

## Required Variables

### Database

| Variable | Type | Description | Example |
|----------|------|-------------|---------|
| `DATABASE_URL` | `string` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/portfolio` |

**Formats:**
```bash
# Local development
DATABASE_URL="postgresql://portfolio:portfolio@localhost:5432/portfolio"

# Docker Compose
DATABASE_URL="postgresql://portfolio:portfolio@postgres:5432/portfolio"

# Google Cloud SQL with proxy
DATABASE_URL="postgresql://user:pass@localhost:5432/portfolio"

# Google Cloud SQL direct
DATABASE_URL="postgresql://user:pass@/portfolio?host=/cloudsql/project:region:instance"

# With SSL
DATABASE_URL="postgresql://user:pass@host:5432/portfolio?sslmode=require"

# With connection pooling
DATABASE_URL="postgresql://user:pass@pgbouncer:6543/portfolio"
```

### Authentication

| Variable | Type | Description | Example |
|----------|------|-------------|---------|
| `NEXTAUTH_SECRET` | `string` | Secret key for NextAuth.js (min 32 chars) | `your-super-secret-random-string` |
| `NEXTAUTH_URL` | `string` | Canonical URL of your site | `http://localhost:3000` |

**Generation:**
```bash
# Generate secure secret
openssl rand -base64 32

# Or using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## Optional Variables

### OAuth Providers

#### Google OAuth
| Variable | Type | Description | Required |
|----------|------|-------------|----------|
| `GOOGLE_CLIENT_ID` | `string` | Google OAuth client ID | Optional |
| `GOOGLE_CLIENT_SECRET` | `string` | Google OAuth client secret | Optional |

**Setup:**
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create OAuth 2.0 credentials
3. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (dev)
   - `https://your-app.com/api/auth/callback/google` (prod)

#### GitHub OAuth
| Variable | Type | Description | Required |
|----------|------|-------------|----------|
| `GITHUB_CLIENT_ID` | `string` | GitHub OAuth app client ID | Optional |
| `GITHUB_CLIENT_SECRET` | `string` | GitHub OAuth app client secret | Optional |

**Setup:**
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create new OAuth App
3. Set Authorization callback URL:
   - `http://localhost:3000/api/auth/callback/github` (dev)
   - `https://your-app.com/api/auth/callback/github` (prod)

#### Discord OAuth
| Variable | Type | Description | Required |
|----------|------|-------------|----------|
| `DISCORD_CLIENT_ID` | `string` | Discord application client ID | Optional |
| `DISCORD_CLIENT_SECRET` | `string` | Discord application client secret | Optional |

**Setup:**
1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create new application
3. Add redirect URL in OAuth2 settings:
   - `http://localhost:3000/api/auth/callback/discord` (dev)
   - `https://your-app.com/api/auth/callback/discord` (prod)

### Google Cloud Services

| Variable | Type | Description | Required |
|----------|------|-------------|----------|
| `GOOGLE_CLOUD_PROJECT_ID` | `string` | Google Cloud project ID | For GCS |
| `GOOGLE_CLOUD_BUCKET_NAME` | `string` | GCS bucket name for file uploads | For GCS |
| `GOOGLE_APPLICATION_CREDENTIALS` | `string` | Path to service account JSON or JSON string | For GCS |

**Service Account JSON:**
```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "key-id",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "service-account@project.iam.gserviceaccount.com",
  "client_id": "client-id",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token"
}
```

### Email Services

#### SMTP Configuration
| Variable | Type | Description | Default |
|----------|------|-------------|---------|
| `SMTP_HOST` | `string` | SMTP server hostname | - |
| `SMTP_PORT` | `number` | SMTP server port | `587` |
| `SMTP_USER` | `string` | SMTP username/email | - |
| `SMTP_PASS` | `string` | SMTP password/app password | - |
| `SMTP_FROM` | `string` | From email address | - |
| `SMTP_SECURE` | `boolean` | Use TLS/SSL | `false` |

#### SendGrid
| Variable | Type | Description |
|----------|------|-------------|
| `SENDGRID_API_KEY` | `string` | SendGrid API key |
| `SENDGRID_FROM` | `string` | From email address |

#### Resend
| Variable | Type | Description |
|----------|------|-------------|
| `RESEND_API_KEY` | `string` | Resend API key |
| `RESEND_FROM` | `string` | From email address |

### Application Configuration

| Variable | Type | Description | Default |
|----------|------|-------------|---------|
| `NODE_ENV` | `string` | Node.js environment | `development` |
| `PORT` | `number` | Server port | `3000` |
| `HOSTNAME` | `string` | Server hostname | `localhost` |
| `LOG_LEVEL` | `string` | Logging level | `info` |

**Valid values:**
- `NODE_ENV`: `development`, `production`, `test`
- `LOG_LEVEL`: `debug`, `info`, `warn`, `error`, `silent`

### Security and Performance

| Variable | Type | Description | Default |
|----------|------|-------------|---------|
| `NEXTAUTH_SECRET` | `string` | NextAuth.js secret | Required |
| `ALLOWED_ORIGINS` | `string` | Comma-separated allowed origins | - |
| `FORCE_HTTPS` | `boolean` | Force HTTPS redirects | `false` |
| `RATE_LIMIT_MAX` | `number` | Max requests per window | `100` |
| `RATE_LIMIT_WINDOW` | `number` | Rate limit window (ms) | `60000` |

### Development and Testing

| Variable | Type | Description | Default |
|----------|------|-------------|---------|
| `DEBUG` | `boolean` | Enable debug mode | `false` |
| `DISABLE_EMAILS` | `boolean` | Disable email sending | `false` |
| `MOCK_STORAGE` | `boolean` | Mock file storage | `false` |
| `MOCK_AUTH` | `boolean` | Mock authentication | `false` |
| `NEXT_TELEMETRY_DISABLED` | `boolean` | Disable Next.js telemetry | `false` |

### Build and Deployment

| Variable | Type | Description | Default |
|----------|------|-------------|---------|
| `ANALYZE` | `boolean` | Enable bundle analyzer | `false` |
| `SENTRY_DSN` | `string` | Sentry error tracking DSN | - |
| `VERCEL_URL` | `string` | Vercel deployment URL | Auto-set |
| `DATABASE_POOL_SIZE` | `number` | Database connection pool size | `10` |

## Environment-Specific Examples

### Development (.env.local)

```bash
# Database
DATABASE_URL="postgresql://portfolio:portfolio@localhost:5432/portfolio_dev"

# Auth
NEXTAUTH_SECRET="dev-secret-key-not-for-production"
NEXTAUTH_URL="http://localhost:3000"

# Development settings
NODE_ENV="development"
DEBUG="true"
LOG_LEVEL="debug"
NEXT_TELEMETRY_DISABLED="1"

# Optional: OAuth for testing
GOOGLE_CLIENT_ID="dev-google-client-id"
GOOGLE_CLIENT_SECRET="dev-google-client-secret"

# Development overrides
DISABLE_EMAILS="true"
MOCK_STORAGE="true"
```

### Staging (.env.staging)

```bash
# Database
DATABASE_URL="postgresql://staging_user:secure_pass@staging-db:5432/portfolio_staging"

# Auth
NEXTAUTH_SECRET="staging-secret-different-from-prod"
NEXTAUTH_URL="https://staging.your-app.com"

# Environment
NODE_ENV="production"
LOG_LEVEL="info"

# OAuth
GOOGLE_CLIENT_ID="staging-google-client-id"
GOOGLE_CLIENT_SECRET="staging-google-client-secret"

# GCS
GOOGLE_CLOUD_PROJECT_ID="your-staging-project"
GOOGLE_CLOUD_BUCKET_NAME="your-app-staging-storage"

# Security
ALLOWED_ORIGINS="https://staging.your-app.com"
FORCE_HTTPS="true"
```

### Production (.env.production)

```bash
# Database
DATABASE_URL="postgresql://prod_user:ultra_secure_pass@prod-db:5432/portfolio_prod"

# Auth
NEXTAUTH_SECRET="super-secure-production-secret-key"
NEXTAUTH_URL="https://your-app.com"

# Environment
NODE_ENV="production"
LOG_LEVEL="warn"

# OAuth
GOOGLE_CLIENT_ID="prod-google-client-id"
GOOGLE_CLIENT_SECRET="prod-google-client-secret"
GITHUB_CLIENT_ID="prod-github-client-id"
GITHUB_CLIENT_SECRET="prod-github-client-secret"

# GCS
GOOGLE_CLOUD_PROJECT_ID="your-production-project"
GOOGLE_CLOUD_BUCKET_NAME="your-app-production-storage"
GOOGLE_APPLICATION_CREDENTIALS="/app/service-account.json"

# Email
SENDGRID_API_KEY="your-sendgrid-api-key"
SENDGRID_FROM="noreply@your-app.com"

# Security
ALLOWED_ORIGINS="https://your-app.com,https://www.your-app.com"
FORCE_HTTPS="true"
RATE_LIMIT_MAX="1000"

# Monitoring
SENTRY_DSN="https://your-sentry-dsn"
```

### Testing (.env.test)

```bash
# Database
DATABASE_URL="postgresql://test_user:test_pass@localhost:5432/portfolio_test"

# Auth
NEXTAUTH_SECRET="test-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Environment
NODE_ENV="test"
LOG_LEVEL="silent"

# Disable external services
DISABLE_EMAILS="true"
MOCK_STORAGE="true"
MOCK_AUTH="true"

# Test settings
JEST_TIMEOUT="30000"
PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD="1"
```

## Validation Schema

### Runtime Validation

```typescript
import { z } from 'zod';

const envSchema = z.object({
  // Required
  DATABASE_URL: z.string().url('Invalid DATABASE_URL'),
  NEXTAUTH_SECRET: z.string().min(32, 'NEXTAUTH_SECRET must be at least 32 characters'),
  NEXTAUTH_URL: z.string().url('Invalid NEXTAUTH_URL'),

  // Optional with defaults
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3000),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error', 'silent']).default('info'),

  // OAuth (optional)
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GITHUB_CLIENT_ID: z.string().optional(),
  GITHUB_CLIENT_SECRET: z.string().optional(),
  DISCORD_CLIENT_ID: z.string().optional(),
  DISCORD_CLIENT_SECRET: z.string().optional(),

  // GCS (optional)
  GOOGLE_CLOUD_PROJECT_ID: z.string().optional(),
  GOOGLE_CLOUD_BUCKET_NAME: z.string().optional(),
  GOOGLE_APPLICATION_CREDENTIALS: z.string().optional(),

  // Email (optional)
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().default(587),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_FROM: z.string().email().optional(),
  SENDGRID_API_KEY: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),

  // Booleans
  DEBUG: z.string().transform(val => val === 'true').optional(),
  DISABLE_EMAILS: z.string().transform(val => val === 'true').optional(),
  MOCK_STORAGE: z.string().transform(val => val === 'true').optional(),
  FORCE_HTTPS: z.string().transform(val => val === 'true').optional(),
});

export type Env = z.infer<typeof envSchema>;
export const env = envSchema.parse(process.env);
```

### Custom Validation

```typescript
export function validateEnvironment() {
  const errors: string[] = [];

  // Check OAuth configuration
  const hasGoogleOAuth = process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET;
  const hasGitHubOAuth = process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET;
  const hasDiscordOAuth = process.env.DISCORD_CLIENT_ID && process.env.DISCORD_CLIENT_SECRET;

  if (!hasGoogleOAuth && !hasGitHubOAuth && !hasDiscordOAuth) {
    errors.push('At least one OAuth provider must be configured');
  }

  // Production-specific validations
  if (process.env.NODE_ENV === 'production') {
    if (!process.env.NEXTAUTH_URL?.startsWith('https://')) {
      errors.push('NEXTAUTH_URL must use HTTPS in production');
    }

    if (process.env.NEXTAUTH_SECRET === 'dev-secret-key-not-for-production') {
      errors.push('Production NEXTAUTH_SECRET must not be the development default');
    }

    if (!process.env.ALLOWED_ORIGINS) {
      errors.push('ALLOWED_ORIGINS should be set in production');
    }
  }

  // GCS configuration
  if (process.env.GOOGLE_CLOUD_BUCKET_NAME && !process.env.GOOGLE_CLOUD_PROJECT_ID) {
    errors.push('GOOGLE_CLOUD_PROJECT_ID is required when using GCS');
  }

  // Email configuration
  const hasSmtp = process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS;
  const hasSendGrid = process.env.SENDGRID_API_KEY;
  const hasResend = process.env.RESEND_API_KEY;

  if (!hasSmtp && !hasSendGrid && !hasResend && !process.env.DISABLE_EMAILS) {
    console.warn('No email service configured. Email features will not work.');
  }

  if (errors.length > 0) {
    console.error('Environment validation failed:');
    errors.forEach(error => console.error(`  - ${error}`));
    process.exit(1);
  }
}
```

## Docker Configuration

### Dockerfile ENV

```dockerfile
# Set production defaults
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Runtime environment variables (set via docker run or docker-compose)
ENV DATABASE_URL=""
ENV NEXTAUTH_SECRET=""
ENV NEXTAUTH_URL=""
```

### Docker Compose

```yaml
services:
  app:
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - NEXTAUTH_URL=${NEXTAUTH_URL}
      - GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}
      - GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET}
    env_file:
      - .env.docker
```

## Kubernetes Configuration

### ConfigMap (Non-sensitive)

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: portfolio-config
data:
  NODE_ENV: "production"
  LOG_LEVEL: "info"
  NEXTAUTH_URL: "https://your-app.com"
  FORCE_HTTPS: "true"
  ALLOWED_ORIGINS: "https://your-app.com,https://www.your-app.com"
```

### Secret (Sensitive)

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: portfolio-secrets
type: Opaque
data:
  DATABASE_URL: <base64-encoded-url>
  NEXTAUTH_SECRET: <base64-encoded-secret>
  GOOGLE_CLIENT_SECRET: <base64-encoded-secret>
  SENDGRID_API_KEY: <base64-encoded-key>
```

### Deployment Usage

```yaml
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
        env:
        - name: GOOGLE_APPLICATION_CREDENTIALS
          value: "/app/service-account.json"
```

## Security Best Practices

### Secret Management

1. **Never commit secrets** to version control
2. **Use different secrets** for each environment
3. **Rotate secrets regularly**, especially in production
4. **Use strong, random values** for all secrets
5. **Store secrets securely** using proper secret management tools

### Environment Isolation

```bash
# Use prefixes for environment-specific secrets
NEXTAUTH_SECRET_DEV="dev-secret-$(openssl rand -base64 24)"
NEXTAUTH_SECRET_STAGING="staging-secret-$(openssl rand -base64 24)"
NEXTAUTH_SECRET_PROD="prod-secret-$(openssl rand -base64 24)"
```

### Validation

1. **Validate at startup** to catch configuration errors early
2. **Use type-safe validation** with libraries like Zod
3. **Fail fast** if required variables are missing
4. **Log validation errors** clearly for debugging

For more environment configuration examples, see the [Configuration Guide](../getting-started/configuration.md) and [Deployment Environment Setup](../deployment/environment.md).