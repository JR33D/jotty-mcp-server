import { z } from 'zod';
import type { JottyClient } from '../../lib/jotty-client.js';
import type { RegisterableModule } from '../../registry/types.js';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

export type CheckItemModuleDeps = {
  jottyClient: JottyClient;
};

const checkItemModule: RegisterableModule<CheckItemModuleDeps> = {
  type: 'tool',
  name: 'ChecklistItemChecker',
  description: 'Marks a specified item within a checklist as complete via the Jotty API. This tool allows agents to update the status of checklist items within the MCP system.',
  register: (server: McpServer, deps?: CheckItemModuleDeps) => {
    const getClient = async (): Promise<JottyClient> => {
      if (deps?.jottyClient !== undefined) {
        return deps.jottyClient;
      }
      const { getJottyClient } = await import('../../lib/jotty-client.js');
      return await getJottyClient();
    };

    server.registerTool(
      'ChecklistItemChecker',
      {
        title: 'Checklist Item Checker',
        description: 'Marks a specified item within a checklist as complete via the Jotty API. This tool allows agents to update the status of checklist items within the MCP system.',
        inputSchema: {
          listId: z.string(),
          itemIndex: z.number(),
        },
      },
      async (args) => {
        const { listId, itemIndex } = args;
        const client = await getClient();
        const item = await client.checkItem(listId, itemIndex);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(item, null, 2),
            },
          ],
          structuredContent: { result: item },
        };
      }
    );
  },
};

export default checkItemModule;