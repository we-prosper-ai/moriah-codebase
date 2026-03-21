#!/usr/bin/env bash
# find-free.sh - Find next available port in a range
# Usage: ./find-free.sh [start_port] [end_port]

set -euo pipefail

START_PORT=${1:-3000}
END_PORT=${2:-9999}

echo "🔍 Finding free port in range $START_PORT-$END_PORT"
echo "==================================================="
echo ""

for port in $(seq "$START_PORT" "$END_PORT"); do
    if ! lsof -i ":$port" &> /dev/null; then
        echo "✅ Found free port: $port"
        exit 0
    fi
done

echo "❌ No free ports found in range $START_PORT-$END_PORT"
exit 1
