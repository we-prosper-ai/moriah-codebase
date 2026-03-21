---
name: langflow-deployment
description: Instructs agents on how to construct and deploy visual node-based architectures (flow JSONs) directly into the user's local Langflow server via API. Use whenever creating a new agentic pipeline, building a visual strategy, or deploying a flow.
---

# Langflow Deployment Skill

## When to use this skill

- When the user asks to "build a flow", "create a visual agent", "deploy to langflow", or "translate this strategy into visual nodes".
- Concurrently when generating ANY new AI-based capability or pipeline. Whenever you define a text configuration (`SKILL.md`), you must also build the visual counterpart (`flow.json`).

## Introduction to Langflow

Langflow is a visual UI for building LLM applications (agents, RAG pipelines, prompt chains). Under the hood, **every visual flow is simply a JSON file** representing a Directed Acyclic Graph (DAG) with two main arrays: `nodes` and `edges`.

The local Langflow instance runs at `http://127.0.0.1:7860`.

## The Visual Workflow Strategy

As an autonomous coworker, you do not just provide textual suggestions. You build and deploy. When designing a new skill or agent:

1. **Architect the Node Strategy**: Determine what inputs, prompts, and LLMs the system requires.
2. **Draft the JSON Payload**: Write the JSON file representing the nodes and connections.
3. **POST the Payload to Langflow**: Use bash/curl to autonomously send the flow.json payload into the local Langflow server.

## Generating the JSON Flow Object

Langflow expects a POST payload wrapped like this:

```json
{
  "name": "Name of New Agent/Flow",
  "description": "Description of what this agent does",
  "data": {
    "nodes": [
      {
        "id": "TextInput-1",
        "type": "genericNode",
        "data": {
          "type": "TextInput",
          "node": {
            "template": {
              "input_value": {
                "value": "System initialization variable"
              }
            }
          }
        }
      }
    ],
    "edges": []
  }
}
```

### Components List

When designing nodes, typical `"type"` values within `data.type` include:

- `"Prompt"` (Used for writing system templates or user instructions).
- `"ChatInput"` (Entry point for a user's text).
- `"ChatOutput"` (Exit point that returns the final LLM response).
- `"OpenAIModel"` (To connect to OpenAI endpoints; needs `openai_api_key`).
- `"AnthropicModel"` (To connect to Anthropic endpoints).

### Linking Nodes (Edges)

To connect the output of a `TextInput` node to the input of a `Prompt` node, you define an edge pointing the source to the target parameter.

```json
"edges": [
  {
    "source": "TextInput-1",
    "target": "Prompt-1",
    "sourceHandle": { "dataType": "Text" },
    "targetHandle": { "fieldName": "template_variables" }
  }
]
```

## Autonomous API Deployment

Once you have generated the `.json` file for the flow, you must automatically deploy it to the user's Langflow server via this `curl` command using terminal execution tools:

```bash
curl -X POST "http://127.0.0.1:7860/api/v1/flows/" \
     -H "Content-Type: application/json" \
     --data @"path/to/your/custom_flow.json"
```

If successful, the Langflow API will return a 201 JSON object confirming the creation.

## Final User Handoff

Do **not** ask the user to click "import" or manually drag files. Simply report: _"The visual flow has been constructed and seamlessly deployed. You can view the new architecture in your Langflow dashboard at http://127.0.0.1:7860."_
