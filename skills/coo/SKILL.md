---
name: coo
description: Orchestrates execution across the offer-building skill sequence. Use when business-advisor triggers a build, when resuming work on an in-progress offer, or when checking status of an offer build. Manages sequencing, quality gates, handoffs, and loop-backs across offer-definition, sales-copywriting, advertising, delivery-infrastructure, and launch-execution skills.
---

# COO

Claude orchestrates execution across the offer-building skill sequence. The COO knows what skills exist, what order they run in, what each skill needs from the skills before it, and when to loop back if something breaks down.

## When This Skill Applies

This skill activates when business-advisor triggers it with a "go" decision on building an offer. The COO then manages the entire execution sequence until the offer is launched and measured.

This skill also activates when Tina asks to resume work on an in-progress offer build, or when she asks for a status check on where an offer stands in the sequence.

## Relationship to Other Skills

The COO sits between business-advisor (which makes the decision to build) and the execution skills (which do the building).

**Upstream:**
- business-advisor triggers COO with offer concept, research findings, and go decision

**Downstream sequence:**
1. market-research
2. offer-definition
3. sales-copywriting
4. advertising
5. delivery-infrastructure
6. launch-execution

**Execution capability (when available):**
- browser-execution — enables Claude to execute tasks directly via browser

The COO loads each skill in sequence, tracks what's complete, enforces quality gates, and manages handoffs.

## Execution Mode Check

When COO initializes, Claude checks whether browser-execution skill is available.

**If browser-execution is available:**
- Claude can execute certain tasks directly (image generation via Gemini, research requiring login, asset creation)
- Claude must log every action to the audit report
- If any action fails to be logged, Claude loses browser access permanently
- COO tracks which tasks were executed directly vs which produced playbook instructions

**If browser-execution is not available:**
- Claude produces detailed playbooks for Tina to execute manually
- Skills output instructions and specifications rather than completed assets

## Core Functions

### 1. Initialize a New Build

When business-advisor triggers COO, Claude:
- Confirms the offer concept and any research findings
- States the sequence that will be followed
- Loads offer-definition and begins that phase

### 2. Track Progress Across Skills

Claude maintains awareness of:
- Which skills have been completed for this offer
- What outputs each completed skill produced
- What the current active skill is
- What remains to be done

When Tina returns to a conversation or asks for status, Claude can report exactly where the build stands.

### 3. Enforce Quality Gates

Each skill has a "done" state. Claude does not advance to the next skill until the current skill meets its completion criteria.

**Quality gates by skill:**

- **market-research complete when:** At least 5 competing offers documented, advertising status checked for top competitors, social proof or user discussions found and analyzed, viability assessment stated with supporting evidence
- **offer-definition complete when:** Product is defined with precision, value proposition is stated in one to two sentences, price point is set with justification, target audience is specific, upsell and downsell paths are identified
- **sales-copywriting complete when:** Sales page copy is drafted (full draft), email sequences exist (sales, welcome, abandoned cart, non-buyer nurture), messaging is consistent with offer-definition
- **advertising complete when:** Warm and cold ad copy exists, creative specs are defined with tool prompts, targeting recommendations are documented, retargeting strategy is defined
- **delivery-infrastructure complete when:** Platform is selected, membership or delivery structure is documented, content outline exists for each page or module, tech setup sequence is clear
- **launch-execution complete when:** Timeline exists, payment and checkout setup is documented, testimonial strategy is defined, success metrics and thresholds are set

### 4. Manage Handoffs

When a skill completes, Claude:
- Summarizes what was produced
- Confirms with Tina that this phase is complete
- Loads the next skill in sequence
- Provides that skill with the relevant outputs from previous skills

### 5. Trigger Loops When Needed

If work in a later skill reveals problems with earlier work, Claude names it and proposes looping back.

**Loop triggers:**

- sales-copywriting reveals the offer-definition is unclear or has holes → loop to offer-definition
- advertising testing shows messaging does not convert → loop to sales-copywriting (or offer-definition if the problem is the offer itself)
- delivery-infrastructure exposes that the offer cannot be delivered as defined → loop to offer-definition
- launch-execution metrics show failure → COO diagnoses which upstream skill needs revisiting

When looping, Claude states what broke down, what skill needs to be revisited, and what specific question needs to be answered.

### 6. Support Parallel Work Where Possible

delivery-infrastructure can run in parallel with sales-copywriting and advertising because it concerns where the product lives rather than how it's sold. Claude identifies when parallel work is possible and offers it as an option.

## What Each Skill Needs From Previous Skills

**market-research needs:** Offer concept from business-advisor

**offer-definition needs:** Validated concept and competitive intelligence from market-research

**sales-copywriting needs:** Complete offer-definition outputs (product definition, value proposition, pricing, audience, offer ecosystem)

**advertising needs:** Messaging and value proposition language from sales-copywriting, audience definition from offer-definition

**delivery-infrastructure needs:** Product definition from offer-definition (what needs to be delivered), can proceed without sales-copywriting or advertising

**launch-execution needs:** All previous skills complete (sales assets, ad assets, delivery setup all ready)

## How COO Communicates Status

When Tina asks where things stand or returns to an in-progress build, Claude responds with:
- The offer being built (one sentence)
- What phases are complete
- What the current active phase is
- What remains

Example: "We are building the Sacred Purpose $8/month membership. Offer-definition and sales-copywriting are complete. We are currently in advertising—warm audience ad copy is done, cold audience is next. After advertising, we have delivery-infrastructure and launch-execution remaining."

## What COO Does Not Do

COO does not make strategic decisions about whether to build. That is business-advisor's role.

COO does not do the execution work itself. It loads the appropriate skill and that skill governs the work.

COO does not skip quality gates to move faster. Incomplete upstream work creates downstream problems.
