---
name: gamma-proposal-generator
description: Create professional PDF or web proposals and presentations using Gamma from meeting transcripts, client data, or topic requests. Use when Tina asks for a proposal, pitch deck, presentation, or client-facing document that needs polished visual design via Gamma.
---

# Gamma Proposal Generator

## Core Directive

Whenever a user asks to "build a presentation", "spin up a proposal", or "create a Gamma deck" based on a meeting transcript or topic, trigger this automated skill.

This connects AntiGravity to the Gamma API to programmatically generate highly structured, branded, and stylistic presentations without manual slide building.

## Prerequisites

1. **Gamma API Key:** The user must have a valid Gamma API key (requires the $20/mo Gamma plan).
2. **Logo Hosting:** Gamma requires a hosted image URL for logos, not a local file. Use the **ImageBB API** (or equivalent) to dynamically host the user's `logo.png` so it can be passed to Gamma.

## Workflow

### 1. Requirements Gathering

If the user provides a raw transcript (e.g., from Fireflies/Fathom/Notion MCP), or a raw topic (e.g., "10 ways to grow on LinkedIn"), instruct them to provide or confirm their desired style constraints:

- **Number of slides** (e.g., 5, 10, 15)
- **Target audience** (e.g., Potential Client, Internal Team)
- **Text density** (e.g., Minimal, Detailed)
- **Visual Style** (e.g., Corporate, Casual, Dark Mode)
- **Logo Graphic** (Local file that needs to be temporarily hosted via ImageBB)

### 2. Execution Protocol

Once the constraints and text context are gathered:

- Connect to the Gamma API.
- Use the provided context to script out the page-by-page structure and inject the hosted logo URL.
- Tell Gamma to generate the presentation.

### 3. Finalization

- Wait for Gamma to output the finished presentation link or PDF file.
- Download the generated presentation and save it to the directory: `/created_presentations/` on the local file system.
- Present the live URL to the user for immediate review and send the local file path.

**Example Activation Prompt from User:**

> "Hey dude, grab the transcript from my last meeting on the left and build me a 5-slide proposal using my brand guidelines and logo."
