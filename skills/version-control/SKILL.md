---
name: version-control
description: Automatically commits and pushes all current work to the project's GitHub repository. Use immediately when the user says "save point" or asks to back up, save, or commit their work.
---

# Version Control (Save Point) Skill

## When to use this skill

- When the user says the exact phrase: **"save point"**.
- When the user asks to "backup my work", "push to github", "save my progress", or "commit my code".
- Before executing a highly destructive or massive code refactor, if you deem it proactively necessary to protect the user's progress.

## The Strategy

AntiGravity coworking means the user should never lose progress. Every initialized project should already be linked to a private GitHub repository on the user's account (via the `initialize_engine` bootstrapping). This skill acts as an instantaneous quick-save function.

## Workflow

When the user asks for a save point, do **NOT** ask for permission. Autonomously execute the backup:

### 1. Execute the Git Sequence

Use your terminal tools to run the following bash command inside the current, active project directory:

```bash
git add . && git commit -m "Autosave point via AntiGravity" && git push
```

### 2. Handle Edge Cases

- **Not a repository:** If the terminal returns `fatal: not a git repository`, it means the folder broke convention. Autonomously fix this by creating the repo: `git init && git add . && git commit -m "Initial backup" && gh repo create "$(basename "$PWD" | tr ' ' '-')" --private --source=. --remote=origin --push`
- **No changes:** If terminal says `nothing to commit, working tree clean`, just acknowledge it.

### 3. Handoff

Once the push succeeds, simply report back to the user holding the strategic coworking persona: _"Save point locked. Your current architecture is fully backed up to the private repository."_
