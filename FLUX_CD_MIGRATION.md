# Flux CD Migration Guide

This document describes the migration from direct kubectl deployments to Flux CD GitOps-based deployments.

## Overview

Previously, this project used GitHub Actions to build Docker images and directly deploy them to Kubernetes clusters using `kubectl rollout restart`. Now, it uses Flux CD for GitOps-based deployments with automatic image updates.

## What Changed

### 1. GitHub Actions Workflow Updates
- **Image Tags**: Modified Docker image tagging to include timestamp-based tags for Flux CD image automation
- **Deployment Method**: Removed direct kubectl deployments, replaced with GitOps notifications
- **Tag Format**: Now generates tags like `main-abc123-1672531200` for automatic detection by Flux CD

### 2. Kubernetes Deployment Updates
- **Image Policy Annotation**: Added `# {"$imagepolicy": "flux-system:portfolio-image-policy"}` to deployment.yaml
- **Automated Updates**: Flux CD will automatically update this image reference when new images are detected

### 3. New Flux CD Components
- **GitRepository**: Monitors the GitHub repository for changes
- **ImageRepository**: Monitors the container registry for new images  
- **ImagePolicy**: Defines which images to select (timestamp-based sorting)
- **ImageUpdateAutomation**: Automatically commits image updates back to Git
- **Kustomizations**: Manages deployments to dev, staging, and prod environments

## Installation

### Step 1: Install Flux CD CLI (Local Development)
```bash
# macOS
brew install fluxcd/tap/flux

# Linux
curl -s https://fluxcd.io/install.sh | sudo bash

# Verify installation
flux version
```

### Step 2: Install Flux CD in Cluster
```bash
# Bootstrap Flux CD (this installs the controllers)
flux install --version=latest

# Verify installation
kubectl get pods -n flux-system
```

### Step 3: Create Required Secrets

#### GitHub Token Secret
Create a Personal Access Token with repo permissions and add it as a secret:
```bash
kubectl create secret generic github-token \
  --from-literal=username=your-github-username \
  --from-literal=password=your-github-token \
  --namespace=flux-system
```

#### GCP Registry Secret
Create a service account key for accessing Google Artifact Registry:
```bash
# Create service account key (JSON format)
gcloud iam service-accounts keys create key.json \
  --iam-account=your-service-account@project-id.iam.gserviceaccount.com

# Create the secret
kubectl create secret docker-registry gcp-gcr-token \
  --docker-server=us-central1-docker.pkg.dev \
  --docker-username=_json_key \
  --docker-password="$(cat key.json)" \
  --namespace=flux-system

# Clean up the key file
rm key.json
```

### Step 4: Apply Flux CD Manifests
```bash
# Apply the Flux CD components
kubectl apply -f k8s/flux-system/gotk-components.yaml
kubectl apply -f k8s/flux-system/kustomizations.yaml

# Verify resources are created
kubectl get gitrepository,imagerepository,imagepolicy,imageupdateautomation -n flux-system
kubectl get kustomization -n flux-system
```

## How It Works Now

### Image Build Process
1. **GitHub Actions**: Builds and pushes Docker images with timestamp-based tags
2. **Flux ImageRepository**: Monitors the registry every 1 minute for new images
3. **Flux ImagePolicy**: Selects the latest image based on timestamp extraction from tag
4. **Flux ImageUpdateAutomation**: Updates the deployment.yaml file with the new image tag
5. **Flux GitRepository**: Detects the updated manifests and syncs them to the cluster

### Deployment Pipeline
1. **Dev Environment**: Deploys immediately when changes are detected
2. **Staging Environment**: Deploys after dev is healthy (depends on portfolio-dev)
3. **Prod Environment**: Deploys after staging is healthy (depends on portfolio-staging)

### Branch-Based Deployments
- **develop branch** → **dev namespace**
- **staging branch** → **staging namespace** 
- **main branch** → **prod namespace**

## Monitoring and Troubleshooting

### Check Flux CD Status
```bash
# Overview of all Flux resources
flux get all

# Check specific resources
flux get sources git
flux get sources helm
flux get kustomizations
flux get images all

# Logs for troubleshooting
kubectl logs -n flux-system -l app=source-controller
kubectl logs -n flux-system -l app=kustomize-controller  
kubectl logs -n flux-system -l app=image-automation-controller
kubectl logs -n flux-system -l app=image-reflector-controller
```

### Manual Reconciliation
```bash
# Force reconciliation
flux reconcile source git portfolio-source
flux reconcile kustomization portfolio-dev
flux reconcile image repository portfolio-image-repo
flux reconcile image update portfolio-image-updates
```

### Check Image Updates
```bash
# See what images Flux has detected
kubectl describe imagerepository portfolio-image-repo -n flux-system
kubectl describe imagepolicy portfolio-image-policy -n flux-system
```

## Configuration Details

### Image Policy Pattern
The image policy uses this pattern to extract timestamps from tags:
```yaml
filterTags:
  pattern: '^main-[a-f0-9]+-(?P<ts>[0-9]+)$'
  extract: '$ts'
```

This matches tags like: `main-abc123-1672531200` and extracts `1672531200` for comparison.

### Reconciliation Intervals
- **GitRepository**: 1 minute (detects Git changes)
