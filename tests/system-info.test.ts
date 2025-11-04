import assert from "node:assert";
import { describe, it, beforeEach, afterEach } from "node:test";
import * as sinon from "sinon";
import { systemInfoHandler } from "../src/resources/system-info.js";
import type * as os from "os";

describe("System Info Resource Unit Tests", () => {
  let sandbox: sinon.SinonSandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

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
    assert(response.contents[0] != null);
    const systemInfo: { platform: string, architecture: string, nodeVersion: string, uptime: number, totalMemory: number, freeMemory: number } = JSON.parse(response.contents[0].text);

    assert.deepStrictEqual(systemInfo, mockSystemInfo);
  });
});