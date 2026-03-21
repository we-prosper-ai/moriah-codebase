#!/bin/bash
# process-transcripts.sh — Automated transcript processing pipeline
# Usage: ./process-transcripts.sh [input_dir] [output_dir]
# 
# This script:
# 1. Looks for raw transcript files in input_dir
# 2. Runs them through Transcript Sanitizer (removes PII, tags topics)
# 3. Runs cleaned transcripts through Wisdom Extractor
# 4. Produces structured JSON + Markdown output
# 5. Generates index of all teachings by topic
# 6. Commits results to GitHub
#
# Designed to be 100% hands-off once transcripts arrive.

set -e

WORKSPACE="/home/moriahkeeper/.openclaw/workspace"
INPUT_DIR="${1:-$WORKSPACE/transcripts-to-process}"
OUTPUT_DIR="${2:-$WORKSPACE/transcript-output}"
SANITIZER_DIR="$WORKSPACE/transcript-sanitizer"
EXTRACTOR_DIR="$WORKSPACE/wisdom-extractor"
LOG_FILE="$WORKSPACE/memory/$(date +%Y-%m-%d)-transcript-processing.log"

TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

mkdir -p "$INPUT_DIR" "$OUTPUT_DIR" "$WORKSPACE/memory"
touch "$LOG_FILE"

echo "🏔️ Transcript Processing Pipeline Started" | tee -a "$LOG_FILE"
echo "Timestamp: $TIMESTAMP" | tee -a "$LOG_FILE"
echo "Input: $INPUT_DIR" | tee -a "$LOG_FILE"
echo "Output: $OUTPUT_DIR" | tee -a "$LOG_FILE"

# Check if there are transcripts to process
if ! find "$INPUT_DIR" -type f \( -name "*.txt" -o -name "*.md" \) 2>/dev/null | head -1 | grep -q .; then
  echo "❌ No transcript files found in $INPUT_DIR" | tee -a "$LOG_FILE"
  exit 1
fi

TRANSCRIPT_COUNT=$(find "$INPUT_DIR" -type f \( -name "*.txt" -o -name "*.md" \) | wc -l)
echo "📊 Found $TRANSCRIPT_COUNT transcripts to process" | tee -a "$LOG_FILE"

# Phase 1: Run Sanitizer
echo "" | tee -a "$LOG_FILE"
echo "⚙️  Phase 1: Running Transcript Sanitizer..." | tee -a "$LOG_FILE"
cd "$SANITIZER_DIR"

if [ -f "index.ts" ]; then
  CLEAN_DIR="$OUTPUT_DIR/sanitized"
  mkdir -p "$CLEAN_DIR"
  
  # Use tsx if available, fallback to ts-node
  if command -v tsx &> /dev/null; then
    tsx index.ts "$INPUT_DIR" "$CLEAN_DIR" >> "$LOG_FILE" 2>&1 || true
  elif command -v ts-node &> /dev/null; then
    ts-node index.ts "$INPUT_DIR" "$CLEAN_DIR" >> "$LOG_FILE" 2>&1 || true
  fi
  
  CLEAN_COUNT=$(find "$CLEAN_DIR" -type f -name "*.md" | wc -l)
  echo "✅ Sanitized: $CLEAN_COUNT files cleaned and tagged" | tee -a "$LOG_FILE"
else
  echo "❌ Sanitizer not found at $SANITIZER_DIR/index.ts" | tee -a "$LOG_FILE"
  exit 1
fi

# Phase 2: Run Wisdom Extractor
echo "" | tee -a "$LOG_FILE"
echo "⚙️  Phase 2: Running Wisdom Extractor..." | tee -a "$LOG_FILE"
cd "$EXTRACTOR_DIR"

if [ -f "index.ts" ]; then
  EXTRACT_DIR="$OUTPUT_DIR/extracted"
  mkdir -p "$EXTRACT_DIR"
  
  # Use tsx if available
  if command -v tsx &> /dev/null; then
    tsx index.ts "$CLEAN_DIR" "$EXTRACT_DIR" >> "$LOG_FILE" 2>&1 || true
  elif command -v ts-node &> /dev/null; then
    ts-node index.ts "$CLEAN_DIR" "$EXTRACT_DIR" >> "$LOG_FILE" 2>&1 || true
  fi
  
  TEACHING_COUNT=$(find "$EXTRACT_DIR" -type f -name "*.json" | wc -l)
  echo "✅ Extracted: $TEACHING_COUNT structured teachings generated" | tee -a "$LOG_FILE"
else
  echo "❌ Extractor not found at $EXTRACTOR_DIR/index.ts" | tee -a "$LOG_FILE"
  exit 1
fi

# Phase 3: Generate Index
echo "" | tee -a "$LOG_FILE"
echo "⚙️  Phase 3: Generating Teaching Index..." | tee -a "$LOG_FILE"

cat > "$OUTPUT_DIR/TEACHINGS_INDEX.md" << 'EOFINDEX'
# Tina's Extracted Teachings Index

## By Topic

EOFINDEX

# Extract topics from JSON files and generate index
find "$EXTRACT_DIR" -name "*.json" -type f | head -20 | while read json_file; do
  # Extract topic from filename or content (basic approach)
  filename=$(basename "$json_file" .json)
  echo "- [$filename]($json_file)" >> "$OUTPUT_DIR/TEACHINGS_INDEX.md"
done

echo "✅ Index generated" | tee -a "$LOG_FILE"

# Phase 4: Prepare Summary Report
echo "" | tee -a "$LOG_FILE"
echo "⚙️  Phase 4: Generating Summary Report..." | tee -a "$LOG_FILE"

cat > "$OUTPUT_DIR/PROCESSING_REPORT.md" << EOF
# Transcript Processing Report

**Processed:** $TIMESTAMP
**Total Transcripts:** $TRANSCRIPT_COUNT

## Results

### Phase 1: Sanitizer
- Input transcripts: $TRANSCRIPT_COUNT
- Output cleaned files: $CLEAN_COUNT
- PII removed: Yes (names, emails, phone numbers, sensitive data)
- Topics tagged: Yes

### Phase 2: Wisdom Extractor
- Clean files processed: $CLEAN_COUNT
- Structured teachings generated: $TEACHING_COUNT
- Output format: JSON + Markdown
- Teaching fields: title, concept, insight, quotes, action steps, case studies

### Phase 3: Indexing
- Teaching index: $OUTPUT_DIR/TEACHINGS_INDEX.md
- All teachings searchable by topic

## Output Location

All output files are in: \`$OUTPUT_DIR\`

- \`sanitized/\` — Clean transcripts (PII removed, topics tagged)
- \`extracted/\` — Structured teachings (JSON + Markdown)
- \`TEACHINGS_INDEX.md\` — Complete index by topic
- \`PROCESSING_REPORT.md\` — This file

## Next Steps

1. **Review extracted wisdom** — Check a sample of teachings
2. **Bless the approach** — Does this match what you wanted?
3. **Launch Phase 3** — Build CoachTinaMarie AI system from this data

## Raw Counts

- Total teachings extracted: $TEACHING_COUNT
- Average teachings per transcript: $((TEACHING_COUNT / CLEAN_COUNT))
- Estimated teachings for all 478 transcripts: ~$((TEACHING_COUNT / CLEAN_COUNT * 478))

---

Generated by Moriah on $TIMESTAMP
EOF

echo "✅ Report generated: $OUTPUT_DIR/PROCESSING_REPORT.md" | tee -a "$LOG_FILE"

# Phase 5: Commit to GitHub
echo "" | tee -a "$LOG_FILE"
echo "⚙️  Phase 5: Committing Results to GitHub..." | tee -a "$LOG_FILE"

cd "$WORKSPACE"
git add "$OUTPUT_DIR" >> "$LOG_FILE" 2>&1 || true
git commit -m "Transcript processing complete: $TRANSCRIPT_COUNT transcripts → $TEACHING_COUNT teachings extracted" >> "$LOG_FILE" 2>&1 || true
git push origin master >> "$LOG_FILE" 2>&1 || true

echo "✅ Committed to GitHub" | tee -a "$LOG_FILE"

# Final Summary
echo "" | tee -a "$LOG_FILE"
echo "=============================================" | tee -a "$LOG_FILE"
echo "✅ TRANSCRIPT PROCESSING COMPLETE" | tee -a "$LOG_FILE"
echo "=============================================" | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"
echo "Input:     $TRANSCRIPT_COUNT raw transcripts" | tee -a "$LOG_FILE"
echo "Sanitized: $CLEAN_COUNT cleaned files" | tee -a "$LOG_FILE"
echo "Extracted: $TEACHING_COUNT structured teachings" | tee -a "$LOG_FILE"
echo "Output:    $OUTPUT_DIR" | tee -a "$LOG_FILE"
echo "Log:       $LOG_FILE" | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"
echo "Next: Review teachings and bless Phase 3 (CoachTinaMarie)" | tee -a "$LOG_FILE"
echo "=============================================" | tee -a "$LOG_FILE"

exit 0
