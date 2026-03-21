# Wisdom Extractor

**Phase 2 of the Revenue Pipeline.** Receives clean transcripts from the Transcript Sanitizer, calls Claude to extract structured wisdom teachings, and persists them to SQLite for downstream consumption by CoachTinaMarie.

```
Sanitizer (port 4001) → Wisdom Extractor (port 4002) → CoachTinaMarie (port 4003)
```

---

## Quick Start

```bash
# 1. Copy env and add your Anthropic API key
cp .env.example .env
# Edit .env: ANTHROPIC_API_KEY=sk-ant-...

# 2. Install
npm install

# 3. Start
npm run build && npm start

# OR dev mode (hot-reload)
npm run dev:watch
```

Service starts on `http://localhost:4002`.

---

## API Endpoints

### `POST /extract`
Extract teachings from a single clean transcript.

**JSON body:**
```json
{
  "content": "# Session Transcript\n\nTina: You are not building a business...",
  "filename": "session-001.md",
  "file_id": "optional-uuid",
  "metadata": {
    "speakers": ["Tina Marie", "Client"],
    "themes": ["Revenue", "Freedom"],
    "date": "2026-03-21",
    "duration": "45 minutes"
  }
}
```

**Response:**
```json
{
  "file_id": "uuid",
  "audit_id": "uuid",
  "teachings": [...],
  "count": 5,
  "duration_ms": 3200
}
```

Also accepts multipart form upload with `file` field.

---

### `POST /extract-batch`
Extract from multiple transcripts in parallel (max 3 concurrent).

```json
{
  "files": [
    { "content": "...", "filename": "session-001.md" },
    { "content": "...", "filename": "session-002.md" }
  ]
}
```

---

### `GET /teachings`
List all extracted teachings, paginated.

Query params: `page`, `page_size`, `module`

```
GET /teachings?page=1&page_size=20&module=Revenue Architecture
```

---

### `GET /teachings/:id`
Get a single teaching by ID.

---

### `GET /audit/:id`
Get extraction audit trail by audit ID or file ID. Shows model used, token counts, duration, teaching IDs.

---

### `POST /teachings/sync`
Sync all teachings to CoachTinaMarie (or any downstream service).

```json
{ "target_url": "http://localhost:4003/teachings/ingest" }
```

Or set `COACHTINA_URL` in `.env`.

---

## Teaching Output Schema

Each extracted teaching:

```json
{
  "id": "uuid",
  "title": "Trading Time for Money Is a Dead End",
  "core_concept": "3-sentence summary of the teaching",
  "insight": "What makes this non-obvious",
  "quotes": ["Verbatim Tina quotes from the transcript"],
  "frameworks": ["Four Currencies", "Three Revenue Models"],
  "action_steps": ["1. Do this", "2. Then this"],
  "case_studies": ["Sarah went from $8k to $22k in 4 months"],
  "module": "Revenue Architecture",
  "prerequisites": ["Understanding the Four Currencies"],
  "difficulty": "beginner",
  "estimated_time_to_internalize": "2 weeks of implementation",
  "next_teachings": ["Productizing Your Expertise"],
  "source_file_id": "uuid",
  "source_filename": "session-001.md",
  "created_at": "2026-03-21T12:00:00.000Z",
  "updated_at": "2026-03-21T12:00:00.000Z"
}
```

---

## Architecture

- **Framework:** Express + TypeScript
- **AI:** Claude API (streaming, configurable model)
- **DB:** SQLite via better-sqlite3 (WAL mode, auto-migrates)
- **Port:** 4002 (Sanitizer is 4001, CoachTinaMarie is 4003)
- **Tests:** 25 passing (Jest + supertest, mocked Claude)

---

## Environment Variables

| Variable | Default | Required |
|---|---|---|
| `ANTHROPIC_API_KEY` | — | ✅ |
| `CLAUDE_MODEL` | `claude-opus-4-5` | No |
| `PORT` | `4002` | No |
| `DB_PATH` | `data/db/wisdom.db` | No |
| `COACHTINA_URL` | — | No |
| `AUDIT_STORE_PROMPTS` | `false` | No |
| `AUDIT_STORE_RESPONSES` | `false` | No |

---

## Pipeline Integration

```bash
# 1. Sanitizer already ran — clean transcripts are in its output
# 2. POST each clean transcript to the extractor
curl -X POST http://localhost:4002/extract \
  -H "Content-Type: application/json" \
  -d '{"content": "'"$(cat clean-transcript.md)"'", "filename": "session-001.md"}'

# 3. When ready, sync to CoachTinaMarie
curl -X POST http://localhost:4002/teachings/sync \
  -H "Content-Type: application/json" \
  -d '{"target_url": "http://localhost:4003/teachings/ingest"}'
```

---

Built by Moriah — March 21, 2026.  
4.5 hours to revenue. Transcripts → Sanitizer → Extractor → CoachTinaMarie LIVE.
