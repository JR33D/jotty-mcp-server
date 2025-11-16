import { ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { RegisterableModule } from "../registry/types.js";
import type { McpServer} from "@modelcontextprotocol/sdk/server/mcp.js";

type TimestampFormat = "iso" | "unix" | "readable" | "friendly";

type TimestampVariables = {
  format?: TimestampFormat;
};

const MIME_TYPE_PLAIN = "text/plain";
const VALID_FORMATS: Array<TimestampFormat> = ["iso", "unix", "readable", "friendly"];

const timestampModule: RegisterableModule = {
  type: "resource",
  name: "TimestampGenerator",
  description: "Generates the current timestamp in various formats (ISO, Unix, readable). This utility provides time-related information to agents within the MCP system.",
  register(server: McpServer) {
    server.registerResource(
      "TimestampGenerator",
      new ResourceTemplate("TimestampGenerator://{format}", {
        list: () => ({
          resources: [
            { uri: "TimestampGenerator://iso", name: "ISO 8601 format" },
            { uri: "TimestampGenerator://unix", name: "Unix timestamp" },
            { uri: "TimestampGenerator://readable", name: "Human-readable format" },
            { uri: "TimestampGenerator://friendly", name: "YYYY-MM-DD format" },
          ],
        }),
        complete: {
          format: (value) => {
            const normalizedValue = value.toLowerCase();
            return VALID_FORMATS.filter(f => 
              f.toLowerCase().startsWith(normalizedValue)
            );
          },
        },
      }),
      {
        description: "Generates the current timestamp in various formats (ISO, Unix, readable). This utility provides time-related information to agents within the MCP system.",
      },
      (uri: URL, variables: TimestampVariables) => {
        const { format } = variables;
        const now = new Date();
        let timestamp: string;

        if (format === undefined) {
          return {
            contents: [
              {
                uri: uri.href,
                mimeType: MIME_TYPE_PLAIN,
                text: "Format not specified. Use 'iso', 'unix', 'readable', or 'friendly'",
              },
            ],
          };
        }

        if (!VALID_FORMATS.includes(format)) {
          return {
            contents: [
              {
                uri: uri.href,
                mimeType: MIME_TYPE_PLAIN,
                text: `Unknown format: ${format}. Use 'iso', 'unix', 'readable', or 'friendly'`,
              },
            ],
          };
        }
        
        switch (format) {
          case "iso":
            timestamp = now.toISOString();
            break;
          case "unix":
            timestamp = Math.floor(now.getTime() / 1000).toString();
            break;
          case "readable":
            timestamp = now.toLocaleString();
            break;
          case "friendly": {
            const year = now.getFullYear();
            const month = (now.getMonth() + 1).toString().padStart(2, '0');
            const day = now.getDate().toString().padStart(2, '0');
            timestamp = `${year.toString()}-${month}-${day}`;
            break;
          }
          default: {
            const exhaustiveCheck: never = format;
            return exhaustiveCheck;
          }
        }

        return {
          contents: [
            {
              uri: uri.href,
              mimeType: "text/plain",
              text: timestamp,
            },
          ],
        };
      }
    );
  }
};

export default timestampModule;
