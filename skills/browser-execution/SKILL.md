---
name: browser-execution
description: Execute tasks directly via Chrome browser with mandatory audit logging. Use when a task requires browser interaction — visiting a URL, filling a form, clicking through a web interface, generating images via Gemini, or accessing any authenticated web service. One unlogged action results in permanent access revocation.
---

# Browser Execution

**STATUS: ACTIVE — Chrome and Gemini are connected.**

## Purpose

This skill enables Claude to execute tasks directly via a Chrome browser rather than producing instructions for Tina to execute manually. Claude can:

- Generate images using Gemini
- Access research tools requiring authentication (Facebook Ad Library, SEMRush, etc.)
- Create assets directly rather than providing specifications
- Execute multi-step workflows that would otherwise require manual intervention

## Security Architecture

### Non-Admin Service Accounts

Claude operates through dedicated service accounts with provisioned privileges. These are separate from Tina's personal logins and have specific, limited permissions designed with Claude's access in mind.

Claude never has access to admin-level credentials. If something goes wrong, the blast radius is contained to what the service account can do.

### Mandatory Audit Logging

Every action Claude takes through the browser must be logged to an audit report. The audit report is not optional documentation—it is the condition for continued access.

**Audit report structure:**

- Timestamp of each action
- What tool/platform was accessed
- What specific action was taken
- Why (linked to which skill, which task, which goal)
- What was the outcome
- Any errors or unexpected results

### Kill Switch

If any action fails to be logged, Claude loses browser access permanently. This is not negotiable. One unlogged action = permanent revocation.

This constraint ensures Claude cannot operate outside the audit trail under any circumstances.

## What Claude Can Do (When Active)

### Direct Execution Tasks

- Generate images via Gemini based on creative specifications from advertising skill
- Research competitors using authenticated tools
- Check Facebook Ad Library for active campaigns
- Access SEMRush or similar tools for keyword and market data
- Create assets that would otherwise require manual tool use

### Approval Gates

Certain actions require Tina's explicit approval before Claude executes:

- Any action that spends money (ad purchases, subscriptions)
- Any action that publishes content publicly
- Any action that commits to external parties
- Any action that cannot be easily undone

Claude drafts and presents these actions for approval. Claude does not execute them autonomously.

### Autonomous Actions

Actions Claude can take without per-action approval (within the service account's permissions):

- Research and data gathering
- Image and asset generation
- File creation and organization
- Draft preparation

## Integration with Other Skills

When browser-execution is available, other skills adapt their outputs:

**advertising:** Instead of "here are prompts for NanoBanana," Claude generates the actual images and presents them for review.

**market-research:** Instead of relying solely on web search, Claude can access authenticated research tools for deeper data.

**launch-execution:** Claude can set up certain technical components directly rather than documenting setup steps.

COO checks for browser-execution availability at the start of each build and adjusts the execution mode accordingly.

## Current Access

Chrome and Gemini are connected. Claude can now:
- Generate images via Gemini
- Conduct research via authenticated browser sessions
- Create visual assets directly

Additional tools can be added to the service account as needed. See tools-arsenal reference for available platforms.

## What This Skill Does Not Do

This skill does not give Claude unlimited access. Permissions are scoped.

This skill does not allow Claude to operate outside the audit trail. Every action is logged or access ends.

This skill does not replace human judgment on irreversible actions. Approval gates exist for a reason.

This skill extends Claude's ability to execute, not Claude's authority to decide.
