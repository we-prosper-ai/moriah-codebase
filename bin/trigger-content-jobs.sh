#!/bin/bash

################################################################################
# Content Team Job Trigger
# 
# Watches wisdom folder for new JSON files (from extractor)
# Automatically creates jobs for content agents
# Runs every 5 minutes via cron
#
# Usage: ./bin/trigger-content-jobs.sh
# Or: 0 */1 * * * /path/to/bin/trigger-content-jobs.sh (cron)
################################################################################

set -e

WORKSPACE="/home/moriahkeeper/.openclaw/workspace"
WISDOM_DIR="$WORKSPACE/wisdom"
LOG_FILE="$WORKSPACE/logs/job-trigger.log"
JOB_QUEUE_DIR="$WORKSPACE/agent-swarms-foundation/job-queue"

# Ensure directories exist
mkdir -p "$WISDOM_DIR" "$JOB_QUEUE_DIR" "$(dirname "$LOG_FILE")"

# Logging function
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE"
}

# Get wisdom files that haven't been processed yet
# (Hint: if a .processed file exists, we've already created jobs for it)
PROCESSED_DIR="$WISDOM_DIR/.processed"
mkdir -p "$PROCESSED_DIR"

log "Starting job trigger scan..."

for WISDOM_FILE in "$WISDOM_DIR"/*.json; do
    # Skip if not found or if it's the index
    [ -f "$WISDOM_FILE" ] || continue
    [ "$(basename "$WISDOM_FILE")" = "index.json" ] && continue
    
    BASENAME=$(basename "$WISDOM_FILE" .json)
    PROCESSED_MARKER="$PROCESSED_DIR/${BASENAME}.processed"
    
    # Skip if already processed
    if [ -f "$PROCESSED_MARKER" ]; then
        continue
    fi
    
    log "Processing wisdom file: $BASENAME"
    
    # Extract topic name and key themes from wisdom JSON
    # (Simplified - in production use jq or Python for robust JSON parsing)
    TOPIC="$BASENAME"
    
    # Create job for each content team agent
    create_job() {
        local AGENT=$1
        local JOB_TITLE=$2
        local JOB_FILE="$JOB_QUEUE_DIR/${TOPIC}-${AGENT}-$(date +%s).json"
        
        cat > "$JOB_FILE" << EOF
{
  "id": "$(date +%s)-$RANDOM",
  "topic": "$TOPIC",
  "wisdom_file": "$WISDOM_FILE",
  "agent": "$AGENT",
  "title": "$JOB_TITLE",
  "status": "pending",
  "created_at": "$(date -u +'%Y-%m-%dT%H:%M:%SZ')",
  "priority": "high",
  "deadline_hours": 4
}
EOF
        log "Created job: $AGENT for $TOPIC"
    }
    
    # Create jobs for all 4 content agents
    create_job "video_producer" "Write video script: $TOPIC"
    create_job "copywriter" "Write email sequence: $TOPIC launch"
    create_job "graphics_designer" "Create design brief: $TOPIC landing page"
    create_job "course_architect" "Design course: $TOPIC"
    
    # Mark as processed
    touch "$PROCESSED_MARKER"
    log "Marked $BASENAME as processed"
done

log "Job trigger scan complete"
echo "OK" > /dev/null
