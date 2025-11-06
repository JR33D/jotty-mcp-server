import { z } from 'zod';
import { jottyClient } from '../../lib/jotty-client.js';
import type { RegisterableModule } from '../../registry/types.js';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

const checkItemModule: RegisterableModule = {
  type: 'tool',
  name: 'ChecklistItemChecker',
  description: 'Marks a specified item within a checklist as complete via the Jotty API. This tool allows agents to update the status of checklist items within the MCP system.',
  register: (server: McpServer) => {
    server.tool(
      'ChecklistItemChecker',
      'Marks a specified item within a checklist as complete via the Jotty API. This tool allows agents to update the status of checklist items within the MCP system.',
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

export default checkItemModule;
