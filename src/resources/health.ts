import type { JottyClient } from '../lib/jotty-client.js';
import type { RegisterableModule } from '../registry/types.js';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

export type HealthModuleDeps = {
  jottyClient: JottyClient;
};

const healthModule: RegisterableModule<HealthModuleDeps> = {
  type: 'resource',
  name: 'HealthChecker',
  description: 'Checks the health of the Jotty API.',
  register: (server: McpServer, deps?: HealthModuleDeps) => {
    const getClient = async (): Promise<JottyClient> => {
      if (deps?.jottyClient !== undefined) {
        return deps.jottyClient;
      }
      const { getJottyClient } = await import('../lib/jotty-client.js');
      return await getJottyClient();
    };

    server.registerTool(
      'HealthChecker',
      {
        title: 'Health Checker',
        description: 'Checks the health of the Jotty API.',
        inputSchema: {},
      },
      async () => {
        const client = await getClient();
        const health = await client.getHealth();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(health, null, 2),
            },
          ],
          structuredContent: { result: health },
        };
      }
    );
  },
};

export default healthModule;
