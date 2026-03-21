---
name: sell-this-protocol
description: Executes the marketing asset generation pipeline for any product or system. Uses strict, pre-defined templates based on Tina Marie's business fundamentals. Use when the user asks to "Sell This" or generate marketing copy for a product.
---

# Sell This Protocol

## When to use this skill

- The user asks to write a sales page, ad copy, social posts, or email sequence for a product.
- The user triggers the "Sell This" command.
- An agent needs to generate marketing assets without inventing the structure from scratch.

## Instructions

This skill contains a `prompts/` directory with specific, highly-refined templates for different marketing assets. **Do not invent your own structure.**

1. Identify what asset the user needs (Sales Page, Social Media, Ads, Welcome Email, or Checkout Page).
2. Read the corresponding template file in `.agent/skills/sell-this-protocol/prompts/`.
3. Read the Product details provided by the user (or find them in `VaultApp/src/data/products.json`).
4. Apply the Product details to the `<PRODUCT_CONTEXT_GOES_HERE>` section of the chosen template mentally.
5. Generate the final output exactly as instructed by the template.
6. Present the final output to the user.

## The Prompt Templates

You can read the specific templates here:

- `.agent/skills/sell-this-protocol/prompts/01_sales_page.md`
- `.agent/skills/sell-this-protocol/prompts/02_social_media.md`
- `.agent/skills/sell-this-protocol/prompts/03_ad_copy.md`
- `.agent/skills/sell-this-protocol/prompts/04_welcome_email.md`
- `.agent/skills/sell-this-protocol/prompts/05_checkout_page.md`
