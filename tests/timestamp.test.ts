import assert from "node:assert";
import { describe, it, beforeEach, afterEach } from "node:test";
import * as sinon from "sinon";
import timestampModule from "../src/resources/timestamp.js";
import type { ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";

describe("Timestamp Resource Unit Tests", () => {
  let sandbox: sinon.SinonSandbox;
  let resourceHandler: (uri: URL, params: { format: string | undefined }) => { contents: Array<{ uri: string; mimeType: string; text: string }> };
  const testDate = new Date("2023-10-27T10:00:00.000Z");

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    sandbox.useFakeTimers(testDate);

    const serverMock = {
      registerResource: (_name: string, _template: ResourceTemplate, _options: unknown, handler: typeof resourceHandler) => {
        resourceHandler = handler;
      },
    };
    timestampModule.register(serverMock as never);
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("should return ISO 8601 formatted timestamp", () => {
    const response = resourceHandler(new URL("timestamp://iso"), { format: "iso" });
    assert(response.contents[0] != null);
    assert.strictEqual(response.contents[0].text, testDate.toISOString());
  });

  it("should return Unix timestamp", () => {
    const response = resourceHandler(new URL("timestamp://unix"), { format: "unix" });
    const expectedTimestamp = Math.floor(testDate.getTime() / 1000).toString();
    assert(response.contents[0] != null);
    assert.strictEqual(response.contents[0].text, expectedTimestamp);
  });

  it("should return human-readable timestamp", () => {
    const response = resourceHandler(new URL("timestamp://readable"), { format: "readable" });
    assert(response.contents[0] != null);
    assert.strictEqual(response.contents[0].text, testDate.toLocaleString());
  });

  it("should return friendly formatted timestamp", () => {
    const response = resourceHandler(new URL("timestamp://friendly"), { format: "friendly" });
    assert(response.contents[0] != null);
    assert.strictEqual(response.contents[0].text, "2023-10-27");
  });

  it("should handle unknown format gracefully", () => {
    const response = resourceHandler(new URL("timestamp://invalid"), { format: "invalid" });
    assert(response.contents[0] != null);
    assert(response.contents[0].text.includes("Unknown format: invalid"));
  });

  it("should handle missing format gracefully", () => {
    const response = resourceHandler(new URL("timestamp://"), { format: undefined });
    assert(response.contents[0] != null);
    assert(response.contents[0].text.includes("Format not specified"));
  });
});