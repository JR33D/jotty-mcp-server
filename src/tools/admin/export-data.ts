import { z } from 'zod';
import { jottyClient } from '../../lib/jotty-client.js';
import type { RegisterableModule } from '../../registry/types.js';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

const exportDataModule: RegisterableModule = {
  type: 'tool',
  name: 'DataExporter',
  description: 'Initiates a full export of Jotty user data in a specified format. This administrative tool enables comprehensive data backup and migration within the MCP system.',
  register: (server: McpServer) => {
    server.tool(
      'DataExporter',
      'Initiates a full export of Jotty user data in a specified format. This administrative tool enables comprehensive data backup and migration within the MCP system.',
      {
        type: z.enum(['json', 'csv']),
        username: z.string().optional(),
      },
      async (args) => {
        const { type, username } = args;
        const exportResult = await jottyClient.exportData(type, username);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(exportResult, null, 2),
            },
          ],
        };
      }
    );
  },
};

export default exportDataModule;
