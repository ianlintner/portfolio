/**
 * Database seeding script using Drizzle ORM.
 * Replaces old Prisma-based seeding.
 */
import bcrypt from "bcryptjs";
import { config } from "dotenv";
import { db } from "../src/server/db";
import * as schema from "../src/server/db/schema";
import { eq } from "drizzle-orm";

// Load environment variables from .env.local
config({ path: ".env.local" });

async function main() {
  console.log("🌱 Starting database seed...");

  // Create admin user
  const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
  const adminName = process.env.ADMIN_NAME || "Admin User";

  const hashedPassword = await bcrypt.hash(adminPassword, 12);

  // Upsert admin user
  const existingAdmin = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.email, adminEmail))
    .limit(1);

  let adminUser;
  if (existingAdmin.length > 0) {
    await db
      .update(schema.users)
      .set({
        name: adminName,
        password: hashedPassword,
      })
      .where(eq(schema.users.email, adminEmail));
    adminUser = existingAdmin[0];
  } else {
    const inserted = await db
      .insert(schema.users)
      .values({
        email: adminEmail,
        name: adminName,
        password: hashedPassword,
      })
      .returning();
    adminUser = inserted[0];
  }

  console.log(`✅ Created/updated admin user: ${adminUser.email}`);

  // Create sample tags
  const tagNames = [
    "React",
    "Next.js",
    "TypeScript",
    "Kubernetes",
    "Google Cloud",
  ];

  for (const name of tagNames) {
    const existingTag = await db
      .select()
      .from(schema.tags)
      .where(eq(schema.tags.name, name))
      .limit(1);

    if (existingTag.length === 0) {
      await db.insert(schema.tags).values({ name });
      console.log(`✅ Created tag: ${name}`);
    }
  }

  console.log("🎉 Database seeding completed!");
}

main().catch((e) => {
  console.error("❌ Error during seeding:", e);
  process.exit(1);
});
