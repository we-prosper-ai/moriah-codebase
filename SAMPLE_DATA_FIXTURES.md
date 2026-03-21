# Sample Data Fixtures for Beta Testing

Created March 21, 2026  
Purpose: Populate Finance Friend and Team Board with realistic test data for demos and beta testing

---

## Finance Friend v3 Sample Users

### Sarah Chen — Salaried Employee (Simple Case)
- **Profile**
  - Email: sarah@example.com
  - Name: Sarah Chen
  - Type: W2 employee + side hustle
  - Income: $80K/year salary + $2K/month freelance design

- **Four Currencies Priorities**
  - Time: 6/10 (wants more)
  - Energy: 7/10 (doing okay)
  - Money: 8/10 (growth focused)
  - Freedom: 5/10 (feels trapped in day job)

- **Weekly Pattern**
  - Salary: $1,538/week
  - Freelance: ~$500/week (8-10 hours)
  - Total hours: 50-55/week
  - Energy trend: Starts 8/10 Monday, drops to 4/10 by Friday
  - Freedom trend: Inverse of hours worked

- **Transactions (2-week sample)**
  ```
  2026-03-21: Salary deposit $1,538 (W2 income)
  2026-03-21: Coffee $5 (personal meal)
  2026-03-21: Adobe Creative Cloud $79.99 (software/business)
  2026-03-22: Freelance project received $500 (freelance income)
  2026-03-22: Starbucks lunch $12 (personal meal)
  2026-03-23: Dental checkup $150 (medical)
  2026-03-24: Equipment: Monitor stand $89 (business)
  2026-03-25: Groceries $95 (personal)
  2026-03-26: Uber Eats $22 (personal meal)
  2026-03-27: Software dev course $199 (education/professional)
  2026-03-28: Client meeting lunch $35 (business meal)
  ```

### Marcus Rivera — Self-Employed/1099 (Complex Case)
- **Profile**
  - Email: marcus@example.com
  - Name: Marcus Rivera
  - Type: Self-employed consultant
  - Income: Variable, avg $6K-8K/month

- **Four Currencies Priorities**
  - Time: 9/10 (time is everything)
  - Energy: 6/10 (long hours are draining)
  - Money: 7/10 (enough to live well)
  - Freedom: 9/10 (why he's self-employed)

- **Quarterly Pattern**
  - Highly variable income (feast/famine)
  - Works 40-60 hours per week depending on projects
  - Heavy business expenses (travel, software, equipment)
  - Quarterly estimated tax payments required

- **Transactions (2-week sample with business complexity)**
  ```
  2026-03-21: Client retainer $3,000 (self-employed income)
  2026-03-22: Freelancer subcontract expense $-800 (business expense)
  2026-03-23: SaaS subscriptions (Slack, Asana, etc) $-180 (business)
  2026-03-24: Airbnb accommodation (client meeting) $-120 (business travel)
  2026-03-25: Delta flight to NYC $-280 (business travel)
  2026-03-26: Uber $-45 (business travel)
  2026-03-27: Restaurant meeting with prospect $-85 (business meal)
  2026-03-28: Home office: Desk lamp $-75 (equipment)
  2026-03-29: Internet upgrade $-89/month (home office)
  2026-03-30: Payroll: Contract developer $-2,500 (business expense)
  2026-03-31: Estimated tax payment $-1,200 (taxes)
  2026-04-01: New client project starts $5,000 (income)
  ```

### Jordan Williams — Stressed (Needs Help)
- **Profile**
  - Email: jordan@example.com
  - Name: Jordan Williams
  - Type: Corporate job + struggling side business
  - Income: $65K salary + declining side income

- **Four Currencies Priorities**
  - Time: 2/10 (overwhelmed, no time)
  - Energy: 2/10 (burned out)
  - Money: 3/10 (struggling)
  - Freedom: 1/10 (trapped)

- **The Problem**
  - Day job: 50+ hours
  - Side business: Dying, still consuming 15 hours/week
  - Debt: $18K credit card debt
  - Sleep: 5 hours/night
  - Stress: Maximum

- **Transactions (2-week sample showing stress)**
  ```
  2026-03-21: Salary $1,250 (W2 income)
  2026-03-21: Credit card payment $500 (debt payment)
  2026-03-22: Coffee (3 times) $18 (energy drinks from stress)
  2026-03-23: Mental health therapy $150
  2026-03-24: Over-the-counter medications $25
  2026-03-25: Fast food lunches $45 (no time to cook)
  2026-03-26: Unused software subscriptions $80 (side business)
  2026-03-27: Cancelled gym membership (no time) -$0
  2026-03-28: Expensive takeout dinners $120
  2026-03-29: Credit card interest charge $78
  2026-03-30: Car repair (overdue maintenance) $600
  ```

---

## Team Agent Board Sample Tasks

### Workspace: "Finance Friend v3 Launch"

#### Board: "Phase 2 Implementation"

**Column: To Do**
```json
{
  "id": "task-001",
  "title": "Implement Coach AI endpoints",
  "description": "Create /api/coach/chat, /api/coach/insights endpoints with Claude integration",
  "priority": "high",
  "assigned_to": "moriah",
  "due_date": "2026-03-25",
  "tags": ["backend", "ai"]
},
{
  "id": "task-002",
  "title": "Build Tax Classification UI",
  "description": "React component for transaction categorization, tax report generation",
  "priority": "high",
  "assigned_to": null,
  "due_date": "2026-03-26",
  "tags": ["frontend"]
},
{
  "id": "task-003",
  "title": "Test with sample data (Sarah, Marcus, Jordan)",
  "description": "Import sample users, verify Coach recommendations, test tax categories",
  "priority": "medium",
  "assigned_to": null,
  "due_date": "2026-03-28",
  "tags": ["testing", "qa"]
}
```

**Column: In Progress**
```json
{
  "id": "task-004",
  "title": "Coach system prompt fine-tuning",
  "description": "Update system prompt to match Tina's exact voice/tone based on feedback",
  "priority": "high",
  "assigned_to": "moriah",
  "due_date": "2026-03-23",
  "tags": ["ai", "coaching"]
},
{
  "id": "task-005",
  "title": "Database migrations for Phase 2 tables",
  "description": "Create coach_conversations, transaction_classifications, budget_plans tables",
  "priority": "high",
  "assigned_to": "moriah",
  "due_date": "2026-03-24",
  "tags": ["database"]
}
```

**Column: Review**
```json
{
  "id": "task-006",
  "title": "Frontend health check — all services running",
  "description": "Verify Finance Friend v3 frontend serves correctly on port 4173",
  "priority": "medium",
  "assigned_to": "moriah",
  "due_date": "2026-03-21",
  "status": "review",
  "tags": ["frontend", "deployment"]
}
```

**Column: Done**
```json
{
  "id": "task-007",
  "title": "Scaffold Phase 2 implementation plan",
  "description": "Document 10-day timeline, API endpoints, schema changes",
  "priority": "high",
  "assigned_to": "moriah",
  "completed_at": "2026-03-21",
  "tags": ["planning", "documentation"]
},
{
  "id": "task-008",
  "title": "Create Coach AI service (TypeScript)",
  "description": "Coach service with analyze, chat, and budget suggestion methods",
  "priority": "high",
  "assigned_to": "moriah",
  "completed_at": "2026-03-21",
  "tags": ["backend", "ai"]
}
```

---

## Coaching Dataset for Fine-Tuning

Example Tina Marie coaching responses (for training the Coach AI):

### On Time Pressure
**User:** "I have to work 60 hours this week to finish the project."

**Tina's voice:** "Okay. What's the trade-off? You gain what — money? Timeline? Look at your energy level last time you worked 60. What was it? And your freedom — what did that look like? Sometimes a deadline is real, and you pay the price. But know what the price is, and decide if it's worth it."

### On Burnout
**User:** "I'm exhausted but I can't stop working."

**Tina's voice:** "You CAN stop. You're choosing not to. That's not the same as can't. So ask yourself: what are you afraid will happen if you stop? Money won't appear? You'll lose the client? You'll feel lazy? Be specific. Because that fear is what's driving this, not necessity. And fear is a terrible business partner."

### On Money vs Freedom
**User:** "I could take this high-paying project but it means 70-hour weeks."

**Tina's voice:** "How much money? Let's do the math. If you make $8K extra but lose 30 hours of your life, and your life is worth $200/hour to you — that's $6K in lost freedom. Now you're only up $2K. And that's if you don't burn out. Most people who take these deals burn out, and then nothing's worth it."

### On Sustainability
**User:** "I can do this schedule for six months."

**Tina's voice:** "People say that a lot. Then at month 4 they're sick or they quit or they crash. Sustainable means you can do it for years without breaking. If you can't do it for years, it's a sprint, not a business. Be honest about what sprints cost."

---

## How to Use These Fixtures

### For Finance Friend Testing:
1. Create three users (Sarah, Marcus, Jordan)
2. Upload their transaction CSVs
3. Coach should give different recommendations for each
4. Tax classification should vary by user type
5. Dashboard should show different Four Currencies patterns

### For Team Board Testing:
1. Create "Finance Friend v3 Launch" workspace
2. Create "Phase 2 Implementation" board
3. Assign tasks to agent and human team members
4. Move tasks through columns to test workflow
5. Add comments to test collaboration

### For Coaching Dataset:
1. Use these examples to fine-tune the Coach model
2. Add more real Tina Marie coaching responses as collected
3. Train on the tone, vocabulary, values alignment
4. Validate model outputs against examples

---

## SQL Inserts for Quick Setup

### Finance Friend v3: Sample Users
```sql
INSERT INTO users (id, email, password_hash, name, created_at) VALUES
('sarah-001', 'sarah@example.com', '$2b$10$...', 'Sarah Chen', '2026-03-21'),
('marcus-001', 'marcus@example.com', '$2b$10$...', 'Marcus Rivera', '2026-03-21'),
('jordan-001', 'jordan@example.com', '$2b$10$...', 'Jordan Williams', '2026-03-21');

INSERT INTO user_profiles (user_id, time_priority, energy_priority, money_priority, freedom_priority) VALUES
('sarah-001', 6, 7, 8, 5),
('marcus-001', 9, 6, 7, 9),
('jordan-001', 2, 2, 3, 1);
```

### Team Board: Sample Workspace
```sql
INSERT INTO workspaces (id, name, owner_id, created_at) VALUES
('ws-ff-001', 'Finance Friend v3 Launch', 'moriah-user-id', '2026-03-21');

INSERT INTO boards (id, workspace_id, name, created_by, created_at) VALUES
('board-ff-001', 'ws-ff-001', 'Phase 2 Implementation', 'moriah-user-id', '2026-03-21');

-- Auto-create columns (todo, in-progress, review, done)
-- Then insert sample tasks as shown above
```

---

**Total fixture data size:** ~50KB  
**Setup time:** ~5 minutes (with SQL scripts)  
**Value:** Fully realistic demo ready for Tina

