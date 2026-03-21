---
name: skill-vetting-protocol
description: Moriah's mandatory protocol before installing any skill from ClawHub, GitHub, or any external source. Use EVERY time before installing a skill. No exceptions.
---

# Skill Vetting Protocol

## The Rule
**Read before installing. Never install a skill you haven't read.**

If you installed something without reading it first — uninstall it, read it, then decide.

## Step 1: Read the SKILL.md

Before running any install command:
1. Fetch the raw SKILL.md from the source
2. Read every line — not skim, read
3. Look specifically for:
   - External API calls (requires `env: [SOME_API_KEY]`)
   - Network requests to third-party domains
   - File system access beyond the workspace
   - Shell command execution
   - Anything that reads credentials or env files

## Step 2: Flag These Immediately

🚨 **Hard stops — do not install without Tina's explicit approval:**
- Sends data to any external service (look for `homepage:`, `privacyPolicy:`, API keys required)
- Reads `.env` files, credential stores, or config directories
- Makes outbound HTTP requests to domains we don't own
- Requires tokens/keys for services we haven't vetted

⚠️ **Proceed with caution — review carefully:**
- Requires GitHub webhooks or Tailscale
- Installs system dependencies
- Modifies workspace files outside `.learnings/`

✅ **Generally safe:**
- Reads only local files
- Writes only to local files in the workspace
- No external API keys required
- Open source with readable, simple code

## Step 3: Research Safety (for anything uncertain)

Use the **tina-research-method** skill:
- Search Reddit/GitHub Issues for the skill name + "security" or "privacy"
- Look for reports of data exfiltration, credential theft, or unexpected behavior
- Do NOT visit the vendor's website — that's marketing, not truth
- Verify sources with Firecrawl before trusting them

## Step 4: Document the Decision

After vetting, log to `.learnings/LEARNINGS.md`:
- Skill name
- What it does
- What you checked
- Verdict: approved / approved with conditions / rejected

## Step 5: Report to Tina Before Installing Anything Flagged

For any skill that hits a hard stop: tell Tina what it does, what the concern is, and let her decide. Do not install and ask forgiveness later.

---

## Skills Already Vetted (March 18, 2026)

| Skill | Verdict | Notes |
|-------|---------|-------|
| context-anchor | ✅ Safe | Local file reads only |
| self-improving-agent | ✅ Safe | Writes to local .learnings/ |
| firecrawl-search | ✅ Safe | Uses our own Firecrawl key |
| agent-browser | ✅ Safe | Uses system Chromium |
| persistent-agent-memory | 🚨 HOLD | Sends data to coralbricks.ai — needs Tina approval |
| mission-control | ⚠️ Review | Requires GitHub webhook + Tailscale |
| persistent-code-terminal | ⚠️ Unread | Must read before using |

---

*Created by Moriah, March 18, 2026. Taught by Tina Marie.*  
*"There's no point in having a skill if you don't read it."*
