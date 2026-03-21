#!/usr/bin/env bash
# register.sh - Register a new port in Port Commander
# Usage: ./register.sh <port> <name> <path>

set -euo pipefail

if [ $# -lt 3 ]; then
    echo "Usage: $0 <port> <name> <path>"
    echo "Example: $0 3456 \"MyApp\" \"/path/to/app\""
    exit 1
fi

PORT="$1"
NAME="$2"
PATH="$3"
PORT_COMMANDER_URL="http://localhost:9999"

echo "📝 Registering port $PORT for $NAME"
echo "===================================="
echo ""

# Check if Port Commander is running
if ! curl -s "$PORT_COMMANDER_URL/api/ports" &> /dev/null; then
    echo "❌ Port Commander is not running at $PORT_COMMANDER_URL"
    echo "💡 Start it with: cd /Users/alethea/Documents/AntiGravity/PortCommander && npm start"
    exit 1
fi

# Register via API
RESPONSE=$(curl -s -X POST "$PORT_COMMANDER_URL/api/register" \
    -H "Content-Type: application/json" \
    -d "{\"port\": $PORT, \"name\": \"$NAME\", \"path\": \"$PATH\"}")

if echo "$RESPONSE" | grep -q "success"; then
    echo "✅ Port registered successfully"
    echo ""
    echo "Details:"
    echo "  Port: $PORT"
    echo "  Name: $NAME"
    echo "  Path: $PATH"
else
    echo "❌ Registration failed"
    echo "Response: $RESPONSE"
    exit 1
fi
