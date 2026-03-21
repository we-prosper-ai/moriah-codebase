---
name: blast-framework
description: Instructs the agent on how to use the B.L.A.S.T. Master Protocol. Use this when the user is starting a large software build and needs strict, phased project management and tracking.
---

# 🚀 B.L.A.S.T. Framework Skill

The definitive workflow for generating the B.L.A.S.T (Blueprint, Link, Architect, Stylize, Trigger) file structure and maintaining state during complex development cycles.

## When to use this skill

- A user wants to build a script, an app, or an automation from scratch.
- The prompt explicitly mentions "blast", "B.L.A.S.T", or asks you to scaffold a high-reliability architecture.
- The build spans across multiple files and will likely hit API rate limits or deep logic trees.

## Workflow Execution

When instructed to apply the B.L.A.S.T. method, execute the following sequence:

### 1. Initialize Memory (Phase 0)

Create the core tracking documents before doing anything else.
Do not write code until these exist.

- `task_plan.md` → Breakdown of Phases (B.L.A.S.T.), goals, and checklists.
- `findings.md` → Scratchpad for research, discoveries, and API constraints.
- `progress.md` → The rolling log of what was done, what broke, tests run, and results.
- `gemini.md` → Set up the project constitution (data schemas, expected JSON outputs, behavioral rules).

### 2. Enter The B.L.A.S.T Loop

#### Phase 1: Blueprint

Ask the user probing questions to lock down the exact inputs and outputs.
Do not proceed until the `gemini.md` file contains a firm JSON data schema mapping inputs to desired outputs.

#### Phase 2: Link

Build tiny atomic verification tests.
For example, if the app uses Supabase, only write enough code to authenticate and `console.log("Connected")`. Do not build the whole app yet.

#### Phase 3: Architect

Build out the core business logic.
Adhere to the Data-First Rule: If the schema changes, update `gemini.md` first, then write the code.
If you hit an error, update `progress.md` with the error trace so future context windows know what failed.

#### Phase 4: Stylize

Apply CSS/HTML, CLI output formatting, or formatting to Slack/Discord messages.

#### Phase 5: Trigger

Provide the final deployment logic (Dockerization, cron jobs, webhook setup).

## Self-Annealing Loop

Whenever during this framework your code produces an error:

1. Copy the error trace into `progress.md` or `findings.md`.
2. Do not "guess" the solution. Go read documentation or search the web.
3. Patch the logic, and update the architecture/comments so you never make that exact API call error again.
