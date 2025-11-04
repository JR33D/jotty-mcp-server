import { z } from 'zod';
import { jottyClient } from '../../lib/jotty-client.js';
import type { RegisterableModule } from '../../registry/types.js';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

export const checkItemModule: RegisterableModule = {
  type: 'tool',
  name: 'check_item',
  description: 'Mark an item in a checklist as complete',
  register: (server: McpServer) => {
    server.tool(
      'check_item',
      'Mark an item in a checklist as complete',
      {
        listId: z.string(),
        itemIndex: z.number(),
      },
      async (args) => {
        const { listId, itemIndex } = args;
        const item = await jottyClient.checkItem(listId, itemIndex);
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
