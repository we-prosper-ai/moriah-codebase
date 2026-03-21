---
name: skill-creator
description: >
  Creates new Skills for the AntiGravity agent environment. Use when the user
  says "build me a skill", "create a new skill for [task]", or asks to generate
  a `.agent/skills/` directory for a specific capability. Also use when updating
  or improving an existing skill.
---

# AntiGravity Skills Creator

Generate high-quality, predictable, and efficient `.agent/skills/` directories based on user requirements.

## When to Use This Skill

- User says "build me a skill for [task]"
- User says "create a new skill"
- User wants to package a repeatable workflow as a reusable skill
- User wants to update or improve an existing skill

## Canonical Location

All skills live in `initialize_engine/.agent/skills/`. This is the single source of truth. Do NOT create skills in any other directory.

## Core Design Principles

### Concise is Key

The context window is a public good. Skills share the context window with everything else the agent needs: system prompt, conversation history, other Skills' metadata, and the actual user request.

**Default assumption: the agent is already very smart.** Only add context it doesn't already have. Challenge each piece of information: "Does the agent really need this explanation?" and "Does this paragraph justify its token cost?"

Prefer concise examples over verbose explanations.

### Set Appropriate Degrees of Freedom

Match the level of specificity to the task's fragility and variability:

**High freedom (text-based instructions)**: Use when multiple approaches are valid, decisions depend on context, or heuristics guide the approach.

**Medium freedom (pseudocode or scripts with parameters)**: Use when a preferred pattern exists, some variation is acceptable, or configuration affects behavior.

**Low freedom (specific scripts, few parameters)**: Use when operations are fragile and error-prone, consistency is critical, or a specific sequence must be followed.

Think of exploring a path: a narrow bridge with cliffs needs specific guardrails (low freedom), while an open field allows many routes (high freedom).

### What Skills Provide

1. Specialized workflows — Multi-step procedures for specific domains
2. Tool integrations — Instructions for working with specific file formats or APIs
3. Domain expertise — Company-specific knowledge, schemas, business logic
4. Bundled resources — Scripts, references, and assets for complex and repetitive tasks

## Core Structural Requirements

Every skill must follow this folder hierarchy:

```
initialize_engine/.agent/skills/[skill-name]/
├── SKILL.md          (Required: Main logic and instructions)
├── scripts/          (Optional: Helper scripts)
├── references/       (Optional: Documentation loaded as needed)
├── examples/         (Optional: Reference implementations)
└── resources/        (Optional: Templates or assets)
```

### What to NOT Include

- README.md, INSTALLATION_GUIDE.md, CHANGELOG.md, or any auxiliary documentation
- Setup/testing procedures or user-facing documentation
- Only include what an AI agent needs to do the job

## YAML Frontmatter Standards

The `SKILL.md` must start with YAML frontmatter:

- **name**: Lowercase with hyphens (e.g., `testing-code`, `managing-databases`). Max 64 chars.
- **description**: Written in third person. Must include specific triggers/keywords. Max 1024 chars. Include both what the skill does AND when to use it — the description is the primary trigger mechanism. The body is only loaded after triggering, so "When to Use" sections in the body are secondary.

Example description: "Extracts text from PDFs. Use when the user mentions document processing or PDF files."

Do not include any other fields in YAML frontmatter.

## Progressive Disclosure

Skills use a three-level loading system:

1. **Metadata (name + description)** — Always in context (~100 words)
2. **SKILL.md body** — When skill triggers (<5k words, under 500 lines)
3. **Bundled resources** — As needed (unlimited, loaded on demand)

Keep SKILL.md to the essentials. Split into reference files when approaching the 500-line limit. Reference files must be linked from SKILL.md with clear guidance on when to read them.

**Key principle:** When a skill supports multiple variations, keep only the core workflow and selection guidance in SKILL.md. Move variant-specific details into separate reference files.

Avoid deeply nested references — keep all references one level deep from SKILL.md.

## Skill Creation Process

1. **Understand** — Gather concrete examples of how the skill will be used. What triggers it? What does the user say?
2. **Plan** — Identify reusable resources: scripts, references, assets
3. **Create** — Build the skill directory and SKILL.md
4. **Test** — Run any scripts to verify they work. Use the skill on a real task.
5. **Iterate** — Improve based on real usage

## Output Template

When creating a skill, output in this format:

```markdown
---
name: [lowercase-with-hyphens]
description: [3rd-person description with trigger keywords]
---

# [Skill Title]

## When to use this skill

- [Trigger 1]
- [Trigger 2]

## Workflow

[Checklist or step-by-step guide]

## Instructions

[Specific logic, code snippets, or rules]

## Resources

- [Link to scripts/ or resources/ if applicable]
```
