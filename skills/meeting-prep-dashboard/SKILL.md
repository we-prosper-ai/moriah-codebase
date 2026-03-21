# 🧠 Automated Meeting Prep Dashboard Generator

A complete pipeline using NotebookLM to generate deep research, artifacts, and a gorgeous glassmorphic HTML dashboard for meeting prep. Takes a company/meeting context and builds a local presentation website.

<details>
<summary>Automated Meeting Prep Framework</summary>

This skill dictates how to operate as an elite intelligence analyst and engineer, automatically building a comprehensive web dashboard full of deep-researched artifacts for any upcoming meeting or company target, leveraging the NotebookLM MCP tools.

## 🎯 The Goal

Take a raw input (a company name, domain, and/or meeting context) and transform it into a ready-to-view, high-end "Meeting Prep Dashboard" folder containing:

- A suite of AI-generated Markdown documents (briefing, competitive intel, research report, quiz, flashcards).
- Downloaded media artifacts (audio podcast MP3, market infographic PNG).
- A beautiful, offline-ready HTML dashboard unifying everything for the executive.

## 👤 Business Context — Who This Is For

Tina Marie is a business strategist with 29 years of word-of-mouth client acquisition. She charges $15,000-$20,000+ per engagement, works 6 hours per week generating ~$250,000/year in 1:1 consulting. She does not take calls for anything under $15k-$20k. Every meeting she walks into must demonstrate she already understands the prospect's business better than they expected.

**Meeting types this skill serves:**
- **Discovery calls** with potential high-ticket clients (most common trigger)
- **Strategic sessions** with existing clients where she needs updated competitive intel
- **Partnership meetings** where she evaluates whether a company/person aligns with her values and mission
- **Speaking/podcast appearances** where she needs deep context on the host's audience and platform

**What Tina needs from a prep dashboard:**
- Enough intel to ask questions the prospect didn't expect her to know to ask
- Competitive landscape so she can position her frameworks against what they've already tried
- Financial signals (funding, revenue model, growth stage) so she knows their budget reality
- Culture and leadership signals so she can assess value alignment before committing

## ⚡ Trigger Details

Input can come from any of the following sources:

- **Notion Agent Tasks board:** A task with meeting context assigned to Antigravity or Either (database ID: `50b154db458a4ce29ff60a233af6804e`)
- **n8n automation:** Watching Google Calendar for new "Discovery Call" events and firing a payload with the company name
- **Manual prompt:** The user simply types a company name and meeting context directly
- The input payload should contain at minimum: `company_name`, and optionally: `company_domain`, `meeting_date`, `meeting_type`, `contact_name`, `contact_title`.

</details>

## 🔁 Step-By-Step Execution Pipeline

### Phase 0: Agent Pre-Research (Data Enrichment)

Before relying on NotebookLM, the autonomous agent must do its own groundwork to create high-quality "seed data." NotebookLM's outputs are only as good as the sources you feed it — garbage in, garbage out.

#### Step 0.1 — Website Scrape

Use web scraping tools (Firecrawl, Exa, Tavily, or Apify via MCP) to read the company's official website. Target these specific pages:

- About / Company page
- Products / Services / Platform page
- Pricing page (if public)
- Team / Leadership page
- Blog / News / Press page
- Careers page (reveals growth stage and tech stack)

#### Step 0.2 — External Enrichment

Search the broader web to find:

- LinkedIn company page (employee count, recent posts, hiring activity)
- Crunchbase or PitchBook data (funding rounds, investors, valuation)
- Recent news articles, press releases, or founder interviews (last 6 months)
- Wikipedia page (if it exists)
- Glassdoor or similar (company culture signals)
- Any YouTube videos featuring the company or its founders

#### Step 0.3 — Synthesize Company Profile

Combine all scraped data into a single, highly distilled "Company Profile" text document. This document should include:

- Company name, HQ location, founding year
- CEO/founder names and backgrounds
- Employee count range
- Funding history (rounds, amounts, lead investors)
- Revenue model (SaaS, services, hybrid, marketplace)
- Core products/services (with brief descriptions)
- Key clients or case studies mentioned on their site
- Direct competitors (named on their site or obvious from market position)
- Recent news highlights (last 2-3 significant events)
- The meeting context (why are we meeting them? what do they want from us?)

💡 _This profile becomes the foundational "seed" for NotebookLM. It ensures the AI never hallucinates because it starts with verified facts._

### Phase 1: Notebook Preparation & Initial Ingestion

This phase creates the isolated knowledge brain for this specific client.

#### Step 1.1 — Create Notebook

```bash
notebooklm create "Meeting Prep - [Company Name]"
```

#### Step 1.2 — Inject Seed Data as Text Source

Using the new notebook, inject the synthesized company profile:

```bash
notebooklm source add-text "[Company Name] — Company Profile" "[the synthesized Company Profile from Phase 0.3]"
```

#### Step 1.3 — Add Scraped URLs as Sources

For each high-quality URL found during Phase 0 (company website, Wikipedia, key news articles), add them individually:

```bash
notebooklm source add-url "[each URL]"
```

ℹ️ _Add 3-8 of the best URLs. Don't add more than 10 here — deep research will find more._

### Phase 2: Autonomous Deep Research (NotebookLM Web Search)

This is where NotebookLM's killer feature kicks in — it autonomously searches the web for 40-100+ additional sources about the company and their industry.

#### Step 2.1 — Start Deep Research

```bash
notebooklm research start "[Company Name] competitive landscape market trends [industry] [region] 2025 2026"
```

> Wait until the status is complete using `notebooklm research wait` before doing anything else.

#### Step 2.2 — Batch Import Sources (CRITICAL)

You must batch import sources so as not to overwhelm MCP or CLI limits. Pick chunks of 20:

```bash
notebooklm research import --indices "0-19"
# sleep 3
notebooklm research import --indices "20-39"
# ...and so on
```

⚠️ _Important: Wait a few seconds between each batch to let NotebookLM process the incoming sources._

### Phase 3: Artifact Generation & Extraction

Now the notebook has a rich, comprehensive knowledge base. Use NotebookLM's querying and studio features to generate the output artifacts.

#### Step 3.1 — Executive Briefing (01_briefing_doc.md)

```bash
notebooklm ask "Create a comprehensive executive pre-meeting briefing document with these exact sections: 1) Company Overview (background, size, leadership, financials, business model, core products, key clients, recent developments, meeting context), 2) Competitive Landscape (name each competitor, their approach, and the client's advantage), 3) Market Opportunity (specific dollar figures, growth rates, and government initiatives), 4) Key Talking Points (numbered, actionable conversation starters), 5) Handling Objections (table format with Objection and Response columns), 6) Recommended Next Steps (3 concrete follow-up actions)." > 01_briefing_doc.md
```

#### Step 3.2 — Deep Research Report (02_deep_research_report.md)

```bash
notebooklm ask "Write a deep research report summarizing the macro trends affecting this company's industry over the next 2 years. Include a table of the top 10 most important sources discovered, with columns for Source Name and Why It Matters. Then summarize the key themes assessed." > 02_deep_research_report.md
```

#### Step 3.3 — Competitive Intelligence (03_competitive_intel.md)

```bash
notebooklm ask "Create a rapid competitive intelligence cheat sheet formatted as: Top 3 Things to Know (each with a bold headline, 3-4 bullet points of evidence, and a 'Your angle' recommendation), followed by a 'Market Numbers to Drop in Conversation' section listing 7-10 specific statistics with dollar signs and percentages." > 03_competitive_intel.md
```

#### Step 3.4 — Market Infographic (04_market_infographic.png)

Generate a visual infographic:

```bash
notebooklm artifact generate infographic
# And wait until ready
notebooklm artifact wait
notebooklm artifact download infographic "04_market_infographic.png"
```

#### Step 3.5 — Audio Briefing Podcast (audio_briefing.mp3)

Generate a short podcast representing the briefing:

```bash
notebooklm artifact generate audio --format brief --length short
# And wait until ready
notebooklm artifact wait
notebooklm artifact download audio "audio_briefing.mp3"
```

#### Step 3.6 — Knowledge Quiz (06_pre_call_quiz.md)

```bash
notebooklm artifact generate quiz --count 8 --difficulty medium
# And wait until ready
notebooklm artifact wait
notebooklm artifact download quiz "06_pre_call_quiz.md"
```

#### Step 3.7 — Flashcards (07_flashcards.md)

```bash
notebooklm artifact generate flashcards --difficulty medium
# And wait until ready
notebooklm artifact wait
notebooklm artifact download flashcards "07_flashcards.md"
```

#### Step 3.8 — Slide Deck (08_slide_deck.pdf) [Optional]

```bash
notebooklm artifact generate slide-deck --format detailed
# And wait until ready
notebooklm artifact wait
notebooklm artifact download slide-deck "08_slide_deck.pdf"
```

### Phase 4: Index File Generation

Create a `00_INDEX.md` file that serves as the table of contents for the prep folder:

```markdown
# Meeting Prep Package: [Company Name]

**Generated:** [timestamp]
**Meeting Date:** [date]
**Meeting Type:** [type]

## Downloaded Files

| #   | File                       | Description                             |
| --- | -------------------------- | --------------------------------------- |
| 1   | 01_briefing_doc.md         | Executive pre-meeting briefing          |
| 2   | 02_deep_research_report.md | Deep research summary with source table |
| 3   | 03_competitive_intel.md    | Competitive intelligence cheat sheet    |
| 4   | 04_market_infographic.png  | Visual market landscape infographic     |
| 5   | 06_pre_call_quiz.md        | Knowledge test (8 questions)            |
| 6   | 07_flashcards.md           | Rapid-review flashcards                 |
| 7   | audio_briefing.mp3         | AI podcast briefing                     |
| 8   | index.html                 | Interactive dashboard                   |

## How to Use

1. Open `index.html` in your browser for the full interactive experience
2. Or run `python3 -m http.server 8888` in this folder and visit localhost:8888
3. Listen to `audio_briefing.mp3` on your commute
4. Review `01_briefing_doc.md` for a 3-minute text summary
```

### Phase 5: Constructing the Premium HTML Dashboard

Package all artifacts into a single interactive HTML dashboard.

#### Step 5.1 — Create Output Folder

Create a folder named `Meeting Prep - [Company Name]` in the current working directory, and move all exported files inside it.

#### Step 5.2 — Build the HTML Dashboard (`index.html`)

The dashboard must include ALL of the following:

- Navbar with "Antigravity OS" branding, meeting date badge, and Export PDF button
- Header with company name, subtitle, and embedded audio player with animated visualizer bars
- Sidebar navigation with 6 tabs: Executive Briefing, Competitive Intel, Deep Research, Knowledge Test, Flashcards, Market Infographic
- Content area that dynamically renders markdown content for the first 3 tabs using `marked.js`
- Critical implementation details for the dashboard:
  - 1. Markdown tabs (Briefing, Intel, Research): Store the raw markdown inside `<script type="text/markdown" id="md-[tabname]">` blocks. Use `marked.js` to parse and render them when the tab is clicked.
  - 2. Quiz tab: Do NOT render via markdown — build an interactive quiz with:
    - Question cards with clickable radio-button options
    - Green ✓ / Red ✗ visual feedback on answer selection
    - Score counter that appears after all questions are answered
    - Questions sourced from the downloaded quiz file
  - 3. Flashcards tab: Do NOT render via markdown — build an interactive flashcard component with:
    - 3D flip animation (CSS perspective + rotateY(180deg))
    - Purple gradient front (Question), gold accent back (Answer)
    - Left/right arrow navigation with card counter
    - Progress dots below the card
    - Content sourced from the downloaded flashcards file
  - 4. Market Infographic tab: Do NOT render via markdown (the `<img>` tag will get escaped). Render natively with a JS function that returns HTML with the `<img>` tag pointing to `04_market_infographic.png`.
  - 5. Audio player: `<audio>` element pointing to `audio_briefing.mp3` with play/pause toggle button and animated visualizer bars.
  - 6. Styling requirements:
    - Dark mode: background `#08080c` with purple/blue radial gradients
    - Glassmorphism: `backdrop-filter: blur(10px)`, transparent white backgrounds, subtle borders
    - Font: Inter from Google Fonts
    - Icons: Font Awesome 6
    - CSS framework: Tailwind CSS via CDN
    - Markdown styling: Custom CSS for h1-h3, p, ul, li, strong, a, table, th, td within `.markdown-content`

#### Step 5.3 — Start Local Server (Optional)

```bash
cd "Meeting Prep - [Company Name]"
python3 -m http.server 8888
# Then open http://localhost:8888/index.html
```

## 📐 Guiding Principles & Constraints

### 🔴 Batch Imports (Non-Negotiable)

Never attempt to bulk-import 100+ sources from deep research at once. Always iterate in chunks of 20 using the indices parameter in `notebooklm-py`. Wait 2-3 seconds between batches.

### 🟡 Fail Gracefully

- If flashcards studio output is too thin (fewer than 8 cards), automatically regenerate via simple ask with an explicit prompt for 10 Q&A pairs, and append them back.
- If infographic generation fails, skip it and note it in the INDEX file. The dashboard should still work without it.
- If audio generation is still processing after 5 minutes, move on and note it as "generating" in the INDEX.

### 🎨 Aesthetics Are Non-Negotiable

The HTML dashboard must feel premium — dark modes, glassmorphism, smooth transitions, crisp typography, animated elements. It should look like a product, not a prototype. Use the AntiGravity brand palette: deep purple gradients, white/gold accents.

### 🔐 Data Isolation

Each client/meeting gets its own NotebookLM notebook. Never reuse notebooks across clients. This prevents data contamination and hallucination.
