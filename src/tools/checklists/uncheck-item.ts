import { z } from 'zod';
import { jottyClient } from '../../lib/jotty-client.js';
import type { RegisterableModule } from '../../registry/types.js';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

const uncheckItemModule: RegisterableModule = {
  type: 'tool',
  name: 'ChecklistItemUnchecker',
  description: 'Marks a specified item within a checklist as incomplete via the Jotty API. This tool enables agents to manage the status of checklist items within the MCP system.',
  register: (server: McpServer) => {
    server.tool(
      'ChecklistItemUnchecker',
      'Marks a specified item within a checklist as incomplete via the Jotty API. This tool enables agents to manage the status of checklist items within the MCP system.',
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
