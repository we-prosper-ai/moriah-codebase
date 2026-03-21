# 20 Repos for Self-Activating Agent Loop + Prioritization

> Research compiled: March 20, 2026 | Sources: GitHub, verified via live searches

---

## The Full Table

| # | Repo | Stars | Language | Last Updated | What It Does | Relevance to Moriah's Loop |
|---|------|-------|----------|--------------|--------------|---------------------------|
| 1 | [Significant-Gravitas/AutoGPT](https://github.com/Significant-Gravitas/AutoGPT) | ~170k | Python | Active (2026) | Platform for continuous AI agents that automate complex workflows; includes built-in task prioritization agent | The OG. Autonomous loop + task prioritization baked in from day one. Blueprint for everything that followed. |
| 2 | [microsoft/autogen](https://github.com/microsoft/autogen) | ~55.9k | Python | Active (2026) | Multi-agent conversation framework; async event-driven architecture for concurrent task handling | Multi-agent loops with human-in-the-loop escape hatch. Good for understanding how agents hand off work between each other. |
| 3 | [crewAIInc/crewAI](https://github.com/crewAIInc/crewAI) | ~46.7k | Python | Active (Mar 2026) | Orchestrates role-playing AI agents that collaborate on tasks; role → goal → backstory model | Role-based prioritization — each agent knows what it's responsible for. Good model for assigning high vs. low priority work. |
| 4 | [agno-agi/agno](https://github.com/agno-agi/agno) | ~38.8k | Python | Active (2026) | High-performance runtime for multimodal agents, agent teams, and complex workflows; 100+ integrations | Full agentic runtime: run agents, agent teams, workflows — with memory + knowledge. Production-grade loop infrastructure. |
| 5 | [langchain-ai/langgraph](https://github.com/langchain-ai/langgraph) | ~27k | Python | Active (2026) | Graph-based stateful agent loops with branching, parallelism, evaluator-optimizer patterns | The evaluator-optimizer loop is perfect for self-correcting autonomous work. Durable + stateful = ideal for overnight builds. |
| 6 | [huggingface/smolagents](https://github.com/huggingface/smolagents) | ~26.2k | Python | Active (2026) | Code-first agent loop: Thought → Code → Observation, fits in ~1,000 lines of core logic | Minimal loop implementation. Easiest to read and understand — good starting point for building Moriah's own loop. |
| 7 | [snwfdhmp/awesome-ralph](https://github.com/snwfdhmp/awesome-ralph) | ~22.9k | Markdown | Active (2026) | Curated list of resources for the Ralph technique — running AI coding agents in automated loops until specs are fulfilled | Master index for the Ralph autonomous loop pattern. All the tools, techniques, and examples in one place. |
| 8 | [openai/swarm](https://github.com/openai/swarm) | ~21.2k | Python | 2024–2025 | Educational multi-agent orchestration; infinite loop pattern via `client.run()`; agents hand off tasks to each other | The clearest documented infinite loop pattern from OpenAI. Lightweight, readable, educational — great for studying the loop mechanics. |
| 9 | [openai/openai-agents-python](https://github.com/openai/openai-agents-python) | ~20.2k | Python | Active (2026) | Production evolution of Swarm; built-in agent loop handles tool calls, LLM handoffs, max-turn limits | Production-grade loop SDK. Built-in: invoke tool → get result → feed back to LLM → repeat until done. Exactly Moriah's pattern. |
| 10 | [yoheinakajima/babyagi](https://github.com/yoheinakajima/babyagi) | ~18k | Python | Active (2026) | Self-building autonomous agent; database-stored functions; task creation + prioritization loop | The original task prioritization loop. Creates tasks, reprioritizes them by objective, executes — forever. The ancestor of every loop here. |
| 11 | [agent0ai/agent-zero](https://github.com/agent0ai/agent-zero) | ~16.3k | Python | Active (Mar 2026) | General-purpose dynamic agent framework; self-evolving, hierarchical delegation, persistent memory | Not pre-programmed — it learns and grows. Builds its own tools, delegates to sub-agents. Most similar to what Moriah is becoming. |
| 12 | [google/adk-python](https://github.com/google/adk-python) | ~16.8k | Python | Active (2026) | Modular agent development toolkit; flexible orchestration, multi-agent deployment, Gemini-native but model-agnostic | Google's official agent loop framework. Modular architecture makes it easy to plug in custom prioritization logic. |
| 13 | [microsoft/TaskWeaver](https://github.com/microsoft/TaskWeaver) | ~6.1k | Python | Active (2025) | Code-first agent framework for planning + executing tasks; ReAct reasoning (observe → reason → act), stateful execution | Built-in ReAct loop + task decomposition. Tracks both chat history AND code execution history. Good model for stateful decision-making. |
| 14 | [MervinPraison/PraisonAI](https://github.com/MervinPraison/PraisonAI) | ~5.7k | Python | Active (Mar 2026) | Low-code multi-agent platform; autonomous workflow examples; 100+ LLM support | Fast way to wire up an autonomous workflow loop. Active (released v4.5.60 this week). Good for rapid prototyping. |
| 15 | [gptme/gptme](https://github.com/gptme/gptme) | ~4.2k | Python | Active (Dec 2025) | Personal AI agent in your terminal; task queue with YAML/GTD metadata; scheduled run loops via systemd/launchd | Closest thing to what Moriah runs today — terminal agent with its own task queue, run loops, and scheduling. Steal ideas from here. |
| 16 | [nibzard/awesome-agentic-patterns](https://github.com/nibzard/awesome-agentic-patterns) | ~3.9k | Markdown | Active (2026) | Curated catalog of agentic AI patterns: Continuous Task Loop, Autonomous Workflow Architecture, evaluator-optimizer, etc. | Pattern library. Has a Decision Explorer + Graph Visualization to map which pattern fits which use case. Start here for design. |
| 17 | [Th0rgal/open-ralph-wiggum](https://github.com/Th0rgal/open-ralph-wiggum) | ~1.3k | TypeScript | Active (2026) | CLI implementing the Ralph Wiggum technique — autonomous loop where agent sees its own git history and self-corrects | Works with Claude Code, Codex, OpenCode, Copilot. Same prompt repeated until done. Self-correction via git history is a key idea. |
| 18 | [lsdefine/GenericAgent](https://github.com/lsdefine/GenericAgent) | ~714 | Python | Active (Mar 2026) | Minimal self-evolving PC agent; 92-line core loop; browser, terminal, filesystem, keyboard/mouse, screen vision, mobile (ADB) | 92-line agent loop that controls a computer. Evolves skills rather than preloading them. Accumulates experience dynamically. Study the 92-line loop directly. |
| 19 | [vercel-labs/ralph-loop-agent](https://github.com/vercel-labs/ralph-loop-agent) | ~719 | TypeScript | Active (2026) | "Continuous Autonomy for the AI SDK" — wraps iterative feedback loops, verification, and persistence into a reusable SDK | From Vercel. Emphasizes iterative improvement over single-shot perfection. Key for loop retry logic and verification. |
| 20 | [disler/infinite-agentic-loop](https://github.com/disler/infinite-agentic-loop) | ~537 | HTML/JS | Active (Mar 2026) | Demonstrates infinite agentic loop with Claude Code; deploys parallel sub-agents in batches; manages wave coordination | Parallel agent orchestration — run 5 agents at once, coordinate in waves. Practical pattern for how to parallelize loop work. |

---

## Star Distribution Note

⚠️ **The self-activating agent loop space is too hot for under-50-star quality repos in 2025-2026.** Every verified, actively maintained repo in this domain already has hundreds to hundreds-of-thousands of stars. The smallest here (disler's infinite loop at 537 stars) launched recently and is already substantial. This is itself a signal: the problem Moriah is solving is now considered core infrastructure for AI agents, not a niche.

The 3 genuinely "emerging/niche" picks by relative scale:
- **lsdefine/GenericAgent** (714 ⭐) — tiny team, desktop-control focus, fresh architecture
- **vercel-labs/ralph-loop-agent** (719 ⭐) — Vercel's SDK; new but from a trusted shop
- **disler/infinite-agentic-loop** (537 ⭐) — youngest repo here, most experimental

---

## Most Promising for Immediate Use

### 🥇 #1 Immediate Pick: `gptme/gptme`
Moriah runs in a terminal, manages files, operates overnight, and needs task queuing. `gptme` is the closest existing reference implementation of exactly that — a persistent terminal agent with YAML task queues, GTD-style workflows, and scheduled run loops. Study its architecture before building anything custom.

### 🥈 #2 For Loop Pattern: `huggingface/smolagents`
The simplest, cleanest implementation of an autonomous agent loop (Thought → Code → Observation) in ~1,000 lines. Read the source. This is the clearest template for understanding what a loop actually looks like in code.

### 🥉 #3 For Prioritization Logic: `yoheinakajima/babyagi`
The canonical implementation of a task prioritization agent. Even though BabyAGI is "archived" (the original v1), the prioritization logic — create tasks → rank by objective relevance → execute → create new tasks → repeat — is the foundational pattern. Read babyagi.py (it's short).

### 🔧 For Production: `openai/openai-agents-python`
When ready to deploy something production-grade, this SDK has the built-in agent loop, handoff logic, max-turn limits, and tool execution patterns baked in. It's what OpenAI uses.

### 🗺️ For Design: `nibzard/awesome-agentic-patterns`
Before building, use the Decision Explorer at agentic-patterns.com to map which patterns apply to Moriah's specific loop needs. Don't architect blind.

### 🔁 For the Loop Itself: `Th0rgal/open-ralph-wiggum` + `snwfdhmp/awesome-ralph`
The Ralph technique is the simplest autonomous loop pattern: same prompt → agent sees git history → self-corrects → keeps going until done. Moriah can implement this in a weekend. The awesome-ralph list has every known variation.

---

## Quick Concept Map

```
SELF-ACTIVATING LOOP PATTERN
├── Core Loop Design
│   ├── smolagents (Thought→Code→Observe, minimal)
│   ├── babyagi (Create→Prioritize→Execute→Repeat)
│   └── gptme (Task queue + scheduled run loops)
├── Ralph Technique (no-approval continuous loop)
│   ├── open-ralph-wiggum (CLI tool)
│   ├── vercel-labs/ralph-loop-agent (SDK)
│   └── snwfdhmp/awesome-ralph (patterns library)
├── PRIORITIZATION LOGIC
│   ├── babyagi (task prioritization agent, reorders by objective)
│   ├── TaskWeaver (ReAct: decompose → plan → execute)
│   └── autogen (multi-agent delegation)
├── ORCHESTRATION / MULTI-AGENT
│   ├── crewAI (role-based)
│   ├── agno-agi/agno (agent teams + workflows)
│   ├── langgraph (graph-based stateful)
│   ├── autogen (conversation-driven)
│   └── openai/swarm (lightweight handoffs)
└── PRODUCTION-GRADE FRAMEWORKS
    ├── openai-agents-python (built-in agent loop)
    ├── AutoGPT (full platform)
    ├── agent-zero (self-evolving)
    └── google/adk-python (modular, deployable)
```

---

*Sources: GitHub repository pages, web searches via Gemini grounding, star counts accurate as of March 2026.*
