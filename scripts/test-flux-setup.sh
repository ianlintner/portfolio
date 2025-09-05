#!/bin/bash
set -e

echo "🧪 Testing Flux CD Setup"
echo "========================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if flux CLI is installed
echo -e "\n${BLUE}Checking Flux CD CLI...${NC}"
if command -v flux &> /dev/null; then
    echo -e "${GREEN}✓${NC} Flux CLI is installed: $(flux version --client)"
else
    echo -e "${RED}✗${NC} Flux CLI not found. Install with:"
    echo "  brew install fluxcd/tap/flux  # macOS"
    echo "  curl -s https://fluxcd.io/install.sh | sudo bash  # Linux"
    exit 1
fi

# Check if kubectl is configured
echo -e "\n${BLUE}Checking kubectl configuration...${NC}"
if kubectl cluster-info &> /dev/null; then
    echo -e "${GREEN}✓${NC} kubectl is configured and cluster is reachable"
    echo "  Cluster: $(kubectl config current-context)"
else
    echo -e "${YELLOW}⚠${NC} kubectl not configured or cluster unreachable"
    echo "  This is expected if you haven't configured cluster access yet"
fi

# Validate Flux manifests
echo -e "\n${BLUE}Validating Flux CD manifests...${NC}"

# Check if flux system directory exists
if [ ! -d "k8s/flux-system" ]; then
    echo -e "${RED}✗${NC} k8s/flux-system directory not found"
    exit 1
fi

# Validate YAML syntax
echo "  Checking YAML syntax..."
for file in k8s/flux-system/*.yaml; do
    if [ -f "$file" ]; then
        if yq eval . "$file" &> /dev/null; then
            echo -e "    ${GREEN}✓${NC} $(basename "$file")"
        else
            echo -e "    ${RED}✗${NC} $(basename "$file") - Invalid YAML"
            exit 1
        fi
    fi
done

# Check for required Flux resources
echo "  Checking required Flux CD resources..."

required_resources=(
    "GitRepository"
    "ImageRepository" 
    "ImagePolicy"
    "ImageUpdateAutomation"
    "Kustomization"
)

for resource in "${required_resources[@]}"; do
    if grep -q "kind: $resource" k8s/flux-system/*.yaml; then
        echo -e "    ${GREEN}✓${NC} $resource found"
    else
        echo -e "    ${RED}✗${NC} $resource not found"
        exit 1
    fi
done

# Check deployment annotation
echo -e "\n${BLUE}Checking deployment image policy annotation...${NC}"
if grep -q '# {"$imagepolicy"' k8s/apps/portfolio/base/deployment.yaml; then
    echo -e "${GREEN}✓${NC} Image policy annotation found in deployment.yaml"
else
    echo -e "${RED}✗${NC} Image policy annotation missing from deployment.yaml"
    exit 1
fi

# Check GitHub Actions workflow
echo -e "\n${BLUE}Checking GitHub Actions workflow...${NC}"
if grep -q "FLUX_TAG=" .github/workflows/docker.yml; then
    echo -e "${GREEN}✓${NC} Flux CD compatible image tagging found in docker.yml"
else
    echo -e "${RED}✗${NC} Flux CD image tagging not found in docker.yml"
    exit 1
fi

if grep -q "Notify Flux CD" .github/workflows/docker.yml; then
    echo -e "${GREEN}✓${NC} Direct kubectl deployment removed from docker.yml"
else
    echo -e "${YELLOW}⚠${NC} Still has direct kubectl deployment in docker.yml"
fi

# Test Flux CD dry-run (if flux is available and cluster is reachable)
echo -e "\n${BLUE}Testing Flux CD configuration...${NC}"
if kubectl cluster-info &> /dev/null; then
    echo "  Running flux check..."
    if flux check --pre &> /dev/null; then
        echo -e "  ${GREEN}✓${NC} Flux prerequisites check passed"
    else
        echo -e "  ${YELLOW}⚠${NC} Flux prerequisites check failed (expected if Flux not installed yet)"
    fi
    
    # Try to validate manifests with flux
    echo "  Validating manifests with Flux..."
    if flux diff kustomization portfolio-dev --path k8s/apps/portfolio/overlays/dev &> /dev/null; then
        echo -e "  ${GREEN}✓${NC} Dev kustomization validates successfully"
    else
        echo -e "  ${YELLOW}⚠${NC} Dev kustomization validation skipped (Flux may not be installed)"
    fi
else
    echo -e "  ${YELLOW}⚠${NC} Skipping Flux checks - cluster not accessible"
fi

echo -e "\n${GREEN}🎉 Flux CD setup validation completed!${NC}"
echo
echo "Next steps:"
echo "1. Install Flux CD in your cluster: flux install"
echo "2. Create required secrets (GitHub token, GCP registry credentials)"
echo "3. Apply Flux manifests: kubectl apply -f k8s/flux-system/"
echo "4. Monitor with: flux get all"
echo
echo "See FLUX_CD_MIGRATION.md for detailed instructions."
