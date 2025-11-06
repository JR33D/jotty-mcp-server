import { z } from 'zod';
import { jottyClient } from '../../lib/jotty-client.js';
import type { RegisterableModule } from '../../registry/types.js';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

const getSummaryModule: RegisterableModule = {
  type: 'tool',
  name: 'AccountSummaryFetcher',
  description: 'Retrieves summary statistics for the authenticated Jotty account. This administrative tool provides an overview of account activity and data within the MCP system.',
  register: (server: McpServer) => {
    server.tool(
      'AccountSummaryFetcher',
      'Retrieves summary statistics for the authenticated Jotty account. This administrative tool provides an overview of account activity and data within the MCP system.',
      {
        username: z.string().optional(),
      },
      async (args) => {
        const { username: _username } = args;
        /*
         * The jottyClient.getSummary() method does not currently accept a username parameter.
         * If the API supports it in the future, this handler should be updated.
         */
        const summary = await jottyClient.getSummary();
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
