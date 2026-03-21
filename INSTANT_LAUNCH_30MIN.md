# Launch Finance Friend in 30 Minutes

**If Tina says "Launch Finance Friend", execute this exactly.**

---

## Option 1: Launch on Vercel (Fastest — 15 minutes)

### Step 1: Install Vercel CLI (2 min)
```bash
npm install -g vercel
```

### Step 2: Deploy Backend (5 min)
```bash
cd /home/moriahkeeper/.openclaw/workspace/finance-friend-v3/backend
vercel --prod --name finance-friend-api
# Takes 5 min
# Get URL: https://finance-friend-api.vercel.app
```

### Step 3: Deploy Frontend (5 min)
```bash
cd /home/moriahkeeper/.openclaw/workspace/finance-friend-v3/client
# Update .env.production to point to Vercel backend
echo "VITE_API_URL=https://finance-friend-api.vercel.app" > .env.production
npm run build
vercel --prod --name finance-friend
# Takes 5 min
# Get URL: https://finance-friend.vercel.app
```

### Step 4: Test (2 min)
```bash
# Visit: https://finance-friend.vercel.app
# Sign up
# Upload CSV
# See dashboard
```

### Step 5: Go Live (1 min)
- Send URL to customers
- Announce on Twitter/email
- Monitor server logs

**Total time: 15 minutes**

---

## Option 2: Self-Hosted (More Control — 30 minutes)

### Step 1: SSH to Your Server (1 min)
```bash
ssh user@yourserver.com
```

### Step 2: Clone Code (2 min)
```bash
git clone https://github.com/yourusername/finance-friend-v3.git
cd finance-friend-v3
```

### Step 3: Install & Build (10 min)
```bash
# Backend
cd backend
npm install
npm start > /var/log/ff-backend.log 2>&1 &

# Frontend
cd ../client
npm install
npm run build
npm run preview > /var/log/ff-frontend.log 2>&1 &
```

### Step 4: Configure Nginx (10 min)
```bash
# Create Nginx config
sudo nano /etc/nginx/sites-available/finance-friend
# Paste config (see scripts/deploy-ff-v3-production.sh)

# Enable it
sudo ln -s /etc/nginx/sites-available/finance-friend /etc/nginx/sites-enabled/
sudo systemctl restart nginx
```

### Step 5: Test (3 min)
```bash
# Visit: https://yourserver.com
# Sign up, upload, verify
```

### Step 6: Set Up Monitoring (4 min)
```bash
sudo bash scripts/deploy-ff-v3-production.sh yourserver.com
```

**Total time: 30 minutes**

---

## Option 3: Railway (Middle Ground — 20 minutes)

Railway is between Vercel and self-hosted. Good balance.

```bash
# 1. Sign up at railway.app
# 2. Connect GitHub
# 3. Deploy backend (5 min)
# 4. Deploy frontend (5 min)
# 5. Configure env vars (5 min)
# 6. Test (2 min)
# 7. Get live URL and share
```

**Total time: 20 minutes**

---

## My Recommendation: Vercel (Fastest)

**Why:**
- Fastest deployment (15 min)
- No server to manage
- Automatic HTTPS
- Automatic scaling
- $0-20/month cost (MVP)
- Easy to iterate

**Steps:**
1. `npm install -g vercel`
2. `cd backend && vercel --prod`
3. `cd ../client && vercel --prod`
4. Test
5. Share URL with customers

---

## What to Send Customers

Once live:

```
🚀 Finance Friend is now available!

Track your spending with AI insights.
Upload your bank statement. Get instant dashboard + recommendations.

Sign up free: https://finance-friend.vercel.app

Free tier: 2 uploads/month
Pro: $7/month (unlimited)
```

---

## First Day Checklist

```
✅ Site is live (customers can access)
✅ Sign up works (test with real email)
✅ Upload works (test with sample data)
✅ Dashboard works (verify insights generate)
✅ Chat works (ask question, get answer)
✅ Email notifications (if enabled)
✅ Payment processing (Stripe setup)
✅ Monitoring (alert on errors)
```

---

## Troubleshooting

**"Vercel deployment failed"**
- Check logs: `vercel logs`
- Ensure env vars are set
- Verify code compiles locally first: `npm run build`

**"Frontend can't reach backend API"**
- Update API URL in frontend .env
- Ensure backend is actually running
- Check CORS settings in backend

**"Database connection error"**
- For SQLite: Should work out of box
- For PostgreSQL: Verify connection string
- Check file permissions

**"Site loads but dashboard is empty"**
- You might not be logged in (check console)
- Try uploading a file
- Check browser console for errors

---

## Revenue Setup (After Launch)

**1. Add Stripe**
```bash
npm install stripe
# Add payment endpoints to backend
```

**2. Create Pricing Page**
- Free: 2 uploads/month
- Pro: $7/month (unlimited)
- Business: $77/month (team features)

**3. Test Payments**
- Use Stripe test keys
- Create test subscription
- Verify it works end-to-end

**4. Announce**
- Email list
- Twitter
- Reddit
- Hacker News

---

**That's it. Go live and start getting paying customers.**

🏔️ Moriah
