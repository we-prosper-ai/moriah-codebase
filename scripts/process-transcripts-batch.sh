#!/bin/bash
# Transcript Processing Pipeline — Batch Mode
# Usage: ./process-transcripts-batch.sh /path/to/transcripts/folder

set -e

INPUT_DIR="$1"
SANITIZER_URL="http://localhost:4001"
EXTRACTOR_URL="http://localhost:5001"  # Wisdom Extractor (once live)
OUTPUT_DIR="/home/moriahkeeper/.openclaw/workspace/transcripts-processed"

# Validate input
if [ -z "$INPUT_DIR" ]; then
  echo "❌ Usage: $0 /path/to/transcripts"
  exit 1
fi

if [ ! -d "$INPUT_DIR" ]; then
  echo "❌ Directory not found: $INPUT_DIR"
  exit 1
fi

# Count files
FILE_COUNT=$(find "$INPUT_DIR" -type f \( -name "*.txt" -o -name "*.md" -o -name "*.pdf" \) | wc -l)
echo "🔄 Processing $FILE_COUNT transcripts..."
echo ""

# Create output directory
mkdir -p "$OUTPUT_DIR/clean"
mkdir -p "$OUTPUT_DIR/wisdom"
mkdir -p "$OUTPUT_DIR/logs"

# Start timer
START_TIME=$(date +%s)

# Process each file
PROCESSED=0
FAILED=0

for file in "$INPUT_DIR"/*; do
  if [ ! -f "$file" ]; then
    continue
  fi

  filename=$(basename "$file")
  echo "📄 Processing: $filename"

  # Step 1: Send to Sanitizer
  echo "  → Sanitizing..."
  RESPONSE=$(curl -s -X POST "$SANITIZER_URL/sanitize" \
    -H "Content-Type: application/octet-stream" \
    --data-binary "@$file")

  if [ $? -ne 0 ]; then
    echo "    ❌ Sanitizer failed for $filename"
    FAILED=$((FAILED + 1))
    continue
  fi

  # Extract file ID and clean content
  FILE_ID=$(echo "$RESPONSE" | jq -r '.file_id // empty')
  CLEAN_CONTENT=$(echo "$RESPONSE" | jq -r '.clean_markdown // empty')

  if [ -z "$FILE_ID" ]; then
    echo "    ❌ No file_id returned for $filename"
    FAILED=$((FAILED + 1))
    continue
  fi

  # Save clean transcript
  echo "$CLEAN_CONTENT" > "$OUTPUT_DIR/clean/${filename}.clean.md"
  echo "    ✓ Cleaned (ID: $FILE_ID)"

  # Step 2: Extract wisdom
  echo "  → Extracting wisdom..."
  WISDOM=$(curl -s -X POST "$EXTRACTOR_URL/extract" \
    -H "Content-Type: application/json" \
    -d "{\"file_id\":\"$FILE_ID\",\"content\":\"$CLEAN_CONTENT\"}" | jq -r '.teachings // empty')

  if [ -z "$WISDOM" ]; then
    echo "    ⚠️  No teachings extracted (may still be valid)"
  else
    # Count teachings
    TEACHING_COUNT=$(echo "$WISDOM" | jq 'length')
    echo "$WISDOM" > "$OUTPUT_DIR/wisdom/${filename}.teachings.json"
    echo "    ✓ Extracted $TEACHING_COUNT teachings"
  fi

  PROCESSED=$((PROCESSED + 1))
  echo ""
done

# Calculate time
END_TIME=$(date +%s)
ELAPSED=$((END_TIME - START_TIME))
MINUTES=$((ELAPSED / 60))
SECONDS=$((ELAPSED % 60))

# Summary
echo "✅ BATCH PROCESSING COMPLETE"
echo ""
echo "📊 Results:"
echo "  Processed: $PROCESSED"
echo "  Failed: $FAILED"
echo "  Time: ${MINUTES}m ${SECONDS}s"
echo ""

# Next steps
echo "📁 Output locations:"
echo "  Clean transcripts: $OUTPUT_DIR/clean/"
echo "  Extracted wisdom: $OUTPUT_DIR/wisdom/"
echo "  Audit logs: $OUTPUT_DIR/logs/"
echo ""

# Show statistics
TOTAL_TEACHINGS=$(find "$OUTPUT_DIR/wisdom" -name "*.json" -exec jq 'length' {} + | awk '{s+=$1} END {print s}')
echo "📚 Total teachings extracted: $TOTAL_TEACHINGS"
echo ""

echo "🎯 Next step: Feed wisdom to CoachTinaMarie"
echo "   curl -X POST http://localhost:3333/teachings/sync \\"
echo "     -H 'Content-Type: application/json' \\"
echo "     -d @$OUTPUT_DIR/wisdom/teachings.json"
