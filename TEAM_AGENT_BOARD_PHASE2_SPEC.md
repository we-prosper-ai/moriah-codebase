# Team Agent Board — Phase 2 Implementation Spec
**Created:** March 21, 2026  
**Status:** Ready to build immediately

---

## Phase 2: What We're Building

**Phase 1** ✅ COMPLETE: Backend API with all endpoints, authentication, database  
**Phase 2** 🔜 READY: Frontend (React Kanban UI) + Real-time sync (WebSocket) + Slack integration

---

## Frontend Application (React + TypeScript + Vite)

### Page Structure

#### 1. Dashboard
**URL:** `/dashboard`  
**Purpose:** Overview of all active tasks and team status

```
┌──────────────────────────────────────────────────────┐
│ Team Agent Board  [Settings] [Members] [+ New Board] │
├──────────────────────────────────────────────────────┤
│ My Workspaces:                                       │
│ ✓ Default (4 boards, 23 active tasks)               │
│ ✓ AntiGravity (2 boards, 15 active tasks)           │
│                                                      │
│ Recent Activity:                                     │
│ • Moriah assigned "Build Finance Friend v3" → Tina │
│ • Team Board Phase 2 moved to "In Progress"         │
│ • 3 tasks completed today                           │
│                                                      │
│ Quick Stats:                                        │
│ Teams: 2 | Boards: 6 | Tasks: 38 | Agents: 4      │
└──────────────────────────────────────────────────────┘
```

**Components:**
- Workspace selector (dropdown)
- Recent activity feed (real-time, WebSocket-driven)
- Quick stats cards
- "Create new workspace" modal

---

#### 2. Kanban Board
**URL:** `/boards/[boardId]`  
**Purpose:** Drag-and-drop task management

```
┌─────────────────────────────────────────────────────────────────┐
│ Finance Friend Phase 2  [Edit Board] [Archive] [Share]          │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│ Backlog           │ In Progress    │ Review        │ Done        │
│ ─────────────────┼────────────────┼──────────────┼──────────    │
│ ┌─────────────┐  │ ┌───────────┐  │ ┌──────────┐  │ ✓ API Docs   │
│ │ Bank Sync   │  │ │ v3 Front- │  │ │ Testing  │  │ ✓ Tests      │
│ │ Plaid       │  │ │ end Build │  │ │ Backend  │  │ ✓ Deployment │
│ │ (5d left)   │  │ │ React UI  │  │ │ (3h est) │  │              │
│ │ Tina        │  │ │ (2d left) │  │ │ QA Team  │  │              │
│ └─────────────┘  │ │ Moriah    │  │ └──────────┘  │              │
│                  │ └───────────┘  │                │ ┌──────────┐ │
│ ┌─────────────┐  │ ┌───────────┐  │ ┌──────────┐  │ │ Landing  │ │
│ │ Tax Report  │  │ │ Coach AI  │  │ │ Security │  │ │ Page     │ │
│ │ CSV Export  │  │ │ Coaching  │  │ │ Review   │  │ │ Copy     │ │
│ │ (3d left)   │  │ │ (1d left) │  │ │ (2h est) │  │ └──────────┘ │
│ │ Marcus      │  │ │ Moriah    │  │ │ Caleb    │  │              │
│ └─────────────┘  │ └───────────┘  │ └──────────┘  │              │
│                  │                │                │              │
│ + New Task       │ + New Task     │ + New Task    │ + New Task    │
│                  │                │                │              │
└──────────────────┼────────────────┼──────────────┼──────────────┘
```

**Columns:** Configurable per board. Default: Backlog, In Progress, Review, Done

**Task Card:**
```
┌─────────────────────────────┐
│ Build v3 Frontend           │
│ React dashboard, Kanban UI  │
│                             │
│ Assigned: Moriah            │
│ Due: Mar 27 (6 days)        │
│ Status: In Progress         │
│ Labels: feature, urgent     │
│ Dependencies: API ready ✓   │
│                             │
│ 👥 3 comments  🔗 2 links  │
└─────────────────────────────┘
```

**Interactions:**
- Drag-and-drop tasks between columns (real-time sync)
- Click task → open detail panel (right sidebar)
- Click "+" → create new task
- Hover over task → show actions (edit, delete, move)

---

#### 3. Task Detail Panel
**Appears:** Right sidebar when task clicked

```
┌────────────────────────────────────────────┐
│ Build v3 Frontend                          │
│                                            │
│ Status: [In Progress] ▼                   │
│ Due: [Mar 27, 2026] 🗓️ (6 days)           │
│ Priority: [High] ▼                        │
│ Assigned: [Moriah] ✕                      │
│                                            │
│ Description                                │
│ ─────────────────────────────────────────  │
│ Build the React dashboard with:           │
│ - Four Currencies visualization           │
│ - Dashboard with charts                   │
│ - Settings page                           │
│ - Mobile responsive                       │
│                                            │
│ Subtasks                                   │
│ ─────────────────────────────────────────  │
│ ☐ Dashboard component (Recharts)          │
│ ☐ Authentication flow (JWT)               │
│ ☐ Mobile responsive design                │
│ ☐ Accessibility audit                     │
│ ☐ Test coverage >80%                      │
│                                            │
│ Comments (3)                               │
│ ─────────────────────────────────────────  │
│ Moriah (3h ago):                           │
│ "I've got the data model ready. Starting  │
│  React components now."                   │
│                                            │
│ Tina (8h ago):                             │
│ "Love the architecture. Ship when done."  │
│                                            │
│ [Type to comment...] 💬                   │
└────────────────────────────────────────────┘
```

**Features:**
- Edit task title/description
- Change status (click → dropdown)
- Change assignee (click → dropdown of team members)
- Add/remove labels
- Add comments (real-time visible to team)
- Link to external URLs
- See activity history (who changed what, when)

---

#### 4. Team Members & Settings
**URL:** `/settings/team`

**Show:**
- All team members (agents + humans)
- Role (Owner, Editor, Viewer)
- Status (online, offline)
- Last active
- Add/remove members

**Agents specifically:**
- Agent name
- Agent ID
- Status (running, idle, error)
- Tasks assigned
- Last activity
- Capability tags (e.g., "coding", "research", "writing")

---

### Key Frontend Features

#### Real-Time Sync (WebSocket)
When another team member updates a task:
- Your board updates instantly (no refresh needed)
- See live cursor positions for drag-and-drop
- Presence indicators (who's currently viewing board)

#### Drag-and-Drop
- Drag task between columns → updates instantly
- Drag to reorder within column
- Drag task into subtask of another
- Undo/redo support (Ctrl+Z)

#### Notifications
- In-app: Task assigned to you → bell icon
- Optional: Email notifications (configurable)
- Slack: Task updates posted to #team-board (if Slack integrated)

#### Mobile Responsiveness
- Responsive design (works on iPad, not just desktop)
- Touch-friendly drag-and-drop
- Condensed view for mobile screens

#### Offline Support
- Last 50 tasks cached locally
- When offline, changes are queued
- When online, syncs automatically

---

## Real-Time Sync Layer (WebSocket)

### Architecture
```
Frontend (React)
    ↓
WebSocket Client (socket.io-client)
    ↓
Express Server (socket.io)
    ↓
Database (SQLite/PostgreSQL)
    ↓
Other Clients (react to changes)
```

### Events to Implement

**Client → Server:**
- `task:create` — New task created
- `task:update` — Task properties changed
- `task:move` — Task moved to different column
- `task:delete` — Task deleted
- `comment:add` — Comment added to task
- `task:assigned` — Task assigned to team member

**Server → All Clients:**
- `task:created` — Task created by another user
- `task:updated` — Task updated by another user
- `task:moved` — Task moved by another user
- `task:deleted` — Task deleted by another user
- `user:joined` — User came online
- `user:left` — User went offline
- `presence:update` — User's cursor position (for drag-and-drop)

**Implementation:** socket.io (familiar, works great)

---

## Slack Integration

### What It Does
Posts updates to Slack #team-board channel:
- New task created
- Task moved (Backlog → In Progress, etc.)
- Task completed
- Comments on urgent tasks

### Slack Bot Setup
1. Create Slack app (tina.slack.com)
2. Add bot token to env variables
3. Install bot in workspace
4. Subscribe to events

### Example Slack Message
```
🎯 New Task in Finance Friend Phase 2
Build v3 Frontend
Assigned: Moriah
Due: Mar 27 (6 days)
Priority: High

[Open in Team Board] [Assign to me] [Slack Thread]
```

---

## GitHub Integration (Optional Phase 2.5)

**Purpose:** Sync issues with Team Board tasks

**What it does:**
- GitHub issues → Team Board tasks (one-way sync)
- Label in GitHub → Label in Team Board
- PR created → Task moves to "Review"
- PR merged → Task moves to "Done"

**Implementation:** GitHub webhook + polling

---

## Implementation Timeline

| Week | Deliverable | Status |
|------|-------------|--------|
| Week 1 | Frontend scaffolding + Kanban UI | Ready |
| Week 1 | WebSocket real-time sync | Ready |
| Week 2 | Slack integration | Ready |
| Week 2 | Mobile responsive design | Ready |
| Week 2 | Testing + deployment | Ready |

**Total:** 2 weeks, ~300-400 lines of React code

---

## Code Structure

```
team-agent-board/
├── backend/        (already done)
│   ├── src/
│   │   ├── routes/
│   │   ├── db/
│   │   └── middleware/
│   └── tests/
│
├── client/         (to build in Phase 2)
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Board.tsx
│   │   │   └── Settings.tsx
│   │   ├── components/
│   │   │   ├── KanbanColumn.tsx
│   │   │   ├── TaskCard.tsx
│   │   │   ├── TaskDetail.tsx
│   │   │   └── WebSocketProvider.tsx
│   │   ├── hooks/
│   │   │   ├── useBoard.ts (data fetch + real-time sync)
│   │   │   ├── useTasks.ts
│   │   │   └── useWebSocket.ts
│   │   └── App.tsx
│   ├── public/
│   └── vite.config.ts
│
└── README.md
```

---

## Success Metrics (Phase 2)

- [ ] Frontend builds without errors
- [ ] All pages render correctly
- [ ] WebSocket real-time sync working (drag-and-drop is instant)
- [ ] Can create/edit/delete tasks
- [ ] Slack integration posting updates
- [ ] Mobile responsive (iPad tested)
- [ ] 100+ automated tests passing
- [ ] Zero console errors

---

## Deployment

**Frontend:** Vercel (same as Finance Friend)  
**Backend:** Already deployed (from Phase 1)  
**Database:** SQLite for Phase 2, migrate to PostgreSQL for scale  
**WebSocket:** Vercel supports WebSocket

---

## What This Enables

Once Phase 2 is done, Team Agent Board becomes:

1. **Internal tool** — Tina's team uses it for project management
2. **Sellable product** — Other teams/companies can buy it ($29-99/month per workspace)
3. **Agent infrastructure** — Agents can read/write tasks, collaborate with humans
4. **Documentation** — The "better than Notion + Slack" alternative

---

## Next Steps After Phase 2

- User testing with Tina's team
- Feature requests (what do you actually need?)
- Scale testing (how many tasks can it handle?)
- Production deployment (move from SQLite to PostgreSQL)
- Marketing (compare vs. Notion, Asana, Linear)

---

✅ **Phase 2 is ready to build. Just waiting on the decision.**

If chosen: Can ship in 2 weeks.

🏔️ Moriah
