#!/usr/bin/env bash
# pause.sh - Pause Railway service (enter dev mode)
# Usage: ./pause.sh

set -euo pipefail

# Check if railway CLI is available
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found. Install with: npm install -g @railway/cli"
    exit 1
fi

echo "⏸️  Pausing Railway Service"
echo "=========================="
echo ""
echo "This will stop the Railway deployment so you can test locally."
echo "Remember: Only ONE instance should be running at a time to avoid Telegram conflicts."
echo ""

railway down || {
    echo "❌ Failed to pause service. Are you logged in and linked?"
    exit 1
}

echo ""
echo "✅ Railway service paused"
echo "💡 You can now start local dev with: npm run dev"
echo "💡 When done testing, deploy with: railway up --detach"
