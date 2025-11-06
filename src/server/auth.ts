import { getConfig } from "../config.js";
import { logger } from "../logger.js";
import type { NextFunction, Request, Response } from "express";

const API_KEY_HEADER = "authorization";
const API_KEY_PREFIX = "ApiKey ";

export function apiKeyAuth(req: Request, res: Response, next: NextFunction): void {
  if (process.env.STARTER_TRANSPORT !== "http") {
    next();
    return;
  }

  const config = getConfig();
  const apiKey = config.API_KEY;

  const authHeader = req.headers[API_KEY_HEADER];

  if (authHeader === undefined || Array.isArray(authHeader) || !authHeader.startsWith(API_KEY_PREFIX)) {
    logger.warn("Unauthorized access attempt: Missing or invalid Authorization header.");
    res.status(401).send("Unauthorized");
    return;
  }

  const token = authHeader.substring(API_KEY_PREFIX.length);

  if (token !== apiKey) {
    logger.warn("Unauthorized access attempt: Invalid API key provided.");
    res.status(401).send("Unauthorized");
    return;
  }

  next();
}