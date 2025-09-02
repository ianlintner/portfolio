# Pull Request Guidelines

Guidelines for creating, reviewing, and merging pull requests in the Portfolio project.

## Before Creating a Pull Request

### 1. Preparation Checklist

- [ ] Create or update issue describing the problem/feature
- [ ] Fork the repository and create a feature branch
- [ ] Follow the [Code Style Guidelines](code-style.md)
- [ ] Write or update tests for your changes
- [ ] Update documentation if needed
- [ ] Run all tests locally (`pnpm test`)
- [ ] Run linting (`pnpm lint`)
- [ ] Test your changes manually

### 2. Branch Naming

Use descriptive branch names following this pattern:

```bash
# Features
feature/user-authentication
feature/blog-post-editor
feature/admin-dashboard

# Bug fixes
fix/login-redirect-issue
fix/database-connection-error
fix/ui-layout-mobile

# Documentation
docs/api-documentation
docs/deployment-guide
docs/contributing-guidelines

# Refactoring
refactor/auth-middleware
refactor/database-queries
refactor/component-structure

# Chores
chore/update-dependencies
chore/ci-improvements
chore/docker-optimization
```

## Creating a Pull Request

### 1. PR Title Format

Use clear, descriptive titles following conventional commit format:

```
type(scope): description

Examples:
feat(auth): add Google OAuth integration
fix(api): resolve database timeout issues
docs(readme): update installation instructions
test(blog): add unit tests for post creation
refactor(ui): extract reusable button component
```

### 2. PR Description Template

Use this template for your PR description:

```markdown
## Description
Brief description of changes made and why.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Code refactoring
- [ ] Dependency update

## Related Issue
Fixes #123
Closes #456
Related to #789

## Changes Made
- List the main changes
- Be specific about what was modified
- Include any new dependencies added

## Testing
- [ ] Unit tests pass (`pnpm test`)
- [ ] Integration tests pass
- [ ] E2E tests pass (`pnpm test:e2e`)
- [ ] Manual testing completed
- [ ] Edge cases tested

## Screenshots/Videos
(If applicable, add screenshots or videos demonstrating the changes)

## Checklist
- [ ] My code follows the project's style guidelines
- [ ] I have performed a self-review of my code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes
- [ ] Any dependent changes have been merged and published
```

### 3. Draft Pull Requests

Create draft PRs for:
- Work in progress that needs early feedback
- Large features that will be developed incrementally
- Experimental changes that need discussion

```bash
# Create draft PR via GitHub CLI
gh pr create --draft --title "feat(auth): add OAuth integration (WIP)" --body "Work in progress..."
```

## Code Review Process

### 1. Automated Checks

All PRs must pass automated checks:

```yaml
# Example GitHub Actions checks
✅ Build successful
✅ Tests pass (unit, integration, E2E)
✅ Linting passes
✅ Type checking passes
✅ Security scan passes
✅ Performance regression checks
```

### 2. Review Requirements

- **At least 1 approving review** from a maintainer
- **All automated checks** must pass
- **No unresolved conversations** (all feedback addressed)
- **Up-to-date with main branch** (rebase if needed)

### 3. Review Guidelines for Reviewers

#### What to Look For

```markdown
## Code Quality
- [ ] Code follows project style guidelines
- [ ] Logic is clear and well-commented
- [ ] No obvious bugs or issues
- [ ] Error handling is appropriate
- [ ] Performance considerations addressed

## Testing
- [ ] Adequate test coverage
- [ ] Tests are meaningful and test the right things
- [ ] Edge cases are covered
- [ ] No flaky tests introduced

## Security
- [ ] No sensitive data exposed
- [ ] Input validation implemented
- [ ] Authentication/authorization properly handled
- [ ] No security vulnerabilities introduced

## Documentation
- [ ] Code is self-documenting or well-commented
- [ ] API changes documented
- [ ] README/docs updated if needed
- [ ] Breaking changes clearly noted

## Architecture
- [ ] Changes fit well with existing architecture
- [ ] No unnecessary complexity introduced
- [ ] Proper separation of concerns
- [ ] Reusable components extracted where appropriate
```

#### Review Comments

Use clear, constructive feedback:

```markdown
# ✅ Good feedback
## Suggestion
Consider extracting this logic into a custom hook for reusability:

```typescript
const useDebounce = (value, delay) => {
  // implementation
};
```

## Issue
This could cause a memory leak if the component unmounts before the timeout completes. Consider adding cleanup:

```typescript
useEffect(() => {
  const timer = setTimeout(() => {
    // logic
  }, delay);
  
  return () => clearTimeout(timer);
}, []);
```

## Question
Why did you choose this approach over using the existing `formatDate` utility?

## Praise
Great job on the comprehensive test coverage! This will help prevent regressions.

# ❌ Poor feedback
"This is wrong"
"Bad code"
"Fix this"
```

### 4. Responding to Feedback

#### For PR Authors

```markdown
# Addressing Feedback

1. **Read all feedback carefully**
2. **Ask for clarification** if needed
3. **Make requested changes** or provide reasoning for alternative approach
4. **Test changes** after addressing feedback
5. **Respond to each comment** to show it was addressed
6. **Request re-review** after making significant changes

# Example responses:
"Thanks for the suggestion! I've extracted the logic into a custom hook as recommended."

"Good catch on the memory leak. I've added the cleanup function."

"I chose this approach because the existing utility doesn't handle the timezone requirements for this use case. Would you prefer I extend the existing utility instead?"
```

## Merging Guidelines

### 1. Merge Strategies

The project uses **Squash and Merge** strategy:

```bash
# This creates a single commit with a clean message
feat(auth): add Google OAuth integration (#123)

* Add Google OAuth provider configuration
* Implement OAuth callback handling  
* Add user profile synchronization
* Update authentication middleware
* Add comprehensive tests for OAuth flow

Co-authored-by: Reviewer Name <reviewer@example.com>
```

### 2. When to Merge

Merge when:
- [ ] All required reviews are approved
- [ ] All automated checks pass
- [ ] All conversations are resolved
- [ ] Branch is up-to-date with main
- [ ] No merge conflicts
- [ ] Changes have been tested in staging (for large features)

### 3. Post-Merge Actions

After merging:
1. **Delete the feature branch**
2. **Update related issues** (auto-closed by keywords)
3. **Monitor deployment** for any issues
4. **Update project board** if using one
5. **Notify stakeholders** of significant changes

## Special Types of Pull Requests

### 1. Hotfix PRs

For urgent production fixes:

```markdown
Title: hotfix: resolve critical authentication bug

Priority: 🔥 URGENT
Type: Bug Fix
Severity: Critical

Description:
Fixes a critical bug in the authentication middleware that prevents users from logging in.

Testing:
- [x] Verified fix in production environment
- [x] All authentication flows tested
- [x] No side effects observed

Deployment:
Ready for immediate deployment to production.
```

### 2. Documentation PRs

For documentation-only changes:

```markdown
Title: docs: add API endpoint documentation

Type: Documentation

Changes:
- Added comprehensive API documentation
- Updated code examples
- Fixed broken links in README

No code changes - documentation only.
```

### 3. Dependency Updates

For dependency updates:

```markdown
Title: chore: update Next.js to v15.0.0

Type: Dependency Update

Changes:
- Updated Next.js from v14.2.0 to v15.0.0
- Updated related dependencies
- Fixed breaking changes in routing
- Updated type definitions

Testing:
- [x] All existing functionality works
- [x] No new TypeScript errors
- [x] Performance regression tests pass
- [x] Bundle size impact assessed

Breaking Changes:
- None - all changes are backward compatible

Security:
- Addresses 2 moderate security vulnerabilities
```

## Common Issues and Solutions

### 1. Merge Conflicts

```bash
# Update your branch with latest main
git checkout feature/your-feature
git fetch origin
git rebase origin/main

# Resolve conflicts manually
# After resolving:
git add .
git rebase --continue
git push --force-with-lease origin feature/your-feature
```

### 2. Failed Checks

```bash
# Fix linting issues
pnpm lint --fix

# Fix type errors
pnpm type-check

# Run tests to ensure they pass
pnpm test

# Fix E2E tests
pnpm test:e2e
```

### 3. Large PRs

If your PR is too large:

1. **Break it down** into smaller, focused PRs
2. **Create a tracking issue** for the overall feature
3. **Submit incremental PRs** that can be reviewed independently
4. **Use draft PRs** for work-in-progress reviews

### 4. Stale PRs

For PRs that have been inactive:

1. **Rebase** on the latest main branch
2. **Address** any new conflicts or issues
3. **Update** the PR description if scope has changed
4. **Request fresh review** if significant time has passed

## PR Automation

### 1. GitHub Actions

Automated workflows run on every PR:

```yaml
name: PR Checks
on:
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: pnpm install
      - name: Run tests
        run: pnpm test
      - name: Run E2E tests
        run: pnpm test:e2e
```

### 2. Automatic Labels

PRs are automatically labeled based on:
- Files changed (e.g., `documentation`, `frontend`, `backend`)
- Size (e.g., `size/small`, `size/large`)
- Type (e.g., `bug`, `feature`, `chore`)

### 3. Required Status Checks

Before merging, these checks must pass:
- Build successful
- Tests pass
- Linting passes
- Security scan passes
- At least one approval

## Best Practices Summary

1. **Keep PRs small and focused**
2. **Write clear, descriptive titles and descriptions**
3. **Include comprehensive tests**
4. **Respond promptly to feedback**
5. **Keep branches up-to-date**
6. **Test changes thoroughly**
7. **Document significant changes**
8. **Follow code style guidelines**
9. **Be respectful in code reviews**
10. **Learn from feedback and apply it to future PRs**

Following these guidelines ensures smooth collaboration and maintains high code quality in the Portfolio project.