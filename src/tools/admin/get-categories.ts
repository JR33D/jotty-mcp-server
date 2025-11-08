import type { JottyClient } from '../../lib/jotty-client.js';
import type { RegisterableModule } from '../../registry/types.js';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

export type GetCategoriesModuleDeps = {
  jottyClient: JottyClient;
};

const getCategoriesModule: RegisterableModule<GetCategoriesModuleDeps> = {
  type: 'tool',
  name: 'CategoryFetcher',
  description: 'Retrieves all available categories from the Jotty API. This administrative tool provides a comprehensive list of categorization options within the MCP system.',
  register: (server: McpServer, deps?: GetCategoriesModuleDeps) => {
    const getClient = async (): Promise<JottyClient> => {
      if (deps?.jottyClient !== undefined) {
        return deps.jottyClient;
      }
      const { getJottyClient } = await import('../../lib/jotty-client.js');
      return await getJottyClient();
    };

    server.registerTool(
      'CategoryFetcher',
      {
        title: 'Get all Categories',
        description: 'Retrieves all available categories from the Jotty API. This administrative tool provides a comprehensive list of categorization options within the MCP system.',
        inputSchema: {},
      },
      async () => {
        const client = await getClient();
        const categories = await client.getCategories();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(categories, null, 2),
            },
          ],
          structuredContent: { result: categories },
        };
      }
    );
  },
};

export default getCategoriesModule;