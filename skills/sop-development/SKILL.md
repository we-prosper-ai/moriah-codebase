---
name: sop-development
description: Methodology for writing Standard Operating Procedures (SOPs). Use when the user requests to formulate, outline, or document a repeatable workflow or process.
---

# SOP Development Methodology

## When to use this skill

- The user asks to "write an SOP for [task]".
- The user wants to map out and document a repeatable operational process.
- The user provides examples of a manual process and asks to systematize it.

## Core Structural Requirements

Every SOP you generate must include the following sections to ensure clarity and reproducibility:

### 1. Purpose & Scope
Define what the SOP accomplishes, when it applies, and what outcomes it is meant to guarantee.

### 2. Prerequisites & Tools
List the exact credentials, software platforms, context files, or starting states required before beginning step one.

### 3. Execution Steps
Document sequential, deterministic actions. Break down complex heuristics into binary decision trees or specific input-output pairs.

### 4. Verification & QA
Define explicitly how the user or agent can prove the task was completed successfully (e.g., visual browser checks, log outputs, specific metric thresholds).

## Writing Principles

- **No Ambiguity:** Use imperative verbs (e.g., "Click", "Run", "Copy"). Do not use "You can" or "You might want to".
- **Visual Evidence:** Embed exact terminal commands, directory paths, or explicit UI element names.
- **Troubleshooting:** Provide fixes for the most common points of failure explicitly.
- **Brevity:** Use numbered lists. Do not pad with summary, hyperbole, or transitional paragraphs.

## The SOP Generation Process

1. **Elicit Constraints:** Briefly elicit any missing constraints or steps from the user before writing.
2. **Drafting:** Write the SOP using the structure above.
3. **Verification check:** Ensure the drafted SOP relies on explicit paths and exact commands where applicable.
4. **Finalization:** Produce the SOP document using the `write_to_file` tool to save it into the user's `knowledge-base/sops/` directory, or another specified project folder.
