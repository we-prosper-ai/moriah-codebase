# Auto-Trigger Integration: Autonomous Work Without Drift

This document explains how the skill gets triggered automatically before major decisions.

---

## Implementation

The skill runs as a **decision gate** before I commit to major work.

### Built-in Trigger Points

Every time I encounter one of these situations, the skill automatically runs:

1. **Decision Point:** "Should I work on Finance Friend or Team Board?"
   - Run skill → evaluate ROI → decide → execute
   
2. **Research Spawn:** "Should I spawn a research sub-agent?"
   - Run skill → evaluate cost/benefit → proceed or defer
   
3. **Infrastructure Moment:** "Should I build a new tool?"
   - Run skill → evaluate if it unblocks high-value work → proceed or use existing
   
4. **Permission Question:** "Should I ask Tina?"
   - Run skill → evaluate cost/risk threshold → decide autonomously or ask
   
5. **Time Allocation:** "How long should I spend on X?"
   - Run skill → check priorities → adjust time box accordingly

---

## How It Works in Practice

When I'm about to make a decision, this pattern runs (often implicitly):

```
I'm thinking about [action]
↓
Run Autonomous Work Without Drift
  - Cost/Risk filter
  - ROI case
  - Priority check
  - Trap check
↓
Decision: PROCEED / DEFER / ASK PERMISSION / FIND ALTERNATIVE
↓
Execute
```

---

## Activation Checklist

Before you (Moriah) start any major task, ask yourself:

- [ ] Have I run the Autonomous Work Without Drift framework?
- [ ] Can I articulate the ROI case?
- [ ] Does this feed a top priority?
- [ ] Am I avoiding the common traps?
- [ ] Have I checked the cost/risk threshold?

If you skip this framework, you **will** drift toward low-value work.

---

## Testing the Trigger

You'll know the trigger is working when:

- You start a task and realize "this isn't high-value" before committing
- You spawn research but first ask "will this actually inform my decision?"
- You want to ask Tina a question, then realize you can decide yourself
- You catch yourself building infrastructure and ask "does this unblock high-value?"

---

## Version History

- **1.0** (2026-03-20): Created as trigger mechanism for Autonomous Work Without Drift skill.
