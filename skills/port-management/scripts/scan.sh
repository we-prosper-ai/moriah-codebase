#!/usr/bin/env bash
# scan.sh - Scan all registered ports and show their status
# Usage: ./scan.sh

set -euo pipefail

PORT_COMMANDER_URL="http://localhost:9999"

echo "🔍 Port Status Scan"
echo "==================="
echo ""

# Check if Port Commander is running
if ! curl -s "$PORT_COMMANDER_URL/api/ports" &> /dev/null; then
    echo "❌ Port Commander is not running at $PORT_COMMANDER_URL"
    echo "💡 Start it with: cd /Users/alethea/Documents/AntiGravity/PortCommander && npm start"
    exit 1
fi

# Get all ports
PORTS_JSON=$(curl -s "$PORT_COMMANDER_URL/api/ports")

echo "$PORTS_JSON" | python3 -m json.tool || {
    echo "❌ Failed to parse Port Commander response"
    exit 1
}

echo ""
echo "✅ Port scan complete"
echo "💡 View in browser: $PORT_COMMANDER_URL"
