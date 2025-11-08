import type { JottyClient } from '../../lib/jotty-client.js';
import type { RegisterableModule } from '../../registry/types.js';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

export type GetAllNotesModuleDeps = {
  jottyClient: JottyClient;
};

const getAllNotesModule: RegisterableModule<GetAllNotesModuleDeps> = {
  type: 'tool',
  name: 'AllNotesFetcher',
  description: 'Retrieves all notes associated with the authenticated user from the Jotty API. This tool facilitates access to user-specific note data within the MCP system.',
  register: (server: McpServer, deps?: GetAllNotesModuleDeps) => {
    const getClient = async (): Promise<JottyClient> => {
      if (deps?.jottyClient !== undefined) {
        return deps.jottyClient;
      }
      const { getJottyClient } = await import('../../lib/jotty-client.js');
      return await getJottyClient();
    };

    server.registerTool(
      'AllNotesFetcher',
      {
        title: 'All Notes Fetcher',
        description: 'Retrieves all notes associated with the authenticated user from the Jotty API. This tool facilitates access to user-specific note data within the MCP system.',
        inputSchema: {},
      },
      async () => {
        const client = await getClient();
        const notes = await client.getAllNotes();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(notes, null, 2),
            },
          ],
          structuredContent: { result: notes },
        };
      }
    );
  },
};

export default getAllNotesModule;