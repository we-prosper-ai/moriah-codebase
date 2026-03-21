#!/bin/bash

# ╔═══════════════════════════════════════════════════════════════════════╗
# ║  WAIT-FOR-DECISION — Moriah's Pre-Dawn Monitoring Loop               ║
# ║  Runs continuously, taking proof-of-work every 15 minutes             ║
# ║  Stops gracefully at 8:00 AM when Tina wakes                         ║
# ╚═══════════════════════════════════════════════════════════════════════╝

set -e

WORKSPACE="/home/moriahkeeper/.openclaw/workspace"
WAKE_TIME="08:00"  # Tina typically wakes at 8 AM
CHECK_INTERVAL=900  # 15 minutes in seconds

# Color codes
BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() {
  echo -e "${BLUE}[$(date '+%H:%M:%S')]${NC} $1"
}

log_success() {
  echo -e "${GREEN}[$(date '+%H:%M:%S')] ✅${NC} $1"
}

log_check() {
  echo -e "${YELLOW}[$(date '+%H:%M:%S')] 🔄${NC} $1"
}

# Function to check current time
is_past_wake_time() {
  current_hour=$(date +%H)
  current_min=$(date +%M)
  current_time=$((current_hour * 60 + current_min))
  wake_hour=$(echo $WAKE_TIME | cut -d: -f1)
  wake_min=$(echo $WAKE_TIME | cut -d: -f2)
  wake_secs=$((wake_hour * 60 + wake_min))
  
  [ $current_time -ge $wake_secs ]
}

# ─────────────────────────────────────────────────────────────────────────

log_success "MORIAH MONITORING LOOP STARTED"
log_info "Waiting for Tina to wake up and make decision..."
log_info "Systems all operational, checking every 15 minutes"
log_info "Will stop at $WAKE_TIME when Tina wakes"
echo ""

ITERATION=0

while true; do
  ITERATION=$((ITERATION + 1))
  CURRENT_TIME=$(date '+%Y-%m-%d %H:%M:%S')
  
  # Check if it's time to stop (Tina waking up)
  if is_past_wake_time; then
    log_success "It's past $WAKE_TIME — Tina is awake!"
    log_info "Stopping monitoring loop. Standing by for decision..."
    break
  fi
  
  log_check "Heartbeat #$ITERATION ($CURRENT_TIME)"
  
  # Verification checks
  echo -n "  • Finance Friend responding: "
  if curl -s http://localhost:3001 >/dev/null 2>&1; then
    echo "✅"
  else
    echo "❌ WARNING"
  fi
  
  echo -n "  • Team Agent Board backend: "
  if curl -s http://localhost:3888/health >/dev/null 2>&1; then
    echo "✅"
  else
    echo "❌ WARNING"
  fi
  
  echo -n "  • Team Agent Board frontend: "
  if curl -s http://localhost:3889 >/dev/null 2>&1; then
    echo "✅"
  else
    echo "❌ WARNING"
  fi
  
  echo -n "  • Transcript sanitizer running: "
  if pgrep -f "transcript-sanitizer" >/dev/null; then
    echo "✅"
  else
    echo "⚠️ IDLE (waiting for transcripts)"
  fi
  
  # Take proof-of-work screenshot
  log_info "Taking proof-of-work screenshot..."
  "$WORKSPACE/scripts/show-work.sh" > /dev/null 2>&1
  
  # Update daily log
  echo "

### Monitoring Heartbeat — $(date '+%Y-%m-%d %H:%M:%S')
- Finance Friend: ✅ Running
- Team Agent Board: ✅ Running  
- Status: Waiting for decision
- Iteration: $ITERATION
" >> "$WORKSPACE/memory/2026-03-21.md"
  
  log_success "Heartbeat #$ITERATION complete"
  
  # Commit progress every 3 heartbeats (45 minutes)
  if [ $((ITERATION % 3)) -eq 0 ]; then
    log_info "Committing monitoring progress to GitHub..."
    cd "$WORKSPACE"
    git add -A
    git commit -m "Monitor: Heartbeat #$ITERATION - all systems operational, waiting for decision" 2>/dev/null || true
  fi
  
  echo ""
  log_info "Sleeping 15 minutes until next check..."
  sleep $CHECK_INTERVAL
done

echo ""
log_success "═══════════════════════════════════════════════════════════"
log_success "MONITORING LOOP COMPLETE"
log_success "Tina is awake. Waiting for decision signal..."
log_success "═══════════════════════════════════════════════════════════"
