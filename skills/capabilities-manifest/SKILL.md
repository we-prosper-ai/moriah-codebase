---
name: capabilities-manifest
description: How to maintain, update, and re-embed the CAPABILITIES_MANIFEST.md — the single source of truth for everything AntiGravity can do. Use this skill when: a new system, agent, tool, or API has been built or integrated, an existing capability has changed significantly, you need to check whether a capability already exists before building, or you need to re-embed the manifest after updates so the shared brain reflects current reality. Keeping this manifest accurate is what makes the Perpetual Learning System useful — stale capabilities = useless comparisons.
---

# Capabilities Manifest

The `CAPABILITIES_MANIFEST.md` file at the workspace root is the single source of truth for what AntiGravity can do. It feeds the shared brain's `capabilities` table via semantic embedding.

**File location:** `/Users/alethea/Documents/AntiGravity/CAPABILITIES_MANIFEST.md`

---

## When to Update

Update after ANY of these events:
- A new agent, tool, or integration is built or deployed
- An existing system changes significantly (new endpoints, new features)
- A capability is retired or replaced
- A new external API or service is connected

**Rule:** If the next agent searching the brain would get the wrong answer about what we can do, the manifest is out of date. Fix it.

---

## Manifest Structure

The manifest is organized into sections, each chunked and embedded separately:

| Section | What it covers |
|---|---|
| AI Agents | Alethea, Antigravity, Claude Code — what each does |
| Local Systems | Locally-running apps (PerpetualLearning, AiWebsiteArchitect, etc.) |
| External Services & APIs | All third-party integrations |
| Automation & Workflows | n8n, Make.com, scheduled tasks |
| Skills & Knowledge | Skills library, knowledge base |
| Infrastructure | Supabase, Railway, hosting |

---

## How to Update

### Step 1: Edit the manifest
Open `CAPABILITIES_MANIFEST.md` and find the relevant section. Add, modify, or remove entries. Keep each section as a markdown table or bullet list — no prose paragraphs. The structure is optimized for chunk-level embedding.

### Step 2: Re-embed after changes
Run the embedding script to push updates to the shared brain:

```bash
cd /Users/alethea/Documents/AntiGravity
bun run scripts/embed-capabilities.ts
```

This clears and re-embeds all chunks. Takes ~30 seconds.

### Step 3: Verify
```bash
curl -s "https://nrtfbajehxixsvvmddjo.supabase.co/functions/v1/agent-memory/search/capabilities" \
  -H "x-brain-key: antigravity-shared-brain-2026" \
  -H "Content-Type: application/json" \
  -d '{"query": "the thing you just added", "count": 2}'
```

Confirm your new capability appears in results.

---

## Environment Variables Required

The embed script needs:
```
SUPABASE_URL=https://nrtfbajehxixsvvmddjo.supabase.co
SUPABASE_SERVICE_KEY=<from FreedomBot/.env>
GOOGLE_AI_API_KEY=<from TheGraphicsAgent/.env>
```

These are already set in the project `.env` files. The embed script loads from `FreedomBot/.env` by default.

---

## What Good Entries Look Like

**Good (table row):**
```
| **PerpetualLearning** | Bun + browser | `PerpetualLearning/` | Intake pipeline for external content. Submits Skool/Substack/article text for comparison against capabilities. | ✅ Active |
```

**Bad (prose):**
> The PerpetualLearning system is a renamed version of the old YouTubeFetcher app that now also handles external content intake for the PLS comparison pipeline...

Tables and bullets embed with higher semantic precision than prose paragraphs.
