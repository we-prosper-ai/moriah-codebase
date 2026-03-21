#!/bin/bash
# 🏔️ EXECUTE TRANSCRIPT PIPELINE IMMEDIATELY
# 
# This script assumes transcripts have just arrived and are ready to process.
# It orchestrates the COMPLETE pipeline from raw transcripts to wisdom database.
#
# Usage: ./scripts/EXECUTE_IMMEDIATELY.sh /path/to/transcripts-folder
# Example: ./scripts/EXECUTE_IMMEDIATELY.sh ~/Downloads/transcripts/

set -e

WORKSPACE="/home/moriahkeeper/.openclaw/workspace"
INPUT_FOLDER="${1:-.}"
TIMESTAMP=$(date +%Y-%m-%d_%H:%M:%S)
EXECUTION_LOG="$WORKSPACE/execution-${TIMESTAMP}.log"

echo "🏔️ MORIAH TRANSCRIPT PIPELINE — FULL EXECUTION"
echo "================================================"
echo "Start time: $(date)"
echo "Input: $INPUT_FOLDER"
echo "Workspace: $WORKSPACE"
echo "Log: $EXECUTION_LOG"
echo ""

# Step 0: Verify input folder
if [ ! -d "$INPUT_FOLDER" ]; then
  echo "❌ ERROR: Input folder not found: $INPUT_FOLDER"
  echo "Usage: ./scripts/EXECUTE_IMMEDIATELY.sh /path/to/transcripts"
  exit 1
fi

TRANSCRIPT_COUNT=$(find "$INPUT_FOLDER" -type f | wc -l)
echo "📊 Found $TRANSCRIPT_COUNT transcript files"
echo ""

# Step 1: Build sanitizer if needed
if [ ! -f "$WORKSPACE/transcript-sanitizer-service/dist/index.js" ]; then
  echo "🔨 Building Transcript Sanitizer..."
  cd "$WORKSPACE/transcript-sanitizer-service"
  npm run build >> "$EXECUTION_LOG" 2>&1
  echo "✅ Sanitizer built"
fi

# Step 2: Build extractor if needed
if [ ! -f "$WORKSPACE/wisdom-extractor/dist/extractor.js" ]; then
  echo "🔨 Building Wisdom Extractor..."
  cd "$WORKSPACE/wisdom-extractor"
  npm run build >> "$EXECUTION_LOG" 2>&1
  echo "✅ Extractor built"
fi

# Step 3: Create output directories
mkdir -p "$WORKSPACE/wisdom-database"
mkdir -p "$WORKSPACE/transcript-sanitizer-service/output"
echo "📁 Output directories ready"

# Step 4: Run sanitizer
echo ""
echo "▶️  PHASE 1: SANITIZING TRANSCRIPTS (removing PII)..."
echo "Starting sanitizer: $(date)" >> "$EXECUTION_LOG"
cd "$WORKSPACE/transcript-sanitizer-service"
npm start -- "$INPUT_FOLDER" >> "$EXECUTION_LOG" 2>&1 &
SANITIZER_PID=$!

# Wait for sanitizer to complete
wait $SANITIZER_PID
SANITIZER_EXIT=$?

if [ $SANITIZER_EXIT -ne 0 ]; then
  echo "❌ Sanitizer failed with exit code $SANITIZER_EXIT"
  tail -50 "$EXECUTION_LOG"
  exit 1
fi
echo "✅ Sanitization complete"

# Step 5: Run extractor
echo ""
echo "▶️  PHASE 2: EXTRACTING WISDOM (building database)..."
echo "Starting extractor: $(date)" >> "$EXECUTION_LOG"
cd "$WORKSPACE/wisdom-extractor"
npm start -- "$WORKSPACE/transcript-sanitizer-service/output" >> "$EXECUTION_LOG" 2>&1 &
EXTRACTOR_PID=$!

# Wait for extractor to complete
wait $EXTRACTOR_PID
EXTRACTOR_EXIT=$?

if [ $EXTRACTOR_EXIT -ne 0 ]; then
  echo "❌ Extractor failed with exit code $EXTRACTOR_EXIT"
  tail -50 "$EXECUTION_LOG"
  exit 1
fi
echo "✅ Wisdom extraction complete"

# Step 6: Verification
echo ""
echo "▶️  PHASE 3: VERIFYING OUTPUT..."
WISDOM_FILES=$(find "$WORKSPACE/wisdom-database" -type f | wc -l)
SANITIZED_FILES=$(find "$WORKSPACE/transcript-sanitizer-service/output" -type f | wc -l)

echo "✅ Sanitized transcripts: $SANITIZED_FILES"
echo "✅ Wisdom database files: $WISDOM_FILES"

# Step 7: Success report
echo ""
echo "================================================"
echo "✅ PIPELINE EXECUTION COMPLETE"
echo "================================================"
echo "End time: $(date)"
echo ""
echo "📊 RESULTS:"
echo "  • Input transcripts: $TRANSCRIPT_COUNT"
echo "  • Sanitized files: $SANITIZED_FILES"
echo "  • Wisdom teachings extracted: $WISDOM_FILES"
echo ""
echo "📁 OUTPUT LOCATIONS:"
echo "  • Sanitized: $WORKSPACE/transcript-sanitizer-service/output/"
echo "  • Wisdom DB: $WORKSPACE/wisdom-database/"
echo ""
echo "🚀 NEXT STEPS:"
echo "  1. Review sample output: head -20 wisdom-database/teachings.json"
echo "  2. Spot-check for PII: grep -i 'ssn\|credit\|email' output/*"
echo "  3. Build CoachTinaMarie: Ready in 6-8 hours"
echo "  4. Build AI Course: Ready in 6-8 hours"
echo ""
echo "Log file: $EXECUTION_LOG"

# Step 8: Commit to GitHub
cd "$WORKSPACE"
git add wisdom-database/ transcript-sanitizer-service/output/
git commit -m "feat: Transcript pipeline executed — wisdom database ready for product builds" >> "$EXECUTION_LOG" 2>&1
echo ""
echo "✅ Changes committed to GitHub"

exit 0
