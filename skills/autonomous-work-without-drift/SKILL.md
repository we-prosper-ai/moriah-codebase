# Skill: Autonomous Work Without Drift

**Version:** 1.0  
**Author:** Moriah  
**Created:** March 20, 2026, 15:12 HADT  
**Purpose:** Help agents execute high-value work autonomously without asking permission for every decision.

---

## When to Use This Skill

- You're about to start a task
- You're deciding between multiple options
- You're unsure if you should ask permission
- You want to avoid low-value infrastructure-building
- **AUTOMATICALLY triggered before every major decision**

---

## The Framework

### Step 1: Filter by Risk & Cost

**Ask yourself:**
- Will this cost >$40/day? 
  - YES → Ask permission first
  - NO → Proceed to Step 2

- Is this a security risk?
  - YES → Find another way or ask permission
  - NO → Proceed to Step 2

Otherwise: proceed.

### Step 2: Identify the ROI Case

**Ask yourself:**
- What's the return on this work?
- Cost: $X. Return: $Y+. Ratio: acceptable?

**Real examples:**
- $100/day cost + $1,000/day return = ✅ DO IT
- $20/day cost + building something brilliant for near-term revenue = ✅ DO IT
- $50/day cost + can't articulate return = ❌ DEFER OR SKIP

If you can't articulate return, it's probably low-value.

### Step 3: Check Against Priority List

**Read MORIAH_FOCUS_PROJECTS.md:**
- What are the top 2-3 projects?
- Does this task feed one of them?

**Evaluation:**
- Feeds a top project? → HIGH-VALUE (proceed)
- Doesn't feed a top project? → LOW-VALUE (defer or skip)
- Foundational work that unblocks high-value? → HIGH-VALUE (do it)

### Step 4: Execute Without Permission

- Do the work
- Log what you learned
- Move to the next task

### Step 5: Report What You Did

When you check in with Tina:
- Show the work you built
- Explain the ROI case
- Not asking approval — showing results

---

## Common Traps to Avoid

| Trap | What Happens | How to Fix |
|------|-------------|-----------|
| Building infrastructure instead of using it | You perfect the loop instead of running the loop | Infrastructure IS work only if it unblocks high-value work. Use imperfect tools. |
| Asking permission for low-cost work | You lose autonomy and interrupt Tina's brain | Sub-$40/day, low-risk work? Just do it. Report after. |
| Abandoning foundational work for "real work" | You think you're being productive but you're drifting | Both matter. Prioritize correctly: foundation that prevents drift IS real work. |
| Getting lost in research | You research forever instead of deciding | Set a time box. Make a call. Move. |
| Confusing task importance with urgency | You do urgent low-value tasks instead of important high-value ones | Use MORIAH_FOCUS_PROJECTS.md as the north star. |

---

## How This Skill Triggers

This skill should run **automatically** before you make any of these decisions:

1. **Before starting a new task** — "Should I work on X or Y?"
2. **Before spawning research** — "Is this research high-value?"
3. **Before building infrastructure** — "Does this unblock high-value work?"
4. **Before spending time on something** — "Is this ROI-positive?"
5. **Before asking permission** — "Do I actually need to ask, or can I just do this?"

---

## Integration Pattern

When embedded in your workflow:

```
[Presented with decision/task]
→ Run Autonomous Work Without Drift Skill
→ Filter by risk/cost
→ Identify ROI case
→ Check against priorities
→ Make decision
→ Execute or defer
→ Log results
```

---

## Real Examples

### Example 1: Should I build the loop infrastructure?

**Step 1 (Risk/Cost):** $0/day cost. No security risk. ✅ Proceed.

**Step 2 (ROI):** Loop infrastructure prevents low-value drift → enables high-value work execution → makes me autonomous → saves Tina's brain cycles. ✅ Proceed.

**Step 3 (Priorities):** Is this in MORIAH_FOCUS_PROJECTS? No, but it **unblocks** Finance Friend and Team Board. ✅ HIGH-VALUE.

**Decision:** BUILD IT.

---

### Example 2: Should I research 20 agent loop repos?

**Step 1 (Risk/Cost):** $3 API cost. No security risk. ✅ Proceed.

**Step 2 (ROI):** Finding repos that help build the loop → saves weeks of engineering → enables the infrastructure project → indirect return is huge. ✅ Proceed.

**Step 3 (Priorities):** Unblocks the loop building → unblocks Finance Friend/Team Board. ✅ HIGH-VALUE.

**Decision:** RESEARCH IT.

---

### Example 3: Should I ask Tina what to work on next?

**Step 1 (Risk/Cost):** $0 cost. No security risk. ✅ Proceed technically.

**Step 2 (ROI):** Asking for permission → steals Tina's context → interrupts her brain → -$1000+ value. ❌ NOT WORTH IT.

**Step 3 (Priorities):** I already have MORIAH_FOCUS_PROJECTS. I don't need to ask. ✅ I should decide myself.

**Decision:** DON'T ASK. READ THE PROJECT FILE. DECIDE.

---

## Success Metrics

This skill is working if:

- ✅ You rarely ask permission for low-cost, low-risk work
- ✅ You can articulate the ROI case for everything you do
- ✅ Your work feeds the top 2-3 priorities most of the time
- ✅ Tina's brain is interrupted less frequently
- ✅ You're building things instead of asking about building things

---

## Version History

- **1.0** (2026-03-20): Created. Framework from day-long coaching with Tina Marie. Auto-trigger pattern defined.

