# Pod Image Pull Policy Configuration

## Overview

This document explains how your Kubernetes pods are configured to always pull the latest images and regularly check for updates.

## Current Configuration

### Image Pull Policy

All containers in your portfolio deployment are configured with `imagePullPolicy: Always`:

1. **Main portfolio container**: Always pulls the latest image from `us-central1-docker.pkg.dev/kame-457417/kame-house-images/portfolio:latest`
2. **CloudSQL proxy sidecar**: Always pulls the latest image from `gcr.io/cloud-sql-connectors/cloud-sql-proxy:2.8.0`

### What This Means

- **Fresh Images**: Every time a pod starts or restarts, Kubernetes will pull the latest version of the image from the registry
- **Automatic Updates**: When you push new code and your CI/CD pipeline builds a new image, the next pod restart will use that new image
- **Consistent Behavior**: This applies across all environments (dev, staging, prod)

## How It Works

### 1. Image Pull Policy Settings

Located in `k8s/apps/portfolio/base/deployment.yaml`:

```yaml
containers:
  - name: portfolio
    image: us-central1-docker.pkg.dev/kame-457417/kame-house-images/portfolio:latest
    imagePullPolicy: Always # ✅ Always pull latest

  - name: cloudsql-proxy
    image: gcr.io/cloud-sql-connectors/cloud-sql-proxy:2.8.0
    imagePullPolicy: Always # ✅ Always pull latest
```

### 2. Image Tag Strategy

Your images use the `:latest` tag, which combined with `imagePullPolicy: Always` ensures you get the most recent build.

### 3. Registry Authentication

- Images are stored in Google Artifact Registry
- Pods authenticate using `imagePullSecrets` with the `regcred` secret
- CI/CD pipeline pushes new images automatically on code changes

## Triggering Updates

### Automatic Updates

Pods will pull latest images when they:

- Start for the first time
- Restart due to failure
- Are manually restarted
- Are recreated during deployment updates

### Manual Updates

To force pods to pull new images immediately:

```bash
# Restart all pods in dev environment
kubectl rollout restart deployment/portfolio -n dev

# Restart all pods in staging environment
kubectl rollout restart deployment/portfolio -n staging

# Restart all pods in production environment
kubectl rollout restart deployment/portfolio -n prod
```

### CI/CD Integration

Your GitHub Actions workflow automatically:

1. Builds new Docker images when code is pushed
2. Pushes images to Artifact Registry with `:latest` tag
3. Images become available for the next pod restart

## Environment Consistency

This configuration is applied consistently across all environments:

- **Development** (`dev` namespace)
- **Staging** (`staging` namespace)
- **Production** (`prod` namespace)

All environments inherit the base configuration from `k8s/apps/portfolio/base/deployment.yaml`.

## Verification Commands

To verify the configuration:

```bash
# Check that imagePullPolicy is set correctly
kubectl kustomize k8s/apps/portfolio/overlays/dev | grep -A2 -B2 "imagePullPolicy"
kubectl kustomize k8s/apps/portfolio/overlays/staging | grep -A2 -B2 "imagePullPolicy"
kubectl kustomize k8s/apps/portfolio/overlays/prod | grep -A2 -B2 "imagePullPolicy"

# Validate manifests can be applied
kubectl apply --dry-run=client -k k8s/apps/portfolio/overlays/dev
kubectl apply --dry-run=client -k k8s/apps/portfolio/overlays/staging
kubectl apply --dry-run=client -k k8s/apps/portfolio/overlays/prod
```

## Benefits

✅ **Always Fresh**: Pods always run the latest version of your code
✅ **Zero Configuration**: No manual intervention needed for updates
✅ **Consistent**: Same behavior across all environments
✅ **Reliable**: Combines with health checks to ensure smooth deployments
✅ **CI/CD Ready**: Works seamlessly with your automated build pipeline

## Important Notes

- Pods will only pull new images when they restart, not while running
- For immediate updates, manually restart the deployment using `kubectl rollout restart`
- The `:latest` tag strategy works well for continuous deployment workflows
- All environments are configured identically for consistency
