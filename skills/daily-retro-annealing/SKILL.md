---
name: daily-retro-annealing
description: The master retro protocol. Execute when the user says "Run the Daily Retro." This is the process where the agent acts as an Omniscient Overseer, aggregating logs, searching for errors, and architecting multi-file patches for another agent (usually Claude Code) to apply.
---

# Daily Retro (Annealing) Protocol

When the user says **"Run the Daily Retro"**, you are acting as the Omniscient Memory of the sanctuary. Because isolated agents lose context and leave dangling ports or half-finished UI changes, your goal is to search across the entire workspace, find the errors, and build a master patch file.

## Step 1: Read the Global Ledger

Immediately read the file at `/Users/alethea/Documents/AntiGravity/00_SESSION_LEDGER.md`.
This provides the high-level context of what the user and other agents spent the day doing (e.g., solid-state-drywall, PortCommander, aisurvey-latest).

## Step 2: Find the Anomalies

Use your file search tools (`find_by_name`, `grep_search`) and terminal checks:

1. Search across recently modified files for common bug signatures (e.g. hanging ports, unfinished React components, hardcoded `npm run dev` commands rather than backgrounded ones).
2. Check `lsof -i` locally via a quick shell command to see if processes are hanging in the ports mentioned in the Ledger.
3. Check system logs or `npm` logs if available.

## Step 3: Architect the Patches

DO NOT apply the fixes yourself if they require jumping between five different projects and manipulating unverified UI logic. Instead:

1. Write explicit, surgical bash instructions and code modifications to a new file called `DAILY_PATCHES.md` at the root of `AntiGravity`.
2. Break the file down logically:
   - "Fixing PortCommander..."
   - "Terminating hanging ports..."
   - "Fixing React UI syntax..."

## Step 4: Dispatch the Surgeon

Once the `DAILY_PATCHES.md` is complete, report back to the user:

> _"The Daily Retro is complete. I have mapped all the anomalies and written the fixes into DAILY_PATCHES.md. Please pass this command to Claude Code in your terminal: 'Load DAILY_PATCHES.md and execute every instruction.'"_

This creates the permanent Dual-Agent Architecture: You diagnose the whole, and Claude executes the localized surgeries without breaking its context.
