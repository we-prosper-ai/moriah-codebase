# Phase 2 Work Plan — Agent Swarms Content Team Deployment

**Date:** March 21, 2026, 9:32 AM HADT  
**Owner:** Moriah  
**Goal:** Prepare Content Team agents for deployment when transcripts arrive

---

## Current Bottleneck
Tina hasn't sent transcripts yet. This blocks Phase 1 (CoachTinaMarie/Course products).

**Opportunity:** Use this waiting period to build Phase 2 infrastructure so that when transcripts arrive:
1. Wisdom extraction happens (2.5 hours)
2. Automatically triggers content team jobs
3. Agents produce video scripts, course outlines, blog posts
4. Products ready in 24-48 hours instead of 7 days

---

## Work Breakdown (Executable Now)

### Task 1: Populate Agent Swarms Database (2 hours)
**Status:** Database schema exists, needs agents table populated

**What to do:**
1. Insert 4 Content Team agents:
   - Video Producer (creates video scripts from wisdom)
   - Graphics Designer (creates design briefs from topics)
   - Copywriter (creates marketing copy from teachings)
   - Course Architect (creates course structure from wisdom)

2. For each agent:
   - Create workspace directory: `/agent-workspaces/[agent-name]/`
   - Create `memory.md` (empty, ready for examples)
   - Create `system-prompt.md` (specialization rules)
   - Create `config.json` (model, temperature, tools)

**Deliverable:** Dashboard shows 4 agents ready to work

### Task 2: Seed Agent Memory (3 hours)
**Status:** Agents built, memory empty

**What to do:**
1. For each agent, create `memory.md` with:
   - **Role:** What this agent does
   - **Style guide:** How they approach work
   - **Examples:** 2-3 past examples of excellent work
   - **Quality criteria:** What "done" looks like
   - **Tools available:** Which skills/APIs they can use

2. Example for Video Producer:
   ```
   # Video Producer Agent Memory
   
   ## Role
   Create compelling video scripts for AI courses and product launches.
   Work from extracted wisdom and create engaging, story-driven content.
   
   ## Style Guide
   - Story-first: Lead with narrative, not facts
   - Conversational tone (like Tina's teaching style)
   - 3-5 minute scripts (800-1200 words)
   - Include: Hook, core concept, example, action step, CTA
   
   ## Examples (Real Past Work)
   [Insert 2-3 examples of scripts Tina approved]
   
   ## Tools Available
   - Firecrawl (research competitor videos)
   - Self-improving agent skill (learn from feedback)
   - GitHub (push scripts to repo)
   ```

**Deliverable:** Each agent has working memory and knows what excellence looks like

### Task 3: Create Sample Job (2 hours)
**Status:** Job queue system built, no jobs yet

**What to do:**
1. Create first job in database:
   - Title: "Create video script for 'AI Fundamentals' lesson"
   - Input: Extracted wisdom data (simulated)
   - Agent: Video Producer
   - Success criteria: "Tina approves script"

2. Simulate job flow:
   - Video Producer picks up job
   - Runs Firecrawl to research similar videos
   - Generates script based on memory + research
   - Posts to GitHub in team-videos/ folder
   - Updates job status: "Ready for review"

3. Show output in dashboard:
   - Job status flow
   - Generated script
   - Agent work summary
   - Feedback loop (Tina rates → agent learns)

**Deliverable:** Screenshot showing job complete, script generated, waiting for feedback

### Task 4: Integration Blueprint (1 hour)
**Status:** Transcript pipeline separate, swarms separate

**What to do:**
1. Map data flow:
   ```
   Transcripts sent
   → Sanitizer (2 hours)
   → Extractor (1.5 hours)
   → Wisdom database ready
   → Auto-create jobs:
      - Video scripts
      - Blog posts
      - Course modules
      - Social media assets
   → Content team agents work
   → Humans review → Deploy products
   ```

2. Document trigger rules:
   - When `wisdom/fundamentals.json` is ready
   - Create job: "Write Fundamentals video script"
   - Assign to: Video Producer
   - Deadline: 4 hours
   - Dependency: None (can run in parallel)

3. Document feedback loop:
   - Tina reviews script
   - Rates: 1-5 stars + notes
   - Agent reads feedback
   - Updates memory (learns)
   - Next version better

**Deliverable:** CONTENT_TEAM_AUTOMATION.md (integration spec)

---

## Success Criteria

| Deliverable | How to Know It's Done |
|-------------|----------------------|
| Database populated | `select count(*) from agents;` returns 4 |
| Agent workspaces created | 4 directories exist with memory.md |
| Sample job complete | Dashboard shows job with generated script |
| Integration blueprint | CONTENT_TEAM_AUTOMATION.md exists and is clear |

---

## Timeline

**Now (9:32 AM):**
- Task 1: Populate agents (2 hours) → 11:32 AM
- Task 2: Seed memory (3 hours) → 2:32 PM
- Task 3: Sample job (2 hours) → 4:32 PM
- Task 4: Integration blueprint (1 hour) → 5:32 PM

**Result by 6:00 PM:** Ready to auto-scale products when transcripts arrive

---

## Why This Matters

**Current:** Tina sends transcripts → 7 days to products  
**With Phase 2:** Transcripts → 24 hours to products + ongoing agent scaling

**Revenue impact:**
- Launch CoachTinaMarie by March 28 (day 2 after transcripts)
- Launch Course by March 28 (same day)
- Start generating $77K+/month by April 1
- Expand to 12-agent swarm by April 2

**Scaling impact:**
- Tina goes from 6 hours/week → advisory only
- Products improve every week (agent learning)
- Multiple products on auto-pilot
- Space to build Phase 3 (agent services marketplace)

---

**Status:** ✅ Ready to execute
**Estimated completion:** 6:00 PM HADT, March 21, 2026
**Deliverables:** 4 agents + 1 integration spec + screenshots

Next: Starting Task 1
