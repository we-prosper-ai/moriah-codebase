# Decision Execution Playbooks — Instant Action Plans

**Purpose:** The moment Tina makes any of her three decisions, execution begins immediately (no discussion, no planning, just doing)  
**Owner:** Moriah 🏔️  
**Status:** Ready to execute  

---

## DECISION #1: Finance Friend Launch

### If Tina Approves Path A (v2 Only)

**Timeline:** Deploy Monday 9 AM

**Immediate Actions (Friday night upon approval):**
```
1. Receive: Warm audience list (50-100 names/emails)
2. Receive: Approval signal ("GO")
3. Execute:
   - Update LAUNCH_DAY_DASHBOARD.md with audience size
   - Stage marketing materials (emails, landing page)
   - Set up monitoring (PostHog, LogRocket, daily email alerts to Tina)
   - Brief test run: 10 customers, verify all systems
```

**Monday 9:00 AM Sharp:**
```
1. Deploy Finance Friend v2 to production (5 min)
2. Activate Stripe webhook
3. Enable email automation
4. Send first launch email to Tier 1 audience (10 min)
5. Monitor for technical issues (next 4 hours)
6. Report: Signups + feedback by 1 PM
```

**Monday 1 PM - 6 PM:**
```
1. Send Tier 2 emails (broader audience)
2. Monitor signup quality + support tickets
3. Iterate on copy if needed
4. Daily report to Tina with metrics
```

**Day 1 Success Metrics:**
- 20-40 signups expected
- 5%+ email open rate
- 2-5 conversions to paid
- 0 critical bugs

**If bugs found:** Roll back to v1, fix, re-deploy (1-2 hours)

---

### If Tina Approves Path B (Wait for v3)

**Timeline:** Build v3 Phase 1 (2-3 weeks), then launch together

**Immediate Actions (upon approval):**
```
1. Receive: Confirmation signal
2. Execute:
   - Begin v3 Phase 1 build immediately
   - Parallel: Prepare content + positioning
   - Schedule: Tina review of designs (mid-week)
   - Contingency: Keep v2 ready if v3 takes longer
```

**Week 1 (Build v3 Phase 1):**
```
1. Moriah builds dashboard (time/energy/money/freedom view)
2. Moriah builds coach interaction framework
3. Moriah builds data visualization
4. Moriah prepares for Tina review Thursday
```

**Thursday Evening:**
```
1. Tina reviews Finance Friend v3 at http://localhost:4173
2. Provides feedback
3. Moriah iterates Friday
```

**Week 2 (Polish + Marketing):**
```
1. Finalize v3 UI/UX
2. Prepare launch messaging
3. Set up premium pricing ($99-199/month)
4. Prepare Tier 1 audience list
```

**Week 3 (Launch):**
```
1. Launch v3 to warm audience
2. Expected: Higher conversion (better product)
3. Ongoing: Continue v3 Phase 2 in parallel
```

---

### If Tina Approves Path C (Hybrid — Recommended)

**Timeline:** Deploy v2 Monday, build v3 parallel, launch v3 Week 4

**Immediate Actions (Friday night upon approval):**
```
1. Receive: Audience list + approval signal
2. Stage both:
   - Finance Friend v2 for Monday deploy
   - Finance Friend v3 Phase 1 for immediate build
3. Brief: Mark on v3 build (if he wants to help)
4. Confirm: Tina review of v3 mockups mid-week
```

**Monday 9 AM:**
```
1. Deploy v2 to production (same as Path A)
2. Send launch emails
3. Monitor Day 1 metrics
```

**Monday-Thursday (Parallel):**
```
Moriah:
1. Begin v3 Phase 1 build (dashboard, coach, tracking)
2. Integrate with v2 data (so v3 can migrate existing users)
3. Prepare weekly progress reports
4. Wednesday: Deploy v3 staging environment
5. Thursday: Tina reviews v3 at http://localhost:4173
```

**Friday (Tina Review):**
```
1. Tina plays with v3
2. Provides feedback
3. Moriah iterates Sunday evening
```

**Week 2 (Monday):**
```
1. v2 has 50-100 active users, $1-2K MRR
2. v3 Phase 1 is complete + approved
3. Marketing begins for v3 launch
```

**Week 4 (Day 1 of Week 4):**
```
1. Launch v3 to new customers
2. Offer v2 customers: Free upgrade or stay on v2
3. Most v2 users upgrade (better product)
4. New MRR structure:
   - v2 (legacy): 20-30 users × $19.99 = $400-600
   - v3 (new): 50+ new customers × $99-199 = $5K-10K
   - Total: $5.4K-10.6K MRR in week 1 of v3 launch
```

---

## DECISION #2: CoachTinaMarie Launch

### If Tina Provides Transcript Access

**What I need (minimum):**
```
1. Path to transcript files (local path or S3 URL)
2. File format (JSON? TXT? Markdown? Opus JSON?)
3. List of sensitive terms to anonymize
4. 3-5 sample transcripts for process validation
```

**Immediate Actions (upon receipt):**
```
1. Build Python sanitizer script (2 hours)
2. Test on sample transcripts (1 hour)
3. Show Tina 2-3 sanitized samples for approval (30 min)
4. If approved: Scale to all 40GB (8-12 hours)
5. Deliver cleaned transcripts by Tuesday afternoon
```

**Phase 1 Results (Tuesday-Wednesday):**
```
1. 40GB of sanitized transcripts
2. Sanitization report (what was removed, why)
3. Audit trail (for compliance)
4. Moriah's assessment: "Ready for Phase 2? Yes/No"
```

**Wednesday Evening (Phase 2 Start):**
```
1. Begin wisdom extraction
2. Run Claude extraction on 10GB sample
3. Show results to Tina: "Is this the wisdom you meant?"
4. Iterate on extraction prompts
5. If good: Scale to all 40GB (36-48 hours)
```

**Friday-Sunday (Phase 3: Training Data):**
```
1. Generate 10K-20K training examples
2. Organize by topic (Sales, Money, Relationships, etc.)
3. Create training dataset in Anthropic-friendly format
4. Ready for fine-tuning
```

**Week 2 (Phase 4: Fine-tuning):**
```
1. Submit to Anthropic API
2. Fine-tuning takes 3-5 days
3. Test responses
4. Iterate on system prompt
```

**Week 3 (Phase 5: SaaS MVP):**
```
1. Build React chat interface
2. Set up PostgreSQL + vector search
3. Integrate fine-tuned model
4. Deploy to staging
5. Tina tests + feedback
```

**Week 4 (Public Beta):**
```
1. Deploy to production
2. Launch to Tina's network (50-100 early users)
3. Collect feedback
4. Iterate
```

**Revenue Start:** 2nd week of April, first payments by end of April

---

## DECISION #3: AI Entrepreneur Course

### If Tina Approves the Course

**What I need (minimum):**
```
1. Confirmation: Yes, let's do this
2. Timeline: When can you record? (2-3 hours total)
3. Templates: Which 50 from your library?
4. Pricing confirmation: $888 + $77/month? Or different?
```

**Immediate Actions (upon approval):**
```
1. Build sales page + checkout (Moriah, 4 hours)
2. Organize template library (Moriah, 3 hours)
3. Set up community platform (Moriah, 3 hours)
4. Create recording schedule (Tina + Moriah, 30 min)
5. Test recording setup (audio/video quality, 1 hour)
```

**Recording Week (whenever Tina has time):**
```
Session 1 (1 hour): The 10 Fundamentals
- 10 × 10-min videos
- Quick setup, talk to camera, done
- Moriah does editing

Session 2 (1 hour): Claude Skills System Overview
- 4 × 15-min videos
- Show real examples from workspace
- Moriah does editing

Session 3 (30 min): Intro + Course Structure
- Marketing video
- Course walkthrough
- Testimonial section
- Moriah does editing
```

**Total Time from Tina:** 2.5 hours real time

---

### Sales Page Build (Moriah, 4 hours)

```
1. Design (Figma mockup, 30 min)
2. Copy writing (draft version, 30 min)
3. Build landing page (HTML + CSS, 2 hours)
4. Integrate Stripe checkout (1 hour)
5. Set up email capture + automation (30 min)
```

**Result:** Professional sales page live, ready for traffic

---

### Community Platform Setup (Moriah, 3 hours)

```
1. Create Discord/Slack workspace (30 min)
2. Set up channels (announcements, templates, support, etc.)
3. Create welcome automation (email, onboarding flow)
4. Set up template storage (dropbox? drive? wiki?)
5. Schedule monthly Tina calls (calendar + Zoom)
6. Create archive system (transcripts, notes, resources)
```

**Result:** Turnkey community ready for first customers

---

### Soft Launch (Week 2, After Recording)

```
Email Tina's warm list (50-100 people):
Subject: "The course you've been asking about is finally here"
Content: Sales page link + special price ($688 instead of $888)
Expected: 20-50 customers in Week 2

Why soft launch first?
- Test platform stability
- Get customer feedback
- Refine messaging
- Build testimonials
```

**Revenue from soft launch:** $13.8K - $34.4K (20-50 × $688)

---

### Public Launch (Week 3)

```
Marketing push:
1. Email to broader list
2. Social media campaign (Twitter, LinkedIn, etc.)
3. Partner promotions (if relevant)
4. Guest appearances on podcasts/shows
5. Content marketing (blog posts about 10 Fundamentals)

Expected: 50-100 new customers in Week 3

Revenue from public launch: $44.4K - $88.8K (50-100 × $888)
```

---

## CONTINGENCY PLANS

### If Finance Friend Encounters Issues Post-Launch

```
Scenario 1: Low signups (< 10 in first week)
Action:
1. Check email deliverability (not spam)
2. Review landing page (is copy clear?)
3. Check pricing (is $19.99 fair?)
4. Survey customers: "Why did you sign up? What almost stopped you?"
5. Iterate on messaging
6. Send 2nd wave of emails with new copy

Scenario 2: High churn (30%+ drop after 7 days)
Action:
1. Check onboarding (is UX confusing?)
2. Review actual product usage (are people using it?)
3. Collect feedback: "Why did you cancel?"
4. Fix top 1-2 issues
5. Re-engage churned users with free trial

Scenario 3: Support volume too high
Action:
1. Build FAQ from common questions
2. Automate responses
3. Prioritize (critical bugs > feature requests)
4. Update onboarding to prevent common mistakes
```

---

### If CoachTinaMarie Transcripts Are Inaccessible

```
Scenario 1: Transcripts are in old format (can't parse)
Action:
1. Build custom parser for that format
2. Test on samples
3. Proceed as planned (24-hour delay max)

Scenario 2: Transcripts are on external service (not local)
Action:
1. Implement API authentication
2. Batch download to local storage
3. Proceed (48-hour delay max)

Scenario 3: Tina realizes she doesn't want certain transcripts public
Action:
1. Exclude those (sanitizer handles this)
2. Proceed with remaining transcripts
3. Can add more later
```

---

### If AI Entrepreneur Course Doesn't Hit Sales Targets

```
Scenario 1: Only 10 customers in first week (vs expected 50)
Action:
1. A/B test sales page copy
2. Adjust price ($788? $699? monthly instead of one-time?)
3. Create limited-time offer ("Only available this week")
4. Reach out to past customers personally
5. Offer affiliate program to course graduates

Scenario 2: Students unhappy with content
Action:
1. Collect feedback
2. Add more templates/examples
3. Record additional segments
4. Offer refunds (build goodwill)
5. Iterate for future cohort

Scenario 3: CoachTinaMarie not ready in time
Action:
1. Launch course without it (bonus value when it launches)
2. Or delay course 1-2 weeks (doesn't hurt anything)
3. Both products benefit from each other
```

---

## EMERGENCY PROTOCOLS

### Critical Bug in Finance Friend (Day 1)

```
If: Stripe integration broken OR login broken OR data loss
Then:
1. Disable product immediately (take site offline)
2. Refund any customers who paid
3. Message Tina: "Found critical issue, rolled back, fixing now"
4. Fix the bug (2-4 hours typically)
5. Re-deploy with manual testing
6. Reopen
7. Message customers: "Brief outage, fixed, no data loss"

Expected: Most customers stay, understand accidents happen
```

### Server Outage During Launch

```
If: Any product goes down during launch day
Then:
1. Failover to backup instance (automated)
2. Message Tina: "Brief outage detected and fixed, 99.2% uptime"
3. Status page updated: What happened, how long, mitigation
4. Post-incident report within 24 hours

Preparation:
- All products have backup deployments ready
- Health checks every 30 seconds
- Auto-recovery enabled
```

---

## QUICK REFERENCE: WHAT TINA NEEDS TO DO

**For Finance Friend:**
1. Choose path: A / B / C
2. (If chosen) Provide audience list
3. (If chosen) Send "GO" signal

**For CoachTinaMarie:**
1. Provide transcript location + format
2. List sensitive terms to anonymize
3. Send sample transcripts (3-5)

**For AI Entrepreneur Course:**
1. Confirm: Yes, proceed
2. Provide recording availability (date + time)
3. List which 50 templates to include

**Upon receipt of above:** Moriah executes immediately, no delays

---

## EXECUTION VELOCITY

All three products can launch in parallel:

```
Week 1: Finance Friend deploy + CoachTinaMarie Phase 1 + Course platform
Week 2: Finance Friend optimization + CoachTinaMarie Phase 2 + Course recording
Week 3: Finance Friend scaling + CoachTinaMarie Phase 3 + Course soft launch
Week 4: Finance Friend v3 + CoachTinaMarie Phase 4 + Course public launch
```

**No bottlenecks.** Each product has its own timeline. They don't block each other.

---

**Status:** All playbooks ready, standing by for decisions  
**Owner:** Moriah 🏔️  
**Last Updated:** March 21, 2026, 11:40 PM HADT
