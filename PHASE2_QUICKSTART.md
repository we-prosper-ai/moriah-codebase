# Phase 2 Quick Start — For Developers

**Status:** Phase 1 backends running. Phase 2 scaffolded and ready.  
**Estimated startup time:** 15 minutes to get full Phase 2 development environment running

---

## 1. Load Demo Data (2 minutes)

This creates 3 test users with realistic financial data.

```bash
cd finance-friend-v3/backend
npm run seed

# Output:
# ✅ Created user: Sarah Chen (sarah@example.com)
# ✅ Created user: Marcus Rivera (marcus@example.com)
# ✅ Created user: Jordan Williams (jordan@example.com)
# ✅ Added 10+ sample transactions per user
# ✨ Database seeding complete!
```

### Test the Auth System

```bash
# Start the backend
npm run dev

# In another terminal, test login
curl -X POST http://localhost:3777/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "sarah@example.com",
    "password": "demo-password-sarah"
  }'

# Should return JWT token + user data
```

---

## 2. Understanding the Code Structure (5 minutes)

```
finance-friend-v3/backend/
├── src/
│   ├── ai/                    # AI services (Coach, Tax Classifier)
│   │   ├── coach/
│   │   │   └── coach.service.ts       ← Coach chatbot logic
│   │   └── tax/
│   │       └── tax-classifier.service.ts ← Auto tax categorization
│   │
│   ├── routes/               # API endpoints
│   │   ├── auth.ts          ← Login/register (DONE)
│   │   ├── coach.ts         ← Coach chatbot (scaffolded, needs completion)
│   │   ├── dashboard.ts     ← Four Currencies dashboard (scaffolded)
│   │   ├── goals.ts         ← Budget planning (scaffolded)
│   │   ├── tax.ts           ← Tax classification (scaffolded)
│   │   └── ...
│   │
│   ├── models/
│   │   └── types.ts         ← TypeScript interfaces
│   │
│   ├── utils/
│   │   └── database.ts      ← SQLite3 helpers
│   │
│   └── index.ts             ← Express app setup
│
└── scripts/
    └── seed-demo-data.ts    ← Demo user creation script
```

### Key Files for Phase 2

| File | Purpose | Status |
|------|---------|--------|
| `src/ai/coach/coach.service.ts` | Coach AI logic | ✅ Ready (uses Anthropic SDK) |
| `src/routes/coach.ts` | Coach API endpoints | ⚠️ Scaffolded, needs wiring |
| `src/ai/tax/tax-classifier.service.ts` | Tax classification | ✅ Ready (uses Anthropic SDK) |
| `src/routes/tax.ts` | Tax API endpoints | ⚠️ Scaffolded, needs wiring |
| `src/routes/dashboard.ts` | Four Currencies view | ⚠️ Scaffolded, needs implementation |
| `src/routes/goals.ts` | Budget planning | ⚠️ Scaffolded, needs implementation |

---

## 3. Environment Variables (2 minutes)

Create a `.env` file in `finance-friend-v3/backend/`:

```env
# Database
DATABASE_URL=./finance-friend.db

# API Keys
ANTHROPIC_API_KEY=sk-ant-...  # For Coach & Tax Classifier
OPENAI_API_KEY=...             # (Optional: if using OpenAI instead of Anthropic)
GROQ_API_KEY=...               # (Optional: for Groq LLM if configured)

# Bank Integration (Plaid)
PLAID_CLIENT_ID=...
PLAID_SECRET=...
PLAID_ENV=sandbox              # Use 'sandbox' for testing

# Server
PORT=3777
NODE_ENV=development
JWT_SECRET=your-jwt-secret-here

# Logging
LOG_LEVEL=info
```

**For MVP testing:** You can skip bank integration. Use mock data or CSV uploads.

---

## 4. Start Development (3 minutes)

### Terminal 1: Backend Server

```bash
cd finance-friend-v3/backend
npm run dev

# Should output:
# ✅ Database connected: ./finance-friend.db
# ✅ Server running on http://localhost:3777
# Ready for requests
```

### Terminal 2: Frontend Server

```bash
cd finance-friend-v3/client
npm run preview    # or npm run dev

# Should output:
# ➜  Local:   http://localhost:3333
# Ready in X ms
```

### Terminal 3: Test the APIs

```bash
# 1. Login with demo user
curl -X POST http://localhost:3777/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "sarah@example.com", "password": "demo-password-sarah"}'

# 2. Use returned token for authenticated requests
TOKEN="eyJhbGc..."  # Token from response above

# 3. Get dashboard data (Four Currencies)
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3777/api/dashboard

# 4. Test coach (send message)
curl -X POST http://localhost:3777/api/coach/message \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "I worked 50 hours this week. Is that sustainable?"
  }'

# 5. Test tax classification
curl -X POST http://localhost:3777/api/tax/classify \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Adobe Creative Cloud monthly",
    "amount": -79.99
  }'
```

---

## 5. What's Already Done vs. What Needs Work

### ✅ Complete (Don't touch these)
- Authentication system (login, register, JWT tokens)
- Database schema and migrations
- Demo data seeding
- Basic Express app structure
- Service layer for Coach & Tax Classifier
- Route scaffolding for all endpoints

### ⚠️ Needs Completion
- **Coach route:** Wire up `coach.service` methods to API handlers
- **Tax route:** Wire up `tax.service` methods to API handlers
- **Dashboard route:** Aggregate time/energy/money/freedom scores
- **Goals route:** Create, read, update goal management
- **Frontend:** React components to display all features
- **Database:** May need additional migration scripts

### 🟢 Ready to Use (Phase 2)
- `coach.service.ts` — Just call its methods from routes
- `tax-classifier.service.ts` — Just call its methods from routes
- Demo data — Sarah Chen, Marcus Rivera, Jordan Williams ready to test with

---

## 6. Implementation Checklist

### Coach Chatbot
```typescript
// In src/routes/coach.ts, implement:
POST /api/coach/message
  Input: { message: string }
  Process: 
    1. Get user's recent transactions, goals, time entries
    2. Call coachService.chat(userProfile, message, conversationHistory)
    3. Store response in conversations table
    4. Return response to frontend
  Output: { response: string }

POST /api/coach/history
  Input: none
  Output: [{ role: "user|assistant", content: string, timestamp }]

POST /api/coach/analysis
  Input: none
  Process: Call coachService.analyzeWeek(userProfile, snapshot)
  Output: { insight: string }
```

### Tax Classifier
```typescript
// In src/routes/tax.ts, implement:
POST /api/tax/classify
  Input: { transactionId: string }
  Process:
    1. Fetch transaction from DB
    2. Call taxClassifier.classifyTransaction(transaction, userContext)
    3. Store classification in database
    4. Return result
  Output: { category, confidence, explanation }

GET /api/tax/report
  Input: { period: "month" | "quarter" | "year" }
  Process:
    1. Aggregate all classified transactions for period
    2. Calculate totals by category
    3. Estimate tax liability
  Output: TaxReport { totalIncome, deductibleExpenses, estimatedTax, categoryBreakdown }
```

### Dashboard
```typescript
// In src/routes/dashboard.ts, implement:
GET /api/dashboard
  Input: none
  Output: {
    fourCurrencies: {
      time: { current: 45, target: 40, trend: "up" },
      energy: { current: 6, target: 8, trend: "down" },
      money: { current: 4500, target: 5000, trend: "stable" },
      freedom: { current: 5, target: 8, trend: "up" }
    },
    goals: [{ text, progress, priority }],
    recentTransactions: [...],
    weeklyMetrics: {...}
  }
```

---

## 7. Testing Phase 2 Features

### Manual Testing

```bash
# Test coach responses
curl -X POST http://localhost:3777/api/coach/message \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message": "Should I take a higher-paying job that requires 60 hours/week?"}'

# Expected response: Thoughtful analysis referencing Four Currencies

# Test tax classification
curl -X POST http://localhost:3777/api/tax/classify \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"description": "Home internet for work", "amount": -80}'

# Expected response: { category: "utilities_business_use", confidence: 0.92, ... }
```

### Integration Testing

1. Login as Sarah Chen
2. View dashboard (should show her data)
3. Ask coach a question (should get personalized response)
4. Create a budget goal
5. Verify tax classifications for all her transactions
6. Generate tax report

---

## 8. Troubleshooting

### "Database not initialized"
```bash
# Rebuild it
rm finance-friend.db
npm run seed
```

### "Coach API returns empty response"
- Check `ANTHROPIC_API_KEY` is set
- Check network connectivity
- Check backend logs

### "Frontend can't reach backend"
- Verify backend running on port 3777
- Check CORS headers (should be set to allow origin)
- Check token is being sent in `Authorization` header

### "Seed script fails"
- Make sure you're in `backend` directory
- Check npm dependencies: `npm install`
- Check SQLite file permissions: `chmod 666 finance-friend.db`

---

## 9. Next Steps

1. **Start with Coach route** — It's the most valuable feature
2. **Wire up all scaffolded routes** — Most code is already there
3. **Test with demo users** — Sarah, Marcus, Jordan have realistic data
4. **Build frontend** — React components to display data
5. **Deploy to Vercel** — Production deployment

---

## Quick Reference: API Endpoints

### Auth
- `POST /api/auth/register` — Create account
- `POST /api/auth/login` — Login
- `POST /api/auth/verify` — Verify token

### Coach (Phase 2)
- `POST /api/coach/message` — Send message to coach
- `GET /api/coach/history` — Get conversation history
- `POST /api/coach/analysis` — Get weekly analysis

### Tax (Phase 2)
- `POST /api/tax/classify` — Classify transaction
- `GET /api/tax/report` — Get tax summary

### Dashboard (Phase 2)
- `GET /api/dashboard` — Get Four Currencies overview

### Goals (Phase 2)
- `POST /api/goals` — Create goal
- `GET /api/goals` — List goals
- `PUT /api/goals/:id` — Update goal

---

## Questions?

- **API details:** See `FINANCE_FRIEND_V3_ARCHITECTURE.md`
- **Database schema:** See `finance-friend-v3/backend/schema.sql`
- **Tina's voice framework:** See `FINANCE_FRIEND_V3_TINAS_VOICE.md`
- **Feature requirements:** See `FINANCE_FRIEND_V3_QUICK_REVIEW.md`

---

**Phase 2 is ready to build. Let's ship it.**
