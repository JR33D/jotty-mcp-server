#!/usr/bin/env node
import logger from './logger.js';
import { boot } from "./server/boot.js";

boot().catch((error: unknown) => {
  logger.error("Fatal error in boot():", error);
  process.exit(1);
});