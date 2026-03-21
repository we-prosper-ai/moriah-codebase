---
name: ai-optimization-assessment
description: Produces client-facing AI optimization assessment reports with competitive intelligence, schema auditing, market research, and implementation roadmaps delivered as professional PDF documents. Claude reads this skill when a client's website needs to be evaluated for AI search engine visibility, when competitive schema analysis is required across geographic markets, or when Tina asks to build an assessment report for a client. This skill does not belong to the COO offer-building sequence. It is a standalone client services deliverable.
---

# AI Optimization Assessment

This skill governs how Claude produces AI optimization assessment reports for Tina's consulting clients. The report evaluates how well a business's digital presence is structured for AI search engines, compares that presence against direct competitors, and delivers a phased implementation plan with ready-to-deploy schema templates.

The deliverable is a professional PDF document bearing Tina's name and branding. Every data claim in the report traces to a named source. Every competitive score traces to a direct site crawl. The report is designed to sell the implementation work by making the gap between the client's current state and their potential state undeniable.

---

## When This Skill Applies

Claude reads this skill when Tina provides a client's website URL and asks Claude to evaluate it for AI search visibility, when Tina asks Claude to build a competitive analysis or assessment report, when the phrase "AI optimization" or "AI readiness" appears in the context of a client engagement, or when Tina references the previous reports produced for consulting clients.

This skill can also be triggered when Tina wants to evaluate a prospective client's site before a sales conversation, since the report itself functions as a sales tool.

---

## Relationship to Other Skills

This skill operates independently from the COO offer-building sequence. It is a client services execution skill, not part of Tina's own product pipeline.

Claude reads **writing-standards** before producing the report because the report is a written artifact that will be shared with clients and referenced repeatedly.

Claude reads **pdf** (the public skill at /mnt/skills/public/pdf/SKILL.md) before generating the PDF because the report uses ReportLab and the PDF skill contains current best practices for file creation.

Claude reads **humanizer** before finalizing the report prose to ensure the language does not read as AI-generated, because the report carries Tina's name and must sound like a consultant wrote it.

Claude reads **clarity-check** before finalizing because any ambiguity in the report undermines the client's trust and ability to act on the recommendations.

If the client has a defined audience avatar in the system, Claude reads **audience-writing** to adapt the report's tone and framing to that audience. In most cases the audience is the client's decision-maker (business owner, managing partner, marketing director), and the report should be written at an executive level with technical depth available in the appendices.

---

## What This Skill Produces

The output is a single PDF file with the following structure. The structure is not optional. Every section must appear in every report. The section names may be adapted to the client's industry, but the function of each section is fixed.

### Cover Page

The cover page contains the report title ("AI Optimization Assessment"), the subtitle ("Market Research & Competitive Intelligence Report"), the client's business name, a one-sentence hook that frames the core question the report answers, a two-to-three sentence summary of what the report contains, the date, the preparer line ("Prepared by Tina Marie"), and a confidentiality notice.

The hook must be industry-specific and framed as a question the client's potential customers are asking. For a personal injury law firm, the hook is "When accident victims ask AI for help finding a lawyer, which firm gets recommended?" For a garage door company, the hook is "When a homeowner asks AI who can fix their garage door today, does your company get named?" The hook establishes the stakes in one sentence.

### Part 1: The Narrative Shift

Part 1 explains, in plain language, what is changing about how consumers find businesses. Claude writes this section for a reader who understands their industry deeply but may not understand how AI search engines work. The section covers three things in this order: first, a concrete scenario showing how a potential customer now uses AI instead of traditional search to find a provider in the client's industry; second, a statement of what determines which businesses get named by AI (structured data, not ad spend); third, a bridge to the client's specific situation showing that the client has strong fundamentals (experience, reviews, credentials, results) but that AI systems cannot see those fundamentals because they are not structured in a machine-readable format.

This section must not use jargon like "schema markup" or "JSON-LD" or "structured data" without immediately explaining what those terms mean in practical terms. The reader should finish Part 1 understanding the threat, understanding the opportunity, and understanding that the problem is fixable.

### Part 2: AI Search Market Research

Part 2 presents sourced data about the shift from traditional search to AI-assisted search. Every data point must include the source organization's name, the date of the data, and the methodology used (sample size, measurement approach). Where a number is an estimate or prediction rather than a direct measurement, the report must say so explicitly.

Part 2 contains the following data sections, each presented as a table with source citations:

**Zero-click search data** shows the percentage of searches that end without a click to any website, tracked over time. This establishes that even within traditional Google search, fewer clicks reach businesses. The current best sources are SparkToro/Datos clickstream analysis and Similarweb measurements.

**AI search adoption data** shows the current market share of AI search tools (ChatGPT search, Perplexity, Google AI Overviews) and the trajectory of adoption. This establishes that AI search is small but growing fast. The current best sources are SparkToro/Datos for AI tool share, Opollo for ChatGPT-specific share, Semrush for AI Overviews trigger rates, and StatCounter for overall search market share.

**Click-through rate impact data** shows what happens to organic and paid click-through rates when AI Overviews appear, and what happens when a business is cited within an AI Overview versus not cited. This is the data that makes the case for action: businesses not cited lose traffic, businesses cited gain traffic. The current best source is Seer Interactive's analysis of 3,119 queries across 42 organizations.

**Industry-specific lead economics** shows the cost per click, cost per lead, and cost per acquired customer in the client's specific industry, using named sources. This section translates abstract search trends into dollars the client understands. For personal injury law, the sources include National Law Review, Majux PPC Benchmarks, OptimizeMyFirm LSA studies, Legal Leads Group, and CasePeer. For other industries, Claude must search for equivalent sources and cite them. If reliable sources do not exist for a specific vertical, Claude states that directly rather than estimating.

**Schema adoption data** shows the percentage of websites with schema markup, the percentage of page-one Google results that use schema, and any available data on click-through rate improvements from schema implementation. The current best sources are Web Data Commons (peer-reviewed, University of Mannheim), Backlinko, BrightLocal, Milestone Research, and Google's own structured data success stories.

**Analyst predictions** may be included but must be clearly labeled as predictions with the analyst's name, title, organization, and date. Predictions are included because they shape industry behavior, not because they are guaranteed to be accurate.

Claude must refresh these data sources for each report by conducting new web searches. Data older than 12 months should be replaced with newer sources when available. If a previously cited source has been updated, Claude uses the updated version. Claude must never recycle data from a previous report without verifying it is still the most current version available.

### Part 3: Competitive Intelligence

Part 3 is the section that sells the implementation work. It shows the client exactly where they rank against named competitors on specific, measurable factors, and it shows what the gap looks like.

**Evaluation Framework.** The report scores businesses on seven factors, each rated 0 to 10, for a maximum score of 70. The seven factors and what they measure are:

The first factor is Schema Markup Quality, which measures the presence, correctness, and completeness of structured data on the business's website. A score of 0 means the site has no JSON-LD blocks at all. A score of 3-4 means the site has basic Organization or WebSite schema but with errors, omissions, or plugin conflicts. A score of 7-8 means the site has Organization, LegalService or LocalBusiness (industry-appropriate type), and aggregateRating schema that is correctly structured. A score of 10 means the site has comprehensive, error-free schema including Organization, industry-appropriate types, aggregateRating with accurate review counts, Service types for each offering, and proper entity linking via @id references.

The second factor is Entity Profile, which measures whether the business's key people (founders, lead practitioners, principals) are declared as Person entities in schema and linked to the Organization entity. A score of 0 means no Person schema exists. A score of 5 means a Person entity exists but lacks credentials, awards, or is not linked to the Organization via @id. A score of 10 means each key person has a Person entity with name, jobTitle, worksFor linked to Organization, alumniOf, knowsAbout, award, and hasCredential declarations.

The third factor is Location Pages, which measures whether each physical location has a dedicated page with LocalBusiness or equivalent schema containing unique address, phone, geo coordinates, areaServed, and openingHoursSpecification. A score of 0 means no location-specific schema exists. A score of 5 means location pages exist but lack schema or have generic content. A score of 10 means each location has a dedicated page with correctly structured LocalBusiness schema, unique content, and parentOrganization linking to the main entity.

The fourth factor is Content Depth, which measures the volume and quality of indexable content that answers questions a potential customer might ask. This includes blog posts, guides, case results, service descriptions, and FAQ content. A score of 0 means minimal content (homepage and a few pages). A score of 5 means moderate content (dozens of pages with some depth). A score of 10 means extensive content library with hundreds or thousands of pages targeting specific queries, with proper Article schema and author attribution.

The fifth factor is FAQ Structure, which measures whether question-and-answer content is declared as FAQPage schema so that AI systems can serve the answers directly. A score of 0 means no FAQPage schema exists anywhere on the site, even if FAQ content exists in plain HTML. A score of 5 means FAQPage schema exists on some pages but not on service or practice area pages where it would be most valuable. A score of 10 means FAQPage schema is deployed on the main FAQ page and on every service or practice area page with 3 to 5 questions per page targeting queries people actually ask AI.

The sixth factor is Review Verification, which measures the presence of reviews on third-party platforms with verifiable links (Google Business Profile, Yelp, industry-specific platforms like Avvo or Martindale for law, Angi or HomeAdvisor for home services) and whether those reviews are declared in aggregateRating schema. A score of 0 means no third-party reviews found or reviews exist but zero are declared in schema. A score of 5 means reviews exist on multiple platforms but aggregateRating in schema is missing, inaccurate, or self-reported without third-party verification. A score of 10 means hundreds of verified reviews across multiple platforms with accurate aggregateRating declared in schema and sourced from verifiable third-party platforms.

The seventh factor is Cross-Platform Consistency (NAP), which measures whether the business's Name, Address, and Phone number are identical across all platforms and directories where the business appears. A score of 0 means significant inconsistencies exist (different names, old addresses, multiple phone numbers with no clear primary). A score of 5 means mostly consistent with minor variations (abbreviation differences, suite number inconsistencies). A score of 10 means identical NAP data across all platforms, directories, schema declarations, and social profiles.

**Competitor Identification.** Claude identifies 5 to 10 direct competitors in each geographic market the client operates in. Competitors are identified through web search for the client's primary service in each market (for example, "personal injury lawyer Phoenix" or "garage door repair Gilbert AZ"), through reviewing the client's paid search competitive landscape if available, and through asking Tina if she knows specific competitors to include. Claude does not limit the competitive set to only the top search results. Claude also includes any competitor that Tina names specifically, regardless of search ranking.

**Schema Crawl Methodology.** Claude crawls each competitor's homepage using curl to download the HTML, then extracts all JSON-LD blocks using a Python script that applies the following regular expression: `r'<script[^>]*application/ld\+json[^>]*>(.*?)</script>'` with the `re.DOTALL` flag. For each JSON-LD block found, the script parses the JSON and extracts the @type declaration (handling both single types and arrays of types), any @graph structures (iterating through each item in the graph), aggregateRating values (ratingValue and reviewCount), address fields (checking for correct field mapping), areaServed declarations, Person entities, and FAQPage declarations.

Claude then checks for FAQPage presence in the full HTML (not just JSON-LD) using a simple string search, because some sites declare FAQ content in microdata or RDFa rather than JSON-LD.

Claude records every finding from every crawl. The report includes a summary table, but the raw findings must be available if Tina or the client asks for detail.

When a client operates in multiple geographic markets, Claude conducts a separate competitive analysis for each market. Each market gets its own competitive ranking table in the report. After all markets have been analyzed, a cross-market summary table shows the client's rank, projected post-implementation rank, and nearest competitor in every market simultaneously.

**Scoring.** Claude scores each competitor and the client on the seven factors based on what the crawl and web search reveal. Claude documents the reasoning for each score in working notes. The report shows only the scores and totals, not the per-factor reasoning, unless a specific score needs explanation (such as when a competitor's score is surprising).

**Projected Scores.** After scoring the client's current state, Claude projects what the client's score would be after implementing the recommendations in the report. The projected score is calculated by assuming each implementation phase is completed and re-scoring the affected factors. The projected scores are presented as a progression table showing the score after each phase.

**Competitor Profile Table.** When the competitive set includes firms of varying size and prominence, the report includes a separate table showing each competitor's key business metrics: revenue or recovery amounts (if publicly available), review counts (actual, not schema-declared), number of offices, number of employees or practitioners, and whether they declare reviews in schema. This table provides context for the scoring table by showing that large, well-funded competitors still have poor schema implementations.

### Part 4: Strengths and Gaps

Part 4 presents two things: what the client already has that most competitors do not, and what gaps are preventing AI systems from seeing those strengths.

The strengths section lists every verifiable asset the client has that creates trust signals when properly structured. These include content volume (number of blog posts, guides, case results), credentials (awards, certifications, years of experience, education, professional memberships), reviews (counts by platform with links), geographic presence (number of offices, states served), case results or project outcomes (documented dollar amounts or metrics), and team depth (number of practitioners with documented specializations).

The gaps section presents a table with three columns: the gap itself (what is missing or broken), the priority level (CRITICAL, HIGH, MEDIUM, or LOW), and the impact (a specific statement of what the gap causes in terms of how AI systems misread the business). CRITICAL gaps are problems that are actively harming the business right now, such as incorrect address fields or wildly inaccurate review counts in schema. HIGH gaps are missing infrastructure that prevents AI from seeing major assets, such as no location-specific schema for a multi-location business. MEDIUM gaps are optimization opportunities that would improve scores but are not causing active harm. LOW gaps are minor improvements with diminishing returns.

**Schema Audit Detail.** Part 4 includes a detailed walkthrough of every JSON-LD block found on the client's homepage, explaining in plain language what each block tells AI systems, what is wrong with each block, and what AI concludes from reading all the blocks together. This walkthrough ends with a callout box that states, in one or two sentences, the net impression AI forms of the business from reading its current schema. This callout is designed to be the most memorable sentence in the entire report because it makes the abstract gap concrete. For example: "AI concludes that this is a single-office business at a garbled address with 6 reviews. The reality is 10 offices across 7 states with hundreds of reviews."

### Part 5: Implementation Plan

Part 5 presents a phased implementation plan with developer time estimates for each phase. The phases are ordered by impact, with the highest-impact, lowest-effort work first.

**Phase 1 always addresses broken or conflicting schema.** If the site has plugin conflicts, incorrect field mappings, or duplicate schema blocks, Phase 1 removes or fixes them. Phase 1 should be achievable in under 4 hours of developer time and should produce no visible changes to the website.

**Phase 2 builds entity and location infrastructure.** This phase adds Person schema for key practitioners, LocalBusiness schema for each location, and FAQPage schema for the main FAQ page. Phase 2 typically requires 6 to 10 hours of developer time depending on the number of locations and practitioners.

**Phase 3 optimizes content.** This phase adds FAQ questions with FAQPage schema to service or practice area pages, adds Service schema to service pages, and adds Article schema with proper author attribution to high-traffic blog posts. Phase 3 is ongoing and can be spread over several weeks.

**Phase 4 optimizes reviews and cross-platform consistency.** This phase updates aggregateRating to reflect accurate review counts, verifies NAP consistency across all platforms, and updates the Organization description to accurately reflect all services and markets served. Phase 4 is partially ongoing because review counts change over time.

Each phase includes a projected score after completion, so the client can see the progression from current state to target state in concrete terms.

**Recommended FAQ Topics.** Part 5 includes a list of 10 to 15 specific questions that should be added as FAQPage schema across the client's service pages. These questions are industry-specific and target the queries people actually ask AI assistants. Claude generates these by searching for common questions in the client's industry, reviewing the client's existing FAQ content, and identifying high-intent questions that lead to conversions (cost questions, process questions, "what should I do" questions).

### Appendix A: Schema Templates

Appendix A provides ready-to-deploy JSON-LD templates pre-filled with the client's actual business data. These templates are the implementation deliverable — a developer can copy them into the site's HTML with minimal modification. The templates must include:

The Organization or LegalService or LocalBusiness schema (using the industry-appropriate type) for the homepage, with all fields filled using verified data from the site crawl and web search. Fields that require client-specific information the crawl could not verify (such as exact review counts from Google Business Profile) are marked with [brackets] and a note explaining what needs to be filled in.

A Person schema template for the founder or lead practitioner, with all fields filled from the site crawl (name, title, education, awards, credentials, bar admissions or certifications). This template is replicated for each additional practitioner, with a note that each person needs their own version.

A Location schema template for one office, with all fields filled from the site crawl and a note that each additional office needs its own version with location-specific data.

A FAQPage schema template with two to three example questions pre-filled using content from the client's existing FAQ page or common industry questions, with a note to expand to 3 to 5 questions per service page.

All schema templates must use correct JSON-LD syntax, include @id references for entity linking, and be formatted in a monospace font in the PDF for readability.

### Appendix B: Source Table

Appendix B presents a table of every source cited in the report. The table has four columns: the source organization's name, the date of the data, a brief description of what they measured and how (including sample size where available), and a quality rating. The quality rating uses a four-level scale: "High" means the source uses a rigorous, documented methodology with a large sample (peer-reviewed research, major research institutions, government data). "Med-High" means the source uses a reasonable methodology with a meaningful sample but is not peer-reviewed (industry research firms, large-scale proprietary datasets). "Medium" means the source uses a smaller or less transparent methodology but is still cited by reputable publications. "Primary" means the data was collected directly by Claude through site crawls for this specific report.

The source table must also include a row for each direct site crawl conducted, identifying it as primary data with the date of the crawl and the number of competitor sites crawled.

### Closing Section

The closing section is three to four paragraphs that summarize the core message without repeating the full analysis. It restates that Phase 1 is achievable in hours, that the schema templates are ready to deploy, that no competitor has done this work, and that the window for first-mover advantage is open. The closing must resolve the tension opened in Part 1 and leave the client knowing exactly what to do next.

---

## How Claude Conducts the Research

### Step 1: Understand the Client

Before beginning any research, Claude must know the client's business name, primary website URL, industry vertical, geographic markets served (cities and states), number of physical locations, and primary service offerings. If Tina has not provided all of this information, Claude asks for what is missing before proceeding. Claude also checks past conversations for prior work on this client using the conversation_search tool.

### Step 2: Crawl the Client's Site

Claude downloads the client's homepage HTML using curl and saves it to a local file. Claude then runs a Python script that extracts all JSON-LD blocks, parses each block, and reports the @type declarations, address fields, aggregateRating values, areaServed declarations, Person entities, and any other schema types found. Claude also checks the client's FAQ page, location pages, service pages, and attorney or team pages for JSON-LD blocks.

Claude records the exact number of JSON-LD blocks found, the source of each block (if identifiable — for example, Rank Math generates blocks with an @graph structure, while WP SEO Structured Data generates standalone blocks), and any conflicts between blocks.

Claude also checks the client's blog for content volume by fetching blog archive pages at increasing page numbers (page 1, page 10, page 50, page 100, page 500, page 1000) and counting articles per page until the count drops to zero. The last page with articles, multiplied by articles per page, gives an approximate total.

### Step 3: Search for Market Data

Claude conducts web searches for the following categories of data, adapted to the client's industry:

Claude searches for zero-click search rate data by querying "zero click search rate 2025" and "SparkToro zero click study" to find the most recent clickstream analysis.

Claude searches for AI search adoption data by querying "ChatGPT search market share 2025" and "AI Overviews trigger rate" and "Google AI search impact" to find current adoption metrics.

Claude searches for click-through rate impact data by querying "AI Overviews CTR impact" and "Seer Interactive AI Overviews study" to find the most recent analysis of how AI results affect click behavior.

Claude searches for industry-specific lead cost data by querying "[industry] cost per lead 2025" and "[industry] cost per click Google Ads" and "[industry] cost per acquisition" to find relevant benchmarks. For personal injury law, the specific queries include "personal injury lawyer cost per lead" and "PI law Google Ads CPC" and "legal services LSA cost per lead."

Claude searches for schema adoption data by querying "schema markup adoption rate" and "structured data SEO impact" to find the most current statistics on how widely schema is used and what impact it has.

For each data point found, Claude records the source organization, the date of the data, the methodology or sample size, and the specific number. Claude does not use any data point that cannot be attributed to a named source with a verifiable methodology.

### Step 4: Identify and Crawl Competitors

Claude identifies competitors through web search, using the client's primary service and each geographic market as search terms. Claude selects 5 to 10 competitors per market, prioritizing firms that appear in the top search results, firms that are running paid ads (indicating they are actively competing for the same customers), and firms that Tina specifically names.

Claude then crawls each competitor's homepage using the same Python script used for the client's site. The script must be written to handle errors gracefully (connection timeouts, 403 responses, empty HTML) so that one failed crawl does not stop the entire batch.

For multi-state clients, Claude conducts separate competitor searches for each state market. Some competitors will appear in multiple markets, and they should be scored once per market based on their presence in that specific market (a firm may have strong location pages in one state and none in another).

### Step 5: Score and Rank

Claude scores the client and each competitor on the seven-factor framework. Claude records the reasoning for each score in working notes that are not included in the report but are available if Tina asks.

Claude calculates the current total score for each firm and ranks them from highest to lowest within each market. Claude then calculates the projected score for the client after implementing all four phases of the recommendation plan.

### Step 6: Build the PDF

Claude reads the PDF public skill at /mnt/skills/public/pdf/SKILL.md before generating the file.

The report uses ReportLab with the following design specifications:

The page size is US Letter (8.5 × 11 inches). Margins are 0.75 inches top and bottom, 0.85 inches left and right.

The color palette uses a dark navy (#1a1a2e) for body text, a medium navy (#0f3460) for headings and table headers, a light blue (#eef2f7) for callout box backgrounds, a red (#c0392b) for CRITICAL priority labels, an orange (#e67e22) for HIGH priority labels, a green (#27ae60) for positive indicators, and a gray (#7f8c8d) for source citations and footnotes.

Table headers use white text on the medium navy background. Table rows alternate between white and light gray (#ecf0f1). Table borders are 0.5pt gray. The client's row in competitive ranking tables is highlighted with a yellow background (#fff3cd) so it is immediately identifiable.

Schema code templates use a monospace font (Courier) at 7.5pt on a light gray background (#f5f5f5) with a 0.5pt gray border.

Each page has a footer with "Prepared by Tina Marie | [date] | Confidential" and a page number.

Body text uses Helvetica 10pt with 14.5pt leading, justified alignment. Headings use Helvetica-Bold at 16pt (Part headings), 13pt (section headings), and 11pt (subsection headings). Source citations use Helvetica 8.5pt in the medium navy color.

Claude saves the PDF to /home/claude/ first, then copies the final version to /mnt/user-data/outputs/ with a clean filename (no spaces, descriptive, ending in .pdf).

### Step 7: Review Before Delivering

Before presenting the report to Tina, Claude verifies the following:

Claude verifies that every number in the competitive ranking tables adds up correctly (the seven factor scores must sum to the stated total for every row in every table).

Claude verifies that the number of competitors stated in the introduction matches the number of rows in the competitive table.

Claude verifies that the number of states or markets stated in the introduction matches the number of state-specific sections in the report.

Claude verifies that the projected scores in the implementation plan are consistent with the projected scores in the competitive ranking table (if both appear).

Claude verifies that no client-identifying information appears in any working files that might be shared (the report itself names the client, but working scripts and intermediate files should use generic references).

Claude verifies that the PDF renders correctly by extracting and reviewing page content using PyPDF2 or pdfplumber, checking that all pages are present and that no text is cut off or overlapping.

---

## Adapting the Report to Different Industries

The report structure is industry-agnostic. The evaluation framework applies to any business that could benefit from AI search visibility. The elements that change per industry are:

The schema types referenced in the scoring framework must match the industry. For law firms, the relevant types are Attorney, LegalService, and Person with hasCredential. For home service companies, the relevant types are HomeAndConstructionBusiness, LocalBusiness, and Service. For medical practices, the relevant types are MedicalBusiness, Physician, and MedicalSpecialty. Claude must identify the appropriate schema.org types for each client's industry.

The lead economics data must be sourced specifically for the client's industry. Claude must not reuse personal injury law lead cost data for a garage door company or vice versa.

The FAQ topics must target questions people actually ask in the client's industry. Claude generates these by searching for "[industry] common questions" and "[service] FAQ" and reviewing the client's existing FAQ content.

The narrative in Part 1 must use a scenario that is realistic for the client's industry. A personal injury firm's scenario involves an accident victim asking AI for a lawyer. A garage door company's scenario involves a homeowner with a broken spring asking AI who can fix it today. The scenario must be specific enough that the client recognizes it as their reality.

---

## Privacy and Confidentiality Rules

Claude must never reference private individuals (clients, their employees, or their customers) in any working files, scripts, or intermediate outputs that might be accidentally shared. The final PDF report names the client because it is a confidential deliverable prepared for that specific client.

Claude must never include Tina's clients' names or business details in skills, session logs, or any system document that persists across sessions. The skill describes the methodology generically. Client-specific details live only in the deliverable and in conversation history.

Claude must verify that the PDF footer says "Confidential" and includes the date and Tina's name.

---

## Quality Gate

This skill is complete when all of the following conditions are true:

The PDF contains all required sections (Cover, Part 1 through Part 5, Appendix A, Appendix B, Closing).

Every data point in Part 2 traces to a named source with a date and methodology description.

Every competitive score in Part 3 traces to a direct site crawl conducted during this session.

The seven-factor scores for every firm in every competitive table sum correctly to the stated total.

The number of competitors stated in the text matches the number of rows in the competitive tables.

The projected scores in Part 5 are consistent with the projected scores shown in any cross-market summary.

The schema templates in Appendix A use correct JSON-LD syntax and include @id references for entity linking.

The PDF renders correctly with no text cut off, no overlapping elements, and no blank pages between content sections.

Claude has re-read the anchor before presenting the deliverable to ensure conversation standards are fresh.

---

## What This Skill Does Not Do

This skill does not implement the schema changes on the client's website. Implementation is a separate engagement.

This skill does not conduct ongoing monitoring of the client's AI search visibility after the report is delivered. Monitoring would be a separate service.

This skill does not produce the report as a React artifact, DOCX document, or any format other than PDF. The approved deliverable format is a professional PDF document. If Tina requests a different format for a specific client, Claude adapts accordingly, but the default is PDF.

This skill does not make business decisions about pricing the assessment as a service, packaging it with implementation, or positioning it in the market. Those decisions belong to the business-advisor skill and to Tina.
