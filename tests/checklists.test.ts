import assert from "node:assert";
import { describe, it, beforeEach, afterEach } from "node:test";
import * as sinon from "sinon";
import { getFirstContentText } from "./helpers/test-asserts.js";
import addChecklistItemModule from "../src/tools/checklists/add-checklist-item.js";
import checkItemModule from "../src/tools/checklists/check-item.js";
import getAllChecklistsModule from "../src/tools/checklists/get-all-checklists.js";
import uncheckItemModule from "../src/tools/checklists/uncheck-item.js";
import type { JottyClient, ChecklistItem, Checklist } from "../src/lib/jotty-client.js";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

type ToolHandler = (params?: unknown) => Promise<{ content: Array<{ text: string }> }>;

describe("Checklist Tool Unit Tests", () => {
  let sandbox: sinon.SinonSandbox;
  let testClient: Partial<JottyClient>;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    testClient = {
      addChecklistItem: sandbox.stub(),
      checkItem: sandbox.stub(),
      getAllChecklists: sandbox.stub(),
      uncheckItem: sandbox.stub(),
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

  describe("add-checklist-item", () => {
    let handler: ToolHandler;

    beforeEach(() => {
      const { serverMock, getHandler } = createServerMock();
      addChecklistItemModule.register(serverMock, { jottyClient: testClient as JottyClient });
      handler = getHandler();
    });

    it("should add an item to a checklist", async () => {
      const newItem: ChecklistItem = { text: "New Item", status: "todo" };
      (testClient.addChecklistItem as sinon.SinonStub).resolves(newItem);
      const response = await handler({ listId: "list-1", text: "New Item" });
      const text = getFirstContentText(response);
      assert.deepStrictEqual(JSON.parse(text), newItem);
    });

    it("should add an item with a specific status", async () => {
      const newItem: ChecklistItem = { text: "New Item", status: "in_progress" };
      (testClient.addChecklistItem as sinon.SinonStub).resolves(newItem);
      const response = await handler({ listId: "list-1", text: "New Item", status: "in_progress" });
      const text = getFirstContentText(response);
      assert.deepStrictEqual(JSON.parse(text), newItem);
    });
  });

  describe("check-item", () => {
    let handler: ToolHandler;

    beforeEach(() => {
      const { serverMock, getHandler } = createServerMock();
      checkItemModule.register(serverMock, { jottyClient: testClient as JottyClient });
      handler = getHandler();
    });

    it("should check an item", async () => {
      const checkedItem: ChecklistItem = { text: "Checked Item", status: "done" };
      (testClient.checkItem as sinon.SinonStub).resolves(checkedItem);
      const response = await handler({ listId: "list-1", itemIndex: 0 });
      const text = getFirstContentText(response);
      assert.deepStrictEqual(JSON.parse(text), checkedItem);
    });
  });

  describe("get-all-checklists", () => {
    let handler: ToolHandler;

    beforeEach(() => {
      const { serverMock, getHandler } = createServerMock();
      getAllChecklistsModule.register(serverMock, { jottyClient: testClient as JottyClient });
      handler = getHandler();
    });

    it("should get all checklists", async () => {
      const checklists: Array<Checklist> = [{
        id: "list-1",
        title: "My Checklist",
        items: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }];
      (testClient.getAllChecklists as sinon.SinonStub).resolves(checklists);
      const response = await handler();
      const text = getFirstContentText(response);
      assert.deepStrictEqual(JSON.parse(text), checklists);
    });

    it("should return empty array if none found", async () => {
      (testClient.getAllChecklists as sinon.SinonStub).resolves([]);
      const response = await handler();
      const text = getFirstContentText(response);
      assert.deepStrictEqual(JSON.parse(text), []);
    });
  });

  describe("uncheck-item", () => {
    let handler: ToolHandler;

    beforeEach(() => {
      const { serverMock, getHandler } = createServerMock();
      uncheckItemModule.register(serverMock, { jottyClient: testClient as JottyClient });
      handler = getHandler();
    });

    it("should uncheck an item", async () => {
      const uncheckedItem: ChecklistItem = { text: "Unchecked Item", status: "todo" };
      (testClient.uncheckItem as sinon.SinonStub).resolves(uncheckedItem);
      const response = await handler({ listId: "list-1", itemIndex: 0 });
      const text = getFirstContentText(response);
      assert.deepStrictEqual(JSON.parse(text), uncheckedItem);
    });
  });
});
