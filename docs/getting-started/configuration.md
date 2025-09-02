# Configuration Guide

This guide covers all configuration options for the Portfolio application, including environment variables, external services, and deployment settings.

## Environment Variables

The application uses environment variables for configuration. Copy `.env.example` to `.env` and configure the following variables:

### Required Variables

#### Database Configuration
```bash
# PostgreSQL connection string
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
```

**Examples:**
```bash
# Local development
DATABASE_URL="postgresql://portfolio:portfolio@localhost:5432/portfolio"

# Docker container
DATABASE_URL="postgresql://portfolio:portfolio@postgres:5432/portfolio"

# Production (Google Cloud SQL)
DATABASE_URL="postgresql://user:pass@/db?host=/cloudsql/project:region:instance"
```

#### NextAuth.js Configuration
```bash
# Required for session encryption
NEXTAUTH_SECRET="your-super-secret-random-string-here"

# Application URL (important for OAuth callbacks)
NEXTAUTH_URL="http://localhost:3000"  # Development
NEXTAUTH_URL="https://yourapp.com"    # Production
```

!!! warning "NEXTAUTH_SECRET Security"
    Use a strong, random string for `NEXTAUTH_SECRET`. Generate one with:
    ```bash
    openssl rand -base64 32
    ```

### Optional Variables

#### Google Cloud Storage
For file uploads and storage:

```bash
# Google Cloud Project ID
GOOGLE_CLOUD_PROJECT_ID="your-project-id"

# Storage bucket name
GOOGLE_CLOUD_BUCKET_NAME="your-bucket-name"

# Service account credentials (path or JSON)
GOOGLE_APPLICATION_CREDENTIALS="/path/to/service-account.json"
# OR as JSON string
GOOGLE_APPLICATION_CREDENTIALS='{"type":"service_account",...}'
```

#### OAuth Providers

=== "Google OAuth"
    ```bash
    GOOGLE_CLIENT_ID="your-google-client-id.googleusercontent.com"
    GOOGLE_CLIENT_SECRET="your-google-client-secret"
    ```
    
    Setup instructions:
    1. Go to [Google Cloud Console](https://console.cloud.google.com)
    2. Create OAuth 2.0 credentials
    3. Add authorized redirect URIs:
       - `http://localhost:3000/api/auth/callback/google` (development)
       - `https://yourapp.com/api/auth/callback/google` (production)

=== "GitHub OAuth"
    ```bash
    GITHUB_CLIENT_ID="your-github-client-id"
    GITHUB_CLIENT_SECRET="your-github-client-secret"
    ```
    
    Setup instructions:
    1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
    2. Create a new OAuth App
    3. Set Authorization callback URL:
       - `http://localhost:3000/api/auth/callback/github` (development)
       - `https://yourapp.com/api/auth/callback/github` (production)

=== "Discord OAuth"
    ```bash
    DISCORD_CLIENT_ID="your-discord-client-id"
    DISCORD_CLIENT_SECRET="your-discord-client-secret"
    ```
    
    Setup instructions:
    1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
    2. Create a new application
    3. Add redirect URL in OAuth2 settings:
       - `http://localhost:3000/api/auth/callback/discord` (development)
       - `https://yourapp.com/api/auth/callback/discord` (production)

#### Email Configuration (Optional)
For notifications and transactional emails:

```bash
# SMTP Configuration
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
SMTP_FROM="noreply@yourapp.com"

# SendGrid (Alternative)
SENDGRID_API_KEY="your-sendgrid-api-key"

# Resend (Alternative)
RESEND_API_KEY="your-resend-api-key"
```

## Environment-Specific Configuration

### Development Environment

Create `.env.local` for development-specific overrides:

```bash
# Development database
DATABASE_URL="postgresql://portfolio:portfolio@localhost:5432/portfolio_dev"

# Development URLs
NEXTAUTH_URL="http://localhost:3000"

# Debug settings
DEBUG="true"
LOG_LEVEL="debug"

# Disable external services for development
DISABLE_EMAILS="true"
MOCK_STORAGE="true"
```

### Production Environment

Production environment variables should be set in your deployment platform:

```bash
# Production database (example: Google Cloud SQL)
DATABASE_URL="postgresql://user:pass@/portfolio?host=/cloudsql/project:region:instance"

# Production URL
NEXTAUTH_URL="https://your-portfolio.com"

# Production settings
NODE_ENV="production"
LOG_LEVEL="info"

# Security headers
ALLOWED_ORIGINS="https://your-portfolio.com,https://www.your-portfolio.com"
```

### Testing Environment

For running tests:

```bash
# Test database
DATABASE_URL="postgresql://portfolio:portfolio@localhost:5432/portfolio_test"

# Test settings
NODE_ENV="test"
NEXTAUTH_SECRET="test-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

## Configuration Files

### Next.js Configuration (`next.config.js`)

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable App Router
  experimental: {
    appDir: true,
  },
  
  // Image optimization
  images: {
    domains: [
      'storage.googleapis.com',  // Google Cloud Storage
      'avatars.githubusercontent.com',  // GitHub avatars
      'cdn.discordapp.com',  // Discord avatars
    ],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
  
  // Environment variable validation
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
};

module.exports = nextConfig;
```

### TypeScript Configuration (`tsconfig.json`)

Key configuration for optimal development experience:

```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/server/*": ["./src/server/*"],
      "@/types/*": ["./src/types/*"],
      "@/utils/*": ["./src/utils/*"]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts"
  ],
  "exclude": ["node_modules"]
}
```

### Prisma Configuration (`prisma/schema.prisma`)

Database configuration and schema:

```prisma
// Prisma schema configuration
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Enable preview features if needed
generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["jsonProtocol"]
}
```

## External Service Configuration

### Google Cloud Storage Setup

1. **Create a Google Cloud Project**:
   ```bash
   gcloud projects create your-project-id
   gcloud config set project your-project-id
   ```

2. **Enable required APIs**:
   ```bash
   gcloud services enable storage-api.googleapis.com
   gcloud services enable iam.googleapis.com
   ```

3. **Create a storage bucket**:
   ```bash
   gsutil mb gs://your-bucket-name
   gsutil uniformbucketlevelaccess set on gs://your-bucket-name
   ```

4. **Create a service account**:
   ```bash
   gcloud iam service-accounts create portfolio-storage \
     --display-name="Portfolio Storage Service Account"
   
   gcloud projects add-iam-policy-binding your-project-id \
     --member="serviceAccount:portfolio-storage@your-project-id.iam.gserviceaccount.com" \
     --role="roles/storage.admin"
   
   gcloud iam service-accounts keys create service-account.json \
     --iam-account=portfolio-storage@your-project-id.iam.gserviceaccount.com
   ```

### Database Setup

#### Local PostgreSQL
```bash
# Install PostgreSQL
sudo apt install postgresql postgresql-contrib  # Ubuntu
brew install postgresql  # macOS

# Create database and user
sudo -u postgres createuser --interactive portfolio
sudo -u postgres createdb portfolio
```

#### Google Cloud SQL
```bash
# Create Cloud SQL instance
gcloud sql instances create portfolio-db \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region=us-central1

# Create database
gcloud sql databases create portfolio --instance=portfolio-db

# Create user
gcloud sql users create portfolio \
  --instance=portfolio-db \
  --password=your-secure-password
```

## Configuration Validation

### Environment Validation Schema

The application validates environment variables at startup using Zod:

```typescript
// src/server/lib/env.ts
import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(32),
  NEXTAUTH_URL: z.string().url(),
  GOOGLE_CLOUD_PROJECT_ID: z.string().optional(),
  GOOGLE_CLOUD_BUCKET_NAME: z.string().optional(),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

export const env = envSchema.parse(process.env);
```

### Configuration Testing

Test your configuration:

```bash
# Test database connection
pnpm db:push

# Test application startup
pnpm build
pnpm start

# Test API endpoints
curl http://localhost:3000/api/health

# Test authentication
curl http://localhost:3000/api/auth/session
```

## Security Considerations

### Secrets Management

!!! danger "Never commit secrets"
    - Add `.env*` to `.gitignore`
    - Use different secrets for each environment
    - Rotate secrets regularly
    - Use strong, random values

### Production Security

```bash
# Use strong secrets
NEXTAUTH_SECRET=$(openssl rand -base64 32)

# Restrict CORS origins
ALLOWED_ORIGINS="https://yourapp.com"

# Enable security headers
SECURITY_HEADERS="true"

# Use HTTPS only
FORCE_HTTPS="true"
```

## Troubleshooting

### Common Configuration Issues

1. **Database Connection Errors**:
   ```bash
   # Check DATABASE_URL format
   echo $DATABASE_URL
   
   # Test connection
   psql $DATABASE_URL -c "SELECT version();"
   ```

2. **NextAuth Errors**:
   ```bash
   # Check NEXTAUTH_SECRET is set
   echo $NEXTAUTH_SECRET | wc -c  # Should be > 32
   
   # Verify NEXTAUTH_URL matches your domain
   echo $NEXTAUTH_URL
   ```

3. **OAuth Configuration**:
   - Verify client IDs and secrets
   - Check redirect URIs match exactly
   - Ensure applications are enabled

4. **File Upload Issues**:
   ```bash
   # Test GCS credentials
   gcloud auth application-default print-access-token
   
   # Check bucket permissions
   gsutil ls gs://your-bucket-name
   ```

## Configuration Best Practices

1. **Use Environment-Specific Files**:
   - `.env.local` for development
   - `.env.production` for production builds
   - `.env.test` for testing

2. **Validate Configuration Early**:
   - Use Zod schemas for validation
   - Fail fast on missing required variables
   - Provide helpful error messages

3. **Document All Variables**:
   - Keep `.env.example` updated
   - Document purpose and format
   - Provide example values

4. **Security First**:
   - Use different secrets per environment
   - Implement least-privilege access
   - Regularly audit and rotate secrets

## Next Steps

- Review [Database Configuration](database.md) for Prisma setup
- Check [Deployment Guide](../deployment/environment.md) for production configuration
- See [API Documentation](api.md) for tRPC configuration