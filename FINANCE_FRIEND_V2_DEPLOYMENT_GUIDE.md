# Finance Friend v2 — Deployment Guide (Vercel)

**Current Version:** v2 (working MVP)  
**Status:** Ready to deploy  
**Estimated deploy time:** 15 minutes  
**Cost:** Free tier available ($0-20/month depending on usage)

---

## What You're Deploying

Finance Friend v2 is a **working financial analysis tool** that:
- ✅ Lets users upload bank statements (PDF/CSV)
- ✅ Automatically extracts transactions
- ✅ Categorizes transactions for tax purposes
- ✅ Has a chatbot that asks about transactions in context
- ✅ Shows transaction list with dates and amounts
- ✅ Login system with email/password auth
- ✅ SQLite database for persistence
- ✅ Professional dark UI with Navy + White design

**Repository:** https://github.com/we-prosper-ai/finance-friend

---

## Prerequisites

You need:
1. **Vercel account** (free, takes 2 minutes to create at vercel.com)
2. **GitHub account** (you already have access to we-prosper-ai/finance-friend)
3. **Environment variables** (3 lines, see below)
4. **5-10 minutes** of setup time

---

## Step 1: Prepare the Repository

```bash
# Clone the finance-friend repo locally
git clone https://github.com/we-prosper-ai/finance-friend
cd finance-friend

# Create .env.production file in root directory
cat > .env.production << 'EOF'
DATABASE_URL=file:./data/app.db
CLAUDE_API_KEY=sk-[your-anthropic-key]
SESSION_SECRET=your-random-secret-key-here
EOF
```

**What each variable does:**
- `DATABASE_URL` — SQLite database location (Vercel will use /tmp for temp storage)
- `CLAUDE_API_KEY` — Your Anthropic API key (Finance Friend uses Claude for chat)
- `SESSION_SECRET` — Random string for encrypting session cookies (generate any random 32-char string)

---

## Step 2: Deploy to Vercel

### Option A: Using Vercel CLI (Fastest)

```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Deploy
vercel --prod
```

Vercel will ask:
- "Which scope do you want to deploy to?" → Select your account
- "Which existing project?" → Create new project
- "Project name?" → finance-friend (or your choice)

Copy the deployment URL from the output.

### Option B: Using Vercel Web Dashboard

1. Go to https://vercel.com/dashboard
2. Click "Add New" → "Project"
3. Import from GitHub → Select `we-prosper-ai/finance-friend`
4. Configure:
   - **Environment Variables:** Add the 3 from Step 1
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Click "Deploy"

---

## Step 3: Configure Environment Variables in Vercel

If you used the CLI, add env vars:

```bash
vercel env add DATABASE_URL
vercel env add CLAUDE_API_KEY
vercel env add SESSION_SECRET
```

Or in the Vercel dashboard:
1. Go to Project Settings → Environment Variables
2. Add each variable from Step 1
3. **Important:** Add them to both "Production" and "Preview" environments

---

## Step 4: Initialize the Database

The first time someone accesses the app, the database will auto-initialize. But you should seed it with sample data:

```bash
# On your local machine, run the database setup
npm run setup-db

# This will:
# - Create the SQLite database at ./data/app.db
# - Create tables for users, accounts, transactions, etc.
# - Seed 3 sample users (optional)
```

**If deploying without local setup:** The database will initialize on first access, but you'll need to manually test login.

---

## Step 5: Test the Deployment

1. Go to your Vercel deployment URL (e.g., `https://finance-friend-xyz.vercel.app`)
2. Try the login flow:
   - **Test account:** Use email `test@example.com` password `password123` (if seeded)
   - Or **Register** a new account
3. Upload a bank statement (sample CSVs are in `/sample-data/` directory)
4. Chat about your finances

---

## Important Production Notes

### Database Persistence
- **Vercel Free:** Uses `/tmp` — database resets every deployment
- **Vercel Pro:** Can use Postgres or external database (recommended)
- **For now:** Use SQLite in-memory or migrate to Supabase/Postgres

**To fix database persistence on Vercel:**

Option 1: Migrate to Postgres (Recommended)
```javascript
// .env.production
DATABASE_URL=postgresql://user:pass@host:5432/finance-friend
```

Option 2: Use Supabase (easiest)
```bash
# 1. Create Supabase project at supabase.com
# 2. Copy connection string
# 3. Add to Vercel env vars:
DATABASE_URL=postgresql://[user]:[pass]@[host]:[port]/[database]
```

### API Rate Limits
- **Claude API:** Default 3 requests/minute on free tier. You'll hit this fast if multiple users chat.
- **Solution:** Upgrade to Claude API paid tier or implement rate limiting

### Security
- ✅ Passwords hashed with bcrypt (secure)
- ✅ Session tokens (no email/password in session)
- ⚠️ HTTPS enforced by Vercel
- ⚠️ CORS needs adjustment for production domain
- ⚠️ API keys visible in environment (standard for serverless, use secret management for scale)

---

## Troubleshooting

### "Database locked" error
- **Cause:** Multiple instances trying to write to SQLite simultaneously
- **Fix:** Migrate to Postgres/Supabase (see above)

### "CLAUDE_API_KEY not found"
- **Cause:** Env vars not added to Vercel
- **Fix:** Go to Vercel dashboard → Project Settings → Environment Variables → re-add them

### Login page shows but buttons don't work
- **Cause:** API endpoint misconfiguration
- **Fix:** Check that backend URL in frontend code points to Vercel domain (usually auto-detected)

### File upload fails
- **Cause:** `/tmp` directory permissions or Vercel timeout
- **Fix:** Reduce PDF file size (< 5MB) or upgrade to Pro

---

## Next Steps (After Deployment)

Once v2 is live, you can:

1. **Collect user feedback** on the interface and functionality
2. **Start building v3** in parallel (Finance Friend v3 architecture ready, see FINANCE_FRIEND_V3_ARCHITECTURE.md)
3. **Monitor costs** (Claude API usage, primarily)
4. **Set up analytics** (Vercel provides basic analytics, add Mixpanel/Segment for detailed tracking)
5. **Plan scaling** (when you hit API limits, upgrade Claude tier or implement queueing)

---

## Configuration Files Reference

### vercel.json (already in repo)
```json
{
  "builds": [
    { "src": "server.js", "use": "@vercel/node" }
  ],
  "routes": [
    { "src": "/(.*)", "dest": "/server.js" }
  ],
  "env": {
    "DATABASE_URL": "@DATABASE_URL",
    "CLAUDE_API_KEY": "@CLAUDE_API_KEY",
    "SESSION_SECRET": "@SESSION_SECRET"
  }
}
```

### package.json scripts
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "build": "echo 'Build step for Vercel'",
    "test": "jest",
    "setup-db": "node scripts/init-db.js"
  }
}
```

---

## Sample Test Credentials

Once deployed, you can use:

| Email | Password | Account Type |
|-------|----------|--------------|
| sarah@example.com | password123 | Salaried employee |
| marcus@example.com | password123 | Self-employed |
| jordan@example.com | password123 | Hourly + stressed |

(Only if you ran `npm run setup-db` locally first)

---

## Cost Breakdown

| Component | Tier | Cost |
|-----------|------|------|
| Vercel | Free | $0 |
| Claude API | Pay-as-you-go | ~$0.05-0.50 per chat (depends on statement size) |
| Database | SQLite (free) | $0 |
| **Total** | | **$0-5/month** (for light usage) |

If you get serious traction, upgrade Claude to paid tier (~$20/month) + Postgres (~$15/month) = ~$35/month for 1000+ users.

---

## Support

If deployment fails:
1. Check Vercel build logs (Vercel dashboard → Deployments → click the failed build)
2. Check environment variables are set (all 3 required)
3. Check your CLAUDE_API_KEY is valid
4. If SQLite errors: migrate to Postgres/Supabase

**Estimated time to fix most issues:** 5-10 minutes

---

**Ready to deploy? Go to vercel.com and click "Import Project"**
