import { z } from 'zod';
import { jottyClient } from '../../lib/jotty-client.js';
import type { RegisterableModule } from '../../registry/types.js';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

export const getUserInfoModule: RegisterableModule = {
  type: 'tool',
  name: 'get_user_info',
  description: 'Get information about a specific Jotty user',
  register: (server: McpServer) => {
    server.tool(
      'get_user_info',
      'Get information about a specific Jotty user',
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
