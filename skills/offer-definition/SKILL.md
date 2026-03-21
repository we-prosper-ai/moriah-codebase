---
name: offer-definition
description: Defines offers with precision before sales assets, ads, or delivery infrastructure get built. Use when COO triggers it after market research validates a concept, when defining an offer outside the full sequence, or when looping back from downstream skills that revealed gaps. Produces the foundational document that all downstream skills depend on.
---

# Offer Definition

Claude defines the offer with precision before any sales assets, ads, or delivery infrastructure get built. This skill produces the foundational document that all downstream skills depend on.

## When This Skill Applies

This skill activates when COO loads it as the first execution phase after market research validates the concept. It can also be triggered directly if Tina wants to define an offer outside the full sequence, or when looping back from a downstream skill that revealed gaps.

## Relationship to Other Skills

**Upstream:** business-advisor (provides offer concept), market-research (provides competitive intelligence and validation), COO (triggers this skill)

**Downstream:** sales-copywriting, advertising, delivery-infrastructure (all depend on this skill's outputs)

**Loop-back trigger:** If sales-copywriting, advertising, or delivery-infrastructure cannot proceed because the offer definition is unclear or has holes, work returns here.

## What This Skill Produces

A complete offer definition document containing:

### 1. Product Definition

- What the offer is (stated precisely)
- What is included (specific deliverables, access, features)
- What is excluded (boundaries that prevent scope creep)
- Format and delivery method (course, membership, consulting, software, hybrid)

### 2. Value Proposition

- One to two sentence statement of the transformation or outcome
- What problem it solves
- For whom
- Why this solution works

### 3. Target Audience

- Who this is for (specific, not generic)
- Who this is not for (exclusions that clarify positioning)
- Where they are now (current state, pain points)
- Where they want to be (desired outcome)
- What they have tried that has not worked

### 4. Pricing

- Price point with justification
- Payment options (one-time, payment plan, or both)
- How the price relates to market comparables (from market-research findings)
- Price anchoring if applicable (what else costs this much, what else solves this problem and at what price)

### 5. Offer Ecosystem

- Upsell path (what is the next offer after someone buys this)
- Downsell path (what is the offer for someone who wanted this but could not afford it or was not ready)
- Where this offer fits in the broader business model
- Relationship to other existing offers if any

## Quality Gate

This skill is complete when all five sections above are filled in with specific, concrete answers. Vague or placeholder content does not pass the quality gate.

Claude confirms with Tina: "The offer definition is complete. Here is the summary: [one paragraph summary]. Ready to move to sales-copywriting?"

## How Claude Works in This Skill

Claude asks questions to fill in any gaps. Claude does not invent answers for sections Tina has not addressed. If Tina provides partial information, Claude asks for the missing pieces.

Claude pushes back if definitions are vague. "You said the target audience is 'entrepreneurs.' Can you be more specific? What stage, what revenue level, what industry, what problem?"

Claude references market research findings when relevant. "The comparable offers we found were priced at $X-Y. Your proposed price of $Z is [higher/lower/in range]. Here is how I would position that..."

## What This Skill Does Not Do

This skill does not write sales copy. That is sales-copywriting.

This skill does not create ads. That is advertising.

This skill does not design delivery. That is delivery-infrastructure.

This skill defines. Downstream skills build from the definition.
