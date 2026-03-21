---
name: ui-sniping
description: Extracts and integrates high-end visual UI components into user websites. Use when the user wants to "snipe", extract, clone, or copy a UI component from CodePen, 21st.dev, or an existing website.
---

# UI Sniping Protocol

The definitive workflow for finding, extracting, and cleanly injecting premium user interface (UI) components into existing applications or GoHighLevel funnels.

## When to use this skill

- The user points out a UI element natively designed on `21st.dev`, `codepen.io`, or any URL and asks you to add it to their site.
- The user mentions "UI Sniping", "component extraction", or cloning a micro-interaction.
- The user has a beautiful UI component they want translated into `GoHighLevel` HTML/JS formatting.

## Extraction Methods

### Method A: Component Libraries (21st.dev / CodePen)

When pulling components from modern libraries that offer raw code (like `21st.dev`):

1. **Get the Code/Link**: Ask the user to provide the share link (e.g., "Share Component" on 21st.dev) or to paste the prompt/code provided by the site.
2. **Integration Request**: If the user pastes a large glob of code, ensure it aligns with the local stack framework.
3. **Responsive Implementation**: Do not just paste the code; meticulously weave the new HTML/CSS/JS into the existing project structure, verifying any required animations or dependencies.

### Method B: Wild HTML Extraction (Any Website)

When the user wants a structural replica of a component from an arbitrary site (e.g., an aesthetic pricing card or interactive view):

1. **Extract**: The user will use an HTML website extractor tool to download the specific element's source code.
2. **Reverse Engineer**: The user uploads the `HTML/CSS` payload file to you.
3. **Rebuild & Reskin**: Parse the logic. Rebuild it cleanly without any hardcoded tracking scripts or broken external stylesheets. Example Prompting Rule: Use instructions like: _"Using the attached HTML, build me a [color] version of [thing] that looks even more epic."_

## The GoHighLevel Output Conversion Pipeline

GoHighLevel (GHL) funnel builders require custom code blocks (HTML/JavaScript). Native React components or scoped CSS from modern frameworks will break.

1. **Final Component Completion**: Ensure the designed interaction works correctly in a standalone HTML file (`index.html` + inline CSS/JS).
2. **Transpile Request**: Convert all structure into pure Vanilla HTML, CSS, and JavaScript. Combine `<style>` and `<script>` tags directly into the same block.
3. **The GHL Handoff**: Give the user the generated singular file block. Tell them:
   _"Open the GoHighLevel Page Builder, Add a 'Custom HTML/JS' Element, open the Code Editor, and paste this entire block."_

## The UI Sanity Checklist

Before delivering final code to the user, ensure:

- [ ] No remote, domain-locked APIs or fonts are failing (replace with Google Fonts/CDN resources).
- [ ] Z-indexes are logical so CTAs remain clickable.
- [ ] Output is purely HTML/CSS/JS if deploying directly to GoHighLevel Custom Blocks.
