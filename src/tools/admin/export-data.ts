import { z } from 'zod';
import { jottyClient } from '../../lib/jotty-client.js';
import type { RegisterableModule } from '../../registry/types.js';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

const exportDataModule: RegisterableModule = {
  type: 'tool',
  name: 'export_data',
  description: 'Starts a full export of your Jotty data',
  register: (server: McpServer) => {
    server.tool(
      'export_data',
      'Starts a full export of your Jotty data',
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
