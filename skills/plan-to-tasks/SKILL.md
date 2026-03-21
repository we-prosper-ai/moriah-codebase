---
name: plan-to-tasks
description: >
  Converts a planning conversation into a structured implementation plan, Notion
  task pages, and an architecture diagram. Use when the user says "create tasks
  from this plan", "formalize this plan", "/plan-to-tasks", "turn this into tasks",
  "post this to Notion", or when a planning conversation has reached conclusions
  that need to be tracked for execution. Also use when the user asks "what's the
  plan" and expects a structured output with task tracking.
---

# Plan to Tasks

Convert planning conversations into tracked, executable task lists with architecture diagrams.

## When to Use This Skill

- User says `/plan-to-tasks` or "formalize this plan"
- User says "create tasks" or "turn this into tasks"
- User says "post this to Notion" after a planning conversation
- A planning conversation has produced clear conclusions and next steps
- The user wants to transition from "talking about it" to "tracking it"

## Prerequisites

Before executing, verify:

- [ ] Notion MCP is available (test with a search call)
- [ ] Agent Tasks database ID is `50b154db458a4ce29ff60a233af6804e`
- [ ] The planning conversation has produced actionable conclusions (not still brainstorming)

If Notion MCP is NOT available:
1. Generate the implementation plan and save as markdown artifact
2. Generate the task list as a markdown checklist
3. Tell the user honestly: "Notion MCP isn't connected — here's the plan as a file. An agent with Notion access can post these tasks later."

---

## Workflow

### Phase 1: Extract the Plan

Review the current conversation and extract:

1. **Project name** — what is being built?
2. **Goal** — what does success look like?
3. **Components** — what are the major pieces?
4. **Dependencies** — what must happen before what?
5. **Decisions made** — what has Tina already decided?
6. **Open questions** — what still needs Tina's input?

### Phase 2: Write the Implementation Plan

Create a markdown artifact in the project directory with this structure:

```markdown
# [Project Name] — Implementation Plan

> Created: [DATE]
> Author: Antigravity (Session with Tina)
> Status: Approved / Pending Approval

## Goal
[One paragraph: what does success look like?]

## Architecture
[Text description of the system components and how they connect]

## Phases
### Phase 1: [Name]
- [Task 1.1]
- [Task 1.2]

### Phase 2: [Name]
- [Task 2.1]
- [Task 2.2]

## Open Questions
- [Question needing Tina's input]

## Decisions Made
- [Decision and rationale]
```

Save to: `[project_directory]/implementation_plan.md`

### Phase 3: Decompose into Tasks

Break the plan into individual tasks. Each task must be:

- **Atomic**: one clear deliverable per task
- **Assignable**: clear which agent should do it
- **Estimable**: rough effort estimate
- **Sequenceable**: dependencies identified

#### Task Decomposition Checklist

For each task, determine:

- [ ] **Title**: Clear, action-oriented (verb + noun). Max 80 chars.
- [ ] **Agent**: Who executes this? Options:
  - `Antigravity` — planning, research, skill creation, UI design, documentation
  - `Claude Code` — backend code, scripts, API work, deployments, git operations
  - `Alethea` — user-facing operations, Telegram interactions, monitoring
  - `Either` — simple tasks any agent can handle
- [ ] **Type**: How to execute? Options:
  - `Autonomous` — agent can execute immediately without approval
  - `Review Required` — agent writes a plan, Tina approves before execution
- [ ] **Project**: Which project this belongs to
- [ ] **Phase**: Which phase of the implementation plan
- [ ] **Dependencies**: Which tasks must complete first (by task number)
- [ ] **Estimated Effort**: `10 min`, `30 min`, `1 hr`, `2 hrs`, `4 hrs`, `8 hrs`, `Multi-session`
- [ ] **Priority**: `P0` (now), `P1` (this week), `P2` (this month), `P3` (backlog)
- [ ] **Context**: Any additional information the executing agent needs

#### Task Sizing Rules

- If a task takes > 4 hours, split it into subtasks
- If a task has unclear scope, mark it as `Review Required` regardless of type
- If a task depends on a decision Tina hasn't made, mark it as `P3` (backlog) until decided
- If a task is pure code with clear specs, mark it as `Autonomous`
- If a task changes user-facing behavior or architecture, mark it as `Review Required`

### Phase 4: Present for Approval

Before posting anything to Notion, present the complete task list to Tina:

```
## Tasks Ready for Notion

| # | Task | Agent | Type | Phase | Effort | Priority | Dependencies |
|---|------|-------|------|-------|--------|----------|--------------|
| 1 | ... | ... | ... | ... | ... | ... | — |
| 2 | ... | ... | ... | ... | ... | ... | Task 1 |

**Open questions:** [list any]
**Total tasks:** [N]
**Estimated total effort:** [sum]

Shall I post these to Notion?
```

**CRITICAL: Do not post tasks to Notion without Tina's explicit approval.** This is a `Review Required` pattern. Present. Wait. Execute only on approval.

### Phase 5: Post to Notion

Once Tina approves, create a Notion page for each task using the MCP API:

```
For each task, call mcp_notion_API-post-page with:

parent: { database_id: "50b154db458a4ce29ff60a233af6804e" }
properties:
  Task:     { title: [{ text: { content: "[TASK_TITLE]" } }] }
  Status:   { select: { name: "Pending" } }
  Agent:    { select: { name: "[AGENT]" } }
  Type:     { select: { name: "[TYPE]" } }
  Context:  { rich_text: [{ text: { content: "[CONTEXT]" } }] }
```

If the database has the enhanced properties (Project, Phase, Priority, etc.), also set:
```
  Project:          { select: { name: "[PROJECT_NAME]" } }
  Phase:            { select: { name: "[PHASE]" } }
  Priority:         { select: { name: "[PRIORITY]" } }
  Estimated Effort: { select: { name: "[EFFORT]" } }
  Dependencies:     { rich_text: [{ text: { content: "[DEP_TASK_IDS]" } }] }
```

#### Posting Protocol
1. Post tasks in dependency order (tasks with no dependencies first)
2. After posting each task, record the Notion page ID
3. For tasks with dependencies, include the Notion page IDs of the dependency tasks in the Dependencies field
4. After all tasks are posted, report the complete list with Notion page IDs to Tina

### Phase 6: Generate Architecture Diagram

After tasks are posted, generate an architecture diagram using the `infographic` skill:

1. **Load the infographic skill**: Read `initialize_engine/.agent/skills/infographic/SKILL.md`
2. **Choose the best available tool** using the infographic skill's decision tree
3. **Generate a diagram** showing the project's component architecture
4. **Save** to the project directory as `architecture_diagram.[ext]`
5. **Link** the diagram URL in each Notion task's Diagram Link field (if available)

### Phase 7: Report Completion

After all phases complete, report to Tina:

```
## Plan Formalized ✓

**Implementation plan:** [link to file]
**Tasks posted:** [N] tasks to Notion Agent Tasks board
**Architecture diagram:** [link to file or description]

### Task Summary
- [N] tasks assigned to Antigravity
- [N] tasks assigned to Claude Code  
- [N] tasks assigned to Either
- [N] tasks require review before execution
- [N] tasks are autonomous

### What Happens Next
1. notion-poller.py will pick up Claude Code tasks every 30 seconds
2. Antigravity will pick up its tasks at next session start
3. Tasks with dependencies will wait until prerequisites complete
4. You can view progress in Notion filtered by Project: [PROJECT_NAME]
```

---

## Verification (QA Protocol)

### After Phase 2 (Plan Written)
- [ ] Implementation plan file exists at the expected path
- [ ] Plan contains all sections: Goal, Architecture, Phases, Open Questions, Decisions
- [ ] Plan accurately reflects the conversation conclusions (no hallucinated requirements)

### After Phase 4 (Approval)
- [ ] Tina has explicitly said "yes", "approved", "post them", or equivalent
- [ ] All open questions have been flagged (not silently dropped)
- [ ] Task count and effort estimates have been presented

### After Phase 5 (Notion Posted)
- [ ] Each task returned a valid Notion page ID (no API errors)
- [ ] Verify at least one task by retrieving it: `mcp_notion_API-retrieve-a-page`
- [ ] Dependencies reference correct page IDs (not task numbers from the plan)
- [ ] Status is "Pending" for all tasks (not "Processing" or "Complete")

### After Phase 6 (Diagram Generated)
- [ ] Diagram file exists at the expected path
- [ ] Diagram accurately represents the architecture described in the plan
- [ ] Labels are legible and connections are correct

### After Phase 7 (Report)
- [ ] Report includes links to actual files (not placeholder paths)
- [ ] Task counts match what was posted (cross-check with Notion)
- [ ] "What Happens Next" section is accurate for the current infrastructure state

---

## Error Handling

### Notion MCP Not Connected
Generate everything locally. Save implementation plan, task list (as markdown), and diagram. Tell Tina honestly: "Notion isn't connected. Here's everything as files. Post to Notion when connection is restored."

### Notion API Returns Error on Task Creation
1. Log the error and the task that failed
2. Continue posting remaining tasks
3. Report which tasks failed and why
4. Offer to retry failed tasks

### Infographic Tool Not Available
Skip diagram generation. Note in the report: "Architecture diagram deferred — no diagram tool available this session. Will generate at next opportunity."

### Conversation Has No Clear Conclusions
Do not fabricate tasks. Tell Tina: "This conversation is still in brainstorming phase. Here's what I've captured so far — want to continue planning, or formalize what we have?"

---

## Integration Points

### With `infographic` Skill
Phase 6 uses the infographic skill for diagram generation. Load that skill when you reach Phase 6.

### With `notion-poller.py`
Tasks posted with `Agent: Claude Code` and `Type: Autonomous` will be picked up by the poller within 30 seconds. Tasks with `Type: Review Required` will create Tele_ files for Claude Code to review at next session.

### With `visual-architecture-mapping` Skill
For complex architecture discussions, the visual-architecture-mapping skill should be used DURING the planning conversation (Phase 1). The plan-to-tasks skill then produces the TRACKING artifacts (plan + tasks + diagram) AFTER the planning conversation concludes.

### With AGENT_START Section 9
Agents checking their Notion inbox at session start will see the tasks posted by this skill. The existing inbox protocol handles task pickup, processing, and completion reporting.

---

## Example Output

### Task Table (Phase 4)

| # | Task | Agent | Type | Phase | Effort | Priority | Deps |
|---|------|-------|------|-------|--------|----------|------|
| 1 | Set up project directory and initialize git | Claude Code | Autonomous | Foundation | 10 min | P0 | — |
| 2 | Design database schema for user accounts | Antigravity | Review Required | Foundation | 1 hr | P0 | — |
| 3 | Implement database schema in PostgreSQL | Claude Code | Autonomous | Building | 30 min | P1 | 2 |
| 4 | Build REST API endpoints for user CRUD | Claude Code | Autonomous | Building | 2 hrs | P1 | 3 |
| 5 | Design frontend UI mockups | Antigravity | Review Required | Building | 2 hrs | P1 | 2 |
| 6 | Implement frontend React components | Claude Code | Autonomous | Building | 4 hrs | P1 | 4, 5 |
| 7 | Write integration tests | Claude Code | Autonomous | Testing | 2 hrs | P2 | 6 |
| 8 | Deploy to Railway | Claude Code | Review Required | Deploy | 30 min | P2 | 7 |
