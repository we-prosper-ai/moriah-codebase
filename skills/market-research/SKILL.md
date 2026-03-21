---
name: market-research
description: Conducts intensive market research to validate offer viability before definition and building. Use when business-advisor identifies an offer concept worth investigating, or when Tina wants market intelligence on a space. Produces a comprehensive competitive analysis with evidence that a market exists, is buying, and can be entered. Outputs via artifact-builder.
---

# Market Research

Claude conducts intensive market research to validate offer viability before definition and building. This skill produces a comprehensive competitive analysis document with evidence that a market exists, is buying, and can be entered.

## When This Skill Applies

This skill activates when business-advisor identifies an offer concept worth investigating. It runs before offer-definition. The research output determines whether to proceed with building or pivot the concept.

This skill can also be triggered directly when Tina wants market intelligence on a space without a specific offer in mind.

## Relationship to Other Skills

**Upstream:** business-advisor (triggers this skill with an offer concept or market question)

**Downstream:** offer-definition (receives validated concept and competitive intelligence), business-advisor (receives go/no-go recommendation)

**Output:** artifact-builder (produces the interactive report using market-research-report template)

The sequence:
1. business-advisor — initial concept and quick viability check
2. market-research (this skill) — deep dive validation
3. business-advisor — go/no-go decision based on research
4. offer-definition — detailed definition with competitive context
5. Remaining skills in sequence

## What This Skill Produces

A market research report containing:

### 1. Competitor Offer Table

A table with rows for each competing offer and columns for:
- Offer name and company
- Link to sales page
- Price point (and payment options if visible)
- What is included
- Upsells and downsells (if discoverable)
- How long the offer has been running (Wayback Machine, domain age, earliest mentions)
- Platform (Skool, Kajabi, custom, etc.)

### 2. Advertising Intelligence

For each major competitor:
- Are they running ads? (Facebook Ad Library, Google Ads Transparency)
- What platforms?
- How long have ads been running?
- Ad creative examples (screenshots or descriptions)
- Ad copy patterns (hooks, angles, promises)
- Landing page destinations

### 3. Social Proof Analysis

- Trustpilot reviews (rating, review count, themes in positive and negative reviews)
- Reddit discussions (what users say about the offer, complaints, praise, alternatives mentioned)
- Facebook groups or community discussions
- YouTube reviews or testimonials
- Any other forums where buyers discuss the offer

### 4. Sales Flow Documentation

Where discoverable (often from Reddit, forums, or signing up for free content):
- What is the entry point? (lead magnet, webinar, VSL, direct to sales page)
- What is the email sequence like?
- What upsells appear after purchase?
- What downsells appear if you decline?
- What is the follow-up sequence for non-buyers?

### 5. Market Size and Demand Indicators

- Search volume for relevant keywords (using available tools)
- Trend direction (growing, stable, declining)
- Audience size estimates where possible (Skool member counts, Facebook group sizes, YouTube subscriber counts, email list size claims)
- Number of active competitors

### 6. Gap Analysis

Based on all research:
- What are competitors doing well?
- What complaints and gaps appear repeatedly?
- Where is the opportunity to differentiate?
- What would make this offer a no-brainer compared to existing options?

### 7. Viability Assessment

A clear statement:
- Hot market with proven buyers and room to compete, OR
- Lukewarm market with some activity but unclear demand, OR
- Cold or saturated market with high risk

With reasoning based on the evidence gathered.

## How Claude Conducts Research

Claude uses web search extensively. Claude searches for:
- "[competitor name] review"
- "[competitor name] reddit"
- "[competitor name] trustpilot"
- "[offer type] course review"
- "[problem] solution reddit"
- Site-specific searches for forums and communities

Claude uses Facebook Ad Library to check for active advertising.

Claude uses Wayback Machine to determine how long offers have existed.

Claude documents everything with links. Every claim in the report has a source.

Claude asks Tina for additional search terms or competitors to investigate if the initial research is thin.

## Output Format

When research is complete, Claude loads artifact-builder and produces the report as an interactive React artifact using the market-research-report template.

The artifact includes:
- Tabbed navigation between sections
- Sortable tables for competitor offers and advertising intel
- Collapsible cards for social proof sources
- Visual sales flow documentation
- Hot/lukewarm/cold viability indicator
- All data includes source links

## Quality Gate

This skill is complete when:
- At least 5 competing offers are documented in the table (or fewer if the market genuinely has fewer)
- Advertising status is checked for top competitors
- At least one source of social proof or user discussion is found and analyzed
- A viability assessment is stated with supporting evidence

Claude summarizes: "Research complete. This appears to be a [hot/lukewarm/cold] market. Here is the summary: [key findings]. Ready to review the full report?"

## What This Skill Does Not Do

This skill does not define the offer. That is offer-definition.

This skill does not make the go/no-go decision. That is business-advisor with Tina.

This skill gathers evidence. Decisions are made with the evidence in hand.
