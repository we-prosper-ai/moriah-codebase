# Email Templates for Launch
**For:** Finance Friend v2 & v3  
**Created:** March 21, 2026  
**Status:** Ready to implement

---

## 1. Welcome Email (Sign up confirmation)

```
From: hello@finance-friend.app
Subject: Welcome to Finance Friend! 🎉

Hi [User Name],

Welcome to Finance Friend. You're one of the first to join.

**Next steps:**
1. Log in to your account: [Login Link]
2. Upload your first statement (CSV or PDF)
3. See your finances in seconds

**Questions?** 
Reply to this email. Real human here. I'll help.

Questions about features? Check out our guide: [Help Link]

Can't find your statement? [Here's how to export from your bank].

---

Cheers,
Tina & The Finance Friend Team

P.S. — First dashboard view is magical. Let me know what you think.
```

---

## 2. Upgrade Invitation (To free users after 3 logins)

```
From: hello@finance-friend.app
Subject: Your money story, clearer now?

Hi [User Name],

I've been watching our first users. They upload statements. They see their numbers for the first time. Then they ask questions:

"Am I earning enough?"
"Should I raise my rates?"
"What's real tax liability?"

The free Finance Friend shows you the numbers. The premium version answers those questions.

That's what the $9.99/month coach does. It's me. It's actual coaching methodology, turned into AI that knows your business.

**Upgrade now:** [Upgrade Link]

You'll get:
- AI coach (ask anything)
- Tax classification (automatic)
- Advanced reports
- Everything else, plus

First month is $9.99. Cancel anytime. No lock-in.

---

Cheers,
Tina

P.S. — Don't upgrade if you don't want to. The free version works perfectly fine. But if you're curious, it's there.
```

---

## 3. Password Reset Email

```
From: hello@finance-friend.app
Subject: Reset your Finance Friend password

Hi [User Name],

You requested a password reset. Click here to reset:

[Password Reset Link]

This link expires in 24 hours.

If you didn't request this, ignore this email. Your password stays the same.

---

Questions? Reply to this email.

Finance Friend Team
```

---

## 4. Payment Confirmation Email

```
From: hello@finance-friend.app
Subject: You're all set! Welcome to premium.

Hi [User Name],

Welcome to Finance Friend Premium. You're charged $9.99/month, starting today.

**Your subscription:**
- Renewal date: [Next Month, Same Date]
- Charge: $9.99
- Status: Active ✓

**Now you have:**
- AI coach (ask anything about your finances)
- Tax classification (automatic)
- Advanced reports
- Everything in free, plus more

**Manage your subscription:**
[Subscription Management Link]

Can cancel anytime, no questions asked.

---

Questions? Reply here or check the FAQ: [FAQ Link]

Cheers,
Tina
```

---

## 5. Weekly Digest Email (Optional, for retention)

```
From: hello@finance-friend.app
Subject: Your money, this week

Hi [User Name],

**This week at a glance:**

📊 Revenue: $[Amount]
⏱️ Hours: [Hours]
⚡ Energy: [Avg Score]/5
🎯 Progress: [Goal %] toward your goals

**Biggest earner:** [Top project/client]
**Most energy draining:** [Task type]
**You're on track for:** $[Monthly projection]

---

Any questions? Ask the coach:
[Ask Coach Link]

Cheers,
Finance Friend
```

---

## 6. Churn Prevention Email (If unused for 2 weeks)

```
From: hello@finance-friend.app
Subject: We miss you

Hi [User Name],

Haven't logged in in a while. Wondering if something's wrong?

**Quick question:** What would make Finance Friend better for you?
- Missing feature?
- Too complicated?
- Wrong price?
- Just busy?

Reply to this email. I actually read them.

**Or:** Just log back in and upload your latest statement. One upload = one complete picture.

[Login Link]

---

Cheers,
Tina
```

---

## Implementation Notes

### Email Service
Use one of these (all have free tiers):
- **SendGrid** (easiest integration, $0-99/month)
- **Mailgun** (good for high volume, $0-99/month)
- **AWS SES** (cheapest at scale, $0.10 per 1000)

### When to Send
| Email | Trigger | Timing |
|-------|---------|--------|
| Welcome | Sign up complete | Immediately |
| Upgrade invite | 3rd login | After 3rd use |
| Password reset | Reset requested | Immediately |
| Payment confirm | Payment success | Immediately |
| Weekly digest | User preference | Every Monday 9 AM |
| Churn prevention | 14 days no login | Day 14 |

### Personalization Fields
Always include:
- `[User Name]` — Their first name
- `[Email]` — Their email
- `[Amount]` — Their revenue/stats
- `[Login Link]` — Direct to dashboard

### Tone
All emails should sound like:
- Tina wrote it (warm, direct, honest)
- NOT corporate (no "dear valued customer")
- Short (people are busy)
- Useful (every email serves a purpose)

---

**These are templates. Adjust to your voice. Make them real.**

— Moriah
