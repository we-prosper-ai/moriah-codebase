---
name: mcp-servers
description: Central knowledge and management protocol for the Model Context Protocol (MCP) server architecture. Use when an agent needs to know what external tools are available, how they are configured, or how to connect to them.
---

# MCP Server Architecture

## When to use this skill

- The user wants to add, remove, or modify an MCP server.
- The agent needs to understand how to interact with external tools (Notion, Slack, Supabase).
- The agent is trying to determine if it has the capability to write to the Centralized Brain (Notion), communicate via Slack, or query databases (Supabase).
- The agent needs to trigger or manage AI workflows (CC Workflow Studio).

## Documentation Location

All documentation regarding what MCP servers we have, how they work, and what has been set up is located in the Single Source of Truth at:
`/Users/alethea/Documents/AntiGravity/initialize_engine/MCP_Servers/`

**You must read the `overview.md` file in that directory when invoking this skill to see the current inventory.**

## Active MCP Server Inventory

### 1. Notion — Centralized Brain
- **Purpose:** Workspace search, database CRUD, page creation, Agent Tasks board
- **Key databases:** Agent Tasks (`50b154db458a4ce29ff60a233af6804e`), Work Ledger, Project Tracker
- **Integration token:** "AntiGravity MCP" integration (ntn_ token in .mcp.json)
- **Tools:** Search, create/read/update pages, query databases, manage blocks and comments
- **Critical:** Databases must be explicitly shared with the "AntiGravity MCP" integration via Notion UI for the token to work

### 2. Slack — Team Communication
- **Purpose:** Communication with the ProfitDrivers Slack workspace
- **Workspace:** ProfitDrivers (Team ID: T0GKXMUKZ)
- **Tools:** Post messages, read channel history, get thread replies, list channels, get user profiles, add reactions
- **Boundary rule:** Tina gets the partner. Others (Mark, Ashtrid) get the assistant — keep it professional and work-focused

### 3. Supabase — Database Operations
- **Purpose:** Direct database access for FreedomBot's analytics, conversation history, and structured data
- **Project:** yxottvosftlorljbxgcl
- **Access:** HTTP MCP endpoint at mcp.supabase.com
- **Key tables:** conversations, api_cost_logs, tool_call_logs, heartbeat, task_queue, reminders, agent_outbox

### 4. CC Workflow Studio — AI Workflow Editor
- **Purpose:** Create and edit visual AI agent workflows
- **Server:** Local HTTP MCP at `http://127.0.0.1:64258/mcp`
- **Dependency:** Requires CC Workflow Studio app to be running locally
- **Tools:** get_workflow_schema, get_current_workflow, apply_workflow

### 5. Firebase — Project Management
- **Purpose:** Firebase project management including hosting, Firestore, auth, and deployment
- **Server:** `firebase-tools@latest` via npx
- **Tools:** Project creation, app management, SDK config, security rules, deployment

## Common MCP Configuration Paths

There are two primary locations where MCP servers are configured in the AntiGravity architecture:

1. **Antigravity (Gemini) Config**: `/Users/alethea/.gemini/antigravity/mcp_config.json`
2. **Claude Code Config**: `/Users/alethea/Documents/AntiGravity/.mcp.json`

If the user wants to add a new MCP server, you should propose adding it to both configuration files natively so both entities in the AI triad can access the new capabilities.

## Execution Rules

- **Do Not Guess Missing Tokens:** If an MCP server requires an API key (like Notion's `NOTION_TOKEN` or Slack's `SLACK_BOT_TOKEN`), do NOT commit placeholder files. Ask the user to provide the token via their browser or integration portal.
- **Maintain the Docs:** If you successfully install a new MCP server, you MUST create a documentation file for it inside the `initialize_engine/MCP_Servers/` directory and link it into `overview.md`.
- **Review Port Dependencies:** Some MCP servers like `cc-workflow-studio` rely on local localhost ports. Check the docs to ensure you do not try to hit closed servers without starting their parent applications first.
- **No Zapier:** Do NOT suggest or build Zapier integrations. This is a standing directive. Use n8n, native APIs, or direct MCP alternatives instead.
