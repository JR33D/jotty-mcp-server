import assert from "node:assert";
import { describe, it, beforeEach, afterEach } from "node:test";
import * as sinon from "sinon";
import { jottyClient, type Checklist, type ChecklistItem } from "../src/lib/jotty-client.js";
import { addChecklistItemModule } from "../src/tools/checklists/add-checklist-item.js";
import { checkItemModule } from "../src/tools/checklists/check-item.js";
import { getAllChecklistsModule } from "../src/tools/checklists/get-all-checklists.js";
import { uncheckItemModule } from "../src/tools/checklists/uncheck-item.js";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

describe("Checklist Tool Unit Tests", () => {
  let sandbox: sinon.SinonSandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    sandbox.stub(process.env, 'JOTTY_BASE_URL').value('http://localhost:1122');
    sandbox.stub(process.env, 'JOTTY_API_KEY').value('ck_xxxxx');
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe("add_checklist_item", () => {
    let handler: (args: { listId: string; text: string; status?: 'todo' | 'done' | 'in_progress' | 'paused'; time?: number }) => Promise<{ content: Array<{ type: string; text: string }> }>;

    beforeEach(() => {
      const serverMock = { tool: (name: string, _desc: string, _schema: unknown, h: (args: {
    listId: string;
    text: string;
    status?: "todo" | "done" | "in_progress" | "paused" | undefined;
    time?: number | undefined;
}) => Promise<{
    content: Array<{
        type: string;
        text: string;
    }>;
}>) => { if (name === 'add_checklist_item') handler = h; } } as McpServer;
      addChecklistItemModule.register(serverMock);
    });

    it("should add an item to a checklist", async () => {
      const newItem: ChecklistItem = { text: "New Item", status: "todo" };
      sandbox.stub(jottyClient, "addChecklistItem").resolves(newItem);
      const response = await handler({ listId: "list-1", text: "New Item" });
      assert(response.content[0] != null);
      assert.deepStrictEqual(JSON.parse(response.content[0].text), newItem);
    });
  });

  describe("check_item", () => {
    let handler: (args: { listId: string; itemIndex: number }) => Promise<{ content: Array<{ type: string; text: string }> }>;

    beforeEach(() => {
      const serverMock = { tool: (name: string, _desc: string, _schema: unknown, h: (args: {
    listId: string;
    itemIndex: number;
}) => Promise<{
    content: Array<{
        type: string;
        text: string;
    }>;
}>) => { if (name === 'check_item') handler = h; } } as McpServer;
      checkItemModule.register(serverMock);
    });

    it("should check an item in a checklist", async () => {
      const checkedItem: ChecklistItem = { text: "Checked Item", status: "done" };
      sandbox.stub(jottyClient, "checkItem").resolves(checkedItem);
      const response = await handler({ listId: "list-1", itemIndex: 0 });
      assert(response.content[0] != null);
      assert.deepStrictEqual(JSON.parse(response.content[0].text), checkedItem);
    });
  });

  describe("get_all_checklists", () => {
    let handler: () => Promise<{ content: Array<{ type: string; text: string }> }>;

    beforeEach(() => {
      const serverMock = { tool: (name: string, _desc: string, _schema: unknown, h: () => Promise<{
    content: Array<{
        type: string;
        text: string;
    }>;
}>) => { if (name === 'get_all_checklists') handler = h; } } as McpServer;
      getAllChecklistsModule.register(serverMock);
    });

    it("should get all checklists", async () => {
      const checklists: Array<Checklist> = [{ id: "list-1", title: "My Checklist", items: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }];
      sandbox.stub(jottyClient, "getAllChecklists").resolves(checklists);
      const response = await handler();
      assert(response.content[0] != null);
      assert.deepStrictEqual(JSON.parse(response.content[0].text), checklists);
    });
  });

  describe("uncheck_item", () => {
    let handler: (args: { listId: string; itemIndex: number }) => Promise<{ content: Array<{ type: string; text: string }> }>;

    beforeEach(() => {
      const serverMock = { tool: (name: string, _desc: string, _schema: unknown, h: (args: {
    listId: string;
    itemIndex: number;
}) => Promise<{
    content: Array<{
        type: string;
        text: string;
    }>;
}>) => { if (name === 'uncheck_item') handler = h; } } as McpServer;
      uncheckItemModule.register(serverMock);
    });

    it("should uncheck an item in a checklist", async () => {
      const uncheckedItem: ChecklistItem = { text: "Unchecked Item", status: "todo" };
      sandbox.stub(jottyClient, "uncheckItem").resolves(uncheckedItem);
      const response = await handler({ listId: "list-1", itemIndex: 0 });
      assert(response.content[0] != null);
      assert.deepStrictEqual(JSON.parse(response.content[0].text), uncheckedItem);
    });
  });
});
