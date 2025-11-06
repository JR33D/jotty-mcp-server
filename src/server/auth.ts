import type { NextFunction, Request, Response } from "express";
import { env } from "../config.js";
import { logger } from "../logger.js";

const API_KEY_HEADER = "authorization";
const API_KEY_PREFIX = "ApiKey ";

export function apiKeyAuth(req: Request, res: Response, next: NextFunction) {
  if (process.env.STARTER_TRANSPORT !== "http") {
    return next();
  }

  const apiKey = env.API_KEY;
  if (!apiKey) {
    logger.error("API_KEY not configured, but required for http transport.");
    return res.status(500).send("Internal Server Error");
  }

  const authHeader = req.headers[API_KEY_HEADER];

  if (!authHeader || !authHeader.startsWith(API_KEY_PREFIX)) {
    return res.status(401).send("Unauthorized");
  }

  const token = authHeader.substring(API_KEY_PREFIX.length);

  if (token !== apiKey) {
    return res.status(401).send("Unauthorized");
  }

  next();
}
