import { jottyClient } from '../../lib/jotty-client.js';
import type { RegisterableModule } from '../../registry/types.js';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

const getCategoriesModule: RegisterableModule = {
  type: 'tool',
  name: 'CategoryFetcher',
  description: 'Retrieves all available categories from the Jotty API. This administrative tool provides a comprehensive list of categorization options within the MCP system.',
  register: (server: McpServer) => {
    server.tool(
      'CategoryFetcher',
      'Retrieves all available categories from the Jotty API. This administrative tool provides a comprehensive list of categorization options within the MCP system.',
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
