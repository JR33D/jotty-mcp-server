import * as os from "os";
import type { RegisterableModule } from "../registry/types.js";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export const systemInfoHandler = (osModule: typeof os = os): { contents: [{ uri: string; mimeType: string; text: string; }] } => {
  return {
    contents: [
      {
        uri: "system://info",
        mimeType: "application/json",
        text: JSON.stringify({
          platform: osModule.platform(),
          architecture: osModule.arch(),
          nodeVersion: process.version,
          uptime: osModule.uptime(),
          totalMemory: osModule.totalmem(),
          freeMemory: osModule.freemem(),
        }, null, 2),
      },
    ],
  };
};

const systemInfoModule: RegisterableModule = {
  type: "resource",
  name: "SystemMonitor",
  description: "Provides basic system information about the server, including platform, architecture, Node.js version, uptime, and memory usage. This resource offers insights into the operational environment of the MCP system",
  register(server: McpServer) {
    server.registerResource(
      "SystemMonitor",
      "system://SystemMonitor",
      {
        name: "System Information",
        description: "Provides basic system information about the server, including platform, architecture, Node.js version, uptime, and memory usage. This resource offers insights into the operational environment of the MCP system.",
      },
      () => systemInfoHandler()
    );
  }
};

export default systemInfoModule;