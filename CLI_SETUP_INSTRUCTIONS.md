# CLI Setup Instructions for Docker CI/CD

This guide shows how to use the automated setup script to configure all secrets using `gcloud`, `gh`, and `kubectl` CLI tools.

## Quick Start

Run the automated setup script:

```bash
./setup-docker-ci-secrets.sh
```

The script will guide you through the entire setup process interactively.

## Prerequisites

Before running the script, ensure you have these CLI tools installed:

### 1. Google Cloud SDK (gcloud)
```bash
# macOS
brew install --cask google-cloud-sdk

# Linux
curl https://sdk.cloud.google.com | bash
exec -l $SHELL

# Verify installation
gcloud --version
```

### 2. GitHub CLI (gh)
```bash
# macOS
brew install gh

# Linux/Windows
# Download from: https://cli.github.com/

# Verify installation
gh --version
```

### 3. kubectl
```bash
# macOS
brew install kubectl

# Linux
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl

# Verify installation
kubectl version --client
```

## What the Script Does

The `setup-docker-ci-secrets.sh` script will:

1. **Check CLI tools** - Verifies all required tools are installed
2. **Authenticate with Google Cloud** - Sets up gcloud authentication
3. **Create service account** - Creates `github-actions-docker@kame-457417.iam.gserviceaccount.com`
4. **Grant permissions** - Adds Artifact Registry writer role
5. **Create service account key** - Generates JSON key file
6. **Setup Artifact Registry** - Creates `kame-house-images` repository if needed
7. **Authenticate with GitHub** - Sets up gh CLI authentication
8. **Set GitHub secrets** - Creates `GCP_SERVICE_ACCOUNT_KEY` secret
9. **Optional: Set DATABASE_URL** - Prompts for database connection string
10. **Optional: Create Kubernetes secrets** - Sets up Docker registry secret for deployments
11. **Cleanup** - Securely removes local key files
12. **Verify setup** - Tests all connections

## Interactive Prompts

The script will ask you:

- Do you need to authenticate with gcloud? (if not already authenticated)
- Do you want to set a DATABASE_URL secret? (optional for build-time database access)
- Do you want to create Kubernetes secrets for deployment? (optional, for pull secret)
- Which kubectl context to use? (if setting up K8s secrets)
- What namespace to use? (default: portfolio)
- Delete local key file? (recommended for security)

## Manual Commands (Alternative)

If you prefer to run commands manually instead of using the script:

<details>
<summary>Click to expand manual commands</summary>

### 1. Create Service Account
```bash
gcloud iam service-accounts create github-actions-docker \
  --display-name="GitHub Actions Docker CI" \
  --description="Service account for GitHub Actions to push Docker images"
```

### 2. Grant Permissions
```bash
gcloud projects add-iam-policy-binding kame-457417 \
  --member="serviceAccount:github-actions-docker@kame-457417.iam.gserviceaccount.com" \
  --role="roles/artifactregistry.writer"
```

### 3. Create Key
```bash
gcloud iam service-accounts keys create github-actions-key.json \
  --iam-account=github-actions-docker@kame-457417.iam.gserviceaccount.com
```

### 4. Set GitHub Secret
```bash
cat github-actions-key.json | gh secret set GCP_SERVICE_ACCOUNT_KEY \
  --repo="ianlintner/portfolio"
```

### 5. Clean Up
```bash
rm github-actions-key.json
```

</details>

## Verification

After running the script, verify the setup:

### GitHub Secrets
```bash
gh secret list --repo="ianlintner/portfolio"
```

### Google Cloud
```bash
gcloud iam service-accounts list --filter="github-actions-docker"
gcloud artifacts repositories list --location=us-central1
```

### Test Docker Push (Local)
```bash
gcloud auth configure-docker us-central1-docker.pkg.dev
docker tag your-image:latest us-central1-docker.pkg.dev/kame-457417/kame-house-images/portfolio:test
docker push us-central1-docker.pkg.dev/kame-457417/kame-house-images/portfolio:test
```

## Troubleshooting

### Common Issues

**gcloud not authenticated**
```bash
gcloud auth login
gcloud config set project kame-457417
```

**GitHub CLI not authenticated**
```bash
gh auth login
```

**Permission denied**
```bash
# Ensure you have the necessary IAM permissions in the GCP project
# You need at least:
# - Service Account Admin
# - IAM Admin
# - Artifact Registry Admin
```

**Script permission error**
```bash
chmod +x setup-docker-ci-secrets.sh
```

## Security Notes

- The script creates minimal-privilege service accounts
- Service account keys are automatically cleaned up
- All secrets are stored securely in GitHub
- The script follows Google Cloud security best practices

## Next Steps

After running the setup script:

1. Push code to `main`, `develop`, or `staging` branch
2. Monitor the GitHub Actions workflow at: https://github.com/ianlintner/portfolio/actions
3. Images will be available at: `us-central1-docker.pkg.dev/kame-457417/kame-house-images/portfolio:tagname`

The CI/CD pipeline is now fully configured and ready to build and push Docker images automatically!
