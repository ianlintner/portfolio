# Contributing Guidelines

Thank you for your interest in contributing to this portfolio and blog application! This guide will help you understand our development process and how to submit contributions effectively.

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on the code, not the person
- Help create a welcoming environment

## Getting Started

1. **Fork the Repository**: Create your own fork of the project
2. **Clone Your Fork**: `git clone https://github.com/YOUR_USERNAME/portfolio.git`
3. **Create a Branch**: `git checkout -b feature/your-feature-name`
4. **Set Up Development**: Follow the [Getting Started Guide](getting-started.md)

## Development Workflow

### 1. Before Making Changes

- Ensure you're on the latest main branch
- Run tests to verify everything works: `pnpm test`
- Run linting to check code quality: `pnpm lint`

### 2. Making Changes

Follow these principles:

- **Make minimal changes**: Only modify what's necessary
- **Write clean code**: Follow existing patterns and conventions
- **Add tests**: For new features or bug fixes
- **Update documentation**: If changing APIs or behavior

### 3. Code Standards

#### TypeScript

- Use TypeScript for all new code
- Avoid `any` types - use proper type definitions
- Use path aliases (`@/`) instead of relative imports
- Add JSDoc comments for complex functions

```typescript
// Good
import { db } from "@/server/db";

// Bad
import { db } from "../../../server/db";
```

#### React Components

- Use functional components
- Mark client components with `"use client"` directive
- Use Server Components by default
- Follow the single responsibility principle

```typescript
"use client";

import { useState } from "react";

export function MyComponent() {
  const [state, setState] = useState(false);
  return <div>{/* component content */}</div>;
}
```

#### API Development

- All business logic goes through tRPC
- Use Zod for input validation
- Follow RESTful naming conventions
- Add proper error handling

```typescript
export const myRouter = createTRPCRouter({
  getItem: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      // Implementation
    }),
});
```

### 4. Testing

Write tests for:

- New features
- Bug fixes
- Critical business logic
- Complex components

Run tests before committing:

```bash
pnpm test
```

### 5. Linting and Formatting

Before every commit:

```bash
# Check linting
pnpm lint

# Check formatting
pnpm format

# Auto-fix formatting
pnpm format:fix
```

### 6. Commit Messages

Use clear, descriptive commit messages:

```bash
# Good
git commit -m "Add user authentication to blog posts"
git commit -m "Fix pagination bug in post listing"

# Bad
git commit -m "updates"
git commit -m "fix bug"
```

Follow this format:

```
<type>: <subject>

<body>
```

Types:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Build process or tool changes

### 7. Creating a Pull Request

1. **Push to Your Fork**:

   ```bash
   git push origin feature/your-feature-name
   ```

2. **Open a Pull Request**: Go to GitHub and create a PR from your branch

3. **Fill Out the Template**: Provide a clear description of your changes

4. **Link Issues**: Reference any related issues (`Fixes #123`)

5. **Wait for Review**: Maintainers will review your PR

## Pull Request Guidelines

### PR Checklist

- [ ] Code follows the project's style guidelines
- [ ] All tests pass (`pnpm test`)
- [ ] Linting passes (`pnpm lint`)
- [ ] Formatting is correct (`pnpm format`)
- [ ] Documentation is updated if needed
- [ ] Commit messages are clear and descriptive
- [ ] PR description explains the changes
- [ ] No unrelated changes are included

### PR Description Template

```markdown
## Description

Brief description of what this PR does

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Changes Made

- Bullet point list of changes

## Testing

How to test these changes

## Screenshots

If applicable, add screenshots

## Related Issues

Fixes #(issue number)
```

## Review Process

### What to Expect

1. **Initial Review**: Usually within 1-3 days
2. **Feedback**: Reviewers may request changes
3. **Iteration**: Make requested changes and push updates
4. **Approval**: Once approved, PR will be merged

### Responding to Feedback

- Be open to suggestions
- Ask questions if feedback is unclear
- Make requested changes promptly
- Push updates to the same branch

## Common Pitfalls

### ❌ Don't

- Use `npm` or `yarn` (use `pnpm` only)
- Commit `node_modules` or build artifacts
- Mix unrelated changes in one PR
- Ignore linting or test failures
- Remove or modify unrelated code
- Hand-edit database migration SQL files

### ✅ Do

- Use `pnpm` for all operations
- Keep PRs focused and small
- Write descriptive commit messages
- Add tests for new features
- Update documentation
- Run all checks before pushing

## Need Help?

- Check the [Getting Started Guide](getting-started.md)
- Review the [Architecture Documentation](ARCHITECTURE.md)
- Search existing [GitHub Issues](https://github.com/ianlintner/portfolio/issues)
- Ask questions in your PR

## Recognition

Contributors will be recognized in:

- GitHub Contributors page
- Project acknowledgments
- Release notes (for significant contributions)

Thank you for contributing to this project! 🎉
