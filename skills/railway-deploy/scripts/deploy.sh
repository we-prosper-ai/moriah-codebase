#!/usr/bin/env bash
# deploy.sh - Full Railway deployment workflow with verification
# Usage: ./deploy.sh [--skip-typecheck]

set -euo pipefail

SKIP_TYPECHECK=false

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --skip-typecheck)
            SKIP_TYPECHECK=true
            shift
            ;;
        *)
            echo "Usage: $0 [--skip-typecheck]"
            exit 1
            ;;
    esac
done

# Check if railway CLI is available
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found. Install with: npm install -g @railway/cli"
    exit 1
fi

echo "🚀 Railway Deployment Workflow"
echo "=============================="
echo ""

# Step 1: Type-check (unless skipped)
if [ "$SKIP_TYPECHECK" = false ]; then
    echo "📝 Step 1/3: Running type-check..."
    npx tsc --noEmit || {
        echo "❌ Type-check failed. Fix errors before deploying."
        exit 1
    }
    echo "✅ Type-check passed"
    echo ""
else
    echo "⚠️  Skipping type-check (--skip-typecheck flag)"
    echo ""
fi

# Step 2: Deploy
echo "📦 Step 2/3: Deploying to Railway..."
railway up --detach || {
    echo "❌ Deployment failed. Check logs with: railway logs"
    exit 1
}
echo "✅ Deployment triggered"
echo ""

# Step 3: Wait and verify
echo "⏳ Step 3/3: Waiting for build to complete (60 seconds)..."
sleep 60

echo ""
echo "📜 Checking logs for successful startup..."
railway logs --lines 40 | tee /tmp/railway-deploy-logs.txt

echo ""
echo "🔍 Verification checklist:"
echo ""

# Check for success indicators
if grep -q "Soul loaded" /tmp/railway-deploy-logs.txt; then
    echo "  ✅ Soul loaded"
else
    echo "  ❌ Soul NOT loaded"
fi

if grep -q "Connected as @" /tmp/railway-deploy-logs.txt; then
    echo "  ✅ Bot connected to Telegram"
else
    echo "  ❌ Bot NOT connected"
fi

if grep -q "Heartbeat" /tmp/railway-deploy-logs.txt; then
    echo "  ✅ Heartbeat scheduled"
else
    echo "  ❌ Heartbeat NOT scheduled"
fi

if grep -qi "error\|crash\|unhandled" /tmp/railway-deploy-logs.txt; then
    echo "  ⚠️  Errors detected in logs - review above"
else
    echo "  ✅ No obvious errors detected"
fi

echo ""
echo "🎉 Deployment complete! Monitor with: railway logs --follow"
