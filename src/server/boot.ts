import { randomUUID } from "node:crypto";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import cors from "cors";
import { config } from "dotenv";
import express from "express";
import { healthCheckHandler } from "./health.js";
import logger from "../logger.js"; // Our OTel-integrated logger
import { autoRegisterModules } from "../registry/auto-loader.js";

type TransportMode = "stdio" | "http";

// Load environment variables from .env file
config();

export async function boot(mode?: TransportMode): Promise<void> {
  const transportMode =
    mode ??
    (process.env.STARTER_TRANSPORT as TransportMode | undefined) ??
    "stdio";
  const server = new McpServer({
    name: "jotty-mcp-server",
    version: "0.1.0",
    capabilities: {
      tools: {},
      resources: {},
      prompts: {},
      completions: {},
    },
  });

  await autoRegisterModules(server);

  if (transportMode === "stdio") {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    logger.info("Jotty MCP Server running on stdio");
    return;
  }

  // HTTP mode with SSE support
  const app = express();
  app.use(express.json({ limit: "1mb" }));

  // Request logging middleware
  app.use((req, res, next) => {
    logger.info(`Incoming Request`, {
      method: req.method,
      url: req.url,
      ip: req.ip,
      headers: req.headers,
      body: req.body,
    });
    next();
  });

  const corsOrigin = process.env.CORS_ORIGIN ?? "*";
  app.use(
    cors({
      origin: corsOrigin,
      credentials: true,
      methods: ["GET", "POST", "OPTIONS", "DELETE"],
      allowedHeaders: ["Content-Type", "x-mcp-session", "x-mcp-session-id"],
      exposedHeaders: ["x-mcp-session-id"],
    })
  );
  // Prevent express.json() from touching MCP traffic
  app.use("/mcp", express.raw({ type: "*/*" }));

  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: () => randomUUID(),
  });

  await server.connect(transport);

  // Handle MCP JSON-RPC + SSE streaming correctly
  app.all("/mcp", (req, res) => {
    void transport.handleRequest(req, res);
  });

  // Health check endpoint
  app.get("/health", healthCheckHandler);

  // Error handling middleware
  app.use(
    (
      err: Error,
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      logger.error(`Unhandled Error: ${err.message}`, {
        stack: err.stack,
        method: req.method,
        url: req.url,
        ip: req.ip,
      });
      if (!res.headersSent) {
        res.status(500).send("Internal Server Error");
      }
    }
  );

  const port = Number(process.env.PORT ?? 3000);
  const httpServer = app.listen(port, () => {
    logger.info(
      `Jotty MCP Server (HTTP) listening on http://localhost:${String(
        port
      )}/mcp`
    );
    logger.info(`SSE endpoint: GET http://localhost:${String(port)}/mcp`);
    logger.info(`JSON-RPC endpoint: POST http://localhost:${String(port)}/mcp`);
    logger.info(`CORS origin: ${corsOrigin}`);
  });

  process.on("SIGINT", () => {
    logger.info("Shutting down HTTP server...");
    void transport.close();
    httpServer.close(() => {
      process.exit(0);
    });
  });
}
