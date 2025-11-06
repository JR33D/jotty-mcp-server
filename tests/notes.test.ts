import assert from "node:assert";
import { describe, it, beforeEach, afterEach } from "node:test";
import * as sinon from "sinon";
import { createTestConfig } from "./helpers/test-config.js";
import { createJottyClient, type JottyNote } from "../src/lib/jotty-client.js";
import createNoteModule from "../src/tools/notes/create-note.js";
import getAllNotesModule from "../src/tools/notes/get-all-notes.js";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

describe("create_note Tool Unit Tests", () => {
  let sandbox: sinon.SinonSandbox;
  let testClient: ReturnType<typeof createJottyClient>;
  let createNoteHandler: (args: { title: string; content?: string; category?: string }) => Promise<{ content: Array<{ type: string; text: string }> }>;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    
    const config = createTestConfig();
    testClient = createJottyClient(config);
    
    const serverMock = {
      tool: (_name: string, _description: string, _schema: unknown, handler: typeof createNoteHandler) => {
        createNoteHandler = handler;
      },
    } as McpServer;
    createNoteModule.register(serverMock, { jottyClient: testClient });
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("should successfully create a note with title and content", async () => {
    const title = "My Test Note";
    const content = "This is some test content.";
    const expectedNote: JottyNote = { 
      id: 'mock-note-1', 
      title, 
      content, 
      createdAt: new Date().toISOString(), 
      updatedAt: new Date().toISOString() 
    };

    const createNoteStub = sandbox.stub(testClient, "createNote").resolves(expectedNote);

    const response = await createNoteHandler({ title, content });

    assert(createNoteStub.calledOnceWith({ title, content, category: undefined }));
    assert(response.content[0] != null);
    assert.deepStrictEqual(JSON.parse(response.content[0].text), expectedNote);
  });

  it("should successfully create a note with only title", async () => {
    const title = "Title Only Note";
    const expectedNote: JottyNote = { 
      id: 'mock-note-2', 
      title, 
      content: '', 
      createdAt: new Date().toISOString(), 
      updatedAt: new Date().toISOString() 
    };

    const createNoteStub = sandbox.stub(testClient, "createNote").resolves(expectedNote);

    const response = await createNoteHandler({ title });

    assert(createNoteStub.calledOnceWith({ title, content: '', category: undefined }));
    assert(response.content[0] != null);
    assert.deepStrictEqual(JSON.parse(response.content[0].text), expectedNote);
  });

  it("should handle errors from jottyClient.createNote", async () => {
    const errorMessage = "Failed to create note in Jotty API";
    sandbox.stub(testClient, "createNote").rejects(new Error(errorMessage));

    await assert.rejects(
      createNoteHandler({ title: 'Error Note' }),
      new Error(errorMessage)
    );
  });
});

describe("get_all_notes Tool Unit Tests", () => {
  let sandbox: sinon.SinonSandbox;
  let testClient: ReturnType<typeof createJottyClient>;
  let getAllNotesHandler: () => Promise<{ content: Array<{ type: string; text: string }> }>;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    
    const config = createTestConfig();
    testClient = createJottyClient(config);
    
    const serverMock = {
      tool: (_name: string, _description: string, _schema: unknown, handler: typeof getAllNotesHandler) => {
        getAllNotesHandler = handler;
      },
    } as McpServer;
    getAllNotesModule.register(serverMock, { jottyClient: testClient });
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("should successfully retrieve all notes", async () => {
    const expectedNotes: Array<JottyNote> = [
      { id: 'note-a', title: 'Note A', content: 'Content A', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: 'note-b', title: 'Note B', content: 'Content B', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    ];
    sandbox.stub(testClient, "getAllNotes").resolves(expectedNotes);

    const response = await getAllNotesHandler();

    assert(response.content[0] != null);
    assert.deepStrictEqual(JSON.parse(response.content[0].text), expectedNotes);
  });

  it("should handle errors from jottyClient.getAllNotes", async () => {
    const errorMessage = "Failed to fetch notes from Jotty API";
    sandbox.stub(testClient, "getAllNotes").rejects(new Error(errorMessage));

    await assert.rejects(getAllNotesHandler(), new Error(errorMessage));
  });

  it("should return empty array if no notes are found", async () => {
    sandbox.stub(testClient, "getAllNotes").resolves([]);

    const response = await getAllNotesHandler();

    assert(response.content[0] != null);
    assert.deepStrictEqual(JSON.parse(response.content[0].text), []);
  });
});