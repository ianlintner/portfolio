#!/usr/bin/env zsh

set -euo pipefail

# Detect if VPA CRDs are present
function has_vpa_crds() {
  kubectl api-resources | grep -qi 'verticalpodautoscaler'
}

function install_vpa() {
  echo "Installing Vertical Pod Autoscaler (VPA) CRDs and components..."
  local tmpdir=$(mktemp -d)
  pushd "$tmpdir" >/dev/null

  echo "Cloning kubernetes/autoscaler repository..."
  git clone https://github.com/kubernetes/autoscaler.git
  cd autoscaler/vertical-pod-autoscaler

  # Run vpa-up.sh with REGISTRY override to avoid tag checkout issues
  echo "Running vpa-up.sh to install VPA (CRDs + components)..."
  REGISTRY=registry.k8s.io/autoscaling TAG=1.2.0 ./hack/vpa-up.sh

  popd >/dev/null
  rm -rf "$tmpdir"

  echo "VPA installation attempted. Verifying..."
  kubectl api-resources | grep -i 'verticalpodautoscaler' || {
    echo "ERROR: VPA CRDs not detected after installation." >&2
    exit 1
  }

  echo "VPA components in kube-system namespace:"
  kubectl -n kube-system get deploy | grep -E 'vpa|vertical' || true
  kubectl -n kube-system get pods | grep -E 'vpa|vertical' || true
}

function apply_portfolio() {
  local base_path="k8s/apps/portfolio/base"
  local vpa_overlay_path="k8s/apps/portfolio/overlays/vpa"

  echo "Applying portfolio base manifests..."
  kubectl apply -k "$base_path"

  if has_vpa_crds; then
    echo "VPA CRDs detected. Applying VPA overlay..."
    kubectl apply -k "$vpa_overlay_path"
    echo "VPA overlay applied. Current VPA objects:"
    kubectl get vpa || true
  else
    echo "VPA CRDs not present. Skipping VPA overlay."
  fi
}

case "${1:-}" in
  install)
    install_vpa
    ;;
  apply)
    apply_portfolio
    ;;
  all|"")
    install_vpa
    apply_portfolio
    ;;
  *)
    echo "Usage: scripts/install-vpa.sh [install|apply|all]" >&2
    exit 2
    ;;
esac
