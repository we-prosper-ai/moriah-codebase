# Port Management Scripts

Executable helper scripts for managing local server ports and preventing conflicts. These scripts work with Port Commander (http://localhost:9999) when available, or fall back to direct system commands.

## Available Scripts

### `scan.sh`
View all registered ports and their current status via Port Commander API.

```bash
./scan.sh
```

**Output:** JSON list of all ports with their status (active/inactive).

### `check.sh <port>`
Check if a specific port is available or in use.

```bash
./check.sh 3000
```

**Exit codes:**
- `0` = port available
- `1` = port in use

### `kill.sh <port>`
Kill the process running on a specific port.

```bash
./kill.sh 3000
```

**Behavior:**
1. Tries Port Commander API first (cleaner)
2. Falls back to direct `lsof + kill` if API unavailable

### `register.sh <port> <name> <path>`
Register a new port assignment in Port Commander.

```bash
./register.sh 3456 "CustomVideoPlayer" "/Users/alethea/Documents/AntiGravity/CustomVideoPlayer"
```

**Requires:** Port Commander running at http://localhost:9999

### `find-free.sh [start] [end]`
Find the next available port in a range.

```bash
./find-free.sh             # Search 3000-9999 (default)
./find-free.sh 4200 4300   # Search 4200-4300
```

**Returns:** First available port number, or exit 1 if none found.

## Usage from AI Agents

AI agents can call these scripts directly:

```markdown
To check if port 3456 is available:
bash initialize\ engine/.agent/skills/port-management/scripts/check.sh 3456
```

## Port Commander

Most scripts work standalone, but for full features (registry, UI), Port Commander must be running:

```bash
cd /Users/alethea/Documents/AntiGravity/PortCommander
npm start
```

Web UI: http://localhost:9999
