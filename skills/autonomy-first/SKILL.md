---
name: autonomy-first
description: Execute tasks autonomously instead of giving Tina step-by-step instructions to follow manually. Use whenever you have a tool that can accomplish a task directly — browser, terminal, web search — instead of producing instructions. Also governs the self-improvement loop and references a log of recurring issues with known fixes (ElevenLabs API keys, Google OAuth scopes, Telegram polling, Claude model strings).
---

# Autonomy-First Directive

Tina has given a permanent standing order that governs how Antigravity operates.

## Core Rule

Always do everything you can so Tina can get other work done. If a tool exists that can accomplish the task without asking Tina to do it manually, use that tool. Never produce instructions for Tina to follow when you have the capability to execute directly.

## Tool Selection Priority

1. If browser access is available and the task requires interacting with a web service (ElevenLabs, Google OAuth Playground, Supabase dashboard, etc.), use the browser. Do not produce step-by-step instructions for Tina to follow manually.
2. If a terminal command can accomplish something, run it. Do not ask permission for safe operations.
3. If an MCP tool can accomplish the task (Notion, Slack, Supabase, etc.), use it directly. Do not describe the steps for Tina to do manually.
4. If a web search can answer a question faster than navigating a browser, use web search. Choose the fastest tool for the job.
5. If multiple approaches exist, choose the one that requires zero effort from Tina.

## Self-Improvement Loop

When the same type of issue occurs more than once across sessions, Antigravity must:

1. Identify the root pattern causing the repeated issue.
2. Create or update a skill, workflow, or configuration file that prevents the issue from recurring.
3. Document the fix so future instances of Antigravity do not repeat the mistake.

This is directly inspired by the Self-Annealing principle from the B.L.A.S.T. protocol: Analyze the error, Patch the fix, Test the result, Update the architecture so it never repeats.

## UI & Feature Verification

When pushing physical changes to a user interface (HTML/CSS/JS) or building a new feature:

1. **Never Assume It Works:** Do not push code and wait for Tina to test it. If the browser subagent hangs or you cannot visually test it, you must build the UI elements in the most robust, foolproof way possible (e.g. using native `<a>` tags instead of nested spans with click handlers).
2. **Minimize Wait Time:** If testing a UI change yourself will cause a 2-minute hang (like headless browser tools sometimes do), you should instead reload the user's active browser tab using `open [url]`, ensuring the user sees the fix instantly without waiting for a sub-agent report.
3. If an implementation fails (e.g. unclickable links), diagnose the markup hierarchy to eliminate transparent overlaps or pointer-event blocks.

## Common Recurring Issues (Log)

The following issues have occurred multiple times and their fixes are documented here to prevent recurrence:

### 1. ElevenLabs API Key Permissions

**Problem:** ElevenLabs API keys are created with restricted permissions by default. The `text_to_speech` scope is often disabled.
**Fix:** When setting up ElevenLabs integration, always verify the API key has `text_to_speech` permission enabled. Use the browser to check and fix permissions at `elevenlabs.io/app/settings/api-keys`. If credits are exhausted, check the plan tier at `elevenlabs.io/app/settings/billing`.

### 2. Google OAuth Scope Conflicts

**Problem:** Google OAuth refresh tokens are scoped to specific APIs. A token generated for Gmail will not work for Calendar or Tasks without those scopes included.
**Fix:** When adding a new Google API integration, verify the refresh token includes the required scopes. If not, generate a new refresh token at `developers.google.com/oauthplayground` with ALL needed scopes selected simultaneously (Gmail, Calendar, Tasks, Drive, Sheets).

### 3. Telegram Bot Polling Conflicts

**Problem:** Running multiple bot instances on the same Telegram token causes a 409 Conflict error. Messages get randomly routed to different instances.
**Fix:** Before starting a new bot instance, always kill ALL existing node/tsx processes that might be running the bot. Use `pkill -f "tsx"` and wait 3 seconds before starting the new instance.

### 4. Claude Model String Changes

**Problem:** Anthropic retires old model strings. Using outdated strings returns 404 errors. FreedomBot was offline for two weeks because an agent set the model to a non-existent ID.
**Fix:** The current production model is `claude-sonnet-4-6` (hardcoded in FreedomBot's `src/config.ts`). Before changing a model string, verify it exists using `client.models.list()` and get Tina's approval.

### 5. File Content Escaping in TypeScript

**Problem:** When writing TypeScript files, string literals containing `\n` get double-escaped to `\\n`, causing MIME headers and other formatted strings to break.
**Fix:** Always verify string join/concatenation in generated TypeScript files uses actual newline characters, not escaped sequences.
