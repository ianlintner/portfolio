// Types based on Prisma schema models (matching API responses)
export interface User {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "EDITOR";
  passwordHash: string;
  posts?: Post[];
  createdAt: Date;
  updatedAt: Date;
}

// Lightweight author type for API responses
export interface Author {
  name: string;
  email: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string | null;
  published: boolean;
  publishedAt?: Date | null;
  featuredImage?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  seoKeywords: string[];
  authorId: string;
  author?: Author;
  tags: PostTag[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Tag {
  id: string;
  name: string;
  posts?: PostTag[];
}

export interface PostTag {
  postId: string;
  tagId: string;
  tag: {
    id: string;
    name: string;
  };
}

export interface ComponentDemo {
  id: string;
  name: string;
  description: string;
  code: string;
  demoUrl?: string | null;
  category:
    | "REACT"
    | "NEXTJS"
    | "TYPESCRIPT"
    | "CSS"
    | "ANIMATION"
    | "API"
    | "DATABASE";
  technologies: string[];
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type UserRole = "ADMIN" | "EDITOR";

export type DemoCategory =
  | "REACT"
  | "NEXTJS"
  | "TYPESCRIPT"
  | "CSS"
  | "ANIMATION"
  | "API"
  | "DATABASE";
