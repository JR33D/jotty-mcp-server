#!/usr/bin/env node
import { boot } from "./server/boot.js";

import logger from './logger.js';

boot().catch((error: unknown) => {
  logger.error("Fatal error in boot():", error);
  process.exit(1);
});