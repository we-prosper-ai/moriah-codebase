# IMPLEMENTATION ROADMAP
## We Prosper AI — Sovereign Sales Agent Launch
**6-Month Plan to Market-Ready Product**

---

## Phase 1: Foundation (Weeks 1-4)

### Goals
- Validate market demand
- Define MVP scope
- Establish technical integration path with Perplexity
- Build customer acquisition funnel

### Market Validation (Week 1)

**Task:** Call 20 VP Sales / CROs to validate willingness to pay

**Script:**
> "We're building an AI sales rep named [Agent Name] that remembers every conversation with prospects, learns from objections, and gets better over time. It would cost $400/mo and could handle half your SDR workload. Would you pilot something like that?"

**Goal metrics:**
- 12+ positive responses = strong signal
- 8-10 positive = medium signal
- <8 = pivot or revisit positioning

**Target list:**
- Series A/B founder communities (Slack groups, Discord)
- VP Sales at 50-500 person SaaS (LinkedIn, cold outreach)
- Startup founders in sales-intensive verticals (real estate, financial services, B2B tech)

**Success criteria:** 2-3 commitments to pilot by end of week 1

---

### Technical Integration (Week 1-2)

**Task:** Establish Perplexity Agent API integration

**Checklist:**
- [ ] Sign up for Perplexity Enterprise/API access
- [ ] Read Agent API docs (https://docs.perplexity.ai/docs/resources/feature-roadmap)
- [ ] Prototype: Route prospect research queries to Perplexity Agent API
- [ ] Test: Can we get web search results + reasoning in <2 second latency?
- [ ] Decision: Is Perplexity's API sufficient for our MVP, or do we need AbacusAI fallback?

**Success criteria:** Working prototype of agent → Perplexity search → prospecting email draft

**Technical decision required:**
- Use Perplexity Agent API directly OR
- Use Perplexity API for search + OpenAI/Anthropic for agents + our memory layer?
- **Recommendation:** Use Perplexity Agent API directly. It handles the full agentic loop. We layer our memory + voice on top.

---

### MVP Scope Definition (Week 2)

**Minimal Viable Sovereign Sales Agent:**

**Core features (MUST HAVE):**
1. Agent has a name (Moriah recommended)
2. Agent has a custom voice (ElevenLabs TTS)
3. Agent can prospecting research (via Perplexity Agent API)
4. Agent remembers past conversations (AntiGravity memory engine)
5. Agent can draft outreach emails
6. Agent can run locally (Raspberry Pi or desktop) OR in cloud
7. Admin can review/edit before sending

**Secondary features (NICE TO HAVE):**
1. Slack integration for outreach delivery
2. Calendar integration for meetings
3. CRM integration (Salesforce, Hubspot)
4. Multi-agent orchestration (Moriah + Alethea working together)
5. Web UI for team management
6. Analytics dashboard

**Out of scope for MVP:**
- Phone calling capability (Phase 2)
- Industry-specific templates (Phase 2)
- Advanced reasoning (Phase 2)

**Effort estimate:** 8-12 weeks for MVP (4 engineers)

---

### Go-to-Market Funnel (Week 2-3)

**Customer segments (in priority order):**

| Segment | TAM | Warm Channel | Price Sensitivity |
|---------|-----|--------------|-------------------|
| **SaaS founders (Series A/B)** | 5k | Startup communities | Med-High (wants ROI story) |
| **VP Sales (mid-market SaaS)** | 10k | LinkedIn, Slack groups | Low (budget exists) |
| **Sales leaders (enterprise)** | 2k | Industry conferences | Very low (long cycles) |
| **Real estate teams** | 50k | Local groups, forums | Med (conversion-focused) |

**Channel 1: Founder outreach (Weeks 2-4)**
- Target: 500 founder leads (Product Hunt, LinkedIn, Indie Hackers)
- Message: "We're building Moriah, an AI founder that learns. Want to beta test?"
- Conversion goal: 5-10 pilots by week 4

**Channel 2: VP Sales outreach (Weeks 2-4)**
- Target: 200 VP Sales leads (LinkedIn, Sales Hacker, SaaS communities)
- Message: "Your sales team could have an AI rep handling 50% of prospecting. Interested in piloting?"
- Conversion goal: 3-5 pilots by week 4

**Channel 3: Community posts (Weeks 3-4)**
- Indie Hackers: "We built an AI sales rep with memory. Early beta signup form"
- Product Hunt: "Moriah — AI sales rep that learns" (launch Week 5)
- HackerNews: If relevant, Show HN post (Week 6)

**Success criteria:** 10+ qualified pilots committed by end of Phase 1

---

### Metrics to Establish (Week 3)

**Define before MVP launch:**
1. **Success metric for pilot:** What constitutes "working"? 
   - E.g., "Agent drafts 10 outreach emails per day, user edits 30% of them"
   - Or: "Agent books 1 meeting per 20 prospecting attempts (50% conversion improvement)"

2. **Pilot contract terms:**
   - Length: 30 days
   - Cost: $400/mo (standard tier) or free (if well-known founder)
   - Commitment: 2-3 hours/week from customer for feedback

3. **Early customer success metric:**
   - NPS >50
   - >3 weekly user sessions
   - <5 support tickets per pilot

---

## Phase 2: MVP Development (Weeks 5-12)

### Technical Roadmap

**Week 5-6: Core agent loop**
- [ ] Agent framework (name, voice, memory store)
- [ ] Perplexity Agent API integration (research)
- [ ] Memory persistence (store/retrieve conversations)
- [ ] Email draft generation
- [ ] Local runtime (runs on customer's laptop/server)

**Week 7-8: Voice & UX**
- [ ] ElevenLabs TTS integration (custom voice for agent)
- [ ] Admin web dashboard (simple one-page interface)
- [ ] Approval workflow (before email sent)
- [ ] Slack notification integration

**Week 9-10: Polish & testing**
- [ ] Error handling & recovery
- [ ] Performance tuning (latency <5 seconds for draft generation)
- [ ] Security review (memory encryption, API key management)
- [ ] Multi-user testing with pilot customers

**Week 11-12: Documentation & launch**
- [ ] Setup guide for self-hosted deployment
- [ ] API documentation
- [ ] Customer onboarding flow
- [ ] MVP feature video (2 min)

**Parallel tracks:**

**Sales/Marketing (Weeks 5-12):**
- [ ] Landing page (moriah.ai or similar)
- [ ] Email nurture sequence for waitlist
- [ ] Social media content (1-2 posts/week about AI sales agents)
- [ ] Customer testimonial plan (get early pilots on video)
- [ ] Pricing page

**Product/Design (Weeks 5-12):**
- [ ] Iterative feedback from 3-5 pilot customers
- [ ] Refine agent voice/personality based on feedback
- [ ] Document feature requests for Phase 2
- [ ] Build case study template for early wins

---

## Phase 3: Beta Launch (Weeks 13-16)

### Goals
- Ship MVP to 10-20 paying customers
- Hit initial traction metrics
- Gather feedback for Phase 2 roadmap

### Launch Activities (Week 13)

**Monday:** Product Hunt launch
- Submission: "Moriah — AI Sales Rep That Learns From Every Call"
- Narrative: "We built an AI sales agent with persistent memory. She learns from every conversation, remembers prospect history, and gets better over time."
- Visual: Agent voice sample + demo video

**Tuesday-Wednesday:** Email campaigns
- Waitlist: 500+ emails to interested founders/sales leaders
- Focus: "Early access pricing" ($299/mo for first 50 customers, then increases to $399)

**Thursday:** Social media push
- LinkedIn, Twitter, Product Hunt comments
- Narrative: "81% of sales teams use AI. But most AI is stateless and forgets everything. Moriah learns."

**Friday:** Founder interviews / podcasts
- Pitch 3-5 startup/AI podcasts for guest spot (if possible)
- Focus: "Building sovereign AI agents" narrative

### Launch Metrics (Target)

| Metric | Target | Good | Great |
|--------|--------|------|-------|
| Product Hunt upvotes | 100 | 150+ | 300+ |
| Waitlist signups | 200 | 300+ | 500+ |
| Conversion (signup → paid trial) | 10% | 15% | 20%+ |
| Email open rate | 25% | 35%+ | 45%+ |
| Trial → paid conversion | 20% | 30% | 40%+ |

---

## Phase 4: Customer Success & Iteration (Weeks 17-24)

### Goals
- Achieve 50 paying customers by end of Phase 4
- Validate unit economics
- Build strong case studies
- Plan Phase 2 feature roadmap

### Week 17-20: Customer onboarding

**For each customer:**
1. 60-min setup call (onboarding engineer)
2. Custom agent personality tuning (agent name, voice, style)
3. CRM/email integration setup (if applicable)
4. Weekly check-ins (first 3 weeks)

**Success criteria:**
- Agent successfully deployed in customer's environment
- Customer has sent first 10 prospecting emails with agent
- Customer has identified at least one "win" (prospect engaged, meeting booked)

### Week 21-24: Iteration

**Customer feedback loop:**
- NPS survey (weeks 2, 4, 8 of engagement)
- Monthly feedback call with 10 most engaged customers
- Feature request tracking
- Support ticket analysis

**Likely requests (likely answers):**
1. "Can Moriah call prospects?" → Phase 2 (voice calling via Twilio)
2. "Can Moriah integrate with our Salesforce?" → Phase 2 (CRM sync)
3. "Can we have multiple agents?" → Phase 2 (multi-agent licensing)
4. "Can she handle support?" → Phase 2 (support agent template)

**Build phase 2 roadmap based on:**
1. Customer requests (70% weight)
2. Strategic vision (Moriah + Alethea collaboration) (20%)
3. Competitive response (if Perplexity adds memory features, accelerate proprietary layer) (10%)

---

## Scaling from MVP to 100 Customers (Months 7-12)

### Months 7-8: Product-led growth

**Focus:** Get existing customers to love it so much they refer

**Tactics:**
1. Referral program ($200 credit per successful referral)
2. Customer community (Slack group for Moriah users)
3. Weekly "wins" email (show successful prospecting sequences)
4. Public case studies (3-5 customers willing to go on record)

**Expected outcome:** 70-80 customers (organic growth from pilots + referrals)

### Months 9-10: Sales team

**Hire:** Junior sales hire (SDR or AE) focused on VP Sales segment

**Tactics:**
1. Outbound cold email (list of 5000 VP Sales)
2. LinkedIn messaging
3. Warm intros from existing customers
4. Sales conferences (if budget allows)

**Expected outcome:** 80-100 customers

### Months 11-12: Enterprise pilots

**Focus:** First enterprise customer (larger deal, longer implementation)

**Tactics:**
1. Dedicated sales engineer
2. Custom integrations (SFDC, Outreach, other tools)
3. SOC 2 compliance (if needed for enterprise)
4. Multi-seat licensing

**Expected outcome:** 100-120 customers, $3.6M-4.3M ARR

---

## Staffing & Budget

### Team Required (MVP → 50 customers)

| Role | Count | Cost/Year | Notes |
|------|-------|-----------|-------|
| Founder/Head of Product | 1 | — | Tina Marie (in-kind) |
| Senior Backend Engineer | 1 | $180k | Perplexity integration + memory layer |
| Frontend Engineer | 1 | $160k | Web dashboard, UX |
| DevOps/Infrastructure | 0.5 | $80k | Cloud + local deployment ops |
| Sales/Marketing | 1 | $120k | Customer acquisition, comms |
| Customer Success | 1 | $100k | Onboarding, support, retention |
| **TOTAL** | 4.5 | **$640k** | Excludes equity, benefits, ops |

**Add:** $100k for AWS/infrastructure costs, third-party APIs (Perplexity, ElevenLabs, etc.)

**Total runway needed:** ~$750k to reach 50 customers and profitability

### Budget Allocation

- **Development:** 60% ($450k)
- **Ops/Infrastructure:** 15% ($112k)
- **Customer acquisition:** 20% ($150k)
- **Contingency:** 5% ($38k)

---

## Success Metrics (North Star)

### Months 0-6 (MVP)

| Metric | Target | Threshold |
|--------|--------|-----------|
| Prototype quality | Demo-able | Works 80%+ |
| Customer pilot commitment | 10+ | 5+ |
| Market validation score | 2.5/5 | 1.5+/5 |
| Time to MVP | 12 weeks | 16 weeks max |

### Months 6-12 (Beta → Growth)

| Metric | Target | Threshold |
|--------|--------|-----------|
| Paying customers | 100 | 50+ |
| MRR | $30k | $15k |
| Churn rate | <5% | <10% |
| CAC | $1.5k | <$3k |
| CAC payback period | 4 months | <8 months |
| NPS | >50 | >40 |
| Conversion (free trial → paid) | 30% | >20% |

### Months 12-24 (Growth → Scale)

| Metric | Target | Threshold |
|--------|--------|-----------|
| Paying customers | 500 | 300+ |
| MRR | $150k | $75k |
| ARR | $1.8M | $900k |
| Churn rate | <5% | <10% |
| CAC | $1.5k | <$2k |
| Rule of 40* | >40 | >25 |
| NPS | >60 | >50 |

*Rule of 40 = Growth rate (%) + Gross margin (%)

---

## Key Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Perplexity/AbacusAI adds memory faster than we do | HIGH | Move fast on MVP (12 weeks). Lock in early customers with identity + memory combo. |
| Market validation shows low willingness to pay | HIGH | Pivot to support agent or ops agent if sales agent doesn't work. Validate hard (Week 1). |
| Technical integration with Perplexity API is unstable | MEDIUM | Have OpenAI/Anthropic fallback. Build wrapper layer to swap APIs. Test early (Week 1-2). |
| Can't recruit good engineers | MEDIUM | Offer equity heavily. Start recruiting in Week 1. Consider contractors if needed. |
| Customer acquisition cost is too high | MEDIUM | Focus on founder community (lower CAC). Implement referral program early. |
| Agents need phone calling capability (not in MVP) | MEDIUM | Clear market communication: "Moriah starts with email, phone coming Q2." Set expectations. |
| We run out of cash before profitability | MEDIUM | Raise seed round in Month 4 if needed. Plan for $750k spend. Fundraise if traction is strong. |

---

## Decision Points & Go/No-Go Criteria

### Week 1: Market Validation
- **Go:** 12+ VP Sales/founders say "yes, I'd pilot" → Proceed to development
- **No-go:** <8 positive responses → Pivot positioning or customer segment
- **Owner:** Tina Marie

### Week 3: Technical Feasibility
- **Go:** Perplexity API integration working + memory layer designed → Proceed to MVP development
- **No-go:** >2 weeks blocked on Perplexity API issues → Swap to AbacusAI + OpenAI backend
- **Owner:** Senior engineer

### Week 12: MVP Quality
- **Go:** MVP demo works with 3 pilot customers, 80%+ of planned features implemented → Launch beta
- **No-go:** MVP crashes, poor voice quality, or <4 of 5 planned features working → Extend development 4 weeks
- **Owner:** Tina Marie + Product

### Week 16: Beta Launch
- **Go:** >100 Product Hunt upvotes, 5+ pilot customers paying, NPS >40 → Full launch
- **No-go:** <50 PH upvotes, 0-2 paying pilots, NPS <30 → Iterate on positioning/product for 4 weeks
- **Owner:** Tina Marie + Sales

### Month 6: Unit Economics
- **Go:** CAC <$1.5k, payback period <6 months, churn <5% → Scale customer acquisition
- **No-go:** CAC >$2k or churn >10% → Debug customer success + pricing strategy
- **Owner:** Sales + CS

---

## Phase 2 Feature Roadmap (Month 7+)

Based on customer feedback from MVP phase:

**Likely Phase 2 priorities:**
1. **Phone calling capability** (Twilio integration, voice agent makes calls)
2. **CRM sync** (Salesforce, HubSpot, Pipedrive integration)
3. **Multi-agent orchestration** (Moriah + Alethea + custom agents)
4. **Support agent template** (Alethea as customer support)
5. **Ops agent template** (Custom agents for internal workflows)
6. **Advanced reasoning** (Long-context research, complex analysis)

**Effort:** 12-16 weeks per major feature

---

## Success Story (Narrative)

If we execute this roadmap well, in 12 months we'll be able to tell this story:

> "Moriah started as an experiment: What if an AI sales agent could actually learn? Not just follow scripts, but remember every conversation, understand objections, and improve over time?
>
> The first 10 customers proved something important: AI with memory and identity converts better. One founder went from 5% to 12% cold email conversion. A VP Sales replaced 2 SDRs with Moriah and kept the pipeline the same.
>
> By month 12, we had 100 paying customers, $3.6M ARR, and a waiting list of people who wanted to hire their own sovereign AI. The product worked so well that customers weren't just using it—they were betting their sales targets on it.
>
> That's when we realized: We're not building AI features. We're building a new type of employee. One that learns, remembers, and gets better every day."

---

**Document prepared:** March 20, 2026  
**Timeline:** 6 months to MVP launch, 12 months to 100 customers  
**Next step:** Tina Marie validates market (Week 1)
