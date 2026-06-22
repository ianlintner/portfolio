import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    date: z.union([z.string(), z.date()]),
    excerpt: z.string(),
    tags: z.array(z.string()).optional().default([]),
    author: z.string().optional().default("Ian Lintner"),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
  }),
});

export const collections = { blog };
