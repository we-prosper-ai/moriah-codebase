# Daily Recap — Operational Memory & Accountability Protocol

**Type:** Encoded Preference (Workflow Enforcement)
**Trigger:** End of day operations, morning briefings, operational reviews
**Agent:** All agents (Claude Code executes, Alethea delivers, Antigravity reviews)

## Purpose

Maintain comprehensive daily operational memory and ensure accountability through automated synthesis of all work performed in the AntiGravity workspace. Delivers prioritized task reports to Tina each morning so she knows exactly what was accomplished and what requires attention.

## When This Skill Fires

- **Midnight PST (00:00)** — Automated data collection for the completed day
- **8:00 AM PST** — Delivery to Tina via Alethea (Slack/Telegram)
- **On-demand** — When any agent needs to generate a recap for a specific date
- **Weekly retrospectives** — Every Sunday for 7-day summary

## Core Protocol

### Data Sources (Priority Order)

1. **Session Ledgers** — Primary source of truth
   - `/Users/alethea/Documents/AntiGravity/00_SESSION_LEDGER.md`
   - `/Users/alethea/Documents/AntiGravity/initialize_engine/00_SESSION_LEDGER.md`
   - Extract: date, agent, scope, outcome, files changed, discoveries, blockers, ports

2. **Git Commits** — Code-level changes
   - All commits within the target date range
   - Extract: hash, author, timestamp, message

3. **Slack Activity** — Team communications (#agent-ops channel)
   - Extract: agent messages, task updates, blockers posted
   - Filter: System alerts, urgent items, completion announcements

4. **Notion Databases** — Structured task tracking (when MCP token valid)
   - Agent Tasks database
   - Project Tracker database
   - Extract: new tasks, status changes, assignments

### Required Fields in Recap

1. **Summary Stats**
   - Sessions logged
   - Git commits
   - Files changed
   - Outstanding tasks
   - Active blockers

2. **Work Completed**
   - Chronological list of all session entries
   - Scope, agent, outcome, files, discoveries
   - Blockers encountered and resolution status

3. **Git Activity**
   - All commits with hash and message
   - File change summary

4. **Outstanding Tasks** (Prioritized)
   - Critical (🔴)
   - High (🟠)
   - Medium (🟡)
   - Low (⚪)
   - Each with: description, assignee, source

5. **Suggested Order of Operations**
   - Top 5 tasks in recommended sequence
   - Based on priority, dependencies, and agent availability

### Execution

**Tool:** `scripts/daily-recap.ts`

**Usage:**
```bash
# Generate and send today's recap
tsx scripts/daily-recap.ts

# Preview without sending
tsx scripts/daily-recap.ts --preview

# Generate for specific date
tsx scripts/daily-recap.ts --date 2026-03-08
```

**Scheduling:**

The recap system runs automatically via macOS launchd:

1. **Data Collection (Midnight PST):**
   - Agent: Claude Code or Antigravity
   - Action: Verify all ledgers updated, git commits pushed
   - No message sent yet

2. **Morning Delivery (8am PST):**
   - Agent: Claude Code generates report
   - Delivery: Sent to #agent-ops in Slack for Alethea
   - Alethea: Forwards to Tina via Telegram with morning greeting

**LaunchAgent Config:** `~/Library/LaunchAgents/com.antigravity.daily-recap.plist`

### Format Standards

**Voice:** Professional, concise, factual
**Style:** Markdown with emoji indicators
**Length:** Comprehensive but scannable (use collapsible sections for long lists)
**Tone:** No superlatives, no praise, just facts and progress

### Integration Points

1. **AGENTS.md** — Establishes recap as part of multi-agent coordination
2. **CONSTITUTION.md** — Mandates daily recap as accountability mechanism
3. **SOUL.md** — Defines recap as how Alethea keeps Tina informed
4. **Session Ledger Protocol** — Recap depends on agents following ledger update rules

## Quality Standards

**MUST include:**
- ✅ All session entries for target date
- ✅ All git commits
- ✅ All outstanding tasks with assignments
- ✅ All active blockers
- ✅ Suggested prioritization

**MUST NOT include:**
- ❌ Speculation about incomplete work
- ❌ Tasks marked complete without verification
- ❌ Duplicate entries from multiple sources
- ❌ Unconfirmed issues or rumors

## Error Handling

**If session ledger missing:**
- ⚠️ Include warning in recap
- Fall back to git commits only
- Flag gap in operational memory

**If git access fails:**
- ⚠️ Include warning in recap
- Continue with ledger data
- Note incomplete picture

**If Slack connection fails:**
- ⚠️ Log warning
- Continue without Slack data
- Recap still sends

**If Notion MCP fails:**
- ⚠️ Log warning (known issue as of 2026-03-09)
- Continue without Notion data
- Do not block recap generation

## Success Criteria

✅ Tina receives recap by 8:00 AM PST every day
✅ Recap is comprehensive (all sources integrated)
✅ Tasks are correctly prioritized
✅ Blockers are clearly identified
✅ Suggested order is actionable
✅ Zero speculation — only verified facts
✅ Format is scannable and clear

## Related Skills

- [qa-protocol](/initialize_engine/.agent/skills/qa-protocol/SKILL.md) — Verification before completion
- [autonomy-first](/initialize_engine/.agent/skills/autonomy-first/SKILL.md) — Autonomous execution
- [inter-agent-collaboration](/initialize_engine/.agent/skills/inter-agent-collaboration/SKILL.md) — Multi-agent coordination

## Version History

- **2026-03-09** — Initial implementation (Claude Code)
- Created by: Tina's request for comprehensive daily reporting
- Status: Active, scheduled deployment pending
