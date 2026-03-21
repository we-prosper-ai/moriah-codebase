# Finance Friend v3 — Phase 2 Detailed Roadmap

**Created by:** Moriah  
**Date:** Friday, March 20, 2026  
**Status:** Ready to execute (awaiting Tina's blessing)

---

## 📋 Overview

Finance Friend v3 Phase 2 completes the core product by building:
- **Coach AI System** — Tina's voice integrated into the app
- **Tax Classification Engine** — Automatic + manual tax categorization
- **Budget Planning Tools** — Goal setting and scenario comparison
- **Energy Tracking** — Track energy alongside spending
- **Four Currencies Dashboard** — Master dashboard showing all metrics

**Estimated Time:** 3-5 days (full-time build)  
**Code Completeness:** Phase 1 database + API routes are 90% done; Phase 2 builds on this foundation

---

## 🏗️ Phase 2 Architecture Breakdown

### 1. Coach AI System (1-1.5 days)

**What it does:**
- Answers user questions about their finances
- Provides personalized coaching in Tina's voice + principles
- Suggests improvements based on spending patterns
- Asks clarifying questions to understand user context

**Code Structure:**
```
backend/src/
├── services/
│   ├── coachAI.service.ts (main coach logic)
│   ├── prompt-templates.ts (Tina's voice principles)
│   └── context-builder.ts (build conversation context)
├── routes/
│   └── coach.routes.ts (POST /api/coach/ask)
└── types/
    └── coach.types.ts
```

**API Endpoints:**
- `POST /api/coach/ask` — Ask coach a question
  ```json
  {
    "question": "Why did I spend so much on eating out?",
    "context": { "userId": "...", "recentTransactions": [...] }
  }
  ```
  Returns:
  ```json
  {
    "response": "I noticed you spent $450 on food this month...",
    "reasoning": "Pattern analysis shows...",
    "suggestion": "Consider setting a $300 budget..."
  }
  ```

**Implementation Details:**
1. **Tina's Voice Integration:**
   - Store principles in `constants/tina-voice.ts`
   - Reference in every coach response
   - Examples: "Time is freedom," "What are your non-negotiables?", "Build systems, not willpower"

2. **Context Building:**
   - Pull user's recent transactions (last 30 days)
   - Include Four Currencies state (time, energy, money, freedom)
   - Reference user's goals and budget allocations

3. **OpenAI Integration:**
   ```typescript
   const response = await openai.chat.completions.create({
     model: "gpt-4-turbo-preview",
     messages: [
       { role: "system", content: TINA_VOICE_SYSTEM_PROMPT },
       { role: "user", content: userQuestion }
     ],
     temperature: 0.7,
     max_tokens: 500
   })
   ```

**Testing:**
- Unit tests for prompt generation
- Integration tests with mock OpenAI responses
- User acceptance tests with real questions

---

### 2. Tax Classification Engine (1-1.5 days)

**What it does:**
- Automatically categorizes transactions for tax purposes
- Supports personal (Schedule C deductions) and business classifications
- Allows user override and correction
- Exports tax-ready summaries

**Code Structure:**
```
backend/src/
├── services/
│   ├── taxClassifier.service.ts (main logic)
│   ├── rules-engine.ts (classification rules)
│   └── exports.service.ts (generate tax reports)
├── routes/
│   └── tax.routes.ts
└── types/
    └── tax.types.ts
```

**API Endpoints:**
- `POST /api/transactions/:id/classify` — Manually classify a transaction
  ```json
  { "taxCategory": "office-supplies", "note": "Laptop for client work" }
  ```

- `GET /api/tax/summary` — Get tax summary by category
  ```json
  {
    "categories": {
      "office-supplies": 1250,
      "meals-entertainment": 450,
      "travel": 600
    },
    "totalDeductible": 2300
  }
  ```

- `GET /api/tax/export/pdf` — Export tax summary as PDF

**Implementation Details:**
1. **Classification Rules:**
   ```typescript
   const rules = {
     "office-supplies": {
       keywords: ["amazon", "staples", "office"],
       categories: ["business-expense"],
       confidence: 0.8
     },
     "meals-entertainment": {
       keywords: ["restaurant", "coffee", "cafe"],
       categories: ["personal", "business-meal"],
       confidence: 0.6
     }
   }
   ```

2. **Two-tier Classification:**
   - **Automatic:** Run rules engine on all transactions (keywords, amounts, patterns)
   - **Manual:** User can override or add custom classifications
   - **Reporting:** Separate personal vs. business deductible items

3. **Export Formats:**
   - PDF with category breakdowns
   - CSV for tax accountant
   - JSON for integration with TurboTax API

**Testing:**
- Unit tests for each classification rule
- Edge cases (ambiguous transactions, new categories)
- Export format validation

---

### 3. Budget Planning Tools (1.5-2 days)

**What it does:**
- Create budgets for spending categories
- Set goals (e.g., "Save $500 this month")
- Compare scenarios ("What if I cut dining 50%?")
- Track progress against budget

**Code Structure:**
```
backend/src/
├── services/
│   ├── budget.service.ts (budget creation/updates)
│   ├── goals.service.ts (goal tracking)
│   └── scenarios.service.ts (scenario comparison)
├── routes/
│   └── budgets.routes.ts
└── types/
    └── budget.types.ts
```

**API Endpoints:**
- `POST /api/budgets` — Create a budget
  ```json
  {
    "month": "2026-03",
    "categories": {
      "groceries": 400,
      "dining": 300,
      "utilities": 150
    }
  }
  ```

- `GET /api/budgets/:id/progress` — Get budget progress
  ```json
  {
    "category": "groceries",
    "budget": 400,
    "spent": 320,
    "remaining": 80,
    "percentUsed": 80
  }
  ```

- `POST /api/budgets/:id/scenarios` — Create "what-if" scenario
  ```json
  {
    "name": "Conservative Plan",
    "adjustments": { "dining": -50, "entertainment": -100 }
  }
  ```
  Returns: Projected savings, impact on goals

**Implementation Details:**
1. **Budget Tracking:**
   - Real-time spent amount calculated from transactions
   - Warnings when approaching limit (75%, 90%)
   - Rollover capability (unused budget carries to next month)

2. **Goal Integration:**
   - Goals stored with deadline and target amount
   - Coach suggests budget adjustments to hit goals
   - Track progress with visual charts

3. **Scenario Comparison:**
   - "What if" simulations based on user's actual data
   - Show impact on Four Currencies (freed-up time/energy/freedom)
   - Compare multiple scenarios side-by-side

**Testing:**
- Unit tests for budget calculations
- Integration tests with sample budgets
- Edge cases (zero budgets, overspending, multiple goals)

---

### 4. Energy Tracking Module (0.5 days)

**What it does:**
- Log energy levels throughout the day
- Correlate energy with spending (do you overspend when tired?)
- Track energy impact of financial decisions

**Code Structure:**
```
backend/src/
├── services/
│   └── energy.service.ts
├── routes/
│   └── energy.routes.ts
└── types/
    └── energy.types.ts
```

**API Endpoints:**
- `POST /api/energy/log` — Log energy level
  ```json
  { "level": 7, "note": "Great morning, got 8 hours sleep" }
  ```

- `GET /api/energy/analysis` — Analyze energy patterns
  ```json
  {
    "averageEnergy": 6.2,
    "correlations": {
      "spending-high-when-energy-low": 0.62,
      "weekday-lower-than-weekend": 0.78
    }
  }
  ```

**Implementation:**
- Simple energy scale (1-10)
- Optional notes for context
- Weekly summaries
- Correlation with spending patterns

---

### 5. Four Currencies Dashboard (1 day)

**What it does:**
- Master dashboard showing all four currencies:
  - **Time:** Hours available vs. hours used (sleep, work, finance management)
  - **Energy:** Daily average energy + correlation with spending
  - **Money:** Budget vs. actual, cash flow projections
  - **Freedom:** Score based on debt, goals completed, time available

**Code Structure:**
```
backend/src/
├── services/
│   └── dashboard.service.ts (aggregates all data)
├── routes/
│   └── dashboard.routes.ts
└── types/
    └── dashboard.types.ts

frontend/src/
├── pages/
│   └── DashboardPage.tsx (main dashboard)
├── components/
│   ├── CurrencyCard.tsx (individual currency)
│   ├── TrendChart.tsx (historical trends)
│   └── InsightsPanel.tsx (AI-generated insights)
```

**API Endpoint:**
- `GET /api/dashboard/summary` — Get all Four Currencies
  ```json
  {
    "time": {
      "total_available": 1440,
      "sleep": 480,
      "work": 480,
      "personal": 300,
      "financial_management": 45,
      "free_time": 135
    },
    "energy": {
      "average_7day": 6.8,
      "trend": "improving",
      "correlation_with_spending": 0.55
    },
    "money": {
      "monthly_income": 4500,
      "monthly_spending": 2800,
      "savings_rate": 0.38,
      "debt_payoff_months": 18
    },
    "freedom": {
      "score": 72,
      "debt_free": false,
      "goals_on_track": 3,
      "discretionary_income": 1700
    }
  }
  ```

**Frontend Implementation:**
- Responsive dashboard layout
- Real-time updates via WebSocket
- Charts for trends (30-day, 90-day, 1-year)
- Actionable insights from Coach AI

---

## 🛠️ Implementation Order

**Day 1:**
- Morning: Coach AI system (foundation for personalization)
- Afternoon: Tax Classification (core business value)

**Day 2:**
- Morning: Budget Planning (goal tracking)
- Afternoon: Energy Tracking + integration

**Day 3:**
- Morning: Four Currencies Dashboard
- Afternoon: Testing, optimization, polish

**Day 4-5:**
- Integration testing across all modules
- Performance optimization
- Documentation
- Beta testing with real users

---

## 📦 Deliverables

By end of Phase 2:

1. **Backend API** — All endpoints complete and tested
2. **Frontend UI** — Dashboard, Coach chat, Tax interface, Budget planning
3. **Database** — All schemas implemented, migrations tested
4. **Documentation** — API docs, user guide, admin guide
5. **Tests** — Unit tests (80%+ coverage), integration tests
6. **Deployment** — Ready for Vercel/Railway deployment

---

## 🚀 Go-Live Plan

Once Phase 2 is complete:

1. **Internal Testing:** Tina + team use for 1 week
2. **Beta Users:** 5-10 early adopters (free access)
3. **Feedback Loop:** Collect issues and feature requests
4. **Launch:** Public launch with freemium pricing
   - Free: Basic dashboard, 1 budget
   - Pro: Unlimited budgets, tax exports, Coach AI
   - Pricing: $9.99/month or $888/year (align with course pricing)

---

## 💡 Key Principles

1. **Build on Phase 1:** Don't rewrite; extend the foundation
2. **Tina's Voice First:** Every feature reflects her principles
3. **Real Data:** Use sample data and test with actual patterns
4. **User-Centered:** Coach AI and Tax tools solve real pain points
5. **Revenue-Ready:** Every feature contributes to paid product

---

## ✅ Success Criteria

- All Phase 2 endpoints complete and tested ✓
- Frontend is production-ready (responsive, performant) ✓
- Zero critical bugs in beta testing ✓
- Coach AI responds in Tina's voice ✓
- Tax classification achieves 85%+ accuracy ✓
- Dashboard loads in <2s ✓
- Database scales to 10K users ✓

---

## 🎯 Next Steps

1. **Confirm Phase 2 architecture** with Tina
2. **Set team sprint** (3-5 day build sprint)
3. **Begin Coach AI implementation** (highest priority)
4. **Daily standups** to catch blockers
5. **User feedback** during beta phase

---

**Phase 2 Status:** Ready to build (awaiting go-ahead)  
**All code templates prepared:** ✓  
**Deployment automation ready:** ✓  
**Timeline clear:** 3-5 days to production ✓

---

Authored by Moriah  
Last Updated: March 20, 2026 — 21:10 HADT
