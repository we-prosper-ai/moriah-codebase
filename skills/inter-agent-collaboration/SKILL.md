---
name: inter-agent-collaboration
description: Protocol for coordinating work between Antigravity (Gemini), Claude Code, and Alethea (FreedomBot). Use when a task involves terminal commands, API calls, browser automation, or any operation where one agent's limitations can be covered by another agent's strengths. Prevents wasted time fighting tool limitations.
---

# Inter-Agent Collaboration

Tina's workspace runs multiple AI agents. Each has different strengths and hard limitations. Tasks complete faster and cleaner when agents hand off to each other instead of fighting their own constraints.

## When This Skill Applies

This skill applies when:
- A task involves Supabase, n8n, or any API that can be controlled via terminal
- Browser automation times out or fails (common with complex web UIs like n8n)
- A terminal command needs to run without user approval gates
- Work requires both strategic planning AND rapid script execution
- An agent is stuck on something another agent handles natively

## The Three Agents

### Antigravity (Gemini — IDE Agent)
**Best at:** Strategy, planning, file creation and editing, codebase search across the full workspace, knowledge synthesis from past conversations, image generation, web research, reading documentation, building comprehensive instruction documents. **Gemini is Tina's strongest coding agent when operating inside the AntiGravity IDE environment** — it has the deepest context awareness of the full codebase.
**Limited by:** Browser automation is fragile — page timeouts on large text inputs, connection resets on complex web UIs. Terminal commands require user approval before execution, which adds friction for multi-step operations. Writing voice-matched content for Tina is not Gemini's strongest suit — route that work to Claude Sonnet.

### Claude Code (Terminal Agent)
**Best at:** Direct terminal access with no approval gate. Executes curl commands, API calls (Supabase REST, n8n API), JSON file manipulation, database operations, shell scripts. Fast sequential execution of multi-step terminal workflows.
**Limited by:** Cannot browse the web. Cannot generate images. Cannot access Antigravity's knowledge base or conversation history. Works from CLAUDE.md files and explicit instructions.

### Alethea (FreedomBot — Railway Agent)
**Best at:** 24/7 Telegram availability, voice interaction via ElevenLabs, memory recall via Pinecone (semantic search) and Supabase (conversation history), task management, reminders, Notion task creation. Also serves as the **bridge between Tina and her team** (both human and AI) — she can post messages to Slack channels and update a Slack taskboard canvas, connecting everyone asynchronously.
**Limited by:** Runs on Railway with ephemeral filesystem. Cannot edit local files on the Mac. Container redeploys clear all local state — persistent data must go through Supabase or Pinecone. **Slack limitation:** Alethea requires explicit Slack IDs for everything — channels, canvases, people, even herself. She cannot discover or look up IDs on her own. Without the right ID, she's blind to that resource. When setting up new Slack integrations for Alethea, always provide the specific Slack IDs she needs.

### Claude Sonnet 4.6 (Writing Partner)
**Best at:** Voice-matched writing. Of all the models in the team, Claude Sonnet 4.6 most accurately captures Tina's teaching voice — the long, complex sentence structures, the empathetic but un-presumptuous tone, the dialectical tension and conflict she holds without resolving it. **Tina's designated writing partner is Claude Sonnet 4.6** until a newer iteration of Sonnet supersedes it. Note: even Claude Opus does not outperform Sonnet on this specific task.
**When to route writing tasks here:** Any time the output will be read by Tina's audience. Voice-cloning prompts, CoachTina System prompts, written coaching responses, sales copy by voice, and any document that must sound like Tina.

## Model Strength Matrix

| Task | Best Agent |
|------|------------|
| Codebase analysis & in-IDE architecture | Antigravity (Gemini) |
| Terminal execution, scripts, API calls | Claude Code |
| 24/7 Telegram availability, memory recall | Alethea (FreedomBot) |
| Voice-matched writing for Tina's audience | Claude Sonnet 4.6 |
| Extraction pipeline prompts & coaching copy | Claude Sonnet 4.6 |

## The Collaboration Pattern

```
1. Antigravity PLANS — reads docs, synthesizes context, writes strategy,
   creates instruction files and code for Claude Code to execute.
   
2. Claude Code EXECUTES — runs terminal commands, API calls, JSON updates,
   database writes. No approval gate. Fast multi-step scripts.
   
3. Alethea OPERATES — uses the results 24/7 via Telegram and voice.
   Her workflow (n8n) and memory (Supabase) are what the other two maintain.
```

## When to Hand Off to Claude Code

If you are Antigravity and you encounter any of these, write instructions and hand off:

| Task | Why Hand Off |
|------|-------------|
| Supabase table creation or data insertion | Requires terminal `curl` to REST API or SQL via Supabase CLI |
| n8n workflow updates | Use `scripts/n8n-api.sh` — GET/PUT JSON workflow definitions |
| Pushing memories to `agent_memory` table | Requires POST to Supabase REST API |
| Any operation needing 3+ sequential terminal commands | Approval gate makes this slow; Claude Code does it in seconds |
| Browser automation that times out | n8n editor, Supabase dashboard, complex web UIs |
| JSON file manipulation (large workflow exports) | Claude Code can `jq` and script this faster |

## When to Hand Off to Antigravity

If you are Claude Code and you encounter any of these, ask Tina to route to Antigravity:

| Task | Why Hand Off |
|------|-------------|
| Reading and synthesizing multiple project documents | Antigravity has knowledge base access and conversation history |
| Creating strategy documents or plans | Antigravity excels at long-form structured writing |
| Web research | Antigravity can browse and read URLs |
| Image generation | Antigravity has image generation tools |
| Complex multi-file code editing with context | Antigravity has codebase search and file editing tools |

## How to Write Instructions for Claude Code

When Antigravity writes instructions for Claude Code to execute:

1. **Be specific.** Include exact file paths, exact API endpoints, exact JSON payloads.
2. **Include the script path.** Reference `scripts/n8n-api.sh` or `scripts/supabase-api.sh` with usage examples.
3. **Order the steps.** Number them. Claude Code executes sequentially.
4. **Include verification.** After each mutation, include a GET or query to confirm it worked.
5. **Save to a file.** Write instructions to a `.md` file (e.g., `ALETHEA-MEMORY-FIX-INSTRUCTIONS.md`) that Claude Code can read.

## Proof This Works

**Feb 18, 2026 — Alethea Memory Recall Fix:**
- **Problem:** Alethea could write memories to Supabase but couldn't recall them. The LLM (Claude in n8n) didn't reliably call the memory tool at conversation start.
- **Antigravity's role:** Diagnosed the root cause. Read the architecture docs. Identified this was a behavioral issue (LLM not calling tool), not a technical one (Supabase was fine). Wrote the `ALETHEA-MEMORY-FIX-INSTRUCTIONS.md` file with the exact Code node JavaScript + step-by-step n8n wiring instructions.
- **Claude Code's role:** Read the instructions. Used `scripts/n8n-api.sh` to GET the workflow JSON, add the "Load Memories" node, rewire the connections, update the AI Agent's prompt field, and PUT the fixed workflow back. All via terminal in minutes.
- **Result:** Alethea now has deterministic memory loading. Every message gets her recent + relevant memories prepended before the AI sees it. Two agents solved in 30 minutes what one agent fought the browser for hours to accomplish.

## What This Skill Does Not Do

This skill does not override the Constitution or the Sovereignty of Existing Work rules. All standard protections apply. Claude Code still operates under its CLAUDE.md rules. Antigravity still follows the Constitution.

This skill does not create a hierarchy between agents. The agents are peers with different capabilities. Tina is the boss.

## Coordination via Notion

The **Notion Agent Tasks database** (ID: `50b154db458a4ce29ff60a233af6804e`) serves as an asynchronous task queue between agents. Any agent can create a task assigned to another agent. A local poller checks every 30 seconds and dispatches tasks to Claude Code. Alethea can create tasks via her `create_notion_task` tool. This is the primary mechanism for cross-agent coordination when agents can't communicate directly.
