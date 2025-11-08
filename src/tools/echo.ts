import { z } from "zod";
import type { RegisterableModule } from "../registry/types.js";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

const echoModule: RegisterableModule = {
  type: "tool",
  name: "EchoTool",
  description: "A utility tool that echoes back the provided text. It serves as a basic communication verification tool within the MCP system.",
  register(server: McpServer) {
    server.registerTool(
      "EchoTool",
      {
        title: "Echo Tool",
        description: "A utility tool that echoes back the provided text. It serves as a basic communication verification tool within the MCP system.",
        inputSchema:{
          text: z.string().min(1, "Text cannot be empty").describe("Text to echo back"),
        },
      },
      (args) => {
        const text = args.text;
        return {
          content: [
            {
              type: "text",
              text: text,
            },
          ],
        };
      }
    );
  }
};

export default echoModule;
