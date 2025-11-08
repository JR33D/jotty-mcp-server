import assert from "node:assert";
import { describe, it, beforeEach, afterEach } from "node:test";
import * as sinon from "sinon";
import createNoteModule from "../src/tools/notes/create-note.js";
import getAllNotesModule from "../src/tools/notes/get-all-notes.js";
import type { JottyClient, JottyNote } from "../src/lib/jotty-client.js";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

// Define a generic type for the tool handler function
type ToolHandler = (
  params?: unknown
) => Promise<{ content: Array<{ text: string }> }>;

describe("Notes Tool Unit Tests", () => {
  let sandbox: sinon.SinonSandbox;
  let testClient: Partial<JottyClient>;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    testClient = {
      createNote: sandbox.stub(),
      getAllNotes: sandbox.stub(),
    };
  });

  afterEach(() => {
    sandbox.restore();
  });

  function createServerMock(): {
    serverMock: McpServer;
    getHandler: () => ToolHandler;
  } {
    let handler: ToolHandler = () => Promise.resolve({ content: [] });
    const serverMock: McpServer = {
      registerTool: (
        _name: string,
        _config: unknown,
        cb: ToolHandler
      ): void => {
        handler = cb;
      },
    } as unknown as McpServer;
    return { serverMock, getHandler: () => handler };
  }

  describe("create-note", () => {
    let handler: ToolHandler;

    beforeEach(() => {
      const { serverMock, getHandler } = createServerMock();
      createNoteModule.register(serverMock, {
        jottyClient: testClient as JottyClient,
      });
      handler = getHandler();
    });

    it("should successfully create a note with title and content", async () => {
      const title = "My Test Note";
      const content = "This is some test content.";
      const expectedNote: JottyNote = {
        id: "mock-note-1",
        title,
        content,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      (testClient.createNote as sinon.SinonStub).resolves(expectedNote);

      const response = await handler({ title, content });

      assert.deepStrictEqual(
        JSON.parse(response.content[0].text) as JottyNote,
        expectedNote
      );
    });

    it("should successfully create a note with only a title", async () => {
      const title = "Title Only Note";
      const expectedNote: JottyNote = {
        id: "mock-note-2",
        title,
        content: "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      (testClient.createNote as sinon.SinonStub).resolves(expectedNote);

      const response = await handler({ title });

      assert.deepStrictEqual(
        JSON.parse(response.content[0].text) as JottyNote,
        expectedNote
      );
      assert(
        (testClient.createNote as sinon.SinonStub).calledWith({
          title,
          content: "",
          category: undefined,
        })
      );
    });

    it("should successfully create a note with a category", async () => {
      const title = "Categorized Note";
      const category = "Work";
      const expectedNote: JottyNote = {
        id: "mock-note-3",
        title,
        content: "",
        category,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      (testClient.createNote as sinon.SinonStub).resolves(expectedNote);

      const response = await handler({ title, category });

      assert.deepStrictEqual(
        JSON.parse(response.content[0].text) as JottyNote,
        expectedNote
      );
      assert(
        (testClient.createNote as sinon.SinonStub).calledWith({
          title,
          content: "",
          category,
        })
      );
    });
  });

  describe("get-all-notes", () => {
    let handler: ToolHandler;

    beforeEach(() => {
      const { serverMock, getHandler } = createServerMock();
      getAllNotesModule.register(serverMock, {
        jottyClient: testClient as JottyClient,
      });
      handler = getHandler();
    });

    it("should successfully retrieve all notes", async () => {
      const expectedNotes: Array<JottyNote> = [
        {
          id: "note-a",
          title: "Note A",
          content: "Content A",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "note-b",
          title: "Note B",
          content: "Content B",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      (testClient.getAllNotes as sinon.SinonStub).resolves(expectedNotes);

      const response = await handler();

      assert.deepStrictEqual(
        JSON.parse(response.content[0].text) as Array<JottyNote>,
        expectedNotes
      );
    });

    it("should return empty array if no notes are found", async () => {
      (testClient.getAllNotes as sinon.SinonStub).resolves([]);

      const response = await handler();

      assert.deepStrictEqual(
        JSON.parse(response.content[0].text) as Array<JottyNote>,
        []
      );
    });
  });
});