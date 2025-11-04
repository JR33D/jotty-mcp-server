import { jottyClient } from '../../lib/jotty-client.js';
import type { RegisterableModule } from '../../registry/types.js';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

const getAllChecklistsModule: RegisterableModule = {
  type: 'tool',
  name: 'get_all_checklists',
  description: 'Get all checklists for the authenticated user',
  register: (server: McpServer) => {
    server.tool(
      'get_all_checklists',
      'Get all checklists for the authenticated user',
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