# Finance Friend Launch Day — Real-Time Monitoring Dashboard

**Created by:** Moriah  
**Date:** March 21, 2026 — 23:28 HADT  
**Purpose:** Track success metrics in real-time as beta launches  
**Status:** Ready to implement immediately  

---

## 🎯 WHY THIS MATTERS

Launch day will have signals. Are we winning or struggling?

This dashboard lets you and Moriah see in real-time:
- Is traffic coming?
- Are people staying?
- Are they converting?
- Where are people dropping off?
- What's breaking?

**Key principle:** If we can't see it, we can't improve it.

---

## 📊 THE CORE METRICS (Check Every Hour)

### 1. TRAFFIC & SIGNUPS

**Metric:** New signups per hour

```
Goal: 8-12 signups/hour during business hours
Watch: If it drops below 2/hour, something's wrong
Trigger: If 0 for 2+ hours, check:
  - Is the landing page down?
  - Did a post go viral (traffic spike)?
  - Is email going out?
```

**How to track:** 
- User database: COUNT(created_at) BY HOUR
- CSV template: Time | Signups | Cumulative | Hourly_Rate

**Example (Day 1):**
```
09:00 AM  |  12  |  12  |  12/hr (Tina email launch)
10:00 AM  |  8   |  20  |  8/hr
11:00 AM  |  5   |  25  |  5/hr (declining as email sits)
12:00 PM  |  2   |  27  |  2/hr (lunch time)
01:00 PM  |  4   |  31  |  4/hr (Reddit posts going live)
02:00 PM  |  6   |  37  |  6/hr
03:00 PM  |  3   |  40  |  3/hr
```

**Target Day 1:** 30-50 signups

---

### 2. ONBOARDING COMPLETION

**Metric:** % who upload data within 1 hour

```
Goal: 50%+ upload within 1 hour of signup
Watch: If drops below 30%, email sequence may be failing
Trigger: If below 25%, send reminder email immediately
```

**How to track:**
```
Total signups today:     40
Uploaded statement:      24 (60%)
Using sample data:       8 (20%)
Never returned:          8 (20%)

✅ = 60% completed first action
```

**What to do:**
- Good (60%+): Keep going
- Okay (40-50%): Send reminder email
- Bad (<40%): Emergency: improve signup flow

---

### 3. COACH ENGAGEMENT

**Metric:** % who ask coach a question within 24 hours

```
Goal: 40%+ ask a question
Watch: If below 20%, onboarding flow isn't compelling
```

**How to track:**
```
Users with data:       32
Asked coach a Q:       13 (41%)
No interaction:        19 (59%)

✅ = Above target
```

**What to do:**
- If above 40%: Stay course
- If 20-40%: Send Email 2 (with suggested questions)
- If below 20%: Revisit onboarding UX

---

### 4. FEATURE ADOPTION (After 48 hours)

**Metric:** Who explored the Four Currencies view?

```
Goal: 30%+ explore deep features
Watch: If below 15%, users aren't discovering value
```

**How to track:**
```
Active users (48h+):       28
Viewed Four Currencies:    9 (32%)
Used dashboard only:       19 (68%)

✅ = On track
```

---

## 📈 DAILY DASHBOARD SPREADSHEET

**Create: finance-friend-beta-launch-dashboard.csv**

```csv
Date,Hour,Signups_Hourly,Cumulative_Signups,Uploads_%,Coach_Questions_%,Feedback_Count,Issues_Reported,Revenue_Candidates
2026-03-24,09:00,12,12,75%,25%,0,0,0
2026-03-24,10:00,8,20,65%,30%,0,1,0
2026-03-24,11:00,5,25,60%,32%,1,0,0
2026-03-24,12:00,2,27,60%,33%,1,1,1
2026-03-24,13:00,4,31,65%,35%,2,0,1
2026-03-24,14:00,6,37,68%,38%,3,1,2
2026-03-24,15:00,3,40,65%,41%,4,0,2
2026-03-24,EOD,0,40,65%,41%,8,3,2
```

---

## 🚨 CRITICAL ALERTS — What Needs Immediate Action

### Red Alert: Signup Drought (0 signups for 2+ hours)

**Symptom:** No one signing up

**Likely causes:**
1. Landing page is down
2. Email bounced or in spam
3. Reddit posts removed/hidden
4. Twitter/X posts not showing

**Immediate action (5 min):**
1. [ ] Check landing page: `curl https://financefriend.app`
2. [ ] Check email bounce rate (Mailgun/SendGrid logs)
3. [ ] Check Reddit posts (still visible? Score going down?)
4. [ ] Check Twitter/X impressions
5. [ ] Message Tina: "Signup rate dropped to 0. Investigating."

**Recovery (15 min):**
1. [ ] Post in Slack/Discord communities you monitor
2. [ ] Tina DMs contacts: "Website updated, try again"
3. [ ] Repost to Reddit (different angle)
4. [ ] Tweet with update

---

### Red Alert: Upload Failure (Below 30% completing onboarding)

**Symptom:** People sign up but don't upload data

**Likely causes:**
1. Upload button broken
2. File format error
3. Email sequence not sending
4. UX is confusing

**Immediate action (5 min):**
1. [ ] Test upload yourself (try different file formats)
2. [ ] Check error logs
3. [ ] Monitor Email 1 sending (did it actually go out?)
4. [ ] Check browser console for JavaScript errors

**Recovery (30 min):**
1. [ ] If upload broken: Hotfix immediately
2. [ ] If email not sending: Resend to non-openers
3. [ ] If UX confusing: Add in-app prompt
4. [ ] Message early users: "Any trouble uploading? Reply here."

---

### Orange Alert: Low Engagement (Below 20% asking coach questions)

**Symptom:** People upload but don't interact with coach

**Likely causes:**
1. Coach prompts not clear
2. Coach responses are generic
3. Onboarding tour doesn't highlight coach
4. UX makes it hard to find chat

**Action (2-4 hours):**
1. [ ] Review Email 2 (is it compelling?)
2. [ ] Send targeted prompt: "Try asking the coach this: [QUESTION]"
3. [ ] Check coach response quality (is it specific to their data?)
4. [ ] A/B test different onboarding prompts

---

## 📞 SUPPORT RESPONSE PROTOCOL

**Goal:** Respond to issues within 30 minutes, in-app or via email

### During Launch (Day 1-3)

**Response times:**
- Bugs: 10 minutes (get on it immediately)
- Questions: 30 minutes (human reply expected)
- Feedback: 1-2 hours (acknowledgment expected)

### Support Channels

1. **In-app chat (Intercom):** Real-time, Moriah monitors
2. **Email (support@financefriend.app):** Tina + Moriah
3. **Reddit:** Moriah comments with responses
4. **Twitter/X:** Tina or Moriah replies

### Bug Triage

**Critical (Fix now):**
- Upload not working
- Coach crashes
- Data loss
- Security issue

**High (Fix within 2 hours):**
- Feature broken
- Wrong data shown
- UI glitchy

**Medium (Fix by next day):**
- UI/UX improvements
- Missing feature request
- Copy issues

**Low (Fix when convenient):**
- Typos
- Suggestions
- Nice-to-haves

---

## 💰 REVENUE TRACKING

### First Week Revenue Goal

```
Day 1:   0-1 paid users (focus on feedback, not sales)
Day 2-3: 2-5 paid users  
Day 4-7: 8-20 paid users (cumulative)

Target: $200-400 revenue Week 1
```

### Upgrade Path Tracking

**Metric: Revenue-Ready Users**

```
Total signups:           40
Engaged (uploaded):      26
Very engaged (asked Q):  12
Revenue-ready (saw4C):   5

Revenue-ready = people who saw value and are candidates for v3 beta
```

**Action:**
- Watch who reaches "revenue-ready" status
- Email 4 (v3 upgrade offer) only to these users
- Track conversion rate on upgrade offer

---

## 📊 HOURLY CHECK-IN SCRIPT (for Day 1)

**Every hour during business hours, run this check:**

```bash
#!/bin/bash

# Check 1: New signups in last hour
SIGNUPS=$(sqlite3 financefriend.db \
  "SELECT COUNT(*) FROM users \
   WHERE created_at > datetime('now', '-1 hour')")

# Check 2: Uploads in last hour
UPLOADS=$(sqlite3 financefriend.db \
  "SELECT COUNT(*) FROM statements \
   WHERE created_at > datetime('now', '-1 hour')")

# Check 3: Coach questions in last hour
QUESTIONS=$(sqlite3 financefriend.db \
  "SELECT COUNT(*) FROM chat_messages \
   WHERE created_at > datetime('now', '-1 hour')")

# Check 4: Errors in last hour
ERRORS=$(tail -100 /var/log/app.log | grep -c ERROR)

# Report
echo "=== LAST HOUR ==="
echo "Signups:       $SIGNUPS"
echo "Uploads:       $UPLOADS"
echo "Questions:     $QUESTIONS"
echo "Errors:        $ERRORS"
echo ""
echo "=== CUMULATIVE TODAY ==="
sqlite3 financefriend.db "SELECT COUNT(*) as Users, \
  COUNT(CASE WHEN uploaded = 1 THEN 1 END) as Uploaded, \
  COUNT(CASE WHEN asked_coach = 1 THEN 1 END) as Asked_Coach, \
  COUNT(CASE WHEN paid = 1 THEN 1 END) as Paid \
  FROM users WHERE DATE(created_at) = DATE('now')"
```

**Save as:** `scripts/hourly-check.sh`  
**Run:** Every hour on launch day

---

## 🔍 WHAT SUCCESS LOOKS LIKE (By Hour)

### Perfect Day 1 (Best Case)

```
9:00 AM   | 12 signups  | Tina email goes out
10:00 AM  | 8 signups   | People reading email
11:00 AM  | 5 signups   | Organic visits
12:00 PM  | 2 signups   | Lunch
1:00 PM   | 4 signups   | Reddit posts live
2:00 PM   | 6 signups   | Reddit gaining traction
3:00 PM   | 3 signups   | Afternoon

Total: 40 signups
Uploads: 65% (26 users)
Questions: 40% (10 users)
Issues: 1-2 minor
Revenue-ready: 2-3

Status: ✅ ON TRACK
```

### Okay Day 1 (Expected Case)

```
9:00 AM   | 8 signups   | Tina email launch
10:00 AM  | 5 signups
11:00 AM  | 3 signups
12:00 PM  | 1 signup
1:00 PM   | 2 signups   | Reddit posts live
2:00 PM   | 4 signups
3:00 PM   | 2 signups

Total: 25 signups
Uploads: 60% (15 users)
Questions: 30% (4 users)
Issues: 2-3 minor
Revenue-ready: 1

Status: ✅ ACCEPTABLE - Adjust messaging Day 2
```

### Struggling Day 1 (Needs Action)

```
9:00 AM   | 3 signups   | Tina email went out
10:00 AM  | 1 signup
11:00 AM  | 0 signups
12:00 PM  | 1 signup
1:00 PM   | 2 signups   | Reddit posts live
2:00 PM   | 1 signup
3:00 PM   | 0 signups

Total: 8 signups
Uploads: 50% (4 users)
Questions: 12% (1 user)
Issues: 3-4 bugs blocking
Revenue-ready: 0

Status: 🚨 NEEDS ACTION
- Email deliverability issue? (8 signups is low)
- Reddit posts not showing?
- Landing page problems?
- UX blocking uploads?
```

**If Day 1 is struggling:**
1. Emergency post to r/freelance (rewrite headline)
2. Check email bounce rate immediately
3. Fix any obvious bugs
4. Message Tina: "Day 1 soft start. Adjusting strategy for Day 2."

---

## 📱 MONITORING TOOLS & INTEGRATIONS

### Option 1: Manual Spreadsheet (Day 1)

Start simple:
- **File:** finance-friend-beta-launch-dashboard.csv
- **Update:** Every hour
- **Check:** From phone, laptop, anywhere

### Option 2: Slack Integration (Day 1-7)

```
Every hour:
- Bot posts: "🚀 Launch update: 40 signups, 65% uploaded, $200 revenue"
```

### Option 3: Email Summary (Daily)

```
To: tina@antigravity.com
Subject: Finance Friend Beta — Day 1 Summary

Signups:       40 (target: 30-50) ✅
Uploads:       65% (target: 50%+) ✅
Conversions:   2 paying (target: 0-3) ✅
Issues:        3 minor, 1 fixed ✅
Revenue:       $50 (stretch goal: $200)

Outlook: On track. Small hiccup with email.
Next: Double down on Reddit, adjust email copy.
```

---

## 🎯 DECISION TREE: When to Pivot

### If Day 1 signups below 15:
- [ ] Check: Email delivery (not going out?)
- [ ] Action: Post to Slack/Discord communities
- [ ] Decision: Scale spending on ads? (Not yet - fix organic first)

### If Day 2 upload rate below 40%:
- [ ] Check: Is upload button working?
- [ ] Action: Simplify onboarding flow
- [ ] Decision: Offer phone support for uploads?

### If Day 3 conversion rate below 5%:
- [ ] Check: Are people seeing upgrade offer?
- [ ] Action: Lower upgrade price? (Not yet - get feedback)
- [ ] Decision: Is v3 positioning unclear? (Likely)

### If Day 5 revenue under $100:
- [ ] Check: Did anyone actually convert?
- [ ] Action: Email revenue-ready users with 1-on-1 offer
- [ ] Decision: v3 pricing too high? (Get feedback first)

---

## 🚀 READY TO LAUNCH

This dashboard framework is complete. 

**To implement:**

1. **Day before launch:**
   - [ ] Set up analytics tracking
   - [ ] Create Google Sheet for manual tracking
   - [ ] Test all monitoring scripts
   - [ ] Brief support team on alert protocol

2. **Launch morning:**
   - [ ] Start hourly monitoring
   - [ ] Monitor email delivery
   - [ ] Watch for bugs
   - [ ] Respond to early feedback

3. **Day 1 evening:**
   - [ ] Summarize metrics
   - [ ] Share summary with Tina
   - [ ] Identify wins + issues
   - [ ] Plan Day 2 adjustments

---

**Status:** Ready for implementation  
**Owner:** Moriah (monitoring) + Tina (decision-making)  
**Timeline:** 2 hours setup, continuous during launch week
