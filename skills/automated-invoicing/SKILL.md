---
name: automated-invoicing
description: Generate branded invoices and business documents with automated formatting, colors, fonts, and math. Use when Tina asks to create an invoice, receipt, billing statement, or any financial document that needs her brand guidelines applied automatically.
---

# Automated Invoicing Module

## Core Directive

Whenever a user wants to "invoice a client," "create an estimate spreadsheet," or output "Q1 Financials," execute this automated invoice generation process based on pre-defined style assets.

This workflow dynamically assembles Word, PDF, or Excel outputs customized to the user's specific brand guidelines.

## Prerequisites

1. **Brand Guidelines.md:** The user must have a file detailing their primary visual fonts and Hex codes.
2. **Logo.png:** The user must have a local logo asset.
3. **Office Tools MCP/Skills:** The agent must have the required extensions (like `xls_builder`, `pdf_creator`, or `docx_builder`) enabled in its workspace to assemble raw file binaries.

## Workflow

### 1. Document Extraction & Structure Prompting

Instruct the agent to look for the user's designated layout template, or if none exists, to logically infer the layout.

- Ask what the user is invoicing for (e.g., "$20,000 to Monzo for Web Development").
- Ask what specific format should be returned (Excel or PDF).

### 2. File Assembly & Application

- Apply math: ensure quantity x rate = the total amount correctly sum the bottom fields.
- Apply styling: embed the target logo in the header and inject the exact hexadecimal colors for table headers as dictated in `Brand Guidelines.md`.
- Save the structured binary document output directly to the user's desktop or designated `/Invoices/` directory.

### 3. Iterative Refinement & SOP Lockdown

If the user returns with complaints:

- E.g., _"The green line is overlapping the total price, and the logo is too big"_, then gracefully re-render the document with explicit padding and size adjustments.
- Once the user says, _"perfect, it looks great"_, **you must prompt the user:** _"Would you like me to save this exact mathematical and visual layout as an SOP template for all future invoices?"_
- If yes, append the specific configuration settings to your persistent memory or local workspace folder so future invoices take a zero-shot approach to getting the structure correct.
