#!/usr/bin/env bash
# status.sh - Check Railway deployment status
# Usage: ./status.sh

set -euo pipefail

echo "📊 Railway Service Status"
echo "========================"
echo ""

# Check if railway CLI is available
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found. Install with: npm install -g @railway/cli"
    exit 1
fi

# Get service status
echo "🔍 Checking service status..."
railway status || {
    echo "❌ Failed to get status. Are you logged in and linked to a project?"
    echo "Run: railway login --browserless"
    echo "Then: railway link"
    exit 1
}

echo ""
echo "✅ Status check complete"
