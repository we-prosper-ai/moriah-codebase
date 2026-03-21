#!/usr/bin/env bash
# kill.sh - Kill process running on specific port
# Usage: ./kill.sh <port>

set -euo pipefail

if [ $# -eq 0 ]; then
    echo "Usage: $0 <port>"
    exit 1
fi

PORT="$1"
PORT_COMMANDER_URL="http://localhost:9999"

echo "💀 Killing process on port $PORT"
echo "================================"
echo ""

# Try Port Commander API first
if curl -s "$PORT_COMMANDER_URL/api/kill" -X POST \
    -H "Content-Type: application/json" \
    -d "{\"port\": $PORT}" &> /dev/null; then

    echo "✅ Killed via Port Commander API"
    exit 0
fi

# Fallback to direct kill
echo "⚠️  Port Commander not available, using direct kill..."

if ! lsof -i ":$PORT" &> /dev/null; then
    echo "❌ No process found on port $PORT"
    exit 1
fi

PID=$(lsof -t -i ":$PORT")
echo "Found PID: $PID"

kill "$PID" && echo "✅ Process killed" || {
    echo "❌ Failed to kill process. Try: sudo kill -9 $PID"
    exit 1
}
