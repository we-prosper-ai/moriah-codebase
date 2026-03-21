---
name: creative-themes
description: >
  Approved visual color themes and style palettes for all AntiGravity creative output.
  Use whenever generating infographics, diagrams, slides, graphics, or any visual asset.
  Consult this skill BEFORE choosing colors for any visual generation to ensure brand
  consistency and Tina's approved energy. Load when using infographic, pptx,
  ai-image-diagram, or any visual skill. Also used when NotebookLM,
  or generate_image is about to run — any tool producing a visual output needs a theme first.
---

# AntiGravity Approved Color Themes

## Why This Matters

Colors carry energy. That is not a metaphor — it is operationally true. The wrong color palette on an infographic communicates the wrong feeling to the person looking at it, and Tina is extremely attentive to visual energy. A dark navy background with neon cyan accents says "developer conference." A warm cream background with teal and gold accents says "trusted expert who also has taste." These are different messages. In a business context, they attract different clients and build different trust.

This skill exists because AI tools will default to whatever looks impressive to a generic audience. Generic impressive is usually: dark background, glowing accents, electric blue, grid lines, and gradient text. That aesthetic is the visual equivalent of a stock photo smile — technically fine, immediately forgettable. Tina's work is not that.

The approved themes in this document are inspired by what actually works — the NotebookLM infographics that read as premium without being cold, the visual language of publications and design systems that get shared because they look like someone with opinions made them.

**Every agent, on every visual generation task, should load this skill first and select the appropriate theme before writing a single color value.**

---

## Core Principles (Read Before Choosing a Theme)

### 1. Light Backgrounds Are the Default

Unless explicitly building a technical architecture diagram for a developer audience, or Tina specifically asks for dark mode, use a light background. Cream, warm white, off-white, soft beige. The specific hex values are in each theme below.

Dark backgrounds are high-drama. They read as confident and technical. But they exhaust the eye quickly, they do not print well, and they carry an energy that says "this is about the tech" rather than "this is about you." For most of Tina's use cases — client proposals, educational content, coaching materials, presentations to decision-makers — warm light backgrounds are the correct choice.

The one exception: when we are making a diagram that lives inside a developer tool, or showing code architecture, or creating something explicitly for a technical audience who will view it on a screen in a dark environment. That's when **Deep Focus** (Theme 4) is appropriate. But it should be the conscious exception, not the default.

### 2. White Space Is Not Wasted Space

Among all the prompting mistakes made when generating infographics, the most common is not giving the AI explicit permission to leave space empty. Left to its own aesthetic judgment, the model will fill every inch — more icons, more labels, more connection lines, more detail. The resulting output looks "complete" but actually reads as cluttered and exhausting.

The NotebookLM infographics that look exceptional all have one thing in common: breathing room. Sections have generous padding. Cards have space around them. The eye can rest between pieces of information and take in each one before moving to the next.

When prompting any generative tool for an infographic, **always include the phrase "Use ample white space throughout" explicitly.** This is not a stylistic preference — it is the single most impactful instruction for infographic quality after color.

### 3. Two-Color Harmony + Neutrals

Every theme below follows the same structural logic: one warm accent color, one cool accent color, and the rest neutrals (cream, beige, warm gray, navy). This produces visual coherence without visual monotony. The warm and cool colors create contrast and interest. The neutrals give everything a stable foundation.

When you see a theme with "primary" (usually cool — teal, cyan, purple) and "accent" (usually warm — gold, coral, amber), those are the two colors that do the work. Everything else (background, surface, borders, secondary text) is neutral.

Resist the urge to add more colors "for variety." More colors create chaos. Two intentional colors create a system.

### 4. Typography Is Part of Color

Color palette is not just backgrounds and icons — the text colors matter just as much. In most traditional design contexts, body text is pure black (#000000). This is too harsh for warm, inviting visuals. Each theme specifies a "Text Primary" color that is a dark, rich navy or espresso — dark enough to read clearly, soft enough to not feel aggressive.

Use the theme's Text Primary consistently across all body copy. Use the Primary accent color for headings and key labels. Use the Accent color sparingly — pull-quotes, key metrics, calls to action, important callout boxes.

### 5. Consistency Across a Project

When a project generates multiple visuals (e.g., an infographic, a slide deck, and a website header), they should all use the same theme. This creates a cohesive visual identity for that project or client. Load this skill at the start of any multi-asset project and commit to a single theme for that project's outputs.

---

## Theme 1: "Warm Authority" ★★★ — The Default

**When to use this:** This is the right choice when you are not sure what to pick. It works for nearly every context — client proposals, educational content, marketing materials, process diagrams, social media, presentations to executives. It feels professional without feeling cold. It feels warm without feeling amateur. When in doubt, use Warm Authority.

**The energy it communicates:** Trustworthy. Knowledgeable. Approachable. Like a very good consultant or a premium editorial publication — someone who clearly knows what they are talking about, but who also thought about how the work would feel to receive.

**Inspired by:** The best NotebookLM research infographics. Clean, sectioned layouts with cream backgrounds and teal/gold accent systems.

### Palette

| Role | Name | Hex | Where to Use |
|------|------|-----|--------------|
| Background | Warm Cream | `#faf5ee` | The main canvas. Every section background. Any large open area. |
| Surface | Soft Beige | `#f0ebe3` | Cards, panels, callout boxes — one step darker than the main canvas to create gentle depth. |
| Primary | Teal | `#2c8c99` | Section headers, key labels, the most important headings, divider lines between sections. |
| Accent | Warm Gold | `#d4a853` | Pull-quotes, percentage numbers, metric callouts, badges, highlights. Use sparingly — this color earns attention. |
| Text Primary | Navy Ink | `#1a2b3d` | All body copy. Descriptions, captions, normal text throughout. |
| Text Secondary | Warm Gray | `#6b7280` | Subcaptions, helper text, anything that should not compete with primary content. |
| Success | Soft Green | `#4caf7d` | Checkmarks, completed items, positive indicators, "Pro" badges. |
| Alert | Warm Coral | `#e8734a` | Warnings, important callouts, "watch out for this" boxes. Not overused — only when truly needed. |
| Border | Blush Line | `#e5ddd4` | Very subtle borders between cards or sections. Should barely be visible — just enough to create structure. |

### Application Instructions

**For NotebookLM infographics:**
```
Warm cream background (#faf5ee), teal section headers (#2c8c99), warm gold highlights
(#d4a853) for key numbers and callouts, navy body text (#1a2b3d), coral for alerts
(#e8734a). Ample white space throughout. Professional and warm — not cold or corporate.
```

**For TheGraphicsAgent** (use style: `"infographic"`):
Paste the above color note into your prompt, including the phrase "Ample white space throughout. Warm cream background, not dark."

**For PPTX/Slide Decks (CSS variables):**
```css
:root {
  --color-bg: #faf5ee;
  --color-surface: #f0ebe3;
  --color-primary: #2c8c99;
  --color-accent: #d4a853;
  --color-text: #1a2b3d;
  --color-text-muted: #6b7280;
  --color-border: #e5ddd4;
}
```

---

## Theme 2: "Lavender Gradient" ★★☆ — For Creative & AI Work

**When to use this:** Creative projects, AI/tech topics that aren't pure infrastructure (so: an AI writing tool, an AI business coach, an elegant SaaS product — not a database architecture diagram). Modern startup visuals. Innovation showcases. Product overviews where you want the output to feel thoughtful and forward-thinking.

**The energy it communicates:** Creative, imaginative, modern, intelligent. Like the kind of product that makes you feel smarter for using it. Figma, Notion, Linear — this palette family.

**Inspired by:** The Stitch + AntiGravity infographic shown in the reference images. Lavender-to-sky-blue gradient washes, soft whites, purple and coral as a pair.

### Palette

| Role | Name | Hex |
|------|------|-----|
| Background | Near White | `#fdfbff` |
| Surface Wash | Lavender-to-Sky Gradient | `#f3e8ff` → `#e0f2fe` |
| Primary | Soft Purple | `#8b5cf6` |
| Secondary | Sky Blue | `#60a5fa` |
| Accent | Coral Pink | `#f472b6` |
| Text Primary | Deep Plum | `#2d1b4e` |
| Text Secondary | Mauve Gray | `#8b7fa3` |
| Border | Lilac Rule | `#e9d5ff` |

**NotebookLM prompt addition:**
```
Clean white background with soft lavender and sky-blue gradient washes (#f3e8ff to
#e0f2fe on section backgrounds). Purple (#8b5cf6) for headings and key elements,
sky blue (#60a5fa) for secondary accents, coral pink (#f472b6) for highlights.
Deep plum text (#2d1b4e). Light and airy — ample white space.
```

---

## Theme 3: "Clean Scholar" ★★☆ — For Educational & How-To Content

**When to use this:** Step-by-step guides, course materials, training infographics, workflow explanations, anything where the primary job is to teach something clearly. When structure and scannability matter more than warmth.

**The energy it communicates:** Organized, clear, trustworthy in a clinical way, like a very well-designed course guide or a premium textbook. The PHED course guide in the reference images used this energy.

### Palette

| Role | Name | Hex |
|------|------|-----|
| Background | Pure White | `#ffffff` |
| Surface | Cool Gray | `#f8f9fa` |
| Primary | Teal Cyan | `#00a0a0` |
| Secondary | Cool Blue | `#4a90d9` |
| Accent | Warm Orange | `#e8734a` |
| Text Primary | Charcoal | `#2d3436` |
| Text Secondary | Medium Gray | `#636e72` |
| Highlight BG | Soft Yellow | `#ffeaa7` |
| Border | Light Rule | `#dfe6e9` |

**NotebookLM prompt addition:**
```
Clean white background, teal-cyan and orange accents, organized grid layout with
clear section headers. Educational and clean — like a professional course guide.
Generous white space between sections.
```

---

## Theme 4: "Deep Focus" ★☆☆ — Technical/Dark Mode ONLY

**Use sparingly. This is not the default.** Only use Deep Focus when: the audience is developers or technical ops, the content is a system architecture diagram, or Tina explicitly asks for dark mode. Client-facing, marketing, coaching, and educational content should never use this theme.

**The energy it communicates:** Serious, technical, focused. High-contrast developer tool aesthetic.

### Palette

| Role | Name | Hex |
|------|------|-----|
| Background | Deep Navy | `#0f172a` |
| Surface | Slate | `#1e293b` |
| Primary | Cyan | `#06b6d4` |
| Accent | Amber | `#f59e0b` |
| Text Primary | Off White | `#f1f5f9` |
| Text Secondary | Slate Gray | `#94a3b8` |
| Success | Emerald | `#10b981` |
| Danger | Rose | `#f43f5e` |
| Border | Dark Rule | `#334155` |

---

## Theme 5: "Terra Firma" ★★☆ — For Coaching, Wellness & Faith Content

**When to use this:** Anything connected to personal growth, coaching, faith-based content, wellness, lifestyle, high-end artisanal products. When the content is about the human experience more than the tool or system. This theme says "I have thought deeply about this, and I am sharing it from a place of grounded wisdom."

**The energy it communicates:** Rooted, authentic, premium warmth. Like a thoughtful memoir, a well-made leather journal, or an excellent retreat program.

### Palette

| Role | Name | Hex |
|------|------|-----|
| Background | Warm Linen | `#faf6f1` |
| Surface | Sand | `#f0e6d8` |
| Primary | Terracotta | `#c67b5c` |
| Secondary | Sage | `#7d9b8a` |
| Accent | Deep Rust | `#a0522d` |
| Text Primary | Dark Espresso | `#3c2415` |
| Text Secondary | Warm Stone | `#8b7d6b` |
| Highlight BG | Pale Gold | `#f5e6c8` |
| Border | Clay Line | `#d4c4ae` |

**NotebookLM prompt addition:**
```
Warm linen background (#faf6f1), terracotta and sage accents, pale gold highlights.
Deep espresso text (#3c2415). Feels grounded, authentic, and premium — like a
beautifully produced printed book. Ample white space.
```

---

## Quick Selection Guide

| What are you making? | Default Theme |
|---------------------|---------------|
| Client proposal or report | Warm Authority |
| Marketing or sales infographic | Warm Authority |
| Social media graphic | Warm Authority or Lavender Gradient |
| AI/tech product overview | Lavender Gradient |
| Course or training material | Clean Scholar |
| Step-by-step how-to | Clean Scholar |
| System/API architecture | Deep Focus |
| Coaching or personal development | Terra Firma |
| Faith-based or purpose content | Terra Firma |
| Wellness or lifestyle | Terra Firma |
| You are not sure | Warm Authority — always |

---

## The Prompt Block System

Rather than rewriting color instructions from scratch each time, copy the appropriate block below and paste it directly into your generation prompt:

### Block 1 — Warm Authority
```
COLOR THEME — Warm Authority:
Background: warm cream #faf5ee | Cards/panels: soft beige #f0ebe3
Headers: teal #2c8c99 | Key numbers and highlights: warm gold #d4a853
Body text: navy ink #1a2b3d | Captions: warm gray #6b7280
Alerts/callouts: coral #e8734a | Borders: blush #e5ddd4
Ample white space throughout. Warm and professional — not corporate or cold.
```

### Block 2 — Lavender Gradient
```
COLOR THEME — Lavender Gradient:
Background: near white #fdfbff | Sections: lavender-to-sky gradient #f3e8ff → #e0f2fe
Primary headers: soft purple #8b5cf6 | Secondary: sky blue #60a5fa
Highlights: coral pink #f472b6 | Body text: deep plum #2d1b4e
Borders: lilac #e9d5ff | Ample white space. Creative and modern.
```

### Block 3 — Clean Scholar
```
COLOR THEME — Clean Scholar:
Background: white #ffffff | Alternating sections: cool gray #f8f9fa
Primary: teal cyan #00a0a0 | Secondary: cool blue #4a90d9
Highlights/numbers: warm orange #e8734a | Body text: charcoal #2d3436
Callout backgrounds: soft yellow #ffeaa7 | Borders: light rule #dfe6e9
Organized grid layout. Educational and clean.
```

### Block 4 — Deep Focus (Dark)
```
COLOR THEME — Deep Focus:
Background: deep navy #0f172a | Cards: slate #1e293b
Primary: cyan #06b6d4 | Accent: amber #f59e0b
Body text: off white #f1f5f9 | Muted text: slate gray #94a3b8
Success: emerald #10b981 | Danger: rose #f43f5e | Borders: dark rule #334155
```

### Block 5 — Terra Firma
```
COLOR THEME — Terra Firma:
Background: warm linen #faf6f1 | Cards: sand #f0e6d8
Primary: terracotta #c67b5c | Secondary: sage #7d9b8a
Deep accent: rust #a0522d | Body text: espresso #3c2415
Callout backgrounds: pale gold #f5e6c8 | Borders: clay #d4c4ae
Grounded, authentic, warm. Ample white space.
```

---

## What "Ample White Space" Actually Means for Prompting

When you include "ample white space" in a prompt, you are instructing the generative tool to do the following:

- **Padding inside cards:** At least 16px of internal padding on all sides of any card or box. For large cards, 24px or more.
- **Margin between sections:** At least 32px between major content sections. Sections should feel separated, not stacked.
- **Text density:** No text block should run wider than 60% of the infographic width. If a section needs to convey a lot of information, break it into smaller cards rather than creating a text wall.
- **Icon breathing room:** Icons should have clear space around them — they should not feel crammed between labels.
- **The "squint test":** If you squint at the infographic and it looks like a dense block of color/text, there is not enough white space. You should be able to make out distinct sections and cards even when squinting.

Always pair "ample white space" with a specific color for that space (e.g., "the white space background is warm cream #faf5ee"). Generic AI models sometimes interpret "white space" literally as pure white (#ffffff) even when the background should be cream.

---

## A Note on Iteration

The first generation from any tool is never the final output. It is a starting point. The standard workflow is:

1. Generate using the appropriate theme and prompt blocks above
2. Show to Tina
3. Tina identifies what feels off — usually it's one of: too dark, too dense, wrong proportions, a label that got cut off, or a missed connection
4. Adjust the prompt with the specific note ("make the background warmer," "reduce the text in the right column," "the diagram arrow direction is wrong")
5. Regenerate

This is not inefficiency. This is how good visual design works. The themes dramatically reduce the number of iteration cycles needed, but one or two passes is normal and expected.
