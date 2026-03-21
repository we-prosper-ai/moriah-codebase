/**
 * CoachTinaMarie Backend
 * Express server — localhost:3333
 *
 * Endpoints:
 *   POST /teachings/sync          — receive wisdom from Wisdom Extractor
 *   GET  /teachings               — list/search teachings
 *   GET  /teachings/:id           — single teaching
 *   POST /coaching/start-session  — begin a coaching session
 *   POST /coaching/respond        — exchange turns
 *   GET  /coaching/session/:id    — session history
 *   GET  /coaching/recommendations— personalized next steps
 *   GET  /user/progress           — user progress summary
 *   POST /user/progress           — update progress
 *   GET  /user/profile            — user profile
 *   POST /user/profile            — create/update user
 */

import "dotenv/config";
import express from "express";
import cors from "cors";

import { initializeDatabase } from "./db/schema.js";
import { teachingsRouter } from "./routes/teachings.js";
import { coachingRouter } from "./routes/coaching.js";
import { usersRouter, recommendationsRouter } from "./routes/users.js";
import {
  requestLogger,
  errorHandler,
  notFound,
  apiLimiter,
  coachingLimiter,
} from "./middleware/index.js";
import { logger } from "./services/logger.js";

const PORT = Number(process.env.PORT) || 3333;
const DB_PATH = process.env.DB_PATH || "./coachtina.db";

async function main() {
  // Initialize DB
  const db = initializeDatabase(DB_PATH);

  const app = express();

  // Core middleware
  app.use(cors());
  app.use(express.json({ limit: "10mb" }));
  app.use(requestLogger);
  app.use(apiLimiter);

  // Health check
  app.get("/health", (req, res) => {
    res.json({
      status: "ok",
      service: "coachtina-backend",
      version: "1.0.0",
      port: PORT,
      db: DB_PATH,
      timestamp: new Date().toISOString(),
    });
  });

  // Routes
  app.use("/teachings", teachingsRouter(db));
  app.use("/coaching", coachingLimiter, coachingRouter(db));
  app.use("/coaching/recommendations", recommendationsRouter(db));
  app.use("/user", usersRouter(db));

  // 404 + error handling
  app.use(notFound);
  app.use(errorHandler as express.ErrorRequestHandler);

  app.listen(PORT, () => {
    logger.info(
      { port: PORT, db: DB_PATH, env: process.env.NODE_ENV || "development" },
      "🏔️  CoachTinaMarie backend running"
    );
  });

  // Graceful shutdown
  process.on("SIGINT", () => {
    logger.info("Shutting down...");
    db.close();
    process.exit(0);
  });
  process.on("SIGTERM", () => {
    db.close();
    process.exit(0);
  });
}

main().catch((err) => {
  logger.error(err, "Fatal startup error");
  process.exit(1);
});
