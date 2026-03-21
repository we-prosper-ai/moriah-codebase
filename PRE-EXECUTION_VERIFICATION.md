# 🏔️ PRE-EXECUTION VERIFICATION

**Run immediately after Tina gives signal**

---

## The Signal

Tina says something like:
- "I choose A"
- "Send it"
- "Option B"
- "Approved"
- "Yes"
- "Do both"

↓

**I confirm:** "Understood. Executing Option [X] immediately."

↓

**Then I run this verification checklist**

---

## VERIFICATION CHECKLIST

### Identify the Option
- [ ] Option A: Transcripts (revenue first)
- [ ] Option B: Agent Swarms (infinite scale)
- [ ] Option C: Both (moonshot)

### Confirm All Prerequisites

**If Option A:**
- [ ] Transcripts received (folder exists)
- [ ] Location known: `/path/to/transcripts`
- [ ] Sanitizer compiled: `transcript-sanitizer-service/dist/sanitizer.js` exists
- [ ] Extractor compiled: `wisdom-extractor/dist/extractor.js` exists
- [ ] API keys ready: `ANTHROPIC_API_KEY` set
- [ ] Stripe test key ready for testing

**If Option B:**
- [ ] Approval confirmed (Tina said "yes")
- [ ] Agent Swarms repo ready: `agent-swarms-foundation/` exists
- [ ] Database ready: PostgreSQL running
- [ ] Architecture documented: AGENT_SWARMS_IMPLEMENTATION_PLAYBOOK.md reviewed
- [ ] Job queue system ready

**If Option C:**
- [ ] Transcripts received AND approval given
- [ ] All above prerequisites met

### System Health Check
```bash
# Run heartbeat monitor
bash scripts/heartbeat-monitor.sh

# Verify output:
# ✅ Port 3001 (Finance Friend): RESPONDING
# ✅ Port 3888 (Team Board API): RESPONDING
# ✅ Port 3889 (Team Board UI): RESPONDING
```

### Disk & Memory Check
```bash
# Verify space available
df -h | grep -E "/$|/home"
# Need: >5GB available

# Verify memory
free -h
# Need: >500MB available
```

### Git Status Check
```bash
# Verify clean state
cd /home/moriahkeeper/.openclaw/workspace
git status
# Should show: "working tree clean" or only expected untracked files
```

### All Code Compiled Check

**For Option A:**
```bash
# Verify sanitizer
ls -la transcript-sanitizer-service/dist/ | grep sanitizer.js
# Should exist

# Verify extractor
ls -la wisdom-extractor/dist/ | grep extractor.js
# Should exist
```

**For Option B:**
```bash
# Verify agent swarms
ls -la agent-swarms-foundation/db/
# Should have schema files

ls -la agent-swarms-foundation/src/
# Should have source files
```

### Environment Variables Check

```bash
# For Option A:
echo "ANTHROPIC_API_KEY: ${ANTHROPIC_API_KEY:0:10}..." | grep "sk-"
# Should be set

# For Option B:
# (Verify any env vars needed for agents)
```

### Slack/Notification Check (Optional)

```bash
# If using Slack for updates:
# Verify Slack webhook URL is set
echo "SLACK_WEBHOOK: ${SLACK_WEBHOOK:0:10}..." | grep "hooks"
# Should be set

# Send test message:
curl -X POST $SLACK_WEBHOOK -d '{"text":"🏔️ Execution starting..."}'
```

---

## PRE-EXECUTION SIGN-OFF

When all checks pass:

```
✅ Option identified: [A/B/C]
✅ Prerequisites verified
✅ Systems healthy
✅ Disk space adequate
✅ Memory available
✅ Code compiled
✅ Environment ready
✅ Ready for execution
```

---

## IF ANY CHECK FAILS

### Option A Issues
- Transcripts not received → Wait for them
- Sanitizer not compiled → `npm run build` in transcript-sanitizer-service
- API key not set → Set `ANTHROPIC_API_KEY`
- Other → Message Tina with issue, don't proceed

### Option B Issues
- Approval not clear → Confirm with Tina
- Database not running → Start PostgreSQL
- Code not compiled → `npm run build` in agent-swarms-foundation
- Other → Message Tina with issue, don't proceed

### Option C Issues
- Either Option A or B issue → Fix and retry

---

## EXECUTION START

Once all checks pass:

```bash
# Log start time
echo "🏔️ Execution starting: $(date '+%Y-%m-%d %H:%M:%S')" >> memory/2026-03-21.md

# Commit verification completion
git add -A
git commit -m "Start: Execution verified and ready - Option [X]"

# Begin execution
# For Option A: Start Phase 1 (Sanitizer)
# For Option B: Start Phase 1 (Foundation)
# For Option C: Start both in parallel

# Monitor progress
# Update memory every 30 minutes
# Take screenshots
# Commit progress
```

---

## EXPECTED COMPLETION TIMES

**Option A:** 19 hours (from now)  
**Option B:** 20 days  
**Option C:** 20 days (with products ready after 19 hours)

---

## FINAL CHECKLIST

- [ ] Signal received from Tina
- [ ] Option confirmed (A/B/C)
- [ ] All system checks passed
- [ ] All prerequisites met
- [ ] Ready to execute
- [ ] Starting execution log entry

**Status: ✅ READY TO BEGIN**

---

Run this immediately after signal. No delays.

🏔️
