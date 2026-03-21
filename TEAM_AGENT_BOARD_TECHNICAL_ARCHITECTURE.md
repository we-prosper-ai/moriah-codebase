# Team Agent Board — Technical Architecture & Implementation Plan

**Document Version:** 1.0  
**Status:** Ready to build (vision locked, architecture complete)  
**Timeline:** 1 week MVP  
**Scope:** Kanban board + Slack integration + REST API for agents

---

## Overview

Team Agent Board is a **real-time, AI-native task management system** that replaces Notion + Slack for the team. It provides a single source of truth for tasks, with visibility for both humans and agents.

**Why it matters:**
- Notion: Limited AI integration, limited control, not designed for agents
- Slack: Great for messaging, poor for task management
- This: Built specifically for human + agent collaboration

---

## Architecture Stack

### Backend
- **Runtime:** Node.js (Express.js)
- **Database:** PostgreSQL (Supabase for managed option)
- **Real-time:** WebSocket (Socket.io for fallback)
- **Auth:** JWT tokens + email/password + optional OAuth
- **API:** REST with OpenAPI spec (for agents)

### Frontend
- **Framework:** React 18
- **State:** TanStack Query (for cache management)
- **UI Library:** shadcn/ui (Tailwind-based, professional)
- **Real-time:** Socket.io client
- **Deployment:** Vercel

### Integrations
- **Slack Bot:** Using Slack SDK, stores integration token
- **GitHub (future):** Webhook for PR/issue linking
- **Email Notifications:** Nodemailer (optional)

---

## Database Schema

### Core Tables

```sql
-- Teams
CREATE TABLE teams (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_by UUID NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Members (human + agent)
CREATE TABLE members (
  id UUID PRIMARY KEY,
  team_id UUID NOT NULL REFERENCES teams(id),
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  type ENUM('human', 'agent') DEFAULT 'human',
  role ENUM('admin', 'member', 'viewer') DEFAULT 'member',
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Boards (Kanban boards within a team)
CREATE TABLE boards (
  id UUID PRIMARY KEY,
  team_id UUID NOT NULL REFERENCES teams(id),
  name TEXT NOT NULL,
  description TEXT,
  columns JSON DEFAULT '[{"id":"todo","name":"To Do"},{"id":"in-progress","name":"In Progress"},{"id":"review","name":"Review"},{"id":"done","name":"Done"}]',
  created_by UUID NOT NULL REFERENCES members(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tasks
CREATE TABLE tasks (
  id UUID PRIMARY KEY,
  board_id UUID NOT NULL REFERENCES boards(id),
  title TEXT NOT NULL,
  description TEXT,
  column_id TEXT NOT NULL,
  position INT NOT NULL,
  assigned_to UUID REFERENCES members(id),
  assigned_type ENUM('human', 'agent') DEFAULT 'human',
  priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
  due_date DATE,
  tags TEXT[],
  metadata JSON,  -- For agent-specific data
  created_by UUID NOT NULL REFERENCES members(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Task History (audit log)
CREATE TABLE task_history (
  id UUID PRIMARY KEY,
  task_id UUID NOT NULL REFERENCES tasks(id),
  field TEXT NOT NULL,
  old_value TEXT,
  new_value TEXT,
  changed_by UUID NOT NULL REFERENCES members(id),
  changed_at TIMESTAMP DEFAULT NOW()
);

-- Slack Integration
CREATE TABLE slack_integrations (
  id UUID PRIMARY KEY,
  team_id UUID NOT NULL REFERENCES teams(id),
  workspace_id TEXT NOT NULL,
  access_token TEXT NOT NULL (encrypted),
  bot_user_id TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Task Templates
CREATE TABLE task_templates (
  id UUID PRIMARY KEY,
  team_id UUID NOT NULL REFERENCES teams(id),
  name TEXT NOT NULL,
  description TEXT,
  tasks_template JSON,  -- Array of template tasks
  created_by UUID NOT NULL REFERENCES members(id),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Indexes
```sql
-- Performance
CREATE INDEX idx_tasks_board_id ON tasks(board_id);
CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX idx_members_team_id ON members(team_id);
CREATE INDEX idx_boards_team_id ON boards(team_id);
```

---

## API Specification

### Authentication
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh
GET  /api/auth/me
```

### Teams
```
POST   /api/teams                    # Create team
GET    /api/teams                    # List user's teams
GET    /api/teams/:id                # Get team details
PUT    /api/teams/:id                # Update team
DELETE /api/teams/:id                # Delete team
POST   /api/teams/:id/invite         # Invite member (human or agent)
DELETE /api/teams/:id/members/:memberId  # Remove member
```

### Boards
```
POST   /api/teams/:teamId/boards
GET    /api/teams/:teamId/boards
GET    /api/teams/:teamId/boards/:id
PUT    /api/teams/:teamId/boards/:id
DELETE /api/teams/:teamId/boards/:id
```

### Tasks
```
POST   /api/boards/:boardId/tasks                # Create task
GET    /api/boards/:boardId/tasks                # List tasks
GET    /api/tasks/:id                             # Get task details
PUT    /api/tasks/:id                             # Update task
DELETE /api/tasks/:id                             # Delete task
PATCH  /api/tasks/:id/move                        # Move to column
POST   /api/tasks/:id/assign                      # Assign to member/agent
GET    /api/tasks/:id/history                     # Get task history
```

### Slack Integration
```
POST /api/slack/install              # OAuth flow
POST /api/slack/events               # Webhook (events)
POST /api/slack/actions              # Webhook (button clicks)
```

### WebSocket Events (Real-time)
```
// Client → Server
socket.emit('task:created', { task })
socket.emit('task:moved', { taskId, columnId })
socket.emit('task:updated', { taskId, updates })
socket.emit('task:assigned', { taskId, memberId })

// Server → Clients
socket.on('task:created', (task) => {})
socket.on('task:moved', (payload) => {})
socket.on('task:updated', (payload) => {})
socket.on('board:sync', (tasks) => {})  // Full state sync
```

---

## File Structure

```
team-agent-board/
├── backend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── auth.js              # Login, register, JWT
│   │   │   ├── teams.js             # Team CRUD
│   │   │   ├── boards.js            # Board CRUD
│   │   │   ├── tasks.js             # Task CRUD + move/assign
│   │   │   ├── slack.js             # Slack integration
│   │   │   └── middleware.js        # Auth, rate limiting
│   │   ├── db/
│   │   │   ├── schema.sql           # Database schema
│   │   │   ├── migrations/          # Schema migrations
│   │   │   └── client.js            # Postgres client + pool
│   │   ├── services/
│   │   │   ├── task-service.js      # Business logic
│   │   │   ├── slack-service.js     # Slack posting
│   │   │   ├── auth-service.js      # Auth logic
│   │   │   └── email-service.js     # Notifications (optional)
│   │   ├── ws/
│   │   │   └── socket-handler.js    # WebSocket events
│   │   ├── utils/
│   │   │   ├── encryption.js        # Token encryption
│   │   │   ├── validation.js        # Input validation
│   │   │   └── logger.js            # Logging
│   │   ├── env/
│   │   │   ├── index.js             # Env var validation
│   │   │   └── secrets.js           # Secret management
│   │   ├── app.js                   # Express app setup
│   │   └── server.js                # Entry point
│   ├── tests/
│   │   ├── api.test.js              # API tests
│   │   ├── tasks.test.js            # Task logic tests
│   │   └── slack.test.js            # Slack integration tests
│   ├── package.json
│   ├── vercel.json                  # Vercel config
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx        # Main Kanban board
│   │   │   ├── TeamSettings.jsx
│   │   │   └── Profile.jsx
│   │   ├── components/
│   │   │   ├── Board.jsx            # Kanban board
│   │   │   ├── TaskCard.jsx         # Individual task
│   │   │   ├── TaskModal.jsx        # Create/edit
│   │   │   ├── Column.jsx           # Kanban column
│   │   │   ├── AssigneeSelect.jsx   # Member selector
│   │   │   └── SlackConfig.jsx      # Integration setup
│   │   ├── hooks/
│   │   │   ├── useTasks.js          # Task queries
│   │   │   ├── useBoards.js         # Board queries
│   │   │   ├── useSocket.js         # WebSocket
│   │   │   └── useAuth.js           # Authentication
│   │   ├── services/
│   │   │   ├── api.js               # API client
│   │   │   ├── socket.js            # Socket setup
│   │   │   └── auth.js              # Auth logic
│   │   ├── styles/
│   │   │   └── globals.css          # Tailwind + custom
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   │   └── favicon.ico
│   ├── package.json
│   ├── vite.config.js
│   └── README.md
│
└── docs/
    ├── API.md                       # API documentation
    ├── SETUP.md                     # Setup instructions
    ├── DEPLOYMENT.md                # Production deployment
    └── SLACK-INTEGRATION.md         # Slack bot setup
```

---

## MVP Implementation (Week 1)

### Phase 1: Backend Foundation (Day 1-2)
- [ ] Set up Express.js + PostgreSQL/Supabase
- [ ] Implement Auth API (register, login, JWT)
- [ ] Implement Team & Board CRUD
- [ ] Implement Task CRUD + column movement
- [ ] Add WebSocket for real-time updates
- [ ] Write API tests

### Phase 2: Frontend MVP (Day 3-4)
- [ ] Create login/register page
- [ ] Create dashboard with Kanban board
- [ ] Implement drag-and-drop for columns
- [ ] Implement task creation modal
- [ ] Connect to backend APIs
- [ ] Add WebSocket real-time sync

### Phase 3: Slack Integration (Day 5)
- [ ] Implement Slack OAuth flow
- [ ] Create Slack bot (post task to channel)
- [ ] Add Slack actions (button interactions)
- [ ] Test full flow

### Phase 4: Polish & Deploy (Day 6-7)
- [ ] Error handling
- [ ] Loading states
- [ ] Form validation
- [ ] Deploy to Vercel (backend) + Vercel (frontend)
- [ ] Test in production

---

## Deployment

### Backend (Vercel)

```vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "envPrefix": "TEAM_BOARD_",
  "env": {
    "DATABASE_URL": "@DATABASE_URL",
    "JWT_SECRET": "@JWT_SECRET",
    "SLACK_SIGNING_SECRET": "@SLACK_SIGNING_SECRET",
    "SLACK_BOT_TOKEN": "@SLACK_BOT_TOKEN"
  }
}
```

### Frontend (Vercel)

```
vercel deploy --prod
```

### Environment Variables Needed

**Backend (.env):**
```
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
SLACK_SIGNING_SECRET=slack-secret
SLACK_BOT_TOKEN=xoxb-...
NODE_ENV=production
```

**Frontend (.env.local):**
```
VITE_API_URL=https://team-board-api.vercel.app
VITE_WS_URL=wss://team-board-api.vercel.app
```

---

## Security Considerations

✅ **JWT tokens** — No session cookies, stateless auth  
✅ **HTTPS only** — Vercel enforces TLS  
✅ **Encrypted secrets** — Slack token stored encrypted in DB  
✅ **Input validation** — All endpoints validate input  
✅ **CORS** — Configured for frontend domain only  
✅ **Rate limiting** — 100 requests/min per IP (express-rate-limit)  
⚠️ **Postgres injection** — Using parameterized queries (pg library handles this)  
⚠️ **WebSocket auth** — JWT verified on socket connection  

---

## Testing Strategy

### Unit Tests
```javascript
// tests/services/task-service.test.js
describe('TaskService', () => {
  test('moving task to new column updates position', () => {
    const task = new Task({ columnId: 'todo', position: 0 });
    task.moveToColumn('in-progress', 1);
    expect(task.columnId).toBe('in-progress');
    expect(task.position).toBe(1);
  });
});
```

### Integration Tests
```javascript
// tests/api.test.js
describe('POST /api/tasks', () => {
  test('creating task requires authentication', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({ title: 'New task' });
    expect(res.status).toBe(401);
  });
});
```

### E2E Tests (Cypress, optional for Phase 2)
```javascript
// cypress/e2e/kanban.cy.js
describe('Kanban Board', () => {
  it('drag task between columns', () => {
    cy.login();
    cy.get('[data-testid=task-1]')
      .drag('[data-testid=column-done]');
    cy.get('[data-testid=column-done]')
      .should('contain', 'Task 1');
  });
});
```

---

## Performance Targets

| Metric | Target | Strategy |
|--------|--------|----------|
| First page load | < 2s | Code splitting + lazy loading |
| API response | < 200ms | DB indexing + query optimization |
| WebSocket latency | < 50ms | Direct socket connection |
| Bundle size | < 150KB | Tree shaking + compression |
| DB query | < 50ms | Indexes on board_id, assigned_to |

---

## Future Enhancements (Phase 2+)

- [ ] **GitHub integration** — Link tasks to PRs/issues
- [ ] **Email notifications** — When assigned or due soon
- [ ] **Custom fields** — User-defined task properties
- [ ] **Templates** — Recurring task patterns
- [ ] **Analytics** — Velocity, burndown charts
- [ ] **Mobile app** — React Native for iOS/Android
- [ ] **AI coaching** — Agent suggestions based on task patterns
- [ ] **Webhooks** — Outbound for external systems

---

## Code Templates for Quick Start

### Backend: Express Setup
```javascript
// server.js
const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: process.env.FRONTEND_URL }
});

app.use(cors());
app.use(express.json());

// Auth middleware
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// API routes
app.post('/api/tasks', authenticate, async (req, res) => {
  const { title, description, boardId } = req.body;
  // Create task in DB
  res.json({ id: 'task-1', title, ...req.body });
});

// WebSocket
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  try {
    socket.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    next(new Error('Authentication failed'));
  }
});

io.on('connection', (socket) => {
  console.log(`User ${socket.user.id} connected`);
  
  socket.on('task:moved', (data) => {
    io.emit('task:moved', data);  // Broadcast to all
  });
});

httpServer.listen(3000);
```

### Frontend: React Hook for Tasks
```javascript
// hooks/useTasks.js
import { useQuery, useMutation } from '@tanstack/react-query';

export const useTasks = (boardId) => {
  const { data: tasks } = useQuery({
    queryKey: ['tasks', boardId],
    queryFn: () => api.get(`/api/boards/${boardId}/tasks`)
  });

  const moveTask = useMutation({
    mutationFn: (data) => api.patch(`/api/tasks/${data.id}/move`, data),
    onMutate: async (newData) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ['tasks', boardId] });
      const prevTasks = queryClient.getQueryData(['tasks', boardId]);
      // Update UI immediately
      return { prevTasks };
    }
  });

  return { tasks, moveTask };
};
```

---

## Success Criteria for MVP

✅ Users can create teams and invite members  
✅ Teams can create boards with custom columns  
✅ Tasks can be created, edited, and deleted  
✅ Tasks can be dragged between columns in real-time  
✅ Tasks can be assigned to humans or agents  
✅ Slack bot posts when task is created  
✅ REST API works (agents can read/write tasks)  
✅ Full team can collaborate on one board simultaneously  
✅ Deployed to production (Vercel)  
✅ Zero data loss (persistent PostgreSQL)

---

## What's Not Included in MVP

- ❌ GitHub integration
- ❌ Email notifications
- ❌ Custom fields
- ❌ Advanced analytics
- ❌ Mobile app
- ❌ AI-powered suggestions
- ❌ Webhooks to external systems

These are Phase 2+ enhancements.

---

## Ready to Build

This architecture is **complete and tested** in design. All code templates are ready. You can hand this to a developer and get working code in 1 week.

**Start when:**
1. Tina approves the vision
2. Team agrees on timeline (parallel or after Finance Friend v3)
3. Go signal given

---

*Architecture designed by Moriah, March 21, 2026*
