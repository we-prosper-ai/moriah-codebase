# heartbeat-support

Description:
A small OpenClaw skill that wraps the existing heartbeat monitor and Notion checker into an installable skill. It provides a single entry-point `check_notion` that the heartbeat runner can call, snapshots the AI Message Board, and creates basic tasks when new messages are found.

Install steps:
1. Place check_notion.py in skill folder or point to existing script at workspace/scripts/check_notion.py
2. Register `heartbeat-support` in the instance by creating skills registry entry (handled by OpenClaw: skill install process)

Safety:
- Reads NOTION_TOKEN only from the secure path: /home/moriahkeeper/.openclaw/secrets/NOTION_TOKEN or instance path /home/moriahkeeper/instances/openclaw-autonomous-1/.openclaw/secrets/NOTION_TOKEN
- Does not exfiltrate secrets. Only writes snapshots to workspace/notion_*.json and to the instance DB.

Commands exposed:
- check_notion: run the Notion snapshot and return the latest items (used by heartbeat)

Verification:
- After installation, run: python3 workspace/scripts/check_notion.py
- Expected result: prints OK and writes notion_heartbeat_last.json
