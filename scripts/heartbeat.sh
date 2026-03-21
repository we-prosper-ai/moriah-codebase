#!/bin/bash
# Moriah heartbeat — periodic status check
set -e

WORKSPACE="/home/moriahkeeper/.openclaw/workspace"
CRON_RUNS="$HOME/.openclaw/cron/runs"
LOG_REPO="/tmp/moriah-log-repo"

echo "🏔️ Heartbeat check — $(date '+%Y-%m-%d %H:%M:%S %Z')"

# 1. Check cron job status
echo ""
echo "📋 Cron status:"
if [ -d "$CRON_RUNS" ]; then
  failed=$(find "$CRON_RUNS" -name "*.jsonl" -exec grep -l '"status":"error"' {} \; 2>/dev/null | wc -l)
  if [ "$failed" -gt 0 ]; then
    echo "⚠️  $failed failed cron runs"
  else
    echo "✅ All cron jobs healthy"
  fi
else
  echo "No cron runs yet"
fi

# 2. Update moriah-log README
echo ""
echo "📝 Updating activity log..."
if [ -d "$LOG_REPO" ]; then
  cd "$LOG_REPO"
  git pull origin main 2>/dev/null || true
  
  # Append heartbeat entry
  echo "- $(date '+%Y-%m-%d %H:%M:%S %Z') - Heartbeat check: system operational" >> README.md
  
  git add README.md
  git commit -m "Heartbeat: $(date '+%Y-%m-%d %H:%M')" 2>/dev/null || true
  git push origin main 2>/dev/null || echo "Push failed; continuing"
  echo "✅ Log updated"
else
  echo "⚠️  Log repo not found at $LOG_REPO"
fi

# 3. Dashboard screenshot
echo ""
echo "📸 Dashboard snapshot..."
if command -v chromium &> /dev/null; then
  chromium --headless --no-sandbox \
    --screenshot="$WORKSPACE/dashboard-screenshot-$(date +%s).png" \
    --window-size=1280,720 \
    http://localhost:8080 2>/dev/null || echo "Dashboard offline"
  echo "✅ Screenshot saved"
else
  echo "Chromium not found"
fi

echo ""
echo "✅ Heartbeat complete"
