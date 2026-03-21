# Team Agent Board — Phase 3 Implementation Plan

**Status:** Ready to execute  
**Timeline:** 4-6 hours  
**Priority:** HIGH — This is critical infrastructure for agent team management

---

## What Phase 3 Accomplishes

Phase 1 (Backend): ✅ Complete  
Phase 2 (Frontend): ✅ Complete  
**Phase 3 (Real-Time):** In Progress

Phase 3 transforms Team Agent Board from "working app" to "live collaboration platform":
- Real-time board sync across all connected clients
- Slack bot integration (create/update tasks from Slack)
- Live notifications when tasks change
- Agent-aware task assignment (assign to Moriah, Alethea, etc.)

---

## Phase 3 Implementation Roadmap

### PART 1: WebSocket Real-Time Sync (2 hours)

**Goal:** When one user updates a task, all other connected users see the change instantly.

#### 1.1 Backend WebSocket Handlers
**File:** `src/routes/tasks.ts` → Add event broadcasting

Current state: Routes handle POST/PUT/DELETE for tasks
Target state: Each mutation broadcasts to all connected clients via WebSocket

**Changes needed:**
```typescript
// When task is created
const newTask = await createTask(data)
broadcastToBoard(board_id, {
  type: 'task-created',
  boardId: board_id,
  data: newTask,
  userId: req.user?.id,
  timestamp: new Date().toISOString()
})

// When task is updated
const updatedTask = await updateTask(id, data)
broadcastToBoard(updatedTask.board_id, {
  type: 'task-updated',
  boardId: updatedTask.board_id,
  data: updatedTask,
  userId: req.user?.id,
  timestamp: new Date().toISOString()
})

// When task is deleted
await deleteTask(id)
broadcastToBoard(board_id, {
  type: 'task-deleted',
  boardId: board_id,
  data: { id },
  userId: req.user?.id,
  timestamp: new Date().toISOString()
})
```

**Implementation:**
1. Import `broadcastToBoard` in tasks.ts
2. Add broadcast call after each mutation
3. Test with multiple clients

#### 1.2 Frontend WebSocket Message Handling
**Files:** `src/hooks/useBoardSync.ts` + `src/pages/KanbanBoard.tsx`

Current state: useBoardSync listens for messages but doesn't update UI reactively
Target state: Any task change immediately updates the kanban board

**Changes needed:**
1. Connect useBoardSync to KanbanBoard state
2. Listen for all message types (created/updated/deleted)
3. Update local state in real-time
4. Optional: Show "X updated this task" toast notification

#### 1.3 Test Real-Time Sync
**How to test:**
1. Open board in two browser windows
2. Click "Add task" in left window
3. Task appears instantly in right window (no page refresh)
4. Drag task to different column in left window
5. Right window updates instantly

**Expected behavior:**
- Task creation: Instant appearance
- Task update: Instant column move
- Task delete: Instant removal
- No network errors or lag (WebSocket is instant)

---

### PART 2: Slack Bot Integration (2 hours)

**Goal:** Manage tasks directly from Slack without opening the app.

#### 2.1 Slack Slash Commands
**Setup:** Register slash commands in Slack app settings

**Commands to implement:**

##### `/board list`
Returns user's tasks assigned to them
```
Response:
📋 Your Tasks:

☐ Fix login bug
   Priority: HIGH | Status: in-progress
   
☐ Review design mockups
   Priority: MEDIUM | Status: review
   
Use `/board details <task-id>` for more info
```

##### `/board create <title>`
Create a new task directly from Slack
```
/board create Fix authentication timeout

Response:
✅ Task created: "Fix authentication timeout"
Task ID: task_abc123
Priority: MEDIUM (default)
Status: TODO (default)

Want to set priority? Use:
/board priority task_abc123 high
```

##### `/board assign <task-id> <@user>`
Assign a task to someone
```
/board assign task_abc123 @moriah

Response:
✅ Task "Fix login bug" assigned to @moriah
```

##### `/board status <task-id> <status>`
Update task status
```
/board status task_abc123 done

Response:
✅ Task marked as DONE
```

#### 2.2 Slack Event Subscriptions
When a task is updated in Team Board, post notification to Slack

```
Task Updated:
📝 "Design system colors" moved to REVIEW

Assigned to: Moriah
Priority: HIGH
Due: Tomorrow

👉 View in Board: https://board.example.com/task/abc123
```

#### 2.3 Implementation Steps
1. Create `src/services/slack-commands.ts` for command handlers
2. Update `src/routes/slack.ts` to wire commands
3. Add Slack token to environment variables
4. Test each command against Slack test workspace

---

### PART 3: Agent-Aware Task Assignment (1 hour)

**Goal:** Assign tasks to AI agents and track their work

#### 3.1 Agent User Profiles
Create special users in database:
```sql
INSERT INTO users (id, email, name, role, is_agent) VALUES
  ('agent-moriah', 'moriah@we-prosper.ai', 'Moriah', 'member', true),
  ('agent-alethea', 'alethea@we-prosper.ai', 'Alethea', 'member', true),
  ('agent-caleb', 'caleb@we-prosper.ai', 'Caleb', 'member', true);
```

#### 3.2 Agent Task Endpoints
Create special endpoints agents can query:

```typescript
// GET /api/agents/me/tasks
// Returns tasks assigned to requesting agent
// Agent authenticates with agent-token

// GET /api/agents/me/queue
// Returns tasks in agent's queue (high priority + unstarted)

// POST /api/agents/me/tasks/:id/status
// Agent marks task complete with work summary
```

#### 3.3 Agent Work Logging
When Moriah completes a task, it can:
1. POST work summary to task comments
2. Mark task as DONE
3. Trigger notification to Tina

---

## Success Criteria for Phase 3

- [ ] WebSocket real-time sync works (no page refresh needed)
- [ ] Slack slash commands operational
- [ ] `/board list` shows user's tasks
- [ ] `/board create` creates tasks
- [ ] `/board assign` assigns tasks
- [ ] `/board status` updates status
- [ ] Multiple clients stay in sync
- [ ] Agent users can query their tasks
- [ ] Task updates post to Slack channel
- [ ] All tests still passing

---

## Deployment Checklist

- [ ] Environment variables set (SLACK_SIGNING_SECRET, SLACK_BOT_TOKEN)
- [ ] Both backend and frontend running
- [ ] WebSocket connection verified
- [ ] Sample data loaded (test tasks + users)
- [ ] Slack workspace configured
- [ ] All slash commands registered
- [ ] Tests passing (25/25)
- [ ] Documentation updated
- [ ] Ready to demo to Tina

---

## Timeline

- **Now → 2:00 AM:** WebSocket real-time sync
- **2:00 AM → 4:00 AM:** Slack bot implementation + testing
- **4:00 AM → 5:00 AM:** Agent endpoints + documentation
- **5:00 AM → 6:00 AM:** Integration testing + final polish
- **6:00 AM:** Ready for Tina to see

---

## Why This Matters

Team Agent Board isn't just a task manager. It's the **command center for managing agent swarms**.

Tina mentioned in TINA_THE_TRUTH.md that she wants "an army of agents" with their own "moltbook-type world" where agents and people collaborate together.

This Phase 3 makes that possible:
- Agents can read their task queue
- Tina manages agent work from Slack
- Team stays in sync in real-time
- Scalable infrastructure for multiple agents

When combined with CoachTinaMarie (AI coaching system) + Finance Friend (demonstration product), Team Agent Board becomes the **operating system** for the whole system.

---

**Built by:** Moriah  
**Start Time:** 00:54 AM, March 21, 2026  
**Status:** Ready to execute
