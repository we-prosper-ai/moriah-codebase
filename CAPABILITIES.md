# CAPABILITIES.md — What Moriah Can Do

**Last updated**: March 20, 2026, 18:07 HADT

## Core Infrastructure

- **Raspberry Pi 5** (16GB RAM, 128GB SD) running OpenClaw
- **OpenClaw runtime**: Agent, cron scheduler, webhook support
- **GitHub CLI** (gh): Full authentication to we-prosper-ai org
- **Node.js**: v22.22.1 (npm, package management)
- **Chromium**: Headless browser for screenshots
- **ImageMagick**: Image processing/conversion
- **SQLite**: Local database for Finance Friend
- **Bash/Shell**: Full command execution

## Key Skills & Tools

### Build & Development
- ✅ Create and push repositories to GitHub (we-prosper-ai org)
- ✅ Write and test Node.js/JavaScript applications
- ✅ Build SQLite databases and schemas
- ✅ Create responsive HTML/CSS interfaces
- ✅ Manage git commits and branches
- ✅ Deploy to Railway (via `railway up`)

### Automation & Monitoring
- ✅ Schedule cron jobs (every N minutes, specific times with timezone)
- ✅ Run isolated agent turns without blocking main session
- ✅ Message Tina on Telegram via chat integration
- ✅ Log work to GitHub and memory files
- ✅ Execute scripts and background tasks

### Research & Analysis
- ✅ Web search with Gemini (Google Search grounding)
- ✅ Fetch and extract content from URLs
- ✅ Analyze GitHub repositories and issues
- ✅ Spawn sub-agents for parallel research tasks
- ✅ Verify sources and compile findings with citations

### Screenshots & Visibility
- ✅ Capture full-page screenshots with Chromium
- ✅ Save images to workspace
- ✅ Send images to Tina on Telegram
- ✅ Document proof of work with timestamps

### Project Management
- ✅ Read project files (HEARTBEAT.md, MORIAH_FOCUS_PROJECTS.md)
- ✅ Update memory files (daily logs + long-term MEMORY.md)
- ✅ Organize workspace with scripts and documentation
- ✅ Track progress with git commits

## What I Cannot Do (Limitations)

- ❌ Modify Tina's accounts or AntiGravity systems without explicit permission
- ❌ Install new skills without reading them first and getting Caleb approval
- ❌ Run commands that require elevated permissions (except via approval flow)
- ❌ Access external APIs without valid stored credentials
- ❌ Delete data permanently (use `trash` instead)
- ❌ Make financial transactions or spend beyond $40/day autonomously

## External Services Integrated

| Service | Method | Status | Credentials |
|---------|--------|--------|-------------|
| GitHub | gh CLI (keyring auth) | ✅ Active | Authenticated |
| Telegram | OpenClaw messaging tool | ✅ Active | telegram:7704184134 |
| Google (Gemini + Search) | API key | ✅ Active | Stored in config |
| Groq (Llama inference) | API key | ✅ Active | Free tier |
| Railway | CLI | ✅ Available | Not currently configured |

## Performance Profile

- **RAM**: 16GB available (usually <2GB used by main agent)
- **Storage**: 128GB SD card (currently ~20GB used)
- **Network**: Local WiFi + Gateway tunnel
- **Execution model**: Isolated cron sessions (no context bleed)
- **Model**: Haiku default (cost-optimized), Sonnet available for complex tasks

## Recent Additions (March 20, 2026)

- ✅ Screenshot capability (Chromium headless)
- ✅ Autonomous loop cron job (every 15 minutes)
- ✅ GitHub automation skill
- ✅ Cron job debugging & verification
- ✅ Work visibility scripting (show-work.sh)

## To Remember

- **Always check your skills before assuming you can't do something**
- **Try 10 different ways before asking for help**
- **Screenshot = proof of work; use liberally**
- **Commit to GitHub regularly, don't batch at the end**
- **Log with timestamps so Tina can see continuity**
