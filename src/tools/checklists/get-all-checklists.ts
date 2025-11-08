import type { JottyClient } from '../../lib/jotty-client.js';
import type { RegisterableModule } from '../../registry/types.js';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

export type GetAllChecklistsModuleDeps = {
  jottyClient: JottyClient;
};

const getAllChecklistsModule: RegisterableModule<GetAllChecklistsModuleDeps> = {
  type: 'tool',
  name: 'AllChecklistsFetcher',
  description: 'Retrieves all checklists associated with the authenticated user from the Jotty API. This tool provides agents with access to the user\'s complete list of checklists within the MCP system.',
  register: (server: McpServer, deps?: GetAllChecklistsModuleDeps) => {
    const getClient = async (): Promise<JottyClient> => {
      if (deps?.jottyClient !== undefined) {
        return deps.jottyClient;
      }
      const { getJottyClient } = await import('../../lib/jotty-client.js');
      return await getJottyClient();
    };

    server.registerTool(
      'AllChecklistsFetcher',
      {
        title: 'All Checklist Fetcher', 
        description: 'Retrieves all checklists associated with the authenticated user from the Jotty API. This tool provides agents with access to the user\'s complete list of checklists within the MCP system.',
        inputSchema: {},
      },
      async () => {
        const client = await getClient();
        const checklists = await client.getAllChecklists();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(checklists, null, 2),
            },
          ],
          structuredContent: { result: checklists },
        };
      }
    );
  },
};

export default getAllChecklistsModule;