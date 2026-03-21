#!/usr/bin/env bash
# logs.sh - View Railway logs with sensible defaults
# Usage: ./logs.sh [--lines N] [--follow]

set -euo pipefail

LINES=100
FOLLOW=false

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --lines)
            LINES="$2"
            shift 2
            ;;
        --follow|-f)
            FOLLOW=true
            shift
            ;;
        *)
            echo "Usage: $0 [--lines N] [--follow]"
            exit 1
            ;;
    esac
done

# Check if railway CLI is available
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found. Install with: npm install -g @railway/cli"
    exit 1
fi

echo "📜 Railway Logs (last $LINES lines)"
echo "===================================="
echo ""

if [ "$FOLLOW" = true ]; then
    railway logs --lines "$LINES" --follow
else
    railway logs --lines "$LINES"
fi
