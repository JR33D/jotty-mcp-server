import assert from "node:assert";
import { describe, it, beforeEach } from "node:test";
import echoModule from "../src/tools/echo.js";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

// Define a generic type for the tool handler function
type ToolHandler = (
  params?: unknown
) => Promise<{ content: Array<{ text: string }> }>;

describe("Echo Tool Unit Tests", () => {
  let handler: ToolHandler;

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

  beforeEach(() => {
    const { serverMock, getHandler } = createServerMock();
    echoModule.register(serverMock);
    handler = getHandler();
  });

      it("should echo valid text", async () => {
      const testText = "Hello, MCP!";
      const response = await handler({ text: testText });
      assert.ok(response.content && response.content.length > 0, "Response content should not be empty");
      assert.ok(response.content[0]!.text, "Response content[0].text should exist");
      assert.strictEqual(response.content[0]!.text, testText);
    });
      it("should handle unicode and special characters", async () => {
      const testText = "🚀 Unicode! Special chars: @#$%^&*() 日本語";
      const response = await handler({ text: testText });
      assert.ok(response.content && response.content.length > 0, "Response content should not be empty");
      assert.ok(response.content[0]!.text, "Response content[0].text should exist");
      assert.strictEqual(response.content[0]!.text, testText);
    });
      it("should handle long text", async () => {
      const testText = "Lorem ipsum ".repeat(100);
      const response = await handler({ text: testText });
      assert.ok(response.content && response.content.length > 0, "Response content should not be empty");
      assert.ok(response.content[0]!.text, "Response content[0].text should exist");
      assert.strictEqual(response.content[0]!.text, testText);
    });
      it("should handle an empty string", async () => {
      const testText = "";
      const response = await handler({ text: testText });
      assert.ok(response.content && response.content.length > 0, "Response content should not be empty");
      assert.ok(response.content[0]!.text, "Response content[0].text should exist");
      assert.strictEqual(response.content[0]!.text, testText);
    });});
