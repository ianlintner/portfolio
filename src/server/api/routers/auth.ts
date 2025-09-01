import { z } from "zod";
import bcrypt from "bcryptjs";
import {
  createTRPCRouter,
  protectedProcedure,
} from "@/server/api/trpc";

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
      const existingUser = await ctx.db.user.findUnique({
        where: { email: input.email },
      });

      if (existingUser) {
        throw new Error("User already exists");
      }

      // Hash password
      const passwordHash = await bcrypt.hash(input.password, 12);

      // Create user
      const user = await ctx.db.user.create({
        data: {
          email: input.email,
          name: input.name,
          passwordHash,
          role: input.role,
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
        },
      });

      return user;
    }),

  // Get all users (admin only)
  getUsers: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.session.user.role !== "ADMIN") {
      throw new Error("Unauthorized");
    }

    return ctx.db.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
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

      return ctx.db.user.update({
        where: { id },
        data: updateData,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          updatedAt: true,
        },
      });
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
      const user = await ctx.db.user.findUnique({
        where: { id: ctx.session.user.id },
      });

      if (!user) {
        throw new Error("User not found");
      }

      // Verify current password
      const isValidPassword = await bcrypt.compare(
        input.currentPassword,
        user.passwordHash,
      );
      if (!isValidPassword) {
        throw new Error("Invalid current password");
      }

      // Hash new password
      const newPasswordHash = await bcrypt.hash(input.newPassword, 12);

      // Update password
      await ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: { passwordHash: newPasswordHash },
      });

      return { success: true };
    }),
});
