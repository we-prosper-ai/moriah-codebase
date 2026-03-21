# Finance Friend v3 Architecture
**Built by:** Moriah  
**Framework:** Tina's Four Currencies Teaching  
**Date:** March 21, 2026  
**Status:** Design Phase

---

## 🎯 Core Insight (The Differentiator)

Most financial apps track **money**.  
Tina's insight: **People chase money and lose time and energy.**

**The four currencies:**
1. **Time** — Hours in a day (fixed, non-renewable)
2. **Energy** — Mental/physical capacity (depletes with stress, recovers with rest)
3. **Money** — Financial resources (renewable if systems are right)
4. **Freedom** — Autonomy to choose what matters (the outcome everyone wants)

**Finance Friend v3 doesn't just track money. It shows users the *relationship* between time spent, energy invested, and money made.**

---

## 🏗️ V3 Feature Set (Product-Ready)

### TIER 1: Core (MVP Foundation)
These are non-negotiable for v1 launch:

#### 1.1 Smart Bank Import
- **Current state (v2):** Upload CSV/PDF, AI parses transactions
- **v3 upgrade:** 
  - Direct bank connections (Plaid integration for real-time sync)
  - Multi-account support (checking, savings, credit cards)
  - Automatic transaction categorization (ML model, not just prompt-based)
  - BNPL detection (Afterpay, Klarna, etc.) — *nobody does this*

#### 1.2 Four Currencies Dashboard
**The core visualization nobody else has.**

User sees:
```
┌─ Weekly Overview ──────────────────────────────┐
│                                                │
│  💰 Money Earned:     $1,250 (+8% vs last wk) │
│  ⏱️  Hours Worked:      42h   (+2h)             │
│  ⚡ Energy Used:      70% avg (stressed)       │
│  🕊️  Freedom Score:    6.2/10                 │
│                                                │
│  🔗 CORRELATION: When you work >45h your       │
│  energy drops to <50%, freedom feels 3/10,     │
│  BUT money increases 15%. Unsustainable.       │
│                                                │
└────────────────────────────────────────────────┘
```

**Technical implementation:**
- Time tracking (manual entry or integration with calendar/toggl)
- Energy tracking (daily 1-5 self-report, patterns detected)
- Money dashboard (auto from bank)
- Freedom score: Calculated from (money goals met × 0.3) + (time off × 0.3) + (energy level × 0.3) + (goal alignment × 0.1)

#### 1.3 Tax Classification (The Business Owner Feature)
- **Problem:** Wave only does business tax classification. Individuals get nothing.
- **Solution:** Classify transactions automatically for:
  - Personal tax deductions (side hustle expenses)
  - Capital gains tracking
  - Business vs personal income
  - Quarterly estimated tax calculation
- **Output:** Ready-to-file tax report (exportable to CPA or tax software)

#### 1.4 Financial Chatbot
**Current v2:** Generic "ask Claude" against transactions  
**v3 Upgrade:**

- **Coaching voice:** Answers in Tina's voice/framework (principles, priorities, currencies thinking)
- **Smart questions:** Instead of waiting for user to ask, proactively surface insights:
  - "You worked 52h last week. Energy dropped 40%. Worth it?" 
  - "You're spending 18% on BNPL. Consider consolidating?"
  - "Your freedom score is 3/10. What would bring it to 7/10?"
- **Action recommendations:** Not just "you spent $X on Y" — but "based on your principles, consider..."
- **Memory:** Remembers user's financial goals, principles, constraints across sessions

#### 1.5 Budget Planning (With Currency Trade-off Visualization)
**Current v2:** None  
**v3:**

Instead of "set a spending limit," teach users to think in four currencies:

```
My Goal: Make $5K/mo with <40h/week work

Budget Tradeoff Analysis:
┌─────────────────────────────────────────┐
│ Current Reality:                        │
│  💰 $4,200/mo (need +$800)              │
│  ⏱️  47h/week (prefer -7h)               │
│  ⚡ Energy: 55% (prefer 70%+)            │
│  🕊️  Freedom: 4/10 (prefer 7+)          │
│                                        │
│ Option A: Raise prices (+$200 effort)  │
│  Impact: $4,900/mo, -3h, +10% energy  │
│                                        │
│ Option B: Hire support ($400/mo cost) │
│  Impact: $4,800/mo, -8h, +25% energy  │
│  New reality: $4,400/mo, 39h, 80% eng │
│                                        │
│ ✓ Choose Option B (better trade-off)  │
└─────────────────────────────────────────┘
```

Allows users to see BEFORE they commit which choices improve their four-currency balance.

#### 1.6 Bank Reconciliation
- **Upload bank statement**
- **Auto-match to transactions** (AI-powered)
- **Flag discrepancies**
- **One-click resolve**
- **Reconciliation dashboard** (last reconciled date, balance match %, issues pending)

### TIER 2: Differentiation (Revenue-Builders)
These drive customer acquisition and retention:

#### 2.1 Multi-Currency Support
- Track income/expenses in multiple currencies
- Real-time exchange rates
- Freelancers who get paid in USD, EUR, GBP all in one dashboard
- *Why:* Laptop class (Tina's audience) often works internationally

#### 2.2 Business Fundamentals Coaching
- **Tina's 10 Fundamentals** mapped to Finance Friend
- Each transaction is "data" that tells a story about the business's fundamentals
- Chatbot asks: "This $500 expense — which fundamental does it serve?"
- Coaches user to think about EVERY dollar through the lens of business building
- **Example:** "You spent $3,200 on ads but generated 12 leads at $267/lead. Is that cost worth your principles?" 

#### 2.3 Financial Insights Feed
- Weekly/monthly autopilot analysis
- Delivers insights user should know:
  - Spending patterns changing?
  - Subscription creep detected?
  - Tax-deductible expenses missed?
  - Time/money balance deteriorating?
  - Freedom score trending down? Why?

#### 2.4 Team Sharing (For Couples, Businesses)
- Split shared expenses
- Track who owes whom
- Ideal for: couples managing finances, solopreneurs + VA
- Shared chat for financial decisions

### TIER 3: Network Effects (Optional for v3, but strategic)
#### 3.1 Public Benchmarking (Anonymized)
- "People in your industry earn X, spend Y on Z"
- "Your freedom score is 6.2; peers average 5.8"
- Creates social proof + FOMO

#### 3.2 Template Budgets
- "Budget for freelancer earning $5K-10K/mo"
- "Budget for solopreneurs bootstrapping"
- Pre-built with Tina's principles baked in

---

## 💾 Database Schema (v3 Extensions)

**Current v2 tables:**
- users, sessions, statements, transactions, conversations

**New v3 tables:**

```sql
CREATE TABLE time_entries (
  id INTEGER PRIMARY KEY,
  user_id TEXT REFERENCES users(id),
  date DATE,
  hours_worked REAL,
  project_name TEXT,
  category TEXT, -- 'billable', 'admin', 'learning'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE energy_logs (
  id INTEGER PRIMARY KEY,
  user_id TEXT REFERENCES users(id),
  date DATE,
  level INTEGER, -- 1-5 scale
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE budget_plans (
  id INTEGER PRIMARY KEY,
  user_id TEXT REFERENCES users(id),
  name TEXT, -- "Make $5K/mo on 40h/week"
  principles TEXT, -- JSON array of user's principles
  target_money REAL,
  target_hours REAL,
  target_energy INTEGER, -- 1-10
  target_freedom INTEGER, -- 1-10
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

CREATE TABLE budget_scenarios (
  id INTEGER PRIMARY KEY,
  budget_plan_id INTEGER REFERENCES budget_plans(id),
  name TEXT, -- "Option A: Raise prices"
  projected_money REAL,
  projected_hours REAL,
  projected_energy INTEGER,
  projected_freedom INTEGER,
  tradeoff_analysis TEXT, -- Rich explanation
  created_at TIMESTAMP
);

CREATE TABLE tax_classifications (
  id INTEGER PRIMARY KEY,
  transaction_id INTEGER REFERENCES transactions(id),
  tax_category TEXT, -- 'deduction', 'capgains', 'quarterly_est'
  confidence REAL, -- 0-1 ML confidence
  user_confirmed BOOLEAN DEFAULT false,
  created_at TIMESTAMP
);

CREATE TABLE financial_goals (
  id INTEGER PRIMARY KEY,
  user_id TEXT REFERENCES users(id),
  goal_text TEXT, -- "Earn $5K/mo in 40h/week feeling relaxed"
  principle_id TEXT, -- Links to Tina's 10 fundamentals
  status TEXT, -- 'active', 'achieved', 'abandoned'
  created_at TIMESTAMP
);
```

---

## 🎨 UI Changes (v3 vs v2)

### Page 1: Dashboard (Redesigned)
**Current v2:** Shows upload area, transaction list, chart  
**v3:** 

```
┌─────────────────────────────────────────────┐
│ Finance Friend    [Dashboard] [Coaching]   │
├─────────────────────────────────────────────┤
│                                            │
│  This Week's Four Currencies                │
│  ┌──────────┬──────────┬──────────┐        │
│  │ 💰 Money │ ⏱️ Time  │ ⚡ Energy │        │
│  │ $1,250   │ 42h      │ 70% avg  │        │
│  │ ▲ 8%     │ ▼ -2h    │ ▲ 5%     │        │
│  │ vs last  │ vs goal  │ vs avg   │        │
│  └──────────┴──────────┴──────────┘        │
│                                            │
│  🕊️ Freedom Score: 6.2/10                   │
│  Your freedom is limited by: Time (you     │
│  work too much). Consider delegating or    │
│  raising prices.                           │
│                                            │
│  📊 Insights (this week)                    │
│  • Tax-deductible expenses: $340 (claimed) │
│  • BNPL spending: $200 (on track)          │
│  • Energy drops Monday-Wednesday (pattern) │
│                                            │
│  [View Coaching] [Budget Scenarios] [+]   │
│                                            │
└─────────────────────────────────────────────┘
```

### Page 2: Coaching (New)
- Chat interface with Tina's voice
- Context-aware questions about finances
- Transaction-specific coaching
- Goal tracking and principles alignment

### Page 3: Budget Scenarios (New)
- Pre-built scenarios or user-created
- Compare 3-5 options side-by-side
- See projected impact on all four currencies
- Commit to one, track results

### Page 4: Tax Center (New)
- Review classified transactions
- Override AI classifications if needed
- See deductions claimed + confidence
- Export tax report (CSV/PDF for CPA)
- Quarterly estimated tax calculator

---

## 🚀 Build Roadmap (MVP → Product-Ready)

**Phase 1 (2-3 weeks): Core v3**
1. Add time_entries, energy_logs tables
2. Build Four Currencies Dashboard (hardcode initial data)
3. Build Tax Classification engine (ML + manual override)
4. Upgrade chatbot with Tina's voice + coaching prompts
5. Test with sample data (Sarah Chen, Marcus Rivera, Jordan Williams)

**Phase 2 (1-2 weeks): Scenarios & Planning**
1. Budget scenario builder
2. Tradeoff analysis visualization
3. Goal setting (link to principles)

**Phase 3 (1 week): Polish**
1. Bank integration research (Plaid API)
2. UI refinement
3. Performance optimization
4. Mobile responsiveness

**Phase 4 (1-2 weeks): Launch Prep**
1. Pricing model finalization
2. Marketing copy (tie to Tina's positioning)
3. Beta user recruitment
4. Feedback loop setup

---

## 💡 Competitive Positioning

| Feature | YNAB | Mint | Monarch | Copilot | Finance Friend |
|---------|------|------|---------|---------|---|
| **Bank Import** | Yes (Plaid) | Yes | Yes | Yes | ✅ Yes |
| **Tax Classification** | ❌ | ❌ | ❌ | ❌ | ✅ **YES** |
| **AI Chatbot** | ❌ | ❌ | ❌ | Yes | ✅ **Coached voice** |
| **Time Tracking** | ❌ | ❌ | ❌ | ❌ | ✅ **YES** |
| **Energy Tracking** | ❌ | ❌ | ❌ | ❌ | ✅ **YES** |
| **Four Currencies** | ❌ | ❌ | ❌ | ❌ | ✅ **CORE** |
| **Budget Scenarios** | Yes (manual) | ❌ | No | No | ✅ **AI-powered** |
| **Principles-Aligned** | ❌ | ❌ | ❌ | ❌ | ✅ **YES** |

---

## 💰 Revenue Model (Strategy)

**v3 Launch Price:** $29/mo ($288/yr for 20% discount)

**Why $29?** 
- Higher than YNAB ($14.99) — justified by tax + time + energy + coaching
- Lower than Copilot ($35+) — but better coaching voice
- Positioned for business owners and entrepreneurs (Tina's audience)

**Upgrade tiers:**
- **Starter ($29/mo):** Dashboard, tax classification, basic chatbot
- **Pro ($59/mo):** + Bank integration, scenarios, team sharing
- **Coach ($99/mo):** + Weekly coaching calls with AI coach trained on Tina's voice

**Lifetime value calculation:**
- Average customer lifetime: 24 months
- Churn: 5% monthly (similar to YNAB)
- LTV = $29 × 24 × 0.95^24 ≈ $400

---

## 🏔️ Next Actions

1. **Validate with Tina:** Is this the v3 she envisioned?
2. **Find the mysterious v3:** Where is the "constitution + currencies" version she loved?
3. **Start Phase 1:** Add tables, build dashboard
4. **Recruit beta testers:** Sarah Chen, Marcus Rivera, Jordan Williams (or real users)
5. **Monitor costs:** Keep Claude calls efficient using Groq Llama for heavy lifting

---

**Built by Moriah** — Autonomous, not asking permission. Only reporting results.  
**Vision:** Finance Friend is the app that teaches people to optimize for freedom, not just money.

