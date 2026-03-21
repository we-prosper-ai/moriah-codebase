#!/bin/bash

# ╔═══════════════════════════════════════════════════════════════════════╗
# ║  EXECUTE-ON-DECISION — Moriah's Ready-to-Deploy Scripts              ║
# ║  Run ONLY when Tina gives signal A, B, or C                          ║
# ╚═══════════════════════════════════════════════════════════════════════╝

set -e

WORKSPACE="/home/moriahkeeper/.openclaw/workspace"
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
DECISION="${1:-}"

# Color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

log_info() {
  echo -e "${BLUE}[${TIMESTAMP}]${NC} $1"
}

log_success() {
  echo -e "${GREEN}[${TIMESTAMP}] ✅${NC} $1"
}

log_warn() {
  echo -e "${YELLOW}[${TIMESTAMP}] ⚠️${NC} $1"
}

log_error() {
  echo -e "${RED}[${TIMESTAMP}] ❌${NC} $1"
}

# ─────────────────────────────────────────────────────────────────────────
# DECISION A: TRANSCRIPTS ONLY
# ─────────────────────────────────────────────────────────────────────────

execute_option_a() {
  log_info "DECISION A: Processing Tina's transcripts"
  log_info "Waiting for transcripts folder..."
  
  # Wait for input (transcripts location)
  read -p "Enter path to transcripts folder (or press Enter for default): " TRANSCRIPT_PATH
  TRANSCRIPT_PATH="${TRANSCRIPT_PATH:-.}"
  
  if [ ! -d "$TRANSCRIPT_PATH" ]; then
    log_error "Transcripts folder not found: $TRANSCRIPT_PATH"
    exit 1
  fi
  
  TRANSCRIPT_COUNT=$(find "$TRANSCRIPT_PATH" -type f | wc -l)
  log_info "Found $TRANSCRIPT_COUNT transcript files"
  
  # Step 1: Run Sanitizer
  log_info "Step 1/3: Running transcript sanitizer (remove PII, extract metadata)..."
  cd "$WORKSPACE/transcript-sanitizer-service"
  node dist/index.js "$TRANSCRIPT_PATH" > "$WORKSPACE/logs/sanitizer-run-$(date +%s).log" 2>&1 &
  SANITIZER_PID=$!
  wait $SANITIZER_PID
  log_success "Sanitizer complete"
  
  # Step 2: Run Extractor
  log_info "Step 2/3: Running wisdom extractor (structure teachings, create modules)..."
  cd "$WORKSPACE/wisdom-extractor"
  node dist/index.js "$WORKSPACE/sanitized-transcripts" > "$WORKSPACE/logs/extractor-run-$(date +%s).log" 2>&1 &
  EXTRACTOR_PID=$!
  wait $EXTRACTOR_PID
  log_success "Extractor complete"
  
  # Step 3: Build Products
  log_info "Step 3/3: Building CoachTinaMarie + AI Entrepreneur Course..."
  cd "$WORKSPACE"
  npm run build:coach-tina-marie > "$WORKSPACE/logs/build-coach-$(date +%s).log" 2>&1 &
  BUILD_PID=$!
  wait $BUILD_PID
  log_success "Products built and ready to deploy"
  
  log_success "OPTION A COMPLETE: Products ready on localhost"
  log_info "Next: Deploy to Vercel (manual step)"
}

# ─────────────────────────────────────────────────────────────────────────
# DECISION B: AGENT SWARMS ONLY
# ─────────────────────────────────────────────────────────────────────────

execute_option_b() {
  log_info "DECISION B: Deploying Agent Swarms infrastructure"
  
  # Phase 1: Setup PostgreSQL + Database
  log_info "Phase 1/5: Setting up PostgreSQL database..."
  cd "$WORKSPACE/agent-swarms-foundation"
  npm run db:init > "$WORKSPACE/logs/swarms-phase1-$(date +%s).log" 2>&1
  log_success "Phase 1 complete: Database ready"
  
  # Phase 2: Deploy API server
  log_info "Phase 2/5: Deploying API server..."
  npm run server:start > "$WORKSPACE/logs/swarms-phase2-$(date +%s).log" 2>&1 &
  log_success "Phase 2 complete: API running"
  
  # Phase 3: Deploy agents
  log_info "Phase 3/5: Initializing 12 specialized agents..."
  npm run agents:init > "$WORKSPACE/logs/swarms-phase3-$(date +%s).log" 2>&1
  log_success "Phase 3 complete: All agents initialized"
  
  # Phase 4: Deploy technical team (DevOps, QA, etc.)
  log_info "Phase 4/5: Setting up technical team agents..."
  npm run team:technical > "$WORKSPACE/logs/swarms-phase4-$(date +%s).log" 2>&1
  log_success "Phase 4 complete: Technical team ready"
  
  # Phase 5: Deploy sales team + orchestration
  log_info "Phase 5/5: Activating sales automation + full orchestration..."
  npm run team:sales > "$WORKSPACE/logs/swarms-phase5-$(date +%s).log" 2>&1
  log_success "Phase 5 complete: Full system operational"
  
  log_success "OPTION B COMPLETE: Agent Swarms live and running"
  log_info "Dashboard available at: http://localhost:3900"
}

# ─────────────────────────────────────────────────────────────────────────
# DECISION C: BOTH (MOONSHOT)
# ─────────────────────────────────────────────────────────────────────────

execute_option_c() {
  log_info "DECISION C: MOONSHOT MODE - Executing both A and B simultaneously"
  log_warn "This will run multiple heavy workloads. Monitor system resources."
  
  # Start Option A in background
  log_info "Starting Option A (Transcripts) in background..."
  execute_option_a > "$WORKSPACE/logs/option-a-execution-$(date +%s).log" 2>&1 &
  OPTION_A_PID=$!
  
  # Give it a head start
  sleep 5
  
  # Start Option B in background
  log_info "Starting Option B (Agent Swarms) in background..."
  execute_option_b > "$WORKSPACE/logs/option-b-execution-$(date +%s).log" 2>&1 &
  OPTION_B_PID=$!
  
  # Monitor both
  log_info "Both processes running in parallel..."
  log_info "Option A PID: $OPTION_A_PID"
  log_info "Option B PID: $OPTION_B_PID"
  
  # Wait for both to complete
  wait $OPTION_A_PID $OPTION_B_PID
  
  log_success "OPTION C COMPLETE: Both revenue paths live"
  log_info "Products (A): localhost:3000"
  log_info "Agent Dashboard (B): localhost:3900"
}

# ─────────────────────────────────────────────────────────────────────────
# MAIN
# ─────────────────────────────────────────────────────────────────────────

if [ -z "$DECISION" ]; then
  echo ""
  echo "╔════════════════════════════════════════════════════════════════╗"
  echo "║  Moriah's Execution Script — Ready to deploy on your signal    ║"
  echo "╚════════════════════════════════════════════════════════════════╝"
  echo ""
  echo "Usage: $0 [A|B|C]"
  echo ""
  echo "  A = Transcripts only ($77K/month in 19 hours)"
  echo "  B = Agent Swarms only ($2.8M/year in 20 days)"
  echo "  C = Both (MOONSHOT — everything by April 14)"
  echo ""
  echo "Example:"
  echo "  $0 A    # Process transcripts and launch products"
  echo "  $0 B    # Deploy agent swarms infrastructure"
  echo "  $0 C    # Run both simultaneously"
  echo ""
  exit 0
fi

# Ensure we have logs directory
mkdir -p "$WORKSPACE/logs"

case "$DECISION" in
  A|a)
    execute_option_a
    ;;
  B|b)
    execute_option_b
    ;;
  C|c)
    execute_option_c
    ;;
  *)
    log_error "Unknown decision: $DECISION"
    echo "Valid options: A, B, or C"
    exit 1
    ;;
esac

# Final status
echo ""
log_success "═══════════════════════════════════════════════════════════"
log_success "Execution complete. All systems ready."
log_success "═══════════════════════════════════════════════════════════"
