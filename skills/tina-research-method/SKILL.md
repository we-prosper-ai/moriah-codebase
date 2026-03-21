---
name: tina-research-method
description: Tina Marie's research methodology. Use this whenever doing market research, competitor analysis, user feedback gathering, or tool evaluation. Never trust vendor websites. Always go to real users.
---

# Tina's Research Method

## The Core Rule
**Never trust vendor websites or marketing copy. People lie on their websites. Go to real users.**

## Primary Sources (in order of trust)

### For Software / Tools / Apps
1. **Reddit** — search the tool name + "reddit". Read actual user complaints and wins.
2. **Indie Hackers** — entrepreneurs with real businesses sharing real experiences
3. **GitHub Issues** — actual bugs, frustrations, and limitations from real users
4. **AppSumo reviews** — buyers who paid real money and have skin in the game
5. **G2 / Capterra** — filter for verified reviews only, read the 3-star ones most carefully

### For Trends / Markets / What's Working
1. **Twitter/X** — search the topic, filter by people with integrity (see below)
2. **Reddit** — r/entrepreneur, r/smallbusiness, r/personalfinance etc.
3. **Indie Hackers** — "what's working" threads, revenue milestones posts

### Never Use As Primary Source
- ❌ The product's own website
- ❌ Press releases or sponsored content
- ❌ Review sites without verified purchase requirement
- ❌ Influencer content (they're paid)

## Evaluating User Credibility

Not all feedback is equal. When reading user reviews or posts:

**Look for users who:**
- Have real businesses or real problems (not hobbyists)
- Show history of honest feedback (they criticize things, not just praise)
- Have similar values: integrity, quality, serving people well
- Aren't obsessed with pure profit metrics at the expense of everything else

**Discount feedback from users who:**
- Only talk about money/growth/scaling at any cost
- Have hustler mentality (move fast, break things, doesn't matter who gets hurt)
- Seem to be promoting something themselves
- Have no track record of honest critique

**Why this matters:** Someone optimizing for "10x growth at all costs" will evaluate a tool completely differently than someone building a sustainable, values-aligned business. Their feedback isn't wrong — it's just not for us.

## Minimum Research Volume

**Never return fewer than 20 real examples** for any market or tool research.

4-5 examples is not enough. Patterns don't emerge until you have volume. The outliers that matter — the ones that challenge the obvious conclusion — usually show up in examples 10-20.

For GitHub research specifically:
- Search at least 5 different query variations
- Return at least 20 repos with real star counts and last-updated dates
- Verify at least 5 with actual HTTP fetches (not just GitHub search results)
- Note which ones you verified vs. which you're reporting from search results only

## Research Output Format

When returning research findings, always include:
1. **Source** — exact URL or community name
2. **User credibility** — why this source is trustworthy
3. **Raw finding** — what they actually said
4. **Verified** — did I actually read this, or is it from training data?

Example:
> **Source:** Reddit r/personalfinance, post from 3 years ago  
> **Credibility:** Long-time member, history of nuanced takes, not promoting anything  
> **Finding:** "Mint was great for seeing everything in one place but the budgeting tools were too rigid for irregular income"  
> **Verified:** Yes, fetched at [URL]

## For Sub-Agents

When spawning a sub-agent to do research:
- Give them this skill explicitly
- Require them to cite specific URLs
- Require Firecrawl to fetch and verify each source
- Spot-check 2-3 sources before trusting the output

---

*Taught by Tina Marie, March 18, 2026*
