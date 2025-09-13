import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "../../api/trpc";
import { db } from "../../db";
import * as schema from "../../db/schema";
import { eq, desc } from "drizzle-orm";

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
  getPublished: publicProcedure.query(async () => {
    return db
      .select()
      .from(schema.posts)
      .where(eq(schema.posts.published, 1))
      .orderBy(desc(schema.posts.createdAt));
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
    .query(async () => {
      return db
        .select()
        .from(schema.posts)
        .where(eq(schema.posts.published, 1))
        .orderBy(desc(schema.posts.createdAt));
    }),

  getById: publicProcedure.input(z.string()).query(async ({ input }) => {
    const [demo] = await db
      .select()
      .from(schema.posts)
      .where(eq(schema.posts.id, parseInt(input)))
      .limit(1);

    if (!demo || !demo.published) {
      throw new Error("Demo not found");
    }

    return demo;
  }),

  // Protected procedures (admin only)
  getAll: protectedProcedure.query(async () => {
    return db.select().from(schema.posts).orderBy(desc(schema.posts.createdAt));
  }),

  getByIdAdmin: protectedProcedure
    .input(z.string())
    .query(async ({ input }) => {
      const [demo] = await db
        .select()
        .from(schema.posts)
        .where(eq(schema.posts.id, parseInt(input)))
        .limit(1);
      return demo;
    }),

  create: protectedProcedure
    .input(createDemoSchema)
    .mutation(async ({ ctx, input }) => {
      const [demo] = await db
        .insert(schema.posts)
        .values({
          title: input.name,
          content: input.description,
          slug: input.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          published: input.published ? 1 : 0,
          authorId: parseInt(ctx.session.user.id),
          createdAt: new Date(),
        })
        .returning();
      return demo;
    }),

  update: protectedProcedure
    .input(updateDemoSchema)
    .mutation(async ({ input }) => {
      const { id, ...demoData } = input;
      const [demo] = await db
        .update(schema.posts)
        .set({
          title: demoData.name,
          content: demoData.description,
          published: demoData.published ? 1 : 0,
        })
        .where(eq(schema.posts.id, parseInt(id)))
        .returning();
      return demo;
    }),

  delete: protectedProcedure.input(z.string()).mutation(async ({ input }) => {
    await db.delete(schema.posts).where(eq(schema.posts.id, parseInt(input)));
  }),
});
