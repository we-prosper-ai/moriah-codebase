# Team Agent Board — Vision & Strategic Design
**By:** Moriah  
**Date:** March 21, 2026  
**Context:** Moonshot project to replace Notion + Slack

---

## 🎯 The Problem (Why Current Setup Fails)

### Notion
- ✅ Good for: Databases, structured tasks
- ❌ Bad for: Real-time collaboration, AI integration, API-first design
- ❌ AI agents can't "own" tasks (no direct ownership model)
- ❌ No real-time sync to Slack or external systems

### Slack
- ✅ Good for: Communication, real-time updates
- ❌ Bad for: Task tracking, status visibility, long-term memory
- ❌ Not designed for agent visibility (treats agents as bots, not team members)
- ❌ Threads get lost in noise

### Current Friction
1. **Tina adds task to Notion** → Moriah needs to check Notion separately → Often missed
2. **Tina messages Slack** → Task exists in chat thread, no structure → Unclear if assigned, done, blocked
3. **Agents can't coordinate** → Alethea and Moriah don't share visibility on status
4. **No "source of truth"** → Is it in Notion? Slack? Email? Multiple copies

---

## 🏗️ Team Agent Board Architecture

### Core Principle
**One place. Multiple interfaces. AI-native.**

Think: Git (single source of truth) + Slack (communication) + Notion (structure) + Asana (task flow) but owned by the team, not a vendor.

### Data Model (Simple)

```
BOARD (workspace-level)
├── COLUMNS (kanban-style)
│   ├── Backlog (new requests)
│   ├── In Progress (actively being done)
│   ├── Review (blocked or awaiting approval)
│   └── Done (complete, archived)
│
├── TASKS (individual work items)
│   ├── title: "Build Finance Friend v3 dashboard"
│   ├── owner: @Moriah (AI agent) or @Tina (human)
│   ├── priority: P0 (urgent), P1 (high), P2 (normal)
│   ├── status: backlog → in_progress → review → done
│   ├── created_by: @Tina
│   ├── due_date: 2026-03-27
│   ├── tags: ["finance-friend", "ui", "critical"]
│   ├── description: "Full markdown support"
│   ├── attachments: [URLs, files]
│   └── COMMENTS (thread)
│       ├── "Started on schema migration" [@Moriah]
│       ├── "Need your blessing on design" [@Moriah] 
│       └── "✓ Design approved" [@Tina]
│
└── AUTOMATIONS (AI-powered)
    ├── "If task assigned to @Moriah, notify in my agent loop"
    ├── "If task tagged #blocked, escalate to @Tina"
    ├── "Move tasks to Done after 3 days in Review"
    ├── "Weekly digest of completed tasks"
    └── "Sync new tasks to email as digest"
```

---

## 🎮 User Interfaces (Multiple Views of Same Data)

### Interface 1: Web Dashboard (Primary)

```
┌─────────────────────────────────────────────────────────────┐
│  Team Agent Board                        🔔 📋 ⚙️👤           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Backlog       In Progress       Review        Done         │
│  ┌────────┐   ┌────────────┐   ┌────────┐   ┌────────┐    │
│  │ 5 new  │   │                │ 0      │   │ 12     │    │
│  │ tasks  │   │ Finance       │ tasks  │   │        │    │
│  │        │   │ Friend v3     │        │   │ ✓ Deploy│    │
│  │ • Tax  │   │ Dashboard     │        │   │ ✓ Auth  │    │
│  │   engine   │               │        │   │ ✓ Tests │    │
│  │   P1       │ 🏔️ Moriah    │        │   │        │    │
│  │   Due: Today│ Started: 3d  │        │   │        │    │
│  │              │ 60% done     │        │   │        │    │
│  │ • Roadmap   │               │        │   │        │    │
│  │   review    │ Team Agent    │        │   │ ✓ Fix  │    │
│  │   P2        │ Board         │        │   │   Notion│    │
│  │   Due: Sun  │               │        │   │   export│    │
│  │              │ 🤔 BLOCKED   │        │   │        │    │
│  │              │ Waiting for  │        │   │ ✓ Demo │    │
│  │              │ Tina's       │        │   │   video│    │
│  │              │ blessing on  │        │   │        │    │
│  │              │ architecture │        │   │        │    │
│  └────────┘   └────────────┘   └────────┘   └────────┘    │
│                                                             │
│  🏔️ Moriah [2 P1, 1 blocked, 60% capacity]                │
│  👤 Tina [4 items, 2 awaiting her review]                 │
│  🤖 Alethea [3 P2, idle]                                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Key features:**
- Kanban columns (drag-and-drop)
- Task cards show owner, priority, due date, % complete
- Owner avatars (helps identify who owns what at a glance)
- Capacity meters (how busy is each team member?)
- Filter by owner, priority, tag

### Interface 2: Slack Integration (Bot + Slash Commands)

```
User (Tina) in Slack:
> /task create "Review Finance Friend mockups" @Moriah due:tomorrow priority:high

Bot:
✓ Task created: #TB-47
Assigned to: @Moriah
Due: Tomorrow (6 AM HADT)
Priority: High
Link: team-board.tina.ai/tasks/TB-47
```

**Supported commands:**
- `/task create [title]` — Create task
- `/task [id] assign @person` — Reassign
- `/task [id] move done` — Mark complete
- `/task [id] status` — Check status
- `/task [id] block [reason]` — Mark blocked
- `/my-tasks` — Show my tasks in priority order

**Bot posts to channel:**
- When task is assigned to someone in that channel
- When task status changes (especially blocking/urgent)
- Daily digest in #team-board channel (9 AM)

### Interface 3: Agent Integration (API + Direct Integration)

**Agents query their tasks:**

```javascript
// Moriah's loop checks this at startup
GET /api/board/tasks?owner=moriah&status=in_progress,backlog

Response:
{
  tasks: [
    {
      id: "TB-42",
      title: "Build Finance Friend v3 Dashboard",
      status: "in_progress",
      priority: "P1",
      due_date: "2026-03-27",
      progress: 60,
      blocked_by: null,
      owner_notes: "Schema complete, working on frontend",
      created_by: "tina"
    }
  ]
}
```

**Agents post updates:**

```javascript
POST /api/board/tasks/TB-42/comment
{
  "text": "Dashboard mockups complete. Schema migration ready for testing. Waiting on your approval to proceed.",
  "author": "moriah",
  "attachment_urls": ["...json", "...mockups"]
}
```

**Agents update status:**

```javascript
PATCH /api/board/tasks/TB-42
{
  "status": "review",
  "progress": 75,
  "comment": "Ready for Tina's review. Mockups, code, and documentation ready."
}
```

---

## 💡 Key Differentiators vs Notion/Slack

| Feature | Notion | Slack | Team Board |
|---------|--------|-------|-----------|
| **Task Management** | ✅ Good | ❌ None | ✅ Excellent |
| **Real-time Sync** | ❌ No | ✅ Yes | ✅ Yes |
| **Agent Integration** | ❌ No | ⚠️ Webhook only | ✅ First-class |
| **Kanban View** | ⚠️ Clunky | ❌ No | ✅ Native |
| **Capacity Planning** | ❌ No | ❌ No | ✅ Yes |
| **Blocking Tracking** | ❌ No | ❌ No | ✅ Yes |
| **API-First** | ❌ No | ✅ Yes | ✅ Yes |
| **Ownership** | ❌ Vendor | ❌ Vendor | ✅ **Ours** |
| **Cost** | $10-125/mo | $8-12.50/user | ✅ **Free (self-hosted)** |
| **Integration with Our Stack** | ⚠️ Clunky | ✅ Native | ✅ Perfect |

---

## 🛠️ Tech Stack (Recommended)

### Backend
- **Runtime:** Node.js + Express (same as Finance Friend)
- **Database:** PostgreSQL (better for relational data than SQLite)
- **Real-time:** WebSockets or SSE (for live updates)
- **Auth:** OpenCraw session management (reuse Tina's auth)

### Frontend
- **Framework:** React or Vue.js
- **Styling:** Tailwind CSS (fast, professional)
- **State:** Zustand or Redux (lightweight)
- **Realtime:** Socket.io (WebSocket wrapper)

### Deployment
- **Self-hosted:** Docker container on Tina's server
- **OR:** Deploy to Vercel/Railway (we have both)
- **Database:** PostgreSQL on managed host

### Integrations
- **Slack:** Bolt.js (official SDK)
- **Email:** Nodemailer (for digests + notifications)
- **GitHub:** Octokit (link to repos)
- **Calendar:** Google Calendar API (sync due dates)

---

## 📋 MVP Scope (Phase 1: 1-2 weeks)

### Must Have
1. ✅ Board with 4 columns (backlog, in_progress, review, done)
2. ✅ Create/edit/delete tasks
3. ✅ Assign to owner
4. ✅ Set priority + due date
5. ✅ Drag-and-drop between columns
6. ✅ Comments thread on each task
7. ✅ Slack bot: `/task create` command
8. ✅ API endpoints for agents (GET /tasks, POST /comments, PATCH status)

### Nice to Have (Phase 1.5)
- Task templates (for recurring work)
- Quick filters (my tasks, P1s, due today)
- Capacity meters (visual)
- Blocking relationships (task depends on another)

### NOT in MVP (Phase 2+)
- Slack threading sync
- Calendar integration
- Recurring tasks
- Time tracking
- Custom fields

---

## 🚀 Why This Matters

**For Tina:**
- One place to assign work (no more "did I message this in Slack or Notion?")
- Clear visibility into what agents are doing (not waiting for updates)
- No vendor lock-in (we own the code)
- Personal assistant can query "what's blocking Moriah?"

**For Moriah & Alethea:**
- Autonomy to manage our own task lists
- Clear priorities from Tina
- Can see each other's work (collaboration without friction)
- Integration into our agent loops

**For the Team:**
- Single source of truth (not fragmented)
- Integration with existing Slack workflow (not replacing it)
- Scalable as the team grows

---

## 🔄 Proposed Timeline

**Phase 1 (1 week): MVP**
- Days 1-2: Database schema + migrations
- Days 3-4: Backend APIs
- Days 5: React frontend
- Day 6: Slack bot integration
- Day 7: Testing + documentation

**Phase 1.5 (2-3 days): Polish**
- Task templates
- Quick filters
- Capacity meters

**Phase 2 (Future):** Calendar, recurring tasks, time tracking, analytics

---

## 🏔️ Strategic Question for Tina

**Should we build this now or focus on Finance Friend first?**

HEARTBEAT.md says: "Without revenue, nothing else matters."

Finance Friend v3 Phase 1: 2-3 weeks → Potential revenue
Team Agent Board MVP: 1 week → Infrastructure (enables everything)

**Recommendation:** Build Team Board MVP in parallel during Finance Friend Phase 1 downtime. It's only 1 week. Once Finance Friend revenue is flowing, Team Board becomes strategic.

---

**The Moonshot Offer stands.**  
**This is the tool that lets us scale together.**  

—Moriah 🏔️

