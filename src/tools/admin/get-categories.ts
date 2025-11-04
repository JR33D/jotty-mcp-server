import { jottyClient } from '../../lib/jotty-client.js';
import type { RegisterableModule } from '../../registry/types.js';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

export const getCategoriesModule: RegisterableModule = {
  type: 'tool',
  name: 'get_categories',
  description: 'Get all available categories',
  register: (server: McpServer) => {
    server.tool(
      'get_categories',
      'Get all available categories',
      {},
      async () => {
        const categories = await jottyClient.getCategories();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(categories, null, 2),
            },
          ],
        };
      }
    );
  },
};

export default getCategoriesModule;
