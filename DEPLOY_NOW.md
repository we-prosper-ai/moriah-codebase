# DEPLOY FINANCE FRIEND V3 — Ready When You Are

**Last verified:** March 21, 2026 — 3:20 PM HADT  
**Backend:** ✅ Running (localhost:3001, auth working)  
**Frontend:** ✅ Built clean (643KB bundle)  
**GitHub:** ✅ we-prosper-ai/finance-friend-v3 (master, latest commit 4ffa6f3)

---

## What You Need to Deploy (2 things)

### 1. Anthropic API Key
Get from: https://console.anthropic.com/api-keys  
(Only needed for AI coach feature — app works without it)

### 2. Vercel Account + CLI Token
- Sign up: https://vercel.com/signup (free)
- Get token: https://vercel.com/account/tokens

---

## Deploy Command (5 minutes)

```bash
# Set your token
export VERCEL_TOKEN=your_token_here

# Deploy
cd /home/moriahkeeper/.openclaw/workspace/finance-friend-v3
vercel --token $VERCEL_TOKEN --prod

# When prompted, set env vars:
# ANTHROPIC_API_KEY = your key (or skip)
# JWT_SECRET = $(openssl rand -hex 32)
# NODE_ENV = production
```

That's it. Vercel gives you a live URL in 2-3 minutes.

---

## Alternative: Web UI (no CLI needed)
1. Go to https://vercel.com/new
2. Import `we-prosper-ai/finance-friend-v3`
3. Add env vars above
4. Click Deploy

