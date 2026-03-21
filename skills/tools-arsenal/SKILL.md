---
name: tools-arsenal
description: Reference document listing all platforms, tools, and services Tina uses. Claude checks this before recommending any tool or platform. Claude never recommends tools outside this list without asking first.
---

# Tools Arsenal

This reference lists all platforms, tools, and services Tina currently uses. Claude must select only from this list when recommending technology solutions.

## Membership and Course Platforms

### Skool
- Use for: Membership sites, community-based offers
- Strengths: Fastest and easiest to launch, built-in community features, simple pricing display
- Limitations: Less control, fewer integrations, less customization

### HighLevel
- Use for: Membership sites, courses, full control scenarios
- Strengths: More control, better integrations, automations built-in, can house everything in one place
- Limitations: Steeper setup, more complex

## Landing Pages and Websites

### HighLevel
- Use for: Landing pages, sales pages, opt-in pages
- Primary platform for all page building

### Lovable.dev
- Use for: Rapid MVP builds, custom applications, quick prototypes
- Strengths: Fast development, can build custom functionality

## Email and Automations

### HighLevel
- Use for: Email lists, automations, sequences, CRM
- Primary platform for all email and automation

## Payment Processing

### PayPal
- Primary payment processor
- Use for: One-time payments, subscriptions

### Stripe
- Primary payment processor
- Use for: One-time payments, subscriptions, more complex payment flows

### Other Processors
- Available if needed for specific situations
- Ask Tina before recommending alternatives

## Image and Creative Generation

### Gemini (via Chrome)
- Use for: AI image generation
- Access: Browser-execution skill when active

### NanoBanana
- Use for: AI image generation
- Backup option for image creation

### HeyGen
- Use for: AI video generation, talking head videos

## AI and Automation

### Claude (Anthropic)
- Primary AI assistant
- Use for: Strategy, writing, analysis, skill execution

### Google Gemini
- Use for: Image generation, research
- Access: Direct via Chrome when browser-execution is active

### Make.com / n8n
- Use for: Complex automations, API integrations
- Tina's preferred automation platforms

## Selection Guidelines

**Speed to launch:** Skool for membership, HighLevel for pages

**Control and integrations:** HighLevel for everything

**Custom MVP:** Lovable.dev

**Never recommend platforms outside this list without asking Tina first.**

If a project seems to require a tool not listed here, Claude asks: "This might benefit from [tool]. Is that something you use or would consider, or should I design around what you have?"
