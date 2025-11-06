import { z } from 'zod';
import type { JottyClient } from '../../lib/jotty-client.js';
import type { RegisterableModule } from '../../registry/types.js';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

export type GetSummaryModuleDeps = {
  jottyClient: JottyClient;
};

const getSummaryModule: RegisterableModule<GetSummaryModuleDeps> = {
  type: 'tool',
  name: 'AccountSummaryFetcher',
  description: 'Retrieves summary statistics for the authenticated Jotty account. This administrative tool provides an overview of account activity and data within the MCP system.',
  register: (server: McpServer, deps?: GetSummaryModuleDeps) => {
    const getClient = async (): Promise<JottyClient> => {
      if (deps?.jottyClient !== undefined) {
        return deps.jottyClient;
      }
      const { getJottyClient } = await import('../../lib/jotty-client.js');
      return await getJottyClient();
    };

    server.tool(
      'AccountSummaryFetcher',
      'Retrieves summary statistics for the authenticated Jotty account. This administrative tool provides an overview of account activity and data within the MCP system.',
      {
        username: z.string().optional(),
      },
      async (args) => {
        const { username: _username } = args;
        const client = await getClient();
        const summary = await client.getSummary();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(summary, null, 2),
            },
          ],
        };
      }
    );
  },
};

export default getSummaryModule;