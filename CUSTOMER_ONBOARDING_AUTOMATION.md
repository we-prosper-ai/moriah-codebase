# Customer Onboarding Automation — Finance Friend

**Goal:** Guide new users to their "aha moment" in 24 hours (upload statement → get insights → talk to coach)

**Why it matters:** First-day experience predicts retention + conversion to Pro

---

## THE 24-HOUR ONBOARDING JOURNEY

### MINUTE 0-5: Welcome Email (Triggered on signup)

**Email:** "Welcome to Finance Friend. Let's get you clarity in 5 minutes."

**Content:**
```
Hi {{FIRST_NAME}},

You just joined Finance Friend. Here's what happens next:

1. We'll ask you 3 questions (2 min)
2. You'll upload a bank statement (1 min)
3. Your coach will analyze it and ask you something important (2 min)

Total time: 5 minutes. This is your aha moment.

Ready? Open Finance Friend now.

— Tina + the team
```

**CTA:** "Open Finance Friend" (links to app login)

**Tracking:** Mark user as "onboarded:email_sent"

---

### MINUTE 5-10: In-App Onboarding Flow

**Screen 1: Welcome Modal**
```
Title: "Hi {{FIRST_NAME}}. Let's change how you think about money."
Subtitle: "We'll ask you 3 questions, then you upload your first statement."

Question 1 (radio buttons):
  "What's your biggest money struggle right now?"
  - Too much spending, not enough savings
  - Taxes are confusing
  - No clarity on business vs personal
  - All of the above
  - Something else: ___________

Answer saved to profile.
Next button → Screen 2
```

**Screen 2: Quick Profile**
```
Question 2 (dropdown):
  "What's your primary income source?"
  - Salaried employee
  - Self-employed / Freelancer
  - Business owner
  - Multiple income streams
  - Other: ___________

Question 3 (radio):
  "What would success look like for you?"
  - Save more money
  - Understand where money goes
  - Pay less in taxes
  - Feel less stressed about money
  - All of the above

Answer saved.
CTA Button: "Upload Your First Statement"
```

**Tracking:** Mark as "onboarded:profile_complete"

---

### MINUTE 10-12: Upload Bank Statement

**Screen 3: File Upload**
```
Title: "Upload your most recent bank statement"
Subtitle: "We support PDF and CSV from all major banks."

Dropzone: Drag & drop or click to select file
Supported formats: PDF, CSV, XLS

Behind the scenes (when file uploaded):
- Process file (extract transactions)
- Categorize transactions
- Flag patterns + anomalies
- Prepare coach summary
- Trigger Email 2 (with insights)
```

**Tracking:** Mark as "onboarded:statement_uploaded"

---

### MINUTE 12-24: Coach Analysis

**Background process:**
1. Extract transactions from statement
2. Run through categorization engine
3. Identify top spending categories
4. Flag any unusual activity
5. Prepare personalized insights
6. Generate coach's first question

**Email 2 (triggered ~2 min after upload): "Look what we found"**

```
Hi {{FIRST_NAME}},

You uploaded your first bank statement. Our coach has analyzed 
your {{TRANSACTION_COUNT}} transactions and found some patterns.

Here's what stands out:

💰 **Your Spending by Category:**
- {{CATEGORY_1}}: {{AMOUNT_1}} ({{PERCENT_1}}%)
- {{CATEGORY_2}}: {{AMOUNT_2}} ({{PERCENT_2}}%)
- {{CATEGORY_3}}: {{AMOUNT_3}} ({{PERCENT_3}}%)

🚨 **We flagged {{FLAGGED_COUNT}} transactions:**
- {{FLAG_1}}: {{DESCRIPTION_1}}
- {{FLAG_2}}: {{DESCRIPTION_2}}

Now here's the important part. Your coach has one question for you:

**"Looking at your {{BIGGEST_CATEGORY}} spending of {{BIGGEST_AMOUNT}} — 
is that intentional or by default?"**

This is where clarity happens. When you know the answer to this question, 
everything changes.

Reply to this email, or open Finance Friend and chat with your coach directly.

— Tina + the team
```

**Tracking:** Mark as "onboarded:insights_emailed"

---

### HOUR 1-24: Active Engagement Tracking

**If user opens app within 1 hour:**
- Display personalized dashboard (what they uploaded, what we found)
- Show coach profile + first question
- Offer 3 quick actions:
  - Chat with coach now
  - Explore your dashboard
  - Learn about Pro features

**If user doesn't open app within 1 hour:**
- Send reminder SMS (if phone on file) or email
- Subject: "Your coach is waiting to chat"
- Body: Brief message + link to open app

**If user opens app but doesn't chat:**
- After 5 minutes idle, show popup:
  - "Your coach has a question for you about your {{CATEGORY}} spending"
  - Offer to open chat
  - Can dismiss (no nagging)

---

## CONDITIONAL FLOWS

### Path A: User chatted with coach within 24 hours

**Trigger:** Chat message received

**Actions:**
1. Tag user as "engaged:coach_conversation"
2. Send follow-up email in 24 hours: "Here's what your coach saw"
3. Suggest Pro upgrade if not already Pro
4. Gather feedback: "How was your first conversation?"

### Path B: User uploaded statement but didn't chat

**Trigger:** 24 hours since upload, no chat

**Actions:**
1. Send "Your coach is waiting" email (reminder)
2. Emphasize coaching value: "This is where the magic happens"
3. Offer specific topic: "Ask about {{BIGGEST_CATEGORY}}"
4. If still no response after 48 hours: Send education email (teach something valuable)

### Path C: User signed up but never uploaded

**Trigger:** 24 hours since signup, no upload

**Actions:**
1. Send "Let's get you set up" reminder email
2. Simplify instructions: "Just drag & drop your statement"
3. Offer help: "Reply if you need support finding your statement"
4. Alternative: "Start with the sample statement to explore the app"

---

## EMAIL TIMING

| Trigger | Email | Time | Purpose |
|---------|-------|------|---------|
| Signup | Welcome | Immediate | Get to app quickly |
| Statement upload | Insights | +2 min | Show value |
| No chat by +1h | Reminder | +1h | Light nudge |
| No activity by +12h | Engagement | +12h | Stronger nudge |
| No activity by +24h | Coach waiting | +24h | Final push |
| Chatted with coach | Follow-up | +24h | Continue momentum |

---

## DASHBOARD CUSTOMIZATION (First Visit)

When user opens app for the first time, dashboard shows:

```
YOUR QUICK SUMMARY
─────────────────
Monthly Income: ${{INCOME}} (based on {{STATEMENT_PERIOD}})
Total Spending: ${{SPENDING}}
Biggest Category: {{CATEGORY}} at {{AMOUNT}} ({{PERCENT}}%)

THE QUESTION YOUR COACH ASKED:
"Is your {{CATEGORY}} spending intentional or by default?"

[Chat with Coach] button (prominent CTA)

YOUR TOP 3 TRANSACTIONS:
- {{TRANS_1}} — ${{AMOUNT_1}} on {{DATE_1}}
- {{TRANS_2}} — ${{AMOUNT_2}} on {{DATE_2}}
- {{TRANS_3}} — ${{AMOUNT_3}} on {{DATE_3}}
```

---

## GAMIFICATION (Optional, but effective)

**Onboarding milestones:**
- [ ] ✅ Signed up (welcome email sent)
- [ ] Upload statement (reward: see your dashboard)
- [ ] Chat with coach (reward: unlock tax classifier preview)
- [ ] Answer the question (reward: get personalized insights)
- [ ] Upgrade to Pro (reward: unlock full feature set)

Visual progress bar on dashboard: "You're 2/5 steps to clarity"

---

## SUCCESS METRICS

### Desired outcomes (by 24 hours):
- 60%+ of signups open the app
- 40%+ upload a statement
- 20%+ chat with coach
- 5-8% convert to Pro (same day)

### By 7 days:
- 70%+ have uploaded statement
- 40%+ have chatted with coach
- 10-15% Pro conversions

### By 30 days:
- 85%+ active users
- 25%+ Pro conversions
- <5% churn

---

## IMPLEMENTATION

### Backend Changes Needed:
1. Add "onboarding_step" field to User model
2. Create Onboarding event log (for analytics)
3. Add trigger: On signup → Send Email 1
4. Add trigger: On statement upload → Run analysis → Send Email 2
5. Add reminder email job (daily, for users who need nudge)

### Frontend Changes:
1. Create Welcome modal (Screen 1)
2. Create Profile questions (Screen 2)
3. Add upload zone integration
4. Add coach chat (already in design)
5. Update dashboard (personalization for new users)

### Email Integration:
1. Connect Mailchimp to app via API
2. Create email templates (in Mailchimp)
3. Set up triggers (Zapier or direct API calls)
4. Monitor delivery + opens (daily check)

### Timeline:
- **Day 1:** Backend events + email triggers
- **Day 2:** Frontend modals + onboarding flow
- **Day 3:** Testing + QA
- **Day 4:** Go live (with real onboarding)

---

## SAMPLE COACH QUESTIONS (By Situation)

### For high {{CATEGORY}} spending:
- "Is your {{CATEGORY}} spending intentional or by default?"
- "What would happen if you cut {{CATEGORY}} by 20%?"
- "What value does {{CATEGORY}} give you?"

### For irregular income:
- "How do you plan for months when income is lower?"
- "What's your highest and lowest income month?"
- "How do you allocate irregular income?"

### For self-employed with high taxes:
- "What percentage of income goes to taxes?"
- "Do you set aside money each month for taxes?"
- "What deductions are you missing?"

### Generic (fallback):
- "What's the biggest change you'd like to make?"
- "If money weren't a stress, what would change?"
- "What does financial freedom look like to you?"

---

## RETENTION STRATEGY (Months 2+)

**Weekly engagement:**
- Coach sends new question (once per week)
- Dashboard highlights new insights
- Reminder: "Your spending pattern changed"

**Monthly milestones:**
- "You've tracked {{DAYS}} days of spending"
- "You've had {{CHATS}} conversations with your coach"
- "Here's what changed for you this month"

**Upgrade incentives (for free users):**
- "Unlock tax classification to find {{ESTIMATED_SAVINGS}} in savings"
- "Pro users save ${{AVG_SAVINGS}} per month"
- "See how you compare to other {{SEGMENT}} users"

---

## TEMPLATE: Coach's First Question Email

```html
<h1>Look what we found</h1>

<p>Hi {{FIRST_NAME}},</p>

<p>You uploaded your first bank statement. Our coach has analyzed 
your {{TRANSACTION_COUNT}} transactions.</p>

<h2>Your Spending Summary</h2>
<ul>
  <li>Monthly Income: ${{INCOME}}</li>
  <li>Monthly Spending: ${{SPENDING}}</li>
  <li>Top Category: {{CATEGORY}} at ${{AMOUNT}} ({{PERCENT}}%)</li>
</ul>

<h2>Your Coach's Question</h2>
<blockquote>
  "Looking at your {{CATEGORY}} spending of ${{AMOUNT}} — 
  is that intentional or by default?"
</blockquote>

<p>This is where clarity happens.</p>

<a href="{{APP_URL}}/chat" class="btn btn-primary">Chat with Your Coach Now</a>

<p>Or reply to this email. Your coach reads every response.</p>

<p>— Tina + the Finance Friend team</p>
```

---

**Created:** March 20, 2026, 11:00 PM HADT  
**Status:** Ready to implement  
**Expected impact:** 20%+ improvement in onboarding completion + 2x improvement in Pro conversion
