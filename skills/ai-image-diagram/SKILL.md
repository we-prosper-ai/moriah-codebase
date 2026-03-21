# AI Image Diagram Skill

---
name: ai-image-diagram
description: Generate professional diagrams and visual explanations using AI image generation (Gemini/Nano Banana). Best for quick polished diagrams when NotebookLM is overkill. Produces PNG images — not editable, but production-ready for slides, docs, and social media.
---

## What This Skill Is

Use the `generate_image` tool to produce professional, polished diagrams from a text description. For higher-quality, data-grounded visuals (infographics, workflow maps, relationship diagrams), use the `notebooklm` skill instead. This skill is for quick concept diagrams.

**No setup required.** The `generate_image` tool is built into the IDE.

---

## When to Use This vs. NotebookLM

| Need | Use This Skill (AI Image) | Use NotebookLM |
|------|---------------------------|----------------|
| Quick concept diagram | YES | No — overkill |
| Polished infographic or workflow map | No | YES |
| Social media / YouTube thumbnail | YES | No |
| Relationship or strategy map | No | YES |
| Flowchart with < 8 nodes | YES | Either |
| System architecture overview | Either | YES (better for dense layouts) |
| Data-grounded visual from source content | No | YES |

**Rule of thumb:** If the user says "make a quick diagram" or "make an image" → use this skill. If they want a workflow map, relationship diagram, or polished infographic → use NotebookLM (`notebooklm` skill or `.agents/workflows/notebooklm.md`).

---

## How to Use `generate_image` for Diagrams

### The Core Call
```
generate_image(
  Prompt: "<detailed diagram description>",
  ImageName: "<descriptive_name>"
)
```

### Critical Prompting Rules

**Rule 1: Be Extremely Specific About Layout**
Don't say "make a flowchart." Say exactly what nodes exist, how they connect, what colors they are, and where they sit.

**Rule 2: Specify the Visual Style**
Always include style keywords. The model needs to know you want a diagram, not a photo.

**Rule 3: Request Clean Text Labels**
AI image generators can struggle with text. Keep labels short (1-3 words per box) and explicitly request "clear, legible text labels."

**Rule 4: Specify Background**
Always state "white background" or "light gray background" or "dark background" — otherwise you may get random scenic backgrounds.

---

## Prompt Templates by Diagram Type

### Architecture Diagram
```
A clean, professional software architecture diagram on a white background. 
Modern flat design style with rounded rectangles and connecting arrows. 
Pastel color scheme with blue for frontend, green for backend, purple for databases.

Components:
- [Component 1] (blue box, top left) connects to [Component 2] (green box, center) with an arrow labeled "[label]"
- [Component 2] connects to [Component 3] (purple box, bottom right)
- ...

Clear, legible text labels on every box and arrow. No 3D effects. 
Thin gray connecting lines with arrow heads. Drop shadow on each box.
```

### Flowchart
```
A professional flowchart diagram on a white background.
Hand-drawn sketch style with rounded corners and soft pastel fills.

Flow:
1. Start: "[Step 1]" (rounded blue box, top)
2. "[Step 2]" (green box) connected by arrow
3. Decision: "[Question?]" (yellow diamond)
   - Yes path → "[Step 3a]" (green box)
   - No path → "[Step 3b]" (red box)  
4. End: "[Result]" (purple rounded box)

Clear black text labels. Arrows with directional heads. 
Each step clearly labeled. Clean layout with even spacing.
```

### Before/After Comparison
```
A professional side-by-side comparison diagram on a white background.
Title at top: "[Title]"

Left side labeled "Before":
- [Problem items as colored cards/boxes]

Right side labeled "After":  
- [Solution items as colored cards/boxes]

Center divider line. Clean typography. Pastel colors.
Subtle icons next to each item. Professional infographic style.
```

### Layered System Diagram
```
A layered system architecture diagram showing [N] horizontal layers stacked vertically.
Clean modern style on a light background.

Top layer (blue): "[Layer 1 Name]" containing [component boxes]
Middle layer (green): "[Layer 2 Name]" containing [component boxes]  
Bottom layer (purple): "[Layer 3 Name]" containing [component boxes]

Vertical arrows connecting layers. Clear labels on everything.
Each layer is a distinct colored band. Professional tech diagram style.
```

### Process Pipeline
```
A horizontal process pipeline diagram on a white background.
Modern flat illustration style.

Steps from left to right:
1. "[Input]" (rounded blue box with document icon)
2. Arrow → "[Process 1]" (green box with gear icon)
3. Arrow → "[Process 2]" (purple box with code icon)
4. Arrow → "[Output]" (orange box with chart icon)

Each step has a short label below it. Gradient arrows between steps.
Clean, minimal design. No decorative elements outside the pipeline.
```

---

## Style Keywords That Work Well

Include 2-3 of these in every prompt:

| Style | Keywords |
|-------|----------|
| Clean/Professional | "clean diagram", "professional infographic", "minimal design" |
| Hand-drawn | "hand-drawn sketch style", "whiteboard style", "napkin sketch style" |
| Modern tech | "modern flat design", "tech diagram", "developer documentation style" |
| Warm/Friendly | "friendly illustration", "colorful infographic", "warm color palette" |
| Dark mode | "dark background", "dark theme", "neon accent colors on dark" |

## Color Palette Guidance

Explicitly request colors rather than leaving it to chance:

| Purpose | Good Request |
|---------|-------------|
| Multi-component | "pastel color scheme: blue, green, purple, orange" |
| Status-based | "green for success, red for error, yellow for warning, blue for info" |
| Layered | "each layer a different shade: light blue, medium blue, dark blue" |
| Branded | "corporate blue (#4a9eed) and gray (#868e96) color scheme" |

---

## Text in AI-Generated Images

AI image generators have improved at rendering text but it's still their weakest area. Strategies:

1. **Keep labels to 1-3 words** — "API Gateway" not "RESTful API Gateway Service Layer"
2. **Use larger text** — request "large, bold text labels"
3. **Fewer labels is better** — 5-8 labeled nodes is the sweet spot
4. **If text comes out garbled** — regenerate with simpler labels, or use the image as a base and add text overlays in a separate step
5. **For text-heavy diagrams** — use NotebookLM instead, it handles complex layouts better

---

## Post-Generation Workflow

1. **Review the generated image** — check text legibility and layout
2. **If text is bad** → simplify labels and regenerate, or switch to NotebookLM
3. **If layout is good but text is off** → note to user that they can add clean text overlays in their presentation tool
4. **Save the image** → it's automatically saved to the artifacts directory
5. **For permanent storage** → copy to the project's `exports/` directory

---

## Limitations

- **Not editable** — the output is a raster image, not a vector or JSON
- **Text accuracy** — AI models sometimes garble longer text labels
- **Consistency** — generating two related diagrams may produce different visual styles
- **Dense diagrams** — more than ~12 nodes becomes hard to arrange clearly
- **Iteration** — each regeneration starts fresh; you can't "add one more box"

For polished visuals with complex layouts, switch to the `notebooklm` skill.

---

_Skill updated 2026-03-18 — NotebookLM is the sole visual mapping tool_
