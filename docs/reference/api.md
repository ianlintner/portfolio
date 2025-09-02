# API Reference

Complete API reference for the Portfolio application's tRPC endpoints.

## Overview

The Portfolio API is built with tRPC, providing type-safe API calls between the frontend and backend. All endpoints are automatically typed and include runtime validation.

## Base URL

```
Local Development: http://localhost:3000/api/trpc
Production: https://your-domain.com/api/trpc
```

## Authentication

Most endpoints require authentication using NextAuth.js sessions. Protected endpoints will return `UNAUTHORIZED` if no valid session is present.

## Router Structure

```typescript
AppRouter {
  auth: AuthRouter
  blog: BlogRouter  
  user: UserRouter
  component: ComponentRouter
  upload: UploadRouter
}
```

## Auth Router

### `auth.getSession`

Get the current user session.

**Type:** Query  
**Auth:** Public

```typescript
// Input
// No input required

// Output
{
  user: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
    role: string;
  } | null;
  expires: string;
} | null
```

**Example:**

```typescript
const { data: session } = api.auth.getSession.useQuery();
```

### `auth.getSecretMessage`

Get a secret message (demo endpoint for protected routes).

**Type:** Query  
**Auth:** Protected

```typescript
// Output
string
```

## Blog Router

### `blog.getAll`

Get all blog posts with pagination.

**Type:** Query  
**Auth:** Public

```typescript
// Input
{
  limit?: number; // Default: 10, Max: 100
  cursor?: string; // Cursor for pagination
  published?: boolean; // Filter by published status
}

// Output
{
  posts: BlogPost[];
  nextCursor: string | null;
}

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
  author: {
    id: string;
    name: string | null;
    image: string | null;
  };
  tags: BlogPostTag[];
}
```

**Example:**

```typescript
const { data: posts } = api.blog.getAll.useQuery({
  limit: 5,
  published: true
});
```

### `blog.getBySlug`

Get a blog post by its slug.

**Type:** Query  
**Auth:** Public

```typescript
// Input
{
  slug: string;
}

// Output
BlogPost | null
```

**Example:**

```typescript
const { data: post } = api.blog.getBySlug.useQuery({
  slug: "my-first-post"
});
```

### `blog.getById`

Get a blog post by its ID.

**Type:** Query  
**Auth:** Public (only published posts for non-authors)

```typescript
// Input
{
  id: string;
}

// Output
BlogPost | null
```

### `blog.create`

Create a new blog post.

**Type:** Mutation  
**Auth:** Protected

```typescript
// Input
{
  title: string; // Min: 1, Max: 200
  content: string; // Min: 1
  slug: string; // Format: /^[a-z0-9-]+$/
  excerpt?: string;
  published?: boolean; // Default: false
  tagIds?: string[]; // Array of tag IDs
}

// Output
BlogPost
```

**Example:**

```typescript
const createPost = api.blog.create.useMutation();

await createPost.mutateAsync({
  title: "My New Post",
  content: "This is the content...",
  slug: "my-new-post",
  published: true
});
```

### `blog.update`

Update an existing blog post.

**Type:** Mutation  
**Auth:** Protected (author or admin only)

```typescript
// Input
{
  id: string;
  title?: string;
  content?: string;
  slug?: string;
  excerpt?: string;
  published?: boolean;
  tagIds?: string[];
}

// Output
BlogPost
```

### `blog.delete`

Delete a blog post.

**Type:** Mutation  
**Auth:** Protected (author or admin only)

```typescript
// Input
{
  id: string;
}

// Output
BlogPost
```

### `blog.getByAuthor`

Get blog posts by a specific author.

**Type:** Query  
**Auth:** Public

```typescript
// Input
{
  authorId: string;
  limit?: number;
  cursor?: string;
  published?: boolean;
}

// Output
{
  posts: BlogPost[];
  nextCursor: string | null;
}
```

## User Router

### `user.getCurrent`

Get the current authenticated user's profile.

**Type:** Query  
**Auth:** Protected

```typescript
// Output
{
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  _count: {
    blogPosts: number;
    uploads: number;
  };
}
```

### `user.updateProfile`

Update the current user's profile.

**Type:** Mutation  
**Auth:** Protected

```typescript
// Input
{
  name?: string;
  image?: string;
}

// Output
User
```

### `user.getAll`

Get all users (admin only).

**Type:** Query  
**Auth:** Admin

```typescript
// Input
{
  limit?: number;
  cursor?: string;
  role?: 'USER' | 'ADMIN';
}

// Output
{
  users: User[];
  nextCursor: string | null;
}
```

### `user.updateRole`

Update a user's role (admin only).

**Type:** Mutation  
**Auth:** Admin

```typescript
// Input
{
  userId: string;
  role: 'USER' | 'ADMIN';
}

// Output
User
```

### `user.delete`

Delete a user account (admin only, cannot delete self).

**Type:** Mutation  
**Auth:** Admin

```typescript
// Input
{
  userId: string;
}

// Output
User
```

## Component Router

### `component.getAll`

Get all UI components for the component showcase.

**Type:** Query  
**Auth:** Public

```typescript
// Input
{
  category?: string;
  published?: boolean;
  limit?: number;
  cursor?: string;
}

// Output
{
  components: Component[];
  nextCursor: string | null;
}

type Component = {
  id: string;
  name: string;
  category: string;
  description: string | null;
  code: string;
  props: Record<string, any> | null;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### `component.getByCategory`

Get components by category.

**Type:** Query  
**Auth:** Public

```typescript
// Input
{
  category: string;
  published?: boolean;
}

// Output
Component[]
```

### `component.create`

Create a new component (admin only).

**Type:** Mutation  
**Auth:** Admin

```typescript
// Input
{
  name: string;
  category: string;
  description?: string;
  code: string;
  props?: Record<string, any>;
  published?: boolean;
}

// Output
Component
```

### `component.update`

Update a component (admin only).

**Type:** Mutation  
**Auth:** Admin

```typescript
// Input
{
  id: string;
  name?: string;
  category?: string;
  description?: string;
  code?: string;
  props?: Record<string, any>;
  published?: boolean;
}

// Output
Component
```

### `component.delete`

Delete a component (admin only).

**Type:** Mutation  
**Auth:** Admin

```typescript
// Input
{
  id: string;
}

// Output
Component
```

## Upload Router

### `upload.getSignedUrl`

Get a signed URL for uploading files to Google Cloud Storage.

**Type:** Mutation  
**Auth:** Protected

```typescript
// Input
{
  filename: string;
  contentType: string; // MIME type
  size: number; // File size in bytes
}

// Output
{
  uploadUrl: string; // Signed URL for uploading
  publicUrl: string; // Public URL after upload
  uploadId: string; // Upload record ID
}
```

**Example:**

```typescript
const getSignedUrl = api.upload.getSignedUrl.useMutation();

const { uploadUrl, publicUrl } = await getSignedUrl.mutateAsync({
  filename: "image.jpg",
  contentType: "image/jpeg",
  size: 1024000
});

// Upload file to signed URL
await fetch(uploadUrl, {
  method: 'PUT',
  body: file,
  headers: {
    'Content-Type': 'image/jpeg'
  }
});
```

### `upload.getAll`

Get all uploads for the current user.

**Type:** Query  
**Auth:** Protected

```typescript
// Input
{
  limit?: number;
  cursor?: string;
  mimeType?: string; // Filter by MIME type
}

// Output
{
  uploads: Upload[];
  nextCursor: string | null;
}

type Upload = {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  createdAt: Date;
  userId: string;
}
```

### `upload.delete`

Delete an upload record and file.

**Type:** Mutation  
**Auth:** Protected (owner only)

```typescript
// Input
{
  uploadId: string;
}

// Output
Upload
```

### `upload.getAllAdmin`

Get all uploads (admin only).

**Type:** Query  
**Auth:** Admin

```typescript
// Input
{
  limit?: number;
  cursor?: string;
  userId?: string; // Filter by user
  mimeType?: string;
}

// Output
{
  uploads: Upload[];
  nextCursor: string | null;
}
```

## Tag Router

### `tag.getAll`

Get all tags.

**Type:** Query  
**Auth:** Public

```typescript
// Output
Tag[]

type Tag = {
  id: string;
  name: string;
  color: string | null;
  createdAt: Date;
  _count: {
    blogPosts: number;
  };
}
```

### `tag.create`

Create a new tag (admin only).

**Type:** Mutation  
**Auth:** Admin

```typescript
// Input
{
  name: string; // Unique
  color?: string; // Hex color code
}

// Output
Tag
```

### `tag.update`

Update a tag (admin only).

**Type:** Mutation  
**Auth:** Admin

```typescript
// Input
{
  id: string;
  name?: string;
  color?: string;
}

// Output
Tag
```

### `tag.delete`

Delete a tag (admin only).

**Type:** Mutation  
**Auth:** Admin

```typescript
// Input
{
  id: string;
}

// Output
Tag
```

## Error Responses

All endpoints may return the following error codes:

```typescript
type TRPCError = {
  code: 
    | 'BAD_REQUEST'          // Invalid input
    | 'UNAUTHORIZED'         // Authentication required
    | 'FORBIDDEN'           // Insufficient permissions
    | 'NOT_FOUND'           // Resource not found
    | 'CONFLICT'            // Resource conflict
    | 'INTERNAL_SERVER_ERROR' // Server error
    | 'TIMEOUT'             // Request timeout
    | 'TOO_MANY_REQUESTS';  // Rate limit exceeded
  
  message: string;
  data?: {
    code?: string;
    httpStatus?: number;
    stack?: string;
    path?: string;
  };
}
```

## Rate Limiting

API endpoints are rate-limited to prevent abuse:

- **General endpoints**: 100 requests per minute
- **Upload endpoints**: 10 requests per minute
- **Auth endpoints**: 20 requests per minute

Rate limit headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

## Pagination

All list endpoints support cursor-based pagination:

```typescript
// First page
const { data } = api.blog.getAll.useQuery({ limit: 10 });

// Next page
const { data: nextPage } = api.blog.getAll.useQuery({ 
  limit: 10, 
  cursor: data.nextCursor 
});
```

## Client Usage Examples

### React Hook Examples

```typescript
// Query with loading and error states
function BlogList() {
  const { 
    data, 
    isLoading, 
    error,
    refetch 
  } = api.blog.getAll.useQuery();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data?.posts.map(post => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  );
}

// Mutation with optimistic updates
function CreatePostForm() {
  const utils = api.useContext();
  
  const createPost = api.blog.create.useMutation({
    onSuccess: () => {
      utils.blog.getAll.invalidate();
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  const handleSubmit = (data) => {
    createPost.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
}

// Infinite query for pagination
function InfiniteBlogList() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = api.blog.getAll.useInfiniteQuery(
    { limit: 10 },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  return (
    <div>
      {data?.pages.map((page) =>
        page.posts.map((post) => (
          <div key={post.id}>{post.title}</div>
        ))
      )}
      
      {hasNextPage && (
        <button 
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
        >
          Load More
        </button>
      )}
    </div>
  );
}
```

For more detailed examples and advanced usage patterns, see the [Development Guide](../development/api.md).