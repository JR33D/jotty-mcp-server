import { jottyClient } from '../../lib/jotty-client.js';
import type { RegisterableModule } from '../../registry/types.js';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

const getAllNotesModule: RegisterableModule = {
  type: 'tool',
  name: 'AllNotesFetcher',
  description: 'Retrieves all notes associated with the authenticated user from the Jotty API. This tool facilitates access to user-specific note data within the MCP system.',
  register: (server: McpServer) => {
    server.tool(
      'AllNotesFetcher',
      'Retrieves all notes associated with the authenticated user from the Jotty API. This tool facilitates access to user-specific note data within the MCP system.',
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
