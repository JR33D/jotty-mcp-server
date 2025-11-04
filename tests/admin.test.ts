import assert from "node:assert";
import { describe, it, beforeEach, afterEach } from "node:test";
import * as sinon from "sinon";
import { jottyClient, type Category, type ExportStatus, type SummaryStats, type UserInfo } from "../src/lib/jotty-client.js";
import exportDataModule from "../src/tools/admin/export-data.js";
import getCategoriesModule from "../src/tools/admin/get-categories.js";
import getExportProgressModule from "../src/tools/admin/get-export-progress.js";
import getSummaryModule from "../src/tools/admin/get-summary.js";
import getUserInfoModule from "../src/tools/admin/get-user-info.js";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

describe("Admin Tool Unit Tests", () => {
  let sandbox: sinon.SinonSandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    sandbox.stub(process.env, 'JOTTY_BASE_URL').value('http://localhost:1122');
    sandbox.stub(process.env, 'JOTTY_API_KEY').value('ck_xxxxx');
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe("export_data", () => {
    let handler: (args: { type: 'json' | 'csv', username?: string }) => Promise<{ content: Array<{ type: string; text: string }> }>;

    beforeEach(() => {
      const serverMock = { tool: (name: string, _desc: string, _schema: object, h: typeof handler) => { if (name === 'export_data') handler = h; } } as McpServer;
      exportDataModule.register(serverMock);
    });

    it("should start an export", async () => {
      const exportResult = { exportId: "export-123" };
      sandbox.stub(jottyClient, "exportData").resolves(exportResult);
      const response = await handler({ type: "json" });
      if (response.content[0] != null) {
        assert.deepStrictEqual(JSON.parse(response.content[0].text), exportResult);
      } else {
        assert.fail("response.content or response.content[0] is undefined");
      }
    });
  });

  describe("get_categories", () => {
    let handler: () => Promise<{ content: Array<{ type: string; text: string }> }>;

    beforeEach(() => {
      const serverMock = { tool: (name: string, _desc: string, _schema: object, h: typeof handler) => { if (name === 'get_categories') handler = h; } } as McpServer;
      getCategoriesModule.register(serverMock);
    });

    it("should get all categories", async () => {
      const categories: Array<Category> = [{ id: "cat-1", name: "Work", path: "/work" }];
      sandbox.stub(jottyClient, "getCategories").resolves(categories);
      const response = await handler();
      if (response.content[0] != null) {
        assert.deepStrictEqual(JSON.parse(response.content[0].text), categories);
      } else {
        assert.fail("response.content or response.content[0] is undefined");
      }
    });

    });

  describe("get_export_progress", () => {
    let handler: (args: { exportId: string }) => Promise<{ content: Array<{ type: string; text: string }> }>;

    beforeEach(() => {
      const serverMock = { tool: (name: string, _desc: string, _schema: object, h: typeof handler) => { if (name === 'get_export_progress') handler = h; } } as McpServer;
      getExportProgressModule.register(serverMock);
    });

    it("should get export progress", async () => {
      const exportStatus: ExportStatus = { id: "export-123", status: "completed", progress: 100, downloadUrl: "http://example.com/export.zip" };
      sandbox.stub(jottyClient, "getExportProgress").resolves(exportStatus);
      const response = await handler({ exportId: "export-123" });
      if (response.content[0] != null) {
        assert.deepStrictEqual(JSON.parse(response.content[0].text), exportStatus);
      } else {
        assert.fail("response.content or response.content[0] is undefined");
      }
    });
  });

  describe("get_summary", () => {
    let handler: (args: { username?: string }) => Promise<{ content: Array<{ type: string; text: string }> }>;

    beforeEach(() => {
      const serverMock = { tool: (name: string, _desc: string, _schema: object, h: typeof handler) => { if (name === 'get_summary') handler = h; } } as McpServer;
      getSummaryModule.register(serverMock);
    });

    it("should get summary statistics", async () => {
      const summary: SummaryStats = { totalChecklists: 5, totalNotes: 10, totalItems: 50, completedItems: 25 };
      sandbox.stub(jottyClient, "getSummary").resolves(summary);
      const response = await handler({});
      if (response.content[0] != null) {
        assert.deepStrictEqual(JSON.parse(response.content[0].text), summary);
      } else {
        assert.fail("response.content or response.content[0] is undefined");
      }
    });

    });

  describe("get_user_info", () => {
    let handler: (args: { username: string }) => Promise<{ content: Array<{ type: string; text: string }> }>;

    beforeEach(() => {
      const serverMock = { tool: (name: string, _desc: string, _schema: object, h: typeof handler) => { if (name === 'get_user_info') handler = h; } } as McpServer;
      getUserInfoModule.register(serverMock);
    });

    it("should get user info", async () => {
      const userInfo: UserInfo = { username: "testuser", email: "test@example.com", createdAt: new Date().toISOString() };
      sandbox.stub(jottyClient, "getUserInfo").resolves(userInfo);
      const response = await handler({ username: "testuser" });
      if (response.content[0] != null) {
        assert.deepStrictEqual(JSON.parse(response.content[0].text), userInfo);
      } else {
        assert.fail("response.content or response.content[0] is undefined");
      }
    });
  });
});
