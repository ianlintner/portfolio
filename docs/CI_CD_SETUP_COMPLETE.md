# CI/CD Setup Complete

## Overview

The CI/CD pipeline has been successfully configured to automatically build, push Docker images to Azure Container Registry, and deploy to AKS when code is merged to the `main` branch.

## Pipeline Workflow

### On Pull Request or Push to `main`/`develop`/`staging`:

1. **Quality Checks** (parallel execution)
   - Lint (ESLint)
   - Format check (Prettier)
   - Tests (Jest)

2. **Build**
   - Install dependencies (pnpm)
   - Build documentation (mkdocs)
   - Build Next.js application
   - Upload build artifacts

### On Push to `main` branch only:

3. **Docker Build & Push**
   - Build multi-platform Docker image (linux/amd64, linux/arm64)
   - Push to Azure Container Registry: `gabby.azurecr.io`
   - Tag with:
     - `latest`
     - Commit SHA (e.g., `abc1234`)
     - Timestamped tag (e.g., `main-abc1234-1234567890`)
   - Run Trivy security scan
   - Upload scan results to GitHub Security

4. **Deploy to AKS**
   - Login to Azure using OIDC
   - Get AKS credentials
   - Update deployment with new image
   - Wait for rollout to complete (10 minute timeout)
   - Verify pods are running

## GitHub Configuration

### Secrets (configured by [`scripts/setup-github-cicd.sh`](https://github.com/ianlintner/portfolio/blob/main/scripts/setup-github-cicd.sh))

- `AZURE_CLIENT_ID` - Service principal application ID
- `AZURE_TENANT_ID` - Azure AD tenant ID
- `AZURE_SUBSCRIPTION_ID` - Azure subscription ID

### Variables (configured by [`scripts/setup-github-cicd.sh`](https://github.com/ianlintner/portfolio/blob/main/scripts/setup-github-cicd.sh))

- `AZURE_REGISTRY_NAME` = `gabby`
- `AKS_CLUSTER_NAME` = `bigboy`
- `AKS_RESOURCE_GROUP` = `nekoc`
- `DEPLOY_NAMESPACE` = `default`

## Azure Resources

### Service Principal

- **Name**: `portfolio-github-actions`
- **Authentication**: Federated credential (OIDC) for GitHub Actions
- **Permissions**:
  - Contributor on resource group `nekoc`
  - AcrPush on `gabby.azurecr.io`
  - Azure Kubernetes Service Cluster User Role on `bigboy` cluster

### Container Registry

- **Registry**: `gabby.azurecr.io`
- **Resource Group**: `nekoc`
- **Images**: `portfolio` with multiple tags

### AKS Cluster

- **Name**: `bigboy`
- **Resource Group**: `nekoc`
- **Namespace**: `default`
- **Deployment**: `portfolio`

## Usage

### Automatic Deployment

Simply merge code to the `main` branch:

```bash
git checkout main
git merge feature-branch
git push origin main
```

The CI/CD pipeline will automatically:

1. Run all quality checks
2. Build the application
3. Build and push Docker image
4. Deploy to AKS cluster

### Monitor Deployment

Watch the GitHub Actions workflow:

```bash
gh run watch
```

Or view in browser:

```
https://github.com/ianlintner/portfolio/actions
```

### Verify Deployment

Check pods in the cluster:

```bash
# Get AKS credentials
az aks get-credentials --resource-group nekoc --name bigboy

# Check pods
kubectl get pods -n default -l app=portfolio

# Check deployment status
kubectl rollout status deployment/portfolio -n default

# View logs
kubectl logs -n default -l app=portfolio --tail=100
```

## Image Tags

Each deployment creates three tags:

1. **Commit SHA**: `abc1234` - Specific version
2. **Latest**: `latest` - Always points to most recent main branch
3. **Timestamped**: `main-abc1234-1234567890` - For rollback/audit trail

Pull specific version:

```bash
docker pull gabby.azurecr.io/portfolio:abc1234
```

## Rollback

To rollback to a previous version:

```bash
# List recent images
az acr repository show-tags --name gabby --repository portfolio --orderby time_desc --top 10

# Update deployment to specific tag
kubectl set image deployment/portfolio portfolio=gabby.azurecr.io/portfolio:OLD_TAG -n default

# Watch rollout
kubectl rollout status deployment/portfolio -n default
```

Or use kubectl rollout undo:

```bash
# Rollback to previous version
kubectl rollout undo deployment/portfolio -n default

# Rollback to specific revision
kubectl rollout undo deployment/portfolio --to-revision=2 -n default
```

## Security

### Image Scanning

Every image is automatically scanned with Trivy for vulnerabilities. Results are uploaded to GitHub Security tab:

```
https://github.com/ianlintner/portfolio/security/code-scanning
```

### Authentication

- Uses Azure OIDC (OpenID Connect) for passwordless authentication
- No long-lived credentials stored in GitHub
- Federated identity credential scoped to `main` branch only

### Permissions

Service principal has minimal required permissions:

- Can only push to ACR
- Can only manage deployments in AKS
- Cannot modify other Azure resources

## Troubleshooting

### Deployment Failed

Check GitHub Actions logs:

```bash
gh run list --limit 5
gh run view <run-id>
```

### Image Not Pulling

Verify ACR credentials:

```bash
az acr login --name gabby
docker pull gabby.azurecr.io/portfolio:latest
```

Check AKS can access ACR:

```bash
az aks check-acr --name bigboy --resource-group nekoc --acr gabby.azurecr.io
```

### Pods Not Starting

Check pod events:

```bash
kubectl describe pod -n default -l app=portfolio
kubectl logs -n default -l app=portfolio --previous
```

Check deployment:

```bash
kubectl describe deployment portfolio -n default
```

## Files Modified

- `.github/workflows/ci.yml` - Added docker and deploy jobs
- `scripts/setup-github-cicd.sh` - Setup script for GitHub secrets/variables
- `docs/CI_CD_SETUP_COMPLETE.md` - This documentation

## Next Steps

1. ✅ Push code to main branch to trigger first automated deployment
2. Monitor deployment in GitHub Actions
3. Verify application is running
4. Configure branch protection rules (optional)
5. Set up Slack/email notifications for failed deployments (optional)

## Reference Links

- [GitHub Actions workflow](https://github.com/ianlintner/portfolio/blob/main/.github/workflows/ci.yml)
- [Setup script](https://github.com/ianlintner/portfolio/blob/main/scripts/setup-github-cicd.sh)
- [Azure Container Registry](https://portal.azure.com/#@42ddc44e-97dd-4c3b-bf8a-31c785e24c67/resource/subscriptions/79307c77-54c3-4738-be2a-dc96da7464d9/resourceGroups/nekoc/providers/Microsoft.ContainerRegistry/registries/gabby)
- [AKS Cluster](https://portal.azure.com/#@42ddc44e-97dd-4c3b-bf8a-31c785e24c67/resource/subscriptions/79307c77-54c3-4738-be2a-dc96da7464d9/resourceGroups/nekoc/providers/Microsoft.ContainerService/managedClusters/bigboy)
