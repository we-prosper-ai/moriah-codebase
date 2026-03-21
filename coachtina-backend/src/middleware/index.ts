import { Request, Response, NextFunction } from "express";
import rateLimit from "express-rate-limit";
import { logger } from "../services/logger.js";

// Request logging
export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();
  res.on("finish", () => {
    const ms = Date.now() - start;
    logger.info({
      method: req.method,
      path: req.path,
      status: res.statusCode,
      ms,
    }, "Request");
  });
  next();
}

// Error handler
export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction): void {
  logger.error({ err, path: req.path }, "Unhandled error");
  res.status(500).json({ error: "Internal server error" });
}

// 404
export function notFound(req: Request, res: Response): void {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.path}` });
}

// Rate limiting
export const apiLimiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 60_000,
  max: Number(process.env.RATE_LIMIT_MAX) || 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, slow down" },
});

// Coaching endpoint has tighter limits (AI calls are expensive)
export const coachingLimiter = rateLimit({
  windowMs: 60_000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Coaching rate limit reached" },
});

// Simple API key auth (service-to-service)
export function requireApiKey(req: Request, res: Response, next: NextFunction): void {
  const apiKey = process.env.API_SECRET_KEY;
  if (!apiKey || apiKey === "change_me_in_production") {
    // Auth disabled in dev if not set
    return next();
  }

  const provided = req.headers["x-api-key"];
  if (provided !== apiKey) {
    res.status(401).json({ error: "Invalid API key" });
    return;
  }
  next();
}
