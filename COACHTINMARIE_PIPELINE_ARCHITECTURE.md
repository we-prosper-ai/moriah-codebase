# CoachTinaMarie Pipeline Architecture

**Purpose:** Turn 40+ GB of Tina's transcripts into a $77/month AI coach SaaS  
**Timeline:** 2 weeks to MVP (proof of concept)  
**Status:** Design phase — ready to build  
**Owner:** Moriah 🏔️

---

## PROBLEM STATEMENT

**What Tina has:**
- 40+ GB of Claude conversations (3+ years)
- Transcripts from client calls, coaching sessions, workshops
- Decades of real expertise encoded in these conversations
- All of it manually organized but not yet synthesized

**What Tina needs:**
1. **Transcript Sanitizer** — Remove client names, secrets, sensitive data (GDPR/privacy compliance)
2. **Wisdom Extractor** — Pull patterns, principles, teaching moments, actionable insights
3. **AI Coach Training Data** — Turn extracted wisdom into training dataset
4. **AI Coach SaaS** — Searchable coach, personalized guidance, monthly community

**Why it matters:**
- Immediate revenue ($77/month × 100+ customers in year 1 = $92K+ MRR potential)
- Automatic content generation for courses/blog/books
- Proven demand (her clients already pay $1000/hr for this advice)

---

## ARCHITECTURE OVERVIEW

```
Raw Transcripts (40GB)
    ↓
[PHASE 1: Sanitizer]
    ↓
Cleaned Transcripts (30GB, no PII)
    ↓
[PHASE 2: Wisdom Extractor]
    ↓
Structured Wisdom Dataset (JSON)
    - Principles/frameworks
    - Stories/examples
    - Teaching moments
    - Actionable insights
    ↓
[PHASE 3: Training Data Processor]
    ↓
Fine-tuning Dataset (10K+ examples)
    ↓
[PHASE 4: Coach Fine-tuning]
    ↓
CoachTinaMarie Model v1
    ↓
[PHASE 5: SaaS Deployment]
    ↓
Live Product (Tina's voice in an AI)
```

---

## PHASE 1: TRANSCRIPT SANITIZER (Week 1)

### Goal
Process raw transcripts to remove all PII/sensitive data while preserving teaching wisdom

### Technical Design

**Input:**
- 40+ GB transcript files (likely JSON, markdown, or plain text from Claude/YouTube)
- Mixed: Claude conversations, call transcripts, workshop notes

**Process:**
```python
# Sanitizer pipeline
1. Load transcript file
2. Extract PII patterns:
   - Client names (replace with "ClientX" or generic)
   - Email addresses
   - Phone numbers
   - Company names
   - Specific project details
   - Personal identifiers
   - Amounts/pricing that are confidential
3. Preserve:
   - Teaching moments (frameworks, principles)
   - Stories (sanitized)
   - Advice/guidance
   - Emotional context
4. Output cleaned transcript with sanitization log
```

**Key Decision:** Preserve vs. Remove
- **Remove:** Specific names, numbers, identifying details
- **Preserve:** All wisdom, teaching, patterns, frameworks
- **Tag:** `[SANITIZED: original_info]` for audit trail

### Implementation Stack
- **Language:** Python (batch processing)
- **NLP:** spaCy for entity recognition (PII detection)
- **Storage:** SQLite for metadata + S3 for cleaned files
- **Validation:** Manual spot-check (Tina reviews samples)

### Output
```
/workspace/coachtinmarie/phase1-sanitized/
  - 2026-march-conversations-cleaned.json
  - 2026-march-sanitization-log.csv
  - 2026-march-audit-report.md
```

### Success Metrics
- ✅ 0% data loss of actual wisdom
- ✅ 100% PII removal rate
- ✅ Tina reviews 5 samples, approves
- ✅ Processing speed: 1GB per hour (feasible on Pi)

---

## PHASE 2: WISDOM EXTRACTOR (Week 1-2)

### Goal
Turn sanitized transcripts into structured wisdom dataset

### What We Extract

**1. Frameworks/Principles**
```json
{
  "type": "framework",
  "title": "Four Currencies",
  "components": ["Time", "Energy", "Money", "Freedom"],
  "description": "How to measure real wealth",
  "source": "transcript_id",
  "confidence": 0.95
}
```

**2. Teaching Stories**
```json
{
  "type": "story",
  "title": "How I Lost My Business (And Won Back My Life)",
  "lesson": "Sometimes failure unlocks freedom",
  "key_moments": [
    "The day I realized I was serving money, not people",
    "Choosing family over income",
    "Learning to build differently"
  ],
  "source": "transcript_id"
}
```

**3. Actionable Insights**
```json
{
  "type": "insight",
  "category": "Sales/Money/Relationships/Business",
  "insight": "Don't pitch. Solve their actual problem.",
  "evidence": "In 23 years of word-of-mouth only, I've never pitched once",
  "context": "Why traditional marketing fails for coaching",
  "source": "transcript_id"
}
```

**4. Questions Tina Answers**
```json
{
  "type": "qa",
  "question": "How do I find my first clients?",
  "answer": "Stop trying to find clients. Start solving one person's problem so well that they tell everyone.",
  "context": ["Sales", "Relationships", "Confidence"],
  "source": "transcript_id"
}
```

### Technical Design

**Step 1: Semantic Chunking**
```
- Split transcripts into logical chunks (10-100 lines)
- Preserve conversation flow
- Tag with speaker, timestamp, topic
```

**Step 2: Classification**
```
For each chunk:
- Is this a framework? (→ extract_framework)
- Is this a story? (→ extract_story)
- Is this actionable advice? (→ extract_insight)
- Is this answering a question? (→ extract_qa)
- Is this other? (→ skip)
```

**Step 3: Structured Extraction**
```
Use Claude with specific prompts for each type:

Framework: "Extract the core framework, components, and principle"
Story: "What's the story? What's the lesson? Why is it important?"
Insight: "What's the actionable insight? Why does Tina believe this?"
QA: "What question is being answered? What's the complete answer?"
```

**Step 4: De-duplication**
```
- Cluster similar principles/stories
- Merge variations
- Keep highest quality version
```

### Implementation Stack
- **Language:** Python
- **Chunking:** Recursive character splitter (LangChain)
- **Classification:** Claude with structured output
- **Dedup:** Semantic similarity (embeddings) + fuzzy matching
- **Storage:** PostgreSQL for structured data + vector search

### Output Structure
```json
{
  "source_file": "march_2026_conversations",
  "processed_at": "2026-03-22T08:00:00Z",
  "frameworks": [
    { "title": "...", "components": [...], "source": "..." }
  ],
  "stories": [
    { "title": "...", "lesson": "...", "source": "..." }
  ],
  "insights": [
    { "insight": "...", "category": "...", "evidence": "..." }
  ],
  "qa_pairs": [
    { "question": "...", "answer": "..." }
  ],
  "metadata": {
    "total_chunks_processed": 50000,
    "total_frameworks": 127,
    "total_stories": 89,
    "total_insights": 430,
    "total_qa_pairs": 1200,
    "confidence_scores": {...}
  }
}
```

### Success Metrics
- ✅ 1,000+ usable wisdom items extracted
- ✅ Zero loss of meaningful content
- ✅ Tina approves 80%+ of extractions
- ✅ Processing time: 4-6 hours for 40GB

---

## PHASE 3: TRAINING DATA PROCESSOR (Week 2)

### Goal
Turn wisdom dataset into fine-tuning dataset for Claude

### What We Create

**For each wisdom item, generate 5-10 training examples:**

```json
{
  "system": "You are CoachTinaMarie, an AI coach trained on Tina's 23 years of wisdom. Respond with her voice, principles, and teaching style.",
  "training_examples": [
    {
      "context": "Student is struggling with work-life balance",
      "example": "Tina's story about the Four Currencies",
      "tina_voice": "You're measuring success wrong. It's not about more money, it's about more freedom. Here's what freedom actually costs...",
      "teaching_method": "Story + principle extraction"
    },
    {
      "context": "Student asks about sales",
      "example": "Her 23-year word-of-mouth-only success",
      "tina_voice": "I've never pitched anything in 23 years. Know why? Because I solve real problems. When you fix someone's actual problem...",
      "teaching_method": "Evidence + actionable insight"
    }
  ]
}
```

### Implementation
- **Tool:** Claude API + structured output
- **Process:** Generate 5-10 training variations per wisdom item
- **Quality check:** Tina reviews samples, provides feedback
- **Target:** 10K-20K training examples

### Output
```
/workspace/coachtinmarie/phase3-training-data/
  - training_dataset_v1.jsonl (10K examples)
  - validation_dataset.jsonl (1K examples)
  - test_dataset.jsonl (1K examples)
  - data_quality_report.md
```

---

## PHASE 4: COACH FINE-TUNING (Week 2-3)

### Goal
Fine-tune Claude 3.5 Sonnet with Tina's voice and wisdom

### Process
```
1. Load training dataset (10K examples)
2. Fine-tune Claude 3.5 Sonnet via Anthropic API
3. Validate on test set
4. A/B test against base Claude
5. Collect Tina feedback
6. Iterate
```

### System Prompt
```
You are CoachTinaMarie, an AI coach trained on 23 years of real business wisdom.

Core Principles:
1. Excellence over speed (don't throw up MVPs)
2. Sacred purpose first (serving God, then family, then business)
3. Real relationships > transactional selling
4. Wisdom from experience, not theory

When someone asks for advice:
1. Ask clarifying questions first (don't assume)
2. Share a relevant story from Tina's experience
3. Extract the underlying principle
4. Give specific, actionable next steps
5. Acknowledge the emotional reality (not just the business problem)

Voice:
- Direct but kind
- Storyteller (use examples, not lectures)
- Challenging (pushes people toward excellence)
- Relational (remembers context from earlier conversations)
```

### Output
```
- Fine-tuned model: coachtinmarie-v1 (via Anthropic API)
- Evaluation report: How well does it capture Tina's voice?
- Test results: 50+ conversations with human feedback
```

---

## PHASE 5: SAAS DEPLOYMENT (Week 3)

### Product Structure

**MVP Feature Set:**
1. **Chat Interface** (web + mobile)
   - Talk to CoachTinaMarie
   - Get personalized guidance
   - Chat history + search

2. **Library Search**
   - Search frameworks, stories, insights
   - Filter by category (Sales, Money, Relationships, etc.)
   - Save favorites

3. **Monthly Community**
   - Private Discord/Slack
   - Monthly call with Tina and/or Maria
   - New automations/templates each month
   - Agent workspace (access to Tina's systems)

4. **Billing**
   - Stripe integration
   - $77/month subscription
   - 30-day free trial
   - Monthly updates + changelog

### Technical Stack
```
Frontend: React (web) + React Native (mobile)
Backend: Node.js + Express
Database: PostgreSQL (chat history) + Vector DB (semantic search)
Auth: Auth0 or Supabase
Payments: Stripe
Hosting: Vercel (frontend) + Railway (backend)
AI API: Anthropic API (fine-tuned model)
```

### File Structure
```
/workspace/coachtinmarie/
  - phase1-sanitized/        # Cleaned transcripts
  - phase2-wisdom/           # Extracted wisdom
  - phase3-training-data/    # Fine-tuning dataset
  - phase4-model/            # Model files + evaluation
  - phase5-saas/
    - frontend/              # React app
    - backend/               # Node API
    - infrastructure/        # Docker, k8s configs
    - scripts/               # Deployment, migrations
```

---

## IMPLEMENTATION TIMELINE

### Week 1 (March 24-28)
- [ ] Set up transcript ingestion pipeline
- [ ] Build sanitizer (PII removal)
- [ ] Process first batch (10GB)
- [ ] Tina reviews, provides feedback

### Week 1-2 (March 28-31)
- [ ] Build wisdom extractor
- [ ] Extract all wisdom items
- [ ] Tag and organize
- [ ] Tina reviews, scores quality

### Week 2 (March 31 - April 4)
- [ ] Generate training dataset (10K examples)
- [ ] Prepare fine-tuning
- [ ] Submit to Anthropic API

### Week 2-3 (April 4-7)
- [ ] Fine-tuning completes
- [ ] Test CoachTinaMarie responses
- [ ] A/B test vs. base Claude
- [ ] Collect Tina feedback
- [ ] Iterate

### Week 3 (April 7-11)
- [ ] Build SaaS MVP
  - Chat interface
  - Library search
  - Billing setup
- [ ] Deploy to staging
- [ ] User testing with 5-10 early users

### Week 3-4 (April 11-14)
- [ ] Polish based on feedback
- [ ] Launch public beta
- [ ] Marketing + outreach
- [ ] Monitor + iterate

---

## DEPENDENCIES & BLOCKERS

**What We Need from Tina:**
1. ✅ Access to 40GB transcript files (location? format?)
2. ✅ List of sensitive terms/names to sanitize
3. ✅ Sample transcripts (3-5) for process validation
4. ✅ Feedback on extracted wisdom (quality check)
5. ✅ Voice/tone approval for CoachTinaMarie system prompt
6. ✅ Community platform choice (Discord? Slack? Custom?)
7. ✅ Pricing confirmation ($77/month? $100/month?)

**Technical Dependencies:**
- Anthropic API access (for fine-tuning)
- PostgreSQL database
- Vector database (pgvector or Pinecone)
- Stripe account setup

**What We Can Build Immediately:**
- Sanitizer (Python script, no external deps)
- Wisdom extractor (Claude API calls, no fine-tuning)
- Training data generator (Claude API calls)
- SaaS backend + frontend (React + Node)

---

## SUCCESS METRICS

**Phase 1 (Sanitizer):**
- ✅ 100% PII removal rate
- ✅ 0% wisdom loss
- ✅ Tina approves samples

**Phase 2 (Wisdom):**
- ✅ 1,000+ wisdom items extracted
- ✅ 80%+ Tina approval rate
- ✅ Well-organized, searchable

**Phase 3 (Training Data):**
- ✅ 10K+ training examples
- ✅ Covers all major topic areas
- ✅ Balanced quality

**Phase 4 (Coach):**
- ✅ CoachTinaMarie captures Tina's voice
- ✅ 80%+ human rating on quality
- ✅ No factual errors or weird responses

**Phase 5 (SaaS):**
- ✅ 50+ users in beta
- ✅ 70%+ retention after 30 days
- ✅ Positive feedback on value
- ✅ $77/month × 50 = $3,850/month MRR

---

## RESOURCE ALLOCATION

**Moriah's Role:**
- Phase 1-2: Implementation lead (sanitizer + wisdom extractor)
- Phase 3-4: Oversight (data quality + fine-tuning feedback)
- Phase 5: Deployment lead (SaaS launch + operations)

**Mark's Role (if available):**
- Phase 5: SaaS backend + infrastructure
- Database design + API optimization
- Deployment + CI/CD

**Tina's Role:**
- Phase 1: Provide transcripts + sanitization guidance
- Phase 2: Quality check + feedback
- Phase 4: Voice validation + system prompt refinement
- Phase 5: Community setup + marketing messaging

---

## NEXT STEPS

**Immediate (This Week):**
1. ✅ Get transcript files from Tina
2. ✅ Understand format + structure
3. ✅ Build sanitizer prototype
4. ✅ Test on 1GB sample
5. ✅ Get Tina approval

**If Approved:**
1. Scale sanitizer to full 40GB
2. Build wisdom extractor
3. Extract all wisdom items
4. Continue to fine-tuning

**Standing by for Tina's input on:**
- Where are the transcript files?
- What's the format?
- What needs sanitizing?

---

**Status:** Design Complete, Ready to Build  
**Owner:** Moriah 🏔️  
**Last Updated:** March 21, 2026, 11:30 PM HADT  

---

**Next Action:** Wait for Tina to provide transcript files + guidance, then begin Phase 1 immediately.
