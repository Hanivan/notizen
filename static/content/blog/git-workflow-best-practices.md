---
title: "Git Workflow Best Practices for Development Teams"
description: "Master Git workflows and branching strategies to improve collaboration, code quality, and deployment processes."
date: "2025-04-16"
category: "Git"
tags: ["git", "workflow", "collaboration", "version control", "best practices"]
author: "Hanivan Rizky Sobari"
featured: false
image: ""
---

# Git Workflow Best Practices for Development Teams

A well-defined Git workflow is crucial for team collaboration and code quality. Let's explore the best practices and strategies.

## Branching Strategies

### Feature Branch Workflow

```
main (production)
  └── feature/add-login
  └── feature/update-api
  └── feature/fix-auth-bug
```

Each feature gets its own branch:

```bash
# Create feature branch
git checkout -b feature/add-user-auth

# Make changes and commit
git add .
git commit -m "feat: add user authentication"

# Push to remote
git push -u origin feature/add-user-auth
```

### Gitflow Workflow

```
main (production)
  └── develop (development)
        ├── feature/add-login
        ├── feature/update-api
        └── hotfix/security-patch
```

**Branch types:**
- `main` - Production-ready code
- `develop` - Development branch
- `feature/*` - New features
- `release/*` - Release preparation
- `hotfix/*` - Production bug fixes

### Trunk-Based Development

```
main (trunk)
  ├── short-lived feature branches
  └── continuous integration
```

All developers work on short-lived branches that merge to main frequently.

## Commit Message Conventions

Use conventional commits for clarity:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Build process or auxiliary tool changes

**Examples:**

```bash
# Feature
git commit -m "feat(auth): add OAuth2 login support"

# Bug fix
git commit -m "fix(api): handle null response from user endpoint"

# Documentation
git commit -m "docs(readme): update installation instructions"

# Breaking change
git commit -m "feat(api)!: remove deprecated endpoints

BREAKING CHANGE: The /api/v1 endpoints are no longer supported"
```

## Branch Naming Conventions

Use consistent branch naming:

```bash
# Features
feature/add-user-dashboard
feature/implement-search

# Bug fixes
bugfix/login-validation-error
fix/memory-leak-component

# Hotfixes
hotfix/security-patch-2025
hotfix/critical-bug-payment

# Releases
release/v1.2.0
release/v2.0.0-beta

# Experiments
experiment/new-ui-design
spike/redis-caching
```

## Pull Request Best Practices

### 1. Descriptive PR Titles

```bash
# ❌ BAD
"Update file"
"Fix bug"

# ✅ GOOD
"feat: add user profile editing"
"fix: resolve memory leak in data fetching"
"refactor: migrate to TypeScript 5.0"
```

### 2. Comprehensive PR Descriptions

```markdown
## Description
Adds user profile editing functionality with image upload.

## Changes
- Implemented profile form component
- Added image upload to S3
- Updated API endpoints
- Added unit tests

## Testing
- [x] Unit tests pass
- [x] Integration tests pass
- [x] Manual testing completed

## Checklist
- [ ] Documentation updated
- [ ] Migration guide added (if breaking)
- [ ] Performance impact assessed

## Screenshots (if applicable)
![Profile edit form](screenshot.png)

## Related Issues
Closes #123
```

### 3. Keep PRs Focused

```bash
# ❌ BAD: One PR with multiple unrelated changes
- Fix login bug
- Update color scheme
- Add new API endpoint
- Refactor database queries

# ✅ GOOD: Separate PRs for each concern
- PR #1: Fix login bug
- PR #2: Update color scheme
- PR #3: Add new API endpoint
- PR #4: Refactor database queries
```

## Code Review Guidelines

### For Reviewers

1. **Be constructive** - Provide helpful feedback
2. **Ask questions** - Understand the intent
3. **Suggest improvements** - Don't just criticize
4. **Test the changes** - Verify functionality

### For Authors

1. **Keep PRs small** - Easier to review
2. **Respond to feedback** - Address all comments
3. **Update documentation** - Keep docs in sync
4. **Follow style guide** - Consistent code style

## Continuous Integration

### Automated Checks

```yaml
# .github/workflows/pr.yml
name: Pull Request Checks

on:
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run lint
      - run: npm run test
      - run: npm run build
```

### Branch Protection Rules

```bash
# Require:
- Pull request reviews before merging
- Status checks to pass
- No direct commits to main branch
- Up-to-date branch before merging
- Resolution of all conversations
```

## Useful Git Aliases

```bash
# Create helpful aliases
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.st status
git config --global alias.unstage 'reset HEAD --'
git config --global alias.last 'log -1 HEAD'
git config --global alias.visual 'log --graph --oneline --all --decorate'
```

## Rebase vs. Merge

### When to Rebase

```bash
# Rebase for cleaner history
git checkout feature-branch
git rebase main

# Use when:
- Feature branch is short-lived
- Linear history is important
- No collaborators on your branch
```

### When to Merge

```bash
# Merge for preserving history
git checkout main
git merge feature-branch

# Use when:
- Feature branch is long-lived
- Preserving commit history is important
- Multiple collaborators on branch
```

## Common Workflows

### Starting New Work

```bash
# 1. Update main branch
git checkout main
git pull origin main

# 2. Create feature branch
git checkout -b feature/new-feature

# 3. Do work and commit
git add .
git commit -m "feat: implement new feature"

# 4. Push to remote
git push -u origin feature/new-feature

# 5. Create pull request
# (through GitHub/GitLab UI)
```

### Handling Merge Conflicts

```bash
# 1. Update your branch
git checkout feature-branch
git pull origin main

# 2. Resolve conflicts
# (edit conflicted files)

# 3. Mark as resolved
git add <resolved-files>
git commit -m "chore: resolve merge conflicts"

# 4. Complete merge
git push origin feature-branch
```

## Best Practices Summary

1. **Use branching strategy** - Choose and stick to one
2. **Write clear commit messages** - Follow conventions
3. **Keep PRs focused** - One change per PR
4. **Review all code** - No code without review
5. **Automate checks** - CI/CD for quality
6. **Test before merging** - Ensure quality
7. **Document changes** - Keep docs updated
8. **Communicate** - Keep team informed

## Conclusion

A solid Git workflow improves code quality, team collaboration, and deployment reliability. Choose a strategy that fits your team size and project needs, and stick to it consistently!
