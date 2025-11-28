import { z } from "zod";

// Define the base schema for environment variables the app cares about.
const baseSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"]) 
    .default("development"),

  // Auth
  NEXTAUTH_SECRET: z.string().optional(),
  NEXTAUTH_URL: z.string().url().optional(),

  // Database (optional here – db module has its own assembly logic)
  DATABASE_URL: z.string().optional(),
  AZURE_DATABASE_URL: z.string().optional(),
  AZURE_POSTGRES_HOST: z.string().optional(),
  AZURE_POSTGRES_DB: z.string().optional(),
  AZURE_POSTGRES_USER: z.string().optional(),
  AZURE_POSTGRES_PASSWORD: z.string().optional(),
  AZURE_POSTGRES_PORT: z.string().optional(),
  AZURE_POSTGRES_SSLMODE: z.string().optional(),
});

const parsed = baseSchema.parse(process.env);

// Hard requirement: In production, NextAuth requires a secret.
if (parsed.NODE_ENV === "production" && !parsed.NEXTAUTH_SECRET) {
  const guidance = [
    "NEXTAUTH_SECRET is required in production.",
    "Set it as an environment variable or provision it via your secret store.",
    "Examples:",
    "- Azure Key Vault: az keyvault secret set --vault-name <kv-name> --name NEXTAUTH-SECRET --value <generated-secret>",
    "- Kubernetes: kubectl create secret generic nextauth-secret --from-literal=NEXTAUTH_SECRET=...",
    "- GitHub Actions: add NEXTAUTH_SECRET in repository Secrets, then surface to your deployment",
    "You can also run scripts/verify-nextauth-secret.sh to check and create it with Azure CLI.",
  ].join("\n");
  throw new Error(guidance);
}

export const env = parsed;
