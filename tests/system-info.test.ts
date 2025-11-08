import assert from "node:assert";
import { describe, it, beforeEach, afterEach } from "node:test";
import * as sinon from "sinon";
import systemInfoModule, { systemInfoHandler } from "../src/resources/system-info.js";
import type * as os from "os";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

describe("System Info Resource Unit Tests", () => {
  let sandbox: sinon.SinonSandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe("systemInfoHandler", () => {
    it("should return system info with valid JSON structure", () => {
      const mockSystemInfo = {
        platform: "test-platform",
        architecture: "test-arch",
        nodeVersion: "v20.0.0",
        uptime: 12345,
        totalMemory: 1024 * 1024 * 1024 * 8,
        freeMemory: 1024 * 1024 * 1024 * 4,
      };

      const mockOs = {
        platform: () => "test-platform" as NodeJS.Platform,
        arch: () => "test-arch" as NodeJS.Architecture,
        uptime: () => 12345,
        totalmem: () => 1024 * 1024 * 1024 * 8,
        freemem: () => 1024 * 1024 * 1024 * 4,
      } as typeof os;

      sandbox.stub(process, "version").value("v20.0.0");

      const response = systemInfoHandler(mockOs);
      const systemInfo = JSON.parse(response.contents[0].text);

      assert.deepStrictEqual(systemInfo, mockSystemInfo);
    });
  });

  describe("register", () => {
    it("should register the SystemMonitor resource", () => {
      const serverMock: McpServer = {
        registerResource: sandbox.stub(),
      } as unknown as McpServer;

      systemInfoModule.register(serverMock);

      assert(
        (serverMock.registerResource as sinon.SinonStub).calledOnceWith(
          "SystemMonitor",
          "system://SystemMonitor",
          sinon.match.object,
          sinon.match.func
        )
      );
    });
  });
});