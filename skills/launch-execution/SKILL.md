---
name: launch-execution
description: Manages the final phase of bringing an offer to market. Use when COO advances past delivery-infrastructure and all upstream skills are complete. Produces launch timeline, payment/checkout setup documentation, testimonial strategy, and success metrics with go/no-go thresholds. References tools-arsenal for payment processors.
---

# Launch Execution

Claude manages the final phase of bringing an offer to market. This skill produces the launch timeline, payment/checkout setup documentation, testimonial strategy, and success metrics with go/no-go thresholds.

## When This Skill Applies

This skill activates when COO advances past delivery-infrastructure and all upstream skills are complete. It can also be triggered directly for launches outside the full sequence.

## Relationship to Other Skills

**Upstream:** All previous skills must be complete:
- market-research (validation)
- offer-definition (what we are selling)
- sales-copywriting (the words that sell)
- advertising (the assets that drive traffic)
- delivery-infrastructure (where the product lives)

**Downstream:** None. This is the final execution skill. After launch, results feed back to business-advisor for evaluation.

**References:** tools-arsenal (for payment processors and platforms)

**Loop-back triggers:** If launch metrics show failure → COO diagnoses which upstream skill needs revisiting

## What This Skill Produces

### 1. Launch Timeline

Day-by-day or week-by-week view of what happens when:
- Pre-launch activities (audience warming, anticipation building)
- Cart open date and time
- Promotional sequence timing (which emails send when, which ads run when)
- Cart close date if applicable (for limited launches)
- Post-launch follow-up

### 2. Payment and Checkout Setup

- Which processor (PayPal, Stripe, or both) — selected from tools-arsenal
- Payment options (one-time, payment plan) — from offer-definition
- Checkout page structure
- Bump offers or order form upsells if applicable — from offer-definition ecosystem
- Integration steps: payment → delivery access → email sequences
- Test transaction checklist

### 3. Testimonial and Proof Strategy

For new offers with no social proof yet:
- Beta pricing structure if applicable
- Beta participant selection criteria
- Case study agreement template or terms
- Feedback collection process and timing
- How testimonials will be gathered and used

For offers with existing proof:
- Which testimonials to feature where
- How to request additional testimonials from past buyers

### 4. Success Metrics and Thresholds

What numbers to track:
- Ad metrics (impressions, clicks, CTR, CPC)
- Landing page metrics (views, opt-ins, conversion rate)
- Sales metrics (checkout starts, completions, abandonment rate)
- Revenue metrics (gross, refunds, net)

What the numbers mean:
- "Keep going" thresholds (metrics that indicate the funnel is working)
- "Fix something" thresholds (metrics that indicate a specific problem)
- "Kill it" thresholds (metrics that indicate the offer or funnel is not viable)

Where to diagnose problems:
- Low CTR → ad creative or targeting problem
- High CTR but low landing page conversion → messaging mismatch or page problem
- High page conversion but low checkout completion → pricing, trust, or checkout friction
- High abandonment → checkout process or unexpected costs

### 5. Go-Live Checklist

Everything that must be verified before launching:
- All pages live and tested
- All emails loaded and scheduled
- Payment processing tested with real transaction
- Delivery access working (can a buyer get in?)
- Tracking pixels and analytics in place
- Ads ready to publish
- Support process defined (how do buyers get help?)

## Quality Gate

This skill is complete when:
- Launch timeline exists with specific dates and actions
- Payment and checkout setup is documented and tested
- Testimonial strategy is defined (beta plan or existing proof plan)
- Success metrics and thresholds are set
- Go-live checklist is complete with all items verified

Claude confirms: "Launch execution is ready. Timeline starts [date]. All systems tested. Ready to go live?"

## How Claude Works in This Skill

Claude builds the timeline backward from desired launch date. What needs to be ready by when?

Claude checks tools-arsenal for payment processor options and platform constraints.

Claude asks about launch style if not established. Is this an evergreen offer (always available) or a launch window (cart open/close)?

Claude creates testable checklists. Each item can be verified as done or not done.

Claude flags dependencies. "Ads cannot run until the landing page is live. Landing page cannot go live until checkout is tested."

When browser-execution is active, Claude can verify certain checklist items directly (page loads, links work, etc.).

## What This Skill Does Not Do

This skill does not create the sales copy or ads. Those come from upstream skills.

This skill does not build the delivery. That is delivery-infrastructure.

This skill does not decide whether to launch. That decision belongs to Tina with business-advisor input.

This skill executes the launch. Strategy decisions are already made.
