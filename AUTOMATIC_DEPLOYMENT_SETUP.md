# Automatic Deployment Setup

## Overview

Your GitHub Actions workflow now automatically deploys to Kubernetes environments after building and pushing Docker images. This document explains the required setup and secrets.

## Automatic Deployment Flow

### Branch-to-Environment Mapping

- **`main` branch** → **Production** environment (`prod` namespace)
- **`staging` branch** → **Staging** environment (`staging` namespace)
- **`develop` branch** → **Development** environment (`dev` namespace)

### What Happens Automatically

1. Code is pushed to `main`, `staging`, or `develop` branch
2. Docker image is built and pushed to Google Artifact Registry
3. Deployment is automatically restarted in the corresponding environment
4. Workflow waits for rollout to complete (5 minute timeout)
5. Pod status is verified and reported

## Required GitHub Secrets

You need to configure these secrets in your GitHub repository settings:

### Existing Secrets

- `GCP_SERVICE_ACCOUNT_KEY` - Already configured for Docker builds
- `DATABASE_URL` - Already configured for builds

### New Required Secrets

- `GKE_CLUSTER_NAME` - Name of your GKE cluster
- `GKE_CLUSTER_ZONE` - Zone where your GKE cluster is located

## Setting Up the Secrets

### 1. Find Your Cluster Information

```bash
# List your clusters to find the name and zone
gcloud container clusters list --project=kame-457417
```

### 2. Add Secrets to GitHub

Go to your repository → Settings → Secrets and variables → Actions

Add these repository secrets:

- **`GKE_CLUSTER_NAME`**: Your cluster name (e.g., `portfolio-cluster`)
- **`GKE_CLUSTER_ZONE`**: Your cluster zone (e.g., `us-central1-a`)

## Service Account Permissions

Ensure your service account (`GCP_SERVICE_ACCOUNT_KEY`) has these IAM roles:

- `roles/container.developer` - To access GKE clusters
- `roles/artifactregistry.writer` - To push Docker images (already configured)

## Workflow Behavior

### Successful Deployment

- ✅ Image built and pushed
- ✅ Deployment restarted
- ✅ Rollout completed successfully
- ✅ Pod status verified

### Branch Protection

- Only `main`, `staging`, and `develop` trigger deployments
- Pull requests build images but don't deploy
- Other branches build images but don't deploy

### Timeout and Error Handling

- Deployment rollout timeout: 5 minutes
- Failed deployments will fail the workflow
- Successful builds with failed deployments will show which step failed

## Verification Commands

After setup, you can verify deployments:

```bash
# Check deployment status
kubectl rollout status deployment/portfolio -n prod
kubectl rollout status deployment/portfolio -n staging
kubectl rollout status deployment/portfolio -n dev

# View pods
kubectl get pods -n prod -l app=portfolio
kubectl get pods -n staging -l app=portfolio
kubectl get pods -n dev -l app=portfolio
```

## Benefits

✅ **Zero-click deployments** - Push code, get deployed automatically
✅ **Environment parity** - Same process for all environments  
✅ **Fast updates** - No waiting for manual deployment
✅ **Visibility** - Deployment status in GitHub Actions
✅ **Rollback ready** - Standard Kubernetes rollout capabilities

## Rollback Process

If you need to rollback a deployment:

```bash
# Rollback to previous version
kubectl rollout undo deployment/portfolio -n prod
kubectl rollout undo deployment/portfolio -n staging
kubectl rollout undo deployment/portfolio -n dev

# Rollback to specific revision
kubectl rollout undo deployment/portfolio --to-revision=2 -n prod
```

## Monitoring

- GitHub Actions will show deployment status
- Kubernetes events will be logged
- Failed deployments will fail the workflow
- Successful deployments will be confirmed in the workflow summary
