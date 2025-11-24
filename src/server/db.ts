import * as schema from "./db/schema";
import { assembleAzureDatabaseUrl } from "../lib/azure-db-url";
import { Pool } from "pg";
import { drizzle as drizzleNodePostgres } from "drizzle-orm/node-postgres";
import { sql } from "@vercel/postgres";
import { drizzle as drizzleVercel } from "drizzle-orm/vercel-postgres";

// We prefer the node-postgres driver for portability across Azure and local dev.
// Falls back to @vercel/postgres when running in that environment (optional).
// Azure Flexible Server requires SSL; we enable it automatically when sslmode=require

let db: ReturnType<typeof drizzleNodePostgres | typeof drizzleVercel>;

try {
  // Dynamically decide driver based on environment. If DATABASE_URL present use pg Pool.
  const connectionString =
    assembleAzureDatabaseUrl() || process.env.DATABASE_URL;
  if (connectionString) {
    // Use node-postgres
    const sslRequired = /sslmode=require/.test(connectionString);
    const pool = new Pool({
      connectionString,
      ssl: sslRequired
        ? {
            rejectUnauthorized: false,
          }
        : undefined,
    });
    db = drizzleNodePostgres(pool, { schema });
  } else {
    // Fallback to vercel-postgres if DATABASE_URL not set
    db = drizzleVercel(sql, { schema });
  }
} catch (e) {
  console.error("Failed to initialize database client", e);
  throw e;
}

export { db };
