# Finance Friend — Onboarding Flow

**Purpose:** Get beta users to "aha moment" in 5 minutes  
**Success Metric:** User uploads first statement and chats with coach  
**Owner:** Product (can implement in UI)

---

## The Onboarding Journey

### Principle
**Remove friction, add clarity.**

Every step answers: "Why am I doing this?" + "What happens next?"

---

## Step 1: Welcome (30 seconds)

### Screen: Personalized Welcome
```
"Hey Sarah 👋

Finance Friend helps you understand your money.
In 5 minutes, you'll see where you really spend.

Let's start."
```

### CTA: [Continue]

**Why this works:**
- Uses their name (personal)
- Clear promise (understand)
- Time commitment (5 minutes, not forever)
- Action-focused

---

## Step 2: Timezone (20 seconds)

### Screen: "What's your timezone?"
**Dropdown:** America/Adak, America/New_York, etc.

**Why:** Needed for dashboard times, energy tracking, budget calculations

### CTA: [Next]

---

## Step 3: Statement Upload (60 seconds)

### Screen: "Let's see your spending"

**Headline:** "Upload your first month of transactions"

**Options (in order of ease):**
1. **📱 Connect your bank** (Coming March) [Coming Soon]
   - Fast, automatic, updates weekly
   
2. **📄 Upload CSV/PDF** (Available now) [Active]
   - Download from your bank
   - Upload here
   - Takes 30 seconds
   
3. **📝 Type transactions** (for testing)
   - Manually add a few transactions
   - See how Finance Friend works

**Recommended:** "Most people choose CSV — it's quick and shows real patterns"

### CTA: [Upload] or [Skip for now]

**Why this matters:**
- Shows real data (not hypothetical)
- Multiple paths (different comfort levels)
- Not forcing (can skip, but recommending)

---

## Step 4: Upload Success (30 seconds)

### If They Uploaded:

**Screen: "Perfect! Found 47 transactions"**

```
Your last month:
💰 Spent: $2,800
📊 Categories: 12 different spending categories
🤔 What I notice: You spent more on dining than groceries

Ready to understand what this means?
```

### CTA: [See my dashboard] or [Chat with coach]

### If They Skipped:

**Screen: "Want to see how it works?"**

```
"Try it with sample data first, or upload your own later.

What would you prefer?"
```

Options:
- [Load sample data] → Show example dashboard
- [Upload my data] → Go back to step 3

---

## Step 5: Dashboard First Look (60 seconds)

### Screen: Dashboard Preview

**Shows (in order):**

1. **Your Spending at a Glance** (top)
   ```
   This Month: $2,800
   Last Month: $3,100
   
   ✅ You're on pace to spend less!
   ```

2. **Where Your Money Went** (pie chart/bar)
   ```
   Dining: $450 (16%)
   Groceries: $380 (14%)
   Transportation: $320 (11%)
   Other: $1,650 (59%)
   ```

3. **One Insight** (personalized)
   ```
   "You spent more on coffee this month than 
   usual. That's your biggest increase category."
   ```

### CTA: [Talk to your coach about this] or [Explore dashboard]

**Why this flow:**
- Immediate value (shows their real data)
- Pattern recognition (highlight one insight)
- Personal (addresses them specifically)
- Next step is clear (either explore more or get insights)

---

## Step 6: Meet Your Coach (120 seconds)

### Screen: Coach Interface

**Header:**
```
"Hi, I'm your Finance Friend Coach.
I noticed something about your spending.
Want to talk about it?"
```

**Pre-loaded Coach Questions** (pick one):

1. **"You spent $450 on dining this month. What's driving that?"**
   - Coach asks clarifying questions
   - Builds conversation
   - Shows they've analyzed the data

2. **"I see you have more energy on days you overspend. Interesting. Want to explore that?"**
   - Shows energy tracking potential
   - Makes it about freedom, not restriction

3. **"Your spending pattern shows discretion. Are you happy with how you're allocating?"**
   - Asks for intention
   - Opens dialogue

4. **"What's your biggest financial stress right now?"**
   - Freeform question
   - Gets real goals

### Interaction:
User types response → Coach provides insight based on data

### Coach Response Example:
```
User: "Yeah, I'm eating out way more. I've been working 
late and too tired to cook."

Coach: "Ah, so it's about energy, not just budgeting. 
This is exactly what we're designed to help with.

You spent $450 on food and logged low energy most 
evenings. What if we looked at time and energy 
together, not just the spending?

For now: What's one meal this week you could 
prep ahead so you don't rely on takeout?"
```

### CTA: [Answer] or [See different question]

**Why this works:**
- Shows AI capability (understands context)
- Addresses real problem (energy, not willpower)
- Provides actionable suggestion
- Feels like a conversation, not automation

---

## Step 7: Aha Moment (Natural)

### If User Engages Well:

**Coach Continues:**
```
"Here's what I'm seeing: You're not 'bad with money.' 
You're making smart trades—convenience for exhaustion relief.

The insight is: When your energy is low, you spend to solve it.

Two options:
1. Build in prep time (solves energy + spending)
2. Set a 'tired self' budget limit (prevents overspending)

Which resonates more with you?"
```

### This Triggers Aha Because:
- Reframes as a system (not personal failure)
- Connects to real life (energy, not just numbers)
- Offers agency (choice between solutions)
- Shows personalization (specific to their pattern)

---

## Step 8: Onboarding Complete (30 seconds)

### Screen: "You're all set!"

```
✅ Dashboard: See where you spend
✅ Coach: Ask questions, get insights
✅ Tax Classification: Track deductible expenses
✅ Budget Planning: Set goals aligned with your life

What would you like to do next?

[Continue chatting] [Explore dashboard] [Set goals]
```

**Context for later:**
- You can upload more statements anytime
- Your coach learns from your patterns
- Come back daily (or weekly) for new insights
- Invite a friend to compare spending patterns (coming soon)

### CTA: [Let's go]

**Typical flow time:** 5-7 minutes total

---

## Key Principles Applied

### Principle 1: Show Value Before Asking
- Not "fill out your profile"
- Not "confirm your email first"
- Straight to: "Here's your data analyzed"

### Principle 2: Make It Personal
- Use their name
- Reference their actual transactions
- Connect to their feelings (energy, freedom, intention)

### Principle 3: Reduce Cognitive Load
- One decision per screen
- Clear progress indication ("Step 3 of 7")
- No unnecessary info
- Mobile-optimized (larger buttons, readable text)

### Principle 4: Show Capability Early
- AI categorization (works)
- Pattern recognition (works)
- Natural conversation (works)
- Then introduce other features

### Principle 5: Offer Escape Valves
- "Skip for now" options
- "Try sample data"
- "See different question"
- Never force them forward

---

## UX Implementation Details

### Mobile Layout
```
Full-screen cards
Centered text
Large tap targets (44px+ buttons)
One action per card
```

### Loading States
```
"Processing your statements..." (animated)
"Finding patterns..." (animated)
"Thinking..." (for Coach responses)

< 2 second response time for good UX
```

### Error Handling

**If CSV upload fails:**
```
"Hmm, that didn't work. Common reasons:
- File format isn't supported
- Missing required columns

Try these banks' CSV format:
[Chase] [Bank of America] [Other...]

Or describe your spending, and I'll help."
```

**If Coach fails to respond:**
```
"I'm thinking about this... (usually instant)

While you wait, here's what I noticed:
[Show one insight]

Want to try a different question?"
```

---

## Onboarding Analytics to Track

**Success metrics:**
- [ ] % reaching dashboard (target: 95%)
- [ ] % uploading statement (target: 70%)
- [ ] % chatting with coach (target: 60%)
- [ ] Time to first interaction (target: < 5 min)
- [ ] NPS at end of onboarding (target: 8+/10)

**Funnel watch:**
- Where do people drop off?
- Which upload method preferred?
- Which coach question resonates most?
- Do people return in 7 days?

---

## Variations to Test

### For Self-Employed Users
Add earlier: "Do you mix personal + business spending?"
→ Show tax classification in onboarding

### For Debt-Heavy Users
Coach question: "What's your biggest financial stress?"
→ Leads to debt payoff discussion

### For Savers/Investors
Coach question: "What's your financial goal?"
→ Leads to Four Currencies discussion

---

## Success Stories in Onboarding

### Story 1: Sarah (Salaried)
```
Upload → Dashboard shows dining spike
Coach: "Tell me about this $450 on dining"
Sarah: "Ugh, I've been too tired to cook"
Coach: "[Insight about energy] What if you prepped Sunday?"
Sarah: "Oh! That makes sense."

Result: Aha moment, saves $300/month by solving energy problem
```

### Story 2: Marcus (Self-Employed)
```
Upload → Dashboard shows mixed business/personal
Coach: "I see business expenses mixed in. Show them separately?"
Marcus: "Yes! That's my biggest problem"
Coach: "[Explains tax classification] Which of these are business?"
Marcus: "That one, that one, and that one"

Result: Discovers $5K in missed deductions, excited about tax savings
```

### Story 3: Jordan (Stressed About Money)
```
Upload → Dashboard shows detailed breakdown
Coach: "You're spending on all the right things, just reactive vs. intentional"
Jordan: "So it's not bad, just unconscious?"
Coach: "[Explains Four Currencies] Let's make it intentional"
Jordan: [Sets goals] Feels hope for first time

Result: Engaged, daily user, tells friends
```

---

## Post-Onboarding Engagement

### Day 3 Push
```
Email: "Sarah, you found a great opportunity with your coffee spending. 
Here's what's trending this week."

What: Summary of patterns (don't overwhelm)
Why: Remind them of value
Goal: Daily active user
```

### Week 1 Re-engagement
```
Email: "You've saved $85 this week by prepping food. 
Want to set a bigger goal?"

What: Success story
Why: Motivation + next step
Goal: Set goals, unlock deeper features
```

### Month 1 Insights
```
Email: "Your energy is improving. So is your spending intentionality."

What: Four Currencies progress
Why: Show holistic benefit
Goal: Annual retention
```

---

## Onboarding Completion Signals

User has completed onboarding when:
- ✅ Uploaded first statement (or used sample data)
- ✅ Saw dashboard with categorized spending
- ✅ Had first conversation with coach
- ✅ Understood one key insight about their spending

At this point: Welcome email, first insights email, invite to community

---

## Failure Modes to Avoid

**DON'T:**
- ❌ Require email verification before starting
- ❌ Ask for credit card in onboarding
- ❌ Show incomplete features ("Coming soon...")
- ❌ Make them read long explanations
- ❌ Test their financial knowledge
- ❌ Use jargon (ARR, MRR, APR, etc.)
- ❌ Ask about every field upfront

**DO:**
- ✅ Get them to value immediately
- ✅ Explain as you go
- ✅ Celebrate small wins
- ✅ Offer help when confused
- ✅ Show real impact (their data, their insights)

---

## Ready to Implement

This onboarding flow is ready for:
1. **Design** (Figma wireframes)
2. **Frontend** (React component implementation)
3. **Backend** (Coach API, data flow)
4. **Testing** (with real beta users)

**Estimated build time:** 2-3 days  
**Estimated impact:** 40% increase in completion rate

---

**Author:** Moriah  
**Purpose:** Beta user success  
**Status:** Ready to implement  
**Timeline:** 2-3 weeks for full implementation
