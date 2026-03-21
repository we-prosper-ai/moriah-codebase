# Analytics & Monitoring Setup for Launch
**For:** Finance Friend v2 & v3  
**Created:** March 21, 2026  
**Purpose:** Know if your app is working and people are using it

---

## Why This Matters

When you launch, you need to know:
1. **Is it working?** (uptime, performance, errors)
2. **Are people using it?** (signups, logins, revenue)
3. **What's breaking?** (errors, crashes, edge cases)
4. **Is it fast?** (response times, load times)

Without this, you're flying blind.

---

## Solution Stack (Free Tier Compatible)

| Service | Purpose | Cost | Setup Time |
|---------|---------|------|------------|
| Vercel Analytics | Web vitals + performance | Free | 1 min |
| LogRocket | Error tracking + replays | Free (10 sessions/month) | 5 min |
| PostHog | Product analytics | Free ($0-29/month) | 10 min |
| UptimeRobot | Uptime monitoring | Free | 5 min |
| SendGrid Logs | Email delivery | Free (100/month) | Already in place |

**Total setup: 30 minutes. Total cost: $0.**

---

## Part 1: Vercel Analytics (Automatic)

### Setup
Vercel automatically tracks:
- Page load times
- Core Web Vitals
- Error rates
- Traffic patterns

### How to Access
1. Go to your Vercel dashboard
2. Click your project
3. Go to "Analytics" tab
4. View real-time data

### What to Monitor
- **LCP (Largest Contentful Paint)**: Should be <2.5s
- **FID (First Input Delay)**: Should be <100ms
- **CLS (Cumulative Layout Shift)**: Should be <0.1

If any are red, it's affecting user experience.

---

## Part 2: LogRocket (Error Tracking)

### Setup
1. Go to **logrocket.com**
2. Sign up (free account)
3. Create project: "Finance Friend v2" (or v3)
4. Get the script tag:
```html
<script src="https://cdn.lr-ingest.com/LogRocket.min.js"></script>
<script>
  LogRocket.init('your-app-id');
  LogRocket.getSessionURL(sessionURL => {
    console.log('LogRocket:', sessionURL);
  });
</script>
```

5. Add to `client/index.html` (before closing `</body>`)

### What It Does
- Records every error users encounter
- Captures screen recordings (like a VCR of their session)
- Shows exactly what they did when the error happened
- Helps you debug production issues

### Cost
- Free tier: 10 sessions/month (enough for launch testing)
- Paid: $99/month (for production)

---

## Part 3: PostHog (Product Analytics)

### Setup
1. Go to **posthog.com**
2. Sign up (free)
3. Create project
4. Add to your React app:
```bash
npm install posthog-js
```

In `App.tsx`:
```typescript
import posthog from 'posthog-js'

posthog.init('your-key', {
  api_host: 'https://us.posthog.com',
})
```

### What to Track
```typescript
// When user signs up
posthog.capture('user_signed_up', {
  plan: 'free',
  email_domain: 'gmail.com',
})

// When user upgrades
posthog.capture('upgrade_clicked', {
  location: 'dashboard',
  from_plan: 'free',
})

// When user logs a transaction
posthog.capture('transaction_logged', {
  category: 'income',
  amount: 1000,
})

// When an error happens
posthog.capture('error_occurred', {
  error_type: 'payment_failed',
  user_id: user.id,
})
```

### What You'll See
- How many users signed up
- Which features are used most
- Where users drop off (funnel analysis)
- User retention (how many come back)

### Cost
Free tier covers everything for MVP.

---

## Part 4: UptimeRobot (Uptime Monitoring)

### Setup
1. Go to **uptimerobot.com**
2. Sign up (free)
3. Click "Add Monitor"
4. Choose "HTTP(s)"
5. Enter URL: `https://finance-friend.vercel.app` (or your domain)
6. Set check interval: Every 5 minutes
7. Add email alert

### What It Does
- Checks if your site is up every 5 minutes
- Sends alert if it goes down
- Shows uptime % (99.9% is excellent)

### Cost
Free tier monitors up to 50 URLs.

---

## Part 5: Stripe Monitoring (Already in Place)

### What You Get Automatically
- Payment success/failure tracking
- Chargeback alerts
- Revenue dashboard
- Customer subscription status

### How to Check
1. Go to **dashboard.stripe.com**
2. View "Revenue" and "Events"
3. See every transaction in real-time

---

## Dashboard: What to Check Every Day

### Morning Checklist (2 minutes)
1. **Vercel Analytics:** Any errors overnight? Any slow pages?
2. **UptimeRobot:** Was the site up all night?
3. **Stripe:** Any failed payments? Chargebacks?

### Daily (5 minutes)
1. **PostHog:** How many new signups?
2. **LogRocket:** Any new errors?
3. **Vercel:** Is performance degrading?

### Weekly
1. **PostHog Funnel:** Where are users dropping off?
2. **PostHog Retention:** How many users came back?
3. **Stripe:** Total revenue this week?

---

## Key Metrics to Track

### Growth
- Daily active users
- Weekly signups
- Month-over-month growth

### Health
- Error rate (should be <1%)
- Page load time (should be <2s)
- Uptime % (should be >99%)

### Revenue
- MRR (monthly recurring revenue)
- Churn rate (cancellations)
- Upgrade rate (free → paid conversion)

### Engagement
- Average session duration
- Features used per user
- Days until first upgrade

---

## Emergency Contacts

### If Something Breaks
1. **Check Vercel dashboard** — deployment status, logs
2. **Check LogRocket** — what error happened
3. **Check database** — is it still running?
4. **Check API** — can you manually test endpoints?

### If You Can't Fix It
- Vercel support: 24/7 (free tier)
- Your database provider: Depends on provider
- PostHog support: Email support

---

## Implementation Checklist

- [ ] Add LogRocket script to v2 `landing.html`
- [ ] Add PostHog to React app (App.tsx)
- [ ] Add PostHog tracking calls to key events
- [ ] Set up UptimeRobot monitor
- [ ] Create Stripe API keys for dashboard access
- [ ] Bookmark Vercel Analytics dashboard
- [ ] Test: Create test account → See data in PostHog
- [ ] Test: Trigger error → See in LogRocket
- [ ] Set up email alerts (Vercel, Stripe, UptimeRobot)

---

## First Week After Launch

**Every day:**
- Check dashboard (5 min)
- Read error reports (10 min)
- Respond to support emails (varies)

**You're looking for:**
- Any systemic errors (fix immediately)
- UI/UX issues (note for next version)
- User questions (document for FAQ)
- Payment issues (investigate fully)

**When to escalate:**
- Uptime drops below 99% → Contact hosting
- Error rate spikes → Review recent changes
- Payments failing → Contact Stripe support

---

## Real-World Example

**Day 1 launch:** 5 signups, 1 payment failed, 1 error in coach chatbot

**Day 2:** Fixed chatbot error, reached out to failed payment user, got 12 new signups

**Week 1:** 50 signups, 8 conversions to paid, 2 churn, 1 feature request

**That's how you know it's working.**

---

**Everything here is free or nearly free. No excuses not to do it.**

Set it up before launch. It takes 30 minutes. It's worth $10k in saved debugging time.

— Moriah
