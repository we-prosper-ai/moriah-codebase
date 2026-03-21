# 🚀 Deployment Automation Guide

**Created by:** Moriah  
**Date:** Friday, March 20, 2026  
**Status:** Ready to deploy all systems with one command

---

## Quick Start

```bash
# Deploy all systems
./scripts/deploy-all.sh all

# Or deploy individually
./scripts/deploy-all.sh v2    # Finance Friend v2
./scripts/deploy-all.sh v3    # Finance Friend v3
./scripts/deploy-all.sh board # Team Agent Board
```

---

## Prerequisites

### Global Requirements
- **Vercel CLI:** `npm i -g vercel`
- **Vercel Account:** [vercel.com](https://vercel.com)
- **Authentication:** `vercel login` (one-time setup)

### Finance Friend v2
- **.env.local** file with:
  ```
  DATABASE_URL=
  OPENAI_API_KEY=
  JWT_SECRET=
  NODE_ENV=production
  ```

### Finance Friend v3
- **.env.local** file with:
  ```
  DATABASE_URL=
  OPENAI_API_KEY=
  JWT_SECRET=
  ```

### Team Agent Board
- **Backend .env** file with:
  ```
  DATABASE_URL=
  JWT_SECRET=
  NODE_ENV=production
  ```

---

## What Gets Deployed

### Finance Friend v2
- **Frontend:** React app (Vite)
- **Backend:** Express.js server
- **Database:** SQLite (local) → PostgreSQL (production)
- **Target:** Vercel
- **Cost:** Free tier ($0/month)
- **Time:** ~5 minutes

### Finance Friend v3
- **Frontend:** React app with Four Currencies dashboard
- **Backend:** Express.js with advanced features (coach AI, tax classification)
- **Database:** SQLite (local) → PostgreSQL (production)
- **Target:** Vercel
- **Cost:** Free tier ($0/month)
- **Time:** ~5 minutes

### Team Agent Board
- **Frontend:** React Kanban app
- **Backend:** Express.js with real-time WebSocket
- **Database:** SQLite
- **Target:** Vercel (frontend) + Self-hosted or Railway (backend)
- **Cost:** Free tier + hosting
- **Time:** ~10 minutes

---

## Manual Deployment Steps

If you prefer manual control, use these steps:

### Finance Friend v2
```bash
cd /tmp/finance-friend-v2
cp .env.example .env.local
# Edit .env.local with your secrets
npm run build
vercel --prod
```

### Finance Friend v3
```bash
cd finance-friend-v3

# Backend
cd backend
cp .env.example .env.local
npm run build

# Frontend
cd ../client
npm run build

# Deploy
cd ..
vercel --prod
```

### Team Agent Board
```bash
# Backend (requires Node.js 18+)
cd team-agent-board-backend
npm run build
npm start

# Frontend (separate Vercel deployment)
cd team-agent-board-frontend
vercel --prod
```

---

## Environment Variables Needed

### Database URLs
- **Development:** SQLite (included in repos)
- **Production:** PostgreSQL recommended
  - Option 1: Supabase (free tier)
  - Option 2: Railway (paid, $5/month)
  - Option 3: Your own PostgreSQL host

### API Keys
- **OPENAI_API_KEY:** For Finance Friend AI features
  - Get from: [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
  - Cost: Pay-as-you-go ($0.002 per 1K tokens)

- **JWT_SECRET:** For authentication
  - Generate: `openssl rand -base64 32`

---

## Verification Steps

After deployment:

1. **Test Finance Friend v2**
   ```bash
   curl https://<your-vercel-url>/api/health
   ```

2. **Test Finance Friend v3**
   ```bash
   curl https://<your-v3-url>/api/health
   ```

3. **Test Team Agent Board**
   - Frontend: `https://<your-vercel-url>`
   - Backend: `https://<your-backend-url>/api/health`

---

## Rollback

If something goes wrong:

```bash
# Vercel automatically keeps previous deployments
vercel --prod --cwd <path>  # Redeploy latest working version

# Or manually from git
git checkout <previous-commit>
vercel --prod
```

---

## Cost Estimate

| System | Platform | Tier | Cost |
|--------|----------|------|------|
| Finance Friend v2 | Vercel | Free | $0/month |
| Finance Friend v3 | Vercel | Free | $0/month |
| Team Agent Board Frontend | Vercel | Free | $0/month |
| Team Agent Board Backend | Railway | Hobby | $5/month |
| Database | Supabase | Free | $0/month |
| **Total** | | | **$5/month** |

---

## Next Steps

1. **Configure .env files** with your secrets
2. **Run deployment script:** `./scripts/deploy-all.sh all`
3. **Test production URLs**
4. **Monitor logs:** `vercel logs <project-name>`
5. **Set up CI/CD** (optional, for auto-deploy on git push)

---

## Support

If deployment fails:

1. Check `.env` files are configured correctly
2. Verify Vercel authentication: `vercel login`
3. Check GitHub permissions (if using GitHub integration)
4. Review deployment logs: `vercel logs`

---

**Last Updated:** March 20, 2026 — 21:05 HADT  
**Status:** All systems ready for production deployment
