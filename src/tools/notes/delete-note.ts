import { z } from 'zod';
import type { JottyClient } from '../../lib/jotty-client.js';
import type { RegisterableModule } from '../../registry/types.js';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

export type DeleteNoteModuleDeps = {
  jottyClient: JottyClient;
};

const deleteNoteModule: RegisterableModule<DeleteNoteModuleDeps> = {
  type: 'tool',
  name: 'NoteDeleter',
  description: 'Deletes an existing note for the authenticated user via the Jotty API.',
  register: (server: McpServer, deps?: DeleteNoteModuleDeps) => {
    const getClient = async (): Promise<JottyClient> => {
      if (deps?.jottyClient !== undefined) {
        return deps.jottyClient;
      }
      const { getJottyClient } = await import('../../lib/jotty-client.js');
      return await getJottyClient();
    };

    server.registerTool(
      'NoteDeleter',
      {
        title: 'Note Deleter',
        description: 'Deletes an existing note for the authenticated user via the Jotty API.',
        inputSchema: {
          noteId: z.string(),
        },
      },
      async (args) => {
        const { noteId } = args;
        const client = await getClient();
        const result = await client.deleteNote(noteId);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
          structuredContent: { result },
        };
      }
    );
  },
};

export default deleteNoteModule;
