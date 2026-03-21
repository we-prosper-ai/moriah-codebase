# Finance Friend v2 — Launch Metrics & Automation Guide

**Created:** March 21, 2026, 22:08 PM HADT  
**Purpose:** Track success metrics from day 1, automate data collection  
**Status:** Ready to implement after launch

---

## 📊 Core Launch Metrics

### Activation (First 24 Hours)
**Why:** Immediate signal if product resonates

| Metric | Target | Formula | Tool |
|--------|--------|---------|------|
| Sign-ups | 20-50 | Count POST /api/auth/register | Vercel logs |
| Activation rate | >30% | (users who upload file) / (sign-ups) | Custom query |
| First upload | 10-15 | Count POST /api/upload success | Vercel logs |
| Avg time to upload | <10 min | First login → first upload | Google Analytics |

### Engagement (First Week)
**Why:** Learning if users stay and use the product

| Metric | Target | Formula | Tool |
|--------|--------|---------|------|
| DAU | >60% sign-ups | Daily active users | GA + custom events |
| Chat interactions | >2/user | Count POST /api/chat messages | Database query |
| Return users | >50% | Users who return day 2+ | GA cohort |
| Avg session time | >5 min | Session length in GA | Google Analytics |
| Feature adoption | >40% for each feature | Users who used (chat, export, etc.) | Event tracking |

### Revenue (First Month)
**Why:** Converting interest into paying customers

| Metric | Target | Formula | Tool |
|--------|--------|---------|------|
| Conversions | 10-15% | Paying users / free sign-ups | Stripe webhook |
| MRR | $300-450 | Sum of monthly subscriptions | Stripe dashboard |
| CAC | <$20 | (Marketing spend) / (paid customers) | Google Analytics + Stripe |
| LTV | >$200 | (Avg subscription value) × (lifetime months) | Stripe cohort |
| Churn | <10%/month | (Users who cancel) / (paying users) | Stripe webhook |

### Sentiment & Feedback
**Why:** Learning what's working and what needs fixing

| Signal | Method | Tools |
|--------|--------|-------|
| NPS (Net Promoter Score) | Email survey after 3 days | Typeform or email template |
| Feature requests | Open-ended question | Email or in-app feedback |
| Support tickets | Issue category tracking | Email categories |
| Error rates | % of API calls that error | Vercel logs + Sentry |
| Performance | p95 response time | Vercel logs + custom metrics |

---

## 🔧 Implementation (Ready to Set Up)

### Option 1: Google Analytics (Free, Recommended)
**Cost:** Free  
**Setup time:** 15 minutes  
**What it tracks:** Signups, page views, session duration, user cohorts, funnels

```html
<!-- Add to frontend <head> -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXX');
  
  // Custom events
  gtag('event', 'sign_up', { method: 'email' });
  gtag('event', 'file_upload', { file_type: 'csv' });
  gtag('event', 'chat_message');
</script>
```

**Setup:**
1. Create Google Analytics account
2. Add property "Finance Friend"
3. Get tracking ID (G-XXXXX)
4. Add script to frontend
5. Create custom events for: signup, upload, chat, payment

**View Results:**
- Realtime dashboard (users online now)
- Acquisition reports (how users arrive)
- Behavior reports (what they do)
- Conversion tracking (signup → payment)

---

### Option 2: Vercel Analytics (Very Easy, Good Enough)
**Cost:** Free (included with Vercel)  
**Setup time:** 2 minutes  
**What it tracks:** Page views, response times, real user monitoring

```bash
# Install in frontend
npm install @vercel/analytics

# Add to main.jsx
import { Analytics } from "@vercel/analytics/react";

export default function App() {
  return (
    <>
      <YourApp />
      <Analytics />
    </>
  );
}
```

**Setup:**
1. Install package
2. Add component to main app
3. Automatic tracking starts

**View Results:**
- Vercel dashboard → Analytics tab
- Realtime view
- Top pages
- Web vitals

---

### Option 3: Stripe Webhooks (For Revenue Tracking)
**Cost:** Free (Stripe subscriptions already cost)  
**Setup time:** 10 minutes  
**What it tracks:** Subscriptions, payments, churn, MRR

**Required events to track:**
```javascript
// When user subscribes
{
  type: 'customer.subscription.created',
  data: { customer_id, subscription_id, amount, period_start, period_end }
}

// When user cancels
{
  type: 'customer.subscription.deleted',
  data: { customer_id, subscription_id }
}

// When payment succeeds
{
  type: 'charge.succeeded',
  data: { customer_id, amount, timestamp }
}
```

**Setup:**
1. Stripe dashboard → Webhooks
2. Add endpoint (your server's /webhook/stripe)
3. Subscribe to: customer.subscription.created, customer.subscription.deleted, charge.succeeded
4. Log events to database

**View Results:**
- Stripe dashboard (native)
- Custom query to get MRR (SUM of active subscriptions)
- Cohort analysis (when did they churn?)

---

### Option 4: Sentry for Error Tracking (Advanced)
**Cost:** Free tier (up to 10k errors/month)  
**Setup time:** 5 minutes  
**What it tracks:** Errors, performance issues, user sessions

```javascript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://[your-key]@sentry.io/[project-id]",
  environment: "production",
  tracesSampleRate: 1.0, // 100% of transactions (adjust in production)
});

export default Sentry.withProfiler(App);
```

**View Results:**
- Dashboard shows error rates
- Issues grouped by type
- User who experienced error
- Browser/OS/location data

---

## 📈 Daily Monitoring Checklist (For Tina)

### Every morning (9 AM)
- [ ] Open Google Analytics → Realtime dashboard
- [ ] How many signups in last 24h? (target: 20-50)
- [ ] How many uploads? (target: 6-15)
- [ ] Any errors? (target: <1% error rate)

### Every afternoon (3 PM)
- [ ] Check Stripe dashboard → Revenue
  - Did anyone subscribe? (target: 2-5 per day)
  - What's current MRR? (target: $50-100 by day 2)
- [ ] Check Vercel logs for errors
- [ ] Check support inbox (email)

### Every evening (7 PM)
- [ ] Review user feedback (email)
- [ ] Note any feature requests
- [ ] Spot-check a user session (did they get value?)

### Weekly (Monday morning)
- [ ] Cohort analysis (users from day 1 — are they still active?)
- [ ] Churn rate (anyone cancel? Why?)
- [ ] Plan week 2 improvements based on data

---

## 🎯 Success Thresholds (Week 1)

| Milestone | Metric | Minimum | Target | Stretch |
|-----------|--------|---------|--------|---------|
| Day 1 | Signups | 10 | 25 | 50 |
| Day 1 | File uploads | 3 | 8 | 15 |
| Day 1 | API errors | <5% | <1% | 0% |
| Day 2-3 | Returning users | 30% | 50% | 70% |
| Day 7 | Paid sign-ups | 2 | 5 | 10 |
| Day 7 | MRR | $150 | $375 | $750 |

**What to do if below minimum:**
1. Check error logs (is product broken?)
2. Email beta users (are they getting it?)
3. Test signup flow yourself (is there a barrier?)
4. Ask early users why they didn't convert (feedback)
5. Adjust positioning/messaging if needed

---

## 💾 Data to Save Daily

Create a simple Google Sheet with these columns:
```
Date | Day | Signups | Uploads | Paying | MRR | DAU | Error Rate | Notes
2026-03-22 | 1 | 28 | 9 | 2 | $60 | 22 | 0.3% | Email campaign performing well
2026-03-23 | 2 | 15 | 5 | 1 | $90 | 18 | 0.1% | Signup flow issue found (duplicate email)
```

**Why:** Lets you spot trends early. Did engagement drop on day 3? What changed? Did conversions pick up after support email on day 4?

---

## 🔄 Feedback Loop

### Day 1-2: Technical Focus
**Check:** Are systems working? Any errors?
**Action:** Fix bugs immediately, monitor closely

### Day 3-5: User Feedback Focus
**Check:** Are people getting value? What do they want?
**Action:** Read support emails, implement quick wins

### Day 7-14: Strategic Focus
**Check:** Who's converting? Who's leaving? Why?
**Action:** Double down on winners, fix common objections

### Day 15+: Product Focus
**Check:** What features do paying users use? What do they ask for?
**Action:** Roadmap features based on actual usage

---

## 🚀 Quick Setup (30 Minutes to Monitoring)

1. **Create Google Analytics property** (5 min)
   - Add tracking code to frontend
   - Deploy

2. **Install Vercel Analytics** (5 min)
   - npm install + import
   - Deploy

3. **Add Stripe webhooks** (10 min)
   - Configure in Stripe dashboard
   - Update your backend to log webhook events

4. **Create Google Sheet** (5 min)
   - Add headers: Date, Day, Signups, Uploads, etc.
   - Bookmark it

5. **Set calendar reminders** (5 min)
   - Daily check-ins (9 AM, 3 PM, 7 PM)
   - Weekly review (Monday)

---

## 📞 Automated Alerts (Nice-to-Have)

If error rate spikes above 5%:
→ Send Telegram notification

If daily signups drop below 10:
→ Send Telegram notification

If someone subscribes:
→ Send Telegram notification

**Setup:** Vercel webhooks + simple backend service

---

## 🎯 Success Looks Like

- Day 1: 25+ signups, 8+ uploads, <1% errors
- Day 7: 60% daily retention, 5+ paying customers
- Week 2: Clear pattern of what's working
- Month 1: $300+ MRR, path to profitability clear

---

**Prepared by:** Moriah  
**Status:** Ready to implement day 1  
**Estimated setup time:** 30 minutes  
**Ongoing effort:** 10-15 min/day during first month

