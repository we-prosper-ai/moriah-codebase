import { Router } from "express";
import { z } from "zod";
import type Database from "better-sqlite3";
import { syncTeachings, getTeachings, getTeachingById, searchTeachings, countTeachings } from "../db/teachings.js";
import { logger } from "../services/logger.js";

const TeachingSchema = z.object({
  id: z.string().min(1),
  theme: z.string().min(1),
  title: z.string().min(1),
  core_teaching: z.string().min(1),
  key_insight: z.string().optional(),
  quote: z.string().optional(),
  action_steps: z.array(z.string()).optional(),
  case_study: z.record(z.unknown()).optional(),
  related_ids: z.array(z.string()).optional(),
  course_module: z.string().optional(),
  curriculum_ref: z.string().optional(),
  currency_tags: z.array(z.enum(["money", "time", "energy", "freedom"])).optional(),
  source_file: z.string().optional(),
});

const SyncPayloadSchema = z.object({
  source: z.string().optional(),
  teachings: z.array(TeachingSchema).min(1, "At least one teaching required"),
});

export function teachingsRouter(db: Database.Database): Router {
  const router = Router();

  // POST /teachings/sync — receive extracted wisdom from Wisdom Extractor
  router.post("/sync", (req, res) => {
    try {
      const parsed = SyncPayloadSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          error: "Validation failed",
          details: parsed.error.flatten(),
        });
      }

      const result = syncTeachings(db, parsed.data);
      logger.info(result, "Teachings synced");

      return res.status(200).json({
        success: true,
        ...result,
        total: countTeachings(db),
      });
    } catch (err) {
      logger.error({ err }, "Failed to sync teachings");
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  // GET /teachings — list all teachings
  router.get("/", (req, res) => {
    const { theme, module: mod, limit, offset, search } = req.query;

    if (search && typeof search === "string") {
      const results = searchTeachings(db, search, Number(limit) || 10);
      return res.json({ teachings: results, count: results.length });
    }

    const teachings = getTeachings(db, {
      theme: theme as string | undefined,
      module: mod as string | undefined,
      limit: Number(limit) || 50,
      offset: Number(offset) || 0,
    });

    return res.json({ teachings, count: teachings.length, total: countTeachings(db) });
  });

  // GET /teachings/:id
  router.get("/:id", (req, res) => {
    const teaching = getTeachingById(db, req.params.id);
    if (!teaching) return res.status(404).json({ error: "Teaching not found" });
    return res.json(teaching);
  });

  return router;
}
