# Azure CI/CD Setup Guide

This guide walks you through setting up continuous integration and deployment for the Portfolio application using GitHub Actions, Azure Container Registry (ACR), and Azure Kubernetes Service (AKS).

## Overview

The CI/CD pipeline consists of two main workflows:

1. **CI Workflow** (`ci.yml`) - Runs quality checks (lint, format, test) and builds the application
2. **Docker Workflow** (`docker.yml`) - Builds and pushes Docker images to Azure Container Registry, optionally deploys to AKS

## Architecture

```
GitHub Push → CI Checks → Docker Build → ACR Push → AKS Deploy (optional)
```

### Key Features

- **Optimized for Speed**: Parallel job execution, intelligent caching, path-based triggers
- **Security First**: Azure OIDC authentication, Trivy vulnerability scanning
- **GitOps Ready**: Branch-based tagging for Flux CD integration
- **Multi-platform**: Builds for both amd64 and arm64 architectures

## Prerequisites

1. **Azure Resources**:
   - Azure Container Registry (ACR)
   - Azure Kubernetes Service (AKS) cluster (optional, for auto-deployment)
   - Resource Group

2. **Azure Service Principal** or **Managed Identity** with permissions:
   - `AcrPush` role on the Container Registry
   - `Azure Kubernetes Service Cluster User Role` (if using AKS deployment)

3. **GitHub Repository** with admin access to configure secrets

## Step 1: Create Azure Resources

### Create Resource Group

```bash
az group create \
  --name portfolio-rg \
  --location eastus
```

### Create Azure Container Registry

```bash
az acr create \
  --resource-group portfolio-rg \
  --name portfolioregistry \
  --sku Basic
```

### Create AKS Cluster (Optional)

```bash
az aks create \
  --resource-group portfolio-rg \
  --name portfolio-aks \
  --node-count 2 \
  --enable-managed-identity \
  --generate-ssh-keys
```

## Step 2: Configure Azure Authentication

### Option A: OIDC Authentication (Recommended)

OIDC provides keyless authentication without storing credentials in GitHub.

#### 1. Create Azure AD Application

```bash
# Create the app registration
az ad app create --display-name "GitHub-Portfolio-OIDC"

# Get the Application (client) ID
APP_ID=$(az ad app list --display-name "GitHub-Portfolio-OIDC" --query "[0].appId" -o tsv)
echo "Application ID: $APP_ID"
```

#### 2. Create Service Principal

```bash
az ad sp create --id $APP_ID

# Get the Object ID
OBJECT_ID=$(az ad sp list --display-name "GitHub-Portfolio-OIDC" --query "[0].id" -o tsv)
echo "Object ID: $OBJECT_ID"
```

#### 3. Configure Federated Credentials

```bash
# For main branch
az ad app federated-credential create \
  --id $APP_ID \
  --parameters '{
    "name": "GitHubMain",
    "issuer": "https://token.actions.githubusercontent.com",
    "subject": "repo:YOUR_GITHUB_USERNAME/portfolio:ref:refs/heads/main",
    "audiences": ["api://AzureADTokenExchange"]
  }'

# For pull requests
az ad app federated-credential create \
  --id $APP_ID \
  --parameters '{
    "name": "GitHubPR",
    "issuer": "https://token.actions.githubusercontent.com",
    "subject": "repo:YOUR_GITHUB_USERNAME/portfolio:pull_request",
    "audiences": ["api://AzureADTokenExchange"]
  }'
```

#### 4. Assign ACR Permissions

```bash
# Get ACR resource ID
ACR_ID=$(az acr show --name portfolioregistry --query id -o tsv)

# Assign AcrPush role
az role assignment create \
  --assignee $APP_ID \
  --role AcrPush \
  --scope $ACR_ID
```

#### 5. Configure GitHub Secrets

```bash
# Get your Azure Tenant ID
TENANT_ID=$(az account show --query tenantId -o tsv)

# Get your Azure Subscription ID
SUBSCRIPTION_ID=$(az account show --query id -o tsv)

echo "Add these secrets to GitHub:"
echo "AZURE_CLIENT_ID: $APP_ID"
echo "AZURE_TENANT_ID: $TENANT_ID"
echo "AZURE_SUBSCRIPTION_ID: $SUBSCRIPTION_ID"
```

### Option B: Service Principal Authentication

If you prefer using service principal credentials:

#### 1. Create Service Principal

```bash
az ad sp create-for-rbac \
  --name "github-portfolio-sp" \
  --role contributor \
  --scopes /subscriptions/{subscription-id}/resourceGroups/portfolio-rg \
  --sdk-auth
```

This outputs JSON credentials - save them as the `AZURE_CREDENTIALS` secret in GitHub.

#### 2. Assign ACR Permissions

```bash
# Get the service principal's App ID
SP_ID=$(az ad sp list --display-name "github-portfolio-sp" --query "[0].appId" -o tsv)

# Assign AcrPush role
ACR_ID=$(az acr show --name portfolioregistry --query id -o tsv)
az role assignment create \
  --assignee $SP_ID \
  --role AcrPush \
  --scope $ACR_ID
```

## Step 3: Configure GitHub Secrets and Variables

Navigate to your GitHub repository → Settings → Secrets and variables → Actions

### Required Secrets (OIDC)

- `AZURE_CLIENT_ID`: Application (client) ID from Azure AD
- `AZURE_TENANT_ID`: Your Azure tenant ID
- `AZURE_SUBSCRIPTION_ID`: Your Azure subscription ID

### Required Secrets (Service Principal)

- `AZURE_CREDENTIALS`: JSON output from `az ad sp create-for-rbac`

### Required Variables

- `AZURE_REGISTRY_NAME`: Your ACR name (e.g., `portfolioregistry`)
- `AZURE_RESOURCE_GROUP`: Resource group name (e.g., `portfolio-rg`)

### Optional Variables (for AKS auto-deploy)

- `ENABLE_AUTO_DEPLOY`: Set to `true` to enable automatic deployment
- `AKS_CLUSTER_NAME`: Your AKS cluster name
- `DEPLOY_NAMESPACE`: Kubernetes namespace (default: `prod`)

### Example Configuration

```bash
# Using GitHub CLI
gh secret set AZURE_CLIENT_ID --body "$APP_ID"
gh secret set AZURE_TENANT_ID --body "$TENANT_ID"
gh secret set AZURE_SUBSCRIPTION_ID --body "$SUBSCRIPTION_ID"

gh variable set AZURE_REGISTRY_NAME --body "portfolioregistry"
gh variable set AZURE_RESOURCE_GROUP --body "portfolio-rg"

# Optional: Enable auto-deploy
gh variable set ENABLE_AUTO_DEPLOY --body "true"
gh variable set AKS_CLUSTER_NAME --body "portfolio-aks"
gh variable set DEPLOY_NAMESPACE --body "prod"
```

## Step 4: Update Workflow Configuration

The workflows are already configured for Azure. If you need to customize:

### Modify `.github/workflows/docker.yml`

```yaml
env:
  REGISTRY: ${{ vars.AZURE_REGISTRY_NAME }}.azurecr.io
  IMAGE_NAME: portfolio
  RESOURCE_GROUP: ${{ vars.AZURE_RESOURCE_GROUP }}
```

## Step 5: Test the Pipeline

### Trigger CI Workflow

```bash
# Make a change and push
git add .
git commit -m "test: trigger CI pipeline"
git push origin main
```

### Check Workflow Status

```bash
gh run list
gh run view <run-id>
```

### View in GitHub

- Navigate to Actions tab in your repository
- Watch the CI workflow complete
- Watch the Docker workflow trigger and build
- Check the job summaries for build artifacts and tags

## Step 6: Verify Container Registry

```bash
# List repositories
az acr repository list --name portfolioregistry

# List tags for the portfolio image
az acr repository show-tags \
  --name portfolioregistry \
  --repository portfolio \
  --output table
```

## CI/CD Workflow Details

### CI Workflow (`ci.yml`)

**Triggers**:

- Push to `main`, `develop`, `staging` branches
- Pull requests to these branches
- Ignores: markdown files, docs, docker workflow

**Jobs**:

1. **Quality Checks** (parallel):
   - Lint: ESLint validation
   - Format: Prettier validation
   - Test: Jest test suite
2. **Build**: Next.js production build with docs
3. **K8s Validate**: Validates Kubernetes manifests with Kustomize

**Optimizations**:

- Matrix strategy for parallel quality checks
- Intelligent caching (pnpm store, Next.js build cache)
- Path-based triggers to skip unnecessary runs
- Concurrency controls to cancel outdated runs

### Docker Workflow (`docker.yml`)

**Triggers**:

- After successful CI workflow completion
- Push of version tags (e.g., `v1.0.0`)

**Jobs**:

1. **Build and Push**:
   - Builds Docker image with BuildKit
   - Multi-platform support (amd64, arm64)
   - Pushes to Azure Container Registry
   - Tags: commit SHA, branch name, semver, latest
   - Security: Trivy vulnerability scanning
   - Optional: Auto-deploy to AKS

**Image Tags**:

- `{commit-sha}`: Short commit hash (e.g., `a1b2c3d`)
- `{branch}`: Branch name (e.g., `main`, `develop`)
- `{branch}-{commit}-{timestamp}`: Flux CD compatible
- `latest`: Only for main branch
- Semver tags for releases: `v1.0.0`, `1.0.0`, `1.0`, `1`

## Security Scanning

The pipeline includes Trivy security scanning for container vulnerabilities.

### View Scan Results

1. Go to Security tab in GitHub
2. Select Code scanning alerts
3. Review findings and remediate as needed

### Disable Scanning (not recommended)

Remove or comment out the Trivy steps in `docker.yml`:

```yaml
# - name: Image scan with Trivy
#   uses: aquasecurity/trivy-action@master
```

## Flux CD Integration

The workflow generates Flux CD compatible tags with timestamps:

```
main-a1b2c3d-1703001234
develop-b2c3d4e-1703001235
```

### Configure Flux ImagePolicy

```yaml
apiVersion: image.toolkit.fluxcd.io/v1beta2
kind: ImagePolicy
metadata:
  name: portfolio
  namespace: flux-system
spec:
  imageRepositoryRef:
    name: portfolio
  policy:
    semver:
      range: ">=1.0.0"
  filterTags:
    pattern: "^main-[a-f0-9]+-(?P<ts>[0-9]+)$"
    extract: "$ts"
```

## Troubleshooting

### Authentication Failures

**OIDC Issues**:

```bash
# Verify federated credential configuration
az ad app federated-credential list --id $APP_ID

# Check role assignments
az role assignment list --assignee $APP_ID --all
```

**Service Principal Issues**:

```bash
# Test login
az login --service-principal \
  --username $SP_ID \
  --password $SP_SECRET \
  --tenant $TENANT_ID

# Test ACR access
az acr login --name portfolioregistry
```

### Build Failures

**Check logs**:

```bash
gh run view <run-id> --log
```

**Common issues**:

- Missing secrets/variables in GitHub
- Incorrect ACR name or permissions
- Docker build errors (check Dockerfile)
- Network connectivity to Azure

### ACR Login Issues

```bash
# Enable admin user (not recommended for production)
az acr update --name portfolioregistry --admin-enabled true

# Get admin credentials
az acr credential show --name portfolioregistry
```

### AKS Deployment Issues

```bash
# Verify AKS credentials
az aks get-credentials \
  --resource-group portfolio-rg \
  --name portfolio-aks \
  --overwrite-existing

# Check cluster connectivity
kubectl cluster-info

# Verify deployment
kubectl get deployments -n prod
kubectl get pods -n prod
kubectl describe pod <pod-name> -n prod
```

## Best Practices

### Security

- ✅ Use OIDC authentication (keyless)
- ✅ Enable vulnerability scanning
- ✅ Use minimal ACR SKU for cost savings
- ✅ Implement proper RBAC in AKS
- ✅ Scan images before deployment
- ⚠️ Avoid admin user credentials
- ⚠️ Rotate service principal secrets regularly

### Performance

- ✅ Use build caching (registry cache)
- ✅ Multi-stage Dockerfile for smaller images
- ✅ Parallel job execution in CI
- ✅ Path-based workflow triggers
- ✅ Intelligent dependency caching

### Cost Optimization

- Use Basic ACR SKU for development
- Scale AKS node pools based on demand
- Clean up old container images regularly:
  ```bash
  # Delete images older than 30 days
  az acr repository show-tags \
    --name portfolioregistry \
    --repository portfolio \
    --orderby time_asc \
    --output tsv | head -n -30 | \
    xargs -I {} az acr repository delete \
      --name portfolioregistry \
      --image portfolio:{} \
      --yes
  ```

## Monitoring and Observability

### GitHub Actions Insights

- View workflow run history in Actions tab
- Set up status badges in README
- Configure failure notifications

### Azure Monitor

```bash
# Enable Container Insights for AKS
az aks enable-addons \
  --resource-group portfolio-rg \
  --name portfolio-aks \
  --addons monitoring
```

### Application Insights

Configure in your application for:

- Request tracking
- Dependency monitoring
- Exception logging
- Custom metrics

## Next Steps

1. **Set up staging environment**:
   - Create separate ACR repository or tags
   - Configure branch-specific deployments

2. **Implement GitOps with Flux CD**:
   - Install Flux on AKS cluster
   - Configure image automation
   - Set up environment-specific overlays

3. **Add performance testing**:
   - Lighthouse CI for web vitals
   - Load testing with k6 or Artillery

4. **Implement progressive rollouts**:
   - Canary deployments with Flagger
   - Blue-green deployments

## Additional Resources

- [Azure Container Registry Documentation](https://learn.microsoft.com/azure/container-registry/)
- [Azure Kubernetes Service Documentation](https://learn.microsoft.com/azure/aks/)
- [GitHub Actions Documentation](https://docs.github.com/actions)
- [Docker Build Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Flux CD Documentation](https://fluxcd.io/docs/)

## Support

For issues or questions:

1. Check the troubleshooting section above
2. Review workflow logs in GitHub Actions
3. Check Azure resource health in Azure Portal
4. Open an issue in the repository

---

**Last Updated**: December 2024
**Maintained By**: Ian Lintner
