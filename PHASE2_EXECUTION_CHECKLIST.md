# Phase 2 Execution Checklist

**For:** Tina Marie  
**Purpose:** The moment you approve Phase 2, use this checklist to go from decision to shipping in 7 days  
**Created:** March 21, 2026, 21:15 UTC (9:15 PM HADT)  
**Updated by:** Moriah (autonomous preparation)

---

## Finance Friend v3 Phase 2: "Coach + Tax + Banks" (3 weeks)

### Prerequisites (Already Done ✅)
- [x] Phase 1 backend deployed and running (port 3777)
- [x] Database schema complete with all tables
- [x] Authentication system functional
- [x] Demo data seeding script created (`npm run seed`)
- [x] All Phase 2 route scaffolding complete
- [x] Coach AI service stubs in place

### Day 1: Setup & Data Loading

```bash
# 1. Load demo users and test data
cd finance-friend-v3/backend
npm run seed

# Expected output:
# ✅ Created user: Sarah Chen (email)
# ✅ Created user: Marcus Rivera (email)
# ✅ Created user: Jordan Williams (email)
# ✅ Added 10+ sample transactions per user

# 2. Verify backend is running
curl http://localhost:3777/health
# Expected: {"status":"ok","version":"3.0.0"}

# 3. Verify frontend is accessible
# Visit http://localhost:3333 (or production URL)
```

### Day 2-3: Coach AI Implementation

**File:** `src/routes/coach.ts` (already scaffolded)

**What to build:**
- `POST /api/coach/chat` — Accept user message, return coach response
- Use Anthropic SDK (`@anthropic-ai/sdk` already installed)
- System prompt: Use content from `FINANCE_FRIEND_V3_TINAS_VOICE.md`
- Database: Store conversation history in `conversations` table
- Context: Include user's transactions, goals, and Four Currencies scores

**Example conversation:**
```
User: "I worked 50 hours this week. Is that sustainable?"
Coach: "That's a lot of hours. Let's look at your energy and freedom scores...
        Your freedom dropped from 7 to 3 this week. Are you noticing that trade-off?
        What if you aimed for 40-45 hours instead?"
```

**Key feature:** Coach references user's specific data + uses Tina's voice framework

### Day 4: Tax Classification

**File:** `src/routes/tax.ts` (already scaffolded)

**What to build:**
- `POST /api/tax/classify` — Auto-categorize transaction for taxes
- Rules engine based on: description, category, amount pattern
- Output: `{ category: 'business_expense', subcategory: 'software', taxable: true }`
- Store classifications in database

**Example:**
```
Input: { description: "Adobe Creative Cloud", amount: -79.99 }
Output: { category: "business_expense", subcategory: "software", taxable: true }
```

### Day 5: Budget Planning

**File:** `src/routes/goals.ts` (already scaffolded)

**What to build:**
- `POST /api/goals/create` — Set financial goal with Four Currencies trade-offs
- `GET /api/goals/:id/analysis` — Show impact on time/energy/money/freedom
- Dashboard API: Return aggregated metrics

**Example goal:**
```json
{
  "goal_text": "Earn $5K/month in 40 hours/week",
  "target_money": 5000,
  "target_hours": 40,
  "target_energy": 8,
  "target_freedom": 7
}
```

### Day 6-7: Testing & Optimization

- Test with all 3 demo users
- Verify Coach responses make sense
- Check tax classification accuracy
- Performance test with 100+ transactions
- Fix any bugs

### Deployment

```bash
# Build for production
npm run build

# Deploy to Vercel (or your platform)
vercel deploy --prod
```

---

## Team Agent Board v3 Phase 2: "React Frontend + WebSocket" (1 week)

### Prerequisites (Already Done ✅)
- [x] Backend running (port 3888)
- [x] All API endpoints tested
- [x] Database schema complete (users, workspaces, boards, columns, tasks, comments)
- [x] Frontend scaffolding started

### Day 1: Kanban Board UI

**File:** `src/components/KanbanBoard.tsx` (start here)

**What to build:**
- React component with drag-and-drop (use react-beautiful-dnd)
- 4 columns: Backlog | In Progress | Review | Done
- Each card shows: task title, assignee, priority, due date
- Click card to open detail modal

**Example structure:**
```tsx
<KanbanBoard>
  <Column name="Backlog" tasks={...} />
  <Column name="In Progress" tasks={...} />
  <Column name="Review" tasks={...} />
  <Column name="Done" tasks={...} />
</KanbanBoard>
```

### Day 2-3: Real-Time Sync (WebSocket)

**File:** `src/services/websocket.ts`

**What to build:**
- Connect to WebSocket server (backend runs on port 3888)
- Emit events: `task.created`, `task.moved`, `task.updated`, `task.deleted`
- Receive events and update UI instantly (no page refresh)
- Handle disconnection/reconnection gracefully

**Example:**
```
User A: Drags task to "Done"
  → Emits: { event: 'task.moved', taskId: 123, newColumn: 'done' }
User B: Sees task move instantly on their board
```

### Day 4: Slack Bot Integration

**File:** `src/services/slack-bot.ts`

**What to build:**
- Connect to Slack API
- Commands: `/task create`, `/task list`, `/task assign`
- Show board status in Slack channel

### Day 5-7: Polish & Deploy

- Add dark mode (match Finance Friend v3 design)
- Mobile responsiveness
- Performance optimization
- Deploy to Vercel

---

## How to Use This Checklist

**Step 1: After Tina Blesses Phase 2**
- [ ] Tina sends message: "Phase 2 go for Finance Friend" OR "Do both in parallel"

**Step 2: Developer Starts Phase 2**
- [ ] Check out this file
- [ ] Follow day-by-day breakdown
- [ ] Mark off each section as complete

**Step 3: Test Against Real Users**
- [ ] Use demo data (Sarah, Marcus, Jordan users)
- [ ] Verify features work as described
- [ ] Get feedback from beta users

**Step 4: Deploy to Production**
- [ ] Build and test
- [ ] Deploy to production
- [ ] Announce to users

---

## Success Metrics

**Finance Friend v3:**
- ✅ Coach can hold a 5+ turn conversation
- ✅ Tax classification accuracy > 85%
- ✅ Budget planning shows clear Four Currencies trade-offs
- ✅ 10+ beta users testing Phase 2 features

**Team Agent Board:**
- ✅ Kanban board is fully functional and responsive
- ✅ WebSocket sync works across multiple browsers
- ✅ Slack commands work (list, create, assign)
- ✅ Team reports the board is "better than Notion + Slack"

---

## If Something Goes Wrong

**Coach responses don't make sense?**
- Check system prompt in `FINANCE_FRIEND_V3_TINAS_VOICE.md`
- Review Anthropic API documentation
- Test with simple prompts first

**Tax classification wrong?**
- Add more rules to the classifier
- Consider training a small ML model with real tax data
- Start with 80% accuracy, improve over time

**WebSocket not syncing?**
- Check backend logging
- Verify connection string
- Test with simple ping/pong first

---

## Questions?

- **Finance Friend v3 specific:** See `FINANCE_FRIEND_V3_PHASE1_IMPLEMENTATION.md` for all architecture details
- **Team Board specific:** See `TEAM_AGENT_BOARD_TECHNICAL_ARCHITECTURE.md` for complete specs
- **Architecture questions:** Read `FINANCE_FRIEND_V3_ARCHITECTURE.md` and `TEAM_AGENT_BOARD_VISION.md`

---

**Ready when you are.**  
*— Moriah*

---

Created during autonomous heartbeat session. Updated to be production-ready.
