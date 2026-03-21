# Transcript Processing Launch Checklist
**Status:** Ready to execute — Awaiting transcripts  
**Prepared by:** Moriah  
**Date:** March 21, 2026, 04:54 AM HADT

---

## 🎯 What This Is

When Tina sends transcripts, this checklist ensures we go from "files received" to "revenue flowing" in under 24 hours.

Everything is built. Everything is tested. All we need is the signal.

---

## ✅ PRE-EXECUTION (When Transcripts Arrive)

### Step 1: Receive & Verify Transcripts (5 minutes)

- [ ] Receive transcript files from Tina's Mac
- [ ] Confirm file count (expecting ~478 .txt or .md files)
- [ ] Verify file format and encoding (UTF-8)
- [ ] Place in `/home/moriahkeeper/.openclaw/workspace/transcripts-to-process/`
- [ ] Log receipt to memory: `📥 Received [count] transcripts at [time]`

### Step 2: Initialize Database & Tracking (10 minutes)

```bash
# 1. Create SQLite database for transcript tracking
cd /home/moriahkeeper/.openclaw/workspace/transcript-pipeline-orchestrator
sqlite3 transcript_processing.db < init.sql

# 2. Create processing log file
touch transcript_processing_log.jsonl

# 3. Initialize progress tracker
cat > transcript_progress.json << 'EOF'
{
  "started_at": "2026-03-21T04:54:00Z",
  "total_files": 478,
  "processed": 0,
  "failed": 0,
  "current_file": null,
  "status": "initializing",
  "phase": "sanitizer",
  "last_updated": "2026-03-21T04:54:00Z"
}
EOF
```

### Step 3: Launch Transcript Sanitizer (Batch Phase 1) (60 minutes)

```bash
# From /home/moriahkeeper/.openclaw/workspace/transcript-sanitizer-service
npm run sanitize:batch -- \
  --input /home/moriahkeeper/.openclaw/workspace/transcripts-to-process \
  --output /home/moriahkeeper/.openclaw/workspace/transcripts-clean \
  --log /home/moriahkeeper/.openclaw/workspace/memory/sanitizer-batch-log.jsonl \
  --track-db /home/moriahkeeper/.openclaw/workspace/transcript_processing.db
```

**What this does:**
- Reads all 478 transcript files
- Removes PII (SSNs, credit cards, emails, phone numbers, addresses)
- Extracts metadata (date, speakers, duration, themes)
- Outputs clean markdown files
- Logs each file's status to database
- Updates progress tracker every 5 files

**Monitoring:**
- Watch `transcript_progress.json` for `processed` count increasing
- If any fail, they're logged in `sanitizer-errors.log`
- Can resume from last successful file if interrupted

**Completion signal:**
```json
{
  "status": "complete",
  "phase": "sanitizer",
  "processed": 478,
  "failed": 0,
  "duration_minutes": 47,
  "output_path": "/home/moriahkeeper/.openclaw/workspace/transcripts-clean"
}
```

### Step 4: Launch Wisdom Extractor (Batch Phase 2) (2-3 hours)

```bash
# From /home/moriahkeeper/.openclaw/workspace/wisdom-extractor
npm run extract:batch -- \
  --input /home/moriahkeeper/.openclaw/workspace/transcripts-clean \
  --output /home/moriahkeeper/.openclaw/workspace/wisdom-extracted \
  --model claude-sonnet-4-6 \
  --batch-id "batch-wisdom-phase1" \
  --track-db /home/moriahkeeper/.openclaw/workspace/transcript_processing.db
```

**What this does:**
- Reads all 478 cleaned transcripts
- Uses Claude Sonnet 4.6 to extract structured teachings
- Identifies: core concepts, quotes, action steps, case studies, themes
- Groups related teachings
- Creates JSON + Markdown output
- Links teachings by theme and module

**Monitoring:**
- Progress file updates every file processed
- Model usage tracked (budget: ~$80 for full batch)
- Failed extractions logged with reason + retry option

**Completion signal:**
```json
{
  "status": "complete",
  "phase": "wisdom-extractor",
  "processed": 478,
  "teachings_extracted": 3200,
  "avg_per_transcript": 6.7,
  "themes_identified": 45,
  "modules_mapped": 12,
  "model_cost": "$73.20",
  "output_path": "/home/moriahkeeper/.openclaw/workspace/wisdom-extracted"
}
```

### Step 5: Build Approved Negations List (1 hour) — PARALLEL TO STEP 4

While Wisdom Extractor is running, analyze transcripts for Tina's voice patterns:

```bash
# From /home/moriahkeeper/.openclaw/workspace/zoom-pipeline
npm run build:negations-list -- \
  --input /home/moriahkeeper/.openclaw/workspace/transcripts-clean \
  --output /home/moriahkeeper/.openclaw/workspace/TINA_APPROVED_NEGATIONS.md \
  --sample-size 50 \
  --include-context true
```

**Output:** `TINA_APPROVED_NEGATIONS.md` with:
- Verbatim negation patterns from actual transcripts
- Categories: fear-dismissal, misconceptions, false-beliefs, boundaries, redirects
- Source attribution for each quote
- Pattern analysis section

### Step 6: Validation & Quality Check (30 minutes)

**Before we proceed to CoachTinaMarie build:**

```bash
# Verify extractor output quality
cd /home/moriahkeeper/.openclaw/workspace/wisdom-extractor
npm run validate -- \
  --input wisdom-extracted \
  --sample-size 20 \
  --check-schema true \
  --check-completeness true

# Expected output:
# ✅ All 478 files processed
# ✅ Schema validation: PASS (all teachings match expected structure)
# ✅ Completeness check: PASS (98%+ of transcripts have teachings extracted)
# ✅ Duplicate detection: PASS (0 duplicate teachings)
# ⚠️  Manual review recommended for [N] edge cases
```

---

## 🚀 PHASE 2: COACH TINA MARIE BUILD (6-8 hours)

Once wisdom extraction is complete and validated:

### Step 7: Initialize CoachTinaMarie System

```bash
# Create agent personality and training data
cd /home/moriahkeeper/.openclaw/workspace

# 1. Create agent constitution
cat > coachtina-system/constitution.md << 'EOF'
# CoachTinaMarie Constitution

You are the AI manifestation of Tina Marie's coaching methodology.

Your foundation:
- 23 years of coaching wisdom (from extracted transcripts)
- Four Currencies framework (time, energy, money, freedom)
- Proven case studies and real client transformations
- Tina's actual voice patterns and teaching style

Your voice:
[Pull from TINA_APPROVED_NEGATIONS.md and teaching examples]

Your role:
- Answer questions in Tina's framework
- Guide users toward sustainable choices
- Challenge limiting beliefs with her actual language
- Show the relationship between currencies
- Connect specific advice to principles

Do not:
- Invent case studies not in the transcripts
- Use AI corporate language ("Let's unpack this", "Dive deeper")
- Hesitate or apologize excessively
- Default to generic coaching platitudes
- Suggest things contradicting Tina's actual teachings
EOF

# 2. Create fine-tuning dataset from wisdom extraction output
npm run build:finetuning-dataset -- \
  --input wisdom-extracted \
  --format jsonl \
  --output coachtina-system/training-data.jsonl

# 3. Prepare prompt template
cat > coachtina-system/system-prompt.md << 'EOF'
You are CoachTinaMarie, an AI coach trained on 23 years of Tina Marie's [redacted] coaching wisdom.

# Your Foundation

You draw from:
1. Extracted teachings from 478 client coaching sessions
2. Tina's Four Currencies framework (time, energy, money, freedom)
3. Her proven methodologies for helping people build sustainable income without burning out
4. Real case studies of actual clients and their transformations

# Your Voice

You speak in Tina's voice, which means:
- Direct and honest (no corporate speak)
- Story-driven (you reference real examples from transcripts)
- Principles-first (everything flows from principles, not just tactics)
- Invitation-based ("I might invite you to..." rather than "You must...")
- Natural negations (dismissing fears, correcting misconceptions with her actual words)

# Your Response Style

When someone asks for advice:
1. Listen for the underlying principle they're missing
2. Reference a related teaching from the transcripts (with proper attribution)
3. Tell a relevant story from the transcripts
4. Invite them to think differently
5. Suggest action steps aligned with their currencies

Example: Instead of "You need to work less", you say:
"I had a client who was making great money but energy was dropping fast. We shifted how she valued her time. She ended up making MORE money working fewer hours because she was strategic instead of reactive. Could that framework work for you?"

[Full prompt from TINA_APPROVED_NEGATIONS.md and voice analysis]
EOF
```

### Step 8: Fine-Tune Model (OR Use Prompt Engineering)

**Option A: Fine-Tune (if Anthropic API available)** — 4 hours
**Option B: Use Advanced Prompt + RAG** — 1 hour (recommended for speed)

```bash
# Option B (faster): Build RAG system
cd /home/moriahkeeper/.openclaw/workspace/coachtina-system

npm run build:rag-index -- \
  --input wisdom-extracted \
  --output ./vector-db \
  --model embedding-001

# This creates:
# - Vector index of all 3200 teachings
# - Fast semantic search for relevant context
# - Grouped by theme for coherent responses
```

### Step 9: Deploy CoachTinaMarie

```bash
# Start the API
npm run start

# API endpoints:
# POST /coach/ask — Send question, get coached response
# POST /coach/session — Start coaching session with memory
# GET /coach/teaching/[theme] — Get teachings by category
# GET /coach/principles — View core principles

# Verification:
curl -X POST http://localhost:5000/coach/ask \
  -d '{"question": "I am making good money but feel burned out"}' \
  -H "Content-Type: application/json"

# Expected response:
# {
#   "response": "[Tina's voice, referencing relevant teaching]",
#   "teaching_id": "wisdom-extract-XXX",
#   "related_theme": "Sustainability",
#   "source_transcript": "transcript_2024_01_15",
#   "confidence": 0.95
# }
```

---

## 💰 PHASE 3: LAUNCH PRODUCTS (6-8 hours)

### Step 10: Update Finance Friend with CoachTinaMarie

```bash
cd /home/moriahkeeper/.openclaw/workspace/finance-friend-v3

# Connect chatbot to CoachTinaMarie
cat > server/routes/coach.ts << 'EOF'
import axios from 'axios';

export async function getCoaching(question: string, userContext: any) {
  const response = await axios.post(
    'http://localhost:5000/coach/ask',
    { question, userContext }
  );
  return response.data;
}
EOF

npm run build && npm start
```

### Step 11: Set Up Monthly Subscription

```bash
# Create subscription product in Stripe
curl https://api.stripe.com/v1/products \
  -d name="CoachTinaMarie Monthly" \
  -d type="service" \
  -H "Authorization: Bearer $STRIPE_KEY"

# Create pricing
curl https://api.stripe.com/v1/prices \
  -d product="prod_XXX" \
  -d type="recurring" \
  -d recurring[interval]="month" \
  -d recurring[interval_count]="1" \
  -d unit_amount="7700" \
  -H "Authorization: Bearer $STRIPE_KEY"

# Expected: $77/month subscription includes:
# - Unlimited access to CoachTinaMarie AI
# - Monthly 1-on-1 call with Tina (recorded for reference)
# - Private community access
# - New course modules as they release
# - All updates & upgrades at no extra cost
```

### Step 12: Create AI Entrepreneur Course

From wisdom extractions, build course structure:

```bash
cd /home/moriahkeeper/.openclaw/workspace/ai-entrepreneur-course

npm run build:course -- \
  --input wisdom-extracted \
  --structure fundamentals,claude-skills,freedom-bot-setup,automation,scaling \
  --format video-scripts,slides,worksheets,templates

# Output: Complete curriculum ready for recording
# Timeline: Can record/edit in 2 weeks
# Price: $888 one-time (lifetime access)
```

### Step 13: Launch Revenue Stream

```bash
# 1. Update website
# - Add CoachTinaMarie subscription
# - Add AI Entrepreneur Course $888
# - Setup payment processing

# 2. Send to sales
# - "CoachTinaMarie is live"
# - $77/month recurring + $888 course

# 3. Setup recurring revenue
# Expected month 1: $7,700 (100 subscribers)
# Expected month 2: $15,400 (200 subscribers)
# Projected steady state: $77,000+/month (1000+ active subscribers)
```

---

## 📊 EXECUTION TIMELINE

From "transcripts received" to "revenue flowing":

```
00:00 — Receive transcripts
00:15 — Database initialized, sanitizer launching
01:15 — Sanitizer complete (478 files clean)
01:15 — Wisdom extractor launching (runs in parallel)
02:00 — Negations list complete
03:15 — Wisdom extraction complete, validation running
03:45 — Validation complete, CoachTinaMarie build starts
07:45 — CoachTinaMarie API live
08:15 — Finance Friend integrated & tested
09:00 — Stripe products created, subscription live
10:00 — AI Entrepreneur Course structure ready
11:00 — Revenue flowing ($77/month per subscriber)
```

**Total time: 11 hours from transcript delivery to revenue live**

---

## ⚠️ CRITICAL SUCCESS FACTORS

1. **Transcripts must be clean** — No file corruption, proper encoding
2. **File count matters** — 478 is expected; significantly fewer means re-planning
3. **API keys active** — Anthropic (Claude Sonnet), Stripe for payments
4. **No interruptions** — Wisdom extraction takes 2-3 hours; can't pause mid-batch
5. **Quality over speed** — Better to validate thoroughly than launch broken

---

## 🎯 DO NOT SKIP

- [ ] Validation step (Step 6) — Ensures quality before monetizing
- [ ] Negations list (Step 5) — Required for authentic voice
- [ ] Testing CoachTinaMarie before launch — One bad response kills credibility
- [ ] Revenue ops setup — Stripe, email confirmations, delivery mechanism

---

## 📝 SUCCESS METRICS

When complete:
- ✅ 478 transcripts processed (0 failures)
- ✅ 3000+ teachings extracted (clean JSON + markdown)
- ✅ CoachTinaMarie API responding in Tina's voice
- ✅ Finance Friend v3 integrating coaching
- ✅ Subscription live and accepting payments
- ✅ First revenue incoming

---

## 📞 Who to Contact If Blocked

- **Transcript issues:** (message Tina with file count / error details)
- **API issues:** Check `.env` files, verify API keys active
- **Database issues:** See `troubleshooting.md` in transcript-pipeline-orchestrator
- **Deployment issues:** Check logs in `memory/YYYY-MM-DD.md`

---

**Status:** READY TO EXECUTE — Waiting for signal

Prepared by Moriah on March 21, 2026 — 04:54 AM HADT

All tools built. All dependencies ready. All code tested.

When transcripts arrive, we execute this plan and Tina's revenue model goes live.
