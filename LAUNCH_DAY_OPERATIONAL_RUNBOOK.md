# Finance Friend v2 — Launch Day Operational Runbook

**Created:** March 21, 2026  
**Status:** Ready to execute  
**Roles:** Tina (decisions), Moriah (execution), Caleb (monitoring)

---

## 🎯 Mission

Ship Finance Friend v2 from 9:00 AM to 12:00 PM HADT, acquire first 20-50 beta users, generate first revenue, establish operational rhythm for week 1.

---

## 📅 Launch Day Timeline

### **8:00 AM - Pre-Launch (60 minutes before)**

**Tina:**
- [ ] Wake up ☀️
- [ ] Read TINA_DECISION_MATRIX_LAUNCH_PATH.md (10 min)
- [ ] Choose: PATH 1 (v2 now), PATH 2 (v3 now), or PATH 3 (hybrid)
- [ ] Send message: "Go with PATH X"
- [ ] Verify ANTHROPIC_API_KEY is set in Vercel env

**Moriah:**
- [ ] Verify all systems are running
- [ ] Test v2 endpoints (register, login, upload) locally
- [ ] Pull latest code from GitHub
- [ ] Prepare email deployment (emails ready to send, just need approval)
- [ ] Check Vercel dashboard (no deployment errors)

**Checklist:**
- [ ] GitHub latest code pulled
- [ ] Vercel env vars confirmed
- [ ] Systems tested locally
- [ ] Team communication clear (Telegram)

---

### **9:00 AM - DEPLOYMENT (15 minutes)**

This is the go/no-go moment. Once you click "deploy," you're live.

**Moriah:**
```bash
# 1. Ensure latest code is deployed to Vercel
vercel --prod

# 2. Watch deployment logs in real-time
vercel logs [project-name] --follow

# 3. Verify site is live
curl https://[domain].vercel.app/ | grep "Finance Friend"

# 4. Test live endpoints
curl -X POST https://[domain].vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"qa@test.local","password":"Test1234!"}'

# 5. Report back: LIVE ✅
```

**Tina:**
- [ ] Watch notifications (Vercel deployment status)
- [ ] Open https://[your-domain].vercel.app
- [ ] Confirm homepage loads

**Checklist:**
- [ ] Deployment complete
- [ ] Site loads at domain
- [ ] API endpoints responding
- [ ] No error messages

---

### **9:15 AM - EMAIL CAMPAIGN LAUNCH (15 minutes)**

First users come from your email list. This is critical.

**Moriah (Email Deployment):**
```bash
# Using templates from BETA_OUTREACH_EMAIL_TEMPLATES.md
# Personalize and send to each cohort

# Cohort 1: Self-Employed (High-Value)
sendgrid send \
  --to "marcus@business.local" \
  --subject "Finance Friend v2: Beta Access for Self-Employed" \
  --body "[EMAIL_TEMPLATE_SELFEMPLOYED]" \
  --reply-to support@financefriend.app

# Cohort 2: Personal Finance
sendgrid send \
  --to "sarah@personal.local" \
  --subject "Finance Friend Beta: Free 30-day trial" \
  --body "[EMAIL_TEMPLATE_PERSONAL]" \
  --reply-to support@financefriend.app

# Cohort 3: Online Business
# ... repeat for other cohorts

# Verify sends:
sendgrid status | grep "9:15 AM"
```

**Tina:**
- [ ] Approve final email template (5 min)
- [ ] Confirm subject lines and personalization
- [ ] Watch email dashboard for opens/clicks (should start coming in by 9:20)

**Expected Results:**
- First emails sent by 9:16 AM
- First opens by 9:18 AM
- First clicks by 9:19 AM
- First signups by 9:25 AM

---

### **9:30 AM - MONITORING BEGINS (Continuous)**

From this point, watch metrics constantly.

**Tina (LIVE DASHBOARD):**
- [ ] Open Google Analytics (Realtime dashboard)
  - How many users online? (target: 2-5)
  - Which pages are they viewing?
- [ ] Open Stripe dashboard
  - Anyone paid yet? (probably not yet, they need 5-10 min to decide)
- [ ] Check email client
  - Replies coming in? (should start by 9:35)
- [ ] Slack/Telegram for alerts

**Moriah (MONITORING):**
```bash
# Check error logs in real-time
vercel logs [project-name] --follow

# Monitor revenue
curl https://[domain]/api/revenue-status

# Check server health
curl https://[domain]/health
```

**Checklist:**
- [ ] GA showing users
- [ ] No errors in logs
- [ ] Email campaign tracking opens/clicks

---

### **10:00 AM - FIRST HOUR ASSESSMENT (5 minutes)**

**Tina's 10:00 AM Check-In:**

Open spreadsheet: LAUNCH_DAY_METRICS.csv

| Metric | 9:00 AM | 9:30 AM | 10:00 AM | Target | Status |
|--------|---------|---------|----------|--------|--------|
| Signups | 0 | 8 | 18 | 20+ | 🟢 On track |
| Uploads | 0 | 2 | 5 | 6+ | 🟢 On track |
| Conversions | 0 | 0 | 1 | 2+ | 🟡 Slow, wait |
| Errors | 0% | 0.1% | 0.3% | <1% | 🟢 Healthy |

**Decision Point:**
- 🟢 **Everything is good:** Continue! Don't change anything.
- 🟡 **One metric is slow:** Wait 30 more minutes, then reassess.
- 🔴 **Multiple metrics down:** Stop and diagnose (error logs, email bounces, etc.)

---

### **10:30 AM - MID-MORNING SUPPORT CHECK (10 minutes)**

At this point, early users will have questions.

**Tina (Support):**
- [ ] Check support inbox (email, Telegram, etc.)
- [ ] Are there common questions? Note them.
- [ ] Respond personally to first few users (builds goodwill)

**Moriah (Support Automation):**
Using templates from BETA_SUPPORT_PLAYBOOK.md:
- [ ] Set up auto-responders for common questions
- [ ] Monitor support channel for escalations
- [ ] Handle technical issues (bugs, errors)

**Template Responses Ready:**
- ✅ "How do I upload my bank statement?" → Copy template
- ✅ "Is my data safe?" → Copy template
- ✅ "How much does it cost?" → Copy template
- ✅ Bug report → Log + investigate

---

### **11:00 AM - CONVERSION PUSH (10 minutes)**

By 11 AM, you should have 30-40 signups. Now let's convert some to paying customers.

**Tina (Sales):**
- [ ] Look at which users are most engaged
- [ ] Email top candidates with: "Love Finance Friend? Upgrade to premium now!"
- [ ] Offer: "First 10 paying customers get 50% off first month"

**Template Email:**
```
Subject: You're getting great results with Finance Friend 👏

Hi [Name],

You've uploaded [N] transactions and asked [M] questions. 

Looks like you're really using Finance Friend! Now's the time to unlock premium features:

✨ Premium Features ($19.99/month):
• Advanced tax classification
• Scenario planning
• Detailed analytics
• Priority support

Limited offer: First 10 paying customers get 50% off first month ($9.99)

👉 [UPGRADE LINK]

Questions? Reply to this email.

Best,
Tina Marie
Finance Friend
```

**Expected Results:**
- 2-5 conversions by 12:00 PM
- $60-100 MRR by end of day

---

### **11:30 AM - SOCIAL PROOF (5 minutes)**

**Tina (Social):**
If things are going well, post about launch:
- Twitter: Screenshot of user count + revenue
- LinkedIn: Founder's journey mini-thread
- Telegram: Announcement in relevant communities

**Example Tweet:**
```
🎉 Finance Friend v2 is LIVE!

30+ users in the first 2 hours. 5 paying customers already.

If your finances stress you out, upload your statement and let an AI help. No credit card required for the first 30 days.

[LINK TO APP]
```

**Why:** Social proof attracts more signups. Early success attracts attention.

---

### **12:00 PM - END OF LAUNCH WINDOW (Final Check)**

**Tina (Final Review):**

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| Signups | 20-50 | ? | ✅ / ⚠️ / ❌ |
| Uploads | 6-15 | ? | ✅ / ⚠️ / ❌ |
| Conversions | 2-5 | ? | ✅ / ⚠️ / ❌ |
| MRR | $60-150 | ? | ✅ / ⚠️ / ❌ |
| Errors | <1% | ? | ✅ / ⚠️ / ❌ |

**Possible Outcomes:**

**OUTCOME A: 🎉 SUCCESS (Most likely)**
- 30-50 signups, 8-15 uploads, 3-5 conversions
- MRR $90-150, 0% errors
- Action: Keep running. Post more emails. Scale what's working.

**OUTCOME B: 🟡 SLOW START (Sometimes happens)**
- 10-20 signups, 2-5 uploads, 0-1 conversions
- MRR $0-30, 0% errors
- Action: Investigate. Are emails reaching inbox? Is signup form confusing? Try different messaging in afternoon emails.

**OUTCOME C: 🔴 BROKEN (Rare, plan for recovery)**
- <5 signups, errors in logs
- Action: Check deployment. Review error logs. Rollback if necessary. Diagnose + fix + relaunch at 2 PM.

---

## 📊 Metrics to Track

**Every 30 minutes, log:**

```
TIME: 9:00 AM
Signups (total): 0
Uploads (total): 0
Conversions (total): 0
MRR (current month): $0
Errors (last 30 min): 0
Notes: Deployment in progress

TIME: 9:30 AM
Signups (total): 8
Uploads (total): 2
Conversions (total): 0
MRR (current month): $0
Errors (last 30 min): 0
Notes: Email campaign launched
```

**Google Sheet:** [Create new sheet titled "Launch Day Metrics"]

---

## 🆘 Troubleshooting During Launch

### Problem: Site not loading
**Quick fix (2 min):**
1. Check Vercel dashboard → Deployments (is latest deployed?)
2. Check server logs (error messages?)
3. Is Anthropic API key set? (check env vars)

**If still broken:** Rollback to previous version + investigate

### Problem: No signups coming in
**Quick fix (5 min):**
1. Check email logs (are emails sending?)
2. Are emails going to spam? (check spam folder)
3. Is signup form broken? (test it yourself)
4. Are you promoting it enough? (did you tweet, email, tell people?)

### Problem: Signups but no uploads
**Quick fix (5 min):**
1. Ask early users: "Why didn't you upload?" (reply to their email)
2. Is upload UI confusing? (watch new user behavior)
3. Is upload broken? (test it yourself)
4. Is the CSV format unclear? (add example + docs)

### Problem: Errors showing up
**Quick fix (5 min):**
1. Look at error logs → see the exact error message
2. Is it a code bug? (roll back previous version)
3. Is it a missing env var? (check Vercel env vars)
4. Is it external API (Anthropic) down? (check their status page)

---

## 📞 Who to Contact

| Issue | Who to Contact | What They Do |
|-------|---|---|
| Code bugs / deployment | Moriah | Investigates logs, fixes code, redeploys |
| Support emails / responses | Tina | Writes thoughtful replies, builds relationships |
| Marketing / social posts | Tina | Creates buzz, shares wins |
| Server errors / monitoring | Caleb | Monitors infrastructure, escalates |
| Business decisions | Tina | Decides next steps if something goes wrong |

---

## 🎯 Success Looks Like

**By 12:00 PM you have:**
- ✅ 30+ signups from your email list
- ✅ 8+ users who uploaded their bank statement
- ✅ 3+ paying customers (beta test of paid conversion)
- ✅ MRR >$50 (validates the business model)
- ✅ 0 critical errors
- ✅ 5+ pieces of user feedback

**By 5:00 PM you have:**
- ✅ 50-100 total signups
- ✅ 15-30 uploads
- ✅ 5-10 conversions
- ✅ MRR $150-300
- ✅ Clear patterns of what's working (which emails, which users)

**By end of day you have:**
- ✅ First day success documented
- ✅ Week 1 roadmap clear (what to do Mon-Fri)
- ✅ Team feedback on what to improve

---

## 🔄 After Launch (Week 1 Schedule)

### Daily (Every day at 9 AM)
- Check metrics from previous day
- Review support emails
- Plan day's marketing push

### Every other day
- Update competitor pricing/features
- Ask 2-3 users about their experience
- Document learnings

### Weekly (Every Friday)
- Review full week metrics
- Plan improvements for week 2
- Share wins with team

---

**Prepared by:** Moriah  
**Status:** Ready to execute  
**Requires:** Tina's PATH decision + ANTHROPIC_API_KEY  
**Timeline:** 3-hour launch window (9 AM - 12 PM)

🚀 **Let's go.** We've trained for this.

