---
name: infographic-generating
description: >
  Legacy routing file. For all diagram, infographic, flowchart, and visual generation, refer to the master routing skill: visual-assets/SKILL.md
---

# Infographic & Diagram Generation

## 🛑 DEPRECATED — READ `visual-assets/SKILL.md` INSTEAD

The architecture for generating visual assets in AntiGravity was consolidated on 2026-03-13 and updated 2026-03-18.

All visual generation now occurs through **NotebookLM** and the **VisualizerSystem**.

You must read `initialize_engine/.agent/skills/visual-assets/SKILL.md` for the unified decision tree on when to use:
- **NotebookLM CLI** (for infographics, workflow maps, relationship diagrams, any visual mapping)
- **VisualizerSystem API** (for generative images and styled logos)
- **generate_image tool** (for quick concept art)

For step-by-step workflow mapping instructions, read `.agents/workflows/notebooklm.md`.
