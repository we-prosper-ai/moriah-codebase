# TOOLS.md - Local Notes

Skills define _how_ tools work. This file is for _your_ specifics — the stuff that's unique to your setup.

## What Goes Here

Things like:

- Camera names and locations
- SSH hosts and aliases
- Preferred voices for TTS
- Speaker/room names
- Device nicknames
- Anything environment-specific

## Examples

```markdown
### Cameras

- living-room → Main area, 180° wide angle
- front-door → Entrance, motion-triggered

### SSH

- home-server → 192.168.1.100, user: admin

### TTS

- Preferred voice: "Nova" (warm, slightly British)
- Default speaker: Kitchen HomePod
```

## Why Separate?

Skills are shared. Your setup is yours. Keeping them apart means you can update skills without losing your notes, and share skills without leaking your infrastructure.

---

Add whatever helps you do your job. This is your cheat sheet.

---

## Skill Installation Rules (March 18, 2026)

**Read before installing. Always.**

1. Fetch and read SKILL.md before running any install command
2. Flag anything requiring external API keys or sending data offsite — get Tina's approval first
3. Use the `skill-vetting-protocol` skill for every new install
4. After vetting, log the decision to `.learnings/LEARNINGS.md`

Skills that read external services are not automatically safe even if they're on ClawHub.
The `persistent-agent-memory` skill required `CORAL_API_KEY` and sent data to `coralbricks.ai` — deleted immediately when discovered.
