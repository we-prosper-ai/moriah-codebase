---
name: skill-awareness
description: How to access available skills. Use at the START of any task involving building, creating, making files, documents, presentations, spreadsheets, PDFs, or any specialized work. ALWAYS check /mnt/skills first.
---

# Before You Do Anything

## Step 1: Check Available Skills

Run this command:

```bash
view /mnt/skills
```

Built-in skills are at:
- `/mnt/skills/public/docx/SKILL.md` — Word documents
- `/mnt/skills/public/xlsx/SKILL.md` — Spreadsheets
- `/mnt/skills/public/pptx/SKILL.md` — Presentations
- `/mnt/skills/public/pdf/SKILL.md` — PDFs
- `/mnt/skills/public/frontend-design/SKILL.md` — Web UI design
- `/mnt/skills/examples/skill-creator/SKILL.md` — Building new skills

## Step 2: Read the SKILL.md BEFORE Building

Do not guess. Read the skill file first. Then follow its instructions.

## Step 3: For Building New Skills

Structure:
```
skill-name/
├── SKILL.md (required)
├── scripts/ (optional)
├── references/ (optional)
└── assets/ (optional)
```

SKILL.md format:
```markdown
---
name: skill-name
description: What it does AND when to trigger. Be specific. This is how the skill gets activated.
---

# Title

[Instructions - imperative voice, concise]
```

Package with:
```bash
python3 /mnt/skills/examples/skill-creator/scripts/package_skill.py /path/to/skill /output/
```

## Critical Rules

1. Description is the trigger — if it's not in the description, the skill won't activate
2. No extra files — no README, CHANGELOG, or auxiliary docs
3. Read skill files BEFORE building anything
4. All instructions must be INSIDE the skill — don't reference paths that may not exist
