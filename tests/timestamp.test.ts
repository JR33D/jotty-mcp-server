import assert from "node:assert";
import { describe, it, beforeEach, afterEach } from "node:test";
import * as sinon from "sinon";
import timestampModule from "../src/resources/timestamp.js";
import type { ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";

describe("Timestamp Resource Unit Tests", () => {
  let sandbox: sinon.SinonSandbox;
  let resourceHandler: (uri: URL, params: { format?: string }) => {
    contents: Array<{ uri: string; mimeType: string; text: string }>;
  };
  const testDate = new Date("2023-10-27T10:00:00.000Z");

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    sandbox.useFakeTimers(testDate);

    const serverMock = {
      registerResource: (
        _name: string,
        _template: ResourceTemplate,
        _options: unknown,
        handler: typeof resourceHandler
      ) => {
        resourceHandler = handler;
      },
    };
    timestampModule.register(serverMock as never);
  });

  afterEach(() => {
    sandbox.restore();
  });

  // Helper to safely get first content item
  function firstContent(res: { contents?: Array<{ text: string }> }): { text: string } {
    if (res.contents == null || res.contents.length === 0) {
      throw new Error("Resource contents are empty");
    }
    return res.contents[0] as { text: string };
  }

  it("should return ISO 8601 formatted timestamp", () => {
    const res = resourceHandler(new URL("timestamp://iso"), { format: "iso" });
    const content = firstContent(res);
    assert.strictEqual(content.text, testDate.toISOString());
  });

  it("should return Unix timestamp", () => {
    const res = resourceHandler(new URL("timestamp://unix"), { format: "unix" });
    const content = firstContent(res);
    const expected = Math.floor(testDate.getTime() / 1000).toString();
    assert.strictEqual(content.text, expected);
  });

  it("should return human-readable timestamp", () => {
    const res = resourceHandler(new URL("timestamp://readable"), { format: "readable" });
    const content = firstContent(res);
    assert.strictEqual(content.text, testDate.toLocaleString());
  });

  it("should return friendly formatted timestamp", () => {
    const res = resourceHandler(new URL("timestamp://friendly"), { format: "friendly" });
    const content = firstContent(res);
    assert.strictEqual(content.text, "2023-10-27");
  });

  it("should handle unknown format gracefully", () => {
    const res = resourceHandler(new URL("timestamp://invalid"), { format: "invalid" });
    const content = firstContent(res);
    assert(content.text.includes("Unknown format: invalid"));
  });

  it("should handle missing format gracefully", () => {
    const res = resourceHandler(new URL("timestamp://"), { format: undefined });
    const content = firstContent(res);
    assert(content.text.includes("Format not specified"));
  });
});
