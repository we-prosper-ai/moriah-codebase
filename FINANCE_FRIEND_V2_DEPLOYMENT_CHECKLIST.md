# Finance Friend v2 — Deployment Checklist

**Created:** March 21, 2026, 22:00 PM HADT  
**Status:** QA In Progress  
**Target:** Vercel deployment (5-minute setup)

---

## ✅ Pre-Deployment Checklist

### Environment Variables (REQUIRED)
These must be set before deployment:

- [ ] `ANTHROPIC_API_KEY` — OpenAI for transaction extraction
  - Get from: https://console.anthropic.com/keys
  - Where to set: Vercel project settings → Environment Variables

- [ ] `SESSION_SECRET` — Session encryption (any strong random string)
  - Generate: `openssl rand -hex 32`
  - Example: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`
  - Where to set: Vercel Environment Variables

- [ ] `DATABASE_URL` (Optional — defaults to SQLite)
  - If using Supabase: `postgresql://user:pass@...`
  - If local SQLite: Not needed (uses finance-friend.db)
  - Where to set: Vercel Environment Variables

### Code Quality Checks
- [ ] Run `npm test` locally (ensure all tests pass)
- [ ] Check `npm run lint` for code issues
- [ ] Verify database schema is correct (schema.sql reviewed)
- [ ] Check error handling in upload endpoint
- [ ] Verify authentication flow (register → login → upload)

### Deployment Configuration
- [ ] Create Vercel project (or link existing)
- [ ] Set environment variables in Vercel
- [ ] Configure build script: `npm install && npm run build`
- [ ] Configure start script: `npm start`
- [ ] Set Node.js version: v22 or higher
- [ ] Enable database persistence (if using cloud DB)

### Testing Before Launch
- [ ] Test registration endpoint
- [ ] Test login endpoint
- [ ] Test file upload (CSV + PDF)
- [ ] Test AI chat (requires Anthropic key)
- [ ] Test session persistence across pages
- [ ] Test responsive design (mobile + desktop)
- [ ] Test error handling (invalid upload, bad credentials, etc.)

---

## 🚀 Deployment Steps

### Step 1: Prepare Vercel Project
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy (first time)
vercel --prod
```

### Step 2: Set Environment Variables
In Vercel Dashboard → Project Settings → Environment Variables:
1. Add `ANTHROPIC_API_KEY`
2. Add `SESSION_SECRET`
3. Redeploy after adding vars

### Step 3: Verify Deployment
```bash
# Check logs
vercel logs [project-name]

# Test endpoints
curl https://[your-domain]/api/auth/register
curl https://[your-domain]/api/upload
```

### Step 4: Monitor Initial Traffic
- [ ] Check server logs for errors
- [ ] Monitor error rate (should be <1%)
- [ ] Check response times (should be <500ms)
- [ ] Verify database is persisting data

---

## 🧪 QA Test Results

### Passed ✅
- [x] Server starts without errors
- [x] Frontend serves at localhost:3001
- [x] Registration endpoint creates users
- [x] Login endpoint validates passwords
- [x] Session cookies are set correctly

### Failed ❌
- [ ] Upload endpoint (missing ANTHROPIC_API_KEY)
- [ ] Transaction extraction (missing API key)
- [ ] Chat functionality (missing API key)

### Notes
- Database schema is correct and initializes properly
- All user-facing endpoints respond correctly
- No code bugs found in authentication system
- Configuration is the only blocker

---

## 📋 Production Readiness Checklist

### Critical (Must Fix)
- [ ] Anthropic API key configured and tested
- [ ] Session secret configured and strong
- [ ] Database backups configured (Supabase)
- [ ] Error logging enabled (Sentry or similar)
- [ ] Security headers set (CORS, CSP, etc.)

### Important (Should Have)
- [ ] Rate limiting on auth endpoints
- [ ] SQL injection protection verified
- [ ] Password reset flow implemented
- [ ] Email verification (for password resets)
- [ ] Analytics tracking configured

### Nice-to-Have (Can Add Later)
- [ ] Google OAuth integration
- [ ] Email notifications
- [ ] User preferences/settings
- [ ] Export data as CSV
- [ ] Dark mode toggle

---

## 🎯 Success Criteria

✅ **Deployment is successful when:**
1. Frontend loads at domain.vercel.app
2. User can register an account
3. User can login with credentials
4. User can upload CSV file
5. Transaction extraction works (requires API key)
6. Chat responds to questions
7. Dashboard displays uploaded transactions

---

## 📞 Support & Troubleshooting

### "ANTHROPIC_API_KEY not set" Error
- [ ] Verify key exists in Vercel Environment Variables
- [ ] Restart deployment after adding key
- [ ] Check key is not expired

### "Database connection failed" Error
- [ ] If local SQLite: verify /tmp/finance-friend/server/finance-friend.db exists
- [ ] If Supabase: verify DATABASE_URL is correct
- [ ] Check Vercel logs for detailed error

### Upload endpoint timeout
- [ ] Increase Vercel timeout (currently 60s)
- [ ] Check Anthropic API status (might be slow)
- [ ] Try with smaller CSV file

---

## 📊 Deployment Timeline

| Task | Owner | Time | Status |
|------|-------|------|--------|
| Set up Vercel project | Tina | 5 min | ⏳ Blocked |
| Configure env variables | Tina | 5 min | ⏳ Blocked |
| Deploy to production | Moriah | 2 min | ⏳ Ready |
| Smoke test endpoints | Moriah | 10 min | ⏳ Ready |
| Monitor first 24h | Tina | Ongoing | ⏳ Blocked |
| **Total time to revenue** | — | **27 min** | — |

---

## 🔄 Post-Deployment

After launch, monitor:
1. Error rates (should be <1%)
2. Response times (p95 <1s)
3. User registration rate
4. Upload success rate
5. Chat interaction volume

Update this checklist as you find new issues!

---

**Prepared by:** Moriah  
**QA Status:** In Progress  
**Blocked On:** Tina's decision (PATH choice) + ANTHROPIC_API_KEY setup  
**Ready to Deploy:** Yes, once env vars are set

