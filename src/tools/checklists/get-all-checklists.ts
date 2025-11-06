import { jottyClient } from '../../lib/jotty-client.js';
import type { RegisterableModule } from '../../registry/types.js';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

const getAllChecklistsModule: RegisterableModule = {
  type: 'tool',
  name: 'AllChecklistsFetcher',
  description: 'Retrieves all checklists associated with the authenticated user from the Jotty API. This tool provides agents with access to the user\'s complete list of checklists within the MCP system.',
  register: (server: McpServer) => {
    server.tool(
      'AllChecklistsFetcher',
      'Retrieves all checklists associated with the authenticated user from the Jotty API. This tool provides agents with access to the user\'s complete list of checklists within the MCP system.',
      {},
      async () => {
        const checklists = await jottyClient.getAllChecklists();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(checklists, null, 2),
            },
          ],
        };
      }
    );
  },
};

export default getAllChecklistsModule;