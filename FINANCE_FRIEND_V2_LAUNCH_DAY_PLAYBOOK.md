# Finance Friend v2 — LAUNCH DAY PLAYBOOK

**Status:** Ready to execute  
**Duration:** 60 minutes total (4 hours to live users)  
**Difficulty:** Low (mostly copy-paste and clicking)

---

## ✅ Pre-Launch Checklist (Do This First)

### Morning of Launch (30 minutes)

- [ ] **Read both docs:**
  - [ ] FINANCE_FRIEND_V2_LAUNCH_CHECKLIST.md (deployment steps)
  - [ ] FINANCE_FRIEND_V2_BETA_TEST_PLAN.md (who to recruit + how)

- [ ] **Gather your team (if applicable):**
  - [ ] Do you need technical help with GitHub/Vercel?
  - [ ] Can you handle beta user recruiting yourself?

- [ ] **Decide on Day 1 messaging:**
  - [ ] Will you launch quietly (just beta testers) or announce it?
  - [ ] Who's your first 5 beta testers? (email list ready?)

---

## 🚀 LAUNCH SEQUENCE (60 Minutes)

### Phase 1: GitHub Setup (5 minutes)

```bash
# Step 1: Create repo on GitHub.com
# 1. Go to github.com
# 2. Click "New repository"
# 3. Name: finance-friend-v2
# 4. Description: "AI-powered personal finance dashboard"
# 5. Make it Public (so tmnsystems can see)
# 6. Create repository

# Step 2: Clone and push code (from your machine)
cd /tmp/finance-friend-v2
git remote add origin https://github.com/[YOUR_USERNAME]/finance-friend-v2.git
git branch -M main
git push -u origin main

# Step 3: Add tmnsystems as collaborator
# Go to GitHub repo → Settings → Collaborators → Add tmnsystems
```

**Expected time:** 5 minutes  
**Success indicator:** You see code in GitHub

---

### Phase 2: Vercel Deployment (5 minutes)

```bash
# Step 1: Go to vercel.com
# Step 2: Click "New Project"
# Step 3: Import GitHub repo (finance-friend-v2)
# Step 4: Accept defaults
# Step 5: Add environment variables:
#   - JWT_SECRET: [32-character random string]
#   - OPENAI_API_KEY: [your API key]
# Step 6: Click "Deploy"
# Wait 3-5 minutes for build...
```

**Expected time:** 5 minutes + 3-5 min auto-build  
**Success indicator:** You get a URL like https://finance-friend-v2.vercel.app

---

### Phase 3: Testing Live App (10 minutes)

**Do this on the live Vercel URL (not localhost):**

- [ ] **Register Test User**
  ```
  Go to https://finance-friend-v2.vercel.app
  Email: testuser@yourdomain.com
  Password: TestPassword123!
  Click "Register"
  Expected: Success page
  ```

- [ ] **Login with Test Credentials**
  ```
  Log out (if needed)
  Log back in with same email/password
  Expected: See dashboard
  ```

- [ ] **Upload Sample Statement**
  ```
  Click "Upload Bank Statement"
  Choose file: sample-statements/sarah-chen.csv (in your repo)
  Wait 3 seconds
  Expected: See transactions appear in list
  ```

- [ ] **Chat with AI**
  ```
  Click "Ask Finance Friend"
  Type: "What's my total spending?"
  Wait 2 seconds
  Expected: AI responds with spending amount
  ```

- [ ] **Check Browser Console**
  ```
  Press F12 (open dev tools)
  Click "Console" tab
  Expected: No red error messages (warnings OK)
  ```

**Expected time:** 10 minutes  
**Success indicator:** All tests pass, no errors

---

### Phase 4: Recruit First 5 Beta Testers (5 minutes)

**Email Template (just copy-paste):**

```
Subject: You're invited to test Finance Friend (early access) 🎉

Hi [NAME],

I just launched something I'd love your feedback on.

It's called Finance Friend — an AI that helps you understand 
your spending. No complexity, just insights.

Here's what it does:
1. Upload your bank statement (I'll send you a sample)
2. Chat with AI ("Where am I spending the most?")
3. Get insights and coaching

Takes 10 minutes. Free. No strings attached.

Would you be willing to try it and tell me what you think?

Link: https://finance-friend-v2.vercel.app
Sample CSV: [attach sarah-chen.csv]

Just reply with your feedback.

Thanks!
— Tina
```

**Who to send to:**
1. Friend who's complained about finances
2. Your accountant (they'll love the tax angle)
3. Fellow entrepreneur/self-employed friend
4. Friend good at giving feedback
5. One more for backup

**Expected time:** 5 minutes (just copy email + send)  
**Success indicator:** 3+ people respond within 24h

---

### Phase 5: Set Up Feedback Collection (5 minutes)

**Create a simple Google Form:**

```
Go to forms.google.com → "Blank" form

Question 1: "On a scale of 1-10, how useful was Finance Friend?"
Type: Slider (1-10)

Question 2: "What did you like most?"
Type: Short answer

Question 3: "What was confusing?"
Type: Short answer

Question 4: "Would you pay $9.99/month for this?"
Type: Multiple choice (Yes / Maybe / No)

Question 5: "Who else should I show this to?"
Type: Short answer

Question 6: "Anything else?"
Type: Long answer

Click "Send" → Copy link
Email testers: "Please fill this out after trying: [form link]"
```

**Expected time:** 5 minutes  
**Success indicator:** Form is created and shareable

---

### Phase 6: Announce (Optional — Skip if Quiet Launch)

**If going public (Twitter, Reddit, LinkedIn):**

Choose ONE of these:

**Option A: Twitter (Viral)**
```
just shipped Finance Friend 🧠💰

upload your bank statement → chat with AI → understand your spending

no setup, no complexity. just insights.

free to try: https://finance-friend-v2.vercel.app

what would make this useful to you?
```

**Option B: Reddit (Credible)**
Post to r/sideproject with:
- Title: "I built Finance Friend because YNAB frustrated me"
- Include screenshot of app
- Honest about what's next
- Ask for feedback

**Option C: Product Hunt (Prominent)**
- Wait until Day 2-3 (get user feedback first)
- Then announce with testimonials

**Expected time:** 5 minutes to post (or skip)  
**Success indicator:** Post is live

---

## ⏱️ Timeline Summary

| Phase | Time | By When |
|-------|------|---------|
| Pre-launch checklist | 30 min | 8 AM |
| GitHub setup | 5 min | 8:05 AM |
| Vercel deploy | 10 min | 8:15 AM |
| Test live app | 10 min | 8:25 AM |
| Recruit beta testers | 5 min | 8:30 AM |
| Setup feedback form | 5 min | 8:35 AM |
| Announce (optional) | 5 min | 8:40 AM |
| **Total** | **60 min** | **8:40 AM** |

**By 9 AM:** Finance Friend is live with 5 beta testers testing it.

---

## 🎯 Day 1 Success Metrics

| Metric | Target | Notes |
|--------|--------|-------|
| **App deploys** | ✓ | Takes 5-10 min on Vercel |
| **Tests pass** | ✓ | All 5 checks work |
| **Emails sent** | 5+ | Your first beta users |
| **Form ready** | ✓ | Collecting feedback |
| **Announcement live** | Optional | Not required for success |

**Go/No-Go:** If app deploys + tests pass, you succeeded. Everything else is bonus.

---

## 📊 Day 2-7 Actions

### Day 2: Check Feedback

- [ ] Did beta testers respond?
- [ ] What do they say they liked?
- [ ] What was confusing?
- [ ] Any bugs reported?
- [ ] Send "follow-up" email (FINANCE_FRIEND_V2_BETA_TEST_PLAN.md has template)

### Day 3-5: Fix Issues

- [ ] Pick top 1-2 bugs
- [ ] Fix them locally
- [ ] Push to GitHub
- [ ] Vercel auto-redeploys
- [ ] Tell beta testers: "Fixed the thing you mentioned!"

### Day 7: Expand

- [ ] Recruit 5 more testers (if first 5 are happy)
- [ ] Send survey to all testers
- [ ] Collect responses
- [ ] Make go/no-go decision (LAUNCH_CHECKLIST.md has criteria)

### Day 14: Decision

- [ ] Did beta testers like it?
- [ ] Would they pay?
- [ ] Public launch? Or more work?

---

## 🆘 Troubleshooting

### "Vercel build failed"
- Check Vercel logs (in dashboard)
- Common issue: Missing environment variable
- Fix: Add it, redeploy (auto)
- Takes 3-5 min to rebuild

### "App loads but buttons don't work"
- Check browser console (F12)
- If you see API errors: Backend issue
- If you see no errors: Frontend issue
- Contact developer or check GitHub issues

### "CSV upload doesn't work"
- Check if file is actually CSV (not .xls)
- Try the sample file: sarah-chen.csv
- If sample works, user's file has formatting issue

### "Chat doesn't respond"
- Check OpenAI API key is correct
- Verify you have API credits ($5+ balance)
- Try asking a simpler question
- If still stuck: Wait 1 hour (might be rate limited)

**If you're stuck:** Reply to the email and describe the problem.

---

## 🎁 Day 1 Success Celebration

When you hit "Deploy" and see your app go live:

✅ You have a real product in the real world  
✅ Real people are testing it  
✅ Real feedback is coming in  
✅ You can iterate based on what matters  

This is the hardest part. Everything after this is just improving.

Celebrate it.

---

## 📋 Checklists to Keep Handy

**Before you start:**
- [ ] This playbook open in one tab
- [ ] FINANCE_FRIEND_V2_LAUNCH_CHECKLIST.md open in another
- [ ] GitHub account logged in
- [ ] Vercel account logged in
- [ ] OpenAI API key handy (or know where to find it)
- [ ] First 5 beta tester emails listed

**During launch:**
- [ ] Check off each phase as you go
- [ ] Take screenshot when app goes live
- [ ] Save Vercel URL somewhere
- [ ] Note any issues you hit

**After launch:**
- [ ] Bookmark the live app URL
- [ ] Set phone reminder for Day 2 (check feedback)
- [ ] Set phone reminder for Day 7 (expand)
- [ ] Set phone reminder for Day 14 (go/no-go decision)

---

## 🚀 You've Got This

This playbook is 60 minutes from idea to live app.

Finance Friend v2 exists. It works. It's ready.

All that's left is you saying "go" and following these steps.

The hardest part is done. What's left is execution.

Let's make it real.

---

**Created:** March 21, 2026, 19:08 HADT  
**By:** Moriah (autonomous)  
**Status:** Read this once, then follow it step-by-step

One hour from now, Finance Friend will be live.

