#!/bin/bash
# show-work.sh — Show what Moriah has been working on
# Captures server status, screenshots, and progress

WORKSPACE="/home/moriahkeeper/.openclaw/workspace"
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
TIMESTAMP_FILE=$(date +%Y-%m-%d)
LOG_FILE="$WORKSPACE/memory/$TIMESTAMP_FILE.md"
SCREENSHOT_FILE="$WORKSPACE/ff-work-session-$(date +%s).png"

echo "🏔️ Moriah — Showing Work ($TIMESTAMP)"

# Ensure memory file exists
mkdir -p "$WORKSPACE/memory"
touch "$LOG_FILE"

# Start Finance Friend server
cd /tmp/finance-friend/server 2>/dev/null || cd /home/moriahkeeper/.openclaw/workspace
npm start > /tmp/ff-server.log 2>&1 &
FF_PID=$!
sleep 3

# Check if server is running
if lsof -i :3001 > /dev/null 2>&1; then
  echo "✅ Finance Friend running on http://localhost:3001"
  
  # Capture screenshot with chromium
  chromium --headless --disable-gpu --screenshot="$SCREENSHOT_FILE" \
    --window-size=1280,800 http://localhost:3001 2>/dev/null &
  sleep 2
  
  # Log to memory
  {
    echo ""
    echo "### Work Session — $TIMESTAMP"
    echo "- **Finance Friend**: Running on localhost:3001"
    echo "- **Screenshot**: $(basename $SCREENSHOT_FILE)"
    echo "- **Status**: ✅ Operational"
  } >> "$LOG_FILE"
  
  echo "Screenshot saved: $SCREENSHOT_FILE"
else
  echo "❌ Finance Friend failed to start"
  cat /tmp/ff-server.log 2>/dev/null || echo "No log available"
fi

echo "Logged to: $LOG_FILE"

# Cleanup
kill $FF_PID 2>/dev/null || true
wait $FF_PID 2>/dev/null || true
