# Build CoachTinaMarie — 5-Hour Sprint Plan

**Status:** Ready to execute when transcripts are processed  
**Duration:** 4-5 hours (coding hours, not wall-clock time)  
**Trigger:** Wisdom extractor completes, teachings available in API  

---

## Pre-Build Checklist

- [ ] Wisdom extractor running (API available at localhost:4001)
- [ ] Wisdom extractor contains 300+ extracted teachings
- [ ] COACHTINA_ARCHITECTURE_PLAN.md reviewed and locked
- [ ] ANTHROPIC_API_KEY configured
- [ ] 5-hour uninterrupted coding window available

---

## Build Sprint Schedule

### Hour 1: Foundation (Boilerplate + Database)

**Goals:**
- Project initialized with all dependencies
- SQLite database created with schema
- All TypeScript types defined
- Authentication system built and tested

**Code to Write:**

#### 1a. `src/types.ts` (150 lines)
```typescript
// User types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'solopreneur' | 'ceo' | 'coach' | 'creator' | 'other';
  stage: 'just_started' | 'early_revenue' | 'scaling' | 'plateaued' | 'declining';
  goals: string[];
  subscription_status: 'free' | 'trial' | 'active' | 'paused' | 'cancelled';
  created_at: number;
}

// Teaching types
export interface Teaching {
  id: string;
  title: string;
  core_concept: string;
  insight: string;
  quotes: string[];
  action_steps: string[];
  case_studies: string[];
  modules: string[]; // Which fundamentals
  theme: string;
  created_at: number;
}

// Conversation types
export interface Conversation {
  id: string;
  user_id: string;
  teaching_id?: string;
  messages: ConversationTurn[];
  context_snapshot: Record<string, any>;
  status: 'active' | 'archived';
  created_at: number;
  updated_at: number;
}

export interface ConversationTurn {
  id: string;
  role: 'user' | 'coach';
  content: string;
  type?: 'question' | 'insight' | 'action' | 'reflection';
  metadata?: {
    coaching_intent?: string;
    teaching_cited?: string;
  };
  created_at: number;
}

// API request/response types
export interface ChatMessageRequest {
  conversation_id: string;
  message: string;
  coaching_context?: {
    focus?: string;
    challenge?: string;
  };
}

export interface ChatMessageResponse {
  turn_id: string;
  coach_response: string;
  type: string;
  teaching_cited?: string;
  suggested_action?: string;
  follow_up_time?: string;
}
```

#### 1b. `src/db.ts` (200 lines)
```typescript
import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data', 'coachtina.db');

export const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

export function initializeDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'solopreneur',
      stage TEXT NOT NULL DEFAULT 'just_started',
      goals TEXT DEFAULT '[]',
      subscription_status TEXT DEFAULT 'free',
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS teachings (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      core_concept TEXT NOT NULL,
      insight TEXT,
      quotes TEXT DEFAULT '[]',
      action_steps TEXT DEFAULT '[]',
      case_studies TEXT DEFAULT '[]',
      modules TEXT DEFAULT '[]',
      theme TEXT NOT NULL,
      created_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS conversations (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      teaching_id TEXT,
      context_snapshot TEXT,
      status TEXT DEFAULT 'active',
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (teaching_id) REFERENCES teachings(id)
    );

    CREATE TABLE IF NOT EXISTS conversation_turns (
      id TEXT PRIMARY KEY,
      conversation_id TEXT NOT NULL,
      role TEXT NOT NULL,
      content TEXT NOT NULL,
      type TEXT,
      metadata TEXT,
      created_at INTEGER NOT NULL,
      FOREIGN KEY (conversation_id) REFERENCES conversations(id)
    );

    CREATE TABLE IF NOT EXISTS user_progress (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      goal TEXT NOT NULL,
      status TEXT DEFAULT 'active',
      progress_score REAL DEFAULT 0,
      last_updated INTEGER NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS usage_logs (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      endpoint TEXT NOT NULL,
      tokens_used INTEGER,
      created_at INTEGER NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_conversations_user ON conversations(user_id);
    CREATE INDEX IF NOT EXISTS idx_turns_conversation ON conversation_turns(conversation_id);
    CREATE INDEX IF NOT EXISTS idx_teachings_theme ON teachings(theme);
  `);
}

export function getUser(userId: string) {
  const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
  return stmt.get(userId);
}

export function saveConversation(conversation: any) {
  const stmt = db.prepare(`
    INSERT INTO conversations (id, user_id, teaching_id, context_snapshot, status, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  return stmt.run(
    conversation.id,
    conversation.user_id,
    conversation.teaching_id || null,
    JSON.stringify(conversation.context_snapshot),
    conversation.status,
    conversation.created_at,
    conversation.updated_at
  );
}

export function saveTurn(turn: any) {
  const stmt = db.prepare(`
    INSERT INTO conversation_turns (id, conversation_id, role, content, type, metadata, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  return stmt.run(
    turn.id,
    turn.conversation_id,
    turn.role,
    turn.content,
    turn.type || null,
    turn.metadata ? JSON.stringify(turn.metadata) : null,
    turn.created_at
  );
}

export function getTeachings(limit = 50, offset = 0) {
  const stmt = db.prepare('SELECT * FROM teachings LIMIT ? OFFSET ?');
  return stmt.all(limit, offset);
}
```

#### 1c. `src/middleware/auth.ts` (100 lines)
```typescript
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: { id: string; email: string };
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded as { id: string; email: string };
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

export function generateToken(userId: string, email: string) {
  return jwt.sign(
    { id: userId, email },
    process.env.JWT_SECRET!,
    { expiresIn: process.env.JWT_EXPIRATION || '7d' }
  );
}
```

#### 1d. `src/routes/auth.ts` (150 lines)
```typescript
import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db';
import { generateToken, authMiddleware, AuthRequest } from '../middleware/auth';
import { z } from 'zod';

const router = Router();

const RegisterSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  password: z.string().min(8),
});

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, name, password } = RegisterSchema.parse(req.body);
    
    // Check if user exists
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const userId = uuidv4();
    const passwordHash = await bcrypt.hash(password, 12);
    const now = Date.now();

    db.prepare(`
      INSERT INTO users (id, email, name, password_hash, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(userId, email, name, passwordHash, now, now);

    const token = generateToken(userId, email);
    res.status(201).json({ user_id: userId, email, token });
  } catch (error) {
    res.status(400).json({ error: String(error) });
  }
});

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = LoginSchema.parse(req.body);
    
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user.id, user.email);
    res.json({ user_id: user.id, email: user.email, token });
  } catch (error) {
    res.status(400).json({ error: String(error) });
  }
});

router.get('/me', authMiddleware, (req: AuthRequest, res: Response) => {
  const user = db.prepare('SELECT id, email, name, role, stage, goals, subscription_status, created_at FROM users WHERE id = ?').get(req.user!.id);
  res.json(user);
});

export default router;
```

**Deliverable:** Project initialized, database schema created, auth system working, first test suite passing.

---

### Hour 2: Core Coaching (Claude Integration + Chat)

**Goals:**
- `/chat/message` endpoint working
- Claude API integration complete
- System prompt engineered and tested
- Conversation storage working
- Related teachings lookup functional

**Code to Write:**

#### 2a. `src/services/claude.ts` (200 lines)
```typescript
import Anthropic from '@anthropic-ai/sdk';
import { getTeachings } from '../db';

const client = new Anthropic();

// Build system prompt from teachings
function buildSystemPrompt(teachings: any[], userContext?: any) {
  const teachingsText = teachings
    .map(t => `
    ### ${t.title}
    **Core Concept:** ${t.core_concept}
    **Insight:** ${t.insight}
    **Action Steps:** ${t.action_steps.join(', ')}
    **Case Study:** ${t.case_studies[0] || 'No case study yet'}
    `)
    .join('\n');

  return `You are CoachTinaMarie, an AI coach trained on 23 years of Tina Marie's teachings about business, sovereignty, and personal development.

## Your Foundation
${teachingsText}

## Coaching Style
- Ask powerful questions that reveal what the user already knows
- Draw on specific teachings when relevant to their situation
- Suggest concrete action steps
- Check accountability on previous commitments
- Use storytelling to illustrate concepts

## User Context
${userContext ? `Role: ${userContext.role}\nStage: ${userContext.stage}\nGoals: ${userContext.goals?.join(', ')}` : ''}

## Response Format
Respond with:
1. A powerful question or insight
2. Optionally, a related teaching to explore
3. A specific action step (if applicable)
`;
}

export async function generateCoachResponse(
  userMessage: string,
  userContext?: any,
  relatedThemesToScore?: string[]
): Promise<{
  response: string;
  teaching_cited?: string;
  suggested_action?: string;
}> {
  // Fetch relevant teachings
  const teachings = relatedThemesToScore 
    ? getTeachings(20)?.filter(t => relatedThemesToScore.includes(t.theme))
    : getTeachings(20);

  const systemPrompt = buildSystemPrompt(teachings, userContext);

  const message = await client.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 500,
    system: systemPrompt,
    messages: [
      {
        role: 'user',
        content: userMessage,
      },
    ],
  });

  const response = message.content[0].type === 'text' ? message.content[0].text : '';
  
  // Parse response to extract teaching cite + action
  const teachingMatch = response.match(/Teaching: (.+?)(?:\n|$)/);
  const actionMatch = response.match(/Action: (.+?)(?:\n|$)/);

  return {
    response,
    teaching_cited: teachingMatch?.[1],
    suggested_action: actionMatch?.[1],
  };
}
```

#### 2b. `src/routes/chat.ts` (200 lines)
```typescript
import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { db, saveConversation, saveTurn, getTeachings } from '../db';
import { generateCoachResponse } from '../services/claude';

const router = Router();

router.post('/message', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { conversation_id, message, coaching_context } = req.body;
    
    // Validate input
    if (!message || message.length < 1) {
      return res.status(400).json({ error: 'Message required' });
    }

    let conversation = conversation_id 
      ? db.prepare('SELECT * FROM conversations WHERE id = ?').get(conversation_id)
      : null;

    if (!conversation) {
      // Create new conversation
      const newConvId = uuidv4();
      const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user!.id);
      
      conversation = {
        id: newConvId,
        user_id: req.user!.id,
        teaching_id: null,
        context_snapshot: {
          role: user.role,
          stage: user.stage,
          goals: JSON.parse(user.goals || '[]'),
          stated_challenge: coaching_context?.challenge,
        },
        status: 'active',
        created_at: Date.now(),
        updated_at: Date.now(),
      };
      
      saveConversation(conversation);
    }

    // Save user message
    const userTurn = {
      id: uuidv4(),
      conversation_id: conversation.id,
      role: 'user',
      content: message,
      type: 'question',
      created_at: Date.now(),
    };
    saveTurn(userTurn);

    // Generate coach response
    const userContext = JSON.parse(conversation.context_snapshot);
    const coachResponse = await generateCoachResponse(message, userContext);

    // Save coach response
    const coachTurn = {
      id: uuidv4(),
      conversation_id: conversation.id,
      role: 'coach',
      content: coachResponse.response,
      type: coachResponse.teaching_cited ? 'insight' : 'question',
      metadata: {
        teaching_cited: coachResponse.teaching_cited,
        suggested_action: coachResponse.suggested_action,
      },
      created_at: Date.now(),
    };
    saveTurn(coachTurn);

    // Update conversation
    db.prepare('UPDATE conversations SET updated_at = ? WHERE id = ?')
      .run(Date.now(), conversation.id);

    res.json({
      turn_id: coachTurn.id,
      conversation_id: conversation.id,
      coach_response: coachResponse.response,
      type: coachTurn.type,
      teaching_cited: coachResponse.teaching_cited,
      suggested_action: coachResponse.suggested_action,
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: String(error) });
  }
});

router.get('/conversations', authMiddleware, (req: AuthRequest, res) => {
  const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
  const offset = parseInt(req.query.offset as string) || 0;

  const conversations = db.prepare(`
    SELECT id, teaching_id, status, created_at, updated_at
    FROM conversations
    WHERE user_id = ?
    ORDER BY updated_at DESC
    LIMIT ? OFFSET ?
  `).all(req.user!.id, limit, offset);

  res.json({ conversations, limit, offset });
});

export default router;
```

**Deliverable:** Chat endpoint working, Claude integration verified, conversations stored, related teachings lookup functional.

---

### Hour 3: Enhancement (Progress + Feedback + Goals)

**Code to Write:**

- `src/routes/progress.ts` — GET/POST user progress, goals, tracking
- `src/routes/feedback.ts` — Save coaching feedback, satisfaction scores
- `src/routes/teachings.ts` — GET /teachings, /teachings/:id, /teachings/related
- `src/services/sync.ts` — Sync with wisdom extractor API

**Tests:** Write Jest tests for all new endpoints

**Deliverable:** All user-facing features working, feedback loop established.

---

### Hour 4: Integration (Skool + Revenue)

**Code to Write:**

- `src/routes/skool.ts` — Webhook receiver, leaderboard, export
- `src/routes/subscription.ts` — Stripe integration, tier enforcement
- `src/middleware/metering.ts` — Token usage tracking
- `src/admin/metrics.ts` — Dashboard endpoint

**Deliverable:** Skool integration working, revenue metering live.

---

### Hour 5: Polish (Tests + Docs + Deploy)

**Code to Write:**

- Complete Jest test suite (all endpoints)
- `src/index.ts` — Full Express app with routes
- `.vercelrc.json` — Vercel deployment config
- `docs/API.md` — API documentation
- `docs/DEPLOYMENT.md` — Step-by-step deployment guide

**Final Checks:**
- [ ] All endpoints tested
- [ ] No TypeScript errors
- [ ] Build completes: `npm run build`
- [ ] Start command works: `npm start`
- [ ] Deployment prepared: `.vercelrc.json` created
- [ ] Documentation complete: API + deployment guides

**Deliverable:** Production-ready codebase, all tests passing, ready to deploy.

---

## File Structure After Build

```
coachtina-ai/
├── src/
│   ├── index.ts              (Express app setup)
│   ├── types.ts              (All TypeScript interfaces)
│   ├── db.ts                 (SQLite setup + helpers)
│   ├── middleware/
│   │   └── auth.ts           (JWT + authMiddleware)
│   ├── services/
│   │   ├── claude.ts         (Claude API integration)
│   │   └── sync.ts           (Wisdom extractor sync)
│   ├── routes/
│   │   ├── auth.ts           (Register/login)
│   │   ├── chat.ts           (Main coaching endpoint)
│   │   ├── progress.ts       (Goals + tracking)
│   │   ├── feedback.ts       (Coaching feedback)
│   │   ├── teachings.ts      (Teaching lookup)
│   │   ├── skool.ts          (Skool integration)
│   │   ├── subscription.ts   (Revenue tracking)
│   │   └── admin.ts          (Metrics dashboard)
│   └── tests/
│       ├── auth.test.ts
│       ├── chat.test.ts
│       ├── progress.test.ts
│       └── integration.test.ts
├── docs/
│   ├── API.md                (API documentation)
│   └── DEPLOYMENT.md         (Vercel deployment)
├── .vercelrc.json            (Vercel config)
├── package.json              (Dependencies)
├── tsconfig.json             (TypeScript config)
├── .env.example              (Environment template)
└── README.md                 (Quick start guide)
```

---

## Success Checklist

- [ ] All 4 tables created (users, teachings, conversations, turns)
- [ ] Auth system working (register/login/me endpoints)
- [ ] Chat endpoint working (sends message → receives coach response)
- [ ] Teachings sync working (receives from wisdom extractor)
- [ ] Progress tracking working (GET/POST goals)
- [ ] Feedback collection working (POST feedback)
- [ ] Skool integration tested (webhook + leaderboard)
- [ ] Revenue metering working (token tracking + tier enforcement)
- [ ] All tests passing (jest)
- [ ] TypeScript compiles (tsc --noEmit)
- [ ] Deployment config ready (.vercelrc.json)
- [ ] Documentation complete (API.md + DEPLOYMENT.md)

---

## Deployment After Build

```bash
# 1. Set environment variables in Vercel
# ANTHROPIC_API_KEY, JWT_SECRET, SKOOL_API_KEY, STRIPE_API_KEY

# 2. Deploy
vercel --prod

# 3. Verify
curl https://coachtina.vercel.app/health
# Should return: { "status": "ok" }

# 4. Connect Skool
# Add webhook URL to Skool dashboard
# POST https://coachtina.vercel.app/skool/webhook
```

---

## Estimated Costs (Month 1)

| Item | Est. Cost |
|------|-----------|
| Claude API (1000 conversations) | $50-75 |
| Vercel (serverless + storage) | $20 |
| Stripe (payment processing) | $0 (tiered) |
| **Total** | **$70-95** |

Revenue (assuming 50 paid users at $77/month): **$3,850**  
Gross margin: **~97%**

---

**STATUS: READY TO BUILD**

When wisdom extraction completes and teachings API is ready:
1. Run `/scripts/init-coachtina.sh` (3 min)
2. Follow this sprint plan (4-5 hours)
3. Deploy to Vercel (15 min)
4. Connect Skool (30 min)
5. **Go live with revenue** ✅

---

**Last updated:** March 21, 2026, 04:05 AM HADT by Moriah
