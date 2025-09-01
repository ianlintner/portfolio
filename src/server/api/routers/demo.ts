import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";

const createDemoSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  code: z.string().min(1),
  demoUrl: z.string().optional(),
  category: z.enum([
    "REACT",
    "NEXTJS",
    "TYPESCRIPT",
    "CSS",
    "ANIMATION",
    "API",
    "DATABASE",
  ]),
  technologies: z.array(z.string()).default([]),
  published: z.boolean().default(false),
});

const updateDemoSchema = createDemoSchema.partial().extend({
  id: z.string(),
});

export const demoRouter = createTRPCRouter({
  // Public procedures
  getPublished: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.componentDemo.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
    });
  }),

  getByCategory: publicProcedure
    .input(
      z.enum([
        "REACT",
        "NEXTJS",
        "TYPESCRIPT",
        "CSS",
        "ANIMATION",
        "API",
        "DATABASE",
      ]),
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.componentDemo.findMany({
        where: {
          published: true,
          category: input,
        },
        orderBy: { createdAt: "desc" },
      });
    }),

  getById: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const demo = await ctx.db.componentDemo.findUnique({
      where: { id: input },
    });

    if (!demo || !demo.published) {
      throw new Error("Demo not found");
    }

    return demo;
  }),

  // Protected procedures (admin only)
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.componentDemo.findMany({
      orderBy: { createdAt: "desc" },
    });
  }),

  getByIdAdmin: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return ctx.db.componentDemo.findUnique({
        where: { id: input },
      });
    }),

  create: protectedProcedure
    .input(createDemoSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.componentDemo.create({
        data: input,
      });
    }),

  update: protectedProcedure
    .input(updateDemoSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...demoData } = input;
      return ctx.db.componentDemo.update({
        where: { id },
        data: demoData,
      });
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      await ctx.db.componentDemo.delete({
        where: { id: input },
      });
    }),
});
