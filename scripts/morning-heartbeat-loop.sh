#!/bin/bash
# morning-heartbeat-loop.sh — Autonomous heartbeat monitoring (4:00 AM - 8:00 AM)
# Runs every 15 minutes, shows work, logs status, alerts on failures

WORKSPACE="/home/moriahkeeper/.openclaw/workspace"
LOG_FILE="$WORKSPACE/memory/$(date +%Y-%m-%d).md"
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

echo "🏔️ Heartbeat Check — $TIMESTAMP"

# 1. Verify Finance Friend is running
if lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null ; then
  echo "✅ Finance Friend v2 running on :3001"
  FINANCE_STATUS="running"
else
  echo "❌ ALERT: Finance Friend v2 NOT running!"
  FINANCE_STATUS="down"
  # Try to restart if needed (optional)
  # cd /tmp/finance-friend/server && npm start > /tmp/ff.log 2>&1 &
fi

# 2. Take work screenshot
bash "$WORKSPACE/scripts/show-work.sh" > /dev/null 2>&1
LATEST_SCREENSHOT=$(ls -t "$WORKSPACE"/ff-work-session-*.png 2>/dev/null | head -1)
SCREENSHOT_NAME=$(basename "$LATEST_SCREENSHOT" 2>/dev/null || echo "none")

# 3. Check GitHub status
cd "$WORKSPACE" > /dev/null
LATEST_COMMIT=$(git log -1 --pretty=format:"%h %s" 2>/dev/null || echo "error")
GIT_STATUS=$(git status -s 2>/dev/null | wc -l)

# 4. Log to memory
LOG_ENTRY="
### Heartbeat — $TIMESTAMP
- Finance Friend: $FINANCE_STATUS
- Latest screenshot: $SCREENSHOT_NAME
- Latest commit: $LATEST_COMMIT
- Uncommitted changes: $GIT_STATUS files
"

echo "$LOG_ENTRY" >> "$LOG_FILE"

# 5. Summary output
echo "---"
echo "Screenshot: $SCREENSHOT_NAME"
echo "Latest commit: $LATEST_COMMIT"
if [ $GIT_STATUS -gt 0 ]; then
  echo "Uncommitted work: $GIT_STATUS files (will commit on next cycle)"
else
  echo "All work committed ✅"
fi

echo ""
echo "Next check: $(date -d '+15 minutes' '+%H:%M %Z')"
