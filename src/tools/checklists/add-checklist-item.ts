import { z } from 'zod';
import { jottyClient } from '../../lib/jotty-client.js';
import type { RegisterableModule } from '../../registry/types.js';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

export const addChecklistItemModule: RegisterableModule = {
  type: 'tool',
  name: 'add_checklist_item',
  description: 'Add an item to a checklist',
  register: (server: McpServer) => {
    server.tool(
      'add_checklist_item',
      'Add an item to a checklist',
      {
        listId: z.string(),
        text: z.string(),
        status: z.enum(['todo', 'done', 'in_progress', 'paused']).optional(),
        time: z.number().optional(),
      },
      async (args) => {
        const { listId, text, status, time } = args;
        const item = await jottyClient.addChecklistItem(listId, { text, status, time });
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(item, null, 2),
            },
          ],
        };
      }
    );
  },
};
