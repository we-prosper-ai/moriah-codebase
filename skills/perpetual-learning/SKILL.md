---
name: perpetual-learning
description: How to use the Perpetual Learning System (PLS) — the pipeline that continuously takes in new external content, compares it against AntiGravity's capabilities, and surfaces actionable discoveries as Notion tasks. Use this skill when: submitting new content for comparison (Skool posts, Substack, articles, YouTube transcripts), checking the intake queue, understanding what the comparison engine looks for and how it classifies matches, or building on the PLS (adding new intake sources, improving the comparison logic). The PLS lives at PerpetualLearning/ and runs on port 7171.
---

# Perpetual Learning System

The PLS turns external AI content into actionable intelligence for the AntiGravity stack. It asks: *"Does the outside world know something we should act on?"*

**UI:** `http://localhost:7171` → 📥 Intake tab
**Project:** `/Users/alethea/Documents/AntiGravity/PerpetualLearning/`
**Start:** `cd PerpetualLearning && bun run src/server.ts`

---

## How the Pipeline Works

```
External Content (Skool / Substack / Article / YouTube)
         ↓
    📥 Intake Tab (paste or auto-fetch)
         ↓
    /api/external-content (stored in data/external-content.json)
         ↓
    Comparison Engine (src/comparison-engine.ts) [Phase 6]
         ↓
    Semantic search against capabilities table in Supabase
         ↓
    Classification: upgrade_available | new_tool | technique | not_relevant
         ↓
    Task Generator → Notion task created with context
         ↓
    Agent acts on task
```

---

## Submitting Content for Comparison

### Via UI (easiest)
1. Open `http://localhost:7171`
2. Click 📥 **Intake** tab
3. Select source chip (Skool / Substack / Article / Other)
4. Optional: add a title
5. Paste content → click **🧠 Submit for Comparison**

### Via API
```bash
curl -s -X POST http://localhost:7171/api/external-content \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Sam Altman on MCP — Substack 3/13",
    "source": "skool",
    "content": "Full text of the post here..."
  }'
```

### Check the queue
```bash
curl -s http://localhost:7171/api/external-content | python3 -m json.tool
```

---

## Content Statuses

| Status | Meaning |
|---|---|
| `pending` | Submitted, waiting for comparison engine to run |
| `processing` | Comparison engine is currently analyzing |
| `complete` | Discoveries extracted, Notion tasks created (if relevant) |
| `dismissed` | Reviewed, no relevant matches found |

---

## What the Comparison Engine Looks For *(Phase 6 — in progress)*

The engine sends content to Gemini with a structured prompt that extracts:
- Tool and API references (new versions, new features)
- Technique mentions (prompting strategies, architecture patterns)
- MCP server announcements
- New integrations relevant to our stack

Each extracted item is semantically matched against the `capabilities` table. Classifications:
- **`upgrade_available`** — We use this tool; a new version/feature exists
- **`new_tool`** — We don't have this but it works with something we use
- **`technique`** — A method that could improve something we already do
- **`not_relevant`** — No connection to our stack

Only the first three generate Notion tasks.

---

## YouTube Auto-Fetch

The PerpetualLearning server also serves as the YouTube transcript browser (port 7171). YouTube transcripts are fetched via yt-dlp and stored in `transcripts/`.

To trigger a fetch from the UI: click **↻ Fetch New & Update Views**

To activate the 6AM daily LaunchAgent (currently built but not activated):
→ See `PerpetualLearning/HANDOFF.md` for LaunchAgent setup instructions

---

## Data Storage

| File | Contents |
|---|---|
| `data/external-content.json` | Intake queue (pasted content + status) |
| `data/metadata-cache.json` | YouTube video metadata cache |
| `data/favorites.json` | Favorited videos and channels |
| `transcripts/` | Markdown transcript files organized by playlist |
| `config.json` | Playlist URLs and settings |
