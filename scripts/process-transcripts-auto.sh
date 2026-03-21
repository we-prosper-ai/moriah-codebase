#!/bin/bash
# Transcript Pipeline — One-Command Processing
# Usage: ./process-transcripts-auto.sh <input_dir> <output_dir>

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
INPUT_DIR=${1:-"./transcripts"}
OUTPUT_DIR=${2:-"./output"}
SANITIZER_URL="http://localhost:5001"
EXTRACTOR_URL="http://localhost:5002"

echo -e "${BLUE}🚀 Transcript Pipeline — Auto-Processing${NC}"
echo -e "${BLUE}════════════════════════════════════${NC}"

# Validation
if [ ! -d "$INPUT_DIR" ]; then
    echo -e "${RED}❌ Error: Input directory not found: $INPUT_DIR${NC}"
    exit 1
fi

TRANSCRIPT_COUNT=$(find "$INPUT_DIR" -type f \( -name "*.md" -o -name "*.txt" \) | wc -l)
if [ "$TRANSCRIPT_COUNT" -eq 0 ]; then
    echo -e "${RED}❌ Error: No transcript files found in $INPUT_DIR${NC}"
    exit 1
fi

echo -e "${YELLOW}Input directory: $INPUT_DIR${NC}"
echo -e "${YELLOW}Output directory: $OUTPUT_DIR${NC}"
echo -e "${YELLOW}Transcripts found: $TRANSCRIPT_COUNT${NC}"
echo ""

# Step 1: Verify services
echo -e "${BLUE}Step 1: Verifying transcript services...${NC}"
if ! curl -s "$SANITIZER_URL/health" > /dev/null 2>&1; then
    echo -e "${RED}❌ Transcript Sanitizer not running on $SANITIZER_URL${NC}"
    echo "Start it with: npm run start (in transcript-sanitizer-service/)"
    exit 1
fi
echo -e "${GREEN}✅ Sanitizer running${NC}"

if ! curl -s "$EXTRACTOR_URL/health" > /dev/null 2>&1; then
    echo -e "${RED}❌ Wisdom Extractor not running on $EXTRACTOR_URL${NC}"
    echo "Start it with: npm run start (in wisdom-extractor/)"
    exit 1
fi
echo -e "${GREEN}✅ Extractor running${NC}"
echo ""

# Step 2: Create output directory
echo -e "${BLUE}Step 2: Preparing output directory...${NC}"
mkdir -p "$OUTPUT_DIR/sanitized"
mkdir -p "$OUTPUT_DIR/teachings"
echo -e "${GREEN}✅ Output directory ready${NC}"
echo ""

# Step 3: Start processing
echo -e "${BLUE}Step 3: Processing transcripts...${NC}"
echo "  Total: $TRANSCRIPT_COUNT files"
echo "  Speed: ~500ms per file"
echo "  Estimated time: $((TRANSCRIPT_COUNT * 500 / 60000)) minutes"
echo ""

# Run orchestrator
cd transcript-pipeline-orchestrator
npm run process-transcripts -- \
  --input "$INPUT_DIR" \
  --output "$OUTPUT_DIR" \
  --sanitizer "$SANITIZER_URL" \
  --extractor "$EXTRACTOR_URL" \
  --pause 500

echo ""
echo -e "${GREEN}✅ Processing complete!${NC}"
echo ""

# Step 4: Verify output
echo -e "${BLUE}Step 4: Verifying output...${NC}"
SANITIZED_COUNT=$(find "$OUTPUT_DIR/sanitized" -type f | wc -l)
echo -e "${GREEN}✅ Sanitized files: $SANITIZED_COUNT${NC}"

if [ -f "$OUTPUT_DIR/teachings.json" ]; then
    TEACHING_COUNT=$(grep -o '"title"' "$OUTPUT_DIR/teachings.json" | wc -l)
    echo -e "${GREEN}✅ Teachings extracted: $TEACHING_COUNT${NC}"
fi

if [ -f "$OUTPUT_DIR/teachings.md" ]; then
    echo -e "${GREEN}✅ Teaching summary generated${NC}"
fi

echo ""

# Step 5: Summary
echo -e "${BLUE}Output Summary:${NC}"
echo "  Sanitized transcripts: $OUTPUT_DIR/sanitized/"
echo "  Teachings JSON: $OUTPUT_DIR/teachings.json"
echo "  Teachings Markdown: $OUTPUT_DIR/teachings.md"
echo "  Audit log: $OUTPUT_DIR/pipeline-audit-*.json"
echo ""

echo -e "${BLUE}Next steps:${NC}"
echo "  1. Review teachings.md to verify quality"
echo "  2. Feed teachings.json to CoachTinaMarie"
echo "  3. Generate AI Entrepreneur Course content"
echo "  4. Launch products"
echo ""

echo -e "${GREEN}🎉 Transcripts successfully processed!${NC}"
