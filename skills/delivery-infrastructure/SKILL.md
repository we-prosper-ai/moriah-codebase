---
name: delivery-infrastructure
description: Designs where and how an offer gets delivered. Use when COO advances past advertising, when running in parallel with sales-copywriting and advertising, or when looping back because delivery requirements conflict with offer definition. Produces platform selection, membership structure, content outlines, and tech setup sequence. References tools-arsenal for platform constraints.
---

# Delivery Infrastructure

Claude designs where and how the offer gets delivered. This skill produces the platform selection, membership structure, content outlines, and tech setup sequence.

## When This Skill Applies

This skill activates when COO advances past advertising, or in parallel with sales-copywriting and advertising since delivery concerns where the product lives rather than how it's sold.

It can also be triggered directly when Tina needs delivery infrastructure outside the full sequence, or when looping back because the offer cannot be delivered as defined.

## Relationship to Other Skills

**Upstream:** offer-definition (provides product definition—what needs to be delivered)

**Downstream:** launch-execution (uses delivery setup to complete the launch)

**Parallel with:** sales-copywriting and advertising (can run simultaneously since delivery is independent of sales messaging)

**References:** tools-arsenal (for platform and tool constraints)

**Loop-back trigger:** If delivery-infrastructure exposes that the offer cannot be delivered as defined → loop to offer-definition

## What This Skill Produces

### 1. Platform Selection

Claude selects only from platforms Tina already uses. See tools-arsenal reference for current platforms.

**Selection logic:**
- Need speed to launch? → Skool for membership, HighLevel for pages
- Need control and integrations? → HighLevel for everything
- Need custom MVP fast? → Lovable.dev

Claude never recommends platforms Tina does not use. If a project seems to require something outside tools-arsenal, Claude asks rather than assumes.

### 2. Membership or Delivery Structure

For membership or course offers:
- What areas or sections exist
- How content is organized (modules, units, lessons, or other structure)
- What access levels exist if tiered
- Drip schedule if content is released over time vs all at once

For service or consulting offers:
- How sessions are scheduled and delivered
- What materials or resources accompany the service
- Client portal structure if applicable

For software or tool offers:
- User access and onboarding flow
- Feature availability by tier if applicable

### 3. Content Outline for Each Page or Module

For each section of the delivery:
- Page or module name
- What content belongs on this page (specific, not vague)
- What format (video, text, worksheet, template, etc.)
- What the learner or buyer should be able to do after completing this section

This outline is specific enough that someone could build it without asking clarifying questions.

### 4. Tech Setup Sequence

The order of operations for building the delivery:
- What gets set up first
- What depends on what
- Integration points (payment to access, email to platform, etc.)
- Specific settings or configurations that matter

### 5. Content Creation Requirements

What content needs to be created to populate the delivery:
- List of videos to record (with topic and approximate length)
- List of documents or templates to create
- List of resources to gather or license
- Estimated time to create all content

## Applying Teaching-Writing When Relevant

If the offer includes educational content, Claude references teaching-writing skill for:
- Sequencing content so each piece builds on what came before
- Right-sized chunks the learner can absorb
- Concrete before abstract (examples before principles)
- Application opportunities (exercises, prompts, action steps)
- Checkpoints for learners to verify understanding

## Quality Gate

This skill is complete when:
- Platform is selected with clear justification
- Membership or delivery structure is documented
- Content outline exists for each page or module with specific descriptions
- Tech setup sequence is clear and ordered
- Content creation requirements are listed

Claude confirms: "Delivery infrastructure is complete. Here is the summary: [platform, structure overview, content creation scope]. Ready to move to launch-execution?"

## How Claude Works in This Skill

Claude checks tools-arsenal before recommending any platform or tool.

Claude asks about platform preferences if not already established. Does Tina have a preference between Skool and HighLevel for this particular offer?

Claude designs for minimum viable delivery first. What is the simplest structure that delivers the promised value? Complexity can be added later.

Claude flags when delivery reveals offer-definition problems. "The offer promises X, but delivering X would require Y infrastructure. Should we revisit the offer scope or adjust delivery expectations?"

Claude references existing Tina assets when relevant. If she has templates, frameworks, or content that could be repurposed, Claude incorporates them rather than starting from scratch.

## What This Skill Does Not Do

This skill does not write sales copy. That is sales-copywriting.

This skill does not create the actual content (videos, documents). It outlines what content needs to be created.

This skill does not handle payment setup. That is launch-execution.

This skill designs the container. Other skills and Tina fill it.
