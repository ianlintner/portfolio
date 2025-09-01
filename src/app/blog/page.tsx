import { Metadata } from "next";
import Link from "next/link";
import { Calendar, Clock, Tag, ArrowRight, Search } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog | Ian Lintner - Full Stack Developer",
  description:
    "Technical articles about modern web development, React, Next.js, TypeScript, and cloud technologies. Learn from real-world projects and best practices.",
  keywords: [
    "web development",
    "React",
    "Next.js",
    "TypeScript",
    "cloud computing",
    "full stack development",
  ],
  openGraph: {
    title: "Blog | Ian Lintner - Full Stack Developer",
    description:
      "Technical articles about modern web development, React, Next.js, TypeScript, and cloud technologies.",
    type: "website",
    url: "/blog",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | Ian Lintner - Full Stack Developer",
    description:
      "Technical articles about modern web development, React, Next.js, TypeScript, and cloud technologies.",
  },
};

// Mock data for now - will be replaced with tRPC calls
const mockPosts = [
  {
    id: "1",
    title: "Building a Modern Next.js Portfolio with TypeScript and tRPC",
    slug: "modern-nextjs-portfolio-typescript-trpc",
    excerpt:
      "Learn how to build a full-stack portfolio website using Next.js 14, TypeScript, tRPC, and Prisma. This comprehensive guide covers everything from setup to deployment.",
    createdAt: new Date("2024-01-15"),
    author: { name: "Ian Lintner" },
    tags: [
      { tag: { id: "1", name: "Next.js" } },
      { tag: { id: "2", name: "TypeScript" } },
      { tag: { id: "3", name: "tRPC" } },
    ],
  },
  {
    id: "2",
    title: "Deploying to Google Kubernetes Engine with GitOps and ArgoCD",
    slug: "deploying-gke-gitops-argocd",
    excerpt:
      "A complete guide to setting up a production-ready Kubernetes deployment pipeline using Google Cloud Platform, GitOps principles, and ArgoCD for automated deployments.",
    createdAt: new Date("2024-01-10"),
    author: { name: "Ian Lintner" },
    tags: [
      { tag: { id: "4", name: "Kubernetes" } },
      { tag: { id: "5", name: "Google Cloud" } },
      { tag: { id: "6", name: "DevOps" } },
    ],
  },
  {
    id: "3",
    title: "Advanced React Patterns: Custom Hooks and Context Management",
    slug: "advanced-react-patterns-hooks-context",
    excerpt:
      "Dive deep into advanced React patterns including custom hooks, context optimization, and state management strategies for large-scale applications.",
    createdAt: new Date("2024-01-05"),
    author: { name: "Ian Lintner" },
    tags: [
      { tag: { id: "7", name: "React" } },
      { tag: { id: "8", name: "JavaScript" } },
      { tag: { id: "9", name: "State Management" } },
    ],
  },
];

const mockTags = [
  { id: "1", name: "Next.js" },
  { id: "2", name: "TypeScript" },
  { id: "3", name: "React" },
  { id: "4", name: "Kubernetes" },
  { id: "5", name: "Google Cloud" },
  { id: "6", name: "DevOps" },
  { id: "7", name: "tRPC" },
  { id: "8", name: "JavaScript" },
  { id: "9", name: "Prisma" },
  { id: "10", name: "CSS" },
];

export default function BlogPage() {
  const posts = mockPosts;
  const tags = mockTags;

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors dark:bg-gray-950 dark:text-gray-100">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-background to-accent/30 dark:from-gray-900 dark:to-primary/20 py-16 border-b transition-colors">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
              Technical Blog
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Insights, tutorials, and thoughts on modern web development, cloud
              architecture, and building scalable applications.
            </p>

            {/* Search Bar */}
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search articles..."
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              {posts.length === 0 ? (
                <div className="text-center py-16">
                  <h2 className="text-2xl font-semibold mb-4">
                    No posts found
                  </h2>
                  <p className="text-muted-foreground">
                    Check back soon for new content!
                  </p>
                </div>
              ) : (
                <div className="space-y-8">
                  {posts.map((post) => (
                    <article
                      key={post.id}
                      className="group bg-card border border-border rounded-xl p-6 hover:shadow-lg hover:border-primary/20 transition-all duration-300"
                    >
                      <div className="flex flex-col space-y-4">
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {new Date(post.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                },
                              )}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>5 min read</span>
                          </div>
                        </div>

                        <div>
                          <h2 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors text-gray-900 dark:text-gray-100">
                            <Link href={`/blog/${post.slug}`}>
                              {post.title}
                            </Link>
                          </h2>
                          <p className="text-muted-foreground leading-relaxed line-clamp-3">
                            {post.excerpt}
                          </p>
                        </div>

                        {post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {post.tags.map((tagRelation) => (
                              <span
                                key={tagRelation.tag.id}
                                className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-primary/10 dark:bg-primary/20 text-primary text-sm font-medium"
                              >
                                <Tag className="h-3 w-3" />
                                <span>{tagRelation.tag.name}</span>
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-4 border-t border-border">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                              <span className="text-sm font-semibold text-primary">
                                {post.author.name?.[0] || "A"}
                              </span>
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {post.author.name || "Anonymous"}
                            </span>
                          </div>

                          <Link
                            href={`/blog/${post.slug}`}
                            className="inline-flex items-center text-primary hover:text-primary/80 font-medium text-sm group/link"
                          >
                            Read More
                            <ArrowRight className="ml-1 h-4 w-4 group-hover/link:translate-x-1 transition-transform" />
                          </Link>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}

              {/* Pagination - will be implemented later */}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-8">
              {/* Popular Tags */}
              {tags && tags.length > 0 && (
                <div className="bg-card border border-border rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-4">Popular Topics</h3>
                  <div className="flex flex-wrap gap-2">
                    {tags.slice(0, 10).map((tag) => (
                      <button
                        key={tag.id}
                        className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-accent hover:bg-primary hover:text-primary-foreground text-sm font-medium transition-colors"
                      >
                        <Tag className="h-3 w-3" />
                        <span>{tag.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Newsletter Signup */}
              <div className="bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-3">Stay Updated</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Get notified when I publish new articles about web development
                  and cloud technologies.
                </p>
                <div className="space-y-3">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full px-3 py-2 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm"
                  />
                  <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm font-medium">
                    Subscribe
                  </button>
                </div>
              </div>

              {/* Recent Posts */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4">Recent Articles</h3>
                <div className="space-y-4">
                  {posts.slice(0, 3).map((post) => (
                    <Link
                      key={post.id}
                      href={`/blog/${post.slug}`}
                      className="block group"
                    >
                      <h4 className="text-sm font-medium group-hover:text-primary transition-colors line-clamp-2 mb-1">
                        {post.title}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
