import assert from "node:assert";
import { describe, it, beforeEach, afterEach } from "node:test";
import * as sinon from "sinon";
import { getFirstContentText } from "./helpers/test-asserts.js";
import createNoteModule from "../src/tools/notes/create-note.js";
import deleteNoteModule from "../src/tools/notes/delete-note.js";
import getAllNotesModule from "../src/tools/notes/get-all-notes.js";
import updateNoteModule from "../src/tools/notes/update-note.js";
import type { JottyClient, JottyNote } from "../src/lib/jotty-client.js";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

type ToolHandler = (params?: unknown) => Promise<{ content: Array<{ text: string }> }>;

describe("Notes Tool Unit Tests", () => {
  let sandbox: sinon.SinonSandbox;
  let testClient: Partial<JottyClient>;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    testClient = {
      createNote: sandbox.stub(),
      getAllNotes: sandbox.stub(),
      updateNote: sandbox.stub(),
      deleteNote: sandbox.stub(),
    };
  });

  afterEach(() => { sandbox.restore(); });

  function createServerMock(): { serverMock: McpServer; getHandler: () => ToolHandler } {
    let handler: ToolHandler = () => Promise.resolve({ content: [] });
    const serverMock: McpServer = {
      registerTool: (_name: string, _config: unknown, cb: ToolHandler) => { handler = cb; },
    } as unknown as McpServer;
    return { serverMock, getHandler: () => handler };
  }

  describe("create-note", () => {
    let handler: ToolHandler;

    beforeEach(() => {
      const { serverMock, getHandler } = createServerMock();
      createNoteModule.register(serverMock, { jottyClient: testClient as JottyClient });
      handler = getHandler();
    });

    it("creates note with title and content", async () => {
      const expected: JottyNote = { id: "1", title: "Test", content: "Content", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
      (testClient.createNote as sinon.SinonStub).resolves(expected);
      const response = await handler({ title: "Test", content: "Content" });
      const text = getFirstContentText(response);
      assert.deepStrictEqual(JSON.parse(text), expected);
    });

    it("creates note with only title", async () => {
      const expected: JottyNote = { id: "2", title: "Title Only", content: "", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
      (testClient.createNote as sinon.SinonStub).resolves(expected);
      const response = await handler({ title: "Title Only" });
      const text = getFirstContentText(response);
      assert.deepStrictEqual(JSON.parse(text), expected);
    });

    it("creates note with category", async () => {
      const expected: JottyNote = { id: "3", title: "Cat Note", content: "", category: "Work", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
      (testClient.createNote as sinon.SinonStub).resolves(expected);
      const response = await handler({ title: "Cat Note", category: "Work" });
      const text = getFirstContentText(response);
      assert.deepStrictEqual(JSON.parse(text), expected);
    });
  });

  describe("get-all-notes", () => {
    let handler: ToolHandler;

    beforeEach(() => {
      const { serverMock, getHandler } = createServerMock();
      getAllNotesModule.register(serverMock, { jottyClient: testClient as JottyClient });
      handler = getHandler();
    });

    it("retrieves all notes", async () => {
      const expected: Array<JottyNote> = [
        { id: "a", title: "A", content: "A", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { id: "b", title: "B", content: "B", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
      ];
      (testClient.getAllNotes as sinon.SinonStub).resolves(expected);
      const response = await handler();
      const text = getFirstContentText(response);
      assert.deepStrictEqual(JSON.parse(text), expected);
    });

    it("returns empty array if none", async () => {
      (testClient.getAllNotes as sinon.SinonStub).resolves([]);
      const response = await handler();
      const text = getFirstContentText(response);
      assert.deepStrictEqual(JSON.parse(text), []);
    });
  });

  describe("update-note", () => {
    let handler: ToolHandler;

    beforeEach(() => {
      const { serverMock, getHandler } = createServerMock();
      updateNoteModule.register(serverMock, { jottyClient: testClient as JottyClient });
      handler = getHandler();
    });

    it("updates a note", async () => {
      const expected: JottyNote = { id: "1", title: "Updated Title", content: "Updated Content", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
      (testClient.updateNote as sinon.SinonStub).resolves(expected);
      const response = await handler({ noteId: "1", title: "Updated Title", content: "Updated Content" });
      const text = getFirstContentText(response);
      assert.deepStrictEqual(JSON.parse(text), expected);
    });
  });

  describe("delete-note", () => {
    let handler: ToolHandler;

    beforeEach(() => {
      const { serverMock, getHandler } = createServerMock();
      deleteNoteModule.register(serverMock, { jottyClient: testClient as JottyClient });
      handler = getHandler();
    });

    it("deletes a note", async () => {
      const expected = { success: true };
      (testClient.deleteNote as sinon.SinonStub).resolves(expected);
      const response = await handler({ noteId: "1" });
      const text = getFirstContentText(response);
      assert.deepStrictEqual(JSON.parse(text), expected);
    });
  });
});
