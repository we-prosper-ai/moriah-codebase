---
name: sellthis-ai-websites
description: Executes the complete end-to-end $8,000 AI Website Generation and Outreach pipeline mapped from the master AntiGravity + Stitch transcript. Use this whenever the user wants to generate, clone, optimize, or deploy niche local business websites programmatically.
---

# $8,000 AI Websites (SellThisAIWebsites Pipeline)

## Core Directive

Whenever the user wants to identify leads, build web apps, or clone a working website architecture for a specific niche (e.g. pool cleaners, HVAC, tree surgeons), execute this autonomous pipeline step-by-step.

This skill leverages Python modules located in `/Users/alethea/Documents/AntiGravity/SellThisAIWebsites/src/modules/` or orchestrates a complete run using `run_pipeline.sh`.

## Primary Components

### 1. Lead Generation & Scraping (`step1_lead_scraper.py`)

**When to Use:** To scrape a location for niche business information (name, rating, website, address).
**Execution:** Uses the Apify API (`compass/google-maps-scraper`).
**Constraint:** Make sure an API Key is set in the environment or MCP profile.
**Wait Condition:** Wait until the JSON outputs a `raw_leads.json` list of local businesses before proceeding to enrichment.

### 2. Lead Enrichment (`step2_data_enricher.py`)

**When to Use:** To locate verified business email profiles for an outreach campaign.
**Execution:** Consumes `raw_leads.json` and hits the AnyMailFinder API.
**Output Requirement:** Outputs `enriched_leads.csv` ensuring only valid domains + verified emails are mapped.

### 3. Base Generation (AI Studio Route) (`step3_web_generator.py`)

**When to Use:** To construct initial single-page HTML/CSS local service blueprints tailored to each client in the enriched CSV list.
**Architecture:** Takes raw text and generates an `index.html` payload for every output folder (e.g., `generated_sites/site_1`, `generated_sites/site_2`).

### 4. UI/UX Optimization + GitHub/Vercel Deployer (`step4_uiux_deployer.py`)

**When to Use:** To push local web codebase structures into public domain routing.
**Procedure:**

1. The script will mimic injecting accessibility/UI rules onto components.
2. It pushes the repository to GitHub.
3. Automatically triggers Vercel serverless deployment endpoints.
4. Returns a unique, live Vercel URL which is ready integration into an email outreach sequence.

### 5. Advanced Stitch Flow (`step5_stitch_generator.py`)

**When to Use:** For multi-page components (e.g., App dashboards, detailed multi-route structures).
**Action:** Executes the Google Stitch Model Context Protocol logic, dispatching a structured structural payload rather than standard raw HTML strings.

### 6. Universal "Re-skin" / Clone Engine (`step6_clone_configurator.py`)

**When to Use:** When cloning one 'master' codebase design visually across multiple different companies programmatically.
**Requirements:** It builds unified `siteconfig.json` configuration structures for each sub-client so parent variables (like main themes, business name tags, hero images, logo tags) are overridden recursively at compile-time instead of manually written.

## Master Execution

If the user says: "Run the full website generation sequence for [niche]", directly traverse to the root project folder and execute the shell automation script:

```bash
cd /Users/alethea/Documents/AntiGravity/SellThisAIWebsites
./run_pipeline.sh
```

**Outreach Transition:** After completion, remind the user that the generated Vercel deployment URLs can dynamically be passed via Instantly campaigns linked to their Google Workspace profiles.
