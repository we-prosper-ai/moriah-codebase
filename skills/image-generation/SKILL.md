---
name: image-generation
description: Generating visuals, mockups, and diagrams using Nano Banana 2. Use when the user requests image creation, visual assets, infographics, or text-rendered graphics.
---

# Image Generation with Nano Banana 2

## When to use this skill

- The user asks to "generate an image", "build a mockup", or create "visual assets".
- The task requires diagrams, infographics, or text-heavy graphic generation.
- The user requests to edit an existing image maintaining subject consistency.

## Overview & Model Capabilities

AntiGravity utilizes **Nano Banana 2 (Gemini 3.1 Flash Image)** for image generation. It combines pro-level fidelity with extreme speed.

### Core Strengths

- **Text Rendering & Translation:** Generates accurate, legible text on images (marketing mockups, signs, greeting cards). Translates and localizes text within an image.
- **Subject Consistency:** Maintains character resemblance for up to 5 characters and the fidelity of up to 14 objects in a single workflow. Allows storyboarding without altering input appearance.
- **Production-Ready Specs:** Supports aspect ratios and resolutions from 512px to 4K for various use cases (vertical social posts, widescreen backdrops).
- **Advanced World Knowledge:** Powered by real-world knowledge from web searches to accurately render subjects, create infographics, turn notes into diagrams, and generate data visualizations.
- **Visual Fidelity:** Delivers vibrant lighting, richer textures, and sharper details.

## Standard Operating Procedure

### 1. Requirements Gathering

Before generating an image, you must have the following constraints explicitly defined:
- **Subject & Style:** Concrete visual description, desired lighting, and aesthetic tone.
- **Text:** The exact text string to render (if any).
- **Output Specifications:** Aspect ratio (e.g., 16:9 widescreen, 9:16 vertical, 1:1 square) and resolution.
- **Context/Continuity:** Any existing characters or objects that must be mathematically maintained in the frame.

### 2. Prompt Architecture

Draft prompts optimized for precise instruction following:
- **Explicit Text Mapping:** Wrap exact text in quotes and specify its physical location and style (e.g., A neon sign reading "Open 24/7" placed above a diner entrance).
- **Aesthetic Definition:** Use explicit textural and lighting keywords (e.g., vibrant lighting, rich textures, photorealistic, stylized pop-art, synthetic cubism).
- **Infographics & Diagrams:** Command the model to use its advanced world knowledge (e.g., A flat lay infographic depicting the water cycle).

### 3. Tool Execution

**If you are Antigravity (Gemini):**
- Call the `generate_image` tool using the formulated prompt.
- **ImageName:** Must be formatted as lowercase words separated by underscores (max 3 words). Example: `water_custom_infographic`.
- If editing or building upon previous generations, provide up to 3 absolute paths in `ImagePaths` to maintain subject consistency.

**If you are Claude Code:**
- Image generation is handled by **TheGraphicsAgent** — a running Express API at `http://localhost:3001`.
- Start it if needed: `cd /Users/alethea/Documents/AntiGravity/TheGraphicsAgent && npm run api`
- Call via `POST /api/generate-image` with `{ prompt, aspectRatio, style }`.
- Model: `gemini-3.1-flash-image-preview` (Nano Banana 2). Requires billing-enabled `GOOGLE_AI_API_KEY` in `TheGraphicsAgent/.env`.
- The UI is at `http://localhost:5173` (`npm run dev`) — hand the user the URL if they want to interact directly.

### 4. Verification & QA

Upon tool completion, review the generated artifact.
- Does the output text match the prompted string identically?
- Does the resolution/aspect ratio match production requirements?
If the artifact fails, regenerate with a corrected, more explicit prompt string. Present the final image to the user embedded in markdown.
