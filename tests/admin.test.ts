import assert from "node:assert";
import { describe, it, beforeEach, afterEach } from "node:test";
import * as sinon from "sinon";

import exportDataModule from "../src/tools/admin/export-data.js";
import getCategoriesModule from "../src/tools/admin/get-categories.js";
import getExportProgressModule from "../src/tools/admin/get-export-progress.js";
import getSummaryModule from "../src/tools/admin/get-summary.js";
import getUserInfoModule from "../src/tools/admin/get-user-info.js";

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { JottyClient } from "../src/lib/jotty-client.js";
import { Handler } from "express";

describe("Admin Tool Unit Tests", () => {
  let sandbox: sinon.SinonSandbox;
  let testClient: Partial<JottyClient>; // minimal stub for each test

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    testClient = {
      exportData: sandbox.stub(),
      getCategories: sandbox.stub(),
      getExportProgress: sandbox.stub(),
      getSummary: sandbox.stub(),
      getUserInfo: sandbox.stub(),
    };
  });

  afterEach(() => {
    sandbox.restore();
  });

  function createServerMock() {
    let handler: any;
    const serverMock: McpServer = {
      registerTool: (_name: string, _config: unknown, cb: Handler) => {
        handler = cb;
      },
    } as unknown as McpServer;
    return { serverMock, getHandler: () => handler };
  }

  describe("export-data", () => {
    let handler: any;

    beforeEach(() => {
      const { serverMock, getHandler } = createServerMock();
      exportDataModule.register(serverMock, { jottyClient: testClient as JottyClient });
      handler = getHandler();
    });

    it("starts an export", async () => {
      (testClient.exportData as sinon.SinonStub).resolves({ exportId: "export-123" });

      const response = await handler({ type: "json" });

      assert.deepStrictEqual(
        JSON.parse(response.content[0].text),
        { exportId: "export-123" }
      );
    });
  });

  describe("get-categories", () => {
    let handler: any;

    beforeEach(() => {
      const { serverMock, getHandler } = createServerMock();
      getCategoriesModule.register(serverMock, { jottyClient: testClient as JottyClient });
      handler = getHandler();
    });

    it("returns all categories", async () => {
      const categories = [{ id: "cat-1", name: "Work", path: "/work" }];
      (testClient.getCategories as sinon.SinonStub).resolves(categories);

      const response = await handler();

      assert.deepStrictEqual(JSON.parse(response.content[0].text), categories);
    });
  });

  describe("get-export-progress", () => {
    let handler: any;

    beforeEach(() => {
      const { serverMock, getHandler } = createServerMock();
      getExportProgressModule.register(serverMock, { jottyClient: testClient as JottyClient });
      handler = getHandler();
    });

    it("returns export progress", async () => {
      const status = { id: "export-123", status: "completed", progress: 100, downloadUrl: "http://example.com/export.zip" };
      (testClient.getExportProgress as sinon.SinonStub).resolves(status);

      const response = await handler({ exportId: "export-123" });

      assert.deepStrictEqual(JSON.parse(response.content[0].text), status);
    });
  });

  describe("get-summary", () => {
    let handler: any;

    beforeEach(() => {
      const { serverMock, getHandler } = createServerMock();
      getSummaryModule.register(serverMock, { jottyClient: testClient as JottyClient });
      handler = getHandler();
    });

    it("returns summary stats", async () => {
      const summary = { totalChecklists: 5, totalNotes: 10, totalItems: 50, completedItems: 25 };
      (testClient.getSummary as sinon.SinonStub).resolves(summary);

      const response = await handler({});

      assert.deepStrictEqual(JSON.parse(response.content[0].text), summary);
    });
  });

  describe("get-user-info", () => {
    let handler: any;

    beforeEach(() => {
      const { serverMock, getHandler } = createServerMock();
      getUserInfoModule.register(serverMock, { jottyClient: testClient as JottyClient });
      handler = getHandler();
    });

    it("returns user info", async () => {
      const userInfo = { username: "testuser", email: "test@example.com", createdAt: new Date().toISOString() };
      (testClient.getUserInfo as sinon.SinonStub).resolves(userInfo);

      const response = await handler({ username: "testuser" });

      assert.deepStrictEqual(JSON.parse(response.content[0].text), userInfo);
    });
  });
});
