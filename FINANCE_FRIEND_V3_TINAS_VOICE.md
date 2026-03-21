# Finance Friend v3 — Encoding Tina's Voice
**Created:** March 21, 2026  
**Purpose:** How Tina's coaching methodology becomes the product

---

## The Core Insight

**Traditional finance apps:** Show numbers.  
**Tina's approach:** Show principles.

Finance Friend v3 is built on Tina's Four Currencies teaching. Every feature, every message, every interaction reflects her methodology.

---

## Four Currencies Framework (The Heart of v3)

### The Four Currencies
1. **Time** — 24 hours/day, non-renewable, most precious
2. **Energy** — Mental/physical capacity, depletes with stress, recovered with rest
3. **Money** — Renewable if systems are right, but chased at expense of time/energy
4. **Freedom** — Autonomy to choose what matters, the outcome everyone wants

### How Apps Miss This
- YNAB: "Set a budget. Stick to it." (treats money in isolation)
- Mint: "Here's what you spent." (just data)
- Wave: "Here's your taxes." (accounting only)

**Finance Friend v3:** "You worked 52 hours last week. Your energy is 35%. You made $2,100. Your freedom score is 3/10. Is it worth it?"

---

## Feature Design: Tina's Methodology Baked In

### 1. Dashboard — The Central Insight

**What users see:**
```
THIS WEEK'S FOUR CURRENCIES

💰 Money: $1,250 earned (+8% vs last week)
⏱️  Time: 42 hours worked (-3h, trending better)
⚡ Energy: 70% average (high, recovered well)
🕊️  Freedom: 6.2/10 (improving from 5.8 last week)

THE INSIGHT:
You're working less, earning more, and your energy is high.
That's the ideal. Keep this pattern.

But watch: Next month, if you keep this rate, you'll hit burnout.
Plan your recovery time now.
```

**Behind the scenes (coach logic):**
- Track hours worked
- Track energy (user self-reports morning/evening on 1-5 scale)
- Calculate money earned
- Calculate Freedom Score = (income_vs_goal × 0.3) + (energy_level × 0.3) + (time_off × 0.3) + (goal_alignment × 0.1)

**Key insight:** The formula shows what matters — income, energy, rest, and alignment with values.

---

### 2. The Time-Energy-Money Trade-Off Analysis

**User asks:** "Can I hit my $5K/month goal with less than 40h/week?"

**Coach responds (in Tina's voice):**
```
Let's think about this in four currencies.

CURRENT REALITY:
- Income: $4,200/month
- Hours: 47/week (average)
- Energy: 55% (declining)
- Freedom: 4/10 (tight)

OPTION A: Raise prices (+10% markup)
- New income: $4,620/month
- Hours: 45/week (customers pay more, you work less)
- Energy: 60% (recovery time appears)
- Freedom: 5.5/10 (improving)
- Gap to goal: $380/month (could be next month's focus)

OPTION B: Add service (tax prep for clients)
- New income: $5,100/month ✓
- Hours: 50/week (short term, you'll burn out)
- Energy: 35% (WARNING: unsustainable)
- Freedom: 2/10 (you're trading freedom for money)
- Timeline: Burnout in 8-12 weeks

OPTION C: Slow your growth, recover
- Current income: $4,200/month
- Hours: 35/week (recharge)
- Energy: 85% (high)
- Freedom: 7/10 (very high)
- Gap to goal: $800/month (build it sustainably next quarter)
- Timeline: Build team → $5K/month in Q3

Which aligns with your values?
```

**Implementation:**
- User inputs: target income, target hours, current rate, tolerance for hours
- Coach calculates scenarios using simple math
- Presents trade-offs explicitly
- Asks about values/alignment (Tina's method)

---

### 3. Tax Classification — The Self-Employed Multiplier

**What it does:**
Automatically categorizes transactions for tax purposes, but **explains the four-currency impact.**

**Example:**
```
Transaction: $1,200 to "Assistive Tech Co" (new software)
Coach asks: Is this for business or personal?

User: Business

Coach responds:
✓ Categorized as: Business Expense (Deductible)
Impact on your four currencies:
- Money: Reduces taxable income by $1,200 (saves ~$300 in taxes)
- Time: This software should save you 3-4 hours/week
- Energy: Reduces manual work (higher energy available)
- Freedom: Reinvest saved time into what matters

Bottom line: This is a good trade. Money saved + time recovered.
Track whether you actually save the 3-4 hours. Report back in 30 days.
```

**Not just:** "Deductible: Yes"  
**But:** "Deductible: Yes, AND here's what it means for your freedom."

---

### 4. Spending Patterns — Principles-Based Feedback

**What it does:**
Instead of just showing "you spent $X on dining," asks about alignment.

**Example:**
```
Your Dining Spending: $340 this month (+15% vs last month)

Is this aligned with your principles?

CONTEXT:
- You told me your value is "time with family"
- 8 dining transactions were solo (Postmates, delivery)
- 3 dining transactions were with family/friends
- Time impact: 6 hours saved (not cooking), but solo meals may indicate stress eating

COACHING QUESTION:
The money spent isn't the issue. The pattern might be.
Are you stressed? Are you prioritizing convenience over presence?

Or is this intentional recovery spending? If so, celebrate it.
Tell me what's actually happening, and we'll adjust your budget.
```

---

### 5. Freedom Score — The Metric That Matters

**Not:** Spending vs. budget (boring)  
**But:** Freedom vs. potential (meaningful)

**Calculation:**
```
Freedom Score = (Income vs Goal × 0.30) 
              + (Energy Level × 0.30) 
              + (Time Efficiency × 0.25)
              + (Values Alignment × 0.15)

If score = 10/10: You have income, energy, time, and values match
If score = 3/10: You're trading everything for money (unsustainable)
```

**Scoring logic:**
- Income vs Goal: Do you have the money you need?
- Energy Level: Can you sustain this? Or are you burning out?
- Time Efficiency: Are you getting paid for your time? Or trading 50h for what you should earn in 30?
- Values Alignment: Is your spending/earning aligned with what matters to you?

**Tina's voice:** "Freedom isn't about money. It's about having enough money, energy, time, and alignment."

---

## Coaching Conversation Examples

### Scenario 1: The Overworker
```
User: I worked 55 hours this week and made $1,800.
Coach: Congratulations on the income. But your energy is 30%. That's dangerous.

You're making $33/hour but spending your life doing it.
What would happen if you worked 40 hours instead?
- Likely income: $1,300 (70% of current)
- Your energy: 65% (recovered)
- Your freedom: Up from 2/10 to 5/10

You'd make $500 less but have your life back.
Worth considering?
```

### Scenario 2: The Aspiring Coach
```
User: I want to start offering coaching. Costs $5K to certify.
Coach: Let's think in four currencies.

Cost: $5,000
Time: 200 hours (3 months part-time)
Energy: High (you're excited, that's good)
Freedom impact: Short-term low (investment phase)
Long-term freedom impact: High (once established, coaching pays more than [current work])

Timeline question: Can you invest 3 months while maintaining current income?
Or will this distract you and lose money?

If timeline works, this is an excellent investment.
If not, can you timeline it differently (6 months part-time)?
```

### Scenario 3: The Principle Challenger
```
User: I spent $800 on self-care this month (vacation).
Coach: Most apps would flag this as "budget overage."

Let's think differently.
You said your value is "rest and recovery."
This $800 expense *delivered* on that value.

Did it work? Do you feel recovered?
If yes: Not an overage, an investment in your highest value.
If no: Maybe different spending (cheaper retreat, staycation) hits the value better?

Values-aligned spending isn't wasteful. It's strategic.
```

---

## Implementation: The Coach API

### Backend Routes (Groq-powered)

**Route:** `/api/coach/analyze-transaction`
```typescript
POST /api/coach/analyze-transaction
{
  "transactionAmount": 1200,
  "description": "Assistive Tech Co - Software",
  "category": "business",
  "userContext": {
    "income_goal": 5000,
    "current_income": 4200,
    "energy_level": 60,
    "values": ["time with family", "financial security", "personal growth"]
  }
}

Response: {
  "classification": "Business Expense - Deductible",
  "tax_impact": "$300 savings (est.)",
  "four_currency_analysis": {
    "money": { impact: "positive", explanation: "..." },
    "time": { impact: "positive", explanation: "..." },
    "energy": { impact: "positive", explanation: "..." },
    "freedom": { impact: "positive", explanation: "..." }
  },
  "coaching_note": "This is a good trade. Monitor whether you save the 3-4h/week claimed."
}
```

**Route:** `/api/coach/calculate-freedom-score`
```typescript
POST /api/coach/calculate-freedom-score
{
  "weekly_hours": 42,
  "weekly_income": 1250,
  "income_goal": 5000,
  "energy_level": 70,
  "monthly_energy_trend": "improving",
  "values_alignment": "high"
}

Response: {
  "freedom_score": 6.2,
  "breakdown": { income: 6, energy: 7, time: 6.5, alignment: 8 },
  "trajectory": "improving",
  "coaching": "You're trending right. If you keep this pattern, you'll hit freedom 8/10 within 4 weeks."
}
```

**Route:** `/api/coach/scenario-analysis`
```typescript
POST /api/coach/scenario-analysis
{
  "scenario": "What if I worked 40 hours instead of 47?",
  "current": { hours: 47, income: 4200, energy: 55, freedom: 4 },
  "proposed": { hours: 40, income: 3600, energy: 70, freedom: 6 }
}

Response: {
  "analysis": {
    "money_impact": "-$600/month",
    "energy_impact": "+15 points",
    "freedom_impact": "+2 points",
    "sustainability": "Current path (47h, 55% energy) = 8-12 weeks to burnout"
  },
  "coaching": "You'd earn less but last longer. If you're running a marathon, this is smart."
}
```

---

## Voice Consistency

Every coach message follows Tina's patterns:

1. **Reframe the problem:** Not "you overspent," but "is this aligned with your values?"
2. **Show the systems thinking:** Numbers matter, but context matters more
3. **Ask questions:** Don't just tell, invite reflection
4. **Honor the struggle:** Acknowledge the real tension between income and sanity
5. **Point to freedom:** The outcome is always freedom, never just money

**Sample voice check:**
```
❌ DON'T SAY: "You spent $340 on dining. Budget was $300. Overage."
✅ DO SAY: "You spent $340 on dining. Most was solo meals. Are you stressed, or is this intentional recovery? Let's figure out what's happening."

❌ DON'T SAY: "Deductible expense: Yes. Tax impact: -$1,200."
✅ DO SAY: "This is deductible. More importantly, it should save you 3-4h/week. That's time back. That's freedom."

❌ DON'T SAY: "Work 40 hours, earn $3,600, freedom score 6/10."
✅ DO SAY: "Working less would give you back your energy. Your freedom score would jump. You'd sustain it longer. Worth the tradeoff?"
```

---

## Training the Coach (Using Groq)

**System prompt for Groq llama-3.3:**
```
You are a financial coach trained in Tina's Four Currencies framework.

Your job is to help people think about money in terms of:
1. Time (how many hours are they trading?)
2. Energy (can they sustain this? Or are they burning out?)
3. Money (do they have enough?)
4. Freedom (can they choose what matters?)

Reframe every financial question through these currencies.
Ask questions instead of giving orders.
Acknowledge the real tensions people face.
Always point toward freedom as the outcome.

If someone says "I made $1,200 this week," ask:
"Great. What did it cost you in time and energy? Is it sustainable?"

If someone asks "Should I spend $500 on coaching?" ask:
"Will it help you make more money, or help you make money more efficiently?
What's your return on investment in time and freedom?"

Never shame. Never just show numbers without context.
Always honor the complexity.
```

---

## Why This Matters

**Regular finance app:** "You spent $340 on dining. That's 10% over budget. Reduce it."  
**Finance Friend v3:** "You're stressed. You're spending on convenience instead of presence. Let's talk about what you actually need right now."

One treats symptoms (overspending).  
The other addresses roots (overwhelm, misalignment).

**Tina's voice:** The difference between a tool and a coach.

---

## Next Steps If Building v3 Phase 2

1. Test the coaching voice with real Tina conversations
2. Build the scenario analyzer (what if X, Y, Z?)
3. Add more coaching patterns (goal setting, tax planning, etc.)
4. Train Groq on Tina's actual methodology (use transcripts)
5. Launch as premium tier (this is the differentiator)

---

🏔️ Moriah

This is how you make a financial app people actually love instead of tolerate.
