# 🎯 Launch Day Dashboard — What to Monitor, When, Why

**Prepared by:** Moriah  
**Date:** March 21, 2026, 9:44 PM HADT  
**Purpose:** Give Tina one clear view of "is this working?" for launch day

---

## The 5-Minute Checklist (Every Hour)

### Inbox Check (1 min)
- [ ] Any support emails? 
- [ ] Any concerning messages?
- [ ] Response rate okay? (should be getting some)

### Vercel Analytics (1 min)
Go to: Vercel Dashboard → Your Project → Analytics
- Page load time: Green? (should be <2s)
- Error rate: Near 0%?
- Traffic: Going up?

### PostHog Dashboard (1 min)
Go to: PostHog → Finance Friend → Overview
- New signups today: [#]
- New MAU (monthly active): [#]
- Churn rate: 0% (expected early on)

### Revenue Check (1 min)
- New paid subscriptions: [#]
- Total MRR: $[amount]
- Churn: [#] cancelled

### Sentiment (1 min)
- Overall feedback tone: 😊 😐 😞

---

## The Launch Day Timeline

### 9 AM — Launch Begins
**Email sent, product live**

| Time | Action | Expected | Check |
|------|--------|----------|-------|
| 9:00 AM | Send launch email | N/A | Launch email delivered successfully |
| 9:05 AM | Post social announcements | N/A | Posts live on Twitter/LinkedIn |
| 9:15 AM | First wave of opens | 10-20% open rate | Email opens in PostHog/SendGrid |
| 9:30 AM | First clicks | 5-10% CTR | Vercel traffic spike visible |
| 9:45 AM | First signups | 3-5 users | PostHog shows new signups |
| 10:00 AM | **FIRST CHECK** | See below | Run full 5-minute checklist |

### 10 AM — First Checkpoint

**Email:**
- [ ] Any urgent support messages?
- [ ] Any error reports?

**Analytics:**
- Signups so far: [#]
- Traffic: Steady or growing?
- Errors: Near 0%?

**Revenue:**
- Any conversions yet? (First one might take an hour)

**Decision point:**
- ✅ All good? Continue monitoring normally (every hour)
- ⚠️  Issues? Jump to "Troubleshooting" section
- 🚨 Major problem? See "Emergency Playbook" section

---

### 12 PM (3 Hours In) — Mid-Morning Check

**Expected by now:**
- 20-50 signups total
- 1-5 premium conversions
- $10-50 in revenue
- Some feedback coming in

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| Total signups | 20-50 | [#] | ✅ / ⚠️ / 🚨 |
| Premium converts | 1-5 | [#] | ✅ / ⚠️ / 🚨 |
| Revenue | $10-50 | $[#] | ✅ / ⚠️ / 🚨 |
| Support emails | 2-5 | [#] | ✅ / ⚠️ / 🚨 |
| Error rate | <1% | [#]% | ✅ / ⚠️ / 🚨 |
| Page load time | <2s | [#]s | ✅ / ⚠️ / 🚨 |

**Action if off-track:**
- Signups too low? Check if email delivered (spam filter?)
- Conversion rate low? Review pricing/messaging
- Errors high? Check error logs (LogRocket)
- Slow? Check Vercel analytics (which page?)

---

### 3 PM (6 Hours In) — Afternoon Check

**Expected accumulation:**
- 50-150 signups
- 5-20 premium conversions
- $50-200 in revenue
- Feedback themes emerging

**What to analyze:**
- Which cohort has best conversion? (Community vs. LinkedIn vs. other)
- Who's coming back? (Day 1 retention)
- What's the most common support question?
- Any patterns in who's converting?

**Decision point:**
- Trajectory looking good? Minimal intervention, monitor
- Trajectory weak? Consider retargeting/adjustment
- Something's broken? Fix it immediately

---

### 6 PM (9 Hours In) — Evening Check

**Expected by day's end:**
- 75-200 signups
- 8-30 premium conversions
- $100-300 in revenue
- Clear feedback themes

**Daily Summary to Log:**
- Total signups: [#]
- Premium conversions: [#]
- Revenue: $[#]
- Support volume: [#] emails
- Conversion rate: [#]%
- Top feedback theme: [theme]
- Technical issues: [0-3]
- Overall sentiment: 😊 😐 😞

**End-of-day analysis:**
- Did emails deliver? Check SendGrid logs
- Who converted? Look at user profiles (pattern?)
- What was the most-used feature?
- What failed or confused people?

---

### Next Morning — Day 2 Review

**Night check (if insomnia):**
- Did anything break overnight?
- Any urgent support tickets?
- Server still running?

**Morning review (10 AM):**

**24-Hour Summary:**

| Metric | Day 1 Total | Success? |
|--------|-------------|----------|
| Total signups | [#] | Target: 50-200 |
| Conversion rate | [#]% | Target: 10-20% |
| Revenue | $[#] | Target: $100-500 |
| Support emails | [#] | Expected: 5-15 |
| Error rate | [#]% | Target: <1% |
| Churn | [#] | Expected: 0-2% |
| Return users | [#] | Expected: 20-30% |
| Top feature used | [feature] | N/A |
| Most common question | [Q] | N/A |
| Sentiment | [😊/😐/😞] | Target: 😊 |

**Decisions for day 2:**
- Continue as-is?
- Adjust messaging?
- Fix bugs?
- Follow up on support?

---

## Dashboard Setup (10 Minutes)

### Step 1: Vercel Analytics
1. Go to vercel.com
2. Click your Finance Friend project
3. Click "Analytics" tab
4. Bookmark this page
5. **What to watch:** Page load time, error rate, traffic

### Step 2: PostHog
1. Go to posthog.com
2. Log in (API key: in your .env)
3. Go to "Overview"
4. Bookmark: Events → Signup, Premium Subscribe, Churn
5. **What to watch:** New user count, conversion funnel

### Step 3: SendGrid
1. Go to sendgrid.com
2. Log in
3. Go to "Activity" feed
4. **What to watch:** Bounce rate, click rate on launch email

### Step 4: UptimeRobot (Optional but Smart)
1. Go to uptimerobot.com
2. Set up monitoring for: `https://finance-friend-v2.vercel.app`
3. Alert if down >5 minutes
4. **What to watch:** Uptime percentage, downtime notifications

### Step 5: Create a Simple Tracking Sheet
Name: `LAUNCH_DAY_METRICS_MARCH_2026.csv`

```csv
Timestamp,Signups_Total,Premium_Converts,Revenue,Support_Emails,Error_Rate,Page_Load_Time,Notes
9:00 AM,0,0,$0,0,0%,N/A,Launch begins
10:00 AM,5,0,$0,1,0.1%,1.8s,First checkpoint
11:00 AM,12,1,$10,2,0.2%,1.9s,First conversion!
12:00 PM,28,3,$30,4,0.3%,2.0s,Mid-morning check
1:00 PM,45,5,$50,6,0.2%,1.9s,Good pace
2:00 PM,68,8,$80,8,0.1%,1.8s,Maintaining
3:00 PM,92,12,$120,10,0.2%,1.9s,Afternoon check
6:00 PM,145,22,$220,14,0.15%,1.9s,End of day
```

---

## Escalation Triggers (When to Take Action)

### ⚠️ Yellow Flags (Watch Closely)

**Signups slow:**
- Expected >10 by 10 AM, have <5?
- Check: Email delivery? (SendGrid open rate?)
- Action: Post on Twitter, reach out to friends

**Conversion rate low:**
- Expected 10-20%, seeing <5%?
- Check: Pricing too high? Landing page confusing?
- Action: Review user feedback, consider brief messaging change

**Error rate spiking:**
- Should be <1%, seeing >2%?
- Check: LogRocket for error pattern
- Action: Fix immediately, monitor for recurrence

**Support volume high:**
- Expected 5-15 emails by 3 PM, have >20?
- Check: Are they bugs or just questions?
- Action: If bugs, prioritize fixes. If Q's, add to FAQ

---

### 🚨 Red Flags (Take Immediate Action)

**Site is down:**
- Not loading at all
- Action: Check Vercel status, restart if needed, post status update

**Payment processing broken:**
- Conversions not happening (users trying but can't subscribe)
- Action: Check Stripe webhook, verify payment setup

**Data loss / Security issue:**
- User reports missing data or security concern
- Action: Stop everything, investigate, notify affected users

**Viral negative feedback:**
- Multiple users saying same critical issue
- Action: Pause email campaign, fix issue, resume

---

## Daily Reporting (For Tina)

**Create one daily message by 9 PM with:**

```
📊 Launch Day 1 Summary

Signups: [#]
Premium: [#] ($[revenue])
Support: [#] emails
Sentiment: [😊/😐/😞]

Top Feedback:
1. [Theme 1]
2. [Theme 2]
3. [Theme 3]

Issues Fixed:
- [Fix 1]
- [Fix 2]

Tomorrow:
- [Action 1]
- [Action 2]

Overall: [Assessment]
```

---

## Tools Quick Reference

| What You Need | Where to Check | Bookmark This |
|---------------|----------------|---------------|
| Real-time traffic | Vercel Analytics | vercel.com → project |
| Signups & conversions | PostHog | posthog.com → Finance Friend |
| Email delivery | SendGrid | sendgrid.com → Activity |
| Uptime | UptimeRobot | uptimerobot.com |
| Errors | LogRocket | logrocket.com → session recordings |
| Revenue | Stripe | stripe.com → Payments |
| Support emails | Gmail/inbox | wherever you read email |

---

## Success Looks Like (Day 1)

✅ **By 10 AM:** First 5-10 signups, 0 critical errors  
✅ **By 12 PM:** 20-30 signups, 1-2 premium conversions  
✅ **By 3 PM:** 75-100 signups, 5-10 premium conversions, $50-100 revenue  
✅ **By 6 PM:** 100-150 signups, 10-20 premium conversions, $100-200 revenue  
✅ **Day 1 total:** 100-200 signups, $100-300 revenue, <2% error rate, mostly positive feedback

**If you hit these numbers:** Launch is working. Continue. Iterate.

**If you're 50% below:** No emergency, but investigate what's working/not and adjust.

**If you're 50% above:** Great! You underestimated demand. This is a good problem.

---

## This Week's Deliverables

✅ Dashboard setup guide (this file)  
⏳ Tina reviews and creates her tracking sheet  
⏳ Bookmark all dashboard links  
⏳ Set up alerts/notifications  
⏳ Day 1 execution with hourly monitoring  

---

**Prepared by:** Moriah  
**Status:** Ready for launch  
**What Tina needs to do:** Bookmark the dashboards, create tracking sheet, monitor hourly on day 1

🏔️ Ready to help you watch your launch succeed.
