#!/usr/bin/env zsh
# Verify NEXTAUTH_SECRET is present locally or in Azure Key Vault; optionally create if missing.
# Requires: az CLI logged in, correct subscription selected.
# Usage:
#   scripts/verify-nextauth-secret.sh <key-vault-name> [--create]
#   KV_NAME can also be provided via $AZURE_KEYVAULT_NAME

set -euo pipefail

KV_NAME=${1:-${AZURE_KEYVAULT_NAME:-}}
ACTION=${2:-}

if [[ -z "${KV_NAME}" ]]; then
  echo "Usage: $0 <key-vault-name> [--create]" >&2
  exit 2
fi

# 1) Check local environment first
if [[ -n "${NEXTAUTH_SECRET:-}" ]]; then
  echo "NEXTAUTH_SECRET is set in the local environment."
  exit 0
fi

echo "NEXTAUTH_SECRET not found in local env; checking Azure Key Vault '$KV_NAME'..."

# 2) Check Key Vault
if az keyvault secret show --vault-name "$KV_NAME" --name NEXTAUTH-SECRET >/dev/null 2>&1; then
  VALUE=$(az keyvault secret show --vault-name "$KV_NAME" --name NEXTAUTH-SECRET --query value -o tsv)
  if [[ -n "$VALUE" ]]; then
    echo "NEXTAUTH-SECRET exists in Key Vault '$KV_NAME'."
    exit 0
  fi
fi

echo "NEXTAUTH-SECRET is missing in Key Vault '$KV_NAME'." >&2

if [[ "$ACTION" == "--create" ]]; then
  echo "Creating NEXTAUTH-SECRET in Key Vault '$KV_NAME'..."
  GEN=$(openssl rand -base64 48 | tr -d '\n')
  az keyvault secret set --vault-name "$KV_NAME" --name NEXTAUTH-SECRET --value "$GEN" 1>/dev/null
  echo "Created NEXTAUTH-SECRET in '$KV_NAME'."
  exit 0
else
  echo "To create it automatically now, re-run with --create, e.g.:" >&2
  echo "  $0 $KV_NAME --create" >&2
  exit 1
fi
