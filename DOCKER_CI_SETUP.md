# Docker CI/CD Setup Guide

This guide explains how to configure the GitHub Actions workflow for building and pushing Docker images to Google Artifact Registry.

## Prerequisites

1. **Google Cloud Project**: Ensure you have access to the GCP project `kame-457417`
2. **Artifact Registry Repository**: The repository `kame-house-images` should exist in `us-central1-docker.pkg.dev`
3. **GitHub Repository Secrets**: Required secrets must be configured

## Required GitHub Secrets

You need to configure the following secrets in your GitHub repository settings (`Settings > Secrets and variables > Actions`):

### 1. GCP_SERVICE_ACCOUNT_KEY

Create a service account with the necessary permissions and generate a JSON key:

```bash
# Create a service account
gcloud iam service-accounts create github-actions-docker \
  --display-name="GitHub Actions Docker CI" \
  --description="Service account for GitHub Actions to push Docker images"

# Grant required permissions
gcloud projects add-iam-policy-binding kame-457417 \
  --member="serviceAccount:github-actions-docker@kame-457417.iam.gserviceaccount.com" \
  --role="roles/artifactregistry.writer"

# Generate and download the key
gcloud iam service-accounts keys create github-actions-key.json \
  --iam-account=github-actions-docker@kame-457417.iam.gserviceaccount.com
```

Then add the entire contents of `github-actions-key.json` as the `GCP_SERVICE_ACCOUNT_KEY` secret in GitHub.

### 2. DATABASE_URL (Optional)

If your Dockerfile requires a DATABASE_URL during build time, add it as a secret:

```
DATABASE_URL=postgresql://username:password@host:port/database
```

## Artifact Registry Setup

Ensure the Artifact Registry repository exists:

```bash
# Create the repository if it doesn't exist
gcloud artifacts repositories create kame-house-images \
  --repository-format=docker \
  --location=us-central1 \
  --description="Docker images for Kame House applications"

# Verify the repository exists
gcloud artifacts repositories list --location=us-central1
```

## Workflow Triggers

The Docker workflow will trigger on:

- **Push to main, develop, staging branches**: Builds and pushes images
- **Push of version tags (v*)**: Creates versioned releases
- **Pull requests to main**: Builds images but doesn't push (for testing)

## Image Tagging Strategy

The workflow automatically generates multiple tags:

### Branch-based Images
- `us-central1-docker.pkg.dev/kame-457417/kame-house-images/portfolio:main`
- `us-central1-docker.pkg.dev/kame-457417/kame-house-images/portfolio:develop`
- `us-central1-docker.pkg.dev/kame-457417/kame-house-images/portfolio:staging`
- `us-central1-docker.pkg.dev/kame-457417/kame-house-images/portfolio:latest` (main branch only)

### Commit-based Images
- `us-central1-docker.pkg.dev/kame-457417/kame-house-images/portfolio:abc1234` (commit SHA)

### Version-based Images (for tags like v1.2.3)
- `us-central1-docker.pkg.dev/kame-457417/kame-house-images/portfolio:v1.2.3`
- `us-central1-docker.pkg.dev/kame-457417/kame-house-images/portfolio:1.2.3`
- `us-central1-docker.pkg.dev/kame-457417/kame-house-images/portfolio:1.2`
- `us-central1-docker.pkg.dev/kame-457417/kame-house-images/portfolio:1`

## Using Built Images

### With kubectl
```bash
kubectl set image deployment/portfolio-deployment \
  portfolio=us-central1-docker.pkg.dev/kame-457417/kame-house-images/portfolio:abc1234
```

### With Kustomize
Add to your `kustomization.yaml`:

```yaml
images:
- name: portfolio
  newName: us-central1-docker.pkg.dev/kame-457417/kame-house-images/portfolio
  newTag: abc1234
```

## Deployment Artifacts

For main branch builds, the workflow generates a `deployment-info` artifact containing:
- The exact image tag built
- Commit information
- Sample Kubernetes deployment commands

Download this artifact from the Actions tab to get the exact image reference for deployment.

## Security Features

- **Non-root container**: Docker image runs as non-root user `nextjs`
- **Multi-stage build**: Minimizes final image size and attack surface
- **Build cache**: Uses GitHub Actions cache for faster builds
- **Image labels**: Includes metadata for tracking and auditing
- **Least privilege**: Service account has only necessary permissions

## Troubleshooting

### Authentication Issues
- Verify the service account key is properly formatted JSON
- Ensure the service account has `roles/artifactregistry.writer` permission
- Check that the Artifact Registry API is enabled in your project

### Build Failures
- Check that all required build args are provided
- Verify the Dockerfile builds successfully locally
- Review the workflow logs for specific error messages

### Permission Errors
- Ensure the repository exists in the correct region (`us-central1`)
- Verify the service account has access to the specific repository
- Check project-level IAM permissions

## Local Testing

To test the Docker build locally:

```bash
# Build the image
docker build -t portfolio:local .

# Run the container
docker run -p 3000:3000 portfolio:local
```

To test pushing to the registry locally:

```bash
# Authenticate with gcloud
gcloud auth configure-docker us-central1-docker.pkg.dev

# Tag and push
docker tag portfolio:local us-central1-docker.pkg.dev/kame-457417/kame-house-images/portfolio:test
docker push us-central1-docker.pkg.dev/kame-457417/kame-house-images/portfolio:test
