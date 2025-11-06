import { z } from 'zod';
import { jottyClient } from '../../lib/jotty-client.js';
import type { RegisterableModule } from '../../registry/types.js';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

const addChecklistItemModule: RegisterableModule = {
  type: 'tool',
  name: 'ChecklistItemAdder',
  description: 'Adds a new item to a specified checklist via the Jotty API. This tool allows agents to extend existing checklists with new tasks or entries within the MCP system.',
  register: (server: McpServer) => {
    server.tool(
      'ChecklistItemAdder',
      'Adds a new item to a specified checklist via the Jotty API. This tool allows agents to extend existing checklists with new tasks or entries within the MCP system.',
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

export default addChecklistItemModule;
