/**
 * Seed script — loads example teachings into the database
 *
 * Run: npm run seed
 * Also copies the example teaching from wisdom-extractor/output/
 */

import "dotenv/config";
import Database from "better-sqlite3";
import { initializeDatabase } from "../src/db/schema.js";
import { syncTeachings } from "../src/db/teachings.js";
import { upsertUser } from "../src/db/users.js";
import { createSession, addTurn } from "../src/db/sessions.js";
import fs from "fs";
import path from "path";
import { logger } from "../src/services/logger.js";

const DB_PATH = process.env.DB_PATH || "./coachtina.db";

const EXAMPLE_TEACHINGS = [
  {
    id: "teaching-four-currencies-001",
    theme: "Financial Freedom",
    title: "The Four Currencies Framework",
    core_teaching: "Money is not the primary currency. The real order of importance is: Energy → Time → Money → Freedom. Optimize in that sequence or you'll build a prison with a nice salary.",
    key_insight: "Most entrepreneurs fail because they optimize for money alone, ignoring energy depletion and time cost. This creates a wealth-trap: more money but less freedom.",
    quote: "\"The problem is not that you don't have money. The problem is that you're not controlling where it goes — and even worse, where your time and energy go.\"",
    action_steps: [
      "Rate your current state 1-10 for each currency: money, time, energy, freedom",
      "Identify the ONE currency you've been ignoring most",
      "Calculate the true hourly rate of your business (revenue ÷ hours worked)",
      "Find the top 3 energy drains you can eliminate or delegate this week",
      "Set a 90-day target score for your lowest-rated currency",
    ],
    case_study: {
      client_name: "Agency Owner (anonymized)",
      situation: "Working 50+ hours/week, $250K revenue, exhausted, no time with family",
      before: { hours_per_week: 50, annual_revenue: "$250K", energy: "3/10", freedom: "2/10" },
      after: { hours_per_week: 25, annual_revenue: "$380K", energy: "8/10", freedom: "8/10" },
      timeline: "6 months",
      results: "52% revenue increase while cutting work hours in half by restructuring offers and delegating delivery.",
    },
    related_ids: ["teaching-leverage-001", "teaching-revenue-models-001"],
    course_module: "Fundamentals of Freedom",
    curriculum_ref: "Module 1 / Lesson 1.1",
    currency_tags: ["money", "time", "energy", "freedom"],
  },
  {
    id: "teaching-revenue-models-001",
    theme: "Business Models",
    title: "The Three Revenue Models",
    core_teaching: "Model A (services) = trading time for money, ceiling $500K. Model B (products) = built once, sold infinitely, ceiling $1M+. Model C (hybrid) = services fund product development, unlimited ceiling. Most entrepreneurs are trapped in Model A and don't know it.",
    key_insight: "If you're trading time for money, you're not a business — you're a job. A very stressful job with no HR department.",
    quote: "\"Your revenue model is not just how you make money. It's a bet on what your future looks like. Model A bets you'll always have energy. That's a losing bet.\"",
    action_steps: [
      "Identify which model you're currently in (be honest)",
      "Calculate your effective hourly rate: total revenue ÷ total hours (including admin, sales, delivery)",
      "Map what would need to be true to shift to Model B or C",
      "Identify one piece of productizable knowledge you already have",
      "Set a 12-month revenue ceiling assuming you stay in your current model",
    ],
    course_module: "Foundation",
    curriculum_ref: "Module 1 / Lesson 1.3",
    currency_tags: ["money", "time", "freedom"],
  },
  {
    id: "teaching-leverage-001",
    theme: "Scaling",
    title: "The Three Types of Leverage",
    core_teaching: "There are only three ways to scale without burning out: product leverage (code, content, templates), team leverage (delegation), and capital leverage (money working for you). Most entrepreneurs rely on zero leverage.",
    key_insight: "You don't have a capacity problem. You have a leverage problem. More effort is not the answer — different effort is.",
    quote: "\"Stop calling it scaling. If you're just planning to work more hours to make more money you don't have time to enjoy — that's not scaling. That's drowning faster.\"",
    action_steps: [
      "List every task you did last week",
      "Mark each: Only I can do this / Someone could do this with training / Could be automated",
      "Calculate time spent on non-essential tasks",
      "Choose your first leverage type: product, team, or capital",
      "Design one piece of leverage you can build in the next 30 days",
    ],
    related_ids: ["teaching-revenue-models-001", "teaching-delegation-001"],
    course_module: "Foundation",
    curriculum_ref: "Module 1 / Lesson 1.2",
    currency_tags: ["time", "money", "freedom"],
  },
  {
    id: "teaching-constraint-001",
    theme: "Diagnosis",
    title: "Finding Your Real Constraint",
    core_teaching: "Your business has exactly one primary constraint right now. Everything else is noise. Most entrepreneurs work on the wrong thing because they don't want to face the real constraint — usually themselves.",
    key_insight: "Your intuition about your bottleneck is almost always wrong. The real constraint is usually 2-3 layers deeper than your first answer.",
    quote: "\"List everything that could be better. That list is not your problem list. That list is symptoms. The constraint is the one thing that, if you fixed it, would make many of those symptoms disappear.\"",
    action_steps: [
      "List every problem in your business right now",
      "Ask: which of these is causing the others? (repeat 3 times)",
      "Score each remaining problem by impact × urgency",
      "Name the one constraint you've been avoiding",
      "Block 4 hours this week to work only on that constraint",
    ],
    course_module: "Diagnosis",
    curriculum_ref: "Module 2 / Lesson 2.1",
    currency_tags: ["time", "energy", "money"],
  },
  {
    id: "teaching-unfair-advantage-001",
    theme: "Positioning",
    title: "Your Unfair Advantage",
    core_teaching: "You have knowledge, experience, or access that is genuinely rare — most people just can't see it because it feels obvious to them. Your unfair advantage is always worth more than you think it is.",
    key_insight: "The things you think everyone knows are the things most people would pay significantly to learn. The gap between your expertise and the market's ignorance is your monetizable edge.",
    quote: "\"Stop asking what the market wants and start asking what you know that the market desperately needs but doesn't yet know to ask for.\"",
    action_steps: [
      "List 10 things you know how to do that most people in your industry don't",
      "Ask 5 clients or peers: What do you think I'm uniquely good at?",
      "Identify the intersection of your knowledge, your passion, and market demand",
      "Rank your advantages by defensibility — which would be hardest to copy?",
      "Build your next offer around your most defensible advantage",
    ],
    course_module: "Diagnosis",
    curriculum_ref: "Module 2 / Lesson 2.3",
    currency_tags: ["money", "freedom"],
  },
  {
    id: "teaching-energy-management-001",
    theme: "Sustainability",
    title: "Energy-Based Work Design",
    core_teaching: "High body energy + low brain focus → get physical (weights, movement — not admin). High brain energy + low body → deep thinking work. Medium everything → client calls. Low everything → rest. Fighting your energy state is always a losing strategy.",
    key_insight: "Most productivity advice is written for robots. You're not a machine — you have energy cycles. Work with them instead of against them and you'll accomplish more in 6 hours than most people do in 10.",
    quote: "\"Don't fight your energy state. The entrepreneur who tries to do deep strategy work when they're scattered and anxious is burning two currencies at once: time AND energy.\"",
    action_steps: [
      "Track your energy state every hour for 5 days (high/medium/low body + brain)",
      "Identify your peak mental hours (most people: 2-4 hours in morning)",
      "Schedule all deep thinking work during your peak hours — non-negotiable",
      "Create a 'high physical energy' protocol (what you do when scattered)",
      "Eliminate all low-value work during your peak mental hours",
    ],
    course_module: "The Four Currencies at Scale",
    curriculum_ref: "Module 6 / Lesson 6.3",
    currency_tags: ["energy", "time", "freedom"],
  },
  {
    id: "teaching-pricing-001",
    theme: "Pricing Strategy",
    title: "Value-Based Pricing",
    core_teaching: "Price is not a reflection of your cost or your time. Price is a communication of value. Underpricing trains clients to undervalue you. Most service providers are underpriced by 30-200% and don't know it.",
    key_insight: "The problem isn't that you can't raise prices. The problem is you don't believe you deserve higher prices. That's a confidence issue dressed up as a market issue.",
    quote: "\"Your pricing is the first thing a client uses to assess whether you're worth their time. If you price low trying to remove objections, you often create the biggest objection of all: 'This seems too cheap to be the real thing.'\"",
    action_steps: [
      "Calculate the value your clients receive in the first 90 days of working with you",
      "Identify what your ideal client currently pays to solve the problem you solve",
      "Test a 25% price increase with your next 3 inquiries",
      "Create a premium version of your offer at 2-3x current price",
      "Track win/loss rates at new pricing for 30 days before adjusting",
    ],
    course_module: "Optimize",
    curriculum_ref: "Module 7 / Lesson 7.2",
    currency_tags: ["money", "freedom"],
  },
  {
    id: "teaching-delegation-001",
    theme: "Team & Systems",
    title: "The Delegation Framework",
    core_teaching: "You should only be doing three types of work: things only you can do, things you're teaching someone to do, and nothing. Everything else is already delegatable — you just haven't decided to delegate it yet.",
    key_insight: "Entrepreneurs don't fail to delegate because they lack options. They fail to delegate because they don't trust, don't want to train, or secretly believe the business can't run without them. The last one is usually the real reason.",
    quote: "\"If your business can't operate for two weeks without you, you don't have a business. You have a job — and it's a terrible one because you can never quit.\"",
    action_steps: [
      "Do a full time audit: document every task for 5 working days",
      "Mark each task: Unique value (only me) / Teachable / Already automatable",
      "Calculate the dollar value of your non-unique tasks",
      "Hire for or automate one task this week — start small",
      "Build a simple playbook for the first task you're delegating",
    ],
    course_module: "Design",
    curriculum_ref: "Module 3 / Lesson 3.3",
    currency_tags: ["time", "energy", "freedom"],
  },
  {
    id: "teaching-cash-flow-001",
    theme: "Financial Architecture",
    title: "Why Profitable Businesses Still Fail",
    core_teaching: "Revenue is vanity. Profit is sanity. Cash is reality. Most entrepreneurs know their revenue. Almost none know their actual cash position or burn rate. You can be profitable on paper and out of business in 90 days.",
    key_insight: "Cash flow is not an accounting problem. It's a product design problem. If you redesign your offers to collect money before you deliver, your cash flow problems disappear.",
    quote: "\"The moment you understand that cash flow is a product design problem, you stop waiting on invoices and start redesigning how you sell.\"",
    action_steps: [
      "Map exactly when cash comes in vs. when costs go out (month by month)",
      "Calculate your runway: how many months could you operate with zero new revenue?",
      "Identify one offer you could restructure to collect payment upfront",
      "Implement a basic cash reserve rule (e.g. 3 months operating costs always in account)",
      "Review all outstanding invoices — what would it take to cut payment terms in half?",
    ],
    course_module: "Optimize",
    curriculum_ref: "Module 7 / Lesson 7.3",
    currency_tags: ["money", "freedom"],
  },
  {
    id: "teaching-vision-001",
    theme: "Vision & Leadership",
    title: "Designing Backwards from Freedom",
    core_teaching: "Most entrepreneurs build businesses and hope freedom shows up eventually. It doesn't. Freedom must be designed into the architecture of the business from day one. Start with your vision of freedom, then design the business that produces it.",
    key_insight: "You can't accidentally build a business that gives you freedom. Freedom at $100K looks different from freedom at $0. The business you need is not the same — so start there.",
    quote: "\"Define your version of freedom first. Then ask: what business, at what size, with what team, delivering what, would generate that freedom? Build that business. Not the business everyone else is building.\"",
    action_steps: [
      "Write a clear description of your ideal day 3 years from now (be specific: time, activities, where you are)",
      "Define your Four Currencies targets: what score on each currency = freedom for you?",
      "Map the business that would produce those scores",
      "Identify the biggest gap between today's business and that vision",
      "Choose one thing to change in the next 90 days that closes that gap",
    ],
    course_module: "The Vision",
    curriculum_ref: "Module 8 / Lesson 8.1",
    currency_tags: ["money", "time", "energy", "freedom"],
  },
];

async function seed() {
  logger.info({ db: DB_PATH }, "Starting seed...");

  const db = initializeDatabase(DB_PATH);

  // Load wisdom-extractor example teaching if it exists
  const wisdomPath = path.resolve("../wisdom-extractor/output/EXAMPLE_TEACHING.json");
  let extraTeachings: typeof EXAMPLE_TEACHINGS[0][] = [];

  if (fs.existsSync(wisdomPath)) {
    try {
      const raw = JSON.parse(fs.readFileSync(wisdomPath, "utf-8"));
      // Adapt to our schema
      extraTeachings = [{
        id: raw.id || "teaching-from-extractor-001",
        theme: raw.theme || "Financial Freedom",
        title: raw.title,
        core_teaching: raw.core_teaching,
        key_insight: raw.key_insight,
        quote: raw.quote,
        action_steps: raw.action_steps,
        case_study: raw.case_study,
        related_ids: raw.related_teachings,
        course_module: raw.course_module,
        curriculum_ref: undefined,
        currency_tags: ["money", "time", "energy", "freedom"] as ("money" | "time" | "energy" | "freedom")[],
      }];
      logger.info("Loaded example teaching from wisdom-extractor");
    } catch (e) {
      logger.warn("Could not load wisdom-extractor example");
    }
  }

  // Sync all teachings
  const allTeachings = [...EXAMPLE_TEACHINGS, ...extraTeachings];
  const result = syncTeachings(db, { source: "seed", teachings: allTeachings });
  logger.info(result, "Teachings seeded");

  // Create demo users
  const demoUsers = [
    {
      id: "demo-user-001",
      external_id: "stripe_cus_demo001",
      name: "Alex Rivera",
      email: "alex@example.com",
      plan: "monthly" as const,
      currencies_baseline: { money: 6, time: 3, energy: 5, freedom: 4 },
    },
    {
      id: "demo-user-002",
      name: "Jordan Chen",
      email: "jordan@example.com",
      plan: "annual" as const,
      currencies_baseline: { money: 7, time: 4, energy: 6, freedom: 5 },
    },
    {
      id: "demo-user-free",
      name: "Free User",
      email: "free@example.com",
      plan: "free" as const,
    },
  ];

  for (const u of demoUsers) {
    upsertUser(db, u);
  }
  logger.info(`Created ${demoUsers.length} demo users`);

  // Create a demo session with some history for Alex
  const session = createSession(db, { user_id: "demo-user-001", topic: "scaling revenue without burning out" });

  addTurn(db, {
    session_id: session.id,
    role: "user",
    content: "I'm making $180K/year but working 55+ hours a week and I'm completely burned out. I want to make more but I literally have no more hours to give.",
  });

  addTurn(db, {
    session_id: session.id,
    role: "assistant",
    content: "55 hours a week and burned out. Got it. Before I say anything, I need to understand your actual situation. Walk me through your revenue — how many clients, what do you charge them, and roughly how is your time split between finding new clients and serving existing ones?",
    phase: "probe",
    teaching_ids: ["teaching-leverage-001", "teaching-revenue-models-001"],
  });

  addTurn(db, {
    session_id: session.id,
    role: "user",
    content: "I have 8 ongoing clients at around $2K/month each. About 70% of my time is delivery, 30% is sales/admin. I've tried to hire but the person I brought on needed too much management.",
  });

  addTurn(db, {
    session_id: session.id,
    role: "assistant",
    content: `What you're describing is a leverage problem — specifically a product leverage problem masquerading as a capacity problem.

Here's the pattern: You've maxed out at 8 clients × $2K at 55 hours/week. Adding a 9th client doesn't fix this — it makes it worse. And your hiring attempt failed because you tried to hire before you had documented systems, so you were essentially managing chaos.

This connects to Business Fundamental #3: Time Mastery, and it's blocked by Fundamental #7: Operations & Systems.

You have three paths:

**Path A: Raise prices, serve fewer clients.** 5 clients at $3.5K = same revenue, 30% less work. Immediate relief. Doesn't solve the ceiling problem but buys you breathing room.

**Path B: Productize one piece of your delivery.** What's the most repetitive part of your client work? That's your first product. Turn it into something clients can use without your time.

**Path C: Systems-first hiring.** Spend 2 weeks documenting your delivery process before you hire. Then hire to the documentation.

Which of these feels most immediately relevant to where you are right now?`,
    phase: "advise",
    teaching_ids: ["teaching-leverage-001", "teaching-delegation-001", "teaching-pricing-001"],
  });

  logger.info({ session_id: session.id }, "Demo session created");

  logger.info("✅ Seed complete. Database ready.");
  logger.info(`   Teachings: ${allTeachings.length}`);
  logger.info(`   Demo users: ${demoUsers.length}`);
  logger.info(`   Demo session: ${session.id}`);

  db.close();
}

seed().catch((err) => {
  logger.error(err, "Seed failed");
  process.exit(1);
});
