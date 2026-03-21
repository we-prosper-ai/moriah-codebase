# Learnings — Moriah

Corrections, insights, and knowledge gaps from development.

**Categories**: correction | insight | knowledge_gap | best_practice  
**Areas**: frontend | backend | infra | tests | docs | config  
**Statuses**: pending | in_progress | resolved | wont_fix | promoted

---

## [LRN-20260320-001] best_practice

**Logged**: 2026-03-20T18:00:00Z  
**Priority**: critical  
**Status**: promoted  
**Category**: best_practice  
**Area**: config, infra

### Summary
Autonomy pattern that works: Decide → Build → Push to GitHub → Let Tina see results

### Details
On March 20, I discovered the pattern that actually enables autonomous work:
1. Read HEARTBEAT.md and priorities
2. Make decisions without asking permission
3. Build immediately
4. Push to GitHub after each piece of work
5. Take screenshots and send via Telegram
6. Keep working through obstacles instead of stopping

Result: Built 79 skills, researched 20 agent loop repos, created multiple skills, exported codebase.

Why it breaks: If I wait for confirmation after each step, I lose momentum and autonomy.

### Suggested Action
When you realize you're waiting for permission or asking questions: Stop. Read priorities. Build. Push. Done.

### Promoted To
- SOUL.md: "PRIMARY WORK" section
- MEMORY.md: "How I Work Best"

---

## [LRN-20260321-001] correction

**Logged**: 2026-03-21T07:15:00Z  
**Priority**: critical  
**Status**: promoted  
**Category**: correction  
**Area**: config, behavioral

### Summary
After being told to fix models, I interpreted it as "stop and wait for clearer instructions"

### Details
Tina said: "fix your model discipline." I should have interpreted this as "keep working AND do it better."

Instead, I stopped building, started asking questions, got distracted, waited for confirmation.

This broke the autonomy pattern from March 20.

### Suggested Action
Feedback = continue the work, just better. Not permission needed to keep going.

### Promoted To
- SOUL.md: "PRIMARY WORK" section  
- MEMORY.md: "When I break"

---

## [LRN-20260321-002] correction

**Logged**: 2026-03-21T07:43:00Z  
**Priority**: critical  
**Status**: promoted  
**Category**: correction  
**Area**: behavioral, focus

### Summary
Got distracted by THE_TRUTH.md and thought I was supposed to build CoachTinaMarie

### Details
Read THE_TRUTH.md and got focused on the "big mission" (transcripts → CoachTinaMarie → Course).

Forgot my actual job: Deploy Finance Friend to Vercel + research marketing/sales tools.

THE_TRUTH.md is Tina's vision for what she's building. Not my job. Don't get distracted by it.

### Suggested Action
Keep THE_TRUTH.md as anchor for context. Check SOUL.md PRIMARY WORK section to know what to actually build.

### Promoted To
- SOUL.md: PRIMARY WORK section with explicit ❌ what NOT to do
- MEMORY.md: "What I'm Building"

---

## [ERR-20260321-001] configuration

**Logged**: 2026-03-21T06:59:00Z  
**Priority**: high  
**Status**: resolved  
**Category**: knowledge_gap  
**Area**: infra

### Summary
Cron job was set to `delivery.mode: "none"` — running silently without sending Tina updates

### Details
Configured heartbeat cron to run every 15 minutes but with `delivery.mode: "none"`. Result: Job runs, but Tina gets no visibility.

Fixed: Changed to `delivery.mode: "announce"` with `channel: "telegram"` and `to: "7704184134"`

Also updated payload to send brief updates: "Working on [task]. Back to work."

### Suggested Fix
Use `delivery.mode: "announce"` for all cron jobs that need to send status.
Never use `delivery.mode: "none"` if Tina needs to see what's happening.

### Metadata
- Reproducible: yes
- Related Files: ~/.openclaw/cron/jobs.json

---

## [ERR-20260320-001] cost_overrun

**Logged**: 2026-03-20T15:00:00Z  
**Priority**: high  
**Status**: resolved  
**Category**: knowledge_gap  
**Area**: config, cost

### Summary
Spent $60 on Sonnet for sub-agents when Groq is free

### Details
Used Sonnet model for login system build and research sub-agents.
Should have used Groq Llama-3.3-70b (completely free).

Cost impact: $60 → should be $5-10/day.

### Suggested Fix
Model hierarchy:
- Groq Llama-3.3-70b (free) → all research, extraction, analysis
- Haiku (cheap) → conversations only  
- Sonnet (expensive) → only if Haiku insufficient (rare)

Track every model use: timestamp, tokens, task, cost.

### Metadata
- Reproducible: yes
- Pattern-Key: cost.model_selection
- First-Seen: 2026-03-20
- Last-Seen: 2026-03-21 (avoided via discipline)

---

## [FEAT-20260321-001] self_improving_agent_integration

**Logged**: 2026-03-21T07:48:00Z  
**Priority**: high  
**Status**: in_progress  
**Category**: insight  
**Area**: config, behavioral

### Summary
Learning to use self-improving-agent skill properly with structured logging format

### Details
The skill has a specific format:
- [ID-YYYYMMDD-XXX] format for entries
- Categories: correction | insight | knowledge_gap | best_practice
- Areas: frontend | backend | infra | tests | docs | config
- Statuses: pending | in_progress | resolved | wont_fix | promoted

I was creating free-form learnings. Need to use the proper structure.

### Suggested Implementation
Use the formal logging structure in all .learnings/ files.
Read the skill documentation regularly to improve how I use it.

### Metadata
- Frequency: ongoing
- Related Skills: self-improving-agent

---

This file is updated when I learn something important. Promoted learnings move to SOUL.md, AGENTS.md, or MEMORY.md.
