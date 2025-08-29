'use client'

import { useState } from 'react'
import { trpc } from '@/utils/trpc'
import Link from 'next/link'

export default function PostsManagement() {
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all')
  
  const { data: posts, isLoading, refetch } = trpc.post.getAll.useQuery()
  const deleteMutation = trpc.post.delete.useMutation({
    onSuccess: () => {
      refetch()
    }
  })

  const filteredPosts = posts?.filter((post) => {
    if (filter === 'published') return post.published
    if (filter === 'draft') return !post.published
    return true
  }) || []

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        await deleteMutation.mutateAsync(id)
      } catch (error) {
        alert('Failed to delete post. Please try again.')
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Posts</h1>
          <p className="text-muted-foreground">
            Manage your blog posts
          </p>
        </div>
        <Link
          href="/admin/posts/new"
          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4"
        >
          Create New Post
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-1">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            filter === 'all'
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted'
          }`}
        >
          All Posts
        </button>
        <button
          onClick={() => setFilter('published')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            filter === 'published'
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted'
          }`}
        >
          Published
        </button>
        <button
          onClick={() => setFilter('draft')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            filter === 'draft'
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted'
          }`}
        >
          Drafts
        </button>
      </div>

      {/* Posts Table */}
      <div className="bg-card text-card-foreground rounded-lg border">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-sm text-muted-foreground">Loading posts...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="p-8 text-center">
            <h3 className="text-lg font-medium">No posts found</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {filter === 'all' 
                ? 'You haven\'t created any posts yet.'
                : `No ${filter} posts found.`
              }
            </p>
            <Link
              href="/admin/posts/new"
              className="mt-4 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4"
            >
              Create Your First Post
            </Link>
          </div>
        ) : (
          <div className="divide-y">
            {filteredPosts.map((post) => (
              <div key={post.id} className="p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-medium truncate">
                        {post.title}
                      </h3>
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
                    <p className="mt-1 text-sm text-muted-foreground">
                      {post.excerpt || 'No excerpt available'}
                    </p>
                    <div className="mt-2 flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>By {post.author.name}</span>
                      <span>•</span>
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                      {post.tags.length > 0 && (
                        <>
                          <span>•</span>
                          <div className="flex items-center space-x-1">
                            {post.tags.slice(0, 3).map((postTag) => (
                              <span
                                key={postTag.tag.id}
                                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-secondary text-secondary-foreground"
                              >
                                {postTag.tag.name}
                              </span>
                            ))}
                            {post.tags.length > 3 && (
                              <span className="text-xs text-muted-foreground">
                                +{post.tags.length - 3} more
                              </span>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <Link
                      href={`/admin/posts/${post.id}/edit`}
                      className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 px-3"
                    >
                      Edit
                    </Link>
                    {post.published && (
                      <a
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 px-3"
                      >
                        View
                      </a>
                    )}
                    <button
                      onClick={() => handleDelete(post.id, post.title)}
                      disabled={deleteMutation.isLoading}
                      className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-destructive text-destructive-foreground hover:bg-destructive/90 h-8 px-3"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
