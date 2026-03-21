import { Router } from "express";
import { z } from "zod";
import type Database from "better-sqlite3";
import { createSession, getSessionById, getSessionTurns, closeSession } from "../db/sessions.js";
import { upsertUser, getUserById } from "../db/users.js";
import { generateCoachResponse } from "../services/coaching.js";
import { logger } from "../services/logger.js";

const CurrenciesBaselineSchema = z.object({
  money: z.number().min(1).max(10),
  time: z.number().min(1).max(10),
  energy: z.number().min(1).max(10),
  freedom: z.number().min(1).max(10),
});

const StartSessionSchema = z.object({
  user_id: z.string().min(1),
  topic: z.string().optional(),
  user_name: z.string().optional(),
  user_email: z.string().email().optional(),
  currencies_baseline: CurrenciesBaselineSchema.optional(),
});

const RespondSchema = z.object({
  session_id: z.string().min(1),
  user_id: z.string().min(1),
  message: z.string().min(1).max(4000),
});

export function coachingRouter(db: Database.Database): Router {
  const router = Router();

  // POST /coaching/start-session
  router.post("/start-session", (req, res) => {
    try {
      const parsed = StartSessionSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Validation failed", details: parsed.error.flatten() });
      }

      const { user_id, topic, user_name, user_email, currencies_baseline } = parsed.data;

      // Ensure user exists
      const user = upsertUser(db, {
        id: user_id,
        name: user_name,
        email: user_email,
        currencies_baseline,
      });

      // Create session
      const session = createSession(db, { user_id: user.id, topic });

      const openingMessage = topic
        ? `I hear you want to work on "${topic}". Before I say anything, I need to understand your situation better. ${getOpeningQuestion(topic)}`
        : "Good. You showed up. That already tells me something. Before we dive in — what's the most pressing thing on your mind about your business right now? Not the symptom. The thing underneath the symptom.";

      logger.info({ session_id: session.id, user_id: user.id, topic }, "Session started");

      return res.status(201).json({
        session_id: session.id,
        user_id: user.id,
        phase: session.phase,
        opening_message: openingMessage,
        started_at: session.started_at,
      });
    } catch (err) {
      logger.error({ err }, "Failed to start session");
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  // POST /coaching/respond
  router.post("/respond", async (req, res) => {
    try {
      const parsed = RespondSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Validation failed", details: parsed.error.flatten() });
      }

      const session = getSessionById(db, parsed.data.session_id);
      if (!session) return res.status(404).json({ error: "Session not found" });
      if (session.status !== "active") {
        return res.status(400).json({ error: `Session is ${session.status}. Start a new session.` });
      }

      // Verify user owns session
      if (session.user_id !== parsed.data.user_id) {
        return res.status(403).json({ error: "Not authorized for this session" });
      }

      const coachResponse = await generateCoachResponse(db, parsed.data);

      return res.json(coachResponse);
    } catch (err) {
      logger.error({ err }, "Failed to generate coaching response");
      if (err instanceof Error && err.message.includes("ANTHROPIC_API_KEY")) {
        return res.status(503).json({ error: "Coaching service not configured" });
      }
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  // GET /coaching/session/:id — get session details + history
  router.get("/session/:id", (req, res) => {
    const session = getSessionById(db, req.params.id);
    if (!session) return res.status(404).json({ error: "Session not found" });

    const turns = getSessionTurns(db, req.params.id);

    return res.json({
      session,
      turns: turns.map((t) => ({
        role: t.role,
        content: t.content,
        phase: t.phase,
        created_at: t.created_at,
      })),
    });
  });

  // POST /coaching/session/:id/close
  router.post("/session/:id/close", (req, res) => {
    const session = getSessionById(db, req.params.id);
    if (!session) return res.status(404).json({ error: "Session not found" });

    closeSession(db, req.params.id);
    logger.info({ session_id: req.params.id }, "Session closed");

    return res.json({ success: true, session_id: req.params.id });
  });

  return router;
}

function getOpeningQuestion(topic: string): string {
  const t = topic.toLowerCase();
  if (t.includes("revenue") || t.includes("money") || t.includes("income")) {
    return "Walk me through your current revenue — how it comes in, from who, and what you're actually keeping after expenses.";
  }
  if (t.includes("time") || t.includes("burnout") || t.includes("overwhelm") || t.includes("hours")) {
    return "How many hours did you actually work last week? Not what you planned — what actually happened.";
  }
  if (t.includes("team") || t.includes("hire") || t.includes("delegate")) {
    return "What's the most time-consuming thing in your business that only you can currently do?";
  }
  if (t.includes("market") || t.includes("sales") || t.includes("client") || t.includes("customer")) {
    return "How did your last three clients or customers find you?";
  }
  if (t.includes("scale") || t.includes("grow") || t.includes("growth")) {
    return "What's the single biggest thing preventing you from doubling revenue without doubling your hours?";
  }
  return "Give me the 60-second version of your business — what you do, who you do it for, and what keeps you up at night right now.";
}
