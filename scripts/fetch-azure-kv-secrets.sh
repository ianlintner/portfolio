#!/usr/bin/env zsh
# Fetch Azure Key Vault secrets and export them as environment variables for local dev.
# Requires: az CLI logged in, correct subscription selected.
# Usage: source scripts/fetch-azure-kv-secrets.sh kv-portfolio-dev

set -euo pipefail
KV_NAME=${1:-kv-portfolio-dev}

fetch_secret() {
  local name=$1
  az keyvault secret show --vault-name "$KV_NAME" --name "$name" --query value -o tsv
}

export AZURE_POSTGRES_HOST=$(fetch_secret postgres-host)
export AZURE_POSTGRES_DB=$(fetch_secret postgres-db)
export AZURE_POSTGRES_USER=$(fetch_secret postgres-user)
export AZURE_POSTGRES_PASSWORD=$(fetch_secret postgres-password)
export AZURE_POSTGRES_PORT=${AZURE_POSTGRES_PORT:-5432}
export AZURE_POSTGRES_SSLMODE=require

# Optionally export DATABASE_URL if stored directly:
if az keyvault secret show --vault-name "$KV_NAME" --name DATABASE_URL >/dev/null 2>&1; then
  export DATABASE_URL=$(fetch_secret DATABASE_URL)
else
  # Assemble implicitly using code path in src/lib/azure-db-url.ts
  echo "DATABASE_URL not stored directly; will be assembled by application at runtime." >&2
fi

# Optionally export NEXTAUTH_SECRET if present in Key Vault
if az keyvault secret show --vault-name "$KV_NAME" --name NEXTAUTH-SECRET >/dev/null 2>&1; then
  export NEXTAUTH_SECRET=$(fetch_secret NEXTAUTH-SECRET)
  echo "Exported NEXTAUTH_SECRET from Key Vault '$KV_NAME'."
else
  echo "NEXTAUTH-SECRET was not found in Key Vault '$KV_NAME'." >&2
  echo "In production, NEXTAUTH_SECRET is required. You can create one with:" >&2
  echo "  az keyvault secret set --vault-name $KV_NAME --name NEXTAUTH-SECRET --value \"$(openssl rand -base64 48 | tr -d '\n')\"" >&2
fi

echo "Exported Azure secrets from Key Vault '$KV_NAME'."
