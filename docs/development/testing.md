# Testing Guide

Comprehensive testing strategy for the Portfolio application covering unit tests, integration tests, and end-to-end testing.

## Testing Strategy

The Portfolio application implements a multi-layered testing approach:

- **Unit Tests**: Component and function testing with Jest
- **Integration Tests**: API and database testing  
- **End-to-End Tests**: User workflow testing with Playwright
- **Visual Regression Tests**: UI consistency testing

## Testing Stack

| Tool | Purpose | Configuration |
|------|---------|---------------|
| **Jest** | Unit and integration testing | `jest.config.js` |
| **Testing Library** | React component testing | `@testing-library/react` |
| **Playwright** | End-to-end testing | `playwright.config.ts` |
| **MSW** | API mocking | `src/mocks/handlers.ts` |

## Unit Testing

### Component Testing

```tsx
// components/__tests__/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../Button';

describe('Button Component', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies variant styles correctly', () => {
    render(<Button variant="secondary">Button</Button>);
    expect(screen.getByRole('button')).toHaveClass('btn-secondary');
  });
});
```

### Utility Function Testing

```typescript
// utils/__tests__/formatDate.test.ts
import { formatDate, isValidDate } from '../date';

describe('Date Utilities', () => {
  describe('formatDate', () => {
    it('formats date correctly', () => {
      const date = new Date('2023-12-01');
      expect(formatDate(date)).toBe('December 1, 2023');
    });

    it('handles invalid dates', () => {
      expect(formatDate(null)).toBe('Invalid Date');
    });
  });

  describe('isValidDate', () => {
    it('validates dates correctly', () => {
      expect(isValidDate(new Date())).toBe(true);
      expect(isValidDate(new Date('invalid'))).toBe(false);
    });
  });
});
```

## Integration Testing

### API Testing

```typescript
// server/api/__tests__/blog.test.ts
import { createTRPCContext } from '~/server/api/trpc';
import { appRouter } from '~/server/api/root';
import { db } from '~/server/db';

// Mock Prisma
jest.mock('~/server/db', () => ({
  blogPost: {
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

const mockDb = db as jest.Mocked<typeof db>;

describe('Blog API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates a blog post', async () => {
    const mockPost = {
      id: '1',
      title: 'Test Post',
      content: 'Test content',
      slug: 'test-post',
      published: false,
      authorId: 'user1',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockDb.blogPost.create.mockResolvedValue(mockPost);

    const ctx = await createTRPCContext({
      session: {
        user: { id: 'user1', email: 'test@example.com' },
        expires: '2024-01-01',
      },
    });

    const caller = appRouter.createCaller(ctx);

    const result = await caller.blog.create({
      title: 'Test Post',
      content: 'Test content',
      slug: 'test-post',
    });

    expect(result).toEqual(mockPost);
    expect(mockDb.blogPost.create).toHaveBeenCalledWith({
      data: {
        title: 'Test Post',
        content: 'Test content',
        slug: 'test-post',
        authorId: 'user1',
      },
    });
  });

  it('throws error for unauthorized user', async () => {
    const ctx = await createTRPCContext({ session: null });
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.blog.create({
        title: 'Test Post',
        content: 'Test content',
        slug: 'test-post',
      })
    ).rejects.toThrow('UNAUTHORIZED');
  });
});
```

### Database Testing

```typescript
// tests/integration/database.test.ts
import { PrismaClient } from '@prisma/client';

const testDb = new PrismaClient({
  datasources: {
    db: { url: process.env.TEST_DATABASE_URL },
  },
});

describe('Database Integration', () => {
  beforeEach(async () => {
    // Clean test database
    await testDb.blogPost.deleteMany();
    await testDb.user.deleteMany();
  });

  afterAll(async () => {
    await testDb.$disconnect();
  });

  it('creates user and blog post', async () => {
    // Create user
    const user = await testDb.user.create({
      data: {
        email: 'test@example.com',
        name: 'Test User',
      },
    });

    // Create blog post
    const post = await testDb.blogPost.create({
      data: {
        title: 'Test Post',
        slug: 'test-post',
        content: 'Test content',
        authorId: user.id,
      },
    });

    // Verify relationships
    const userWithPosts = await testDb.user.findUnique({
      where: { id: user.id },
      include: { blogPosts: true },
    });

    expect(userWithPosts?.blogPosts).toHaveLength(1);
    expect(userWithPosts?.blogPosts[0].title).toBe('Test Post');
  });
});
```

## End-to-End Testing

### Playwright Configuration

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

### E2E Test Examples

```typescript
// tests/e2e/auth.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('user can sign in and out', async ({ page }) => {
    // Navigate to sign in page
    await page.goto('/auth/signin');

    // Fill login form
    await page.fill('[name="email"]', 'admin@example.com');
    await page.fill('[name="password"]', 'admin123');
    await page.click('[type="submit"]');

    // Verify successful login
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();

    // Sign out
    await page.click('[data-testid="user-menu"]');
    await page.click('[data-testid="sign-out"]');

    // Verify signed out
    await expect(page).toHaveURL('/');
  });
});

// tests/e2e/blog.spec.ts
test.describe('Blog Management', () => {
  test.beforeEach(async ({ page }) => {
    // Sign in as admin
    await page.goto('/auth/signin');
    await page.fill('[name="email"]', 'admin@example.com');
    await page.fill('[name="password"]', 'admin123');
    await page.click('[type="submit"]');
  });

  test('creates a new blog post', async ({ page }) => {
    // Navigate to create post
    await page.goto('/admin/posts/create');

    // Fill post form
    await page.fill('[name="title"]', 'Test Post Title');
    await page.fill('[name="slug"]', 'test-post-title');
    await page.fill('[data-testid="content-editor"]', 'This is test content');

    // Publish post
    await page.check('[name="published"]');
    await page.click('[type="submit"]');

    // Verify post created
    await expect(page).toHaveURL('/admin/posts');
    await expect(page.locator('text=Test Post Title')).toBeVisible();
  });

  test('edits existing blog post', async ({ page }) => {
    // Navigate to posts list
    await page.goto('/admin/posts');

    // Click edit on first post
    await page.click('[data-testid="edit-post"]:first-of-type');

    // Update title
    await page.fill('[name="title"]', 'Updated Post Title');
    await page.click('[type="submit"]');

    // Verify update
    await expect(page.locator('text=Updated Post Title')).toBeVisible();
  });
});
```

### Visual Regression Testing

```typescript
// tests/e2e/visual.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Visual Regression', () => {
  test('homepage layout', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveScreenshot('homepage.png');
  });

  test('blog post layout', async ({ page }) => {
    await page.goto('/blog/welcome-post');
    await expect(page).toHaveScreenshot('blog-post.png');
  });

  test('admin dashboard', async ({ page }) => {
    // Sign in first
    await page.goto('/auth/signin');
    await page.fill('[name="email"]', 'admin@example.com');
    await page.fill('[name="password"]', 'admin123');
    await page.click('[type="submit"]');

    await page.goto('/admin');
    await expect(page).toHaveScreenshot('admin-dashboard.png');
  });
});
```

## Mocking and Test Data

### API Mocking with MSW

```typescript
// src/mocks/handlers.ts
import { rest } from 'msw';

export const handlers = [
  // Mock blog posts
  rest.get('/api/trpc/blog.getAll', (req, res, ctx) => {
    return res(
      ctx.json({
        result: {
          data: {
            posts: [
              {
                id: '1',
                title: 'Mock Post',
                content: 'Mock content',
                slug: 'mock-post',
                published: true,
                createdAt: new Date().toISOString(),
                author: { name: 'Mock Author' },
              },
            ],
            nextCursor: null,
          },
        },
      })
    );
  }),

  // Mock authentication
  rest.get('/api/auth/session', (req, res, ctx) => {
    return res(
      ctx.json({
        user: {
          id: '1',
          name: 'Test User',
          email: 'test@example.com',
        },
        expires: '2024-01-01',
      })
    );
  }),
];
```

### Test Data Factories

```typescript
// tests/factories/user.ts
import { User } from '@prisma/client';

export function createMockUser(overrides: Partial<User> = {}): User {
  return {
    id: 'user-1',
    name: 'Test User',
    email: 'test@example.com',
    emailVerified: null,
    image: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

// tests/factories/blogPost.ts
export function createMockBlogPost(overrides: Partial<BlogPost> = {}): BlogPost {
  return {
    id: 'post-1',
    title: 'Test Post',
    slug: 'test-post',
    content: 'Test content',
    excerpt: null,
    published: false,
    authorId: 'user-1',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}
```

## Test Commands

### Running Tests

```bash
# Run all unit tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Run E2E tests
pnpm test:e2e

# Run E2E tests with UI
pnpm test:e2e:ui

# Run specific test file
pnpm test Button.test.tsx

# Run tests matching pattern
pnpm test --testNamePattern="should render"
```

### CI/CD Testing

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: portfolio_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install pnpm
        run: npm install -g pnpm
        
      - name: Install dependencies
        run: pnpm install
        
      - name: Run unit tests
        run: pnpm test:ci
        
      - name: Run E2E tests
        run: pnpm test:e2e
        
      - name: Upload test results
        uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: test-results
          path: test-results/
```

## Test Coverage

### Coverage Configuration

```javascript
// jest.config.js
module.exports = {
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/pages/_app.tsx',
    '!src/pages/_document.tsx',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  coverageReporters: ['text', 'lcov', 'html'],
};
```

### Coverage Reports

```bash
# Generate coverage report
pnpm test:coverage

# View HTML coverage report
open coverage/lcov-report/index.html
```

## Testing Best Practices

### Unit Testing

1. **Test Behavior, Not Implementation**: Focus on what the component does
2. **Use Descriptive Test Names**: Clearly describe what is being tested
3. **Arrange, Act, Assert**: Structure tests clearly
4. **Mock External Dependencies**: Isolate units under test
5. **Test Edge Cases**: Include error conditions and boundary values

### Integration Testing

1. **Test Real Interactions**: Use actual database and API calls
2. **Clean Test Environment**: Reset state between tests
3. **Test Error Scenarios**: Verify error handling
4. **Use Test Database**: Separate from development database

### E2E Testing

1. **Test Critical User Journeys**: Focus on important workflows
2. **Use Data Attributes**: Add test IDs for reliable selectors
3. **Wait for Elements**: Use proper waiting strategies
4. **Test Across Browsers**: Verify cross-browser compatibility
5. **Keep Tests Independent**: Each test should be self-contained

## Debugging Tests

### Jest Debugging

```bash
# Debug specific test
node --inspect-brk node_modules/.bin/jest --runInBand Button.test.tsx

# Use VS Code debugger
# Add breakpoint and run "Debug Test" command
```

### Playwright Debugging

```bash
# Run with headed browser
pnpm test:e2e --headed

# Run with debugging
pnpm test:e2e --debug

# Record test actions
pnpm playwright codegen localhost:3000
```

## Performance Testing

### Load Testing

```typescript
// tests/performance/load.spec.ts
import { test } from '@playwright/test';

test('homepage load performance', async ({ page }) => {
  await page.goto('/');
  
  // Measure page load time
  const performanceTiming = JSON.parse(
    await page.evaluate(() => JSON.stringify(window.performance.timing))
  );
  
  const loadTime = performanceTiming.loadEventEnd - performanceTiming.navigationStart;
  console.log(`Page load time: ${loadTime}ms`);
  
  // Assert reasonable load time
  expect(loadTime).toBeLessThan(3000);
});
```

For detailed information on specific testing scenarios, see the [API Testing Guide](api.md) and [Component Testing Examples](../reference/testing-examples.md).