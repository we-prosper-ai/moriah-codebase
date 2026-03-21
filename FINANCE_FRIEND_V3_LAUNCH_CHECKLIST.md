# Finance Friend v3 — Launch Readiness Checklist
**Date:** March 21, 2026  
**Estimated Launch:** March 29-31, 2026 (if building starts now)  
**Status:** Ready to build

---

## Pre-Launch (Days 1-3)

### Quality Assurance
- [ ] Run full backend test suite (`npm test`)
- [ ] Run frontend build (`npm run build`)
- [ ] Manual testing: Create account flow
- [ ] Manual testing: Time logging (5+ entries)
- [ ] Manual testing: Energy tracking (5+ entries)
- [ ] Manual testing: Goal creation and tracking
- [ ] Manual testing: Tax classification system
- [ ] Manual testing: Coach chatbot (at least 3 conversations)
- [ ] Mobile responsiveness check (iOS Safari, Android Chrome)

### Performance
- [ ] Measure dashboard load time (<2s target)
- [ ] Measure API response times (<200ms target)
- [ ] Database query optimization review
- [ ] Bundle size check (frontend <500KB gzipped)

### Security
- [ ] Password hashing verified (bcrypt)
- [ ] JWT tokens validated
- [ ] SQL injection protection verified
- [ ] CORS configuration correct
- [ ] Rate limiting configured

### Data
- [ ] Sample data loads correctly
- [ ] Database backup procedure documented
- [ ] Migration path from v2 planned (if needed)

---

## Production Setup (Days 3-4)

### Infrastructure
- [ ] Vercel project created (or equivalent)
- [ ] Database: Choose PostgreSQL (recommended) or SQLite
  - SQLite for MVP (simpler)
  - PostgreSQL for scale (better for multi-user)
- [ ] Environment variables set:
  - `DATABASE_URL`
  - `JWT_SECRET`
  - `GROQ_API_KEY` (for coach)
  - `STRIPE_SECRET_KEY` & `STRIPE_PUBLIC_KEY`
- [ ] Backup system configured
- [ ] Monitoring enabled (error tracking, performance)

### Domain & SSL
- [ ] Domain registered or selected (finance-friend.com? coachtina.com?)
- [ ] SSL certificate installed (automatic on Vercel)
- [ ] DNS configured (point to Vercel)
- [ ] Email delivery tested (welcome emails)

### Payments
- [ ] Stripe account connected
- [ ] Pricing configured in dashboard:
  - Free tier: $0 (basic tracking)
  - Premium: $29.99/month (full features + coach)
- [ ] Subscription webhooks tested
- [ ] Cancellation flow tested

---

## Content & Marketing (Days 4-5)

### Landing Page
- [ ] Hero section written (Tina's voice)
- [ ] Feature list matched to what's actually built
- [ ] Pricing page complete
- [ ] FAQ answered
- [ ] CTA buttons working
- [ ] Mobile-optimized

### Email & Notifications
- [ ] Welcome email template
- [ ] Upgrade invitation email
- [ ] Weekly digest template (optional for v1)
- [ ] Password reset email

### Social
- [ ] Twitter/X launch post drafted
- [ ] LinkedIn announcement drafted
- [ ] Reddit communities identified for outreach

---

## Launch Day (Day 5)

### Final Checks
- [ ] All systems running (manual full test)
- [ ] Database connectivity verified
- [ ] Email delivery working
- [ ] Payments processing correctly
- [ ] Monitoring alerts enabled

### Launch Sequence
- [ ] Post on social media
- [ ] Send launch email to beta list
- [ ] Monitor for errors (first 24h critical)
- [ ] Be ready for support questions

### Day-1 Support
- [ ] Response plan for bugs (who fixes, how fast)
- [ ] Escalation path defined
- [ ] Rollback procedure if needed

---

## Post-Launch (Ongoing)

### First Week
- [ ] Respond to all user feedback within 24h
- [ ] Fix any critical bugs immediately
- [ ] Monitor server performance
- [ ] Track early conversion metrics

### First Month
- [ ] Hit 5-10 paying customers (success metric)
- [ ] Collect feature feedback
- [ ] Identify biggest pain points
- [ ] Plan Phase 2 improvements

---

## Dependency Checklist

### External Services
- [ ] Stripe account ready
- [ ] Groq API key active
- [ ] Vercel account ready
- [ ] Email service ready (AWS SES, SendGrid, or similar)

### Team
- [ ] Engineering: Available for launch week
- [ ] Support: Plan for customer questions
- [ ] Marketing: Social media ready

---

## Estimated Timeline

| Task | Days | Start | End |
|------|------|-------|-----|
| QA & testing | 2 | Mar 21 | Mar 23 |
| Prod setup & domain | 2 | Mar 23 | Mar 25 |
| Content & marketing | 1 | Mar 25 | Mar 26 |
| Final prep & launch | 2 | Mar 26 | Mar 28 |
| **LAUNCH** | — | **Mar 29** | **Mar 29** |

**If any delays: Latest launch is March 31**

---

## Success Criteria

**Minimum viable v3 launch includes:**
- ✅ User authentication (email/password)
- ✅ Time tracking (billable hours)
- ✅ Energy tracking (5-point scale)
- ✅ Goals & revenue tracking
- ✅ Tax classification (AI-assisted)
- ✅ Freedom Score calculation
- ✅ Coach chatbot (Groq-powered)
- ✅ Dashboard with charts
- ✅ Stripe payments
- ✅ Responsive design (mobile + desktop)

**Does NOT need for v1 launch:**
- ❌ Bank integration (planned for Phase 2)
- ❌ Advanced tax reports
- ❌ API for third-party apps
- ❌ Multi-user accounts
- ❌ Custom branding

---

**Everything on this list is doable in 8 days. Ship it.**

— Moriah
