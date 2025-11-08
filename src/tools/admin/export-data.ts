import { z } from 'zod';
import type { JottyClient } from '../../lib/jotty-client.js';
import type { RegisterableModule } from '../../registry/types.js';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

export type ExportDataModuleDeps = {
  jottyClient: JottyClient;
};

const exportDataModule: RegisterableModule<ExportDataModuleDeps> = {
  type: 'tool',
  name: 'DataExporter',
  description: 'Initiates a full export of Jotty user data in a specified format. This administrative tool enables comprehensive data backup and migration within the MCP system.',
  register: (server: McpServer, deps?: ExportDataModuleDeps) => {
    const getClient = async (): Promise<JottyClient> => {
      if (deps?.jottyClient !== undefined) {
        return deps.jottyClient;
      }
      const { getJottyClient } = await import('../../lib/jotty-client.js');
      return await getJottyClient();
    };

    server.registerTool(
      'DataExporter',
      {
        title: 'Export Jotty Data',
        description: 'Initiates a full export of Jotty user data in a specified format. This administrative tool enables comprehensive data backup and migration within the MCP system.',
        inputSchema: {
          type: z.enum(['json', 'csv']),
          username: z.string().optional(),
        }
      },
      async (args) => {
        const { type, username } = args;
        const client = await getClient();
        const exportResult = await client.exportData(type, username);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(exportResult, null, 2),
            },
          ],
          structuredContent: { result: exportResult },
        };
      }
    );
  },
};

export default exportDataModule;