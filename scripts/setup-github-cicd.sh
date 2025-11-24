#!/bin/bash
set -e

# Setup GitHub CI/CD for Azure AKS deployment
# This script configures GitHub secrets and variables for automated deployment

echo "🔧 Setting up GitHub CI/CD for Azure AKS deployment"
echo ""

# Get Azure information
SUBSCRIPTION_ID=$(az account show --query id -o tsv)
TENANT_ID=$(az account show --query tenantId -o tsv)

# Configuration
RESOURCE_GROUP="nekoc"
AKS_CLUSTER_NAME="bigboy"
ACR_NAME="gabby"
NAMESPACE="default"
APP_NAME="portfolio-github-actions"

echo "📋 Configuration:"
echo "  Subscription: ${SUBSCRIPTION_ID}"
echo "  Tenant: ${TENANT_ID}"
echo "  Resource Group: ${RESOURCE_GROUP}"
echo "  AKS Cluster: ${AKS_CLUSTER_NAME}"
echo "  ACR: ${ACR_NAME}"
echo "  Namespace: ${NAMESPACE}"
echo ""

# Check if service principal already exists
echo "🔍 Checking for existing service principal..."
SP_EXISTS=$(az ad sp list --display-name "${APP_NAME}" --query "[0].appId" -o tsv 2>/dev/null || echo "")

if [ -n "${SP_EXISTS}" ]; then
    echo "✅ Service principal already exists: ${SP_EXISTS}"
    CLIENT_ID="${SP_EXISTS}"
else
    echo "📝 Creating federated identity service principal for GitHub Actions..."
    
    # Create service principal with federated credentials
    SP_OUTPUT=$(az ad sp create-for-rbac \
        --name "${APP_NAME}" \
        --role contributor \
        --scopes "/subscriptions/${SUBSCRIPTION_ID}/resourceGroups/${RESOURCE_GROUP}" \
        --sdk-auth \
        --output json)
    
    CLIENT_ID=$(echo "${SP_OUTPUT}" | jq -r '.clientId')
    echo "✅ Created service principal: ${CLIENT_ID}"
fi

# Get the service principal object ID
SP_OBJECT_ID=$(az ad sp show --id "${CLIENT_ID}" --query id -o tsv)

# Get the application object ID
APP_OBJECT_ID=$(az ad app list --app-id "${CLIENT_ID}" --query "[0].id" -o tsv)

echo ""
echo "🔐 Setting up federated credentials for GitHub Actions..."

# Get repository information
REPO_OWNER=$(gh repo view --json owner --jq .owner.login)
REPO_NAME=$(gh repo view --json name --jq .name)

echo "  Repository: ${REPO_OWNER}/${REPO_NAME}"

# Create federated credential for main branch
FED_CRED_NAME="github-actions-main"
echo "  Creating federated credential: ${FED_CRED_NAME}"

az ad app federated-credential create \
    --id "${APP_OBJECT_ID}" \
    --parameters "{
        \"name\": \"${FED_CRED_NAME}\",
        \"issuer\": \"https://token.actions.githubusercontent.com\",
        \"subject\": \"repo:${REPO_OWNER}/${REPO_NAME}:ref:refs/heads/main\",
        \"audiences\": [\"api://AzureADTokenExchange\"]
    }" 2>/dev/null || echo "  (Federated credential may already exist)"

# Grant additional permissions
echo ""
echo "🔑 Granting permissions..."

# ACR pull permission
ACR_ID=$(az acr show --name "${ACR_NAME}" --resource-group "${RESOURCE_GROUP}" --query id -o tsv)
az role assignment create \
    --assignee "${CLIENT_ID}" \
    --role "AcrPush" \
    --scope "${ACR_ID}" \
    2>/dev/null || echo "  (ACR Push role may already be assigned)"

# AKS contributor permission
AKS_ID=$(az aks show --name "${AKS_CLUSTER_NAME}" --resource-group "${RESOURCE_GROUP}" --query id -o tsv)
az role assignment create \
    --assignee "${CLIENT_ID}" \
    --role "Azure Kubernetes Service Cluster User Role" \
    --scope "${AKS_ID}" \
    2>/dev/null || echo "  (AKS User role may already be assigned)"

echo ""
echo "📝 Setting GitHub secrets..."

# Set GitHub secrets using gh CLI
gh secret set AZURE_CLIENT_ID --body "${CLIENT_ID}"
gh secret set AZURE_TENANT_ID --body "${TENANT_ID}"
gh secret set AZURE_SUBSCRIPTION_ID --body "${SUBSCRIPTION_ID}"

echo ""
echo "📝 Setting GitHub variables..."

# Set GitHub variables
gh variable set AZURE_REGISTRY_NAME --body "${ACR_NAME}"
gh variable set AKS_CLUSTER_NAME --body "${AKS_CLUSTER_NAME}"
gh variable set AKS_RESOURCE_GROUP --body "${RESOURCE_GROUP}"
gh variable set DEPLOY_NAMESPACE --body "${NAMESPACE}"

echo ""
echo "✅ GitHub CI/CD setup complete!"
echo ""
echo "🔐 Secrets configured:"
echo "  - AZURE_CLIENT_ID"
echo "  - AZURE_TENANT_ID"
echo "  - AZURE_SUBSCRIPTION_ID"
echo ""
echo "📋 Variables configured:"
echo "  - AZURE_REGISTRY_NAME: ${ACR_NAME}"
echo "  - AKS_CLUSTER_NAME: ${AKS_CLUSTER_NAME}"
echo "  - AKS_RESOURCE_GROUP: ${RESOURCE_GROUP}"
echo "  - DEPLOY_NAMESPACE: ${NAMESPACE}"
echo ""
echo "🚀 Next steps:"
echo "  1. Push to main branch to trigger deployment"
echo "  2. Monitor deployment: gh run watch"
echo "  3. Check pods: kubectl get pods -n ${NAMESPACE}"
echo ""
echo "💡 The CI workflow will now:"
echo "  - Run quality checks (lint, format, test)"
echo "  - Build Next.js application"
echo "  - Build and push Docker image to ACR"
echo "  - Deploy to AKS cluster"
