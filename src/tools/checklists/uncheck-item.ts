import { z } from 'zod';
import type { JottyClient } from '../../lib/jotty-client.js';
import type { RegisterableModule } from '../../registry/types.js';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

export type UncheckItemModuleDeps = {
  jottyClient: JottyClient;
};

const uncheckItemModule: RegisterableModule<UncheckItemModuleDeps> = {
  type: 'tool',
  name: 'ChecklistItemUnchecker',
  description: 'Marks a specified item within a checklist as incomplete via the Jotty API. This tool enables agents to manage the status of checklist items within the MCP system.',
  register: (server: McpServer, deps?: UncheckItemModuleDeps) => {
    const getClient = async (): Promise<JottyClient> => {
      if (deps?.jottyClient !== undefined) {
        return deps.jottyClient;
      }
      const { getJottyClient } = await import('../../lib/jotty-client.js');
      return await getJottyClient();
    };

    server.tool(
      'ChecklistItemUnchecker',
      'Marks a specified item within a checklist as incomplete via the Jotty API. This tool enables agents to manage the status of checklist items within the MCP system.',
      {
        listId: z.string(),
        itemIndex: z.number(),
      },
      async (args) => {
        const { listId, itemIndex } = args;
        const client = await getClient();
        const item = await client.uncheckItem(listId, itemIndex);
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