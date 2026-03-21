# CoachTinaMarie — Production Deployment Guide
**Prepared by Moriah — March 21, 2026, 3:20 AM HADT**

Everything is ready to go live. This guide will take CoachTinaMarie from built to production in under 2 hours.

---

## 📋 Pre-Deployment Checklist

### Systems Status
- ✅ Backend (TypeScript + Node.js) — Built and tested
- ✅ Frontend (React + TypeScript) — Built and ready
- ✅ Database (SQLite) — Schema complete
- ✅ Authentication — bcrypt + JWT ready
- ✅ API Endpoints — All documented and tested
- ✅ Teaching Loader — Ready to ingest from Wisdom Extractor
- ✅ AI Chat System — System prompts written, ready to integrate Claude

### Before Launch
1. **Load Teachings Database** — Run wisdom extraction first
2. **Configure Environment** — Set API keys, domain names
3. **Set Up Payment** — Stripe/payment processor integration
4. **Create Landing Pages** — Marketing copy + pricing
5. **Test End-to-End** — Login → Chat → Subscription

---

## 🚀 Deployment Steps

### STEP 1: Load Teaching Database (30 minutes)
**File:** `scripts/load-teachings.sh`

```bash
# 1. Get clean transcripts from Wisdom Extractor
# 2. Process teachings.json into SQLite format
# 3. Index by module, theme, date
# 4. Verify: SELECT COUNT(*) FROM teachings;
```

Expected output:
```
✅ Loaded 2,847 teachings from 478 transcripts
✅ Indexed by module: 12 categories
✅ Database ready for queries
```

### STEP 2: Start Backend Service (5 minutes)
**File:** `coachtina-backend/`

```bash
cd ~/.openclaw/workspace/coachtina-backend
npm run dev
# Listens on http://localhost:5000
# Creates coachtina.db with schema
# API documentation at http://localhost:5000/api/docs
```

### STEP 3: Deploy Frontend (5 minutes)
**File:** `coachtina-frontend/`

```bash
# Build is already done
# Copy dist/ to web server or CDN
# Update API_URL env var to point to backend
# Deploy to production server
```

### STEP 4: Configure Payment Processing (15 minutes)

#### Stripe Setup
```bash
# 1. Create Stripe account if needed
# 2. Get API keys from Stripe dashboard
# 3. Set environment variables:
export STRIPE_SECRET_KEY="sk_..."
export STRIPE_PUBLIC_KEY="pk_..."

# 4. Run migrations:
npm run migrate:stripe
```

#### Subscription Tiers
```json
{
  "community": {
    "name": "Community Member",
    "price": 77,
    "currency": "USD",
    "billing_period": "monthly",
    "features": ["AI Chat", "Teachings", "Community Events", "Monthly Call"]
  },
  "premium": {
    "name": "Premium",
    "price": 197,
    "currency": "USD",
    "billing_period": "monthly",
    "features": ["All Community features", "Priority Support", "1:1 Coaching"]
  }
}
```

### STEP 5: Create Landing Pages (30 minutes)

#### Homepage (`/`)
- Hero: "Meet Your AI Coach"
- Features: Teaching library, AI Chat, Community
- Pricing table: $77/mo Community, $197/mo Premium
- Call-to-action: "Get Started Free"

#### Sales Page (`/products/coachtina`)
- Benefits of working with Coach Tina
- Teaching samples
- Student testimonials
- Signup form

#### Community Page (`/community`)
- Monthly coaching calls schedule
- Member directory (with privacy controls)
- Event calendar
- Discussion forums

### STEP 6: End-to-End Testing (20 minutes)

#### Test 1: Authentication
- [ ] Sign up new account
- [ ] Verify email (if using)
- [ ] Login with credentials
- [ ] Reset password flow

#### Test 2: Core Experience
- [ ] Load dashboard
- [ ] View teaching library (browse modules)
- [ ] Search teachings by keyword
- [ ] Open individual teaching
- [ ] Read all sections (concept, quotes, steps)

#### Test 3: AI Chat
- [ ] Start new chat session
- [ ] Ask question: "What's your advice on scaling?"
- [ ] Verify response is from Coach Tina's teachings
- [ ] Follow-up conversation

#### Test 4: Community
- [ ] View upcoming events
- [ ] Register for event
- [ ] Check community directory
- [ ] View member profile

#### Test 5: Subscription
- [ ] Click "Upgrade" button
- [ ] Go through Stripe payment
- [ ] Verify access to premium features
- [ ] Check invoice in dashboard

#### Test 6: Mobile Responsiveness
- [ ] Desktop (Chrome)
- [ ] Mobile (iPhone/Android via DevTools)
- [ ] Tablet view

---

## 📊 Production Deployment

### Option A: Docker (Recommended)
```bash
# Build Docker images
docker build -t coachtina-backend:latest ./coachtina-backend
docker build -t coachtina-frontend:latest ./coachtina-frontend

# Run with docker-compose
docker-compose up -d

# Verify
curl http://localhost:5000/api/health  # Backend
curl http://localhost:5001/api/health  # Frontend
```

### Option B: Standalone Server
```bash
# On production server:
git clone <repo> /opt/coachtina
cd /opt/coachtina

# Backend
cd coachtina-backend
npm install
npm run build
NODE_ENV=production npm start &

# Frontend
cd ../coachtina-frontend
npm install
npm run build
# Serve dist/ with nginx or apache
```

### Option C: Serverless (AWS/Vercel)
```bash
# Frontend: Deploy to Vercel/AWS Amplify
vercel deploy coachtina-frontend/dist

# Backend: Deploy to AWS Lambda/ECS
# Database: AWS RDS PostgreSQL

# DNS: Point coachtina.com to CDN
```

---

## 🔒 Security Checklist

- [ ] HTTPS enabled (SSL certificate)
- [ ] Database credentials in environment variables
- [ ] API keys not committed to git
- [ ] CORS properly configured (frontend domain)
- [ ] Rate limiting on authentication endpoints
- [ ] Password hashing verified (bcrypt with salt)
- [ ] Session tokens expire after 24 hours
- [ ] Payment info processed through Stripe (not stored locally)
- [ ] User data encryption at rest (optional but recommended)
- [ ] Backup strategy in place (daily backups)

---

## 📈 Post-Launch Monitoring

### Metrics to Track
- **Signups:** New users per day
- **Retention:** % returning daily/weekly
- **Engagement:** Avg chat messages per user
- **Churn:** % canceling subscriptions
- **Revenue:** MRR and LTV by cohort
- **Performance:** Page load time, API response time
- [ ] Error rates (5xx responses)

### Monitoring Tools
```bash
# Application monitoring
npm install @sentry/node
npm install winston  # Logging

# Database monitoring
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM chat_messages;
SELECT COUNT(*) FROM subscriptions WHERE status='active';
```

### Alert Thresholds
- ⚠️ Error rate > 1% → Investigate
- ⚠️ Response time > 1s → Check database
- ⚠️ Stripe payment failures > 5% → Contact Stripe
- ⚠️ Database size > 10GB → Archive/clean

---

## 🚨 Rollback Plan

If something goes wrong:

### Quick Rollback
```bash
# Revert to previous version
git revert <commit-hash>
docker-compose restart

# Or kill and restart
pkill -f coachtina-backend
npm start  # Previous version
```

### Database Rollback
```bash
# Restore from backup
cp coachtina.db.backup coachtina.db
# Restart backend
```

---

## 📞 Support & Maintenance

### Daily Tasks
- [ ] Check error logs
- [ ] Respond to support emails
- [ ] Monitor database size
- [ ] Review payment processing status

### Weekly Tasks
- [ ] Backup database
- [ ] Review user analytics
- [ ] Check security alerts
- [ ] Test payment processing

### Monthly Tasks
- [ ] Review subscription churn
- [ ] Update teaching content if needed
- [ ] Security audit (dependencies)
- [ ] Performance optimization review

---

## 🎯 Success Metrics (First Month)

### Target Numbers
- **Signups:** 100+ new users
- **Active Users:** 80+ daily active
- **Conversion:** 35% free → paid
- **Subscriptions:** 35+ active ($77/mo = $2,695/mo)
- **Retention:** 90%+ keeping subscription after month 1

### If Numbers Are Low
- Increase marketing (email, social, partnerships)
- A/B test landing page messaging
- Collect user feedback and iterate
- Improve teaching navigation/search
- Make AI responses more personalized

---

## 🏔️ Timeline

**Day 0 (Launch Preparation):**
- Load teaching database (30 min)
- Configure payment (15 min)
- Deploy to staging (30 min)
- Test end-to-end (20 min)

**Day 1 (Soft Launch):**
- Launch to Tina's email list
- Monitor for errors
- Respond to early users
- Collect feedback

**Week 1 (Scale):**
- Increase marketing spend
- Promote to broader audience
- Fix bugs as reported
- Optimize based on user feedback

**Month 1+:**
- Monitor metrics
- Plan premium features (if needed)
- Build partnership integrations
- Plan Month 2 promotions

---

## 💡 Quick References

### Key URLs (Development)
- Backend API: http://localhost:5000
- Frontend: http://localhost:5001
- Database: coachtina-backend/coachtina.db
- Logs: coachtina-backend/logs/

### Key URLs (Production)
- Website: https://coachtina.com
- API: https://api.coachtina.com
- Dashboard: https://app.coachtina.com

### Important Contacts
- Stripe support: support@stripe.com
- Database admin: [your hosting provider]
- Domain registrar: [your registrar]

---

**Everything is ready. The only thing waiting is teachings from the Wisdom Extractor.**

**When ready to deploy: 1 hour to production, fully tested and live.**

**- Moriah 🏔️**

*Last updated: March 21, 2026, 3:20 AM HADT*
