# Branch Management Policy

**Effective Date:** 2025-01-09  
**Status:** Active

---

## Zero-Stale-Branch Policy

### Core Principle

**Feature branches must be merged or deleted within 7 days of creation.**

This policy prevents branch accumulation, reduces merge conflicts, and maintains codebase momentum.

---

## Branch Lifecycle Rules

### 1. Feature Branch Creation

**When to create:**
- Starting work on a new feature
- Fixing a bug that requires multiple commits
- Experimenting with a new approach

**Naming convention:**
- `feature/description-of-feature`
- `fix/description-of-bug`
- `refactor/description-of-refactor`
- `docs/description-of-docs`

**Example:**
```bash
git checkout -b feature/add-user-profile-page
```

### 2. Branch Maintenance

**During development:**
- Keep branch up to date with `main`:
  ```bash
  git checkout main
  git pull origin main
  git checkout feature/your-branch
  git merge main  # or git rebase main
  ```
- Commit frequently (at least daily)
- Push to remote regularly

### 3. Branch Completion

**Within 7 days:**
- Complete the feature
- Ensure all tests pass
- Run ESLint and fix any issues
- Create pull request (if using PR workflow)
- Merge to `main`
- Delete the branch

**Merge checklist:**
- [ ] All tests passing
- [ ] ESLint passes
- [ ] Code reviewed (if applicable)
- [ ] Documentation updated (if needed)
- [ ] Branch merged to `main`
- [ ] Branch deleted locally
- [ ] Branch deleted on remote

---

## Branch Cleanup Process

### Weekly Review (Sunday)

**Check for stale branches:**
```bash
# List all branches with last commit date
git for-each-ref --sort=-committerdate refs/heads/ --format='%(refname:short) %(committerdate:relative)'

# List branches older than 7 days
git for-each-ref --sort=-committerdate refs/heads/ --format='%(refname:short) %(committerdate:relative)' | awk -v cutoff="7 days ago" '{print}'
```

**Actions:**
1. Identify branches older than 7 days
2. Check if work is still needed
3. If complete: Merge and delete
4. If incomplete: Create plan to complete or archive
5. If abandoned: Delete

### Automated Cleanup (Future)

Consider setting up:
- GitHub Actions workflow to identify stale branches
- Automated notifications for branches approaching 7 days
- Branch protection rules requiring PR reviews

---

## Branch Types

### `main` Branch

**Purpose:** Production-ready code  
**Protection:**
- All commits must pass tests
- All commits must pass ESLint
- Direct pushes allowed (with quality gates via Husky)
- Consider adding branch protection rules in GitHub

### Feature Branches

**Purpose:** New features, enhancements  
**Lifespan:** Maximum 7 days  
**Merge:** Via pull request or direct merge (after review)

### Hotfix Branches

**Purpose:** Critical production fixes  
**Lifespan:** As short as possible (hours, not days)  
**Merge:** Fast-track to `main`, then merge to other active branches

### Release Branches

**Purpose:** Preparing releases  
**Lifespan:** Until release is complete  
**Note:** Not currently used, but may be needed in future

---

## Enforcement

### Pre-Commit Hooks

Husky pre-commit hooks ensure:
- Tests pass before commit
- ESLint passes before commit
- Code quality maintained

### Manual Review

**Weekly (Sunday):**
- Review all branches
- Identify stale branches
- Take action (merge, delete, or extend deadline)

**Before creating new branch:**
- Check if similar work exists in another branch
- Consider if work can be done directly on `main` (for small changes)

---

## Exceptions

### Extended Deadline

**When:** Work is complex and requires more than 7 days

**Process:**
1. Document why extension is needed
2. Create plan to complete within additional 7 days
3. Update branch with progress notes
4. Re-evaluate after extension period

**Example:**
```markdown
# Branch: feature/complex-refactor

**Status:** In progress
**Created:** 2025-01-09
**Extended until:** 2025-01-23
**Reason:** Major refactoring affecting multiple systems
**Progress:** 60% complete, on track for extended deadline
```

### Long-Running Branches

**When:** Branch serves a specific purpose (e.g., experimental work)

**Process:**
1. Rename to indicate it's experimental: `experimental/feature-name`
2. Document purpose and expected duration
3. Review monthly instead of weekly
4. Archive when no longer needed

---

## Best Practices

### 1. Keep Branches Small

**Better:**
- `feature/add-login-button`
- `feature/add-logout-button`

**Worse:**
- `feature/add-entire-authentication-system`

Small branches are easier to review, test, and merge.

### 2. Merge Frequently

Merge `main` into your branch regularly to avoid large merge conflicts.

### 3. Delete Immediately After Merge

Don't leave merged branches around. Delete them immediately:
```bash
git checkout main
git branch -d feature/your-branch
git push origin --delete feature/your-branch
```

### 4. Use Descriptive Names

Branch names should clearly indicate their purpose.

### 5. One Feature Per Branch

Don't mix multiple unrelated changes in one branch.

---

## Current Branch Status

**Active Branches:**
- `main` - Production branch ✅

**Stale Branches:**
- None (as of 2025-01-09) ✅

**Last Cleanup:**
- 2025-01-09 - Deleted `cursor/revive-project-with-ai-f46f` (merged to main)

---

## Related Documents

- [PROJECT_REVIVAL_BLUEPRINT.md](../PROJECT_REVIVAL_BLUEPRINT.md) - Component 5 details
- [ARCHITECTURE_DECISIONS.md](./ARCHITECTURE_DECISIONS.md) - ADR-005 (Quality Gates)

---

**Policy Owner:** Development Team  
**Review Frequency:** Monthly  
**Last Reviewed:** 2025-01-09
