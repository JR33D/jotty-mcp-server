import assert from "node:assert";
import { describe, it, beforeEach } from "node:test";
import echoModule from "../src/tools/echo.js";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

describe("Echo Tool Unit Tests", () => {
  let echoHandler: (args: { text: string }) => { content: Array<{ type: string; text: string }> };

  beforeEach(() => {
    const serverMock = {
      tool: (_name: string, _description: string, _schema: unknown, handler: typeof echoHandler) => {
        echoHandler = handler;
      },
    } as McpServer;
    echoModule.register(serverMock);
  });

  it("should echo valid text", () => {
    const testText = "Hello, MCP!";
    const response = echoHandler({ text: testText });
    assert(response.content[0] != null);
    assert.strictEqual(response.content[0].text, testText);
  });

  it("should handle unicode and special characters", () => {
    const testText = "🚀 Unicode! Special chars: @#$%^&*() 日本語";
    const response = echoHandler({ text: testText });
    assert(response.content[0] != null);
    assert.strictEqual(response.content[0].text, testText);
  });

  it("should handle long text", () => {
    const testText = "Lorem ipsum ".repeat(100);
    const response = echoHandler({ text: testText });
    assert(response.content[0] != null);
    assert.strictEqual(response.content[0].text, testText);
  });
});
