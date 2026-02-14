#!/bin/bash
set -e

# GitHub Settings Verification Script
# This script uses the GitHub CLI to verify that branch protection rules are properly applied

REPO="nohsh92/kis-tradingbot"
BRANCH="main"

echo "🔍 Verifying GitHub repository settings for $REPO"
echo "=================================================="

# Check if GitHub CLI is installed
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) is not installed"
    echo "📝 Install it from: https://cli.github.com/"
    echo "   Or use the manual verification steps in VERIFY_SETTINGS.md"
    exit 1
fi

# Check if authenticated
if ! gh auth status &> /dev/null; then
    echo "❌ Not authenticated with GitHub CLI"
    echo "🔑 Run: gh auth login"
    exit 1
fi

echo "✅ GitHub CLI is installed and authenticated"
echo ""

# Function to check setting
check_setting() {
    local setting=$1
    local expected=$2
    local actual=$3
    
    if [[ "$actual" == "$expected" ]]; then
        echo "✅ $setting: $actual"
        return 0
    else
        echo "❌ $setting: expected '$expected', got '$actual'"
        return 1
    fi
}

# Check repository settings
echo "📋 Repository Settings:"
echo "----------------------"

# Get repository info
repo_info=$(gh repo view $REPO --json deleteBranchOnMerge,allowMergeCommit,allowSquashMerge,allowRebaseMerge)

delete_branch=$(echo "$repo_info" | jq -r '.deleteBranchOnMerge')
allow_merge_commit=$(echo "$repo_info" | jq -r '.allowMergeCommit')
allow_squash_merge=$(echo "$repo_info" | jq -r '.allowSquashMerge')
allow_rebase_merge=$(echo "$repo_info" | jq -r '.allowRebaseMerge')

check_setting "Delete branch on merge" "true" "$delete_branch"
check_setting "Allow squash merge" "true" "$allow_squash_merge"
check_setting "Allow rebase merge" "true" "$allow_rebase_merge"
check_setting "Allow merge commit" "false" "$allow_merge_commit"

echo ""

# Check branch protection
echo "🔒 Branch Protection Rules for '$BRANCH':"
echo "----------------------------------------"

# Get branch protection info
if ! protection_info=$(gh api repos/$REPO/branches/$BRANCH/protection 2>/dev/null); then
    echo "❌ No branch protection rules found for '$BRANCH' branch"
    echo "🛠️  Please set up branch protection rules manually or install GitHub Settings app"
    exit 1
fi

# Parse protection settings
required_reviews=$(echo "$protection_info" | jq -r '.required_pull_request_reviews.required_approving_review_count // "0"')
dismiss_stale=$(echo "$protection_info" | jq -r '.required_pull_request_reviews.dismiss_stale_reviews // false')
require_status_checks=$(echo "$protection_info" | jq -r '.required_status_checks != null')
status_checks_strict=$(echo "$protection_info" | jq -r '.required_status_checks.strict // false')
conversation_resolution=$(echo "$protection_info" | jq -r '.required_conversation_resolution.enabled // false')
allow_force_pushes=$(echo "$protection_info" | jq -r '.allow_force_pushes.enabled // false')

check_setting "Required PR reviews" "1" "$required_reviews"
check_setting "Dismiss stale reviews" "true" "$dismiss_stale"
check_setting "Require status checks" "true" "$require_status_checks"
check_setting "Status checks strict mode" "true" "$status_checks_strict"
check_setting "Require conversation resolution" "true" "$conversation_resolution"
check_setting "Allow force pushes" "false" "$allow_force_pushes"

echo ""

# Check required status checks
echo "🧪 Required Status Checks:"
echo "-------------------------"

required_checks=("lint-backend" "lint-ui" "test-backend" "test-ui" "build-backend" "build-ui")
actual_checks=$(echo "$protection_info" | jq -r '.required_status_checks.checks[]?.context // empty' 2>/dev/null)

echo "Expected checks: ${required_checks[*]}"
echo "Actual checks: $actual_checks"

missing_checks=()
for check in "${required_checks[@]}"; do
    if echo "$actual_checks" | grep -q "^$check$"; then
        echo "✅ $check"
    else
        echo "❌ $check (missing)"
        missing_checks+=("$check")
    fi
done

echo ""

# Summary
if [[ ${#missing_checks[@]} -eq 0 ]] && [[ "$delete_branch" == "true" ]] && [[ "$allow_merge_commit" == "false" ]]; then
    echo "🎉 All GitHub settings are configured correctly!"
    echo "✨ Your repository is protected with proper branch rules"
else
    echo "⚠️  Some settings need attention:"
    if [[ ${#missing_checks[@]} -gt 0 ]]; then
        echo "   Missing status checks: ${missing_checks[*]}"
    fi
    echo ""
    echo "🛠️  To fix issues:"
    echo "   1. Install GitHub Settings app: https://github.com/apps/settings"
    echo "   2. Or manually configure settings in GitHub repo settings"
    echo "   3. See VERIFY_SETTINGS.md for detailed manual steps"
fi

echo ""
echo "📊 Verification complete!"