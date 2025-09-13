import { z } from "zod";
import bcrypt from "bcryptjs";
import { createTRPCRouter, protectedProcedure } from "../../api/trpc";
import { db } from "../../db";
import * as schema from "../../db/schema";
import { eq, desc } from "drizzle-orm";

const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  password: z.string().min(6),
  role: z.enum(["ADMIN", "EDITOR"]).default("EDITOR"),
});

export const authRouter = createTRPCRouter({
  // Get current user session
  getSession: protectedProcedure.query(({ ctx }) => {
    return ctx.session;
  }),

  // Create new user (admin only)
  createUser: protectedProcedure
    .input(createUserSchema)
    .mutation(async ({ ctx, input }) => {
      // Only admins can create users
      if (ctx.session.user.role !== "ADMIN") {
        throw new Error("Unauthorized");
      }

      // Check if user already exists
      const [existingUser] = await db
        .select()
        .from(schema.users)
        .where(eq(schema.users.email, input.email))
        .limit(1);

      if (existingUser) {
        throw new Error("User already exists");
      }

      // Hash password
      const passwordHash = await bcrypt.hash(input.password, 12);

      // Create user
      const [user] = await db
        .insert(schema.users)
        .values({
          email: input.email,
          name: input.name,
          password: passwordHash,
        })
        .returning({
          id: schema.users.id,
          email: schema.users.email,
          name: schema.users.name,
          createdAt: schema.users.createdAt,
        });

      return { ...user, role: input.role };
    }),

  // Get all users (admin only)
  getUsers: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.session.user.role !== "ADMIN") {
      throw new Error("Unauthorized");
    }

    return db
      .select({
        id: schema.users.id,
        email: schema.users.email,
        name: schema.users.name,
        createdAt: schema.users.createdAt,
      })
      .from(schema.users)
      .orderBy(desc(schema.users.createdAt));
  }),

  // Update user (admin only or self)
  updateUser: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).optional(),
        email: z.string().email().optional(),
        role: z.enum(["ADMIN", "EDITOR"]).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;

      // Users can update themselves, admins can update anyone
      if (ctx.session.user.role !== "ADMIN" && ctx.session.user.id !== id) {
        throw new Error("Unauthorized");
      }

      const [user] = await db
        .update(schema.users)
        .set(updateData)
        .where(eq(schema.users.id, parseInt(id)))
        .returning({
          id: schema.users.id,
          email: schema.users.email,
          name: schema.users.name,
        });
      return user;
    }),

  // Change password
  changePassword: protectedProcedure
    .input(
      z.object({
        currentPassword: z.string(),
        newPassword: z.string().min(6),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [user] = await db
        .select()
        .from(schema.users)
        .where(eq(schema.users.id, parseInt(ctx.session.user.id)))
        .limit(1);

      if (!user) {
        throw new Error("User not found");
      }

      // Verify current password
      const isValidPassword = await bcrypt.compare(
        input.currentPassword,
        user.password!,
      );
      if (!isValidPassword) {
        throw new Error("Invalid current password");
      }

      // Hash new password
      const newPasswordHash = await bcrypt.hash(input.newPassword, 12);

      // Update password
      await db
        .update(schema.users)
        .set({ password: newPasswordHash })
        .where(eq(schema.users.id, parseInt(ctx.session.user.id)));

      return { success: true };
    }),
});
