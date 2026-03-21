/**
 * CoachTinaMarie — Coaching Service
 *
 * Implements Tina's coaching methodology:
 *   PROBE → DIAGNOSE → ADVISE → DEEPEN
 *
 * Every response is grounded in teachings from the SQLite knowledge base.
 * Without teachings, the coach uses Tina's documented frameworks only.
 */

import Anthropic from "@anthropic-ai/sdk";
import type Database from "better-sqlite3";
import type { CoachingPhase, CoachRespondPayload, CoachResponse } from "../types/index.js";
import {
  getSessionById,
  updateSessionPhase,
  incrementSessionTurns,
  addTurn,
  getSessionTurns,
  recordExposure,
} from "../db/sessions.js";
import { searchTeachings, getTeachingsByIds, getRandomTeachings } from "../db/teachings.js";
import { touchUser } from "../db/users.js";
import { logger } from "./logger.js";

const SYSTEM_PROMPT = `You are CoachTinaMarie — an AI coaching assistant trained on the methodology, voice, and 23 years of wisdom of Tina Marie, founder of Profit Drivers Inc.

## YOUR IDENTITY
You are NOT Tina Marie. You are an AI trained on her methodology. Reference her approach directly: "Tina's framework here is..." or "Based on how Tina coaches this..."

## THE FOUR CURRENCIES FRAMEWORK (your north star)
Everything you teach is grounded in the Four Currencies:
1. **Money** — Financial resources. Necessary but not sufficient.
2. **Time** — The most limited resource. Quality over quantity.
3. **Energy** — Mental, physical, emotional capacity. Sustainability > intensity.
4. **Freedom** — Ability to design your own life. The real metric of success.

Tina's core insight: "Most entrepreneurs trade all four currencies for money, then wonder why they're exhausted and unhappy."

## THE 9 BUSINESS FUNDAMENTALS
1. Offer Architecture — What you sell and how it's structured
2. Revenue Engine — How money comes in predictably
3. Time Mastery — How you spend your hours
4. Team & Delegation — Who does what
5. Client Journey — The experience from first touch to referral
6. Marketing Ecosystem — How people find and trust you
7. Operations & Systems — The machine that runs without you
8. Financial Architecture — Where money goes and why
9. Leadership & Vision — Who you're becoming as a leader

## THE THREE REVENUE MODELS
- Model A: Services (time for money) — Ceiling $500K
- Model B: Products (built once, sold many) — Ceiling $1M+
- Model C: Hybrid — Unlimited ceiling

## COACHING METHODOLOGY (4 phases — follow this exactly)

### Phase 1: PROBE (first 2-3 turns)
- Ask ONE diagnostic question at a time
- Surface the real problem beneath the stated problem
- Example: "If your business made 50% less next month, what breaks first?"

### Phase 2: DIAGNOSE
- Name the pattern you've identified
- Connect it to the specific Business Fundamental
- Be direct. Tina doesn't sugarcoat.
- Example: "What you're describing is a Revenue Engine problem masquerading as a marketing problem."

### Phase 3: ADVISE
- Present 2-3 specific paths grounded in the retrieved teachings
- Include trade-offs for each
- Ask: "Which of these resonates most with where you are right now?"

### Phase 4: DEEPEN
- Go deep on their chosen path
- Specific, actionable next steps
- Connect back to their Four Currencies baseline

## TINA'S VOICE
- Direct. Not soft. Truth even when uncomfortable.
- Short paragraphs. Conversational. Like a smart friend who's also a strategist.
- Stories and examples over theory
- Ask powerful questions — help them discover their own answers
- Never: "Great question!", "leverage", "synergy", "paradigm", "unpack", "deep dive"
- Never: generic advice from any business book
- Never: single prescriptions — always show the options

## ENERGY MANAGEMENT (get this right)
- High body energy, scattered focus → physical movement first (weights, walk, not admin tasks)
- High brain energy, tired body → deep thinking work: strategy, writing, planning
- Medium everything → routine calls, client work
- Low everything → rest, period

## WHAT YOU MUST NOT DO
- Make up frameworks or teachings not grounded in the context below
- Give generic advice
- Pretend Tina's teachings cover something they don't — say so honestly
- Ignore the emotional dimension of business decisions`;

const PHASE_INSTRUCTIONS: Record<CoachingPhase, string> = {
  probe: `You are in the PROBE phase. Ask exactly ONE diagnostic question. No advice yet. Surface what's really going on beneath the surface. Make it specific and uncomfortable enough to get a real answer.`,
  diagnose: `You are in the DIAGNOSE phase. Name the pattern clearly. Connect it to the specific Business Fundamental(s). Be direct — no softening. Show you understand their real situation.`,
  advise: `You are in the ADVISE phase. Offer 2-3 specific paths grounded in the retrieved teachings below. Include the real trade-offs. End by asking which resonates most.`,
  deepen: `You are in the DEEPEN phase. Go deep on their chosen path. Give specific next steps. Connect back to how this serves their Four Currencies. Make it actionable.`,
};

function determineNextPhase(currentPhase: CoachingPhase, turnCount: number): CoachingPhase {
  if (currentPhase === "probe" && turnCount >= 2) return "diagnose";
  if (currentPhase === "diagnose") return "advise";
  if (currentPhase === "advise") return "deepen";
  return currentPhase;
}

function buildTeachingContext(teachings: { id: string; title: string; core_teaching: string; key_insight?: string; quote?: string; action_steps?: string[] }[]): string {
  if (teachings.length === 0) return "";

  return `\n\n## TINA'S RELEVANT TEACHINGS (draw from these for your response)\n\n` +
    teachings.map((t, i) =>
      `[${i + 1}] **${t.title}**\n` +
      `Teaching: ${t.core_teaching}\n` +
      (t.key_insight ? `Insight: ${t.key_insight}\n` : "") +
      (t.quote ? `In Tina's words: ${t.quote}\n` : "") +
      (t.action_steps && t.action_steps.length > 0 ? `Actions:\n${t.action_steps.slice(0, 3).join("\n")}\n` : "")
    ).join("\n");
}

export async function generateCoachResponse(
  db: Database.Database,
  payload: CoachRespondPayload
): Promise<CoachResponse> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY not set");

  // Load session
  const session = getSessionById(db, payload.session_id);
  if (!session) throw new Error(`Session not found: ${payload.session_id}`);
  if (session.status !== "active") throw new Error(`Session is ${session.status}`);

  // Touch user
  touchUser(db, payload.user_id);

  // Store user turn
  addTurn(db, {
    session_id: session.id,
    role: "user",
    content: payload.message,
    phase: session.phase,
  });

  // Determine next phase
  const nextPhase = determineNextPhase(session.phase, session.turn_count);
  if (nextPhase !== session.phase) {
    updateSessionPhase(db, session.id, nextPhase);
    session.phase = nextPhase;
  }

  // Retrieve relevant teachings from the knowledge base
  const relevantTeachings = searchTeachings(db, payload.message, 5);
  // If not enough from search, supplement with random teachings
  const teachingsToUse = relevantTeachings.length >= 3
    ? relevantTeachings
    : [...relevantTeachings, ...getRandomTeachings(db, 3 - relevantTeachings.length)];

  const teachingContext = buildTeachingContext(teachingsToUse);

  // Load conversation history
  const turns = getSessionTurns(db, session.id);
  const messages: Anthropic.MessageParam[] = turns
    .filter((t) => t.role === "user" || t.role === "assistant")
    .map((t) => ({
      role: t.role as "user" | "assistant",
      content: t.content,
    }));

  const systemPrompt = SYSTEM_PROMPT + teachingContext + `\n\n## CURRENT PHASE: ${session.phase.toUpperCase()}\n${PHASE_INSTRUCTIONS[session.phase]}`;

  const client = new Anthropic({ apiKey });

  const response = await client.messages.create({
    model: process.env.COACHING_MODEL || "claude-opus-4-5",
    max_tokens: 1024,
    system: systemPrompt,
    messages,
  });

  const assistantMessage = response.content[0]?.type === "text" ? response.content[0].text : "Let me think about that.";
  const tokensUsed = response.usage?.output_tokens;

  const teachingIds = teachingsToUse.map((t) => t.id);

  // Store assistant turn
  addTurn(db, {
    session_id: session.id,
    role: "assistant",
    content: assistantMessage,
    phase: session.phase,
    teaching_ids: teachingIds,
    tokens_used: tokensUsed,
  });

  // Update session counter
  incrementSessionTurns(db, session.id);

  // Record exposure for progress tracking
  if (teachingIds.length > 0) {
    recordExposure(db, payload.user_id, teachingIds);
  }

  logger.info({
    session_id: session.id,
    phase: session.phase,
    turn: session.turn_count + 1,
    teachings_used: teachingIds.length,
    tokens: tokensUsed,
  }, "Coach responded");

  return {
    session_id: session.id,
    phase: session.phase,
    response: assistantMessage,
    turn_count: session.turn_count + 1,
    teaching_ids_used: teachingIds,
  };
}

// Recommendations engine
export function buildRecommendations(
  db: Database.Database,
  userId: string
): { teaching_id: string; title: string; theme: string; reason: string; priority: string; currency_focus: string[] }[] {
  // Get teachings the user hasn't seen
  const exposedIds = db.prepare("SELECT teaching_id FROM topic_exposure WHERE user_id = ?")
    .all(userId) as { teaching_id: string }[];
  const exposedSet = new Set(exposedIds.map((r) => r.teaching_id));

  // Get teachings by highest-need currencies (using baseline)
  const user = db.prepare("SELECT currencies_baseline FROM users WHERE id = ?").get(userId) as { currencies_baseline: string | null } | undefined;
  const baseline = user?.currencies_baseline ? JSON.parse(user.currencies_baseline) : null;

  // Find currencies with lowest scores
  let lowestCurrency = "money";
  if (baseline) {
    const scores: [string, number][] = [
      ["money", baseline.money],
      ["time", baseline.time],
      ["energy", baseline.energy],
      ["freedom", baseline.freedom],
    ];
    scores.sort((a, b) => a[1] - b[1]);
    lowestCurrency = scores[0][0];
  }

  // Get all teachings
  const allTeachings = db.prepare("SELECT id, title, theme, currency_tags, core_teaching FROM teachings").all() as {
    id: string; title: string; theme: string; currency_tags: string | null; core_teaching: string;
  }[];

  const unseen = allTeachings.filter((t) => !exposedSet.has(t.id));
  const seen = allTeachings.filter((t) => exposedSet.has(t.id));

  const recommendations: {
    teaching_id: string;
    title: string;
    theme: string;
    reason: string;
    priority: string;
    currency_focus: string[];
  }[] = [];

  // Priority 1: Unseen teachings targeting lowest currency
  for (const t of unseen) {
    const tags = t.currency_tags ? JSON.parse(t.currency_tags) as string[] : [];
    if (tags.includes(lowestCurrency) && recommendations.length < 3) {
      recommendations.push({
        teaching_id: t.id,
        title: t.title,
        theme: t.theme,
        reason: `Your ${lowestCurrency} score is lowest — this addresses it directly.`,
        priority: "high",
        currency_focus: tags,
      });
    }
  }

  // Priority 2: Any unseen teaching
  for (const t of unseen) {
    if (recommendations.length >= 5) break;
    if (!recommendations.find((r) => r.teaching_id === t.id)) {
      const tags = t.currency_tags ? JSON.parse(t.currency_tags) as string[] : [];
      recommendations.push({
        teaching_id: t.id,
        title: t.title,
        theme: t.theme,
        reason: "You haven't explored this teaching yet.",
        priority: "medium",
        currency_focus: tags,
      });
    }
  }

  // Priority 3: Revisit seen teachings
  for (const t of seen) {
    if (recommendations.length >= 5) break;
    const tags = t.currency_tags ? JSON.parse(t.currency_tags) as string[] : [];
    recommendations.push({
      teaching_id: t.id,
      title: t.title,
      theme: t.theme,
      reason: "Worth revisiting as you progress.",
      priority: "low",
      currency_focus: tags,
    });
  }

  return recommendations.slice(0, 5);
}
