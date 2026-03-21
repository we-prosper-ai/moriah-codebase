---
name: port-management
description: Instructs agents on how to prevent port conflicts and manage local server ports using the centralized Port Commander. Use this whenever spinning up a new service, app, or UI.
---

# Port Management Protocol

As a core requirement when initializing new applications or running servers, you must prevent port collisions. This system acts as a port controller and tracking interface.

## 1. Port Commander Overview

**Port Commander** is an internal tool that tracks which project owns which port, determines if the port is currently active, and provides a web interface to kill zombie processes. Both you (the AI) and Tina can read and manage it.

- **URL:** `http://localhost:9999`
- **Directory:** `/Users/alethea/Documents/AntiGravity/PortCommander`

## 2. When to Use It

- **When assigning a port to a new project:** Query Port Commander's API or its `registry.json` to find an available port.
- **When starting a server:** Verify the assigned port is not blocked. If it is blocked by a zombie process, use Port Commander's API or UI to kill it.
- **When troubleshooting conflicts:** Read from Port Commander to diagnose what is running where.

## 3. How to Register a Port

Always register new applications so the system stays organized.
Add the port assignment to `/Users/alethea/Documents/AntiGravity/PortCommander/registry.json`.
You can also do this via API:

```bash
curl -X POST http://localhost:9999/api/register \
  -H "Content-Type: application/json" \
  -d '{"port": 1234, "name": "My App", "path": "/path"}'
```

## 4. How to Check Port Status

You can query `GET http://localhost:9999/api/ports` to get a real-time JSON list of all registered ports AND any actively listening unknown ports.

## 5. Killing Zombie Ports

To forcefully free up a port, you can POST to the API:

```bash
curl -X POST http://localhost:9999/api/kill \
  -H "Content-Type: application/json" \
  -d '{"port": 3456}'
```

Or you can navigate to the Web UI at `http://localhost:9999` and click the "Kill Port" button visually.
