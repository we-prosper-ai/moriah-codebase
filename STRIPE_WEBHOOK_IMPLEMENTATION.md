# Stripe Webhook Implementation
**For:** Finance Friend v2 & v3  
**Created:** March 21, 2026  
**Purpose:** Handle payment completion without user waiting

---

## The Problem

Right now, when someone pays:
1. They click "Upgrade"
2. Stripe processes payment
3. They wait for page to refresh
4. Access is granted

**This is clunky.** Real apps use webhooks: Stripe tells YOUR server when payment completed. YOUR server grants access immediately.

---

## How Webhooks Work

```
User pays → Stripe confirms → Stripe sends webhook to YOUR SERVER →
YOUR SERVER checks payment → Updates user to "premium" → Done
```

**No user waiting. No refresh needed. Just works.**

---

## Part 1: Enable Webhooks in Stripe

### 1a. Create Webhook Endpoint
1. Go to **stripe.com/dashboard**
2. Go to "Webhooks" (left sidebar)
3. Click "Add Endpoint"
4. Enter URL: `https://your-domain.com/api/stripe/webhook`
5. Select events: `payment_intent.succeeded` + `customer.subscription.updated`
6. Click "Create Endpoint"
7. Copy your signing secret (starts with `whsec_`)

### 1b. Add to Environment Variables
```
STRIPE_WEBHOOK_SECRET=whsec_your_secret_here
```

---

## Part 2: Implement Webhook Handler

### Backend Code (Express.js)

```typescript
// routes/stripe.ts

import express, { Request, Response } from 'express';
import Stripe from 'stripe';
import { db } from '../db';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');
const router = express.Router();
const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || '';

// Important: This route should NOT have auth middleware
// Stripe won't include auth headers
router.post('/webhook', express.raw({type: 'application/json'}), async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return res.status(400).send(`Webhook Error: ${err}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object;
      const userId = paymentIntent.metadata?.userId;

      if (userId) {
        // Update user to premium
        const stmt = db.prepare(`
          UPDATE users 
          SET subscription_status = 'active', subscription_tier = 'premium'
          WHERE id = ?
        `);
        stmt.run(userId);
        console.log(`✅ User ${userId} upgraded to premium`);
      }
      break;
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object;
      const userId = subscription.metadata?.userId;

      if (subscription.cancel_at_period_end) {
        // User cancelled
        const stmt = db.prepare(`
          UPDATE users 
          SET subscription_status = 'cancelling'
          WHERE id = ?
        `);
        stmt.run(userId);
        console.log(`✅ User ${userId} cancelled (will end at period end)`);
      }
      break;
    }

    case 'customer.subscription.deleted': {
      // Subscription ended
      const subscription = event.data.object;
      const userId = subscription.metadata?.userId;

      const stmt = db.prepare(`
        UPDATE users 
        SET subscription_status = 'inactive', subscription_tier = 'free'
        WHERE id = ?
      `);
      stmt.run(userId);
      console.log(`✅ User ${userId} subscription ended, reverted to free`);
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  // Always respond with 200 to Stripe (we processed it)
  res.json({received: true});
});

export default router;
```

### Add to Main Server

```typescript
// server/src/index.ts

import stripeWebhookRouter from './routes/stripe';

// Add BEFORE other middleware
// Webhook must be raw body, not JSON
app.use('/api/stripe', stripeWebhookRouter);

// THEN add JSON middleware
app.use(express.json());

// Then other routes
app.use('/api/auth', authRouter);
app.use('/api/dashboard', dashboardRouter);
// ... etc
```

---

## Part 3: Test Webhook Locally

### Using Stripe CLI

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Listen for webhooks
stripe listen --forward-to localhost:3000/api/stripe/webhook

# You'll get a signing secret - use this for STRIPE_WEBHOOK_SECRET
```

### Trigger Test Event

```bash
stripe trigger payment_intent.succeeded --stripe-object=payment_intent \
  --add stripe_object.metadata.userId=test-user-123
```

### Check Your Logs
Your server should log: `✅ User test-user-123 upgraded to premium`

---

## Part 4: Update Payment Flow

### When User Clicks "Upgrade"

**Old flow:**
```typescript
const response = await stripe.checkout.sessions.create({
  payment_method_types: ['card'],
  line_items: [{...}],
  success_url: 'https://example.com/success',
  cancel_url: 'https://example.com/cancel',
  // User waits for redirect
});
```

**New flow:**
```typescript
const response = await stripe.checkout.sessions.create({
  payment_method_types: ['card'],
  line_items: [{...}],
  success_url: 'https://example.com/success', // Still needed for redirect message
  cancel_url: 'https://example.com/cancel',
  metadata: {
    userId: user.id, // Stripe will return this in webhook
  },
  // Don't wait for subscription - webhook will handle it
});
```

### Frontend: Don't Wait for Subscription

**Old (bad):**
```typescript
// Wait for user to be premium
while (user.tier !== 'premium') {
  await wait(1000);
  user = await getUser();
}
// Tell them they're upgraded
```

**New (good):**
```typescript
// Show loading state
window.location.href = checkoutSession.url;
// Stripe redirects to success_url
// Meanwhile, webhook updates their subscription in background
// They see "Congratulations!" page
// When they reload dashboard, they're premium
```

---

## Part 5: Test in Production

### 1. Deploy code to production first (without webhook yet)

### 2. Test with Stripe Test Card
```
Card Number: 4242 4242 4242 4242
Exp: 12/25
CVC: 123
```

This won't charge your account. It's a test card.

### 3. Verify Webhook
1. Go to Stripe Dashboard > Webhooks
2. Your endpoint should show successful deliveries
3. Check your app logs - user should be upgraded

### 4. Test with Real Card (tiny amount)
- Charge $0.01 to make sure real payments work
- Verify in Stripe Dashboard
- Check your app logs
- Confirm user is upgraded

---

## Part 6: Database Changes

Add these columns to users table:

```sql
ALTER TABLE users ADD COLUMN subscription_status TEXT DEFAULT 'inactive';
ALTER TABLE users ADD COLUMN subscription_tier TEXT DEFAULT 'free';
ALTER TABLE users ADD COLUMN stripe_customer_id TEXT;
ALTER TABLE users ADD COLUMN stripe_subscription_id TEXT;
ALTER TABLE users ADD COLUMN subscription_ends_at DATETIME;
```

---

## Error Handling

### If Webhook Fails
Stripe will retry for 3 days. But you should still handle failures:

```typescript
try {
  // Update user
  const stmt = db.prepare(`UPDATE users SET subscription_tier = 'premium' WHERE id = ?`);
  stmt.run(userId);
  res.json({received: true});
} catch (error) {
  console.error('Webhook handler error:', error);
  // Log to error tracking (LogRocket, Sentry, etc.)
  // Return 500 so Stripe retries
  res.status(500).json({error: 'Processing failed'});
}
```

### If User Claims They Paid But Aren't Premium
1. Check Stripe Dashboard → Payments
2. See if payment succeeded
3. Check your server logs
4. Manually update their subscription if needed

---

## Checklist

- [ ] Create Stripe webhook endpoint
- [ ] Copy webhook signing secret to .env
- [ ] Implement webhook handler (above code)
- [ ] Add webhook router to main server
- [ ] Test locally with Stripe CLI
- [ ] Deploy to production
- [ ] Test with test card
- [ ] Test with real card ($0.01)
- [ ] Verify dashboard shows upgrade immediately
- [ ] Set up error alerts (LogRocket, Sentry, email)

---

## Real-World: What Happens

1. User clicks "Upgrade" → Stripe checkout
2. User enters card → Stripe processes
3. Stripe sends webhook to YOUR SERVER
4. YOUR SERVER updates user to premium
5. User sees "Success!" page
6. User refreshes dashboard → NOW they see premium features
7. No confusion. No waiting. Just works.

**This is how real SaaS apps work.**

---

**Total setup time: 1 hour**  
**Cost: $0**  
**Benefit: Professional payment experience**

— Moriah
