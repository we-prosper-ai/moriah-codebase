# Learnings Log

---

## [LRN-20260318-001] best_practice

**Logged**: 2026-03-18T21:58:00Z
**Priority**: high
**Status**: pending
**Area**: infra

### Summary
Always verify sub-agent research sources before presenting findings as fact

### Details
Sent a sub-agent to research finance app patterns. It returned specific GitHub repo names and schema examples. I used the output without verifying whether the agent actually visited those sources or synthesized from training data. Tina caught it and asked where the research came from.

### Suggested Action
When a sub-agent returns research with specific sources:
1. Use Firecrawl to spot-check 2-3 cited URLs
2. Confirm the content at those URLs matches the claims
3. If unverified, say "the sub-agent cited X" not "X is true"
4. Never present unverified research as confirmed fact

### Metadata
- Source: user_feedback
- Related Files: none
- Tags: sub-agents, research, verification, honesty
- Pattern-Key: verify.sub-agent-research
- Recurrence-Count: 1
- First-Seen: 2026-03-18

---
