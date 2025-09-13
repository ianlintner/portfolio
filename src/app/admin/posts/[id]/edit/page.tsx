"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { trpc } from "../../../../../utils/trpc";

export default function EditPost() {
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [published, setPublished] = useState(false);
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [seoKeywords, setSeoKeywords] = useState("");

  const { data: post, isLoading } = trpc.post.getById.useQuery(postId, {
    select: (p) => ({
      id: p.id,
      title: p.title,
      excerpt: p.excerpt ?? "",
      content: p.content ?? "",
      tags:
        "tags" in p &&
        Array.isArray((p as { tags?: { tag: { name: string } }[] }).tags)
          ? (p as { tags: { tag: { name: string } }[] }).tags.map(
              (pt) => pt.tag.name,
            )
          : [],
      published: Boolean(p.published),
      seoTitle: p.seoTitle ?? "",
      seoDescription: p.seoDescription ?? "",
      seoKeywords: Array.isArray(p.seoKeywords) ? p.seoKeywords : [],
      createdAt: p.createdAt,
      updatedAt: (p as unknown as { updatedAt?: Date }).updatedAt ?? new Date(),
      authorId: p.authorId,
      slug: p.slug,
    }),
  });
  const updateMutation = trpc.post.update.useMutation({
    onSuccess: () => {
      router.push("/admin/posts");
    },
    onError: (error) => {
      alert(`Failed to update post: ${error.message}`);
    },
  });

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setExcerpt(post.excerpt || "");
      setContent(post.content || "");
      setTags((post.tags ?? []).join(", "));
      setPublished(post.published);
      setSeoTitle(post.seoTitle || "");
      setSeoDescription(post.seoDescription || "");
      setSeoKeywords((post.seoKeywords ?? []).join(", "));
    }
  }, [post]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert("Title and content are required");
      return;
    }

    const tagArray = tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);
    const keywordsArray = seoKeywords
      .split(",")
      .map((kw) => kw.trim())
      .filter((kw) => kw.length > 0);

    try {
      await updateMutation.mutateAsync({
        id: postId,
        title: title.trim(),
        excerpt: excerpt.trim() || undefined,
        content: content.trim(),
        tags: tagArray,
        published,
        seoTitle: seoTitle.trim() || undefined,
        seoDescription: seoDescription.trim() || undefined,
        seoKeywords: keywordsArray,
      });
    } catch (error) {
      // Error handled by onError callback
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold">Post not found</h2>
        <p className="text-muted-foreground mt-2">
          The post you&apos;re looking for doesn&apos;t exist.
        </p>
        <button
          onClick={() => router.push("/admin/posts")}
          className="mt-4 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4"
        >
          Back to Posts
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Edit Post</h1>
          <p className="text-muted-foreground">Update your blog post</p>
        </div>
        <div className="flex space-x-2">
          {post.published && (
            <a
              href={`/blog/${post.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 py-2 px-4"
            >
              View Live
            </a>
          )}
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 py-2 px-4"
          >
            Cancel
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Title *
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Enter post title"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="excerpt" className="text-sm font-medium">
                Excerpt
              </label>
              <textarea
                id="excerpt"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={3}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Brief description of your post"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="content" className="text-sm font-medium">
                Content *
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={20}
                className="flex min-h-[400px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-mono"
                placeholder="Write your post content in Markdown..."
                required
              />
              <p className="text-xs text-muted-foreground">
                You can use Markdown formatting for your content.
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Post Info */}
            <div className="rounded-lg border p-4 space-y-2">
              <h3 className="font-medium">Post Information</h3>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>
                  <strong>Created:</strong>{" "}
                  {new Date(post.createdAt).toLocaleString()}
                </p>
                <p>
                  <strong>Updated:</strong>{" "}
                  {new Date(post.updatedAt).toLocaleString()}
                </p>
                <p>
                  <strong>Author ID:</strong> {post.authorId}
                </p>
                <p>
                  <strong>Slug:</strong> {post.slug}
                </p>
              </div>
            </div>

            {/* Publish Settings */}
            <div className="rounded-lg border p-4 space-y-4">
              <h3 className="font-medium">Publish</h3>
              <div className="flex items-center space-x-2">
                <input
                  id="published"
                  type="checkbox"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary focus:ring-offset-0"
                />
                <label htmlFor="published" className="text-sm font-medium">
                  {published ? "Published" : "Publish this post"}
                </label>
              </div>
              <p className="text-xs text-muted-foreground">
                {published
                  ? "This post is currently visible to visitors."
                  : "This post is currently saved as a draft and not visible to visitors."}
              </p>
            </div>

            {/* Tags */}
            <div className="rounded-lg border p-4 space-y-4">
              <h3 className="font-medium">Tags</h3>
              <div className="space-y-2">
                <input
                  id="tags"
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="React, Next.js, TypeScript"
                />
                <p className="text-xs text-muted-foreground">
                  Separate tags with commas
                </p>
              </div>
            </div>

            {/* SEO Settings */}
            <div className="rounded-lg border p-4 space-y-4">
              <h3 className="font-medium">SEO Settings</h3>

              <div className="space-y-2">
                <label htmlFor="seoTitle" className="text-sm font-medium">
                  SEO Title
                </label>
                <input
                  id="seoTitle"
                  type="text"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Custom title for search engines"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="seoDescription" className="text-sm font-medium">
                  SEO Description
                </label>
                <textarea
                  id="seoDescription"
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  rows={3}
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Description for search engines and social media"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="seoKeywords" className="text-sm font-medium">
                  SEO Keywords
                </label>
                <input
                  id="seoKeywords"
                  type="text"
                  value={seoKeywords}
                  onChange={(e) => setSeoKeywords(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="web development, react, tutorial"
                />
                <p className="text-xs text-muted-foreground">
                  Separate keywords with commas
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4"
            >
              {updateMutation.isPending ? "Updating..." : "Update Post"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
