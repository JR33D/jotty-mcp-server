import { z } from 'zod';
import { jottyClient } from '../../lib/jotty-client.js';
import type { RegisterableModule } from '../../registry/types.js';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

const getUserInfoModule: RegisterableModule = {
  type: 'tool',
  name: 'UserInfoFetcher',
  description: 'Retrieves detailed information for a specified Jotty user. This administrative tool provides insights into user profiles within the MCP system.',
  register: (server: McpServer) => {
    server.tool(
      'UserInfoFetcher',
      'Retrieves detailed information for a specified Jotty user. This administrative tool provides insights into user profiles within the MCP system.',
      {
        username: z.string(),
      },
      async (args) => {
        const { username } = args;
        const userInfo = await jottyClient.getUserInfo(username);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(userInfo, null, 2),
            },
          ],
        };
      }
    );
  },
};

export default getUserInfoModule;
