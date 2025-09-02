# Frontend Development

Guide to the frontend architecture and development patterns used in the Portfolio application.

## Overview

The Portfolio application frontend is built with modern React patterns using Next.js 15 with App Router, TypeScript, and Tailwind CSS.

### Key Technologies

- **Next.js 15**: React framework with App Router
- **React 18**: Modern React with Concurrent Features
- **TypeScript**: Static type checking
- **Tailwind CSS**: Utility-first CSS framework
- **tRPC**: Type-safe API client
- **React Query**: Data fetching and caching

## App Router Architecture

The application uses Next.js App Router for modern React patterns:

```
src/app/
├── layout.tsx              # Root layout
├── page.tsx                # Homepage
├── loading.tsx             # Global loading UI
├── error.tsx               # Error boundary
├── not-found.tsx          # 404 page
├── api/                   # API routes
├── blog/                  # Blog pages
├── admin/                 # Admin interface
└── auth/                  # Authentication pages
```

## Component Architecture

### Component Organization

```
src/components/
├── ui/                    # Base UI components
├── layout/                # Layout components
├── blog/                  # Blog-specific components
├── admin/                 # Admin components
├── auth/                  # Authentication components
└── forms/                 # Form components
```

### Example Component Structure

```tsx
// src/components/ui/Button.tsx
import { type VariantProps, cva } from 'class-variance-authority';
import { forwardRef } from 'react';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        outline: 'border border-input hover:bg-accent hover:text-accent-foreground',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
```

## State Management

### tRPC Client Setup

```tsx
// src/utils/api.ts
import { createTRPCNext } from '@trpc/next';
import { type AppRouter } from '~/server/api/root';

export const api = createTRPCNext<AppRouter>({
  config() {
    return {
      url: '/api/trpc',
      transformer: superjson,
    };
  },
  ssr: false,
});
```

### Data Fetching Patterns

```tsx
// Query example
export function BlogList() {
  const { data: posts, isLoading, error } = api.blog.getAll.useQuery();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div className="space-y-4">
      {posts?.map((post) => (
        <BlogCard key={post.id} post={post} />
      ))}
    </div>
  );
}

// Mutation example
export function CreatePostForm() {
  const createPost = api.blog.create.useMutation({
    onSuccess: () => {
      toast.success('Post created successfully!');
      router.push('/admin/posts');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = (data: CreatePostInput) => {
    createPost.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
}
```

## Styling with Tailwind CSS

### Design System

```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a8a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
} satisfies Config;
```

### Component Styling

```tsx
// Using Tailwind with component variants
const Card = ({ children, variant = 'default' }: CardProps) => {
  const variants = {
    default: 'bg-white border border-gray-200 rounded-lg shadow-sm',
    elevated: 'bg-white border border-gray-200 rounded-lg shadow-lg',
    outlined: 'bg-transparent border-2 border-gray-300 rounded-lg',
  };

  return (
    <div className={cn(variants[variant], 'p-6')}>
      {children}
    </div>
  );
};
```

## Form Handling

### React Hook Form Integration

```tsx
// src/components/forms/BlogPostForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const blogPostSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  published: z.boolean().default(false),
});

type BlogPostFormData = z.infer<typeof blogPostSchema>;

export function BlogPostForm({ onSubmit }: { onSubmit: (data: BlogPostFormData) => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BlogPostFormData>({
    resolver: zodResolver(blogPostSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium">
          Title
        </label>
        <input
          {...register('title')}
          type="text"
          className="mt-1 block w-full rounded-md border-gray-300"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium">
          Content
        </label>
        <textarea
          {...register('content')}
          rows={10}
          className="mt-1 block w-full rounded-md border-gray-300"
        />
        {errors.content && (
          <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
        )}
      </div>

      <div className="flex items-center">
        <input
          {...register('published')}
          type="checkbox"
          className="rounded border-gray-300"
        />
        <label htmlFor="published" className="ml-2 text-sm">
          Publish immediately
        </label>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {isSubmitting ? 'Saving...' : 'Save Post'}
      </button>
    </form>
  );
}
```

## Performance Optimization

### Code Splitting

```tsx
// Dynamic imports for heavy components
import dynamic from 'next/dynamic';

const RichTextEditor = dynamic(() => import('./RichTextEditor'), {
  loading: () => <div>Loading editor...</div>,
  ssr: false,
});

// Route-based code splitting with App Router
const AdminPanel = dynamic(() => import('./AdminPanel'), {
  loading: () => <AdminSkeleton />,
});
```

### Image Optimization

```tsx
// Using Next.js Image component
import Image from 'next/image';

export function BlogPostImage({ src, alt, width, height }: ImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className="rounded-lg object-cover"
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ..."
    />
  );
}
```

### Memoization

```tsx
// Using React.memo for expensive components
const ExpensiveComponent = React.memo(({ data }: { data: ComplexData }) => {
  const processedData = useMemo(() => {
    return processComplexData(data);
  }, [data]);

  return <div>{/* Render processed data */}</div>;
});

// Custom hooks for shared logic
function useDebounce<T>(value: T, delay: number): T {
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

## Error Handling

### Error Boundaries

```tsx
// src/components/ErrorBoundary.tsx
'use client';

import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="text-center py-8">
            <h2 className="text-xl font-semibold text-red-600">Something went wrong</h2>
            <p className="text-gray-600 mt-2">Please try refreshing the page</p>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
```

### Global Error Page

```tsx
// src/app/error.tsx
'use client';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorPageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Something went wrong!
        </h2>
        <p className="text-gray-600 mb-8">
          {error.message || 'An unexpected error occurred'}
        </p>
        <button
          onClick={reset}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
```

## Testing Frontend Components

### Component Testing

```tsx
// components/__tests__/BlogCard.test.tsx
import { render, screen } from '@testing-library/react';
import { BlogCard } from '../BlogCard';

const mockPost = {
  id: '1',
  title: 'Test Post',
  excerpt: 'Test excerpt',
  author: { name: 'Test Author' },
  createdAt: new Date('2023-01-01'),
};

describe('BlogCard', () => {
  it('renders post information correctly', () => {
    render(<BlogCard post={mockPost} />);
    
    expect(screen.getByText('Test Post')).toBeInTheDocument();
    expect(screen.getByText('Test excerpt')).toBeInTheDocument();
    expect(screen.getByText('Test Author')).toBeInTheDocument();
  });
});
```

## Accessibility

### ARIA Labels and Roles

```tsx
// Accessible navigation component
export function Navigation() {
  return (
    <nav role="navigation" aria-label="Main navigation">
      <ul className="flex space-x-4">
        <li>
          <Link 
            href="/" 
            className="text-blue-600 hover:text-blue-800"
            aria-current={pathname === '/' ? 'page' : undefined}
          >
            Home
          </Link>
        </li>
        <li>
          <Link 
            href="/blog" 
            className="text-blue-600 hover:text-blue-800"
            aria-current={pathname === '/blog' ? 'page' : undefined}
          >
            Blog
          </Link>
        </li>
      </ul>
    </nav>
  );
}
```

### Focus Management

```tsx
// Focus trap for modals
import { useEffect, useRef } from 'react';

export function Modal({ isOpen, onClose, children }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      modalRef.current?.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-lg p-6 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
      >
        {children}
      </div>
    </div>
  );
}
```

## Best Practices

### Code Organization

1. **Component Co-location**: Keep related files together
2. **Custom Hooks**: Extract reusable logic
3. **Type Safety**: Use TypeScript throughout
4. **Performance**: Optimize with React.memo and useMemo
5. **Accessibility**: Follow WCAG guidelines

### Development Workflow

1. **Component-Driven Development**: Build components in isolation
2. **Testing**: Write tests for all components
3. **Linting**: Use ESLint and Prettier
4. **Performance Monitoring**: Monitor Core Web Vitals

For more frontend examples and patterns, see the [Component Library](../reference/components.md) reference.