# Finance Friend Automated Email Sequence

**Purpose:** Convert free users → paid subscribers through a carefully timed 7-email sequence

**Timeline:** Triggered on signup, spaced 2-3 days apart  
**Integration:** Mailchimp, SendGrid, or Stripe Trigger (recommended: Stripe for direct integration with payment events)

---

## EMAIL 1: Welcome & Aha Moment (Immediate, < 1 min after signup)

**Subject:** Stop fighting money. Start winning. 👋

**Body:**
```
Hi {{FIRST_NAME}},

Welcome to Finance Friend. You just joined 100+ early adopters who are 
done letting money be a mystery.

Here's what's different about Finance Friend:
• Your personal AI coach (not just a dashboard)
• Real tax insights (for business owners especially)
• Behavioral change (not just tracking)

Your first step: Upload a bank statement (we support most banks).

Just drag & drop a PDF or CSV into Finance Friend, and our coach will 
analyze it and ask you one question that changes everything:

"What do you want your money to do for you?"

That question is the entire point. Every feature is built around the answer.

Ready? Open Finance Friend now → Upload Statement

Questions? Reply to this email. Our team reads every response.

— Tina + the Finance Friend team
```

**CTA Button:** "Open Finance Friend"  
**Goal:** Get users to upload their first statement (the aha moment)

---

## EMAIL 2: First Success (2 days after email 1 OR after first upload)

**Subject:** Wow. Look what your money is telling us.

**Body:**
```
Hi {{FIRST_NAME}},

You uploaded your first bank statement. Here's what we found:

**Your Financial Summary:**
- Monthly income: ${{MONTHLY_INCOME}}
- Average spending category: {{BIGGEST_CATEGORY}}
- Transactions analyzed: {{TRANSACTION_COUNT}}
- Red flags identified: {{FLAGGED_TRANSACTIONS}}

Now here's the thing: this is just what happened.

The real power of Finance Friend is understanding WHY it happened and 
what you want to change.

Our coach has one question for you:

"Looking at your {{BIGGEST_CATEGORY}} spending — is that 
intentional or by default?"

Most people never answer this question. But when they do, everything changes.

Reply to this email with your answer. Our coach will respond personally.

(Or open Finance Friend and chat with your AI coach directly — 
they're ready to help.)

— Tina + the Finance Friend team
```

**Personalization Required:**
- Monthly income (calculated from uploaded statements)
- Biggest spending category
- Transaction count
- Any flagged transactions (unusual activity)

**Goal:** Drive engagement through personal, meaningful data

---

## EMAIL 3: Feature Discovery (3 days after email 2 OR if no chat response)

**Subject:** 3 features that change the game

**Body:**
```
Hi {{FIRST_NAME}},

Most people use Finance Friend like a fancy spreadsheet.

But that's like using a Ferrari for parking lots.

Here are 3 features that unlock actual behavior change:

**1. Tax Classification (Pro feature)**
Automatically categorize business expenses vs personal spending.
Most people miss $2K-5K in tax savings every year.
Not anymore.

**2. Energy & Time Tracking**
Money isn't just money. It's also time and energy.
Finance Friend measures all three.
See the real cost of every decision.

**3. Your Personal Coach**
Forget chatbots. This is an actual thinking partner who knows 
your full financial picture and asks questions that matter.

**Ready to level up?** 
Try Pro for 30 days free. No credit card. Just upgrade now.

(If you have questions, our team is here. Reply to this email.)

— Tina + the Finance Friend team
```

**Segmentation Note:**
- If user has been active: emphasize Pro features
- If user has been quiet: emphasize Coach feature
- If user uploaded multiple statements: emphasize Energy Tracking

**Goal:** Introduce Pro value without being pushy

---

## EMAIL 4: Social Proof (5 days after email 3 OR if user hasn't upgraded)

**Subject:** Why other Finance Friend users upgraded (and why you should too)

**Body:**
```
Hi {{FIRST_NAME}},

We asked our Pro users one question:

"What made you upgrade?"

Here's what they said:

**"The coach asked me something I'd never thought of."**
— Marcus, self-employed, Texas

**"I stopped losing $300/month to subscription creep."**
— Sarah, salaried, Seattle

**"Finally understand where my time actually goes."**
— Jordan, freelancer, Portland

What they all have in common: they stopped guessing about money.

You uploaded a bank statement. You have the data. The only question is:
are you going to learn from it?

**Upgrade to Pro and find out.**

30 days free. No credit card needed. 
Then $9.99/month (or cancel anytime).

→ Start your free trial

(Questions? We're here.)

— Tina + the Finance Friend team
```

**Personalization:**
- Show testimonials from users in same category (salaried, self-employed, etc.)
- Mention their data: "You spent ${{BIG_EXPENSE}} on {{CATEGORY}}. Our Pro users typically save 20% in that area."

**Goal:** Social proof + segment-specific value props

---

## EMAIL 5: The Coach Question (7 days after email 4 OR if user still hasn't upgraded)

**Subject:** This is the question that matters

**Body:**
```
Hi {{FIRST_NAME}},

Finance Friend is built around one question:

"What do you want your money to do for you?"

We ask it because the answer changes everything.

If you don't know the answer, that's okay. Most people don't.

But that's also why most people stay stuck.

**Our coach knows how to help you answer it.**

They've worked through this question with hundreds of people.
Self-employed founders. Salaried employees. Freelancers. Parents.
People in every situation you can imagine.

And here's what they all discovered:

Once you know what you want your money to do, you see opportunities 
you couldn't see before.

**Upgrade to Pro. Meet your coach. Ask the question.**

30 days free, then $9.99/month.

→ Start your free trial

The question is waiting for you.

— Tina + the Finance Friend team
```

**Goal:** Emotional resonance + coaching value prop

---

## EMAIL 6: Last Chance (10 days after email 5 OR if user approaching 14-day idle threshold)

**Subject:** Your data is here. The question is: what will you do with it?

**Body:**
```
Hi {{FIRST_NAME}},

You've been part of Finance Friend for {{DAYS_SINCE_SIGNUP}} days.

Here's what happened:
✓ You uploaded {{STATEMENT_COUNT}} bank statement(s)
✓ Your coach analyzed {{TRANSACTION_COUNT}} transactions
✓ We identified {{KEY_INSIGHTS}} about your spending

But here's what didn't happen:
✗ You didn't upgrade to Pro
✗ You didn't talk to your coach
✗ You didn't answer the question: "What do you want your money to do?"

Maybe you're busy. Maybe you're not sure if Pro is worth it.
Maybe you're just thinking about it.

But {{FIRST_NAME}}, your data doesn't wait.

**One conversation with your coach changes everything.**

That's what Pro unlocks.

Ready to find out what your coach sees in your numbers?

→ Start your free trial (no credit card)

30 days free. Then $9.99/month (or cancel anytime).

— Tina + the Finance Friend team

P.S. — Our most successful users did this on day 2 of sign-up.
Your data is warmest when it's fresh.
```

**Goal:** Urgency + remind of value

---

## EMAIL 7: Graduation or Re-Engagement (14 days after signup)

### Path A: If User Upgraded to Pro

**Subject:** Welcome to the Finance Friend Pro community

**Body:**
```
Hi {{FIRST_NAME}},

You upgraded to Pro. That means you're serious about changing your 
relationship with money.

Here's what Pro unlocks:
1. Your personal AI coach (daily availability)
2. Tax classification (business vs personal spending)
3. Energy & time tracking (see the real cost of decisions)
4. Custom budget planning
5. Scenario modeling ("what if I changed this?")

**Your first task:** 
Open Finance Friend and ask your coach one real question about 
your money. Anything at all.

They're ready to think with you.

Welcome to the team.

— Tina + the Finance Friend team
```

### Path B: If User Did NOT Upgrade

**Subject:** No pressure. But we miss you.

**Body:**
```
Hi {{FIRST_NAME}},

You've been a free Finance Friend user for 2 weeks.

We're not here to push you. We're here because we think 
changing your relationship with money matters.

If Pro isn't the right fit, that's okay.

But if you've been thinking about it, now's the time. 

**Your data is here.**
**Your coach is ready.**
**The question is waiting.**

→ Start your free Pro trial

30 days, no credit card, then $9.99/month.

(Or stay on free forever. No judgment.)

— Tina + the Finance Friend team
```

**Goal:** Re-engagement without pressure

---

## Automation Rules (for Mailchimp/SendGrid/Stripe)

### Trigger: User signs up to Finance Friend

1. **Immediately:** Send Email 1 (Welcome)
2. **After 48 hours:** Send Email 2 (IF user hasn't uploaded statement, send anyway)
3. **After 72 hours:** Send Email 3 (Feature discovery)
4. **After 120 hours (5 days):** Send Email 4 (Social proof)
5. **After 168 hours (7 days):** Send Email 5 (Coach question)
6. **After 240 hours (10 days):** Send Email 6 (Last chance) IF user hasn't upgraded
7. **After 336 hours (14 days):** Send Email 7 (Graduation or Re-engagement)

### Conditional Rules

**Stop sequence if:**
- User upgrades to Pro → Switch to Path A (welcome email)
- User unsubscribes → Remove from all future emails
- User marks spam → Remove and log

**Adjust timing if:**
- User is from European timezone (adjust for local business hours)
- User opened email < 2 hours after send → next email in 2 days (vs 3)
- User hasn't opened any email in sequence → re-send Email 3 with subject line variation

---

## Email Performance Targets

**What success looks like:**

| Metric | Target | Notes |
|--------|--------|-------|
| Email 1 (Welcome) | 40% open rate | Welcome emails typically 35-50% |
| Email 2 (Aha) | 35% open rate | Still hot, but declining |
| Email 3 (Features) | 30% open rate | Interest is declining |
| Email 4 (Proof) | 25% open rate | Low-interest users dropping |
| Email 5 (Coach) | 20% open rate | Committed users remaining |
| Email 6 (Last Chance) | 15% open rate | Final push |
| Email 7 (Graduation) | 5-10% open rate | Depends on upgrade path |

**Conversion Metrics:**
- Free → Pro conversion in sequence: 8-12%
- Email 1 → Email 7 completion: 30% (read at least 3 emails)
- Click-through to app: 15-20%

---

## Setup Instructions for Tina

### Option 1: Mailchimp (Free to start)

1. Create segment: "Finance Friend Free Users"
2. Create automation workflow
3. Set up 7 emails with times above
4. Import email copy (below) and adjust
5. Test with yourself first
6. Go live

**Cost:** Free until 500 subscribers, then $20/mo

### Option 2: SendGrid (Better for developers)

1. Create transactional email templates for each message
2. Set up event-triggered sends (user signup → trigger Email 1)
3. Use code to trigger emails based on user actions (upload statement → trigger Email 2)
4. Monitor metrics in SendGrid dashboard

**Cost:** Free for up to 100 emails/day, then $30+/mo

### Option 3: Stripe Email Integration (Recommended for us)

1. Every user signup is a Stripe customer
2. Stripe triggers Email 1 immediately
3. Upgrade to Pro = Stripe event triggers Email 7 Path A
4. 14 days no upgrade = Email 7 Path B
5. Integrate with Mailchimp via Zapier for the middle sequence

**Cost:** Free (built into Stripe)

---

## Metrics Dashboard

Setup a simple spreadsheet (or Metabase dashboard) to track:

- Daily signups
- Cumulative opens per email
- Cumulative clicks per email
- Email → upgrade conversions
- Average time to upgrade (for those who do)
- Pro retention at 30/60/90 days

Review every Monday morning.

---

## Next Steps

1. **Tina reviews and edits** copy (make it sound like her voice)
2. **Test sequence** by signing up and going through all 7 emails
3. **Go live** when app launches (Email 1 triggers on signup)
4. **Monitor daily** for first week (watch for bounces, issues)
5. **Optimize** after first 100 users (update social proof, segment targeting)

---

**Created:** March 20, 2026, 10:30 PM HADT  
**Status:** Ready to implement  
**Estimated ROI:** 8-12% free → paid conversion = $500-750 per 100 signups at $9.99/mo
