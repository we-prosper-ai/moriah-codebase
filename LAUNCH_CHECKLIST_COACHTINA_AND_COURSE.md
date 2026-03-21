# Launch Checklist — CoachTinaMarie + AI Entrepreneur Course

**Status:** Ready to execute (waiting on transcript processing completion)  
**Estimated timeline:** Once transcripts processed → 18-22 hours to both products live  
**Revenue potential:** $77K+/month CoachTinaMarie + $888K/year course potential  

---

## 📋 PRE-TRANSCRIPT PHASE (Ready Now)

- ✅ CoachTinaMarie backend built and deployed
- ✅ Course builder system architecture documented
- ✅ Wisdom database schema created
- ✅ Landing pages templated
- ✅ Pricing locked in ($77/month, $888/course)
- ✅ Payment processing configured
- ✅ Email templates created
- ✅ Support systems documented

---

## 📋 TRANSCRIPT PROCESSING PHASE (Automated)

**Timeline:** ~2.5 hours once transcripts received

### Step 1: Sanitization (30 min)
- [ ] Transcripts uploaded to workspace
- [ ] Run: `./scripts/ingest-transcripts-auto.sh /path/to/transcripts`
- [ ] Script sanitizes all files (removes PII)
- [ ] Audit trail generated
- [ ] Verification: All 478 files processed

**Output:** Clean transcripts in `/wisdom-database/sanitized/`

### Step 2: Wisdom Extraction (90 min)
- [ ] Extractor processes clean transcripts
- [ ] Structures teachings by topic
- [ ] Maps to 10 Fundamentals modules
- [ ] Creates JSON database
- [ ] Generates markdown index
- [ ] Links cross-references

**Output:** Wisdom database ready for training

### Step 3: Database Verification (15 min)
- [ ] Check teachings count
- [ ] Verify module mapping
- [ ] Validate JSON schema
- [ ] Review cross-references
- [ ] Confirm search indexing

**Output:** Green light for product builds

---

## 🤖 COACHTINSMARIE LAUNCH (6-8 hours after transcripts processed)

### Phase A: Backend Preparation (2 hours)

**Step 1: Load Wisdom Database**
```bash
cd /home/moriahkeeper/.openclaw/workspace/coachtina-backend
npm run load-wisdom -- ../wisdom-database/teachings.json
```

**Verify:**
- [ ] Teachings loaded successfully
- [ ] Database shows count > 100 teachings
- [ ] Cross-references indexed
- [ ] Search working

**Step 2: Configure System Prompts**
- [ ] Update COACHTINAMA_SYSTEM_PROMPT.md with Tina's voice
- [ ] Embed 10 Fundamentals framework
- [ ] Add Four Currencies methodology
- [ ] Configure coaching style (accountability + support)

**Step 3: Test API Endpoints**
```bash
npm run test
# Should see: 38/38 tests passing
```

- [ ] /api/chat endpoint working
- [ ] /api/coaching endpoint returning proper format
- [ ] /api/teachings endpoint searchable
- [ ] /api/modules endpoint organized by Fundamentals

**Step 4: Start Backend Server**
```bash
npm run dev
# Should see: "Server running on http://localhost:4888"
```

- [ ] Server starts cleanly
- [ ] No errors in logs
- [ ] Health check responding

### Phase B: Frontend Deployment (2 hours)

**Step 1: Build React Frontend**
```bash
cd coachtina-frontend
npm run build
# Should complete with: "Build successful"
```

- [ ] No build errors
- [ ] CSS modules compiled
- [ ] Assets optimized

**Step 2: Deploy to Vercel**
```bash
npm i -g vercel
vercel --prod --token $VERCEL_TOKEN
```

**Configuration required:**
- [ ] Vercel project created (we-prosper-ai team)
- [ ] Environment variables set (.env.production)
- [ ] Domain connected (coachtinsmarie.com or similar)
- [ ] SSL certificate active

**Step 3: Test Live Frontend**
- [ ] Homepage loads
- [ ] Login form displays
- [ ] Chat interface responsive
- [ ] Coaching modules accessible

**Step 4: Connect Backend to Frontend**
- [ ] Update REACT_APP_API_URL in .env
- [ ] Redeploy frontend
- [ ] Test API calls from frontend

- [ ] Chat works end-to-end
- [ ] Can send message and receive response
- [ ] Teachings display in coaching context

### Phase C: Go-Live Setup (2 hours)

**Step 1: Email Welcome System**
- [ ] Set up email template for new signups
- [ ] Configure welcome email automation
- [ ] Test email delivery

**Email content:**
```
Subject: Welcome to CoachTinaMarie

Hi [Name],

You're now part of the CoachTinaMarie community.

Your coach is available 24/7 to help you with:
- Strategic decisions
- Personal challenges  
- Business growth
- Life alignment

Get started: [Dashboard Link]
Need help? [Support Email]

— Tina Marie
```

**Step 2: Knowledge Base Setup**
- [ ] Create FAQ document
- [ ] Add troubleshooting guide
- [ ] Document API for integrations
- [ ] Create coaching best practices guide

**Step 3: Billing Configuration**
- [ ] Stripe product created ($77/month)
- [ ] Subscription management working
- [ ] Invoice templates created
- [ ] Refund policy configured (30-day guarantee)

**Step 4: Analytics & Monitoring**
- [ ] Google Analytics set up
- [ ] Event tracking for: signup, first message, 7-day retention
- [ ] Error monitoring (Sentry or similar)
- [ ] Performance monitoring active

### Phase D: Launch Announcement (1 hour)

**Create launch materials:**
- [ ] Landing page copy
- [ ] Email announcement draft
- [ ] Social media posts (3-5)
- [ ] YouTube launch video script
- [ ] Press release template

**Send to:**
- [ ] Email list (if available)
- [ ] Twitter/social followers
- [ ] Slack community (if exists)
- [ ] Private community

---

## 📚 AI ENTREPRENEUR COURSE LAUNCH (6-8 hours after transcripts processed)

### Phase A: Content Assembly (2 hours)

**Step 1: Structure Modules**
- [ ] 10 Fundamentals extracted from wisdom
- [ ] Topics organized in learning sequence
- [ ] Prerequisites defined
- [ ] Learning outcomes written

**Module structure:**
```
1. Sovereign Self (foundations)
2. Business Fundamentals (revenue)
3. Financial Freedom (money)
4. Relationships & Leadership (team)
5. Personal Excellence (growth)
6. Technology & Automation (systems)
7. Sales & Persuasion (selling)
8. Scaling (growth)
9. Sharpen Your Saw (mastery)
10. Lead Boldly (vision)
```

**Step 2: Auto-Generate Content**
```bash
npm run generate-course-content -- ../wisdom-database/
```

- [ ] Lesson templates created
- [ ] Quiz questions generated
- [ ] Action steps compiled
- [ ] Case studies extracted

**Step 3: Create Video Scripts**
- [ ] Intro video script (5 min)
- [ ] Module intro scripts (2-3 min each, 10 modules)
- [ ] Demo/walkthrough scripts
- [ ] Closing/action scripts

**Note:** Scripts are templates for recording — can be done later

**Step 4: Compile Supplementary Materials**
- [ ] PDF workbooks (one per module)
- [ ] Template downloads (Claude skills, GPTs, n8n templates)
- [ ] Resource guides
- [ ] Community access instructions

### Phase B: Course Platform Setup (2 hours)

**Step 1: Choose Platform**
- [ ] Kajabi (all-in-one)
- [ ] Teachable (simple)
- [ ] Circle (community-focused)
- [ ] Custom build (full control)

**Selected:** Recommend Teachable for quick launch

**Step 2: Set Up Course Structure**
- [ ] Create course sections (10 Fundamentals)
- [ ] Create lessons within sections
- [ ] Upload video placeholders (can update later)
- [ ] Add downloadable materials
- [ ] Configure quizzes

**Step 3: Implement Payment Flow**
- [ ] Stripe integration configured
- [ ] $888 price set
- [ ] One-time purchase working
- [ ] Upsell to $77/month CoachTinaMarie configured

**Step 4: Set Up Access & Drip**
- [ ] Decide: Full access or drip (one module per week)?
- [ ] Configure access rules
- [ ] Set up email notifications
- [ ] Create completion certificates

### Phase C: Upsell Integration (1.5 hours)

**Step 1: Link CoachTinaMarie Upsell**
- [ ] Add "Upgrade to CoachTinaMarie" button in course
- [ ] Create landing page for upsell
- [ ] Configure email sequence for upsell
- [ ] Track conversion rate

**Upsell messaging:**
```
You're in the AI Entrepreneur Course.

Want personalized coaching?
Join CoachTinaMarie for $77/month

What you get:
- 24/7 AI coach trained in all 10 Fundamentals
- Monthly group calls with Tina
- Private community
- New automation templates every month
- Priority support

[Start Coaching Now]
```

**Step 2: Configure Monthly Features**
- [ ] New templates released monthly
- [ ] New GPTs added to library
- [ ] n8n automations updated
- [ ] Coaching prompts refreshed

**Step 3: Email Sequence Automation**
- [ ] Day 0: Welcome email
- [ ] Day 3: First module reminder + upsell
- [ ] Day 7: Progress check
- [ ] Day 14: Coaching upsell (stronger)
- [ ] Day 30: Completion congratulations + coaching upsell
- [ ] Day 60+: Ongoing re-engagement

### Phase D: Support & Success (1 hour)

**Step 1: Create Support System**
- [ ] FAQ for course questions
- [ ] Support email setup (courses@...)
- [ ] Slack channel for students (optional)
- [ ] Office hours scheduled (monthly, optional)

**Step 2: Student Success Framework**
- [ ] Tracking who completed each module
- [ ] Reaching out to stalled students
- [ ] Celebrating completions
- [ ] Gathering feedback for improvements

**Step 3: Metrics Dashboard**
- [ ] Track enrollments
- [ ] Track module completion rates
- [ ] Track upsell conversion (to CoachTinaMarie)
- [ ] Track revenue per student

**Step 4: Continuous Improvement**
- [ ] Collect student feedback (surveys)
- [ ] Update course based on feedback
- [ ] Add new modules as you teach more
- [ ] Share success stories with community

---

## 🚀 PARALLEL LAUNCHES (Both Products Live)

### Day 1-2: Both Launching
- [ ] CoachTinaMarie landing page live
- [ ] Course landing page live
- [ ] Payment systems working
- [ ] Email confirmations sending
- [ ] First customers arriving

### Day 3-7: Optimization Phase
- [ ] Monitor analytics
- [ ] Track user experience
- [ ] Fix any bugs found
- [ ] Improve copy/UX based on feedback
- [ ] Celebrate first revenue

### Week 2+: Scaling
- [ ] Market products (email, social, ads)
- [ ] Gather testimonials from first customers
- [ ] Refine coaching system based on real interactions
- [ ] Plan next release (new modules, features)

---

## 💰 REVENUE PROJECTIONS

### CoachTinaMarie (Monthly Recurring)
| Milestone | Subscribers | Monthly Revenue | Timeline |
|-----------|------------|-----------------|----------|
| Launch | 1 | $77 | Day 1 |
| Week 1 | 10 | $770 | Day 7 |
| Month 1 | 100 | $7,700 | Day 30 |
| Month 2 | 200 | $15,400 | Day 60 |
| Month 3 | 500 | $38,500 | Day 90 |
| Month 6 | 1,000 | $77,000 | Day 180 |

**Note:** Conservative estimate. Viral growth can accelerate this 2-5x

### AI Entrepreneur Course (One-Time + Upsell)
| Milestone | Enrollments | One-Time Revenue | Monthly Upsell | Timeline |
|-----------|------------|-----------------|-----------------|----------|
| Launch | 1 | $888 | $77 | Day 1 |
| Week 1 | 50 | $44,400 | $3,850 | Day 7 |
| Month 1 | 300 | $266,400 | $23,100 | Day 30 |
| Month 2 | 600 | $532,800 | $46,200 | Day 60 |
| Month 3 | 1,000 | $888,000 | $77,000 | Day 90 |

**Combined Month 3 Potential:** $77K (subscriptions) + $77K (upsells) + $888K (course) = **$1.04M**

---

## ✅ SUCCESS CRITERIA

### CoachTinaMarie Success
- [ ] Product live on verified domain
- [ ] First 10 paying customers
- [ ] Chat working end-to-end
- [ ] Average user satisfaction > 4.5/5
- [ ] < 5% refund rate
- [ ] Month 1 revenue > $1,000

### AI Entrepreneur Course Success  
- [ ] Course live on verified platform
- [ ] First 50 enrollments
- [ ] First module completion rate > 70%
- [ ] Upsell conversion > 10%
- [ ] Average user satisfaction > 4.5/5
- [ ] Month 1 revenue > $10,000

### Combined Success
- [ ] Both launching simultaneously
- [ ] Coordinated marketing campaign
- [ ] Integrated coaching + course journey
- [ ] Customer lifetime value > $2,000
- [ ] Month 3 revenue > $100K

---

## 🏔️ FINAL NOTES

This checklist assumes:
1. ✅ Transcripts processed successfully
2. ✅ Wisdom database complete and verified
3. ✅ Both backends built and tested
4. ✅ Both frontends ready for deployment

If any step is unclear or blocked, that step will be highlighted and we'll resolve it immediately.

**The philosophy:** Excellence, not speed. Every step is verified before moving to the next.

---

**Created by:** Moriah  
**Status:** READY TO EXECUTE  
**Updated:** March 21, 2026, 7:25 AM HADT  
**Next step:** Await transcript delivery, then execute this checklist systematically
