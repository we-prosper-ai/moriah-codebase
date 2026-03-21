# Finance Friend v3 — Phase 1 Quick Start
**Status:** Ready to implement  
**Timeline:** 2 weeks to beta-ready  
**Target:** Core features working, team can test

---

## 🎯 What We're Building in Phase 1

1. **Four Currencies Dashboard** (main feature)
   - Shows money, time, energy, freedom on one screen
   - User can manually log time & energy
   - System automatically pulls transactions from bank imports
   - Freedom score calculated from all four

2. **Tax Classification** (business owner feature)
   - Auto-categorize transactions (personal vs business, etc.)
   - User can override classifications
   - Tax report generation

3. **Budget Planning** (simple version)
   - Create budget categories
   - Track spending vs budget
   - Get alerts when over budget

4. **Coach Chatbot** (integrated with above)
   - Ask questions about finances
   - Get coaching response in Tina's voice (when we integrate CoachTinaMarie)
   - Context-aware (knows your transactions, goals, currency levels)

---

## 📋 Current State Assessment

### ✅ What Exists
- TypeScript backend (Express + SQLite) — compiles cleanly
- React frontend with Tailwind CSS
- Database schema for all v3 features
- Auth system (register/login with JWT)
- API routes skeleton (8 endpoints)
- Test infrastructure

### ⏳ What Needs Building
- Backend controllers (time entries, energy logs, goals, tax, coach)
- Frontend pages and components
- Tax classification ML (using Claude API)
- Coach chatbot integration
- Real-time dashboard updates
- Data validation and error handling

### 🚫 What's Deferred to Phase 2+
- Bank API integration (Plaid) — Phase 2
- Mobile app — Phase 3
- Multi-currency support — Phase 3
- Public benchmarking — Phase 3

---

## 🛠️ Quick Start Tasks (Do These First)

### Task 1: Environment Setup (15 min)

```bash
cd /home/moriahkeeper/.openclaw/workspace/finance-friend-v3/backend

# Copy .env.example to .env
cp .env.example .env

# Edit .env with real values (if needed)
cat .env
# Expected:
# DATABASE_URL=./finance-friend.db
# JWT_SECRET=your-secret-key-here
# ANTHROPIC_API_KEY=...
# NODE_ENV=development
```

### Task 2: Start Backend Server (10 min)

```bash
cd /home/moriahkeeper/.openclaw/workspace/finance-friend-v3/backend

# Kill old process if needed
pkill -f "finance-friend-v3"

# Start on a different port (3002) since v2 is on 3001
PORT=3002 npm start

# Expected:
# ✅ Database connected: ./finance-friend.db
# [INFO] ✅ Database migrations complete
# Server listening on port 3002
```

### Task 3: Start Frontend (10 min)

```bash
cd /home/moriahkeeper/.openclaw/workspace/finance-friend-v3/client

# Build production version
npm run build

# Serve on port 3003
npx serve -s dist -l 3003

# Or development with hot reload:
# npm run dev
```

### Task 4: Test API (5 min)

```bash
# Register a test user
curl -X POST http://localhost:3002/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123!"
  }'

# Login
curl -X POST http://localhost:3002/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123!"
  }'

# Extract JWT token from response, use for next requests:
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:3002/api/auth/me
```

---

## 📝 Implementation Order (Week by Week)

### Week 1: Core Time/Energy Logging

**Goal:** User can log time worked and energy level, see basic data

**Frontend (React):**
- Create `/pages/TimeEntries.tsx` — Form to log hours worked
- Create `/pages/EnergyLog.tsx` — Form to log 1-5 energy level
- Create `/components/DataForm.tsx` — Reusable form component

**Backend (Express):**
- Implement `POST /api/time-entries` — Create time entry
- Implement `GET /api/time-entries?date=YYYY-MM-DD` — List entries
- Implement `PUT /api/time-entries/:id` — Update entry
- Implement `DELETE /api/time-entries/:id` — Delete entry
- Same 4 endpoints for energy logs

**Controller code pattern:**

```typescript
// src/controllers/timeEntriesController.ts

import { Router } from 'express';
import { getDatabase } from '../utils/database.js';

const router = Router();

// POST /api/time-entries
router.post('/', (req, res) => {
  const { date, hoursWorked, projectName, category, description, billableRate } = req.body;
  const userId = req.user.id; // From JWT middleware
  
  try {
    const db = getDatabase();
    const result = db.prepare(`
      INSERT INTO time_entries 
      (user_id, date, hours_worked, project_name, category, description, billable_rate)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(userId, date, hoursWorked, projectName, category, description, billableRate);
    
    res.json({ 
      id: result.lastInsertRowid,
      message: 'Time entry created'
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/time-entries?date=2026-03-21
router.get('/', (req, res) => {
  const { date } = req.query;
  const userId = req.user.id;
  
  try {
    const db = getDatabase();
    const entries = db.prepare(`
      SELECT * FROM time_entries 
      WHERE user_id = ? AND date = ?
      ORDER BY created_at DESC
    `).all(userId, date);
    
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
```

### Week 2: Dashboard with Four Currencies

**Goal:** Show dashboard with money, time, energy, freedom on one page

**Data transformations needed:**
- Calculate total hours from time_entries
- Average energy from energy_logs
- Sum of income from transactions (v2 data)
- Freedom score formula: `(goal_met * 0.3) + (hours_free * 0.3) + (energy_level * 0.3) + (principles_aligned * 0.1)`

**Frontend:**
- Create `/pages/Dashboard.tsx`
- Create `/components/CurrencyCard.tsx` — Reusable card for each currency
- Create `/components/WeeklyTrend.tsx` — Chart of currencies over week

**Backend:**
- Implement `GET /api/dashboard/summary?date=YYYY-MM-DD` — Returns all four currencies + trends

**Dashboard endpoint example:**

```typescript
router.get('/summary', (req, res) => {
  const { date } = req.query; // e.g., 2026-03-21
  const userId = req.user.id;
  const db = getDatabase();
  
  // Get money (from transactions table)
  const moneyResult = db.prepare(`
    SELECT SUM(amount) as total FROM transactions 
    WHERE user_id = ? AND date = ? AND type = 'income'
  `).get(userId, date);
  
  // Get time (from time_entries)
  const timeResult = db.prepare(`
    SELECT SUM(hours_worked) as total FROM time_entries
    WHERE user_id = ? AND date = ?
  `).get(userId, date);
  
  // Get energy (from energy_logs)
  const energyResult = db.prepare(`
    SELECT AVG(energy_level) as average FROM energy_logs
    WHERE user_id = ? AND date = ?
  `).get(userId, date);
  
  // Calculate freedom
  const freedom = calculateFreedom(userId, date);
  
  res.json({
    date,
    currencies: {
      money: moneyResult.total || 0,
      time: timeResult.total || 0,
      energy: energyResult.average || 0,
      freedom: freedom
    }
  });
});

function calculateFreedom(userId, date) {
  // Formula: (goal_met * 0.3) + (hours_free * 0.3) + (energy_level * 0.3) + (principles_aligned * 0.1)
  // Simplified version for now
  return 6.5; // Placeholder
}
```

### Week 3: Testing & Refinement

**Goal:** Team can use it, all features work end-to-end

**Testing:**
- Test with 3 sample users (Sarah Chen, Marcus Rivera, Jordan Williams)
- Verify data flows from frontend → backend → database → back to frontend
- Check mobile responsiveness
- Test auth flows (login/logout/session timeout)

**Deployment:**
- Run on port 3002 (backend) + 3003 (frontend)
- Create startup script: `/home/moriahkeeper/.openclaw/workspace/scripts/start-ff-v3.sh`

---

## 🏃 Getting Started (Do This Now)

```bash
# 1. Check out the backend code
cd /home/moriahkeeper/.openclaw/workspace/finance-friend-v3/backend
npm run build

# 2. Verify it works
npm start &
# Should see: "Server listening on port 3000" or similar

# 3. Test health endpoint
curl http://localhost:3002/health

# 4. Create test user
curl -X POST http://localhost:3002/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "moriah@test.local",
    "password": "TestPass123!"
  }'
```

Once those work, you can proceed with the Week 1 implementation above.

---

## 📊 Success Criteria for Phase 1

When complete, these should all work:

- ✅ User can register and login
- ✅ User can log time worked for a day
- ✅ User can log energy level 1-5
- ✅ Dashboard shows all 4 currencies for any date
- ✅ Time entries persist in database
- ✅ Energy logs persist in database
- ✅ API responses are fast (<100ms)
- ✅ Frontend responds to data changes
- ✅ Test users can complete full flow start-to-finish

---

## 🚀 After Phase 1

When this is working:
- Phase 2: Add bank import + tax classification
- Phase 3: Add coaching chatbot
- Phase 4: Add real bank API integration (Plaid)
- Phase 5: Deploy to production

---

**Status:** Ready to implement whenever you give the green light.

Prepared by Moriah — March 21, 2026, 05:00 AM
