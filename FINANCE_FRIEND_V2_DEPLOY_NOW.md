# Deploy Finance Friend v2 RIGHT NOW
**For:** Tina (if she says "go")  
**Time required:** 15 minutes  
**Result:** Live on the internet  
**Date:** March 21, 2026

---

## The Plan

You're going to take our existing Finance Friend v2 (which is complete and tested) and push it to Vercel in 15 minutes.

**Result:** Live at `https://finance-friend-v2.vercel.app` (or your custom domain)

---

## Step 1: Vercel (5 minutes)

### 1a. Create Vercel Account (if needed)
Go to: **vercel.com**
- Click "Sign up"
- Use GitHub account (recommended) or email
- Verify email

### 1b. Import Project
- Click "Add New" → "Project"
- Click "Import Git Repository"
- Paste: `https://github.com/we-prosper-ai/finance-friend-v2.git`
- Click "Import"

---

## Step 2: Environment Variables (3 minutes)

Vercel will ask for environment variables. Copy/paste these:

```
DATABASE_URL=file:./dev.db
JWT_SECRET=your-random-secret-here
STRIPE_SECRET_KEY=sk_test_YOUR_KEY_HERE
STRIPE_PUBLIC_KEY=pk_test_YOUR_KEY_HERE
GROQ_API_KEY=YOUR_GROQ_KEY_HERE
```

### How to get each:

**JWT_SECRET** (make one up, just needs to be random):
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**STRIPE Keys** (optional for MVP):
- Go to **stripe.com**
- Create account
- Go to Settings > API Keys
- Copy test keys (sk_test_... and pk_test_...)

**GROQ_API_KEY** (optional, for AI features):
- Go to **console.groq.com**
- Get API key
- Paste it

---

## Step 3: Deploy (1 minute)

- Click "Deploy" button
- Wait ~3 minutes for build to complete
- Vercel gives you a URL like: `https://finance-friend-v2-abc123.vercel.app`

**Done. It's live.**

---

## Step 4: Test (3 minutes)

### Quick Smoke Test
1. Go to the URL (from step 3)
2. Click "Sign up"
3. Create account with test email
4. Login
5. See dashboard ✅

If you see the dashboard, you're done. It works.

---

## Step 5: Custom Domain (Optional, +10 min)

If you want `finance-friend.yourname.com` instead of vercel's URL:

### 5a. Register Domain (if needed)
- Go to **namecheap.com** or **godaddy.com**
- Search for domain
- Buy it (~$10/year)

### 5b. Connect to Vercel
- In Vercel project settings: "Domains"
- Add your domain
- Update DNS (Vercel will show you exactly how)
- Wait 10 minutes for DNS to propagate

---

## You're Live

That's it. You now have:
- ✅ A working finance app
- ✅ Real users can sign up
- ✅ Accepting payments (once Stripe is connected)
- ✅ Running 24/7

---

## What Happens Next?

### Option 1: Let It Run
- Monitor for errors
- Collect user feedback
- Plan Phase 2

### Option 2: Start v3 in Parallel
While this is live collecting users, Moriah can build v3 (premium version) in the background. Ship that March 29.

### Option 3: Iterate v2 First
- Get 5-10 users
- Fix their feedback
- Then decide on v3

---

## Troubleshooting

**"Build failed"**
- Check GitHub repo has all files
- Check you pasted environment variables correctly
- Check Node version (needs 18+)

**"DNS not working"**
- DNS changes take 10-30 minutes
- Try again in 15 minutes
- Clear browser cache (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)

**"Got an error when trying to sign up"**
- Database might not have migrated
- Check logs in Vercel console
- Likely needs `node_modules` rebuilt

**"Stripe not working"**
- Only works with real Stripe keys
- For now, just test the flow without payment
- Add real payment integration for Phase 2

---

## That's Really It

This isn't complicated. We've already built it. You're just pushing the button.

**Total time: 15 minutes. Total cost: $0 (free tier). Total risk: None.**

If something breaks, you just delete the Vercel project and try again. No money spent, no data lost.

---

## Decision Time

**If Tina says:**
- "Deploy now" → Follow these steps
- "Build v3 first" → Skip this, start on Phase 2
- "Do both" → Deploy this Friday, build v3 while it's running

---

**Whenever you're ready, just say the word.**

— Moriah
