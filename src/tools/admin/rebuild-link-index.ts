import { z } from 'zod';
import type { JottyClient } from '../../lib/jotty-client.js';
import type { RegisterableModule } from '../../registry/types.js';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

export type RebuildLinkIndexModuleDeps = {
  jottyClient: JottyClient;
};

const rebuildLinkIndexModule: RegisterableModule<RebuildLinkIndexModuleDeps> = {
  type: 'tool',
  name: 'LinkIndexRebuilder',
  description: 'Rebuilds the internal link index for a specific user.',
  register: (server: McpServer, deps?: RebuildLinkIndexModuleDeps) => {
    const getClient = async (): Promise<JottyClient> => {
      if (deps?.jottyClient !== undefined) {
        return deps.jottyClient;
      }
      const { getJottyClient } = await import('../../lib/jotty-client.js');
      return await getJottyClient();
    };

    server.registerTool(
      'LinkIndexRebuilder',
      {
        title: 'Link Index Rebuilder',
        description: 'Rebuilds the internal link index for a specific user.',
        inputSchema: {
          username: z.string(),
        },
      },
      async (args) => {
        const { username } = args;
        const client = await getClient();
        const result = await client.rebuildLinkIndex(username);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
          structuredContent: { result },
        };
      }
    );
  },
};

export default rebuildLinkIndexModule;
