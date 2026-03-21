# Transcript Pipeline Blueprint
## Tina's Wisdom → Products at Scale

**Status:** Ready to build. Waiting for Tina's transcript input.  
**Timeline:** 3 days to production  
**Potential Revenue:** $888 one-time + $77/mo × 1000+ subscribers = $77K+/mo

---

## The Problem We're Solving

Tina has:
- 23 years of business coaching knowledge
- Decades of teaching + client conversations
- Thousands of hours of transcribed wisdom
- 6 high-value clients paying $250K/year (but NOT scaleable)

What's missing:
- A system to extract, organize, and systematize that knowledge
- Products to sell it at scale (courses, AI coach, ebooks)
- Automation to handle volume without Tina doing the work herself

**The Pipeline:**
```
Raw Transcripts
    ↓ [Sanitizer]
Clean, organized documents (PII removed, topics tagged)
    ↓ [Wisdom Extractor]
Structured teachings: modules, quotes, principles
    ↓ [Course Builder]
AI Entrepreneur Course ($888 one-time)
    ↓ [Coach Trainer]
CoachTinaMarie (AI system from wisdom)
    ↓ [Product]
$77/mo community + monthly call + AI coach
```

---

## PHASE 1: Transcript Sanitizer

### What It Does
- Batch process `.txt` files (transcripts)
- Remove/mask PII (names, email, phone numbers except for approved people)
- Extract metadata (date, speaker, duration, topics)
- Tag content by theme (Finance, Marketing, Team Building, Life, etc.)
- Output: Clean markdown files ready for extraction

### Input
```
Raw transcript (.txt, .md, or .pdf):
"On March 15th, I talked to Sarah Chen (sarah@email.com) about financial freedom.
She mentioned her SSN is 123-45-6789 and her credit card is..."
```

### Output
```
---
title: Financial Freedom Coaching Session
date: 2026-03-15
speakers: [Sarah Chen]
duration: 45 min
themes: [Finance, Personal Growth]
pii_removed: [SSN, Credit Card, Email]
status: clean
---

# Financial Freedom Coaching Session

On March 15th, I talked to [CLIENT] about financial freedom.
She mentioned her [SENSITIVE DATA] and her [SENSITIVE DATA]...
```

### Implementation
**File:** `transcript-sanitizer/index.js`  
**Tech:** Node.js + OpenAI API (Claude can do this)

```javascript
const TranscriptSanitizer = {
  // 1. Read all .txt/.md files from input directory
  // 2. For each file:
  //    a. Extract metadata (dates, speakers from filename/content)
  //    b. Detect PII patterns (SSN, credit card, phone, email)
  //    c. Replace PII with [REDACTED-TYPE]
  //    d. Tag by theme (use Claude for thematic analysis)
  //    e. Create frontmatter with metadata
  //    f. Output to clean/ directory
  // 3. Log all PII found + replacements (for audit)
  // 4. Generate summary: "Processed 50 files, found 200 PII instances"
}
```

### Success Criteria
✅ All PII removed/masked  
✅ Metadata extracted and tagged  
✅ Output is clean, readable markdown  
✅ Audit log shows what was removed  
✅ Can process 100+ files in <5 minutes  

---

## PHASE 2: Wisdom Extractor

### What It Does
- Read clean transcripts from Phase 1
- Extract key teachings, principles, stories, actionable advice
- Organize into structured JSON: `{ theme, teaching, quote, action_steps, key_insight }`
- Create course modules from extracted wisdom
- Output: Structured data ready for products

### Input
```markdown
# Financial Freedom Coaching Session

On March 15th, Tina talked to Sarah about financial freedom.

"The problem isn't that you don't have money. It's that you're not 
controlling where it goes. I teach my clients to use the Four Currencies
framework: Time, Energy, Money, Freedom.

Here's what Sarah did:
1. Mapped her spending by currency impact
2. Cut activities that drained energy
3. Reallocated that time to high-money work
4. In 3 months, she doubled her income while working less."
```

### Output
```json
{
  "id": "teaching-001",
  "theme": "Financial Freedom",
  "title": "The Four Currencies Framework",
  "core_teaching": "Money is not the primary currency. It's Time, Energy, Money, Freedom in that order.",
  "key_insight": "Most people fail because they optimize for money alone, ignoring energy depletion.",
  "quote": "The problem isn't that you don't have money. It's that you're not controlling where it goes.",
  "action_steps": [
    "Map your spending by currency impact (how much time/energy/freedom does each expense cost?)",
    "Identify energy drains (activities that don't align with your freedom goal)",
    "Reallocate freed time to high-value work",
    "Track progress: income, energy, freedom score"
  ],
  "case_study": {
    "client": "Sarah Chen",
    "baseline": { "hours_worked": 50, "income": "$80K/year", "freedom_score": 2 },
    "after": { "hours_worked": 30, "income": "$160K/year", "freedom_score": 8 },
    "timeline": "3 months"
  },
  "related_teachings": ["time-management", "energy-allocation", "pricing-strategy"],
  "course_module": "Fundamentals of the Four Currencies"
}
```

### Implementation
**File:** `wisdom-extractor/index.js`  
**Tech:** Node.js + Claude API (structured extraction)

```javascript
const WisdomExtractor = {
  // 1. Read clean transcripts from ./clean/
  // 2. For each transcript:
  //    a. Use Claude to identify key teachings
  //    b. Extract: theme, title, core teaching, insight, quotes
  //    c. Find action steps (numbered lists, how-tos)
  //    d. Detect case studies (client stories with before/after)
  //    e. Link to related teachings
  //    f. Identify which course module this belongs to
  // 3. Output to ./extracted/ as JSON
  // 4. Generate index: all teachings, organized by theme + course
  // 5. Create markdown versions for easy reading
}
```

### Success Criteria
✅ Extracts 10-20 teachings per transcript  
✅ JSON is valid and structured  
✅ Quotes are actual text from transcript  
✅ Action steps are clear and actionable  
✅ Case studies include metrics + timeline  
✅ Can extract 50 transcripts in <10 minutes  

---

## PHASE 3: CoachTinaMarie System

### What It Does
- Takes extracted wisdom (Phase 2 output)
- Trains a coaching AI system on Tina's actual teachings
- Provides chat interface where users ask questions
- AI responds using Tina's principles + voice
- Tracks conversation context for monthly review sessions

### Architecture

```
Wisdom Extraction (JSON)
    ↓
Vector Database (Pinecone/Qdrant)
    ↓ [Embedding → 768-dim vector]
    ↓
CoachTinaMarie Agent
    ├─ System prompt: Tina's voice + principles
    ├─ RAG: Query vector DB for relevant teachings
    ├─ Context: User's previous messages
    └─ Response: Coaching advice grounded in extracted wisdom
    ↓
Monthly Sync
    ├─ User submits progress recap
    ├─ AI analyzes against original teachings
    └─ Outputs: Personalized coaching summary + next steps
```

### User Experience
1. User subscribes ($77/mo)
2. Goes to chat.coachtinmarie.com
3. Asks a question: "I'm overwhelmed. How do I prioritize?"
4. System queries: "Which teachings are relevant to overwhelm + prioritization?"
5. Finds: Four Currencies framework, Energy allocation, Time blocking
6. Generates response in Tina's voice: "The problem isn't that you don't have time..."
7. User gets actionable coaching grounded in Tina's actual methodology

### Implementation

**Backend:**
- FastAPI + LangChain
- Pinecone for vector embeddings
- PostgreSQL for user sessions + conversation logs
- Monthly batch job: Analyze user progress vs. teachings

**Frontend:**
- React chat interface
- Dark mode (professional)
- Session history + progress tracking

**Revenue Model:**
- $77/mo subscription
- 1,000 active users = $77K/mo passive income
- Minimal operational cost (just server + vector DB)

---

## PHASE 4: AI Entrepreneur Course

### What It Does
- Builds a self-paced course FROM extracted wisdom
- Modules: 10 Fundamentals (existing), Claude Skill System, FreedomBot, Automation
- Video + text + templates + community + monthly calls
- Price: $888 one-time (or $99/mo payment plan)

### Structure
```
AI Entrepreneur Course ($888)
├─ Foundation (1-2 weeks)
│  └─ The Four Currencies Framework
│  └─ Energy Management for Builders
│  └─ Pricing Your Expertise (not commodity pricing)
├─ Claude Skill System (1-2 weeks)
│  └─ How to build AI agents that actually work
│  └─ Tina's methodology for prompt engineering
│  └─ Real templates from her work
├─ FreedomBot (1 week)
│  └─ Deploy your own coaching AI
│  └─ Train it on your wisdom
│  └─ Monetize it
├─ Automation & Scaling (1 week)
│  └─ n8n + Make.com workflows
│  └─ Integrations: Slack, Discord, email
│  └─ How to handle volume without burning out
├─ Community (Ongoing)
│  └─ Discord with other entrepreneurs
│  └─ Monthly group calls with Tina (or recorded sessions)
│  └─ Shared templates + scripts
└─ Monthly Upsell
   └─ $77/mo CoachTinaMarie (for personal AI coaching)
   └─ $300 FreedomBot setup service (Tina helps set it up)
```

### Success Metrics
- 100 students in first month = $88K
- 50% convert to $77/mo CoachTinaMarie = $77K/mo
- 20% buy $300 setup service = $6K/month
- **Year 1 revenue: $200K+ (course) + $924K+ (subscriptions)**

---

## Technical Stack

### Transcript Sanitizer
- **Language:** JavaScript (Node.js)
- **Input:** Directory of `.txt`, `.md`, `.pdf` files
- **Output:** Cleaned markdown files with frontmatter
- **Runtime:** <1 min per file on typical laptop
- **Dependencies:** fs, path, regex, OpenAI API (for thematic tagging)

### Wisdom Extractor
- **Language:** JavaScript (Node.js)
- **Input:** Directory of cleaned markdown files
- **Output:** JSON files + markdown index
- **Runtime:** <30 sec per file
- **Dependencies:** Claude API (structured extraction), JSON generation

### CoachTinaMarie
- **Backend:** Python (FastAPI)
- **Frontend:** React + TypeScript
- **Vector DB:** Pinecone or Qdrant
- **LLM:** Claude API
- **Database:** PostgreSQL (user sessions, conversation logs)
- **Hosting:** Railway or Vercel (frontend) + Railway (backend)

### AI Entrepreneur Course
- **Platform:** Thinkific or custom Django app
- **Content:** Video (Loom) + markdown + templates
- **Community:** Discord (free tier)
- **Payments:** Stripe

---

## Timeline

**Week 1:**
- Day 1-2: Transcript Sanitizer (build + test)
- Day 3-4: Wisdom Extractor (build + test)
- Day 5: Deploy both, process Tina's transcripts

**Week 2:**
- Day 1-3: CoachTinaMarie backend (FastAPI + vector embeddings)
- Day 4-5: CoachTinaMarie frontend (React chat)
- Day 6-7: Integration testing + deployment

**Week 3:**
- Day 1-5: AI Entrepreneur Course (Thinkific setup + content porting + modules)
- Day 6-7: Launch beta, fix bugs, optimize

**By End of Week 3:**
- ✅ Transcripts processed and organized
- ✅ Wisdom extracted and indexed
- ✅ CoachTinaMarie running and handling conversations
- ✅ AI Entrepreneur Course ready for presale
- ✅ Revenue-generating products deployed

---

## Risks & Mitigation

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Transcripts not available | BLOCKING | Get them from Tina ASAP; start with 5-10 sample transcripts |
| Claude API costs | High (vector embeddings) | Use cheaper Groq for extraction, Claude for quality responses |
| Vector DB scalability | Medium | Start with Qdrant (free), upgrade to Pinecone if needed |
| User adoption | Medium | Leverage Tina's existing 6 clients as early users + affiliates |
| Course content quality | High | Ensure extraction is accurate; have Tina review modules |

---

## Next Steps (Immediate)

1. **Get Tina's transcripts**
   - Where are they stored? (Google Drive? Local folder? Email?)
   - How many? (She said "ALL my transcripts")
   - Format? (.txt, .md, .docx, .wav with captions?)

2. **Prioritize which transcripts to process first**
   - Sample: 5-10 transcripts covering different topics
   - Scope: Can we process them in 1 day?

3. **Set up infrastructure**
   - Create `/transcripts/` directory
   - Create `/scripts/sanitizer/` and `/scripts/extractor/`
   - Initialize version control + documentation

4. **Build Phase 1: Transcript Sanitizer**
   - Read all transcripts
   - PII detection + removal
   - Metadata extraction
   - Output clean markdown

5. **Build Phase 2: Wisdom Extractor**
   - Parse clean transcripts
   - Extract teachings using Claude
   - Generate structured JSON + markdown

6. **Show Tina proof**
   - "Here's 50 teachings extracted from 10 of your transcripts"
   - "Here's what CoachTinaMarie could say based on this"
   - "Here's a draft course module"

---

## Why This Works

**For Tina:**
- Scales her knowledge without her working more hours
- Products she can sell immediately (no 6-month dev cycle)
- Uses her actual voice + methodology (not generic AI coach)
- Revenue from passive products ($77K+/mo at scale)

**For the Business:**
- Multiple revenue streams: courses + subscriptions + services
- Low operational cost (mostly API + hosting)
- Viral potential (happy students → referrals)
- Upsell path: Course → AI Coach → Setup Service → Custom GPT

**For the AI:**
- This is the infrastructure for "an army of agents"
- Agents can use CoachTinaMarie as a reference system
- Each agent learns from the same wisdom
- Scales to handle 1000s of users without human intervention

---

## Ready to Build

I'm waiting for:
1. ✅ Architecture (above — DONE)
2. ✅ Implementation plan (detailed code structure — READY)
3. ❌ **Tina's transcripts** (BLOCKING)

Once I have transcripts, I can have Phase 1 + 2 complete in 6 hours and show Tina proof by morning.

**Expected output by 6 AM HADT:**
```
📊 Transcript Pipeline Status (6:00 AM)

✅ Phase 1: Sanitizer complete
   - Processed: 50 transcripts
   - PII removed: 200 instances
   - Themes tagged: 15 topics
   - Output: 50 clean markdown files

✅ Phase 2: Extractor complete
   - Teachings extracted: 250
   - Course modules identified: 5
   - Case studies found: 12
   - Avg extraction time: 0.4s per transcript

✅ Phase 3: CoachTinaMarie demo
   - Ask: "How do I manage my energy?"
   - Response: [Tina's actual teaching from transcript]
   - Shows: This works. This scales. This sells.

🚀 Ready to launch by next week
```

---

**Built by:** Moriah  
**Created:** March 21, 2026, 1:38 AM HADT  
**Status:** Ready. Waiting for transcripts.
