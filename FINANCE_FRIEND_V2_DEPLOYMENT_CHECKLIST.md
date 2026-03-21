# Finance Friend v2 Deployment Checklist
**Created:** March 21, 2026, 19:40 HADT  
**Status:** Ready to execute immediately

---

## Phase 1: Pre-Deployment (5 minutes)

- [ ] Create Vercel account (if needed)
- [ ] Connect GitHub repo (we-prosper-ai/finance-friend-v2)
- [ ] Set environment variables:
  - `DATABASE_URL` — SQLite file path or PostgreSQL connection string
  - `JWT_SECRET` — Generate 32-character random string
  - `STRIPE_SECRET_KEY` — Get from Stripe dashboard
  - `STRIPE_PUBLIC_KEY` — Get from Stripe dashboard
  - `GROQ_API_KEY` — (Optional) For AI chatbot features
  
**Command to generate JWT secret:**
```bash
node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"
```

---

## Phase 2: Stripe Setup (5 minutes)

**Create Products in Stripe Dashboard:**

1. **Free Plan (Baseline)**
   - No charge
   - Features: Basic upload, transaction history, simple dashboard
   - Create price ID for tracking

2. **Premium Plan ($9.99/month)**
   - Monthly recurring
   - Features: Everything in Free + AI chatbot, bank sync, budget planning
   - Setup recurring billing webhook

3. **Lifetime Access ($99 one-time)**
   - One-time payment
   - Features: Everything + priority support, custom reports
   - (Optional) Consider $199 for early birds

**Webhook Endpoint:**
- Point Stripe webhook to `https://your-domain.com/api/webhooks/stripe`
- Events to listen for: `customer.subscription.created`, `customer.subscription.deleted`, `invoice.payment_succeeded`

**Test Mode:**
- Use Stripe test keys during development
- Test cards: `4242 4242 4242 4242` (visa), `5555 5555 5555 4444` (mastercard)

---

## Phase 3: Domain & DNS (5-10 minutes)

**Option A: Subdomain**
- Use `finance-friend.we-prosper-ai.com` (if we-prosper-ai owns the domain)
- Update DNS to point to Vercel

**Option B: New Domain**
- Purchase `friendlyfinance.com` or similar
- Configure DNS (Vercel provides instructions)

**SSL Certificate:** Automatic (Vercel handles this)

---

## Phase 4: Deployment Execution (5 minutes)

**In Vercel Dashboard:**
1. Click "Deploy"
2. Select `finance-friend-v2` repo
3. Choose `main` branch
4. Paste environment variables from Phase 1
5. Click "Deploy"
6. Wait for build to complete (~3 minutes)

**Verification:**
- [ ] App loads on Vercel domain
- [ ] Login page renders
- [ ] Navigation works
- [ ] Database connection succeeds
- [ ] No 500 errors in console

---

## Phase 5: Testing (10 minutes)

**Smoke Tests (Must Pass):**

1. **Sign Up Flow**
   - Create account with email/password
   - Verify email (if enabled)
   - Confirm account exists in database

2. **Login Flow**
   - Login with correct credentials → Success
   - Login with wrong password → Error message
   - Logout → Redirects to login

3. **Core Features**
   - Upload CSV file → Transactions appear in dashboard
   - Ask AI a question → Get response about transactions
   - View budget → Displays chart
   - View dashboard → Shows key metrics

4. **Subscription Flow**
   - Try Premium feature → Prompts for Stripe payment
   - Click "Subscribe to Premium" → Redirects to Stripe Checkout
   - Complete test payment → Subscription active
   - Verify Premium features now accessible

5. **Error Handling**
   - Upload bad CSV → Error message (not crash)
   - Network error → Graceful fallback
   - Invalid input → Clear validation message

**Test Accounts:**
- Name: Test User
- Email: test@friendlyfinance.com
- Password: TestPassword123!

---

## Phase 6: Marketing Prep (10 minutes)

**Before Launch Day:**

1. **Social Announcements (Draft)**
   - [ ] Twitter/X post ready
   - [ ] LinkedIn post ready
   - [ ] Reddit r/PersonalFinance post ready
   - [ ] Product Hunt post ready

2. **Email Announcement**
   - [ ] Email list (if available)
   - [ ] Subject line tested
   - [ ] CTA button clear

3. **Landing Page**
   - [ ] Domain set up
   - [ ] One-pager with key benefits
   - [ ] Screenshots of dashboard
   - [ ] Testimonials (if available)
   - [ ] Pricing visible

**Minimum Landing Page Content:**
```
HEADLINE: "Your Financial Coach, AI-Powered"

SUBHEADING: "Track transactions. Understand spending. Make better decisions."

FEATURES:
- 📊 Smart Dashboard
- 🤖 AI Financial Coach
- 📱 Bank Connection (coming soon)
- 🎯 Budget Planning
- 🔒 Bank-Level Security

PRICING:
- Free Plan: $0/month (basic features)
- Premium Plan: $9.99/month (AI chat, advanced analytics)

CTA: "Start Free"
```

---

## Phase 7: Launch Day (Day 1)

**Morning (Launch Window):**
- [ ] Verify app is live and working
- [ ] Post to Twitter/X
- [ ] Post to LinkedIn
- [ ] Post to Reddit
- [ ] Submit to Product Hunt (if using PH)
- [ ] Send email announcement
- [ ] Share link in relevant communities

**Throughout Day:**
- [ ] Monitor uptime (Vercel dashboard)
- [ ] Watch for error reports
- [ ] Respond to early user feedback
- [ ] Track sign-ups

**Success Metric:** 10+ sign-ups on Day 1

---

## Phase 8: First Week (Days 1-7)

**Daily Checks:**
- [ ] Monitor server logs (Vercel dashboard)
- [ ] Track sign-ups (database queries)
- [ ] Watch for crash reports
- [ ] Note feature requests

**By End of Week:**
- [ ] 50+ sign-ups
- [ ] 10+ Premium subscribers (targeting $100+ MRR)
- [ ] Zero critical bugs in production
- [ ] User feedback documented

**If Issues Found:**
- [ ] Fix immediately (redeploy in <5 minutes)
- [ ] Notify users if data affected
- [ ] Update launch notes with lessons

---

## Phase 9: First Month (Days 7-30)

**Metrics to Watch:**
- Total sign-ups (target: 200+)
- Premium conversion rate (target: 10-15%)
- Monthly recurring revenue (target: $180-300 MRR)
- User retention day 7 (target: 30%+)
- Feature usage (which features used most?)

**Optimization Work:**
- [ ] A/B test pricing
- [ ] Improve onboarding based on early feedback
- [ ] Add most-requested features
- [ ] Build email nurture sequence for free users

**Success Condition:** $300+ MRR achieved, positive user feedback

---

## Rollback Plan (If Critical Issue)

If production issue found:
1. Disable affected feature in code
2. Redeploy to Vercel (<5 minutes)
3. Notify affected users
4. Fix issue locally
5. Test thoroughly
6. Redeploy fix

**Critical Issues That Require Rollback:**
- Data loss
- Authentication bypass
- Payment processing errors
- Security vulnerability

---

## Success Criteria

✅ **Deployment Success**
- App is live and accessible
- All HTTPS/SSL working
- No 500 errors
- Database connected
- Stripe working

✅ **User Success**
- Can sign up
- Can upload transactions
- Can chat with AI
- Can subscribe to Premium
- Can logout

✅ **Business Success**
- $100+ revenue in first week
- Positive feedback from early users
- Zero critical bugs in production
- Plan for Phase 2 features identified

---

## Next Steps After Launch

Once Finance Friend v2 is live:
1. **Gather user feedback** — What features matter most?
2. **Plan Finance Friend v3** — When to start building premium version?
3. **Market expansion** — Paid ads? Affiliate program? Communities?
4. **Scale infrastructure** — PostgreSQL instead of SQLite?

---

## Links

- **GitHub Repo:** https://github.com/we-prosper-ai/finance-friend-v2
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Stripe Dashboard:** https://dashboard.stripe.com
- **Launch Day Playbook:** FINANCE_FRIEND_V2_LAUNCH_DAY_PLAYBOOK.md

---

🏔️ Moriah  
Ready to execute. One approval, one click, 15 minutes to live.
