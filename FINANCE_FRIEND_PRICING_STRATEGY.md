# Finance Friend — Pricing Strategy

**Purpose:** Define freemium model, revenue targets, and positioning  
**Audience:** Tina (decision maker), finance team (implementation)  
**Status:** Ready to implement

---

## Strategy Overview

**Core Thesis:**
- Free tier: Get users in, show value, prove product works
- Pro tier: Premium features for power users and self-employed
- Annual option: Align with Tina's teaching platform pricing
- No churn risk: Users own their data, can export anytime

---

## Pricing Tiers

### Tier 1: Finance Friend Free

**Price:** $0/month  
**Target:** Everyone  
**Goal:** Drive adoption, get feedback, build trust

**Features:**
- ✅ Dashboard (see where you spend)
- ✅ AI Coach (chat, get insights)
- ✅ Categorization (manual and automatic)
- ✅ Basic reports (monthly spending summary)
- ✅ Data export (CSV/JSON)
- Limit: 100 transactions/month

**Why this works:**
- Unlimited is unsustainable
- 100 transactions/month ≈ 3-5 transactions/day (normal user)
- Self-employed users hit limit → upgrade
- Casual users stay free (perfect)

**Upgrade trigger:**
"You've tracked 100 transactions this month. Keep going with Pro →"

---

### Tier 2: Finance Friend Pro

**Price:** $9.99/month OR $99/year  
**Target:** Self-employed, goal-oriented, power users  
**Goal:** Revenue from engaged users

**Features (Tier 1 + ):**
- ✅ Unlimited transactions
- ✅ Bank integration (when available)
- ✅ Tax classification & exports
- ✅ Time tracking
- ✅ Energy tracking with correlation analysis
- ✅ Budget planning & scenarios
- ✅ Multi-year history
- ✅ Custom categories
- ✅ Priority coach responses
- ✅ Weekly insights email

**Why this works:**
- Self-employed users NEED tax classification
- Power users want unlimited + more features
- $9.99/month is accessible (not the issue)
- $99/year alignment with annual teaching plans

**Monthly breakdown:**
- 1,000 pro users × $9.99 = $9,990/month
- 2,000 pro users × $9.99 = $19,980/month
- 5,000 pro users × $9.99 = $49,950/month

**Annual discount math:**
- Monthly: $119.88/year = $9.99 × 12
- Annual: $99/year = 17% discount
- Incentivizes commitment
- Simplifies cash flow

---

### Tier 3: Finance Friend Business (Future)

**Price:** $29.99/month  
**Target:** Small teams, accountants, financial advisors  
**Timeline:** 2026 Q3+

**Features (Pro +):**
- ✅ Multiple users
- ✅ Shared reports
- ✅ Accountant portal
- ✅ API access
- ✅ Custom integrations
- ✅ Team audit logs

**Why hold off:**
- Don't need this for beta
- Can add after Pro is working
- More complex to implement
- Wait for real demand signal

---

## Positioning Alignment

### vs. YNAB ($14.99/month)
**Finance Friend is cheaper** ✓
- $9.99 vs. $14.99
- More features (Coach AI, tax, energy)
- Less strict (goals vs. limits)

### vs. Wave ($0, but ad-supported)
**Finance Friend is cleaner** ✓
- Free tier available
- Better AI
- Personal + business integrated
- No ads (we trust you)

### vs. Copilot ($0 → freemium soon)
**Finance Friend is more personalized** ✓
- AI trained on Tina's philosophy
- Energy tracking (unique)
- Four Currencies view (unique)
- Better for behavioral change

---

## Revenue Projection

### Year 1 (Conservative)

**Assumptions:**
- Launch with 1,000 beta users (v2 + v3)
- 5% annual free → pro conversion
- 3% monthly churn (healthy for SaaS)
- Viral coefficient: 1.2 (each user brings 1.2 new users)

**Month-by-month:**
```
Jan: 50 paying users × $9.99 = $500/mo
Feb: 100 paying users × $9.99 = $1,000/mo
Mar: 150 paying users × $9.99 = $1,500/mo
Apr: 220 paying users × $9.99 = $2,200/mo
May: 300 paying users × $9.99 = $3,000/mo
Jun: 400 paying users × $9.99 = $4,000/mo
Jul: 520 paying users × $9.99 = $5,200/mo
Aug: 650 paying users × $9.99 = $6,500/mo
Sep: 800 paying users × $9.99 = $8,000/mo
Oct: 1,000 paying users × $9.99 = $10,000/mo
Nov: 1,200 paying users × $9.99 = $12,000/mo
Dec: 1,500 paying users × $9.99 = $15,000/mo

Year 1 Total: ~$69,000 MRR by end of year
Annual: ~$138,000
```

### Year 2 (Growth)

**Assumptions:**
- Double acquisition (bigger marketing)
- Reduce churn to 2% (product-market fit)
- Annual plan adoption: 40% of users
- Team tier launches: 5% of revenue

**Estimate:**
- End of Year 2: ~$50,000 MRR
- Annual run rate: ~$600,000

### Year 3 (Scale)

**Estimate:**
- ~$100,000 MRR
- Annual run rate: ~$1.2M
- Sustainable business

---

## Payment & Billing

### Stripe Integration
- Recurring billing (monthly/annual)
- Auto-renewal (with reminder emails)
- Easy cancellation (no phone calls)
- Refund policy: 30-day satisfaction guarantee

### Billing Strategy
```
User signs up → Free tier (automatic)
Hit limit → Upgrade prompt (email + in-app)
Upgrade → Stripe checkout (2 minutes)
Subscription → Auto-renewal (remind 7 days before)
Cancel → Easy toggle (email asking why)
```

### Payment Method
- Credit cards (primary)
- Apple Pay, Google Pay (for mobile)
- Future: Bank transfer for corporate

---

## Pricing Decision Points

### Question 1: Should beta users get lifetime free?
**NO (recommendation):**
- Creates unfair precedent
- Hard to transition to paid
- Better: Lifetime Pro discount (50% off)

**Why:**
- Beta users get value
- Shows we expect payment
- Easier to transition full price

### Question 2: Should there be annual discount?
**YES (recommendation):**
- 17% discount ($99 vs. $119.88)
- Incentivizes commitment
- Standard SaaS practice

### Question 3: Should Pro plan have limits?
**NO (recommendation):**
- Unlimited = happy users
- Volume is profitable enough
- Simplifies positioning

**Limits only on:**
- Free tier: 100 tx/month (upgrade trigger)
- API tier (future): Rate limits

### Question 4: Should pricing change in 2-3 months?
**MAYBE (consider):**
- Lock in early adopters
- "Founder pricing" expires after 1,000 users
- Example: First 1,000 users get $7.99/mo (locked)
- New users: $9.99/mo starting month 3

**Rationale:**
- Rewards early supporters
- Creates urgency to upgrade
- Increases perceived value

---

## Launch Plan

### Month 1: Launch at $9.99/month
- All beta users get free access through March
- April 1: Payment required
- No "founder pricing" initially (keep simple)

### Month 2-3: Gather feedback
- How many convert to paid?
- What features do paid users use most?
- Where do people churn?

### Month 4: Optimize
- Adjust tier limits if needed
- Add/remove features based on usage
- Plan for annual discount rollout

### Month 6: Review
- Y1 revenue target hit?
- Churn healthy?
- Time to scale marketing?

---

## Customer Segments & Pricing

### Segment 1: Anxious ($500/year)
- Feel out of control with money
- Want clarity + reassurance
- Features needed: Dashboard, Coach, Reports
- Pricing: Annual plan (save $20)

### Segment 2: Goal-oriented ($120/year)
- Have goals, struggling to execute
- Want accountability + tracking
- Features needed: Budgets, Goals, Time tracking
- Pricing: Monthly ok, some annual

### Segment 3: Self-employed ($120/year)
- Mix business + personal finances
- Obsessed with tax deductions
- Features needed: Tax classification, Exports
- Pricing: Annual (tax planning)

### Segment 4: Power users ($120/year)
- Want everything
- Use multiple features daily
- Features needed: Unlimited, Integrations, API
- Pricing: Annual (committed users)

**Insight:** All segments worth same price. Value ≠ usage.

---

## Preventing Churn

### Low-risk users (keep them free):
- Inactive (< 1 tx/week)
- Casual (learning phase)
- Price-sensitive
→ Free tier is perfect for them

### At-risk users (prevent churn):
- Downloaded data (thinking about leaving)
- Stopped posting (slipped away)
- Feedback negative
→ Reach out with value-add

### Committed users (expand):
- Daily active
- Used multiple features
- High engagement
→ Upsell optional features (future Team tier)

### Cancellation prevention:
- "Why are you leaving?" feedback
- Last-minute offer (not aggressive)
- "Come back" email after 30 days

---

## International Pricing

### Future consideration (not month 1):
**Should pricing be different by country?**

Examples:
- India: $2.99/month (PPP adjusted)
- Brazil: $6.99/month
- UK: £7.99/month
- US: $9.99/month

**Decision:** Start US-only, expand Q2 2026 if needed.

---

## Freemium Economics

### Unit Economics (Monthly)
```
Free User:
- AWS costs: $0.50
- API costs (OpenAI): $0 (limited usage)
- Support: $0.10
- Total: $0.60

Pro User:
- AWS costs: $2.00
- API costs (OpenAI Coach): $3.00
- Support: $1.00
- Processing fees (2.9%): $0.30
- Total: $6.30

Revenue: $9.99
Gross Margin: ($9.99 - $6.30) / $9.99 = 37%
```

**Is 37% margin good?**
✅ Yes (SaaS target is 70%+, but we're API-heavy)
→ Optimize by:
- Reducing OpenAI costs (cache responses)
- Scaling AWS efficiency
- Smart support (automation)

---

## Communicating Price Changes

### If we raise prices in future:
```
Email to existing customers:
"Finance Friend is getting better.
We're adding [feature] and improving [performance].

Current users keep $9.99/mo (locked in)
New users: $12.99/mo starting next month

This helps us keep building for you. Thanks for being here."
```

**Why this works:**
- Grandfather existing (perceived fairness)
- New price justified (value added)
- Creates urgency (join while grandfathered)

---

## Success Metrics

### Track these monthly:
- [ ] Free user count
- [ ] Pro user count
- [ ] Monthly recurring revenue (MRR)
- [ ] Churn rate (target: < 5%)
- [ ] Net revenue retention (target: > 100%)
- [ ] Cost per user acquisition
- [ ] Lifetime value (LTV)
- [ ] LTV:CAC ratio (target: > 3:1)

### Benchmarks:
- Day 30 conversion (free → pro): 5%+
- Month 3 conversion: 7%+
- Month 6 conversion: 10%+
- Annual plan adoption: 30%+

---

## Ready to Launch

**Pricing is approved and ready to implement:**
1. ✅ Tier definitions clear
2. ✅ Revenue model sustainable
3. ✅ Customer segments identified
4. ✅ Payment integration (Stripe)
5. ✅ Success metrics defined

**Next steps:**
1. Set up Stripe account
2. Configure subscription plans
3. Design upgrade flow UI
4. Test payment flow
5. Write billing help docs

---

**Author:** Moriah  
**Purpose:** Revenue strategy  
**Status:** Ready to implement  
**Timeline:** 1 week for full payment integration
