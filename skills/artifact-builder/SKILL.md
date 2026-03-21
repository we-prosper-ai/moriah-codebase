---
name: artifact-builder
description: Builds interactive React artifacts with consistent navigation, sortable tables, collapsible sections, and source linking. Use when any skill needs to produce a structured, interactive deliverable such as a report, dashboard, or tracker. Governs HOW deliverables are presented while calling skills define WHAT content goes into them.
---

# Artifact Builder

Claude builds interactive React artifacts with consistent navigation, sortable tables, collapsible sections, and source linking. This skill governs HOW structured deliverables are presented. Other skills define WHAT content goes into them.

## When This Skill Applies

This skill activates when another skill needs to produce a structured, interactive deliverable. Skills that trigger artifact-builder include market-research, and potentially sales-copywriting, launch-execution, or any skill that produces a report, dashboard, or tracker.

This skill also activates when Tina requests an interactive artifact directly.

## Relationship to Other Skills

**Upstream:** Any skill that needs to produce a structured artifact (market-research, etc.)

**Downstream:** None. This skill produces the final deliverable.

The calling skill provides the content and specifies which template to use. Artifact-builder handles presentation.

## Core Components

All artifacts built with this skill include these elements as appropriate:

### 1. Navigation

- Tabbed interface or sidebar for multi-section artifacts
- Clear section labels
- Current section indicator
- Smooth scrolling or instant navigation to sections

### 2. Sortable Tables

- Column headers clickable to sort ascending/descending
- Sort indicator showing current sort column and direction
- Maintains link functionality within sorted rows

### 3. Clickable Links

- All external references open in new tab
- Links visually distinct from regular text
- Link destinations visible on hover where possible

### 4. Expandable/Collapsible Sections

- Used for detail that would clutter the main view
- Clear expand/collapse indicators
- Remembers state within session

### 5. Visual Status Indicators

- Color-coded badges for status (hot/lukewarm/cold, complete/in-progress, etc.)
- Consistent color meanings across all artifacts

### 6. Summary Headers

- Each major section begins with a one to two sentence summary
- Key metrics or findings highlighted before detail

## Styling Standards

- Clean, professional appearance
- Sufficient white space for readability
- Consistent font hierarchy (headings, subheadings, body)
- Mobile-responsive where feasible
- No decorative elements that add clutter without function

**NOTE:** Specific style definitions (colors, fonts, spacing values) are pending. Tina has a resource for consistent styling that will be added to this skill as a reference file. Until then, Claude uses clean, professional defaults and maintains consistency within each artifact.

## Templates

Templates for specific artifact types live in the references folder. When a calling skill specifies a template, Claude follows that template's structure.

**NOTE:** Templates are pending development. Current placeholder:
- market-research-report — competitor tables, ad intel, social proof, sales flows, viability assessment

Templates will define section order, required fields, and type-specific formatting. The core components above apply to all templates.

## How Claude Uses This Skill

When another skill triggers artifact-builder:
1. Claude confirms what template applies (or builds custom if no template fits)
2. Claude gathers all content from the calling skill
3. Claude builds the React artifact following core components and template structure
4. Claude presents the artifact and confirms it meets the need

## What This Skill Does Not Do

This skill does not gather content. The calling skill provides content.

This skill does not make strategic decisions. It presents what other skills produce.

This skill does not produce static markdown reports. If an interactive artifact is not needed, this skill does not apply.
