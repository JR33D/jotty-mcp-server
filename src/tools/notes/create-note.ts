import { z } from 'zod';
import { jottyClient } from '../../lib/jotty-client.js';
import type { RegisterableModule } from '../../registry/types.js';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

const createNoteModule: RegisterableModule = {
  type: 'tool',
  name: 'NoteCreator',
  description: 'Facilitates the creation of new notes for the authenticated user via the Jotty API. This tool allows agents to add new textual information to the user\'s collection within the MCP system.',
  register: (server: McpServer) => {
    server.tool(
      'NoteCreator',
      'Facilitates the creation of new notes for the authenticated user via the Jotty API. This tool allows agents to add new textual information to the user\'s collection within the MCP system.',
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

export default createNoteModule;
