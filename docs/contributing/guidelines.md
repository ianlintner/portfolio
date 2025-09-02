# Contributing Guidelines

Thank you for your interest in contributing to the Portfolio project! This document provides guidelines and information for contributors.

## 🤝 How to Contribute

### Types of Contributions

We welcome several types of contributions:

- **🐛 Bug Reports**: Report issues and bugs
- **✨ Feature Requests**: Suggest new features and improvements
- **📝 Documentation**: Improve or add documentation
- **💻 Code Contributions**: Fix bugs, add features, or improve code
- **🧪 Testing**: Add or improve tests
- **🎨 Design**: UI/UX improvements and design suggestions

### Before You Start

1. **Check Existing Issues**: Browse [existing issues](https://github.com/ianlintner/portfolio/issues) to avoid duplicates
2. **Read Documentation**: Familiarize yourself with the project structure and architecture
3. **Set Up Development Environment**: Follow the [Installation Guide](../getting-started/installation.md)

## 🚀 Getting Started

### 1. Fork and Clone

```bash
# Fork the repository on GitHub, then clone your fork
git clone https://github.com/YOUR_USERNAME/portfolio.git
cd portfolio

# Add upstream remote
git remote add upstream https://github.com/ianlintner/portfolio.git
```

### 2. Create a Branch

```bash
# Create a new branch for your contribution
git checkout -b feature/your-feature-name

# Or for bug fixes
git checkout -b fix/issue-description
```

### 3. Set Up Development Environment

```bash
# Install dependencies
pnpm install

# Set up environment
cp .env.example .env
# Edit .env with your configuration

# Set up database
pnpm db:push
pnpm db:seed

# Start development server
pnpm dev
```

## 📋 Development Guidelines

### Code Style

#### TypeScript Guidelines

- **Use TypeScript**: All new code should be written in TypeScript
- **Strict Types**: Enable strict mode and avoid `any` types
- **Type Exports**: Export types separately from implementation

```typescript
// ✅ Good
interface UserProps {
  id: string;
  name: string;
  email: string;
}

export type { UserProps };

// ❌ Avoid
function getUser(): any {
  // ...
}
```

#### React Guidelines

- **Functional Components**: Use functional components with hooks
- **Props Interface**: Define props interfaces for all components
- **Default Props**: Use default parameters instead of defaultProps

```tsx
// ✅ Good
interface ButtonProps {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function Button({ 
  variant = 'primary', 
  size = 'md', 
  children 
}: ButtonProps) {
  return (
    <button className={`btn btn-${variant} btn-${size}`}>
      {children}
    </button>
  );
}

// ❌ Avoid
export function Button(props: any) {
  return <button>{props.children}</button>;
}
```

#### API Guidelines

- **tRPC Procedures**: Use tRPC for all API endpoints
- **Input Validation**: Validate all inputs with Zod schemas
- **Error Handling**: Implement proper error handling

```typescript
// ✅ Good
export const userRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        email: z.string().email(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        return await ctx.db.user.create({
          data: input,
        });
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create user',
        });
      }
    }),
});
```

### Testing Requirements

#### Unit Tests

All new features must include unit tests:

```typescript
// Example: components/__tests__/Button.test.tsx
import { render, screen } from '@testing-library/react';
import { Button } from '../Button';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('applies correct variant class', () => {
    render(<Button variant="secondary">Button</Button>);
    expect(screen.getByRole('button')).toHaveClass('btn-secondary');
  });
});
```

#### Integration Tests

API endpoints should have integration tests:

```typescript
// Example: server/api/__tests__/user.test.ts
import { createTRPCMsw } from 'msw-trpc';
import { appRouter } from '../root';

const trpcMsw = createTRPCMsw(appRouter);

describe('User Router', () => {
  it('creates user successfully', async () => {
    // Test implementation
  });
});
```

#### End-to-End Tests

Critical user flows should have E2E tests:

```typescript
// Example: tests/e2e/auth.spec.ts
import { test, expect } from '@playwright/test';

test('user can sign in', async ({ page }) => {
  await page.goto('/auth/signin');
  await page.fill('[name="email"]', 'test@example.com');
  await page.fill('[name="password"]', 'password');
  await page.click('[type="submit"]');
  await expect(page).toHaveURL('/dashboard');
});
```

### Documentation Requirements

- **Code Comments**: Document complex logic and business rules
- **API Documentation**: Document new API endpoints
- **README Updates**: Update relevant documentation
- **Type Documentation**: Document complex types and interfaces

## 🔄 Workflow

### 1. Development Process

```bash
# Keep your branch up to date
git fetch upstream
git rebase upstream/main

# Make your changes
# ... edit files ...

# Run tests
pnpm test
pnpm test:e2e

# Run linting
pnpm lint

# Type check
pnpm type-check
```

### 2. Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Format: type(scope): description
feat(auth): add social login with Google
fix(api): handle database connection errors
docs(readme): update installation instructions
test(user): add unit tests for user creation
refactor(components): extract common button styles
```

#### Commit Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, semicolons, etc.)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Build process or auxiliary tool changes

#### Commit Scope

Use relevant scope for your changes:
- **auth**: Authentication related
- **api**: API/backend changes
- **ui**: UI/frontend changes
- **db**: Database related
- **docs**: Documentation
- **config**: Configuration changes

### 3. Pull Request Process

#### Before Submitting

- [ ] Tests pass (`pnpm test`)
- [ ] Linting passes (`pnpm lint`)
- [ ] Type checking passes (`pnpm type-check`)
- [ ] Code is properly formatted
- [ ] Documentation is updated
- [ ] Commit messages follow convention

#### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] E2E tests added/updated
- [ ] Manual testing completed

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] Tests pass
- [ ] No breaking changes (or breaking changes documented)
```

#### Review Process

1. **Automated Checks**: CI/CD pipeline runs tests and linting
2. **Code Review**: Maintainers review code for quality and standards
3. **Testing**: Changes are tested in staging environment
4. **Approval**: At least one maintainer approval required
5. **Merge**: Squash and merge strategy used

## 🐛 Bug Reports

### Before Reporting

1. **Search Existing Issues**: Check if the bug is already reported
2. **Reproduce Locally**: Ensure you can reproduce the issue
3. **Check Latest Version**: Verify the bug exists in the latest version

### Bug Report Template

```markdown
## Bug Description
Clear and concise description of the bug

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

## Expected Behavior
What you expected to happen

## Actual Behavior
What actually happened

## Environment
- OS: [e.g., macOS 12.0]
- Browser: [e.g., Chrome 96.0]
- Node.js: [e.g., 18.0.0]
- pnpm: [e.g., 8.0.0]

## Additional Context
Screenshots, logs, or other relevant information
```

## ✨ Feature Requests

### Before Requesting

1. **Check Existing Issues**: Ensure the feature isn't already requested
2. **Consider Scope**: Ensure the feature fits the project's goals
3. **Think About Implementation**: Consider how it might be implemented

### Feature Request Template

```markdown
## Feature Description
Clear and concise description of the feature

## Problem Statement
What problem does this feature solve?

## Proposed Solution
Describe your proposed solution

## Alternatives Considered
Any alternative solutions you've considered

## Additional Context
Mockups, examples, or other relevant information
```

## 📝 Documentation Contributions

### Types of Documentation

- **Code Documentation**: Inline comments and JSDoc
- **API Documentation**: tRPC endpoint documentation
- **User Guides**: How-to guides and tutorials
- **Developer Docs**: Architecture and development guides

### Documentation Guidelines

- **Clear and Concise**: Use simple, clear language
- **Examples**: Provide code examples where relevant
- **Up to Date**: Ensure documentation matches current code
- **Accessible**: Consider accessibility in documentation

## 🏆 Recognition

Contributors are recognized in several ways:

- **Contributors List**: Added to repository contributors
- **Release Notes**: Mentioned in release notes
- **Social Media**: Shared on project social media
- **Special Thanks**: Recognition for significant contributions

## 📞 Getting Help

- **Discord/Discussions**: Join project discussions
- **Issues**: Create an issue for help with specific problems
- **Email**: Contact maintainers directly for sensitive issues

## 🔒 Security

For security vulnerabilities:

1. **Don't Create Public Issues**: Security issues should not be public
2. **Email Maintainers**: Contact maintainers directly
3. **Provide Details**: Include steps to reproduce and impact assessment
4. **Be Patient**: Allow time for investigation and patching

## 📜 License

By contributing, you agree that your contributions will be licensed under the project's MIT License.

---

Thank you for contributing to the Portfolio project! 🎉