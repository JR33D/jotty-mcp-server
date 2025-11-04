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

export const systemInfoModule: RegisterableModule = {
  type: "resource",
  name: "system-info",
  description: "Get basic system information about the server",
  register(server: McpServer) {
    server.resource(
      "system-info",
      "system://info",
      {
        name: "System Information",
        description: "Get basic system information about the server",
      },
      () => systemInfoHandler()
    );
  }
};

export default systemInfoModule;