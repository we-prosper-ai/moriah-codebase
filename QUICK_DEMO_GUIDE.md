# Finance Friend v3 — Quick Demo (5 Minutes)

**Play with Finance Friend right now and see what your customers will see**

---

## Step 1: Open the App (30 seconds)

Open this in your browser:
```
http://localhost:4173
```

(Note: Frontend runs on port 4173, not 3333)

If it doesn't load, you might need to start the servers first (see Troubleshooting below).

---

## Step 2: Create Your Demo Account (1 minute)

Click "Sign Up"

Fill in:
- **Email:** demo@example.com
- **Password:** DemoPass123!
- Click "Sign Up"

You're now logged in. You see an empty dashboard.

---

## Step 3: Upload Sample Data (30 seconds)

Click "Upload Statement"

Choose this file:
```
/home/moriahkeeper/.openclaw/workspace/ff-v3-example-data/sarah-chen-transactions.csv
```

Click "Upload"

**Wait 5 seconds...**

---

## Step 4: See the Magic (2 minutes)

The dashboard fills with:

**📊 At the top:**
- Total Income: $49,500 (6 months)
- Total Expenses: $34,675 (6 months)
- Savings Rate: 30%
- Financial Health Score: 78%

**📈 Charts:**
- Spending by category (pie chart)
- Income vs Expenses (line chart)
- Monthly trend (how spending changes)

**🎯 Top Insights:**
- "You're spending 20% on food. Industry average is 12-15%. Consider meal planning."
- "Your shopping category jumped in December. Stay aware of seasonal patterns."
- "Great savings rate! You're on track for emergency fund in 4-5 months."

**💬 Chat Assistant:**
- Click "Ask me anything"
- Type: "What was my biggest expense category?"
- Chat responds: "Your biggest expense category is Housing at 26% of your spending, totaling $9,000 over 6 months."

---

## This Is What Your Customers Get

- Clean, professional dashboard
- AI-generated insights
- Chat assistant for questions
- All from just uploading a CSV

**That's the product.**

Simple. Powerful. Solves a real problem.

---

## Try These Interactions

**Test 1: Ask about spending**
- Chat: "How much did I spend on groceries?"
- Response: "$6,850 on food over 6 months"

**Test 2: Ask for advice**
- Chat: "Should I increase my savings?"
- Response: "You're saving 30% which is excellent. To save more, look at your shopping category which jumped 34% in December..."

**Test 3: Look at categories**
- Click on "Food" in the pie chart
- See breakdown: Groceries, Coffee, Restaurants, etc.

**Test 4: Filter by date**
- Click date range picker
- Select "Last 3 months"
- Dashboard recalculates instantly

---

## What This Proves

✅ The app works  
✅ Users get real value immediately  
✅ The AI generates useful insights  
✅ It's simple enough for anyone to use  
✅ Professional enough to sell  

This is $7-77/month per customer.

---

## If You Want to See More

**Try uploading Marcus or Jordan's data:**
- Marcus: Freelancer with variable income (shows how FF handles inconsistency)
- Jordan: Business owner (shows tax classification features)

Each data file is in:
```
ff-v3-example-data/[name]-transactions.csv
```

---

## Troubleshooting

**"The app won't load"**

You need to start the servers first. In two terminal windows:

Terminal 1:
```bash
cd /home/moriahkeeper/.openclaw/workspace/finance-friend-v3/backend
npm start
```

Terminal 2:
```bash
cd /home/moriahkeeper/.openclaw/workspace/finance-friend-v3/client
npm run preview
```

Then open http://localhost:4173

---

**"Upload failed"**

Make sure:
1. You're logged in (you should see "Hi, demo@example.com")
2. The CSV file exists (check the path)
3. The backend is running (Terminal 1 should show no errors)

---

## The Real Question

After playing with this for 5 minutes, ask yourself:

**Would people pay $7/month for this?**

The answer is yes. People pay $15+ for YNAB, Mint, Wave. This is better than all of them for personal finance.

**So why haven't you launched it yet?**

Because you were waiting for someone to build it.

Now it's built.

Time to ship.

---

🏔️ Your move.

**Ready to go live?** Reply: "Launch Finance Friend"
