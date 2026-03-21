# CoachTinaMarie Backend

> AI coaching backend powered by Tina Marie's 23 years of extracted wisdom.

The service that turns Tina's transcripts into personalized coaching interactions for paying subscribers.

---

## What This Is

A TypeScript/Express REST API that:
1. **Receives** extracted wisdom teachings from the Wisdom Extractor pipeline
2. **Stores** them in SQLite with a schema designed for coaching interactions
3. **Serves** them via REST API endpoints for coaching sessions
4. **Implements** Tina's coaching voice and PROBE → DIAGNOSE → ADVISE → DEEPEN methodology
5. **Tracks** user progress and generates personalized recommendations

---

## Quick Start

```bash
# Install
cd coachtina-backend
npm install

# Configure
cp .env.example .env
# Add your ANTHROPIC_API_KEY to .env

# Seed the database with example teachings + demo data
npm run seed

# Start development server
npm run dev
# → Server running on http://localhost:3333

# Run tests (no API key needed)
npm test

# Run live session test (requires API key + running server)
npm run test:session
```

---

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3333` | Server port |
| `ANTHROPIC_API_KEY` | — | Required for coaching responses |
| `DB_PATH` | `./coachtina.db` | SQLite database path |
| `COACHING_MODEL` | `claude-opus-4-5` | Anthropic model for coaching |
| `API_SECRET_KEY` | — | Optional service-to-service auth key |
| `NODE_ENV` | `development` | Environment |

---

## API Endpoints

### Teachings (Knowledge Base)

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/teachings/sync` | Receive extracted wisdom from Wisdom Extractor |
| `GET` | `/teachings` | List all teachings (supports `?theme=`, `?module=`, `?search=`) |
| `GET` | `/teachings/:id` | Get single teaching |

**POST /teachings/sync**
```json
{
  "source": "wisdom-extractor-v1",
  "teachings": [
    {
      "id": "teaching-unique-id",
      "theme": "Financial Freedom",
      "title": "The Four Currencies Framework",
      "core_teaching": "Optimize Energy → Time → Money → Freedom...",
      "key_insight": "Most entrepreneurs optimize for money alone...",
      "quote": "\"You don't have a money problem...\"",
      "action_steps": ["Step 1...", "Step 2..."],
      "currency_tags": ["money", "time", "energy", "freedom"],
      "course_module": "Module 1",
      "curriculum_ref": "Module 1 / Lesson 1.1"
    }
  ]
}
```

Response:
```json
{ "success": true, "inserted": 1, "updated": 0, "errors": 0, "total": 47 }
```

---

### Coaching

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/coaching/start-session` | Begin a coaching session |
| `POST` | `/coaching/respond` | User message → coach response |
| `GET` | `/coaching/session/:id` | Session history |
| `POST` | `/coaching/session/:id/close` | End session |
| `GET` | `/coaching/recommendations` | Personalized next steps |

**POST /coaching/start-session**
```json
{
  "user_id": "user-abc123",
  "topic": "I'm working 60 hours a week and burned out",
  "user_name": "Alex Rivera",
  "user_email": "alex@example.com",
  "currencies_baseline": {
    "money": 6, "time": 2, "energy": 3, "freedom": 4
  }
}
```

Response:
```json
{
  "session_id": "a1b2c3d4e5f6",
  "phase": "probe",
  "opening_message": "Good. You showed up...",
  "started_at": "2026-03-21T12:00:00Z"
}
```

**POST /coaching/respond**
```json
{
  "session_id": "a1b2c3d4e5f6",
  "user_id": "user-abc123",
  "message": "I have 12 consulting clients at $1500/month each. Everything is in my head."
}
```

Response:
```json
{
  "session_id": "a1b2c3d4e5f6",
  "phase": "probe",
  "response": "Walk me through how your last three clients found you...",
  "turn_count": 2,
  "teaching_ids_used": ["teaching-004", "teaching-007"]
}
```

**GET /coaching/recommendations?user_id=user-abc123**
```json
{
  "recommendations": [
    {
      "teaching_id": "teaching-005",
      "title": "Value-Based Pricing",
      "theme": "Pricing Strategy",
      "reason": "Your money score is lowest — this addresses it directly.",
      "priority": "high",
      "currency_focus": ["money", "freedom"]
    }
  ]
}
```

---

### User Progress

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/user/progress` | Full progress summary |
| `POST` | `/user/progress` | Update module/lesson progress |
| `GET` | `/user/sessions` | Recent coaching sessions |
| `GET` | `/user/profile` | User profile |
| `POST` | `/user/profile` | Create/update user |

**GET /user/progress?user_id=user-abc123**
```json
{
  "user_id": "user-abc123",
  "modules_completed": 2,
  "modules_total": 8,
  "sessions_count": 4,
  "topics_explored": 12,
  "currencies_baseline": { "money": 6, "time": 2, "energy": 3, "freedom": 4 },
  "module_breakdown": [
    {
      "module_id": "module-1",
      "module_name": "Foundation",
      "status": "completed",
      "lessons_completed": 3,
      "lessons_total": 3
    }
  ],
  "recent_sessions": [...]
}
```

---

## Coaching Methodology

The coach follows Tina's 4-phase methodology automatically:

| Phase | When | What Happens |
|-------|------|-------------|
| **PROBE** | First 2-3 turns | One diagnostic question at a time. No advice yet. |
| **DIAGNOSE** | After probing | Names the pattern, connects to Business Fundamental. |
| **ADVISE** | After diagnosis | 2-3 paths with trade-offs. Asks which resonates. |
| **DEEPEN** | After choice | Specific next steps, connects to Four Currencies. |

### The Four Currencies Framework
Every coaching response is grounded in these four currencies:
- **Money** — Financial resources (necessary but not sufficient)
- **Time** — Most limited resource (quality over quantity)
- **Energy** — Sustainability over intensity
- **Freedom** — The real metric of success

### The 9 Business Fundamentals
1. Offer Architecture
2. Revenue Engine
3. Time Mastery
4. Team & Delegation
5. Client Journey
6. Marketing Ecosystem
7. Operations & Systems
8. Financial Architecture
9. Leadership & Vision

---

## Database Schema

```
teachings         — extracted wisdom knowledge base
users             — coach subscribers
coaching_sessions — individual conversations
session_turns     — every message in every session
user_progress     — module/lesson completion
topic_exposure    — what teachings each user has seen
sync_log          — audit trail for teaching syncs
```

---

## Architecture

```
Wisdom Extractor API
    ↓ POST /teachings/sync
SQLite Knowledge Base (teachings)
    ↓ search on every coaching turn
Claude API (Anthropic)
    ↓ system prompt + retrieved teachings
Coaching Response
    ↓ stored in session_turns
User Progress Tracking
    ↓ topic_exposure, user_progress
Personalized Recommendations
```

---

## Integrating with Wisdom Extractor

The Wisdom Extractor outputs JSON matching the teaching schema. To sync:

```bash
# Extract from a transcript
cd ../wisdom-extractor
npm run extract

# Sync to coaching backend
curl -X POST http://localhost:3333/teachings/sync \
  -H "Content-Type: application/json" \
  -d @output/teachings.json
```

Or use the sync endpoint directly in the extractor's output pipeline.

---

## Production Deployment

```bash
# Build
npm run build

# Set production env
export NODE_ENV=production
export ANTHROPIC_API_KEY=sk-...
export API_SECRET_KEY=your-strong-secret
export DB_PATH=/data/coachtina.db

# Start
npm start
```

For PM2:
```bash
pm2 start dist/index.js --name coachtina-backend
```

---

## Status

Built March 2026 by Moriah 🏔️
For Tina Marie's CoachTinaMarie subscription product.
