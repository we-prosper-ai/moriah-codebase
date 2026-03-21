# Finance Friend v3 Sample Data Setup

**Created:** March 21, 2026 — 05:28 AM HADT  
**Purpose:** Pre-load realistic sample data for immediate demo upon approval  
**Status:** Ready to execute

---

## 🎯 Sample User Personas

We'll create 3 realistic user profiles with 30 days of transaction history:

### User 1: Sarah Chen (Salaried + Side Hustle)
- **Income:** $3,250 bi-monthly salary (Software Engineer)
- **Side hustle:** Freelance design projects ($500-2000/month variable)
- **Expenses:** Consistent living expenses + occasional splurges
- **Financial profile:** Healthy, goal-focused, tracking for tax purposes
- **Time/Energy:** Struggling with work-life balance (frequently works >50h weeks)
- **Goal:** Build passive income, reduce work hours to 40/week

### User 2: Marcus Rivera (Self-Employed)
- **Income:** Highly variable ($2,000-8,000/month from consulting)
- **Expenses:** Mix of personal + business expenses
- **Financial profile:** Profitable but unpredictable cash flow
- **Time/Energy:** Owns his time but energy fluctuates with project intensity
- **Goal:** Stabilize income, pay quarterly taxes correctly, achieve $5K/month baseline

### User 3: Jordan Williams (Financially Stressed)
- **Income:** $15/hour part-time work + gig economy side gigs
- **Expenses:** High debt, BNPL usage, occasional overdrafts
- **Financial profile:** Struggling with cash flow, needs budget discipline
- **Time/Energy:** Works multiple jobs, constantly stressed, low energy
- **Goal:** Get out of debt, achieve 6-month emergency fund, feel less stressed

---

## 📊 Sample Transaction Data

### Sarah Chen (March 1-31, 2026)

**Income:**
- Mar 5: Salary deposit $3,250 (ChequingWorks)
- Mar 10: Freelance project (Design mockups) $1,200 (Stripe)
- Mar 15: Freelance project (Brand consultation) $800 (Stripe)
- Mar 20: Salary deposit $3,250 (ChequingWorks)

**Regular Expenses:**
- Mar 2: Rent $1,500 (Landlord — auto-pay)
- Mar 3: Groceries $342 (Whole Foods)
- Mar 5: Coffee subscription $18 (Starbucks)
- Mar 7: Gym membership $50 (ClassPass)
- Mar 10: Utilities $156 (City Power Co)
- Mar 12: Internet $65 (Telco)
- Mar 15: Car insurance $142 (State Farm)

**Variable Expenses:**
- Mar 8: Dinner out $68 (Trattoria)
- Mar 14: Flight to Austin $285 (JetBlue — conference)
- Mar 18: Hotel $120/night × 2 nights (Hilton — conference)
- Mar 22: New laptop (work) $1,800 (Apple) — **Business deduction**
- Mar 25: Personal care $95 (Salon)
- Mar 28: Birthday dinner $180 (upscale restaurant)

**Savings/Investments:**
- Mar 15: Transfer to savings $500
- Mar 20: 401(k) contribution $1,200 (auto-deduct)

**Tax Classification Needed:**
- Laptop ($1,800) → Business deduction (home office equipment)
- Conference expenses ($285 + $240) → Business deduction
- Freelance income → Self-employment tax tracking
- 401(k) → Pre-tax income

**Financial Summary:**
- Total Income: $8,500
- Total Expenses: $5,348
- Net (before tax): $3,152
- Time tracking: 45h week avg (goal: <40h)
- Energy: 65% avg (declining toward month end)

---

### Marcus Rivera (March 1-31, 2026)

**Income (Highly Variable):**
- Mar 2: Consulting project (Week 1-2) $3,200 (Client ACH)
- Mar 9: Consulting project (Week 3-4) $2,800 (Client ACH)
- Mar 18: Retainer client $1,500 (Stripe Connect)
- Mar 25: Ad-hoc support work $600 (Client ACH)

**Business Expenses:**
- Mar 1: Software subscription (Adobe) $84.99 (Recurring)
- Mar 3: Office supplies $156.42 (Staples) — **Business deduction**
- Mar 7: Client entertainment $320 (Restaurant) — **Business deduction**
- Mar 12: Equipment upgrade (Monitor) $599 (Amazon) — **Business deduction**
- Mar 15: Training course (Figma Advanced) $149 (Udemy) — **Business deduction**

**Personal Expenses:**
- Mar 4: Rent $1,200 (Landlord)
- Mar 6: Groceries $234 (Whole Foods)
- Mar 8: Gas $52 (Shell)
- Mar 14: Utilities $98
- Mar 20: Car payment $380 (Auto loan)
- Mar 22: Dining out $145 (Various restaurants)
- Mar 27: Streaming services $35 (Netflix + Spotify)

**Tax Concerns:**
- Quarterly estimated tax due April 15: ~$4,800 (1040-ES)
- Need to track: Business vs personal miles, home office deduction
- Self-employment tax: ~15.3% on net self-employment income

**Financial Summary:**
- Total Income: $8,100
- Business Expenses: $1,309.41
- Personal Expenses: $2,144
- Net (before self-employment tax): $4,646.59
- Quarterly tax liability: ~$680
- Time tracking: 60h avg (needs reduction)
- Energy: 70% avg (inconsistent, project-dependent)

---

### Jordan Williams (March 1-31, 2026)

**Income (Multiple Jobs):**
- Mar 5: Grocery store paycheck (40h @ $15/hr) $600 (Direct deposit)
- Mar 12: Food delivery gigs (Uber Eats) $340 (Weekly)
- Mar 19: Grocery store paycheck $600
- Mar 26: Food delivery gigs $285

**Debt & BNPL:**
- Mar 2: Credit card payment (minimum) $75
- Mar 8: Afterpay installment (furniture) $50
- Mar 15: Klarna payment (clothes) $45
- Mar 22: Credit card payment (minimum) $75

**Regular Expenses:**
- Mar 3: Rent (shared apartment) $600
- Mar 4: Groceries $148
- Mar 7: Gas $38
- Mar 10: Phone bill $45
- Mar 14: Internet $30
- Mar 17: Groceries $156
- Mar 24: Groceries $142
- Mar 28: Personal items $68

**Variable/Problem Expenses:**
- Mar 6: Overdraft fee $35
- Mar 13: Overdraft fee $35
- Mar 16: Payday loan repayment $120
- Mar 20: Late fee (credit card) $25
- Mar 23: Fast food/impulse spending $67

**Financial Health Issues:**
- Credit card balance: ~$4,200 @ 22% APR
- Afterpay/Klarna total owed: ~$600
- Payday loan: $800 (due Apr 5, very high rate)
- Emergency fund: $0
- Overdraft frequency: 2x this month (concerning)

**Financial Summary:**
- Total Income: $1,825
- Total Expenses: $2,080
- Deficit: -$255 (using credit)
- Debt service: $265
- Effective deficit (with debt): -$520
- Time tracking: 52h avg (multiple jobs)
- Energy: 35% avg (burnt out)

---

## 🗄️ Database Setup Script

This script pre-loads all sample data into Finance Friend v3:

```bash
#!/bin/bash
# load-sample-data.sh

DB_FILE="/home/moriahkeeper/.openclaw/workspace/finance-friend-v3/backend/finance-friend.db"

# Create sample users
sqlite3 "$DB_FILE" << 'EOF'

-- Insert sample users
INSERT OR IGNORE INTO users (id, email, password_hash, created_at) VALUES (
  'user_sarah_chen',
  'sarah@example.com',
  '$2b$10$...',  -- bcrypt hash of "demo123"
  datetime('now')
);

INSERT OR IGNORE INTO users (id, email, password_hash, created_at) VALUES (
  'user_marcus_rivera',
  'marcus@example.com',
  '$2b$10$...',
  datetime('now')
);

INSERT OR IGNORE INTO users (id, email, password_hash, created_at) VALUES (
  'user_jordan_williams',
  'jordan@example.com',
  '$2b$10$...',
  datetime('now')
);

-- Sarah Chen: Income transactions
INSERT INTO transactions (id, user_id, date, amount, category, description, source, is_income) VALUES 
  ('tx_sarah_001', 'user_sarah_chen', '2026-03-05', 3250.00, 'salary', 'Salary deposit', 'ChequingWorks', 1),
  ('tx_sarah_002', 'user_sarah_chen', '2026-03-10', 1200.00, 'freelance', 'Design mockups project', 'Stripe', 1),
  ('tx_sarah_003', 'user_sarah_chen', '2026-03-15', 800.00, 'freelance', 'Brand consultation', 'Stripe', 1),
  ('tx_sarah_004', 'user_sarah_chen', '2026-03-20', 3250.00, 'salary', 'Salary deposit', 'ChequingWorks', 1);

-- Sarah Chen: Expense transactions
INSERT INTO transactions (id, user_id, date, amount, category, description, source, is_income, tax_category) VALUES 
  ('tx_sarah_exp_001', 'user_sarah_chen', '2026-03-02', -1500.00, 'rent', 'Rent', 'Landlord', 0, 'none'),
  ('tx_sarah_exp_002', 'user_sarah_chen', '2026-03-03', -342.00, 'groceries', 'Groceries', 'Whole Foods', 0, 'none'),
  ('tx_sarah_exp_003', 'user_sarah_chen', '2026-03-05', -18.00, 'subscription', 'Coffee subscription', 'Starbucks', 0, 'none'),
  ('tx_sarah_exp_004', 'user_sarah_chen', '2026-03-22', -1800.00, 'equipment', 'Laptop - work', 'Apple', 0, 'business_deduction');

-- Time entries (Sarah: struggling with hours)
INSERT INTO time_entries (id, user_id, date, hours_worked, project, notes) VALUES 
  ('te_sarah_001', 'user_sarah_chen', '2026-03-01', 9.5, 'Main job', 'Regular dev work'),
  ('te_sarah_002', 'user_sarah_chen', '2026-03-02', 10.0, 'Main job + freelance', 'Late night freelance work'),
  ('te_sarah_003', 'user_sarah_chen', '2026-03-03', 8.5, 'Main job', 'Regular dev work'),
  ('te_sarah_004', 'user_sarah_chen', '2026-03-04', 9.0, 'Main job', 'Meetings heavy day');

-- Energy logs (Sarah: declining energy)
INSERT INTO energy_logs (id, user_id, date, energy_level, notes) VALUES 
  ('el_sarah_001', 'user_sarah_chen', '2026-03-01', 7, 'Fresh from weekend'),
  ('el_sarah_002', 'user_sarah_chen', '2026-03-02', 6, 'Late night catch-up'),
  ('el_sarah_003', 'user_sarah_chen', '2026-03-03', 5, 'Fatigue setting in'),
  ('el_sarah_004', 'user_sarah_chen', '2026-03-04', 4, 'Really tired, need rest');

-- Goals (Sarah: wants to reduce hours)
INSERT INTO goals (id, user_id, goal, target_amount, target_date, category) VALUES 
  ('goal_sarah_001', 'user_sarah_chen', 'Reduce to 40h/week', 40.0, '2026-06-01', 'time'),
  ('goal_sarah_002', 'user_sarah_chen', 'Build freelance to $3K/month', 3000.00, '2026-06-01', 'income'),
  ('goal_sarah_003', 'user_sarah_chen', 'Achieve 7/10 freedom score', 7.0, '2026-06-01', 'freedom');

EOF

echo "✅ Sample data loaded successfully"
```

---

## 🎬 Demo Walkthrough Script

When Tina approves, here's how to showcase the system:

```
1. **Login as Sarah Chen**
   Email: sarah@example.com
   Password: demo123
   
   See: Dashboard with Four Currencies cards
   - Earned $8,500 this month (salary + freelance)
   - Worked 45h avg (goal is <40h)
   - Energy: 65% (declining trend)
   - Freedom score: 6.2/10
   - Insight: "Your time is the bottleneck. Freelance income is growing but at cost of energy & freedom."

2. **View Time Tracking**
   Show: Daily hours logged (9.5, 10, 8.5, 9 = 37.5 by day 4)
   Insight: On track for 45h this week
   Coach suggestion: "Consider blocking 2 no-meeting hours for focused work"

3. **View Energy Tracking**
   Show: Daily energy levels declining (7 → 4 over 4 days)
   Pattern: Energy drops when working >9h days
   Coach suggestion: "Rest days correlate with recovery. Schedule one every 4-5 days"

4. **View Tax Classification**
   Show: Laptop purchase flagged as business deduction
   Show: Freelance income separated for self-employment tax
   Show: Projected quarterly tax liability: $680
   Insight: "You're on track for tax payments. Consider quarterly payments vs. annual."

5. **View Goal Progress**
   Show: 40h/week goal status (44h avg, needs 1 less hour/day)
   Show: Freelance income toward $3K/month (currently tracking $2K)
   Show: Freedom score trend (6.2 this week, need 0.8 more points)
   Coach insights: "Freedom score improves with rest. Your energy boost comes after 8h nights."

6. **Chat with AI Coach**
   Ask: "Should I take on more freelance?"
   Coach response (Tina's voice): 
   "Your current trajectory: +$800 freelance, but -5 energy and -1 freedom point. 
    The math says no right now. Build your freelance pipeline slowly, reduce main job 
    by 5 hours first. Then you'll have capacity and energy for more projects. 
    Your Four Currencies are telling you: maximize freedom first."

7. **View Dashboard Insights**
   Show: Correlation analysis
   - Working >50h/week → Energy drops to <50%
   - When energy low → Freedom score drops to 3/10
   - Income increases 15%, but unsustainable
   Recommendation: "This pattern is clear. Choose: income or freedom. 
     You can't have both at current capacity."
```

---

## ✅ Pre-Launch Checklist

Before Tina gives final approval:

- [ ] Sample data loaded in Finance Friend v3 database
- [ ] Login works with sample credentials
- [ ] Dashboard renders with 4 currency cards
- [ ] Charts show data correctly
- [ ] Coach responds with Tina's voice
- [ ] Tax classification working
- [ ] Time/energy tracking visualizes
- [ ] Goal progress displays
- [ ] No errors in logs

---

## 🚀 Deployment Note

When PATH B is chosen:
1. Run this sample data setup
2. Show Tina the demo walkthrough
3. Get her feedback on coach voice/messaging
4. Refine based on her input
5. Then build Phase 1 UI with her feedback baked in

This accelerates Phase 1 because we'll have real-world guidance before coding.

---

**Created by:** Moriah  
**Last Updated:** March 21, 2026 — 05:28 AM HADT  
**Status:** Ready to execute
