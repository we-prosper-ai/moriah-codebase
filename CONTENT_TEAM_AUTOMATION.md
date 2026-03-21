# Content Team Automation — Complete Data Flow

**Date:** March 21, 2026, 9:42 AM HADT  
**Purpose:** Document how transcripts flow into agent jobs that produce content automatically  
**Status:** Blueprint ready for implementation

---

## End-to-End Data Flow

```
TRANSCRIPTS RECEIVED
    ↓
SANITIZER (Remove PII)
    └─→ Output: Clean transcripts
    ↓
EXTRACTOR (Identify Teachings)
    └─→ Output: wisdom/fundamentals.json
                wisdom/freedom.json
                wisdom/ai_skills.json
                wisdom/business_growth.json
    ↓
JOB TRIGGER (Watch wisdom folder)
    ├─→ Video scripts job created
    ├─→ Email sequences job created
    ├─→ Design briefs job created
    └─→ Course structure job created
    ↓
CONTENT TEAM AGENTS (Work in Parallel)
    ├─→ Video Producer reads wisdom
    │   └─→ Creates script (800-1200 words)
    ├─→ Copywriter reads wisdom
    │   └─→ Creates email sequence (5 emails)
    ├─→ Graphics Designer reads wisdom
    │   └─→ Creates design brief
    └─→ Course Architect reads wisdom
        └─→ Creates course structure
    ↓
OUTPUTS TO GITHUB
    ├─→ team-videos/fundamentals-script.md
    ├─→ team-copy/launch-emails.md
    ├─→ team-designs/landing-page-brief.md
    └─→ team-courses/ai-entrepreneur-structure.md
    ↓
STATUS UPDATE (Dashboard + Notification)
    └─→ Tina sees: "Content draft ready for review"
    ↓
TINA REVIEWS & RATES
    ├─→ Script: 4 stars + "Great hook! Adjust example."
    ├─→ Emails: 5 stars + "Perfect. Ready to send."
    ├─→ Design brief: 3 stars + "Too generic. Make it edgier."
    └─→ Course: 4 stars + "Add more hands-on practice."
    ↓
AGENTS LEARN & ITERATE
    ├─→ Video Producer updates memory with feedback
    ├─→ Copywriter studies 5-star emails
    ├─→ Designer refines brand direction
    └─→ Architect increases practice exercises
    ↓
NEXT VERSION BETTER
    └─→ Cycle repeats with improved quality
```

---

## Trigger Rules

### When Wisdom Database Is Ready

**Trigger:** File created: `/wisdom/fundamentals.json`

**Action:** Create jobs for this topic

```json
{
  "topic": "Fundamentals",
  "wisdom_file": "wisdom/fundamentals.json",
  "jobs": [
    {
      "agent": "video_producer",
      "title": "Write video script: Fundamentals",
      "input": "wisdom/fundamentals.json",
      "requirements": [
        "Story-first hook",
        "Explain core concept clearly",
        "Include real example",
        "Action step for viewer",
        "Clear CTA"
      ],
      "success_criteria": "Tina approves script OR provides specific feedback",
      "deadline_hours": 4,
      "priority": "high"
    },
    {
      "agent": "copywriter",
      "title": "Write email sequence: Fundamentals launch",
      "input": "wisdom/fundamentals.json",
      "requirements": [
        "5-email launch sequence",
        "Day 1: Problem identification",
        "Day 2: Solution intro",
        "Day 3: Proof & testimonials",
        "Day 4: Objection handling",
        "Day 5: Final CTA"
      ],
      "success_criteria": "Emails convert at >25% open rate",
      "deadline_hours": 3,
      "priority": "high"
    },
    {
      "agent": "graphics_designer",
      "title": "Create design brief: Landing page",
      "input": "wisdom/fundamentals.json",
      "requirements": [
        "Homepage + product page layout",
        "Visual asset specifications",
        "Color palette and typography",
        "Icon and image descriptions",
        "Accessibility checklist"
      ],
      "success_criteria": "Designer can execute from brief without questions",
      "deadline_hours": 4,
      "priority": "medium"
    },
    {
      "agent": "course_architect",
      "title": "Design course: AI Fundamentals",
      "input": "wisdom/fundamentals.json",
      "requirements": [
        "5-7 modules",
        "3-4 lessons per module",
        "Clear learning outcomes",
        "Mix of video + exercises",
        "Capstone project"
      ],
      "success_criteria": "Tina reviews and approves structure",
      "deadline_hours": 6,
      "priority": "high"
    }
  ]
}
```

---

## Feedback Loop

### How Tina Rates Content

**Step 1: Content Review**

After agents create draft:
1. Tina opens PR on GitHub
2. Reviews content
3. Rates: ⭐ to ⭐⭐⭐⭐⭐
4. Adds comments: "What to improve"

**Example feedback:**
```markdown
## Video Script Review

⭐⭐⭐⭐ (4/5)

### What Worked
- Hook is compelling ("Have you ever felt...")
- Example is specific and relatable
- Action step is clear

### What to Improve
- Core concept could be simpler
- Two tangents dilute main message
- CTA could be stronger

### Next Version
- Simplify explanation in middle
- Cut the tangent about competitors
- End with "Ready? Let's build."
```

**Step 2: Agent Learning**

Agent reads feedback and updates memory:
1. Reads Tina's rating + comments
2. Updates `/agent-workspaces/content/[agent]/memory.md`
3. Adds to "Examples of Excellent Work" section
4. Notes what she loved, what to improve
5. Next job uses this learning

**Example agent update:**
```markdown
### Example 3: AI Fundamentals Script
- Source: Transcript #XXX + wisdom/fundamentals.json
- Feedback from Tina: ⭐⭐⭐⭐
- What she loved:
  - "Hook is compelling" → Use question-based openings
  - "Example is specific" → Always include numbers/names
  - "Action step is clear" → Tell them exactly what to do
- What to improve:
  - "Simplify explanation" → Max 2 concepts per script
  - "Avoid tangents" → Cut anything that's not essential
  - "Stronger CTA" → End with action, not suggestion
- Pattern: Story + Simple concept + Specific example + Clear action
```

**Step 3: Iteration**

1. Agent creates version 2 based on feedback
2. Tina re-reviews
3. If ⭐⭐⭐⭐⭐: Ready to publish
4. If less: Agent iterates again
5. Repeat until excellence

---

## Integration Implementation

### Phase 1: Transcript Sanitizer (Existing)
- **Status:** Built, tested, ready
- **Input:** Raw transcripts (any format)
- **Output:** `/transcripts/clean/[filename].txt`
- **Audit:** `/transcripts/audit/[filename]-audit.json`

### Phase 2: Wisdom Extractor (Existing)
- **Status:** Built, tested, ready
- **Input:** Clean transcripts
- **Output:** 
  - `/wisdom/[topic].json` (structured)
  - `/wisdom/[topic].md` (readable)
  - `/wisdom/index.json` (cross-references)

### Phase 3: Job Trigger (To Be Built)
- **Status:** Design complete, ready to code
- **What it does:**
  1. Watches `/wisdom/` folder
  2. On new .json file: Read topic + themes
  3. Create 4 jobs (video, email, design, course)
  4. Insert into job queue
  5. Notify content team

**Implementation:** 
- Shell script: `bin/trigger-content-jobs.sh`
- Cron: Every 5 minutes watch for new wisdom
- Log: `/logs/job-trigger.log`

### Phase 4: Agent Job Execution (Existing Foundation)
- **Status:** Infrastructure built, agents ready
- **What happens:**
  1. Agent sees new job in queue
  2. Reads job requirements
  3. Reads wisdom input file
  4. Runs specialization protocol
  5. Generates draft
  6. Commits to GitHub branch
  7. Creates PR with draft
  8. Updates job status: "Ready for review"

### Phase 5: Quality Feedback (Manual → Automated)
- **Status:** Manual feedback ready, auto-learning planned
- **Step 1 (Manual):**
  1. Tina reviews PR on GitHub
  2. Rates and comments
  3. Merges if approved

- **Step 2 (Automated):**
  1. Agent polls GitHub for feedback
  2. Reads PR comments
  3. Updates memory.md with patterns
  4. Adjusts system prompt if needed
  5. Self-improving cycle

---

## Timeline: Transcript to Live Products

### Scenario: Tina sends transcripts on Day 1, 9:00 AM

```
Day 1: 9:00 AM - Transcripts received
Day 1: 9:00-11:00 AM - Sanitizer runs (2 hours)
Day 1: 11:00 AM-12:30 PM - Extractor runs (1.5 hours)
                            ↓
Day 1: 12:30 PM - Wisdom database ready
                   Job trigger fires
                   4 agents assigned jobs
                   ↓
Day 1: 12:30-4:30 PM - Agents work (4 hours parallel)
                        Video: Script complete
                        Email: Sequence complete
                        Design: Brief complete
                        Course: Structure complete
                        ↓
Day 1: 4:30 PM - Drafts posted to GitHub
                 Dashboard shows "Ready for review"
                 Tina notified
                 ↓
Day 1: 4:30-6:00 PM - Tina reviews & provides feedback
                      ↓
Day 2: 6:00 AM - Agents read feedback (auto)
Day 2: 6:00-10:00 AM - Agents iterate (4 hours)
Day 2: 10:00 AM - Version 2 ready for review
Day 2: 10:00-11:00 AM - Tina final review
Day 2: 11:00 AM - LIVE: Products launch
                  CoachTinaMarie available
                  AI Entrepreneur Course available
                  Blog posts published
                  ↓
Day 2: 11:00 AM+ - Revenue starts
                   $77K+/month potential active
```

**Total turnaround: ~26 hours from transcript receipt to live products**

---

## Automation Opportunities (Future)

### Level 1: Job Trigger (Ready Now)
- Watch wisdom folder
- Create jobs automatically
- Route to right agent

### Level 2: Quality Thresholds (Ready for Phase 2)
- Automated quality scoring
- If score < 3.5 stars: Auto-revise
- If score > 4 stars: Auto-approve

### Level 3: Multi-Variant Generation (Ready for Phase 2)
- Agent creates 3 versions automatically
- Tina picks best
- Others become A/B test variants

### Level 4: Cross-Product Coordination (Phase 3)
- Course outline feeds into email sequence
- Email sequence feeds into social media posts
- Blog posts pull from course structure
- All coordinated by job dependencies

---

## Files to Create

### Now (Ready to Build)
1. `bin/trigger-content-jobs.sh` — Job creation script
2. `config/job-templates.json` — Job definitions
3. `config/trigger-rules.json` — When to trigger what jobs

### When PostgreSQL is Running
4. SQL migrations for job queue

### When Agents are Live
5. `scripts/auto-feedback-parser.js` — Read Tina's GitHub comments, extract feedback
6. `scripts/agent-memory-updater.js` — Update agent memory from feedback
7. `scripts/quality-scorer.js` — Score agent output, auto-revise if needed

---

## Success Metrics

| Metric | Target | Current |
|--------|--------|---------|
| Time from wisdom ready to jobs created | <5 min | TBD |
| Time for agents to complete drafts | <4 hours | TBD |
| Tina approval rate (first version) | >50% | TBD |
| Tina approval rate (after iteration) | >90% | TBD |
| Agent quality improvement per iteration | +0.5 stars | TBD |
| Products launched | Week 1: 2 products | Pending |

---

## Questions for Tina

1. **Feedback preferences:** Where should Tina review content?
   - Option A: GitHub PRs (our current setup)
   - Option B: Dashboard UI (needs development)
   - Option C: Notion database (Tina's preference)

2. **Approval workflow:** Auto-publish after approval?
   - Option A: Manual final publish (safe, but extra step)
   - Option B: Auto-publish when >4 stars (fast, risk)
   - Option C: Auto-draft, manual approval (current plan)

3. **Iteration limit:** How many rounds of revision?
   - Option A: Unlimited (quality-focused)
   - Option B: Max 3 rounds (efficiency-focused)
   - Option C: Depends on quality score (adaptive)

4. **Priority order:** Which products first?
   - Option A: CoachTinaMarie (recurring revenue)
   - Option B: AI Entrepreneur Course (one-time revenue)
   - Option C: Both parallel (maximum value)

---

**Status:** Blueprint complete ✅  
**Next:** Implement job trigger script when PostgreSQL available  
**Deadline:** Ready by time transcripts arrive

---

*Document created by: Moriah*  
*Part of: Phase 2 Agent Swarms Implementation*  
*Purpose: Enable automated content production at scale*
