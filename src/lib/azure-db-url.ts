/**
 * Build a PostgreSQL connection string from individual Azure env parts.
 * This lets us store the password as its own secret and rotate it independently.
 * If DATABASE_URL already exists it is returned unchanged.
 */
export function assembleAzureDatabaseUrl(env: NodeJS.ProcessEnv = process.env): string | undefined {
  if (env.DATABASE_URL && env.DATABASE_URL.trim().length > 0) return env.DATABASE_URL;

  const host = env.AZURE_POSTGRES_HOST;
  const db = env.AZURE_POSTGRES_DB;
  const user = env.AZURE_POSTGRES_USER;
  const password = env.AZURE_POSTGRES_PASSWORD;
  const port = env.AZURE_POSTGRES_PORT || '5432';
  const sslmode = env.AZURE_POSTGRES_SSLMODE || 'require';

  if (!host || !db || !user || !password) return undefined; // insufficient pieces

  return `postgresql://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${host}:${port}/${db}?sslmode=${sslmode}`;
}
