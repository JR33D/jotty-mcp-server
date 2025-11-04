import { z } from 'zod';
import { jottyClient } from '../../lib/jotty-client.js';
import type { RegisterableModule } from '../../registry/types.js';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

export const getExportProgressModule: RegisterableModule = {
  type: 'tool',
  name: 'get_export_progress',
  description: 'Checks the progress of an ongoing data export',
  register: (server: McpServer) => {
    server.tool(
      'get_export_progress',
      'Checks the progress of an ongoing data export',
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
