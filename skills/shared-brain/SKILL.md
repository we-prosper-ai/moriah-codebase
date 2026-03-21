---
name: shared-brain
description: How to read from and write to the AntiGravity shared brain — the Supabase-hosted vector memory system that all agents share. Use this skill whenever you need to: search past session history for context before starting work, search system capabilities before building something that might already exist, write a session entry to the brain after completing work, or check brain statistics. This is the persistent memory layer that connects Antigravity, Claude Code, and Alethea across all sessions.
---

# Shared Brain

The AntiGravity shared brain is a Supabase Edge Function backed by pgvector. It is cloud-hosted, always awake, and accessible from anywhere — Railway, terminal, IDE agent, browser.

**Base URL:** `https://nrtfbajehxixsvvmddjo.supabase.co/functions/v1/agent-memory`
**Auth:** Header `x-brain-key: antigravity-shared-brain-2026` OR query param `?key=antigravity-shared-brain-2026`

---

## Endpoints

| Endpoint | Method | Auth | Purpose |
|---|---|---|---|
| `/health` | GET | None | Verify brain is awake |
| `/search/capabilities` | POST | Yes | Semantic search: what can we do? |
| `/search/sessions` | POST | Yes | Semantic search: what has happened? |
| `/write/session` | POST | Yes | Store a new session memory |
| `/recent/sessions` | GET | Yes | List most recent sessions |
| `/stats` | GET | Yes | Brain statistics |

---

## How to Use Each Endpoint

### Health check (no auth required)
```bash
curl -s "https://nrtfbajehxixsvvmddjo.supabase.co/functions/v1/agent-memory/health"
```

### Search capabilities — ask "can we already do X?"
```bash
curl -s "https://nrtfbajehxixsvvmddjo.supabase.co/functions/v1/agent-memory/search/capabilities" \
  -H "x-brain-key: antigravity-shared-brain-2026" \
  -H "Content-Type: application/json" \
  -d '{"query": "Telegram bot with voice and memory", "count": 3}'
```

### Search sessions — ask "what happened with X recently?"
```bash
curl -s "https://nrtfbajehxixsvvmddjo.supabase.co/functions/v1/agent-memory/search/sessions" \
  -H "x-brain-key: antigravity-shared-brain-2026" \
  -H "Content-Type: application/json" \
  -d '{"query": "perpetual learning system deployment", "count": 3}'
```

### Write a session entry — required at end of every session
```bash
curl -s "https://nrtfbajehxixsvvmddjo.supabase.co/functions/v1/agent-memory/write/session" \
  -H "x-brain-key: antigravity-shared-brain-2026" \
  -H "Content-Type: application/json" \
  -d '{"content": "Built X, fixed Y, discovered Z", "date": "2026-03-13", "agent": "Antigravity (Gemini)"}'
```

Or use the bash script (faster, handles escaping):
```bash
scripts/embed-session.sh "Summary of what happened" "AgentName"
```

### Recent sessions — see what happened lately
```bash
curl -s "https://nrtfbajehxixsvvmddjo.supabase.co/functions/v1/agent-memory/recent/sessions?limit=5&key=antigravity-shared-brain-2026"
```

---

## Mandatory Session Protocol

**Before starting work:** Run a session search for your task area. Example: if fixing a timezone bug, search `"timezone calendar FreedomBot"`. This surfaces prior decisions so you don't repeat them.

**After completing work:** Write your session summary to the brain. This is step 3 of the Dual-Logging Rule (AGENT_START.md §11). It is not optional.

**Before building anything new:** Search capabilities for the thing you're about to build. If it already exists, extend it — don't duplicate it.

---

## Infrastructure Notes

- **Embedding model:** Google `gemini-embedding-001` (3072 dimensions)
- **Tables:** `capabilities` (what we can do), `session_entries` (what has happened)
- **Functions:** `match_capabilities()`, `match_session_entries()` — cosine similarity
- **Project:** `nrtfbajehxixsvvmddjo` (Supabase Pro)
- **Scripts:** `scripts/embed-capabilities.ts`, `scripts/embed-ledger-entry.ts` (local Bun scripts for backfill)
