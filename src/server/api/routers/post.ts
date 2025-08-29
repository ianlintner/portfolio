import { z } from 'zod'
import { createTRPCRouter, publicProcedure, protectedProcedure } from '@/server/api/trpc'

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
})

const updatePostSchema = createPostSchema.partial().extend({
  id: z.string(),
})

export const postRouter = createTRPCRouter({
  // Public procedures
  getPublished: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
        cursor: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const posts = await ctx.db.post.findMany({
        where: { published: true },
        orderBy: { publishedAt: 'desc' },
        take: input.limit + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        include: {
          author: {
            select: { name: true, email: true },
          },
          tags: {
            include: {
              tag: true,
            },
          },
        },
      })

      let nextCursor: typeof input.cursor | undefined = undefined
      if (posts.length > input.limit) {
        const nextItem = posts.pop()
        nextCursor = nextItem!.id
      }

      return {
        posts,
        nextCursor,
      }
    }),

  getBySlug: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const post = await ctx.db.post.findUnique({
        where: { slug: input },
        include: {
          author: {
            select: { name: true, email: true },
          },
          tags: {
            include: {
              tag: true,
            },
          },
        },
      })

      if (!post || !post.published) {
        throw new Error('Post not found')
      }

      return post
    }),

  // Protected procedures (admin only)
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.post.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: { name: true, email: true },
        },
        tags: {
          include: {
            tag: true,
          },
        },
      },
    })
  }),

  getById: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return ctx.db.post.findUnique({
        where: { id: input },
        include: {
          tags: {
            include: {
              tag: true,
            },
          },
        },
      })
    }),

  create: protectedProcedure
    .input(createPostSchema)
    .mutation(async ({ ctx, input }) => {
      const { tags, ...postData } = input
      
      // Generate slug from title
      const slug = postData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')

      const post = await ctx.db.post.create({
        data: {
          ...postData,
          slug,
          publishedAt: postData.published ? new Date() : null,
          authorId: ctx.session.user.id,
        },
      })

      // Handle tags
      if (tags.length > 0) {
        const tagRecords = await Promise.all(
          tags.map(async (tagName) => {
            return ctx.db.tag.upsert({
              where: { name: tagName },
              update: {},
              create: { name: tagName },
            })
          })
        )

        await ctx.db.postTag.createMany({
          data: tagRecords.map((tag) => ({
            postId: post.id,
            tagId: tag.id,
          })),
        })
      }

      return post
    }),

  update: protectedProcedure
    .input(updatePostSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, tags, ...postData } = input

      const post = await ctx.db.post.update({
        where: { id },
        data: {
          ...postData,
          publishedAt:
            postData.published !== undefined
              ? postData.published
                ? new Date()
                : null
              : undefined,
        },
      })

      // Handle tags if provided
      if (tags !== undefined) {
        // Remove existing tags
        await ctx.db.postTag.deleteMany({
          where: { postId: id },
        })

        // Add new tags
        if (tags.length > 0) {
          const tagRecords = await Promise.all(
            tags.map(async (tagName) => {
              return ctx.db.tag.upsert({
                where: { name: tagName },
                update: {},
                create: { name: tagName },
              })
            })
          )

          await ctx.db.postTag.createMany({
            data: tagRecords.map((tag) => ({
              postId: id,
              tagId: tag.id,
            })),
          })
        }
      }

      return post
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      await ctx.db.post.delete({
        where: { id: input },
      })
    }),
})
