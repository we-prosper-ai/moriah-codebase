# Email Platform Decision: ConvertKit (Kit) vs Beehiiv
*Prepared by Moriah — March 21, 2026 | For Tina Marie's decision*

## The Question
Finance Friend landing page is live at https://finance-friend-landing.vercel.app
Email capture form is collecting signups — but without a real ESP connected, they're only logging to Vercel console (not persisted). Tina needs to pick a platform to actually capture and nurture the waitlist.

---

## ✅ RECOMMENDATION: Start with Kit (ConvertKit) Free Plan

**Why:** 10,000 subscriber free tier, automation on free plan, sells digital products on free plan. Zero upfront cost. Scales cleanly.

---

## ConvertKit (Kit)

**Pricing:**
- Free up to 10,000 subscribers ✅
- Creator plan: ~$33/mo at 1,000 subscribers (if you need full automations)

**Pros:**
- ✅ Largest free tier of any serious ESP (10k subs free)
- ✅ Visual automation builder — welcome sequences are easy
- ✅ Sell digital products + paid newsletters on free plan
- ✅ Excellent form embeds (drop into landing page trivially)
- ✅ Strong deliverability reputation

**Cons:**
- ❌ Expensive at scale ($116+/mo at 10k subscribers on paid plan)
- ❌ Price hiked in Sept 2025 — some creator backlash
- ❌ UI feels dated vs Beehiiv

---

## Beehiiv

**Pricing:**
- Free up to 2,500 subscribers
- Scale plan: $49/mo at 1,000 subscribers

**Pros:**
- ✅ Built for newsletters — beautiful publishing/web presence
- ✅ Built-in ad network + monetization tools
- ✅ Better SEO and newsletter hosting
- ✅ More cost-effective at scale (10k subs = $109/mo vs Kit's $116/mo)

**Cons:**
- ❌ Automations locked to paid plans (need $49/mo for welcome sequences)
- ❌ Only 2,500 subs free — Kit gives 10k
- ❌ Monetization/ads only relevant once you have an audience

---

## Decision Framework

| Situation | Pick |
|-----------|------|
| Starting from zero, want free welcome automation | **Kit** |
| Planning a newsletter-first business with monetization | **Beehiiv** |
| Budget = $0 right now | **Kit** (10k free subs wins) |
| Already have 2,500+ subscribers | **Beehiiv** (better scaling) |

**Finance Friend is pre-launch, budget-conscious, needs welcome sequence now → Kit wins.**

---

## Next Steps (15 minutes to set up)

1. Sign up at https://app.convertkit.com (free)
2. Create a Form → get the embed code
3. Replace the Mailchimp URL in `finance-friend-landing/server/index.ts` with Kit's API endpoint
4. Add `CONVERTKIT_API_KEY` and `CONVERTKIT_FORM_ID` to Vercel env vars
5. The welcome sequence in `EMAIL_SEQUENCE_WELCOME.md` is ready to load in

**Tina's action:** Sign up + send Moriah the API key and Form ID. Moriah handles the integration.

---

*Sources: EmailToolTester, G2, Reddit r/Entrepreneur, Beehiiv/Kit official pricing pages*
