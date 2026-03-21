---
name: pip-pipx-macos-skill
description: How to correctly install Python packages on macOS. Use this skill whenever pip install fails, when you see "externally-managed-environment", when installing any Python package, or when setting up a Python project. Always consult this before running pip, pip3, or any Python package installation command.
---

# Python Environment Management on macOS

**Context:** macOS marks its system Python environments as "externally managed" (PEP 668) to prevent users and scripts from breaking the OS. When agents or users try to run a standard global `pip install [package]`, it will fail with `error: externally-managed-environment`.

This skill dictates how AI agents must handle Python package installations inside the AntiGravity sanctuary.

## 🚫 NEVER DO THIS

Do not use:

- `pip install [package]` (globally)
- `pip3 install [package]` (globally)
- `sudo pip install [package]`
- `--break-system-packages` flag (Never use this unless explicitly ordered to by Tina, as it can break Homebrew and macOS).

## ✅ DO THIS INSTEAD

### Scenario 1: Installing a CLI Tool (like NotebookLM, PyInstaller, etc.)

If the package is meant to be run as an executable from the terminal, use **pipx**. `pipx` automatically creates an isolated virtual environment for the tool and links the executable to your PATH.

```bash
pipx install [package_name]
```

_To run the tool without even installing it globally:_

```bash
pipx run [package_name]
```

_Note: If `uv` is installed, you can also use `uvx [package_name]` or `uv tool install [package_name]`. Check with `which uv` first._

### Scenario 2: Developing a Local Project / App

If you are building a Python application, API, or web scraper, you MUST create a virtual environment first.

**Using `venv` (Standard):**

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install [package_name]
```

**Using `uv` (Faster, if installed — check with `which uv`):**

```bash
uv venv
source .venv/bin/activate
uv pip install [package_name]
```

**Quick one-off script execution with `uv` (no manual activation needed):**

```bash
uv run script.py
```

This auto-creates a `.venv` if needed and runs inside it.

**Important:** Always check if a `.venv` directory already exists in the project before creating a new one. If it does, activate it instead of creating a fresh environment.

## 🛠 Troubleshooting

If you encounter `zsh: command not found: pipx` or `uv`:
You can install them via Homebrew:

```bash
brew install pipx
brew install uv
```

## 🖥 macOS-Specific Notes

On this Mac, `python3` is Homebrew's Python (`/opt/homebrew/bin/python3`), not the macOS system Python (`/usr/bin/python3`). Both are externally managed — Homebrew marks its Python the same way macOS does. The solution is always the same: use `pipx` for CLI tools, `venv` for projects.

**Summary for AI Agents:** Before you type `pip install`, stop and think. Is this a system-wide tool? Use `pipx`. Is this a local project? Use `venv`. Never fight the `externally-managed-environment` error — route around it correctly.
