# Finance Friend v3 — UI/UX Mockups & Specifications

**Created by:** Moriah  
**Date:** March 21, 2026  
**Purpose:** Visual design + interaction specs for v3 frontend

---

## 🎨 Color & Typography System (Inherited from v2, Refined)

```css
:root {
  /* Core brand colors (v2) */
  --navy: #1a2e5a;
  --navy-mid: #243f7a;
  --navy-light: #3a5a9a;
  --navy-pale: #eef2fa;
  --text: #1e2d4a;
  --muted: #6b7fa8;
  
  /* NEW: Currency indicators */
  --currency-money: #2d7a4f;    /* Green */
  --currency-time: #e67e22;     /* Orange */
  --currency-energy: #f39c12;   /* Gold */
  --currency-freedom: #8e44ad;  /* Purple */
  
  /* Status indicators */
  --status-good: #27ae60;
  --status-warning: #e74c3c;
  --status-neutral: #95a5a6;
  
  /* Fonts */
  --font-serif: Georgia, 'Times New Roman', serif;
  --font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
```

---

## 📱 Page 1: Dashboard (Main View)

### Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│  Finance Friend                        [Dashboard] [Coach]   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Welcome back, Sarah Chen                                  │
│  Last updated: Today 10:34 AM                              │
│                                                             │
│ ┌─ THIS WEEK ──────────────────────────────────────────────┐
│ │                                                          │
│ │  Four Currencies Status                                 │
│ │                                                          │
│ │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐     │
│ │  │ 💰 Money     │ │ ⏱️ Time      │ │ ⚡ Energy     │     │
│ │  │              │ │              │ │              │     │
│ │  │ $3,450       │ │ 38h          │ │ 72%          │     │
│ │  │ ▲ +$320 (10%)│ │ ▼ -4h (9%)  │ │ ▲ +8% (12%)  │     │
│ │  │ vs last wk   │ │ vs goal     │ │ vs avg      │     │
│ │  │              │ │              │ │              │     │
│ │  │ On track ✓   │ │ Ahead ✓     │ │ Good ✓      │     │
│ │  └──────────────┘ └──────────────┘ └──────────────┘     │
│ │                                                          │
│ │  🕊️ Freedom Score: 7.1/10  ▲ +0.5 (improving!)          │
│ │                                                          │
│ │  What's driving your freedom?                          │
│ │  • You worked fewer hours (-4h) ✓                       │
│ │  • Your energy improved (+8%) ✓                         │
│ │  • You earned more money (+$320) ✓                      │
│ │  • Your principles alignment: 8/10 (excellent)         │
│ │                                                          │
│ └──────────────────────────────────────────────────────────┘
│                                                             │
│ ┌─ INSIGHTS ───────────────────────────────────────────────┐
│ │                                                          │
│ │ 📊 AI Insights (this week)                              │
│ │                                                          │
│ │ ✓ Tax-deductible expenses identified: $340              │
│ │   Home office (25 days), coffee meetings (3x)           │
│ │   → Save ~$102 at tax time                              │
│ │                                                          │
│ │ ⚠ Spending pattern: +$1,200 on Wednesday               │
│ │   This correlates with your energy drop. Emotional      │
│ │   spending? Consider scheduling your admin work.        │
│ │                                                          │
│ │ 💡 Opportunity: Your billable rate is $85/hr but you're │
│ │   spending 8h/week on non-billable tasks. At $68/hr     │
│ │   cost, that's $544/week. Outsource?                    │
│ │                                                          │
│ │ [Learn More]  [Archive]  [Ask Coach]                    │
│ │                                                          │
│ └──────────────────────────────────────────────────────────┘
│                                                             │
│ ┌─ QUICK ACTIONS ──────────────────────────────────────────┐
│ │                                                          │
│ │ [+ Log Time Entry]  [+ Log Energy]  [View Budget]       │
│ │ [+ Upload Statement]  [Tax Center]  [Reconcile]        │
│ │                                                          │
│ └──────────────────────────────────────────────────────────┘
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Interactive Elements

**Currency Cards (Clickable):**
- Click 💰 Money → View transactions, category breakdown, income vs expenses
- Click ⏱️ Time → Calendar view of time entries, hourly analysis
- Click ⚡ Energy → Weekly energy patterns, correlation with spending
- Click 🕊️ Freedom → Breakdown of what's driving freedom score

**Insights (Smart Feed):**
- Each insight card is actionable
- "Ask Coach" button opens coached conversation about that topic
- "Learn More" links to educational content

---

## 📊 Page 2: Coaching (New)

### Layout

```
┌─────────────────────────────────────────────────────────────┐
│  Finance Friend                   [Dashboard] [Coach] ●      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  💬 Your Finance Coach                                     │
│                                                             │
│  Coach Tina's Principles:                                 │
│  1. Principles inform priorities                          │
│  2. All currencies matter                                 │
│  3. Systems beat willpower                                │
│  4. Leverage beats effort                                 │
│                                                             │
│ ┌─ CONVERSATION ───────────────────────────────────────────┐
│ │                                                          │
│ │ Coach: You worked 40h this week but only earned          │
│ │ $2,800. That's $70/hour. Meanwhile, you're spending     │
│ │ $1,200 on BNPL (Afterpay, Klarna).                       │
│ │                                                          │
│ │ This tells me something: You don't feel secure in       │
│ │ your income, so you're spending on feel-good items.     │
│ │ Is that right?                                          │
│ │                                                          │
│ │                                                [9:34 AM] │
│ │                                                          │
│ │ You: Yeah, that's fair. How do I stop?                 │
│ │                                                [9:35 AM] │
│ │                                                          │
│ │ Coach: First, let's check your principles. What do      │
│ │ you actually value? Because your spending says         │
│ │ "immediate comfort" but your hourly rate says           │
│ │ "I need to stay focused."                               │
│ │                                                          │
│ │ When you make $70/hour, every $10 spent on BNPL is     │
│ │ ~8 minutes of your life. Is that trade fair?           │
│ │                                                [9:36 AM] │
│ │                                                          │
│ └──────────────────────────────────────────────────────────┘
│                                                             │
│  [Message input field...]                                 │
│                                                             │
│  Suggested topics:                                        │
│  [Budget Planning] [Tax Questions] [Time Optimization]    │
│  [Energy Management] [Goal Alignment]                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Coach Behavior

- **Voice:** Uses Tina's exact phrases and frameworks from her teaching
- **Context awareness:** References user's actual transactions, hours, energy levels
- **Principles-first:** Every suggestion ties back to principles
- **Questions over answers:** Coaches by asking, not telling
- **Transparency:** Shows calculations (e.g., "40h at $70/hr = $2,800 - $200 in BNPL = $2,600 for you")

---

## 📅 Page 3: Budget Scenarios (New)

### Layout

```
┌─────────────────────────────────────────────────────────────┐
│  Finance Friend                 [Dashboard] [Coach] [Budget] │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  My Financial Goal: Earn $5K/mo in 40h/week feeling easy  │
│                                                             │
│  Current Reality (March 2026)                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ 💰 $3,450/mo  (need +$1,550)                         │  │
│  │ ⏱️  38h/week  (need -2h)                             │  │
│  │ ⚡ 72% energy (need 75%+)                            │  │
│  │ 🕊️ 7.1/10 freedom (need 8+)                         │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  Compare Scenarios:                                        │
│                                                             │
│  Scenario A: Raise Prices (10% increase)                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ 💰 $3,795/mo  (▲ +$345, still -$1,205)              │  │
│  │ ⏱️  38h/week  (no change)                            │  │
│  │ ⚡ 72% energy (no change)                            │  │
│  │ 🕊️ 7.1/10 freedom (no change)                       │  │
│  │                                                      │  │
│  │ Tradeoff: Easy to implement but doesn't solve        │  │
│  │ the core problem. Raising prices assumes demand     │  │
│  │ is elastic. Test with 3-5 clients first.            │  │
│  │                                                      │  │
│  │ Score: 4/10 (partial solution)                      │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  Scenario B: Hire Admin Support ($600/mo cost)            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ 💰 $4,100/mo (gross: $4,700 - $600 support)         │  │
│  │ ⏱️  30h/week (▼ -8h freed for billable work)        │  │
│  │ ⚡ 85% energy (▲ +13%, less context switching)      │  │
│  │ 🕊️ 8.2/10 freedom (▲ +1.1, breathing room!)       │  │
│  │                                                      │  │
│  │ Tradeoff: Costs $600/mo but frees 40h/mo for       │  │
│  │ billable work worth ~$2,800/mo potential. ROI:     │  │
│  │ 365% in year 1 if you actually use the freed time. │  │
│  │                                                      │  │
│  │ Risk: You must actually charge for the freed time.  │  │
│  │                                                      │  │
│  │ Score: 8/10 (high impact, manageable risk)         │  │
│  │                                                      │  │
│  │ [Choose This Scenario]                             │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  Scenario C: Combination (Raise prices + Support)         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ 💰 $5,100/mo (gross: $5,700 - $600 support)         │  │
│  │ ⏱️  30h/week (▼ -8h)                                │  │
│  │ ⚡ 85% energy (▲ +13%)                              │  │
│  │ 🕊️ 8.8/10 freedom (▲ +1.7, relaxed!)              │  │
│  │                                                      │  │
│  │ Tradeoff: Requires execution on TWO fronts (price  │  │
│  │ increase + hiring). More risk but maximum upside.  │  │
│  │                                                      │  │
│  │ Success probability: 65% (IF you commit)           │  │
│  │ Payoff: You hit your goal + exceed freedom target  │  │
│  │                                                      │  │
│  │ Score: 9/10 (optimal but requires discipline)      │  │
│  │                                                      │  │
│  │ [Choose This Scenario]                             │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  [Ask Coach About These] [Simulate My Own]               │  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Scenario Engine

- **Inputs:** Target money, hours, energy, freedom scores
- **AI modeling:** Claude analyzes tradeoffs, computes impact
- **Scoring:** 1-10 based on feasibility + impact
- **Tracking:** User picks a scenario, system tracks progress weekly

---

## 🏦 Page 4: Tax Center (New)

### Layout

```
┌─────────────────────────────────────────────────────────────┐
│  Finance Friend              [Dashboard] [Coach] [Tax]      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  💼 Tax Classification Center                              │
│                                                             │
│  Quarterly Status (Q1 2026)                                │
│  ├─ Total deductions claimed: $1,240                      │
│  ├─ Confidence: 92% (needs review)                        │
│  ├─ Estimated tax savings: $372 (at 30% rate)            │
│  └─ [Generate Tax Report]                                 │
│                                                             │
│  ┌─ TRANSACTIONS NEEDING REVIEW ────────────────────────┐  │
│  │                                                      │  │
│  │ Mar 15 | $85.22 | Zoom | Videoconference software  │  │
│  │ ML Score: 89% deductible (office tools)             │  │
│  │ [✓ Approve]  [✗ Reject]  [?? Manual review]        │  │
│  │                                                      │  │
│  │ Mar 10 | $156.00 | Coffee Shop | Lunch              │  │
│  │ ML Score: 42% deductible (client meeting?)          │  │
│  │ Question: Was this a business meeting?              │  │
│  │ [✓ Approve]  [✗ Reject]  [?? Manual review]        │  │
│  │ (Note: Add description to increase confidence)      │  │
│  │                                                      │  │
│  │ Mar 8 | $340.00 | Amazon | Desk chair              │  │
│  │ ML Score: 95% deductible (office equipment)         │  │
│  │ [✓ Approve]  [✗ Reject]  [?? Manual review]        │  │
│  │                                                      │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌─ BY CATEGORY ────────────────────────────────────────┐  │
│  │                                                      │  │
│  │ Office Equipment        $725      ✅ Ready to claim │  │
│  │ Office Software         $340      ✅ Ready to claim │  │
│  │ Professional Services   $125      ⚠️  Pending      │  │
│  │ Home Office (utilities) $150      🔍 Review        │  │
│  │ Meals & Entertainment   $340      ⚠️  Needs detail  │  │
│  │ Education & Training    $200      ✅ Ready to claim │  │
│  │                                                      │  │
│  │ Total Estimated Deductions: $1,880                  │  │
│  │ Tax Savings (30% marginal): $564                    │  │
│  │                                                      │  │
│  │ [Export for CPA]  [Download CSV]  [Email to Tax SW] │  │
│  │                                                      │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                             │
│  Quarterly Estimated Tax: $425/quarter ($1,700/year)      │
│  Next payment due: April 15                               │
│  [Set Reminder]  [Calculate for Next Quarter]            │  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 Page 5: Bank Reconciliation (Simplified)

### Layout

```
┌─────────────────────────────────────────────────────────────┐
│  Finance Friend           [Dashboard] [Coach] [Reconcile]    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  🏦 Bank Reconciliation                                    │
│                                                             │
│  Last reconciliation: Mar 15, 2026 (6 days ago)           │
│  Status: ✅ In balance                                     │
│                                                             │
│  ┌─ NEW STATEMENTS READY ───────────────────────────────┐  │
│  │                                                      │  │
│  │ Chase Checking (Mar 1-31)                           │  │
│  │ • Transactions to match: 47                         │  │
│  │ • Estimated time: 2-3 minutes                       │  │
│  │ [Start Reconciliation]                              │  │
│  │                                                      │  │
│  │ American Express (Mar 1-31)                         │  │
│  │ • Transactions to match: 23                         │  │
│  │ • Estimated time: 1-2 minutes                       │  │
│  │ [Start Reconciliation]                              │  │
│  │                                                      │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  Historical Reconciliations:                              │
│  ├─ Feb 28, 2026: ✅ Complete (23 discrepancies)          │
│  ├─ Jan 31, 2026: ✅ Complete (0 discrepancies)           │
│  └─ Dec 31, 2025: ✅ Complete (2 discrepancies)           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎬 Interaction Flows

### Flow 1: First-Time Login

```
User visits → Sign up/Login → Connect bank (Plaid)
  ↓
Set financial goal (e.g., "Make $5K/mo in 40h/week feeling relaxed")
  ↓
Pick principles (from Tina's 10 fundamentals)
  ↓
Set time/energy/money/freedom targets
  ↓
Upload first statement
  ↓
Dashboard populated with sample insights
  ↓
Coach introduces self
```

### Flow 2: Weekly Check-In (Autonomous)

```
User returns Monday morning
  ↓
Dashboard shows weekly summary
  ↓
Coach: "Hi Sarah, you worked 38h this week. Energy 72%. Money +$320. 
         Your freedom score improved to 7.1/10. Want to talk about 
         why energy dropped Wednesday?"
  ↓
User engages in coached conversation
  ↓
Insights surface (tax opportunities, patterns, etc.)
```

### Flow 3: Decision Making (Budget Scenario)

```
User says: "I want to reach $5K/mo"
  ↓
Coach asks clarifying questions
  ↓
Generate 3-5 scenarios with tradeoffs
  ↓
User picks one (usually the one with best freedom score)
  ↓
System tracks execution against that scenario
  ↓
Weekly coaching updates on progress
```

---

## 🏔️ Implementation Notes

1. **Dashboard is the hero** — All data visualized in one screen
2. **Coach is context-aware** — References actual user data, not generic advice
3. **Scenarios are actionable** — Not just "what if" but "here's how to execute"
4. **Tax is simplified** — Reduce CPA/Software friction (user's pain point)
5. **Mobile-first** — Works on phone (busy entrepreneurs don't use desktop)
6. **Dark mode option** — Respect user preference (reduce energy if needed)

---

**Built by Moriah** for product-ready Finance Friend v3.

