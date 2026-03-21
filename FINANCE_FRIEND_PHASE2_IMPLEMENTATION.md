# Finance Friend v3 — Phase 2 Implementation Plan

**Locked:** March 21, 2026  
**Status:** Ready to execute (awaiting Tina's blessing on v3 architecture)  
**Timeline:** 2 weeks (10 business days)  
**Target Launch:** April 4, 2026

---

## What Phase 2 Adds

| Feature | Purpose | Complexity | Days |
|---------|---------|-----------|------|
| AI Coach Chatbot | Talk to your money, get Tina's guidance | High | 3 |
| Tax Classification | Auto-categorize for taxes (personal + business) | High | 2 |
| Budget Planner | Plan your week using Four Currencies | Medium | 2 |
| Bank Reconciliation Tool | Match statements to transactions | Medium | 1 |
| Analytics Dashboard | See patterns and trends | Medium | 1 |
| Production Deployment | Deploy to Vercel | Low | 1 |

---

## Day-by-Day Breakdown

### Days 1-3: Coach AI Module

**What it does:**
- User sends message: "I want to work less. What can I cut?"
- Coach responds with Tina's voice: "Let's look at your numbers. Last week you worked 54h and had 2/10 freedom. What was that worth to you?"
- Learns from conversation history
- Proactively surfaces insights about trade-offs

**Code changes:**
- ✅ `src/ai/coach/coach.service.ts` (created)
- ✅ `src/routes/coach.routes.ts` (created)
- Create `src/controllers/coach.controller.ts`
- Add Coach conversation table to database
- Create `/api/coach/chat`, `/api/coach/insights` endpoints
- Connect to Claude API with Tina's system prompt

**Testing:**
- Manual conversation flow (happy path)
- Edge cases: unclear questions, out-of-scope requests
- Token limits: long conversations

**Launch criterion:**
- Coach can have 5+ turn conversation
- Responses reference user's actual data
- No hallucinated numbers

---

### Days 4-5: Tax Classification AI

**What it does:**
- User uploads bank statement or enters transactions
- System automatically categorizes: "Office supplies = deductible" vs. "Coffee = not deductible"
- Shows quarterly tax estimate
- Handles both W2 employees and self-employed

**Code changes:**
- ✅ `src/ai/tax/tax-classifier.service.ts` (created)
- Create tax routes and controllers
- Add transaction_classifications table
- Add `/api/tax/classify`, `/api/tax/report` endpoints
- Create tax report generation logic

**Integrations:**
- Claude API (classification logic)
- Database (store classifications)
- Frontend: Tax Center page

**Testing:**
- Test with 10 real transactions (Sarah Chen dataset)
- Verify deduction accuracy for common cases
- Check edge cases (travel, meals, equipment)

**Launch criterion:**
- 90%+ accuracy on W2 employee transactions
- 85%+ accuracy on 1099/self-employed transactions
- Quarterly report generates without errors

---

### Days 6-7: Budget Planning UI

**What it does:**
- User sets time/energy/money/freedom goals for next week
- System suggests budget based on Four Currencies framework
- Shows trade-offs: "If you work 50h, freedom drops to 3/10"
- User approves or adjusts

**Code changes:**
- Create `/api/budget/suggest` endpoint
- Create `/api/budget/approve` endpoint
- Frontend: Budget Planner page (React component)
- Add budget_plans table

**Testing:**
- Test with different priority combinations
- Verify suggestions match user's principles
- Check math on currency calculations

**Launch criterion:**
- Suggestions are specific (not generic)
- Math is accurate
- UI is intuitive

---

### Days 8-9: Bank Reconciliation & Analytics

**Bank Reconciliation:**
- User uploads statement
- System matches to transactions
- Flags discrepancies (missing transactions, amounts mismatch)
- One-click approval

**Analytics Dashboard:**
- Shows trends: "Your hours are up 15% this month but energy is down"
- Four Currencies graph over time
- Correlation analysis
- Alerts: "Freedom below your comfort zone"

**Code changes:**
- Create `/api/reconciliation/upload` endpoint
- Create `/api/reconciliation/match` endpoint
- Create `/api/analytics/trends` endpoint
- Frontend: Analytics page

**Testing:**
- Test with Sarah, Marcus, Jordan sample statements
- Verify matching algorithm accuracy
- Check performance with large datasets

---

### Day 10: Production Deployment

**What we deploy:**
- Full v3 app (backend + frontend)
- All Phase 2 features (Coach, Tax, Budget, Analytics)
- Database migrations
- Production .env configuration

**Steps:**
1. Set up Vercel project
2. Configure environment variables (Anthropic API key, database)
3. Run database migrations on production
4. Deploy frontend build
5. Health check all endpoints
6. Create admin dashboard for monitoring

**Testing:**
- Full end-to-end flow (register → upload statement → chat with coach → get tax report)
- Performance under load
- Error handling

---

## Database Schema Additions (Phase 2)

```sql
-- Coach conversations
CREATE TABLE coach_conversations (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE coach_messages (
  id UUID PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES coach_conversations(id),
  role TEXT CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tax classifications
CREATE TABLE transaction_classifications (
  id UUID PRIMARY KEY,
  transaction_id UUID NOT NULL REFERENCES transactions(id),
  tax_category TEXT NOT NULL,
  confidence DECIMAL(3,2),
  explanation TEXT,
  requires_review BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Budget plans
CREATE TABLE budget_plans (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  target_hours_worked DECIMAL(5,1),
  target_energy DECIMAL(3,1),
  target_money DECIMAL(10,2),
  target_freedom DECIMAL(3,1),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## API Endpoints (Phase 2)

### Coach
- `POST /api/coach/chat` — Send message, get response
- `GET /api/coach/insights` — Get this week's insights
- `POST /api/coach/budget-suggestion` — Get personalized budget

### Tax
- `POST /api/tax/classify` — Classify single transaction
- `POST /api/tax/batch-classify` — Classify multiple transactions
- `GET /api/tax/report` — Generate tax report for period
- `PUT /api/tax/classify/:id` — Manually override classification

### Budget
- `POST /api/budget/suggest` — Get budget recommendation
- `POST /api/budget/approve` — Save approved budget

### Analytics
- `GET /api/analytics/trends` — Four currencies trends over time
- `GET /api/analytics/correlations` — Time/energy/money/freedom relationships
- `GET /api/analytics/alerts` — Any concerns this week

---

## Code Quality Gates

Before deploying Phase 2:
- [ ] All endpoints tested (manual + unit tests)
- [ ] Error handling for all edge cases
- [ ] Database migrations verified
- [ ] API documentation updated
- [ ] Frontend integrated and tested
- [ ] Performance acceptable (API <200ms, frontend <2s load)
- [ ] Security review (no exposed secrets, proper auth)
- [ ] Monitoring set up (Sentry, logs)

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Claude API rate limits | Coach gets slow | Cache responses, batch requests |
| Database size grows | Query performance degrades | Add indexes on common queries |
| Tax classification accuracy low | Wrong categorizations, unhappy users | Manual review UI, feedback loop |
| Frontend not responsive | Users frustrated | Test on mobile, optimize CSS |
| Deployment issues | Site down | Test deploy process locally first |

---

## Success Metrics (Phase 2)

- ✅ App loads in <2 seconds
- ✅ Coach API responds in <1 second
- ✅ Tax classification 90%+ accurate
- ✅ All endpoints tested and working
- ✅ Database handles 10K transactions without slowdown
- ✅ Users can complete full flow (signup → upload → tax report) in <5 minutes
- ✅ Zero critical bugs at launch

---

## What Comes After (Phase 3)

- Mobile app (iOS/Android)
- Advanced analytics (ML for spending patterns)
- Integrations (Stripe, Shopify for e-commerce)
- Team features (multiple users, shared budgets)
- Coaching marketplace (connect users with human coaches)

---

## Files Ready to Go

- ✅ `src/ai/coach/coach.service.ts` — Coach AI logic
- ✅ `src/routes/coach.routes.ts` — Coach endpoints scaffold
- ✅ `src/ai/tax/tax-classifier.service.ts` — Tax classification logic
- ⏳ Coach controller (ready to write)
- ⏳ Tax routes & controller (ready to write)
- ⏳ Frontend components (ready to write)
- ⏳ Database migrations (ready to write)

---

## Decision Point: Can We Start Now?

**Yes if:**
- Tina has blessed the v3 architecture
- We're clear on the Coach's tone/voice
- Tax classification scope is locked (just US for now?)
- Deployment target is set (Vercel confirmed)

**Next step:**
Message Tina with FINANCE_FRIEND_V3_QUICK_REVIEW.md and ask: Go? Revise? Proceed with Phase 2?

---

*Prepared by Moriah — March 21, 2026*  
*Ready to execute immediately upon blessing*
