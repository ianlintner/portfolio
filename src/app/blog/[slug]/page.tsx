import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Tag,
  Share2,
  BookOpen,
} from "lucide-react";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";

import { getPostBySlug } from "@/lib/posts";

// Removed stray markdown/blog content accidentally placed in this file
// Blog post content should live in MDX files under src/app/blog/*.mdx
// This file should only contain the page component logic
interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const { meta } = getPostBySlug(resolvedParams.slug);

  if (!meta) {
    return {
      title: "Post Not Found | Ian Lintner",
    };
  }

  return {
    title: `${meta.title} | Ian Lintner`,
    description: meta.excerpt,
    keywords: meta.tags ?? [],
    openGraph: {
      title: meta.title,
      description: meta.excerpt,
      type: "article",
      publishedTime: new Date(meta.date).toISOString(),
      authors: [meta.author ?? "Ian Lintner"],
      tags: meta.tags ?? [],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.excerpt,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const resolvedParams = await params;
  const { meta, content } = getPostBySlug(resolvedParams.slug);

  if (!meta) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Navigation */}
          <div className="mb-8">
            <Link
              href="/blog"
              className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Link>
          </div>

          {/* Article Header */}
          <header className="mb-12">
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>
                  {new Date(meta.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>10 min read</span>
              </div>
              <div className="flex items-center gap-1">
                <BookOpen className="h-4 w-4" />
                <span>{"Ian Lintner"}</span>
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
              {meta.title}
            </h1>

            <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
              {meta.excerpt}
            </p>

            {/* Tags not yet implemented from MDX frontmatter */}

            {/* Share Button */}
            <div className="flex items-center gap-4 pt-6 border-t border-border">
              <span className="text-sm text-muted-foreground">
                Share this article:
              </span>
              <button className="inline-flex items-center gap-1 px-3 py-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <Share2 className="h-4 w-4" />
                Share
              </button>
            </div>
          </header>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none dark:prose-invert transition-colors">
            <MarkdownRenderer content={content} />
          </div>

          {/* Article Footer */}
          <footer className="mt-16 pt-8 border-t border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-lg font-semibold text-primary">
                    {"I"}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold">{"Ian Lintner"}</h3>
                  <p className="text-sm text-muted-foreground">
                    Full Stack Developer
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-sm text-muted-foreground">Published on</p>
                <p className="font-medium">
                  {new Date(meta.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
