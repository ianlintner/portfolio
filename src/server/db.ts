import * as schema from "./db/schema";
import { assembleAzureDatabaseUrl } from "../lib/azure-db-url";

// We prefer the node-postgres driver for portability across Azure and local dev.
// Falls back to @vercel/postgres when running in that environment (optional).
// Azure Flexible Server requires SSL; we enable it automatically when sslmode=require

let db: ReturnType<any>;

try {
	// Dynamically decide driver based on environment. If DATABASE_URL present use pg Pool.
	const connectionString = assembleAzureDatabaseUrl() || process.env.DATABASE_URL;
	if (connectionString) {
		// Use node-postgres
		// Import lazily to avoid bundling issues in edge/serverless contexts that still use vercel-postgres.
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const { Pool } = require("pg");
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const { drizzle } = require("drizzle-orm/node-postgres");
		const sslRequired = /sslmode=require/.test(connectionString);
		const pool = new Pool({
			connectionString,
			ssl: sslRequired
				? {
						rejectUnauthorized: false,
					}
				: undefined,
		});
		db = drizzle(pool, { schema });
	} else {
		// Fallback to vercel-postgres if DATABASE_URL not set
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const { sql } = require("@vercel/postgres");
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const { drizzle } = require("drizzle-orm/vercel-postgres");
		db = drizzle(sql, { schema });
	}
} catch (e) {
	// Surface error early; consumers can still catch if needed.
	// eslint-disable-next-line no-console
	console.error("Failed to initialize database client", e);
	throw e;
}

export { db };
