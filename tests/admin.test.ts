import assert from "node:assert";
import { describe, it, beforeEach, afterEach } from "node:test";
import * as sinon from "sinon";
import { getFirstContentText } from "./helpers/test-asserts.js";
import healthModule from "../src/resources/health.js";
import exportDataModule from "../src/tools/admin/export-data.js";
import getCategoriesModule from "../src/tools/admin/get-categories.js";
import getExportProgressModule from "../src/tools/admin/get-export-progress.js";
import getSummaryModule from "../src/tools/admin/get-summary.js";
import getUserInfoModule from "../src/tools/admin/get-user-info.js";
import rebuildLinkIndexModule from "../src/tools/admin/rebuild-link-index.js";
import type { JottyClient } from "../src/lib/jotty-client.js";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

// ToolHandler type
type ToolHandler = (params?: unknown) => Promise<{ content: Array<{ text: string }> }>;

describe("Admin Tool Unit Tests", () => {
  let sandbox: sinon.SinonSandbox;
  let testClient: Partial<JottyClient>;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    testClient = {
      exportData: sandbox.stub(),
      getCategories: sandbox.stub(),
      getExportProgress: sandbox.stub(),
      getSummary: sandbox.stub(),
      getUserInfo: sandbox.stub(),
      rebuildLinkIndex: sandbox.stub(),
      getHealth: sandbox.stub(),
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

  describe("export-data", () => {
    let handler: ToolHandler;

    beforeEach(() => {
      const { serverMock, getHandler } = createServerMock();
      exportDataModule.register(serverMock, { jottyClient: testClient as JottyClient });
      handler = getHandler();
    });

    it("starts an export", async () => {
      (testClient.exportData as sinon.SinonStub).resolves({ exportId: "export-123" });
      const response = await handler({ type: "json" });
      const text = getFirstContentText(response);
      const parsed: unknown = JSON.parse(text);
      assert.deepStrictEqual(parsed, { exportId: "export-123" });
    });
  });

  describe("get-categories", () => {
    let handler: ToolHandler;

    beforeEach(() => {
      const { serverMock, getHandler } = createServerMock();
      getCategoriesModule.register(serverMock, { jottyClient: testClient as JottyClient });
      handler = getHandler();
    });

    it("returns all categories", async () => {
      const categories = [{ id: "cat-1", name: "Work", path: "/work" }];
      (testClient.getCategories as sinon.SinonStub).resolves(categories);
      const response = await handler();
      const text = getFirstContentText(response);
      const parsed: unknown = JSON.parse(text);
      assert.deepStrictEqual(parsed, categories);
    });
  });

  describe("get-export-progress", () => {
    let handler: ToolHandler;

    beforeEach(() => {
      const { serverMock, getHandler } = createServerMock();
      getExportProgressModule.register(serverMock, { jottyClient: testClient as JottyClient });
      handler = getHandler();
    });

    it("returns export progress", async () => {
      const status = { id: "export-123", status: "completed", progress: 100, downloadUrl: "http://example.com/export.zip" };
      (testClient.getExportProgress as sinon.SinonStub).resolves(status);
      const response = await handler({ exportId: "export-123" });
      const text = getFirstContentText(response);
      assert.deepStrictEqual(JSON.parse(text), status);
    });
  });

  describe("get-summary", () => {
    let handler: ToolHandler;

    beforeEach(() => {
      const { serverMock, getHandler } = createServerMock();
      getSummaryModule.register(serverMock, { jottyClient: testClient as JottyClient });
      handler = getHandler();
    });

    it("returns summary stats", async () => {
      const summary = { totalChecklists: 5, totalNotes: 10, totalItems: 50, completedItems: 25 };
      (testClient.getSummary as sinon.SinonStub).resolves(summary);
      const response = await handler({});
      const text = getFirstContentText(response);
      assert.deepStrictEqual(JSON.parse(text), summary);
    });
  });

  describe("get-user-info", () => {
    let handler: ToolHandler;

    beforeEach(() => {
      const { serverMock, getHandler } = createServerMock();
      getUserInfoModule.register(serverMock, { jottyClient: testClient as JottyClient });
      handler = getHandler();
    });

    it("returns user info", async () => {
      const userInfo = { username: "testuser", email: "test@example.com", createdAt: new Date().toISOString() };
      (testClient.getUserInfo as sinon.SinonStub).resolves(userInfo);
      const response = await handler({ username: "testuser" });
      const text = getFirstContentText(response);
      assert.deepStrictEqual(JSON.parse(text), userInfo);
    });
  });

  describe("rebuild-link-index", () => {
    let handler: ToolHandler;

    beforeEach(() => {
      const { serverMock, getHandler } = createServerMock();
      rebuildLinkIndexModule.register(serverMock, { jottyClient: testClient as JottyClient });
      handler = getHandler();
    });

    it("rebuilds the link index for a user", async () => {
      const result = { success: true, message: "Successfully rebuilt link index for testuser" };
      (testClient.rebuildLinkIndex as sinon.SinonStub).resolves(result);
      const response = await handler({ username: "testuser" });
      const text = getFirstContentText(response);
      assert.deepStrictEqual(JSON.parse(text), result);
    });
  });

  describe("health", () => {
    let handler: ToolHandler;

    beforeEach(() => {
      const { serverMock, getHandler } = createServerMock();
      healthModule.register(serverMock, { jottyClient: testClient as JottyClient });
      handler = getHandler();
    });

    it("returns health status", async () => {
      const health = { status: "healthy", version: "1.9.3", timestamp: "2025-10-31T21:15:57.009Z" };
      (testClient.getHealth as sinon.SinonStub).resolves(health);
      const response = await handler({});
      const text = getFirstContentText(response);
      assert.deepStrictEqual(JSON.parse(text), health);
    });
  });
});
