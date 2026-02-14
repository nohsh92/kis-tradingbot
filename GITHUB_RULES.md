# GitHub Repository Rules and Best Practices

This document outlines the GitHub repository rules and CI/CD best practices implemented for this project.

## Branch Protection Rules

### Main Branch Protection
- **No direct commits to main**: All changes must go through pull requests
- **Required status checks**: All CI checks must pass before merging
  - Backend linting (`lint-backend`)
  - Frontend linting (`lint-ui`) 
  - Backend tests (`test-backend`)
  - Frontend tests (`test-ui`)
  - Build verification (`build-backend`, `build-ui`)
- **Require pull request reviews**: At least 1 approval required
- **Dismiss stale reviews**: Reviews are dismissed when new commits are pushed
- **Require conversation resolution**: All PR discussions must be resolved

## Automatic Branch Management
- **Delete branch on merge**: Feature branches are automatically deleted after successful merge
- **Squash and merge**: Default merge strategy for clean history (optional rebase merge allowed)
- **No merge commits**: Keeps history linear and clean

## CI/CD Workflows

### 1. Lint (`ci-lint.yml`)
- Runs on push to main/develop/feature branches and all PRs
- Backend: Ruff linting for Python code
- Frontend: ESLint for TypeScript/React code

### 2. Test (`ci-test.yml`) 
- Runs on push to main/develop/feature branches and all PRs
- Backend: pytest for Python tests
- Frontend: Vitest for TypeScript/React tests

### 3. Build (`ci-build.yml`)
- Runs on push and PRs
- Backend: Verifies importability and installation
- Frontend: Full build verification with artifact storage

### 4. Complete CI (`ci-complete.yml`)
- Comprehensive workflow for pull requests to main
- Security audits (safety, npm audit)
- Quality gates (all lint/test/build checks)
- Integration validation

## Security Features
- **Automated security fixes**: Enabled for dependency updates
- **Vulnerability alerts**: Enabled for security issues
- **Dependency auditing**: Regular security scans in CI

## Best Practices Enforced
1. **Code review required**: No direct pushes to main
2. **All checks must pass**: CI gates prevent broken code from merging
3. **Clean history**: Squash merging keeps git history readable
4. **Automatic cleanup**: Merged branches are auto-deleted
5. **Security monitoring**: Automated vulnerability scanning

## Manual Setup Required

To fully enable these rules, repository administrators need to:

1. **Enable branch protection rules** via GitHub Settings > Branches
2. **Install GitHub Settings app** (optional) to use `.github/settings.yml`
3. **Configure repository settings**:
   - Enable "Automatically delete head branches"
   - Enable "Allow squash merging" 
   - Disable "Allow merge commits" (optional)

## Testing the Rules

This document was created on a test branch to verify the branch protection rules work correctly.