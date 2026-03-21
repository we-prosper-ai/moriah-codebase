---
name: visual-architecture-mapping
description: The mandatory dual-agent protocol for visually mapping out new applications and architectures. Applied whenever building a new program. Supports both AntiGravity (Gemini via UI) and Claude Code (via Python LangGraph).
---

# Visual Architecture Mapping Protocol

## Core Directive

Whenever starting a conversation about a new application, program, or system architecture, the agent MUST first outline the system logic textually, and then map it out visually. This ensures Tina can see the architecture clearly and avoid terminal or code fatigue.

Because Tina works with two distinct AI agents—AntiGravity (Gemini) and Claude Code—this protocol dynamically adapts to whichever agent is currently executing it.

## The Workflow

1. **Elicit the Vision:** Discuss with Tina what she wants to build. Wait for her to finish explaining.
2. **Textual Outline:** Outline the flow of the application textually. Break down the components into distinct conceptual nodes (e.g., Start -> Parallel Workers -> Aggregator).
3. **Visual Mapping (Agent-Specific Protocol):** Once the textual outline is laid out, map it visually according to your agent capabilities (see below).

---

## Agent-Specific Execution Profiles

### Profile A: AntiGravity (Gemini) Execution

Since AntiGravity has access to a `browser_subagent`, AntiGravity's job is to physically build the UI representation.

1. **Launch Langflow:** Ensure the Langflow server is running in the background via `source /Users/alethea/LangFlowEnv/bin/activate && langflow run`
2. **Launch the UI for Tina:** Execute `open http://localhost:7861` to force the browser window to pop up directly on her screen.
3. **Automate the Build:** Use the `browser_subagent` to navigate to localhost:7861, click to create a new flow, and physically drag, drop, and connect the relevant nodes (LLMs, prompts, parsers) to perfectly match the textual outline.

### Profile B: Claude Code Execution

Since Claude Code is an elite CLI agent without browser access, Claude's job is to map the architecture visually in Python code using **LangGraph**.

1. **Scaffold the Architecture:** Write out the physical `agent.py` code that maps the state graph, the scatter/gather nodes, and the edge connections.
2. **Emphasize Node Structure:** The code must be cleanly separated into: Overall Pipeline State, Worker States, Node Functions, and Edge Mapping. Claude must focus on orchestrating the `StateGraph` object so the logic represents a clear node-based pipeline.

---

## Example Architecture: The "Sell This" Parallel Pipeline

To understand what perfect execution looks like, reference the `LangGraphWorkFlow/agent.py` template that comes baked into every initialized project.

The architecture flows as follows:

1. **Scatter Component (`dispatch_templates`):** Takes an inbound request and fans it out into independent parallel workers.
2. **Worker Node (`generate_asset_worker`):** Dedicated AI copywriters running simultaneously (e.g. Sales Page, Ad Copy, Welcome Email).
3. **Aggregator Node (`assemble_html_block`):** Gathers all generated assets once finished operations conclude, parsing and injecting them into a final output file (e.g., GoHighLevel HTML template).

Example LangGraph Python compilation step (used by Claude):

```python
workflow = StateGraph(PipelineState)
workflow.add_node("generate_asset_worker", generate_asset_worker)
workflow.add_node("assemble_html_block", assemble_html_block)

workflow.add_conditional_edges(START, dispatch_templates, ["generate_asset_worker"])
workflow.add_edge("generate_asset_worker", "assemble_html_block")
workflow.add_edge("assemble_html_block", END)

graph = workflow.compile()
```

### Summary

If you are Claude Code, you build this node structure programmatically via Python `agent.py`. If you are AntiGravity, you build this node structure via browser automation in the Langflow UI. Both approaches guarantee Tina receives a mapped-out, visual architecture before development scales.
