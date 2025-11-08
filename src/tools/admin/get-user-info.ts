import { z } from 'zod';
import type { JottyClient } from '../../lib/jotty-client.js';
import type { RegisterableModule } from '../../registry/types.js';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

export type GetUserInfoModuleDeps = {
  jottyClient: JottyClient;
};

const getUserInfoModule: RegisterableModule<GetUserInfoModuleDeps> = {
  type: 'tool',
  name: 'UserInfoFetcher',
  description: 'Retrieves detailed information for a specified Jotty user. This administrative tool provides insights into user profiles within the MCP system.',
  register: (server: McpServer, deps?: GetUserInfoModuleDeps) => {
    const getClient = async (): Promise<JottyClient> => {
      if (deps?.jottyClient !== undefined) {
        return deps.jottyClient;
      }
      const { getJottyClient } = await import('../../lib/jotty-client.js');
      return await getJottyClient();
    };

    server.registerTool(
      'UserInfoFetcher',
      {
        title: 'User Info Fetcher',
        description: 'Retrieves detailed information for a specified Jotty user. This administrative tool provides insights into user profiles within the MCP system.',
        inputSchema:{
          username: z.string(),
        },
      },
      async (args) => {
        const { username } = args;
        const client = await getClient();
        const userInfo = await client.getUserInfo(username);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(userInfo, null, 2),
            },
          ],
          structuredContent: { result: userInfo },
        };
      }
    );
  },
};

export default getUserInfoModule;