# Code Style Guide

Coding standards and style guidelines for the Portfolio project.

## Overview

This document outlines the coding standards, formatting rules, and best practices for maintaining consistent code quality across the Portfolio project.

## General Principles

1. **Consistency**: Follow established patterns throughout the codebase
2. **Readability**: Write code that is easy to read and understand
3. **Maintainability**: Structure code for easy maintenance and modification
4. **Type Safety**: Leverage TypeScript for robust type checking
5. **Performance**: Write efficient code that follows React best practices

## TypeScript Guidelines

### Type Definitions

```typescript
// ✅ Use interfaces for object shapes
interface UserProps {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
}

// ✅ Use type aliases for unions and complex types
type Theme = 'light' | 'dark';
type ApiResponse<T> = {
  data: T;
  error?: string;
  success: boolean;
};

// ❌ Avoid using any
function processData(data: any) {
  return data.someProperty;
}

// ✅ Use proper typing
function processData(data: { someProperty: string }) {
  return data.someProperty;
}
```

### Function Signatures

```typescript
// ✅ Explicit return types for public functions
export function calculateTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}

// ✅ Use readonly for immutable arrays
interface ReadonlyProps {
  readonly items: readonly string[];
}

// ✅ Use optional properties appropriately
interface CreateUserRequest {
  email: string;
  name?: string;
  avatar?: string;
}
```

## React Component Guidelines

### Component Structure

```tsx
// ✅ Proper component structure
import { type ReactNode } from 'react';
import { cn } from '~/utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

export function Button({ 
  variant = 'primary', 
  size = 'md', 
  className,
  children,
  ...props 
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-md font-medium transition-colors',
        {
          'bg-blue-600 text-white hover:bg-blue-700': variant === 'primary',
          'bg-gray-200 text-gray-900 hover:bg-gray-300': variant === 'secondary',
          'border border-gray-300 bg-transparent hover:bg-gray-50': variant === 'outline',
        },
        {
          'px-2 py-1 text-xs': size === 'sm',
          'px-4 py-2 text-sm': size === 'md',
          'px-6 py-3 text-base': size === 'lg',
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
```

### Hooks Guidelines

```typescript
// ✅ Custom hooks with proper return types
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  return [storedValue, setValue];
}

// ✅ Use useCallback for expensive operations
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
```

## File Organization

### Naming Conventions

```bash
# Components: PascalCase
BlogPost.tsx
UserProfile.tsx
AdminDashboard.tsx

# Pages: kebab-case (Next.js App Router)
blog-post/page.tsx
user-profile/page.tsx
admin/dashboard/page.tsx

# Utilities: camelCase
formatDate.ts
validateEmail.ts
apiClient.ts

# Types: PascalCase
UserTypes.ts
BlogPostTypes.ts
ApiTypes.ts

# Constants: UPPER_SNAKE_CASE
API_ENDPOINTS.ts
ERROR_MESSAGES.ts
```

### Import Organization

```typescript
// 1. React and Next.js imports
import React from 'react';
import { NextPage } from 'next';
import Link from 'next/link';

// 2. Third-party library imports
import { clsx } from 'clsx';
import { format } from 'date-fns';

// 3. Internal imports (using path mappings)
import { Button } from '@/components/ui/Button';
import { api } from '@/utils/api';
import type { BlogPost } from '@/types/blog';

// 4. Relative imports
import './BlogPost.module.css';
```

### Export Conventions

```typescript
// ✅ Named exports for components
export function BlogPost({ post }: BlogPostProps) {
  return <div>{post.title}</div>;
}

// ✅ Default exports for pages
export default function BlogPage() {
  return <div>Blog Page</div>;
}

// ✅ Type exports
export type { BlogPostProps, BlogPost };

// ✅ Barrel exports (index.ts files)
export { Button } from './Button';
export { Input } from './Input';
export { Modal } from './Modal';
```

## API and Backend Guidelines

### tRPC Procedures

```typescript
// ✅ Input validation with Zod
export const blogRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
        content: z.string().min(1, 'Content is required'),
        slug: z.string().regex(/^[a-z0-9-]+$/, 'Invalid slug format'),
        published: z.boolean().default(false),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        return await ctx.db.blogPost.create({
          data: {
            ...input,
            authorId: ctx.session.user.id,
          },
        });
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create blog post',
          cause: error,
        });
      }
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const post = await ctx.db.blogPost.findUnique({
        where: { id: input.id },
        include: {
          author: { select: { name: true, image: true } },
          tags: true,
        },
      });

      if (!post) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Blog post not found',
        });
      }

      return post;
    }),
});
```

### Database Queries

```typescript
// ✅ Use Prisma client with proper error handling
export async function getBlogPosts(options: {
  published?: boolean;
  authorId?: string;
  limit?: number;
  cursor?: string;
}) {
  try {
    return await db.blogPost.findMany({
      where: {
        published: options.published,
        authorId: options.authorId,
      },
      include: {
        author: {
          select: { name: true, image: true },
        },
        tags: true,
      },
      take: options.limit ?? 10,
      cursor: options.cursor ? { id: options.cursor } : undefined,
      orderBy: { createdAt: 'desc' },
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    throw new Error('Failed to fetch blog posts');
  }
}
```

## Styling Guidelines

### Tailwind CSS Usage

```tsx
// ✅ Use utility classes with conditional styling
function Alert({ variant, children }: AlertProps) {
  return (
    <div
      className={cn(
        'rounded-lg border p-4',
        {
          'border-green-200 bg-green-50 text-green-800': variant === 'success',
          'border-red-200 bg-red-50 text-red-800': variant === 'error',
          'border-yellow-200 bg-yellow-50 text-yellow-800': variant === 'warning',
          'border-blue-200 bg-blue-50 text-blue-800': variant === 'info',
        }
      )}
    >
      {children}
    </div>
  );
}

// ✅ Extract complex styles to CSS modules when needed
import styles from './ComplexComponent.module.css';

function ComplexComponent() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        {/* Complex styling in CSS module */}
      </div>
    </div>
  );
}
```

### CSS Custom Properties

```css
/* ✅ Use CSS custom properties for theming */
:root {
  --color-primary-50: #eff6ff;
  --color-primary-500: #3b82f6;
  --color-primary-900: #1e3a8a;
  
  --font-sans: 'Inter', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
}
```

## Error Handling

### Client-Side Error Handling

```typescript
// ✅ Proper error handling in components
export function BlogPostForm() {
  const [error, setError] = useState<string | null>(null);
  const createPost = api.blog.create.useMutation({
    onSuccess: () => {
      router.push('/admin/posts');
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const handleSubmit = async (data: BlogPostData) => {
    try {
      setError(null);
      await createPost.mutateAsync(data);
    } catch (error) {
      // Error handled by onError callback
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
      {/* Form fields */}
    </form>
  );
}
```

### Server-Side Error Handling

```typescript
// ✅ Structured error responses
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function handleApiError(error: unknown) {
  if (error instanceof ApiError) {
    return {
      message: error.message,
      statusCode: error.statusCode,
      code: error.code,
    };
  }

  if (error instanceof z.ZodError) {
    return {
      message: 'Validation error',
      statusCode: 400,
      code: 'VALIDATION_ERROR',
      details: error.errors,
    };
  }

  // Log unexpected errors
  console.error('Unexpected error:', error);
  
  return {
    message: 'Internal server error',
    statusCode: 500,
    code: 'INTERNAL_ERROR',
  };
}
```

## Documentation Standards

### Code Comments

```typescript
/**
 * Calculates the reading time for a blog post based on word count.
 * Uses an average reading speed of 200 words per minute.
 * 
 * @param content - The blog post content
 * @returns Reading time in minutes (minimum 1 minute)
 */
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);
  
  return Math.max(readingTime, 1);
}

// ✅ Inline comments for complex logic
function complexAlgorithm(data: ComplexData) {
  // Sort data by priority before processing
  const sortedData = data.sort((a, b) => b.priority - a.priority);
  
  // Apply business logic transformation
  return sortedData.map(item => {
    // Handle edge case where value might be null
    const processedValue = item.value ?? getDefaultValue(item.type);
    
    return {
      ...item,
      processedValue,
    };
  });
}
```

### README Documentation

```markdown
# Component Name

Brief description of what the component does.

## Usage

```tsx
import { ComponentName } from '@/components/ComponentName';

function Example() {
  return (
    <ComponentName
      prop1="value"
      prop2={true}
      onAction={handleAction}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `prop1` | `string` | - | Description of prop1 |
| `prop2` | `boolean` | `false` | Description of prop2 |
| `onAction` | `() => void` | - | Callback function |
```

## Testing Guidelines

### Test Structure

```typescript
// ✅ Descriptive test names and structure
describe('BlogPost Component', () => {
  describe('when rendering a published post', () => {
    it('displays the post title and content', () => {
      const post = createMockBlogPost({ published: true });
      render(<BlogPost post={post} />);
      
      expect(screen.getByText(post.title)).toBeInTheDocument();
      expect(screen.getByText(post.content)).toBeInTheDocument();
    });

    it('shows the publication date', () => {
      const post = createMockBlogPost({ 
        published: true,
        createdAt: new Date('2023-01-01')
      });
      render(<BlogPost post={post} />);
      
      expect(screen.getByText('January 1, 2023')).toBeInTheDocument();
    });
  });

  describe('when rendering a draft post', () => {
    it('displays a draft indicator', () => {
      const post = createMockBlogPost({ published: false });
      render(<BlogPost post={post} />);
      
      expect(screen.getByText('Draft')).toBeInTheDocument();
    });
  });
});
```

## Linting and Formatting

### ESLint Configuration

The project uses strict ESLint rules. Key rules include:

- `@typescript-eslint/no-unused-vars`: Prevent unused variables
- `@typescript-eslint/explicit-function-return-type`: Require return types
- `react-hooks/exhaustive-deps`: Ensure proper dependency arrays
- `import/order`: Enforce import order

### Prettier Configuration

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}
```

## Git Commit Guidelines

### Commit Message Format

```bash
type(scope): description

# Examples:
feat(auth): add social login with Google
fix(api): handle database connection errors  
docs(readme): update installation instructions
test(blog): add unit tests for blog post creation
refactor(ui): extract button variants to separate file
```

### Commit Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect meaning (white-space, formatting)
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to build process or auxiliary tools

## Performance Best Practices

### React Performance

```typescript
// ✅ Use React.memo for expensive components
const ExpensiveComponent = React.memo(({ data }: { data: ComplexData }) => {
  const processedData = useMemo(() => {
    return expensiveCalculation(data);
  }, [data]);

  return <div>{processedData.result}</div>;
});

// ✅ Use useCallback for event handlers
function ParentComponent() {
  const [count, setCount] = useState(0);
  
  const handleIncrement = useCallback(() => {
    setCount(prev => prev + 1);
  }, []);

  return <ChildComponent onIncrement={handleIncrement} />;
}
```

### Bundle Optimization

```typescript
// ✅ Dynamic imports for code splitting
const LazyComponent = dynamic(() => import('./ExpensiveComponent'), {
  loading: () => <div>Loading...</div>,
  ssr: false,
});

// ✅ Import only what you need
import { debounce } from 'lodash/debounce';  // Instead of entire lodash
```

These style guidelines ensure consistent, maintainable, and high-quality code across the Portfolio project. All contributors should follow these standards to maintain code quality and team productivity.