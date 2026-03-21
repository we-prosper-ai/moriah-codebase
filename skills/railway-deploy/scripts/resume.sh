#!/usr/bin/env bash
# resume.sh - Resume Railway service (after pause)
# Usage: ./resume.sh

set -euo pipefail

# Check if railway CLI is available
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found. Install with: npm install -g @railway/cli"
    exit 1
fi

echo "▶️  Resuming Railway Service"
echo "==========================="
echo ""

railway up --detach || {
    echo "❌ Failed to resume service. Check logs with: railway logs"
    exit 1
}

echo ""
echo "✅ Railway service resumed"
echo "💡 Monitor deployment with: railway logs --follow"
echo "💡 Full verification workflow available in: ./deploy.sh"
