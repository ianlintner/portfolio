import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "../../api/trpc";
import { db } from "../../db";
import * as schema from "../../db/schema";
import { eq, desc } from "drizzle-orm";

const createPostSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  excerpt: z.string().optional(),
  published: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  featuredImage: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  seoKeywords: z.array(z.string()).default([]),
});

const updatePostSchema = createPostSchema.partial().extend({
  id: z.string(),
});

export const postRouter = createTRPCRouter({
  // Public procedures
  getPublished: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
        cursor: z.string().nullish(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const posts = await db
        .select()
        .from(schema.posts)
        .where(eq(schema.posts.published, 1))
        .orderBy(desc(schema.posts.publishedAt))
        .limit(input.limit + 1);

      let nextCursor: typeof input.cursor | undefined = undefined;
      if (posts.length > input.limit) {
        const nextItem = posts.pop();
        nextCursor = nextItem!.id;
      }

      return {
        posts,
        nextCursor,
      };
    }),

  getBySlug: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const [post] = await db
      .select()
      .from(schema.posts)
      .where(eq(schema.posts.slug, input))
      .limit(1);

    if (!post || !post.published) {
      throw new Error("Post not found");
    }

    return post;
  }),

  // Protected procedures (admin only)
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return db.select().from(schema.posts).orderBy(desc(schema.posts.createdAt));
  }),

  getById: protectedProcedure.input(z.string()).query(async ({ input }) => {
    const [post] = await db
      .select()
      .from(schema.posts)
      .where(eq(schema.posts.id, parseInt(input)))
      .limit(1);
    return post;
  }),

  create: protectedProcedure
    .input(createPostSchema)
    .mutation(async ({ ctx, input }) => {
      const { tags, ...postData } = input;

      // Generate slug from title
      const slug = postData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      const [post] = await db
        .insert(schema.posts)
        .values({
          title: postData.title,
          content: postData.content,
          excerpt: postData.excerpt,
          featuredImage: postData.featuredImage,
          seoTitle: postData.seoTitle,
          seoDescription: postData.seoDescription,
          slug,
          published: postData.published ? 1 : 0,
          publishedAt: postData.published ? new Date() : null,
          authorId: parseInt(ctx.session.user.id),
        })
        .returning();

      if (tags.length > 0) {
        const tagRecords = await Promise.all(
          tags.map(async (tagName) => {
            const [tag] = await db
              .insert(schema.tags)
              .values({ name: tagName })
              .onConflictDoUpdate({
                target: schema.tags.name,
                set: { name: tagName },
              })
              .returning();
            return tag;
          }),
        );

        await db.insert(schema.postTag).values(
          tagRecords.map((tag) => ({
            postId: post.id,
            tagId: tag.id,
          })),
        );
      }

      return post;
    }),

  update: protectedProcedure
    .input(updatePostSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, tags, ...postData } = input;

      const [post] = await db
        .update(schema.posts)
        .set({
          title: postData.title,
          content: postData.content,
          excerpt: postData.excerpt,
          featuredImage: postData.featuredImage,
          seoTitle: postData.seoTitle,
          seoDescription: postData.seoDescription,
          published:
            postData.published !== undefined
              ? postData.published
                ? 1
                : 0
              : undefined,
          publishedAt:
            postData.published !== undefined
              ? postData.published
                ? new Date()
                : null
              : undefined,
        })
        .where(eq(schema.posts.id, parseInt(id)))
        .returning();

      if (tags !== undefined) {
        await db
          .delete(schema.postTag)
          .where(eq(schema.postTag.postId, parseInt(id)));

        if (tags.length > 0) {
          const tagRecords = await Promise.all(
            tags.map(async (tagName) => {
              const [tag] = await db
                .insert(schema.tags)
                .values({ name: tagName })
                .onConflictDoUpdate({
                  target: schema.tags.name,
                  set: { name: tagName },
                })
                .returning();
              return tag;
            }),
          );

          await db.insert(schema.postTag).values(
            tagRecords.map((tag) => ({
              postId: post.id,
              tagId: tag.id,
            })),
          );
        }
      }

      return post;
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      await db.delete(schema.posts).where(eq(schema.posts.id, parseInt(input)));
    }),
});
