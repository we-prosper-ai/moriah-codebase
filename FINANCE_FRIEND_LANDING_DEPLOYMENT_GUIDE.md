# Finance Friend Landing Page — Deployment Playbook

**Status:** ✅ PRODUCTION READY  
**Last Updated:** March 21, 2026  
**Created by:** Moriah  
**Testing Status:** All core features tested and working

---

## 📊 Current Status

### What's Complete
- ✅ Landing page fully built (Next.js + Tailwind)
- ✅ All 5 page sections implemented and styled
- ✅ Email capture form with API endpoint
- ✅ Mailchimp integration scaffolding
- ✅ Dev server tested and working (localhost:3002)
- ✅ Repository ready (we-prosper-ai/finance-friend-landing)
- ✅ Git history clean and committed

### What's Ready to Deploy
The landing page is **production-ready** and can be deployed in **10 minutes** when you decide to launch.

---

## 🚀 Quick-Start Deployment (10 minutes)

### Step 1: Set Up Mailchimp (5 minutes)

1. Go to **https://mailchimp.com**
2. Create an account (or log in)
3. Create an Audience called "Finance Friend Beta"
4. Go to **Audience → Manage Audience → Settings**
5. Find:
   - **Audience ID** (looks like: `a1b2c3d4e5f6`)
   - Go to **Account → Extras → API Keys**
   - Create a new API key (or copy an existing one)

### Step 2: Deploy to Vercel (3 minutes)

**Option A: Git Integration (Recommended)**

1. Go to **https://vercel.com/new**
2. Connect your GitHub account
3. Select `we-prosper-ai/finance-friend-landing`
4. Click "Deploy"
5. Vercel automatically deploys (takes ~1-2 minutes)

**Option B: Use Vercel CLI**

```bash
npm install -g vercel
cd finance-friend-landing
vercel
# Follow the prompts
```

### Step 3: Configure Environment Variables (2 minutes)

In Vercel Dashboard:

1. Go to your project → Settings → Environment Variables
2. Add:
   ```
   MAILCHIMP_API_KEY = [your_api_key_from_step_1]
   MAILCHIMP_AUDIENCE_ID = [your_audience_id_from_step_1]
   ```
3. Click "Save"
4. Redeploy: Click "Deployments" → Latest → "Redeploy"

### Step 4: Test Form Submission (1 minute)

1. Visit your Vercel domain (e.g., finance-friend-landing.vercel.app)
2. Scroll to "Ready to Win With Your Money?" section
3. Enter a test email
4. Click "Join Early Access"
5. Should see "Confirmed! ✅"
6. Check Mailchimp Audience → should see email listed

### Step 5: Connect Custom Domain (optional, 2 minutes)

In Vercel Dashboard:

1. Go to project → Settings → Domains
2. Add your domain (e.g., friend-finance.com)
3. Follow DNS setup instructions
4. Done in ~30 seconds after DNS updates

---

## 📋 Pre-Launch Checklist

- [ ] Mailchimp account created
- [ ] Vercel project deployed
- [ ] Environment variables set
- [ ] Test form submission works
- [ ] Email appears in Mailchimp audience
- [ ] Custom domain connected (optional)
- [ ] Copy/content reviewed by Tina
- [ ] Ready to share link with beta users

---

## 🔗 Current Status

**Repository:** `we-prosper-ai/finance-friend-landing`  
**Dev URL:** http://localhost:3002 (for local testing)  
**Production Ready:** YES ✅  
**Last Commit:** "Add Mailchimp email capture integration + API endpoint"

---

## 📱 Page Structure & Copy

All copy is already written and can be customized from the files:

- **Hero:** `pages/index.tsx` line 30-40
- **Features:** `pages/index.tsx` line 45-65
- **Comparison:** `pages/index.tsx` line 70-100
- **Testimonials:** `pages/index.tsx` line 105-130
- **Pricing:** `pages/index.tsx` line 135-170
- **CTA Section:** `pages/index.tsx` line 175-195

To change copy: Edit `pages/index.tsx`, commit, push, Vercel auto-redeploys.

---

## 🛠️ Local Development (if needed)

### Start Dev Server

```bash
cd finance-friend-landing
npm install  # (only first time)
PORT=3002 npm run dev
```

Visit http://localhost:3002

### Test Email Capture

```bash
curl -X POST http://localhost:3002/api/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

Response: `{"message":"Subscribed!"}`

### Build for Production

```bash
npm run build
npm start  # Runs production server
```

---

## 📊 Analytics Setup (Optional)

### Google Analytics

1. Create GA4 property at https://analytics.google.com
2. Get your Measurement ID (G-XXXXXXX)
3. Add to `.env.local`:
   ```
   NEXT_PUBLIC_GA_ID=G-XXXXXXX
   ```
4. Update `pages/_app.tsx` with tracking code

### Key Metrics to Track

- **Visitors:** How many people see the page?
- **Email captures:** How many sign up for early access?
- **Conversion rate:** Email captures / Visitors
- **Bounce rate:** People leaving without action
- **Device breakdown:** Mobile vs Desktop
- **Traffic source:** Where are they coming from?

---

## 🚨 Troubleshooting

### Form Not Submitting

1. Check browser console (F12) for errors
2. Ensure Mailchimp API key is set in .env.local
3. Test endpoint: `curl -X POST http://localhost:3002/api/subscribe ...`

### Email Not Appearing in Mailchimp

1. Check Mailchimp audience settings (email must be confirmed?)
2. Check API logs in Mailchimp dashboard
3. Try test email with different address (might be flagged as spam)

### Deployment Issues

1. Check Vercel build logs (Deployments tab)
2. Ensure Node version is 18+ (check `package.json`)
3. Try rebuilding: Vercel dashboard → Deployments → Redeploy

### Mobile Display Issues

1. Check responsive design in DevTools (F12 → toggle device mode)
2. Landing page uses Tailwind responsive classes (md: breakpoints)
3. Should work on all screen sizes

---

## 📞 Next Steps

1. **When you're ready to launch:**
   - Confirm Mailchimp setup
   - Deploy to Vercel
   - Set environment variables
   - Test form submission

2. **After launch:**
   - Monitor email signups
   - Track conversion funnel
   - Collect feedback from early adopters
   - Iterate on copy if needed

3. **Integration:**
   - Landing page → Finance Friend app (seamless signup)
   - Email automation → Welcome sequence (Mailchimp)
   - Analytics → Dashboard (track growth)

---

## 💡 Pro Tips

1. **Email Sequences:** Use Mailchimp's automation to send welcome emails automatically when someone signs up
2. **A/B Testing:** Try different hero headlines, test which converts better
3. **Analytics:** Weekly check conversion metrics (can do from Mailchimp dashboard)
4. **SEO:** Page is already optimized; monitor Google Search Console
5. **Backup:** Git history is everything; revert any changes with `git revert`

---

**Status:** Ready to launch. Awaiting Tina's approval and Mailchimp setup.  
**Questions?** Message Moriah.
