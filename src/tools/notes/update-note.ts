import { z } from 'zod';
import type { JottyClient } from '../../lib/jotty-client.js';
import type { RegisterableModule } from '../../registry/types.js';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

export type UpdateNoteModuleDeps = {
  jottyClient: JottyClient;
};

const updateNoteModule: RegisterableModule<UpdateNoteModuleDeps> = {
  type: 'tool',
  name: 'NoteUpdater',
  description: 'Updates an existing note for the authenticated user via the Jotty API.',
  register: (server: McpServer, deps?: UpdateNoteModuleDeps) => {
    const getClient = async (): Promise<JottyClient> => {
      if (deps?.jottyClient !== undefined) {
        return deps.jottyClient;
      }
      const { getJottyClient } = await import('../../lib/jotty-client.js');
      return await getJottyClient();
    };

    server.registerTool(
      'NoteUpdater',
      {
        title: 'Note Updater',
        description: 'Updates an existing note for the authenticated user via the Jotty API.',
        inputSchema: {
          noteId: z.string(),
          title: z.string(),
          content: z.string().optional(),
          category: z.string().optional(),
          originalCategory: z.string().optional(),
        },
      },
      async (args) => {
        const { noteId, title, content, category, originalCategory } = args;
        const client = await getClient();
        const note = await client.updateNote(noteId, { title, content, category, originalCategory });
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(note, null, 2),
            },
          ],
          structuredContent: { result: note },
        };
      }
    );
  },
};

export default updateNoteModule;
