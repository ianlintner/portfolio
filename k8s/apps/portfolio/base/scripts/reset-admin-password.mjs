import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

async function run() {
  const prisma = new PrismaClient();
  try {
    const email = process.env.ADMIN_EMAIL || "admin@example.com";
    const password = process.env.ADMIN_PASSWORD || "admin123";
    const name = process.env.ADMIN_NAME || "Admin User";

    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is not set");
    }

    console.log("Resetting admin credentials for:", email);
    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.upsert({
      where: { email },
      update: { name, passwordHash, role: "ADMIN" },
      create: { email, name, passwordHash, role: "ADMIN" },
    });

    console.log("✅ Admin upserted:", {
      id: user.id,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    console.error("❌ Failed to reset admin password:", err);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

run();

