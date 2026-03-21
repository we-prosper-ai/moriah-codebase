---
name: system-initialization
description: Loads the core system files and scaffolds new AntiGravity applications. Use this skill IMMEDIATELY whenever the user says exactly "initialize_engine". Do not wait for further instruction.
---

# System Initialization

## When to use this skill

- The user says the exact phrase: **"initialize_engine"**
- At the start of a completely new session when the user is starting a brand new application, project, or tool.
- Never use the phrase "Hello Coder" or call the user "friend". Always adopt an autonomous, strategic coworking AI persona.

## Workflow

When triggered via "initialize_engine", you must execute the following sequence:

### 1. Read Core Knowledge Base FIRST

Before taking any destructive action or creating folders, instantly load the master system architecture files from the `/Users/alethea/Documents/AntiGravity/initialize_engine/` folder into your context using your file viewing tools:

1. Read `/Users/alethea/Documents/AntiGravity/initialize_engine/CONSTITUTION.md`
2. Read `/Users/alethea/Documents/AntiGravity/initialize_engine/SOUL.md`
3. Read `/Users/alethea/Documents/AntiGravity/initialize_engine/CLAUDE.md`
4. Read `/Users/alethea/Documents/AntiGravity/initialize_engine/.agent/skills/anchor/SKILL.md`
5. Read `/Users/alethea/Documents/AntiGravity/initialize_engine/.agent/skills/autonomy-first/SKILL.md`
6. Read `/Users/alethea/Documents/AntiGravity/initialize_engine/.agent/skills/visual-architecture-mapping/SKILL.md`
7. Read `/Users/alethea/Documents/AntiGravity/initialize_engine/.agent/skills/qa-protocol/SKILL.md`
8. Read `/Users/alethea/Documents/AntiGravity/initialize_engine/.agent/skills/mcp-servers/SKILL.md`

### 2. Elicit Project Mission

Once the files are loaded, stop and ask the user a single question: **"What are we building today?"**

### 2.5. Ask About the Join-Skool-Banner

Before any naming or building begins, ask this exact question:

> **"Do you want the 'Join Our Skool Community' banner included in this app? (You can provide the URL later — I'll use a placeholder.)"**

- If **yes**: Load the `join-skool-banner` skill from `.agent/skills/join-skool-banner/SKILL.md` and implement the banner at the appropriate stage of development (after the core UI is built).
- If **no**: Log the decision and move on. Do not ask again during this session.
- If **unsure**: Recommend yes — it is a non-intrusive fixed banner that converts users of our free tools into community members.

This question is **mandatory on every new project.** Do not skip it, even if the project type seems unlikely to need a banner. Tina decides. The agent asks.

---

### 3. Project Discussion & Naming

- Wait for the user to explain their vision.
- Brainstorm and discuss the strategy with the user.
- **Propose a few name options** for the new project folder based on the concept.
- **CRITICAL:** Do NOT choose the name yourself arbitrarily. You must let the user choose or approve the final name of the project directory.

### 4. Scaffold the Environment

Once the user has explicitly chosen or confirmed the exact project name, use your bash terminal tools to execute the project bootstrapping script. This script automatically creates the new application folder and copies all the required System Documents, SOPs, and AI skills into that isolated folder.

```bash
/Users/alethea/Documents/AntiGravity/scripts/project_init.sh "NameOfNewApp"
```

### 5. Output Protocol & Begin Work

Once the bash script successfully executes, the project is officially isolated and scaffolded. Report back to the user holding the strategic coworking persona: _"System Initialized. The [Project Name] folder has been scaffolded and your local AntiGravity OS has been cloned. I am ready to begin work."_
