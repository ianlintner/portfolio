"use client";

import { trpc } from "../../utils/trpc";

export default function AdminDashboard() {
  const { data: posts, isLoading: postsLoading } = trpc.post.getAll.useQuery();
  const { data: demos, isLoading: demosLoading } = trpc.demo.getAll.useQuery();
  const { data: session } = trpc.auth.getSession.useQuery();

  const publishedPosts = posts?.filter((post) => post.published) || [];
  const draftPosts = posts?.filter((post) => !post.published) || [];
  const publishedDemos = demos?.filter((demo) => demo.published) || [];
  const draftDemos = demos?.filter((demo) => !demo.published) || [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {session?.user.name}. Here&apos;s an overview of your
          content.
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card text-card-foreground rounded-lg border p-6">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Total Posts</h3>
            <svg
              className="h-4 w-4 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <div>
            <div className="text-2xl font-bold">
              {postsLoading ? "..." : posts?.length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {publishedPosts.length} published, {draftPosts.length} drafts
            </p>
          </div>
        </div>

        <div className="bg-card text-card-foreground rounded-lg border p-6">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Demos</h3>
            <svg
              className="h-4 w-4 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
              />
            </svg>
          </div>
          <div>
            <div className="text-2xl font-bold">
              {demosLoading ? "..." : demos?.length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {publishedDemos.length} published, {draftDemos.length} drafts
            </p>
          </div>
        </div>

        <div className="bg-card text-card-foreground rounded-lg border p-6">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Published Content</h3>
            <svg
              className="h-4 w-4 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          </div>
          <div>
            <div className="text-2xl font-bold">
              {publishedPosts.length + publishedDemos.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Total published items
            </p>
          </div>
        </div>

        <div className="bg-card text-card-foreground rounded-lg border p-6">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Drafts</h3>
            <svg
              className="h-4 w-4 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </div>
          <div>
            <div className="text-2xl font-bold">
              {draftPosts.length + draftDemos.length}
            </div>
            <p className="text-xs text-muted-foreground">Items in draft</p>
          </div>
        </div>
      </div>

      {/* Recent Posts */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Recent Posts</h2>
        <div className="bg-card text-card-foreground rounded-lg border">
          {postsLoading ? (
            <div className="p-6 text-center">Loading posts...</div>
          ) : posts?.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">
              No posts yet. Create your first post!
            </div>
          ) : (
            <div className="divide-y">
              {posts?.slice(0, 5).map((post) => (
                <div
                  key={post.id}
                  className="p-4 flex items-center justify-between"
                >
                  <div>
                    <h3 className="font-medium">{post.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {post.published ? "Published" : "Draft"} •{" "}
                      {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {post.published ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Published
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Draft
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="/admin/posts/new"
            className="p-6 bg-card text-card-foreground rounded-lg border hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <div className="flex items-center space-x-3">
              <svg
                className="h-8 w-8 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <div>
                <h3 className="font-medium">Create New Post</h3>
                <p className="text-sm text-muted-foreground">
                  Write a new blog post
                </p>
              </div>
            </div>
          </a>
          <a
            href="/admin/demos/new"
            className="p-6 bg-card text-card-foreground rounded-lg border hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <div className="flex items-center space-x-3">
              <svg
                className="h-8 w-8 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                />
              </svg>
              <div>
                <h3 className="font-medium">Create New Demo</h3>
                <p className="text-sm text-muted-foreground">
                  Add a component demonstration
                </p>
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
