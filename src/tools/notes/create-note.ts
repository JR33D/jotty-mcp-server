import { z } from 'zod';
import { jottyClient } from '../../lib/jotty-client.js';
import type { RegisterableModule } from '../../registry/types.js';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

export const createNoteModule: RegisterableModule = {
  type: 'tool',
  name: 'create_note',
  description: 'Create a new note',
  register: (server: McpServer) => {
    server.tool(
      'create_note',
      'Create a new note',
      {
        title: z.string(),
        content: z.string().optional(),
        category: z.string().optional(),
      },
      async (args) => {
        const { title, content, category } = args;
        const note = await jottyClient.createNote({ title, content: content ?? '', category });
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(note, null, 2),
            },
          ],
        };
      }
    );
  },
};
