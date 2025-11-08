import { z } from 'zod';
import type { JottyClient } from '../../lib/jotty-client.js';
import type { RegisterableModule } from '../../registry/types.js';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

export type GetExportProgressModuleDeps = {
  jottyClient: JottyClient;
};

const getExportProgressModule: RegisterableModule<GetExportProgressModuleDeps> = {
  type: 'tool',
  name: 'ExportProgressMonitor',
  description: 'Monitors the progress of a specified data export operation. This administrative tool provides real-time status updates for data export tasks within the MCP system.',
  register: (server: McpServer, deps?: GetExportProgressModuleDeps) => {
    const getClient = async (): Promise<JottyClient> => {
      if (deps?.jottyClient !== undefined) {
        return deps.jottyClient;
      }
      const { getJottyClient } = await import('../../lib/jotty-client.js');
      return await getJottyClient();
    };

    server.registerTool(
      'ExportProgressMonitor',
      {
        title: 'Monitor Export Progress',
        description: 'Monitors the progress of a specified data export operation. This administrative tool provides real-time status updates for data export tasks within the MCP system.',
        inputSchema: {
          exportId: z.string(),
        }
      },
      async (args) => {
        const { exportId } = args;
        const client = await getClient();
        const exportStatus = await client.getExportProgress(exportId);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(exportStatus, null, 2),
            },
          ],
          structuredContent: { result: exportStatus },
        };
      }
    );
  },
};

export default getExportProgressModule;