import { z } from 'zod';
import { jottyClient } from '../../lib/jotty-client.js';
import type { RegisterableModule } from '../../registry/types.js';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

const getExportProgressModule: RegisterableModule = {
  type: 'tool',
  name: 'ExportProgressMonitor',
  description: 'Monitors the progress of a specified data export operation. This administrative tool provides real-time status updates for data export tasks within the MCP system.',
  register: (server: McpServer) => {
    server.tool(
      'ExportProgressMonitor',
      'Monitors the progress of a specified data export operation. This administrative tool provides real-time status updates for data export tasks within the MCP system.',
      {
        exportId: z.string(),
      },
      async (args) => {
        const { exportId } = args;
        const exportStatus = await jottyClient.getExportProgress(exportId);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(exportStatus, null, 2),
            },
          ],
        };
      }
    );
  },
};

export default getExportProgressModule;
