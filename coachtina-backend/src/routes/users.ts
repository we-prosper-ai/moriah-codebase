import { Router } from "express";
import { z } from "zod";
import type Database from "better-sqlite3";
import { getUserById, upsertUser } from "../db/users.js";
import { buildProgressSummary, upsertProgress, getUserSessions } from "../db/sessions.js";
import { buildRecommendations } from "../services/coaching.js";
import { logger } from "../services/logger.js";

const ProgressUpdateSchema = z.object({
  module_id: z.string().min(1),
  lesson_id: z.string().optional(),
  status: z.enum(["not_started", "in_progress", "completed"]),
  score: z.number().min(0).max(100).optional(),
  notes: z.string().optional(),
});

export function usersRouter(db: Database.Database): Router {
  const router = Router();

  // GET /user/progress — full progress summary
  router.get("/progress", (req, res) => {
    const userId = req.query.user_id as string;
    if (!userId) return res.status(400).json({ error: "user_id required" });

    const user = getUserById(db, userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const summary = buildProgressSummary(db, userId);
    return res.json(summary);
  });

  // POST /user/progress — update progress
  router.post("/progress", (req, res) => {
    const userId = req.query.user_id as string || req.body.user_id;
    if (!userId) return res.status(400).json({ error: "user_id required" });

    const parsed = ProgressUpdateSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Validation failed", details: parsed.error.flatten() });
    }

    upsertProgress(db, { user_id: userId, ...parsed.data });
    logger.info({ user_id: userId, ...parsed.data }, "Progress updated");

    return res.json({ success: true });
  });

  // GET /user/sessions — recent sessions
  router.get("/sessions", (req, res) => {
    const userId = req.query.user_id as string;
    if (!userId) return res.status(400).json({ error: "user_id required" });

    const sessions = getUserSessions(db, userId, Number(req.query.limit) || 10);
    return res.json({ sessions });
  });

  // GET /user/profile
  router.get("/profile", (req, res) => {
    const userId = req.query.user_id as string;
    if (!userId) return res.status(400).json({ error: "user_id required" });

    const user = getUserById(db, userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    return res.json(user);
  });

  // POST /user/profile — create or update user
  router.post("/profile", (req, res) => {
    try {
      const user = upsertUser(db, req.body);
      return res.json(user);
    } catch (err) {
      logger.error({ err }, "Failed to upsert user");
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  return router;
}

// Standalone recommendations route (mounted at /coaching/recommendations)
export function recommendationsRouter(db: Database.Database): Router {
  const router = Router();

  // GET /coaching/recommendations
  router.get("/", (req, res) => {
    const userId = req.query.user_id as string;
    if (!userId) return res.status(400).json({ error: "user_id required" });

    const user = getUserById(db, userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const recommendations = buildRecommendations(db, userId);
    return res.json({ recommendations, count: recommendations.length });
  });

  return router;
}
