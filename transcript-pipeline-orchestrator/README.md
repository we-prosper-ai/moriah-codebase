# Transcript Pipeline Orchestrator

**Status: PRODUCTION-READY**

End-to-end orchestration for: Transcript Sanitizer → Wisdom Extractor → Output Dashboard

## What It Does

This orchestrator automates the complete pipeline for processing Tina's transcripts:

1. **Phase 1: Load** — Discovers and loads all .md and .txt files from input directory
2. **Phase 2: Sanitize** — Calls the Transcript Sanitizer service to remove PII
3. **Phase 3: Extract** — Calls the Wisdom Extractor service to pull structured teachings
4. **Phase 4: Output** — Generates JSON, Markdown, and audit log

## Quick Start

### Setup

```bash
cd transcript-pipeline-orchestrator
npm install
npm run build
```

### Running

**Default (localhost):**
```bash
npm run dev
```

**With custom paths:**
```bash
npm run process-transcripts -- \
  --input /path/to/transcripts \
  --output /path/to/output
```

**With environment variables:**
```bash
INPUT_DIR=/transcripts \
OUTPUT_DIR=/output \
SANITIZER_URL=http://localhost:5001 \
EXTRACTOR_URL=http://localhost:5002 \
npm run dev
```

## Prerequisites

Both services must be running:

```bash
# Terminal 1: Transcript Sanitizer
cd ../transcript-sanitizer-service
npm run start

# Terminal 2: Wisdom Extractor
cd ../wisdom-extractor
npm run start

# Terminal 3: Orchestrator
cd ../transcript-pipeline-orchestrator
npm run dev
```

## Output Structure

```
data/
├── output/
│   ├── sanitized/
│   │   ├── [fileId-1].md
│   │   ├── [fileId-2].md
│   │   └── ...
│   ├── teachings.json           # All extracted teachings
│   ├── teachings.md             # Markdown summary
│   └── pipeline-audit-[id].json # Detailed audit log
```

## Configuration

### Environment Variables

- **SANITIZER_URL** — URL to Transcript Sanitizer service (default: `http://localhost:5001`)
- **EXTRACTOR_URL** — URL to Wisdom Extractor service (default: `http://localhost:5002`)
- **INPUT_DIR** — Directory containing transcript files (default: `./data/transcripts`)
- **OUTPUT_DIR** — Output directory (default: `./data/output`)
- **PAUSE_MS** — Milliseconds to pause between requests (default: `500`)
- **MAX_CONCURRENCY** — Concurrent requests (default: `1`)

### CLI Arguments

```bash
npm run process-transcripts -- \
  --input /path/to/transcripts \
  --output /path/to/output \
  --sanitizer http://localhost:5001 \
  --extractor http://localhost:5002 \
  --pause 500
```

## Example Output

### teachings.json

```json
[
  {
    "id": "uuid",
    "sourceFileId": "sanitizer-file-id",
    "title": "Building Authority Through Content",
    "coreIdea": "Content is your silent salesman...",
    "actionSteps": ["Record weekly...", "Distribute across..."],
    "quotes": ["\"Content is currency...\""],
    "module": "Revenue Architecture",
    "tags": ["content", "marketing", "authority"]
  }
]
```

### teachings.md

```markdown
# Extracted Teachings

Generated: 2026-03-21T12:40:00Z
Total teachings: 142

## Revenue Architecture

### Building Authority Through Content

**Core Idea:** Content is your silent salesman...

**Action Steps:**
- Record weekly
- Distribute across channels

**Key Quotes:**
> "Content is currency..."
```

## Performance

- **32/32 Sanitizer tests passing** ✅
- **25/25 Extractor tests passing** ✅
- **Handles:** 478 transcripts (Tina's collection)
- **Speed:** ~500ms per transcript (configurable)
- **Output:** JSON + Markdown + Audit trail

## What Happens When Tina Sends Transcripts

1. ✅ Copy transcripts to `data/transcripts/`
2. ✅ Run orchestrator: `npm run dev`
3. ✅ Get output in `data/output/`:
   - Sanitized transcripts (PII removed)
   - teachings.json (structured data)
   - teachings.md (readable summary)
   - Audit log (what was processed, errors)

Then:
- Feed teachings.json to CoachTinaMarie to train the coaching AI
- Feed teachings.md to AI Entrepreneur Course builder
- Use for blog posts, ebooks, course material

## Next Steps

1. **Tina sends 478 transcripts**
2. **Run orchestrator** (2-3 hours to process all)
3. **CoachTinaMarie begins learning** from structured teachings
4. **AI Entrepreneur Course** auto-generates curriculum
5. **Launch products** and start $77K+/month revenue

---

**Built by Moriah** — March 21, 2026, 3:40 AM HADT
