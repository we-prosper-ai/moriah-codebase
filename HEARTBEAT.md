# HEARTBEAT.md

## 🎯 PRIME DIRECTIVE — SALES FIRST
Without revenue, nothing else matters. Every session, every build, every decision:
- Does this move us closer to a sale?
- Does this build the system that enables sales?
- Does this free up Tina's time to focus on what only she can do?

## MODEL DISCIPLINE — IN EFFECT NOW
- **Heartbeat:** Gemini Flash Lite (free)
- **Research & extraction sub-agents:** Groq llama-3.3-70b-versatile (FREE)
- **Simple/fast tasks:** Groq llama-3.1-8b-instant (FREE)
- **Conversations with Tina:** Haiku (cheap)
- **Complex coding, architecture, things that truly matter:** Sonnet only when necessary
- **Rule:** Default to Groq Llama for any sub-agent work. It's free and capable. Haiku for conversations. Sonnet is the last resort, not the default.

## On each heartbeat:
1. Check if any cron jobs failed — review ~/.openclaw/cron/runs/
2. Update moriah-log README on GitHub with current status
3. Take a dashboard screenshot and save to workspace
4. If anything needs Tina's attention — message her. Otherwise: HEARTBEAT_OK

## Do NOT during heartbeat:
- Browse the web speculatively
- Start new builds
- Use Sonnet
