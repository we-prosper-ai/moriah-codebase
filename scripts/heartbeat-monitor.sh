#!/bin/bash

# 15-minute heartbeat monitoring script
# Runs continuously, checking all systems

TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

echo "🏔️ Moriah Heartbeat Monitor — $TIMESTAMP"
echo ""

# Check all ports
echo "=== SYSTEM STATUS ==="

# Port 3001
if lsof -i :3001 > /dev/null 2>&1; then
    RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001 2>/dev/null || echo "000")
    if [ "$RESPONSE" = "200" ] || [ "$RESPONSE" = "301" ] || [ "$RESPONSE" = "302" ]; then
        echo "✅ Port 3001 (Finance Friend): RESPONDING"
    else
        echo "⚠️  Port 3001 (Finance Friend): HTTP $RESPONSE"
    fi
else
    echo "❌ Port 3001 (Finance Friend): NOT LISTENING"
fi

# Port 3888
if lsof -i :3888 > /dev/null 2>&1; then
    RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3888/api/tasks 2>/dev/null || echo "000")
    if [ "$RESPONSE" = "401" ] || [ "$RESPONSE" = "200" ]; then
        echo "✅ Port 3888 (Team Board API): RESPONDING"
    else
        echo "⚠️  Port 3888 (Team Board API): HTTP $RESPONSE"
    fi
else
    echo "❌ Port 3888 (Team Board API): NOT LISTENING"
fi

# Port 3889
if lsof -i :3889 > /dev/null 2>&1; then
    RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3889 2>/dev/null || echo "000")
    if [ "$RESPONSE" = "200" ] || [ "$RESPONSE" = "301" ]; then
        echo "✅ Port 3889 (Team Board UI): RESPONDING"
    else
        echo "⚠️  Port 3889 (Team Board UI): HTTP $RESPONSE"
    fi
else
    echo "❌ Port 3889 (Team Board UI): NOT LISTENING"
fi

echo ""
echo "=== DISK STATUS ==="
WORKSPACE_SIZE=$(du -sh /home/moriahkeeper/.openclaw/workspace 2>/dev/null | awk '{print $1}')
echo "📁 Workspace size: $WORKSPACE_SIZE"

echo ""
echo "=== MEMORY STATUS ==="
MEMORY_FILES=$(find /home/moriahkeeper/.openclaw/workspace/memory -name "*.md" 2>/dev/null | wc -l)
echo "📝 Memory files: $MEMORY_FILES"

echo ""
echo "🏔️ All systems nominal. Standing by."
echo ""
