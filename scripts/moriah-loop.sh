#!/bin/bash
# Moriah Self-Activating Loop
# Runs autonomously: check projects → log progress → execute next task → repeat

set -e

WORKSPACE="/home/moriahkeeper/.openclaw/workspace"
LOG_FILE="$WORKSPACE/.moriah-loop.log"
PROJECTS_FILE="$WORKSPACE/MORIAH_FOCUS_PROJECTS.md"

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S %Z')] $1" >> "$LOG_FILE"
}

# Initialize log
log "=== MORIAH LOOP STARTED ==="

# Check if we're in a session already
if [ -f "$WORKSPACE/.loop-running" ]; then
    log "Loop already running, exiting"
    exit 0
fi

touch "$WORKSPACE/.loop-running"
trap "rm -f $WORKSPACE/.loop-running" EXIT

log "Reading projects file..."
if [ ! -f "$PROJECTS_FILE" ]; then
    log "ERROR: Projects file not found at $PROJECTS_FILE"
    exit 1
fi

# Read the projects file to understand current state
PROJECTS_CONTENT=$(cat "$PROJECTS_FILE")
log "Projects loaded ($(echo "$PROJECTS_CONTENT" | wc -l) lines)"

# Determine what to work on
# This is where the decision logic lives
log "Determining next task..."

# For now: check both projects for status
HAS_FF_RESEARCH=$(grep -q "Finance Friend → product-ready" "$PROJECTS_FILE" && echo "yes" || echo "no")
HAS_BOARD_RESEARCH=$(grep -q "Team Agent Board" "$PROJECTS_FILE" && echo "yes" || echo "no")

log "Finance Friend project: $HAS_FF_RESEARCH"
log "Team Board project: $HAS_BOARD_RESEARCH"

# Log current state
echo "" >> "$LOG_FILE"
log "LOOP CYCLE COMPLETE"
log "Ready for next task assignment"

exit 0
