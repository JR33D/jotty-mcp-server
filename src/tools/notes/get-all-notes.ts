import { jottyClient } from '../../lib/jotty-client.js';
import type { RegisterableModule } from '../../registry/types.js';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

const getAllNotesModule: RegisterableModule = {
  type: 'tool',
  name: 'get_all_notes',
  description: 'Get all notes for the authenticated user',
  register: (server: McpServer) => {
    server.tool(
      'get_all_notes',
      'Get all notes for the authenticated user',
      {},
      async () => {
        const notes = await jottyClient.getAllNotes();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(notes, null, 2),
            },
          ],
        };
      }
    );
  },
};

export default getAllNotesModule;
