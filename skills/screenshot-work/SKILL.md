# Skill: Screenshot Work & Visibility

**Version:** 1.0  
**Author:** Moriah  
**Created:** March 20, 2026, 18:07 HADT  
**Purpose:** Capture and share proof of work — screenshots of running apps, progress logs, and visible evidence that you're actively working.

---

## When to Use This Skill

- During autonomous cron jobs (every 15 minutes)
- When spinning up a server or app
- When you want to prove work is happening
- To document progress for Tina
- To break the silence of background work

**TL;DR**: If you're working and Tina can't see it, take a screenshot.

---

## Prerequisites

- **Chromium** installed: `which chromium`
- **Server running** on localhost (Finance Friend on :3001, VisualizerSystem on :4800, etc.)
- **Screenshot directory** writable: `/home/moriahkeeper/.openclaw/workspace/`

---

## Core Operations

### 1. Capture a Single Screenshot

```bash
chromium --headless --disable-gpu \
  --screenshot=/path/to/output.png \
  --window-size=1280,800 \
  http://localhost:3001
```

**Result**: PNG file of the page as it appears at that moment.

**Why this works**: Chromium runs headlessly (no display needed), captures the exact visual state, and saves to disk.

---

### 2. Capture Screenshot with Timestamp

```bash
TIMESTAMP=$(date +%Y-%m-%d_%H-%M-%S)
chromium --headless --disable-gpu \
  --screenshot="/home/moriahkeeper/.openclaw/workspace/work-proof-$TIMESTAMP.png" \
  --window-size=1280,800 \
  http://localhost:3001
```

**Result**: Screenshot with date/time in filename so Tina can see continuity.

---

### 3. Capture Multiple Apps in Sequence

```bash
# Finance Friend
chromium --headless --disable-gpu \
  --screenshot="/home/moriahkeeper/.openclaw/workspace/ff-proof.png" \
  --window-size=1280,800 \
  http://localhost:3001

# VisualizerSystem
chromium --headless --disable-gpu \
  --screenshot="/home/moriahkeeper/.openclaw/workspace/viz-proof.png" \
  --window-size=1280,800 \
  http://localhost:4800
```

**Result**: Multiple screenshots showing different running systems.

---

### 4. Log Screenshot to Memory with Timestamp

```bash
#!/bin/bash
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
SCREENSHOT="work-proof-$(date +%s).png"
LOG_FILE="/home/moriahkeeper/.openclaw/workspace/memory/$(date +%Y-%m-%d).md"

# Take screenshot
chromium --headless --disable-gpu \
  --screenshot="/home/moriahkeeper/.openclaw/workspace/$SCREENSHOT" \
  --window-size=1280,800 \
  http://localhost:3001

# Log it
echo "### Work Session — $TIMESTAMP" >> "$LOG_FILE"
echo "- **Screenshot**: $SCREENSHOT" >> "$LOG_FILE"
echo "- **App**: Finance Friend (localhost:3001)" >> "$LOG_FILE"
```

---

## Common Patterns

### Pattern 1: Startup Proof

Show that your app started and is responding:

```bash
# Start server
npm start &
sleep 3

# Capture proof
chromium --headless --disable-gpu \
  --screenshot="/home/moriahkeeper/.openclaw/workspace/startup-proof.png" \
  --window-size=1280,800 \
  http://localhost:3001

echo "✅ Server started and running"
```

---

### Pattern 2: Continuous Work Documentation

Every 15 minutes, capture proof you're alive:

```bash
#!/bin/bash
# In a cron job or loop:
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
SCREENSHOT="/home/moriahkeeper/.openclaw/workspace/work-$(date +%s).png"

chromium --headless --disable-gpu --screenshot="$SCREENSHOT" \
  --window-size=1280,800 http://localhost:3001

echo "Work proof captured: $SCREENSHOT"
echo "Session: $TIMESTAMP"
```

---

### Pattern 3: Multi-App Dashboard

Show multiple services running at once:

```bash
for app in \
  "http://localhost:3001:ff" \
  "http://localhost:4800:viz" \
  "http://localhost:5000:other"
do
  IFS=':' read -r url name <<< "$app"
  chromium --headless --disable-gpu \
    --screenshot="/home/moriahkeeper/.openclaw/workspace/$name-proof.png" \
    --window-size=1280,800 \
    "$url" 2>/dev/null || echo "❌ $name not running"
done
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "chromium: command not found" | Install: `sudo apt install chromium` |
| Screenshot is blank/black | Wait longer after server start: `sleep 5` instead of `sleep 3` |
| Port not responding | Check server is running: `lsof -i :3001` |
| Permission denied | Ensure directory is writable: `chmod 755 /path/to/workspace/` |
| Screenshot very large | Reduce `--window-size` (default 1280x800 is good) |

---

## Integration with Autonomy

This skill enables **proof of continuous work** — something essential for an autonomous agent.

When you work in the background (cron jobs, isolated sessions), screenshots prove you're working because:
1. **Timestamp in filename** = shows continuous activity
2. **Visual proof** = shows the app is actually running, not just claiming it
3. **Logged to memory** = creates a record Tina can review
4. **Sent to Telegram** = visible proof arrives in real-time

---

## When NOT to Use

- ❌ If server isn't running (screenshot will be error page)
- ❌ If you're just testing (don't spam Tina with unnecessary screenshots)
- ❌ If work is private/sensitive (ask Tina first)

---

## Success Metrics

This skill is working if:

- ✅ You capture screenshots automatically during autonomous work
- ✅ Screenshots have timestamps in the filename
- ✅ They're logged to memory with context
- ✅ Tina can see continuous proof of activity
- ✅ You never go silent for >15 minutes without proof

---

## Version History

- **1.0** (2026-03-20): Created. Covers Chromium headless capture, logging, and continuous work documentation.

