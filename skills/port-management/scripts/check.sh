#!/usr/bin/env bash
# check.sh - Check if a specific port is available
# Usage: ./check.sh <port>

set -euo pipefail

if [ $# -eq 0 ]; then
    echo "Usage: $0 <port>"
    exit 1
fi

PORT="$1"

echo "🔍 Checking port $PORT..."
echo ""

# Check if port is listening
if lsof -i ":$PORT" &> /dev/null; then
    echo "❌ Port $PORT is IN USE"
    echo ""
    echo "Process details:"
    lsof -i ":$PORT"
    exit 1
else
    echo "✅ Port $PORT is AVAILABLE"
    exit 0
fi
