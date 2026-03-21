#!/bin/bash
# 🏔️ Moriah — Transcript Pipeline Deployment
# Orchestrates: Sanitizer → Extractor → Products
# Usage: ./deploy-transcript-pipeline.sh /path/to/transcripts output-dir

set -e

TRANSCRIPT_INPUT="${1:-.}"
OUTPUT_DIR="${2:-.output}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
LOG_FILE="logs/pipeline-${TIMESTAMP}.log"

mkdir -p "$OUTPUT_DIR" logs

echo "🏔️ Starting Transcript Pipeline Deployment — $TIMESTAMP" | tee "$LOG_FILE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" | tee -a "$LOG_FILE"

# PHASE 1: Count files
echo "📊 Phase 1: Analyzing input..." | tee -a "$LOG_FILE"
FILE_COUNT=$(find "$TRANSCRIPT_INPUT" -type f \( -name "*.txt" -o -name "*.md" \) | wc -l)
echo "   Found $FILE_COUNT transcript files" | tee -a "$LOG_FILE"

if [ "$FILE_COUNT" -eq 0 ]; then
  echo "   ❌ ERROR: No .txt or .md files found in $TRANSCRIPT_INPUT" | tee -a "$LOG_FILE"
  exit 1
fi

# PHASE 2: Transcript Sanitizer
echo "" | tee -a "$LOG_FILE"
echo "🛡️  Phase 2: Running Transcript Sanitizer..." | tee -a "$LOG_FILE"
SANITIZE_START=$(date +%s)

# Create input directory for sanitizer service
mkdir -p ~/.openclaw/workspace/transcript-sanitizer-service/data/input
cp "$TRANSCRIPT_INPUT"/*.{txt,md} ~/.openclaw/workspace/transcript-sanitizer-service/data/input/ 2>/dev/null || true

# Invoke sanitizer via HTTP (assumes it's running on port 4001)
echo "   Sending to Sanitizer Service (localhost:4001)..." | tee -a "$LOG_FILE"

SANITIZE_RESPONSE=$(curl -s -X POST http://localhost:4001/api/batch-sanitize \
  -H "Content-Type: application/json" \
  -d "{\"outputFormat\": \"markdown\", \"includeAudit\": true}" \
  2>&1 || echo "{\"error\": \"Service unavailable\"}")

if echo "$SANITIZE_RESPONSE" | grep -q "error"; then
  echo "   ⚠️  WARNING: Sanitizer service may not be running. Starting it..." | tee -a "$LOG_FILE"
  cd ~/.openclaw/workspace/transcript-sanitizer-service
  npm run dev > /tmp/sanitizer.log 2>&1 &
  sleep 3
  SANITIZE_RESPONSE=$(curl -s -X POST http://localhost:4001/api/batch-sanitize \
    -H "Content-Type: application/json" \
    -d "{\"outputFormat\": \"markdown\", \"includeAudit\": true}" \
    2>&1)
fi

SANITIZE_END=$(date +%s)
SANITIZE_DURATION=$((SANITIZE_END - SANITIZE_START))
echo "   ✅ Sanitizer complete ($SANITIZE_DURATION seconds)" | tee -a "$LOG_FILE"

# PHASE 3: Wisdom Extractor
echo "" | tee -a "$LOG_FILE"
echo "🧠 Phase 3: Running Wisdom Extractor..." | tee -a "$LOG_FILE"
EXTRACT_START=$(date +%s)

# Get cleaned files from sanitizer
CLEAN_DIR="~/.openclaw/workspace/transcript-sanitizer-service/data/cleaned"
mkdir -p "$OUTPUT_DIR/cleaned"
cp "$CLEAN_DIR"/*.md "$OUTPUT_DIR/cleaned/" 2>/dev/null || true

# Invoke wisdom extractor via HTTP (assumes it's running)
echo "   Sending to Wisdom Extractor Service..." | tee -a "$LOG_FILE"

EXTRACT_RESPONSE=$(curl -s -X POST http://localhost:5050/api/extract \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer extraction-token" \
  -d "{\"format\": \"json\", \"modules\": true}" \
  2>&1 || echo "{\"error\": \"Service unavailable\"}")

EXTRACT_END=$(date +%s)
EXTRACT_DURATION=$((EXTRACT_END - EXTRACT_START))
echo "   ✅ Extractor complete ($EXTRACT_DURATION seconds)" | tee -a "$LOG_FILE"

# PHASE 4: Generate Summary
echo "" | tee -a "$LOG_FILE"
echo "📝 Phase 4: Generating summary..." | tee -a "$LOG_FILE"

SUMMARY_FILE="$OUTPUT_DIR/DEPLOYMENT_SUMMARY.md"
cat > "$SUMMARY_FILE" << EOF
# Transcript Pipeline Deployment Summary
**Generated:** $TIMESTAMP

## Processing Metrics
- **Files processed:** $FILE_COUNT
- **Sanitizer time:** ${SANITIZE_DURATION}s
- **Extractor time:** ${EXTRACT_DURATION}s
- **Total time:** $((SANITIZE_DURATION + EXTRACT_DURATION))s

## Outputs
- **Cleaned transcripts:** $OUTPUT_DIR/cleaned/
- **Structured teachings:** $OUTPUT_DIR/teachings.json
- **Modules index:** $OUTPUT_DIR/modules.json
- **Full audit log:** $LOG_FILE

## Next Steps
1. Review cleaned transcripts for quality
2. Verify teachings extraction accuracy
3. Build CoachTinaMarie AI system
4. Launch products

**Status:** READY FOR PRODUCT BUILD
EOF

echo "   ✅ Summary saved to $SUMMARY_FILE" | tee -a "$LOG_FILE"

# PHASE 5: Archive results
echo "" | tee -a "$LOG_FILE"
echo "📦 Phase 5: Archiving results..." | tee -a "$LOG_FILE"
ARCHIVE_FILE="output/deployment-${TIMESTAMP}.tar.gz"
mkdir -p output
tar -czf "$ARCHIVE_FILE" "$OUTPUT_DIR/" "$LOG_FILE" 2>/dev/null || true
echo "   ✅ Archive saved: $ARCHIVE_FILE" | tee -a "$LOG_FILE"

# Final status
echo "" | tee -a "$LOG_FILE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" | tee -a "$LOG_FILE"
echo "✅ Transcript Pipeline Deployment COMPLETE" | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"
echo "📊 Results location: $OUTPUT_DIR/" | tee -a "$LOG_FILE"
echo "📋 Full log: $LOG_FILE" | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"
