import { z } from 'zod';
import { jottyClient } from '../../lib/jotty-client.js';
import type { RegisterableModule } from '../../registry/types.js';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

const uncheckItemModule: RegisterableModule = {
  type: 'tool',
  name: 'uncheck_item',
  description: 'Mark an item in a checklist as incomplete',
  register: (server: McpServer) => {
    server.tool(
      'uncheck_item',
      'Mark an item in a checklist as incomplete',
      {
        listId: z.string(),
        itemIndex: z.number(),
      },
      async (args) => {
        const { listId, itemIndex } = args;
        const item = await jottyClient.uncheckItem(listId, itemIndex);
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

export default uncheckItemModule;
