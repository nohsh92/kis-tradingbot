# GitHub Settings Verification Guide

This guide helps you verify that the GitHub repository settings and branch protection rules are properly configured.

## 🚀 Quick Automated Check

Run the verification script:
```bash
# Make sure you're in the repository root
cd /path/to/kis-tradingbot

# Run the verification script
./scripts/verify-github-settings.sh
```

**Prerequisites for automated check:**
- [GitHub CLI](https://cli.github.com/) installed (`gh --version`)
- Authenticated with GitHub (`gh auth login`)
- Repository access permissions

## 📋 Manual Verification Checklist

If you prefer to check manually or the script doesn't work, follow this checklist:

### 1. Repository Settings
Navigate to: **Settings > General > Features**

**Merge Strategy Settings:**
- [ ] ✅ **Allow squash merging** is enabled
- [ ] ✅ **Allow rebase merging** is enabled  
- [ ] ❌ **Allow merge commits** is disabled (for clean history)

**Branch Management:**
- [ ] ✅ **Automatically delete head branches** is enabled

### 2. Branch Protection Rules
Navigate to: **Settings > Branches**

**For `main` branch protection rule:**

#### Pull Request Settings:
- [ ] ✅ **Require pull request reviews before merging**
  - Required approving reviews: **1**
- [ ] ✅ **Dismiss stale PR reviews when new commits are pushed**
- [ ] ✅ **Require review from code owners** (optional)

#### Status Check Settings:
- [ ] ✅ **Require status checks to pass before merging**
- [ ] ✅ **Require branches to be up to date before merging**
- [ ] ✅ **Status checks found in this repository:**
  - `lint-backend`
  - `lint-ui`
  - `test-backend`
  - `test-ui`
  - `build-backend`
  - `build-ui`

#### Additional Settings:
- [ ] ✅ **Require conversation resolution before merging**
- [ ] ❌ **Allow force pushes** is disabled
- [ ] ❌ **Allow deletions** is disabled

### 3. GitHub Actions Settings
Navigate to: **Settings > Actions > General**

- [ ] ✅ **Allow all actions and reusable workflows**
- [ ] ✅ **Allow actions created by GitHub** 
- [ ] ✅ **Allow actions by Marketplace verified creators**

### 4. Security Settings
Navigate to: **Settings > Security & analysis**

- [ ] ✅ **Dependency graph** is enabled
- [ ] ✅ **Dependabot alerts** is enabled  
- [ ] ✅ **Dependabot security updates** is enabled

## 🧪 Testing the Rules

### Test 1: Try Direct Push to Main (Should Fail)
```bash
# This should be blocked if rules are working
git checkout main
echo "test" >> README.md
git add README.md
git commit -m "test direct push"
git push origin main  # Should fail with protection error
```

### Test 2: Create PR (Should Require Checks)
```bash
# Create feature branch
git checkout -b test/verify-protection
echo "# Test file" > test-protection.md
git add test-protection.md
git commit -m "Test branch protection"
git push origin test/verify-protection

# Create PR via GitHub web interface
# PR should show required status checks that must pass
```

## 🔧 Troubleshooting

### Status Checks Not Showing
If the required status checks (`lint-backend`, etc.) don't appear in the branch protection settings:

1. **Run a workflow first**: Push a commit or create a PR to trigger CI workflows
2. **Wait for completion**: Status checks only appear after they've run at least once
3. **Check workflow names**: Verify job names in `.github/workflows/` match the required checks

### GitHub Settings App Issues
If using the GitHub Settings app:

1. **Check app installation**: Ensure it's installed for your repository
2. **Verify permissions**: App needs admin access to apply settings
3. **Check logs**: Look for any error messages in the app's activity log
4. **Force refresh**: Push a change to `.github/settings.yml` to trigger re-application

### Common Permission Issues
- **Not repository admin**: Only admins can modify branch protection rules
- **Organization policies**: Organization-level policies might override repository settings
- **App permissions**: GitHub Apps need proper permissions to modify repository settings

## 📞 Getting Help

If settings aren't applying correctly:

1. **Check the verification script output** for specific issues
2. **Review GitHub's branch protection documentation**
3. **Verify your role** has admin permissions on the repository
4. **Check organization policies** that might interfere

## ✅ Success Indicators

When everything is configured correctly, you should see:

1. **Green checkmarks** in the verification script output
2. **"Protected"** badge next to the main branch in GitHub
3. **Required status checks** listed in PR merge section
4. **Merge button disabled** until all checks pass
5. **Automatic branch deletion** after PR merge

## 🎯 Next Steps

Once verification passes:
1. **Document the process** for your team
2. **Train contributors** on the new workflow
3. **Monitor the first few PRs** to ensure everything works smoothly
4. **Adjust rules** if needed based on team feedback