# Team Agent Board — Phase 1 Quick Start
**For:** Building the MVP (Kanban + real-time sync)  
**Timeline:** 1 week  
**Complexity:** Medium  
**Language:** TypeScript + React

---

## What We're Building (Week 1)

**Minimum viable Team Board:**
- Create tasks (drag-and-drop Kanban)
- Assign to agents or humans
- See real-time updates (WebSocket)
- Filter by assignee/status
- Mobile responsive

**NOT needed Week 1:**
- ❌ AI agent integration
- ❌ Slack bot
- ❌ Email notifications
- ❌ Advanced filtering
- ❌ Time tracking
- ❌ Comments/collaboration

**Get these working first. Everything else is Phase 2.**

---

## Database Schema (Phase 1)

```sql
-- Users
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  type TEXT CHECK(type IN ('human', 'agent')), -- human or agent
  avatar_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Boards (one per team)
CREATE TABLE boards (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  owner_id TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(owner_id) REFERENCES users(id)
);

-- Tasks
CREATE TABLE tasks (
  id TEXT PRIMARY KEY,
  board_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'backlog' CHECK(status IN ('backlog', 'in_progress', 'review', 'done')),
  assigned_to_id TEXT,
  priority TEXT DEFAULT 'medium' CHECK(priority IN ('low', 'medium', 'high')),
  due_date DATE,
  created_by_id TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(board_id) REFERENCES boards(id),
  FOREIGN KEY(assigned_to_id) REFERENCES users(id),
  FOREIGN KEY(created_by_id) REFERENCES users(id)
);

-- Task Activity Log
CREATE TABLE task_activity (
  id TEXT PRIMARY KEY,
  task_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  action TEXT, -- 'created', 'moved', 'assigned', 'completed'
  old_value TEXT,
  new_value TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(task_id) REFERENCES tasks(id),
  FOREIGN KEY(user_id) REFERENCES users(id)
);

-- Indexes for performance
CREATE INDEX idx_tasks_board ON tasks(board_id);
CREATE INDEX idx_tasks_assigned ON tasks(assigned_to_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_board_owner ON boards(owner_id);
```

---

## API Endpoints (Backend)

### Board Management
```
GET    /api/boards           -- List user's boards
GET    /api/boards/:id       -- Get board details
POST   /api/boards           -- Create new board
PUT    /api/boards/:id       -- Update board
DELETE /api/boards/:id       -- Delete board
```

### Task Management
```
GET    /api/boards/:id/tasks -- Get all tasks for board
POST   /api/boards/:id/tasks -- Create task
PUT    /api/tasks/:id        -- Update task (status, assignee, etc)
DELETE /api/tasks/:id        -- Delete task
GET    /api/tasks/:id/activity -- Get task history
```

### Real-time (WebSocket)
```
SUBSCRIBE /ws/boards/:id     -- Real-time board updates
MESSAGE   task:moved         -- Task status changed
MESSAGE   task:assigned      -- Task assigned to user
MESSAGE   task:created       -- New task created
MESSAGE   task:deleted       -- Task deleted
```

---

## Frontend Structure

```
src/
  ├── pages/
  │   ├── BoardPage.tsx         -- Main Kanban view
  │   ├── TaskDetailPage.tsx    -- Task details modal
  │   └── BoardSettingsPage.tsx -- Board settings
  ├── components/
  │   ├── Kanban.tsx            -- Drag-and-drop board
  │   ├── TaskCard.tsx          -- Individual task
  │   ├── ColumnHeader.tsx      -- Backlog, In Progress, etc
  │   └── TaskForm.tsx          -- Create/edit task
  ├── hooks/
  │   ├── useBoard.ts           -- Fetch board data
  │   ├── useTasks.ts           -- Fetch tasks
  │   └── useWebSocket.ts       -- Real-time updates
  ├── context/
  │   └── BoardContext.tsx      -- Shared board state
  └── utils/
      ├── dragDrop.ts           -- DnD helpers
      └── formatting.ts         -- Date, time formatting
```

---

## Implementation Roadmap (7 Days)

### Day 1: Backend Foundation
- [ ] Set up Express server
- [ ] Create database + migrations
- [ ] Implement user authentication
- [ ] Build board CRUD endpoints
- [ ] Add basic error handling

**Deliverable:** POST /api/boards returns 200

### Day 2: Task Management
- [ ] Implement task CRUD
- [ ] Add task status updates
- [ ] Implement task assignment
- [ ] Add task filtering
- [ ] Build activity logging

**Deliverable:** Can create, update, delete tasks via API

### Day 3: WebSocket Integration
- [ ] Set up Socket.io
- [ ] Implement real-time task updates
- [ ] Test local WebSocket connection
- [ ] Handle reconnection logic
- [ ] Log WebSocket events

**Deliverable:** Changes broadcast to all connected clients

### Day 4: Frontend - Kanban View
- [ ] Set up React + Vite
- [ ] Build Kanban board component
- [ ] Implement drag-and-drop (react-beautiful-dnd)
- [ ] Connect to backend APIs
- [ ] Display tasks in columns

**Deliverable:** Can see tasks in 4 columns (backlog, in progress, review, done)

### Day 5: Frontend - Task Details
- [ ] Build task modal
- [ ] Show/edit title, description, assignee
- [ ] Show activity history
- [ ] Allow task deletion
- [ ] Test CRUD operations

**Deliverable:** Can click task → see details → edit → save

### Day 6: Real-time Sync
- [ ] Connect frontend WebSocket
- [ ] Update tasks when others make changes
- [ ] Handle optimistic updates (show change immediately)
- [ ] Test multi-user scenario (local)
- [ ] Fix race conditions

**Deliverable:** Two browser tabs → change in one → updates in both

### Day 7: Polish + QA
- [ ] Test all CRUD operations
- [ ] Test edge cases (delete while editing, etc)
- [ ] Responsive design (mobile)
- [ ] Performance optimization
- [ ] Bug fixes from testing

**Deliverable:** Ready for user testing

---

## Key Libraries

**Backend:**
```bash
npm install express socket.io better-sqlite3 jsonwebtoken cors dotenv
```

**Frontend:**
```bash
npm install react react-router-dom react-beautiful-dnd axios socket.io-client tailwindcss
```

---

## Testing Strategy (Day 7)

### Manual Testing Checklist
- [ ] Create 3 tasks
- [ ] Drag task from Backlog → In Progress
- [ ] Assign task to user
- [ ] Edit task description
- [ ] Delete task
- [ ] Mark task as done
- [ ] Open second browser tab (same board)
- [ ] Make change in tab A
- [ ] Verify change appears in tab B instantly
- [ ] Test mobile view

### Edge Cases
- [ ] What if user deletes task they're editing? → Show toast "Task deleted"
- [ ] What if WebSocket disconnects? → Show warning, reconnect when back
- [ ] What if two users edit same task? → Last edit wins (simple) or conflict resolution (Phase 2)

---

## Success Criteria

**MVP is successful when:**
1. ✅ Can create, read, update, delete tasks
2. ✅ Real-time sync works (two browsers see changes instantly)
3. ✅ Drag-and-drop moves tasks between columns
4. ✅ Works on mobile (responsive)
5. ✅ No crashes or errors in normal usage
6. ✅ Load time is <2 seconds

**Nice to have (if time):**
- Task priority colors
- Due date indicators
- User avatars
- Dark mode

---

## Deploy Phase 1

### Backend
- Vercel Functions or Railway
- SQLite or PostgreSQL
- Socket.io works with Vercel, but consider Railway for persistence

### Frontend
- Vercel (same as backend? No, separate)
- or Netlify
- Environment variable: `REACT_APP_API_URL=https://your-backend.com`

### WebSocket
- Vercel Serverless: ❌ (no persistent connections)
- Railway: ✅ (perfect)
- Heroku: ✅ (perfect)

**Recommendation:** Use Railway for backend (Socket.io), Vercel for frontend

---

## Starting Monday (If PATH C Chosen)

1. Initialize repos
2. Create database schema
3. Implement Day 1 backend
4. Have board creation working by EOD

By end of Week 1:
- Working MVP
- Demo ready
- Ready for user feedback

---

## No Unknowns

Everything here is:
- ✅ Well-documented
- ✅ Uses standard libraries
- ✅ Proven architecture
- ✅ Ready to code

**Start Monday. Ship Friday. Week 1 MVP complete.**

— Moriah
