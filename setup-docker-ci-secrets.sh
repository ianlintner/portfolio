#!/bin/bash

# Docker CI/CD Secrets Setup Script
# This script uses gcloud, gh, and kubectl CLI tools to create all necessary secrets

set -e  # Exit on any error

# Configuration
PROJECT_ID="kame-457417"
SERVICE_ACCOUNT_NAME="github-actions-docker"
SERVICE_ACCOUNT_EMAIL="${SERVICE_ACCOUNT_NAME}@${PROJECT_ID}.iam.gserviceaccount.com"
KEY_FILE="github-actions-key.json"
REPO_OWNER="ianlintner"
REPO_NAME="portfolio"

echo "🚀 Setting up Docker CI/CD secrets for ${REPO_OWNER}/${REPO_NAME}"
echo "📋 Project ID: ${PROJECT_ID}"
echo ""

# Check required CLI tools
echo "🔍 Checking required CLI tools..."
if ! command -v gcloud &> /dev/null; then
    echo "❌ gcloud CLI not found. Please install Google Cloud SDK."
    exit 1
fi

if ! command -v gh &> /dev/null; then
    echo "❌ gh CLI not found. Please install GitHub CLI."
    exit 1
fi

if ! command -v kubectl &> /dev/null; then
    echo "❌ kubectl not found. Please install kubectl."
    exit 1
fi

echo "✅ All required CLI tools found"
echo ""

# Authenticate and set project
echo "🔐 Setting up Google Cloud authentication..."
echo "Current gcloud account:"
gcloud auth list --filter=status:ACTIVE --format="value(account)" || echo "No active account"

read -p "Do you need to authenticate with gcloud? (y/N): " auth_needed
if [[ $auth_needed =~ ^[Yy]$ ]]; then
    gcloud auth login
fi

echo "Setting project to ${PROJECT_ID}..."
gcloud config set project ${PROJECT_ID}
echo ""

# Enable required APIs
echo "🔧 Enabling required Google Cloud APIs..."
gcloud services enable artifactregistry.googleapis.com
gcloud services enable iam.googleapis.com
echo "✅ APIs enabled"
echo ""

# Create service account
echo "👤 Creating service account: ${SERVICE_ACCOUNT_NAME}"
if gcloud iam service-accounts describe ${SERVICE_ACCOUNT_EMAIL} &>/dev/null; then
    echo "ℹ️  Service account already exists"
else
    gcloud iam service-accounts create ${SERVICE_ACCOUNT_NAME} \
        --display-name="GitHub Actions Docker CI" \
        --description="Service account for GitHub Actions to push Docker images"
    echo "✅ Service account created"
fi
echo ""

# Grant required permissions
echo "🔑 Granting Artifact Registry permissions..."
gcloud projects add-iam-policy-binding ${PROJECT_ID} \
    --member="serviceAccount:${SERVICE_ACCOUNT_EMAIL}" \
    --role="roles/artifactregistry.writer"

# Wait for service account to propagate
echo "⏳ Waiting for service account to propagate..."
sleep 3

# Optional: Grant additional permissions for full CI/CD pipeline
echo "🔑 Granting additional CI/CD permissions..."
if gcloud projects add-iam-policy-binding ${PROJECT_ID} \
    --member="serviceAccount:${SERVICE_ACCOUNT_EMAIL}" \
    --role="roles/storage.objectViewer" 2>/dev/null; then
    echo "✅ Additional permissions granted"
else
    echo "⚠️  Additional permissions failed (this is optional and won't affect Docker functionality)"
fi

echo "✅ Core permissions granted"
echo ""

# Create and download service account key
echo "🔐 Creating service account key..."
if [ -f "${KEY_FILE}" ]; then
    echo "ℹ️  Key file already exists. Creating backup and generating new key..."
    mv "${KEY_FILE}" "${KEY_FILE}.backup.$(date +%s)"
fi

gcloud iam service-accounts keys create ${KEY_FILE} \
    --iam-account=${SERVICE_ACCOUNT_EMAIL}
echo "✅ Service account key created: ${KEY_FILE}"
echo ""

# Verify Artifact Registry repository
echo "🏪 Checking Artifact Registry repository..."
REPO_EXISTS=$(gcloud artifacts repositories list \
    --location=us-central1 \
    --filter="name:kame-house-images" \
    --format="value(name)" || echo "")

if [ -z "$REPO_EXISTS" ]; then
    echo "📦 Creating Artifact Registry repository..."
    gcloud artifacts repositories create kame-house-images \
        --repository-format=docker \
        --location=us-central1 \
        --description="Docker images for Kame House applications"
    echo "✅ Repository created"
else
    echo "ℹ️  Repository already exists: kame-house-images"
fi
echo ""

# Set up GitHub CLI authentication
echo "� Setting up GitHub CLI authentication..."
gh auth status || {
    echo "Please authenticate with GitHub CLI:"
    gh auth login
}
echo ""

# Set GitHub repository secrets
echo "🔒 Setting GitHub repository secrets..."

# Set the service account key secret
echo "Setting GCP_SERVICE_ACCOUNT_KEY secret..."
cat ${KEY_FILE} | gh secret set GCP_SERVICE_ACCOUNT_KEY \
    --repo="${REPO_OWNER}/${REPO_NAME}"

# Set DATABASE_URL secret (optional - prompt user)
echo ""
read -p "Do you want to set a DATABASE_URL secret? (y/N): " set_db_url
if [[ $set_db_url =~ ^[Yy]$ ]]; then
    read -s -p "Enter DATABASE_URL: " database_url
    echo ""
    echo "${database_url}" | gh secret set DATABASE_URL \
        --repo="${REPO_OWNER}/${REPO_NAME}"
    echo "✅ DATABASE_URL secret set"
fi

echo "✅ GitHub secrets configured"
echo ""

# Optional: Create Kubernetes secrets for deployment
echo "🎛️  Kubernetes secrets setup..."
read -p "Do you want to create Kubernetes secrets for deployment? (y/N): " create_k8s_secrets
if [[ $create_k8s_secrets =~ ^[Yy]$ ]]; then
    echo ""
    echo "Available contexts:"
    kubectl config get-contexts
    echo ""
    read -p "Enter the kubectl context to use (or press Enter for current): " k8s_context
    
    if [ -n "$k8s_context" ]; then
        kubectl config use-context "$k8s_context"
    fi
    
    read -p "Enter namespace (default: portfolio): " namespace
    namespace=${namespace:-portfolio}
    
    # Create namespace if it doesn't exist
    kubectl create namespace "$namespace" --dry-run=client -o yaml | kubectl apply -f -
    
    # Create Docker registry secret
    echo "Creating Docker registry secret..."
    kubectl create secret docker-registry docker-registry-secret \
        --namespace="$namespace" \
        --docker-server="us-central1-docker.pkg.dev" \
        --docker-username="_json_key" \
        --docker-password="$(cat ${KEY_FILE})" \
        --docker-email="github-actions@${PROJECT_ID}.iam.gserviceaccount.com" \
        --dry-run=client -o yaml | kubectl apply -f -
    
    echo "✅ Kubernetes secrets created in namespace: $namespace"
fi
echo ""

# Clean up sensitive files
echo "🧹 Cleaning up sensitive files..."
if [ -f "${KEY_FILE}" ]; then
    read -p "Delete the local service account key file? (Y/n): " delete_key
    if [[ ! $delete_key =~ ^[Nn]$ ]]; then
        rm "${KEY_FILE}"
        echo "✅ Local key file deleted"
    else
        echo "⚠️  Local key file preserved: ${KEY_FILE}"
        echo "⚠️  Remember to delete this file after use for security!"
    fi
fi
echo ""

# Verify setup
echo "🔍 Verifying setup..."
echo "Testing GitHub CLI access..."
gh repo view "${REPO_OWNER}/${REPO_NAME}" --json name,owner > /dev/null && echo "✅ GitHub access verified"

echo "Testing Google Cloud access..."
gcloud artifacts repositories list --location=us-central1 > /dev/null && echo "✅ Google Cloud access verified"

echo "Testing Docker registry access..."
gcloud auth configure-docker us-central1-docker.pkg.dev --quiet
echo "✅ Docker registry configured"
echo ""

# Summary
echo "🎉 Setup completed successfully!"
echo ""
echo "📋 Summary:"
echo "  • Service Account: ${SERVICE_ACCOUNT_EMAIL}"
echo "  • GitHub Secrets: GCP_SERVICE_ACCOUNT_KEY"
if [[ $set_db_url =~ ^[Yy]$ ]]; then
    echo "  • GitHub Secrets: DATABASE_URL"
fi
echo "  • Artifact Registry: us-central1-docker.pkg.dev/${PROJECT_ID}/kame-house-images"
if [[ $create_k8s_secrets =~ ^[Yy]$ ]]; then
    echo "  • Kubernetes Secret: docker-registry-secret (namespace: $namespace)"
fi
echo ""
echo "🚀 Your CI/CD pipeline is now ready!"
echo "   Push to main, develop, or staging branches to trigger Docker builds"
echo ""
echo "🔗 Monitor your GitHub Actions at:"
echo "   https://github.com/${REPO_OWNER}/${REPO_NAME}/actions"
