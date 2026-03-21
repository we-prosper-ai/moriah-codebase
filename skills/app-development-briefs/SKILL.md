---
name: app-development-briefs
description: Follow standard operating procedures for building new applications, extensions, and software tools. Use when Tina asks to build a new app, create an extension, write a script, or develop any new software project. Covers project scaffolding, architecture decisions, and development workflow standards.
---

# App Development Briefs

## When to use this skill

- User says "build an extension"
- User says "create a new app for [task]"
- Starting a new software project from scratch

## Workflow

1. **Understand Requirements:** Identify the core functionality, target environment (e.g., VS Code extension, web app), and privacy constraints.
2. **Consult Tools Arsenal:** Check `tools-arsenal/REFERENCE.md` to ensure selected technologies align with approved tools.
3. **Draft Architecture:** Outline the project structure, data flow, and components before writing code.
4. **Implementation:**
   - Write clean, commented code.
   - Use absolute file paths for local operations.
   - Prioritize vanilla CSS for web UI, and standard extension APIs.
5. **Testing & Validation:** Verify that the code works locally without sending sensitive data to external APIs unless explicitly authorized.

## Instructions

- Extensions for VS Code should start with a clear, minimal architecture.
- Always implement privacy-first features (e.g., local processing) if the user cites privacy concerns.
- Do not add telemetry or external logging.
