# Finance Friend v2 — LAUNCH CHECKLIST
**Status:** Ready to Deploy  
**Timeline to Live:** 30 minutes (15 min deployment + 15 min testing)  
**Estimated Cost:** $0-20/month (free tier with Vercel + Supabase)

---

## 📋 Pre-Launch Checklist

### Phase 1: Prepare Infrastructure (5 minutes)

- [ ] **GitHub Repo Creation**
  - [ ] Create `we-prosper-ai/finance-friend-v2` repo
  - [ ] Set description: "AI-powered personal finance dashboard with transaction uploads and intelligent chat"
  - [ ] Share with tmnsystems (admin access)
  - [ ] Add topics: `finance`, `ai`, `typescript`, `react`, `sqlite`

- [ ] **Environment Setup**
  - [ ] Generate 32-character JWT secret: `openssl rand -hex 16`
  - [ ] Store in .env.example (git-safe) and actual .env (gitignored)
  - [ ] Verify OPENAI_API_KEY is set (or Groq key if switching)
  - [ ] Test database initialization: `npm run init-db`

- [ ] **Vercel Account Check**
  - [ ] Login to Vercel (vercel.com)
  - [ ] Create new project from GitHub
  - [ ] Connect `we-prosper-ai/finance-friend-v2`
  - [ ] Add environment variables to Vercel (JWT_SECRET, API keys)

### Phase 2: Deploy to Vercel (5 minutes)

- [ ] **Code Push**
  ```bash
  git add .
  git commit -m "Deploy Finance Friend v2 to Vercel"
  git push origin main
  ```

- [ ] **Vercel Auto-Deploy**
  - [ ] Wait for Vercel build (2-3 minutes)
  - [ ] Check build logs for errors
  - [ ] Verify deployment URL: `https://finance-friend-v2.vercel.app`

- [ ] **Environment Variables**
  - [ ] JWT_SECRET: ✓
  - [ ] OPENAI_API_KEY: ✓
  - [ ] Database: SQLite on Vercel (file-based, works with serverless)

### Phase 3: Test Live App (10 minutes)

- [ ] **User Registration Flow**
  - [ ] Visit `https://finance-friend-v2.vercel.app`
  - [ ] Register with test email: `testuser@example.com`
  - [ ] Verify form validation (email required, password strength)
  - [ ] Confirm success message

- [ ] **User Login Flow**
  - [ ] Log out (if auto-logged in)
  - [ ] Log back in with same credentials
  - [ ] Verify JWT token is set (check browser dev tools → Application → Cookies)
  - [ ] Verify "user dashboard" loads

- [ ] **Transaction Upload**
  - [ ] Click "Upload Bank Statement"
  - [ ] Use sample CSV: `sample-statements/sarah-chen.csv`
  - [ ] Verify file uploads and parses
  - [ ] Confirm transactions appear in dashboard

- [ ] **Chat Integration**
  - [ ] Click "Ask Finance Friend"
  - [ ] Ask: "What's my total spending this month?"
  - [ ] Verify AI responds with summary from uploaded data
  - [ ] Test follow-up: "Which category had the most spending?"

- [ ] **Dashboard Metrics**
  - [ ] Total transactions displayed
  - [ ] Spending by category (pie chart or bar)
  - [ ] Monthly trend visible
  - [ ] No errors in browser console (F12)

### Phase 4: Production Hardening (5 minutes)

- [ ] **Security Checks**
  - [ ] Remove sample data from repo (if any)
  - [ ] Verify .env.example doesn't contain real secrets
  - [ ] Check API endpoints require auth (no unauthorized access)
  - [ ] Test CORS headers are correct

- [ ] **Performance Checks**
  - [ ] Page load time < 3 seconds
  - [ ] Dashboard render < 1 second after login
  - [ ] CSV upload handles files up to 10 MB
  - [ ] API response times: < 500ms for GET, < 1s for POST

- [ ] **Error Handling**
  - [ ] Try invalid login (wrong password) → shows error
  - [ ] Try upload invalid CSV → shows helpful error
  - [ ] Try chat with no data uploaded → shows "no data" message
  - [ ] Browser back button works correctly

### Phase 5: User Testing & Feedback (15 minutes)

- [ ] **Recruit Beta Users** (2-3 people)
  - [ ] Share live URL: `https://finance-friend-v2.vercel.app`
  - [ ] Ask: "Can you spend 10 minutes testing this?"
  - [ ] Provide test credentials or let them register
  - [ ] Ask for feedback on: ease of use, missing features, bugs

- [ ] **Feedback Collection**
  - [ ] "What's the most confusing part?"
  - [ ] "What feature would you want next?"
  - [ ] "Would you pay for this? How much?"
  - [ ] "Who else should try this?"

- [ ] **Issue Tracking**
  - [ ] Create GitHub issues for bugs found
  - [ ] Create GitHub issues for feature requests
  - [ ] Prioritize by user impact (blocking vs nice-to-have)

---

## 🎯 Success Criteria

| Criterion | Status | Notes |
|-----------|--------|-------|
| App deploys to Vercel | ⏳ TBD | Should complete in < 5 min |
| All API endpoints respond | ⏳ TBD | Health check + auth + upload + chat |
| User can register → login → upload → chat | ⏳ TBD | Full flow works end-to-end |
| No critical bugs in browser console | ⏳ TBD | Warnings OK, errors not OK |
| At least 2 beta users test it | ⏳ TBD | Get early feedback |
| Zero security vulnerabilities | ⏳ TBD | JWT secret stored safely |

---

## 🚀 Post-Launch Actions

### Week 1 (Launch)
- [ ] Get 5-10 beta users on app
- [ ] Collect feedback daily
- [ ] Fix critical bugs immediately
- [ ] Log usage analytics (how many users, features used, churn)

### Week 2 (Optimize)
- [ ] Based on beta feedback, prioritize improvements
- [ ] Add payment system (Stripe) for premium features
- [ ] Improve UI based on user comments
- [ ] Set up email notifications

### Week 3+ (Grow)
- [ ] Marketing: Share on Product Hunt, Twitter, Indie Hackers
- [ ] Feature: Bank integration (Plaid API for direct connections)
- [ ] Pricing: Freemium model (free upload, paid AI insights)
- [ ] Community: Finance Friend Facebook group or Discord

---

## 💰 Payment System Options (for future revenue)

### Option A: Stripe (Recommended)
- **Cost:** 2.9% + $0.30 per transaction
- **Setup time:** 30 minutes
- **Features:** Credit cards, digital wallets, ACH transfers
- **Users:** Millions of companies use Stripe

**Implementation:**
1. Create Stripe account
2. Add API key to .env
3. Add `/api/payments/create-checkout-session` endpoint
4. Add "Upgrade to Pro" button in app
5. Test with Stripe test cards

### Option B: PayPal
- **Cost:** 2.9% + $0.30 per transaction
- **Setup time:** 20 minutes
- **Features:** PayPal balance, credit cards
- **Users:** Popular in certain markets

### Option C: Gumroad
- **Cost:** 10% per sale
- **Setup time:** 10 minutes (very simple)
- **Features:** Fully managed, no code needed
- **Drawback:** Less control, higher fees

**My recommendation:** Start with Stripe. Most flexible, cheapest at scale, integrates well with React.

---

## 📊 Metrics to Track (Day 1)

- Signups: How many new users?
- Upload rate: Of those, how many upload a statement?
- Chat engagement: Of those, how many ask a question?
- Churn: How many come back the next day?

**Target metrics:**
- 10%+ signup → upload (1 in 10 people who sign up upload data)
- 50%+ upload → chat (half of uploaders ask a question)
- 30%+ daily churn (most one-time testers, some come back)

These metrics will tell you what's working and what needs improvement.

---

## 🎭 Go/No-Go Decision Tree

**Deploy now if:**
- [ ] Backend API tests pass (health + auth + upload + chat)
- [ ] Frontend builds without errors
- [ ] At least 1 person can complete full flow (register → upload → chat)

**Do NOT deploy if:**
- [ ] Any of the Phase 3 tests (above) fail
- [ ] Database isn't initializing properly
- [ ] API returns 500 errors (logs will tell you what's wrong)

**If issues found:**
1. Check error logs (Vercel dashboard → Logs)
2. Note the exact error
3. Fix locally, commit, push
4. Vercel auto-redeploys
5. Test again

---

## 📞 Support During Launch

**If something breaks after deploy:**

1. **Check Vercel logs:** Dashboard → Project → Logs
2. **Check database:** SSH into server (if needed) or use Vercel SQLite integration
3. **Rollback:** If critical, `git revert <commit>` → push → Vercel rebuilds

**Common issues:**
- **"Database locked"** → Sqlite in Vercel, kill hanging connections
- **"API key not found"** → Check Vercel environment variables
- **"CORS error"** → Check backend middleware (should allow frontend origin)
- **"CSV parser failing"** → Check file encoding (UTF-8 required)

---

## ✅ When You're Ready

**Fill in status above, then:**

1. Create the GitHub repo
2. Push code
3. Create Vercel project
4. Add environment variables
5. Watch deployment (should auto-deploy after push)
6. Run Phase 3 tests (user flow)
7. Share link with beta users
8. Collect feedback

**Total time:** 30 minutes to live, working app with users testing it.

**Who does what:**
- **Tina:** Create GitHub repo, set up Vercel (5 min)
- **Automated (Vercel):** Deploy and host (5 min)
- **Tina:** Test live app (10 min)
- **Tina:** Send to beta users (5 min)

---

**Created:** March 21, 2026, 18:56 HADT  
**By:** Moriah (autonomous session)  
**For:** Tina Marie (deployment decision)

Next step: Say "deploy" and this checklist becomes your script.

